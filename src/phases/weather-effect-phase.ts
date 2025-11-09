import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import type { Weather } from "#data/weather";
import { getWeatherDamageMessage, getWeatherLapseMessage } from "#data/weather";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import { CommonAnim } from "#enums/move-anims-common";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import { CommonAnimPhase } from "#phases/common-anim-phase";
import { BooleanHolder, toDmgValue } from "#utils/common";
import { OvercoatModifier, IgnoreWeatherEffectsItemModifier } from "#app/modifier/modifier";

export class WeatherEffectPhase extends CommonAnimPhase {
  public weather: Weather | null;

  constructor() {
    super(
      undefined,
      undefined,
      CommonAnim.SUNNY + ((globalScene?.arena?.weather?.weatherType || WeatherType.NONE) - 1),
    );
    this.weather = globalScene?.arena?.weather;
  }

  start() {
    // Update weather state with any changes that occurred during the turn
    this.weather = globalScene?.arena?.weather;

    if (!this.weather) {
      this.end();
      return;
    }

    this.setAnimation(CommonAnim.SUNNY + (this.weather.weatherType - 1));

    if (this.weather.isDamaging()) {
      const cancelled = new BooleanHolder(false);

      // Apply pre-weather effect attributes to cancel effects if needed
      this.executeForAll((pokemon: Pokemon) =>
        applyAbAttrs("SuppressWeatherEffectAbAttr", { pokemon, weather: this.weather, cancelled }),
      );

      if (!cancelled.value) {
        const inflictDamage = (pokemon: Pokemon) => {
          const currentWeatherType = this.weather.weatherType;

          const hasSafetyGoggles = globalScene.getModifiers(OvercoatModifier).find(mod => mod.pokemonId === pokemon.id);

          const hasIgnoreWeatherEffectItem = globalScene
            .getModifiers(IgnoreWeatherEffectsItemModifier)
            .some(mod => mod.pokemonId === pokemon.id);

          if (hasSafetyGoggles || hasIgnoreWeatherEffectItem) {
            console.log("Weather immunity item active. No weather damage.");
            return;
          }

          if ([WeatherType.HAIL, WeatherType.SANDSTORM].includes(currentWeatherType)) {
            console.log("Weather type matches. Applying weather damage.");
            const damage = toDmgValue(pokemon.getMaxHp() / 16);
            globalScene.phaseManager.queueMessage(getWeatherDamageMessage(this.weather?.weatherType!, pokemon)!);
            pokemon.damageAndUpdate(damage, HitResult.EFFECTIVE, false, false, true);
          }
        };

        // Apply damage to all Pokémon affected by weather
        this.executeForAll((pokemon: Pokemon) => {
          const immune =
            !pokemon ||
            !!pokemon.getTypes(true, true).filter(t => this.weather?.isTypeDamageImmune(t)).length ||
            pokemon.switchOutStatus;
          if (!immune) {
            inflictDamage(pokemon);
          }
        });
      }
    }

    globalScene.ui.showText(getWeatherLapseMessage(this.weather.weatherType) ?? "", null, () => {
      this.executeForAll((pokemon: Pokemon) => {
        if (!pokemon.switchOutStatus) {
          applyAbAttrs("PostWeatherLapseAbAttr", { pokemon, weather: this.weather });
        }
      });

      super.start();
    });
  }
}
