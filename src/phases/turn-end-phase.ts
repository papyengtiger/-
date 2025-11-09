import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { TerrainType } from "#data/terrain";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { WeatherType } from "#enums/weather-type";
import { TurnEndEvent } from "#events/battle-scene";
import type { Pokemon } from "#field/pokemon";
import {
  EnemyStatusEffectHealChanceModifier,
  EnemyTurnHealModifier,
  TurnHealModifier,
  TurnHeldItemTransferModifier,
  TurnStatusEffectModifier,
  MoodyItemModifier,
  WishingStarModifier,
  WeatherRockTrainerModifier,
  TerrainSeedTrainerModifier
} from "#modifiers/modifier";
import { FieldPhase } from "#phases/field-phase";
import i18next from "i18next";
import { type BattleStat, EFFECTIVE_STATS } from "#enums/stat";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";

export class TurnEndPhase extends FieldPhase {
  start() {
    super.start();

    globalScene.currentBattle.incrementTurn();
    globalScene.eventTarget.dispatchEvent(new TurnEndEvent(globalScene.currentBattle.turn));

    // 몬스터소굴 턴 카운트 증가
    if (globalScene.isMonsterHouseActive && globalScene.monsterHouseData) {
      globalScene.monsterHouseData.turnCount++;
    }

    globalScene.phaseManager.hideAbilityBar();

    const handlePokemon = (pokemon: Pokemon) => {
      if (!pokemon.switchOutStatus) {
        pokemon.lapseTags(BattlerTagLapseType.TURN_END);

        globalScene.applyModifiers(TurnHealModifier, pokemon.isPlayer(), pokemon);

        // ✅ 그래시 필드 회복 효과
        if (globalScene.arena.terrain?.terrainType === TerrainType.GRASSY && pokemon.isGrounded()) {
          globalScene.phaseManager.unshiftNew(
            "PokemonHealPhase",
            pokemon.getBattlerIndex(),
            Math.max(pokemon.getMaxHp() >> 4, 1),
            i18next.t("battle:turnEndHpRestore", {
              pokemonName: getPokemonNameWithAffix(pokemon),
            }),
            true,
          );
        }

        // ✅ 적 포켓몬용 회복 / 상태이상 회복 처리
        if (!pokemon.isPlayer()) {
          globalScene.applyModifiers(EnemyTurnHealModifier, false, pokemon);
          globalScene.applyModifier(EnemyStatusEffectHealChanceModifier, false, pokemon);
        }

        applyAbAttrs("PostTurnAbAttr", { pokemon });

        // ✅ Wishing Star 처리
        const wishingStarMods = globalScene.getModifiers(WishingStarModifier);
        for (const mod of wishingStarMods) {
          const poke = mod.getPokemon();
          if (!poke || !poke.isOnField()) continue;

          if (mod.isForbiddenSpecies(poke)) {
            console.log(`[WishingStar] 금지된 종 ${poke.name} 발견, 모디파이어 강제 제거`);
            globalScene.removeModifier(mod);
            continue;
          }

          mod.lapse();
        }
      }

      globalScene.applyModifiers(TurnStatusEffectModifier, pokemon.isPlayer(), pokemon);
      globalScene.applyModifiers(TurnHeldItemTransferModifier, pokemon.isPlayer(), pokemon);

      // ✅ MoodyItemModifier 처리
      const existingMoodyModifier = globalScene
        .getModifiers(MoodyItemModifier)
        .find(mod => mod.pokemonId === pokemon.id);

      const hasMoodyItem =
        existingMoodyModifier ||
        (pokemon.isPlayer() &&
          (globalScene.applyModifier(MoodyItemModifier, this.player, pokemon) as MoodyItemModifier | null));

      if (hasMoodyItem) {
        const protectedStats: BattleStat[] = [];

        const canRaise = EFFECTIVE_STATS.filter(s => pokemon.getStatStage(s) < 6 && !protectedStats.includes(s));
        let canLower = EFFECTIVE_STATS.filter(s => s !== canRaise[0] && pokemon.getStatStage(s) > -6);

        if (canRaise.length > 0) {
          const raisedStat = canRaise[pokemon.randBattleSeedInt(canRaise.length)];
          canLower = canLower.filter(s => s !== raisedStat);
          globalScene.phaseManager.unshiftPhase(
            new StatStageChangePhase(pokemon.getBattlerIndex(), true, [raisedStat], 2)
          );
        }

        if (canLower.length > 0) {
          const loweredStat = canLower[pokemon.randBattleSeedInt(canLower.length)];
          globalScene.phaseManager.unshiftPhase(
            new StatStageChangePhase(pokemon.getBattlerIndex(), true, [loweredStat], -1)
          );
        }

        globalScene.applyModifiers(MoodyItemModifier, pokemon.isPlayer(), pokemon);
      }

      pokemon.tempSummonData.turnCount++;
      pokemon.tempSummonData.waveTurnCount++;
    };

    this.executeForAll(handlePokemon);

    globalScene.arena.lapseTags();

    // ✅ 트레이너 락 여부 확인
    const hasTrainerWeatherLock = globalScene
      .getModifiers(WeatherRockTrainerModifier, true)
      .some(m => m instanceof WeatherRockTrainerModifier);

    const hasTrainerTerrainLock = globalScene
      .getModifiers(TerrainSeedTrainerModifier, true)
      .some(m => m instanceof TerrainSeedTrainerModifier);

    // ✅ 기본 lapse()는 트레이너 락이 없을 때만 실행
    if (!hasTrainerTerrainLock && globalScene.arena.terrain && !globalScene.arena.terrain.lapse()) {
      globalScene.arena.trySetTerrain(TerrainType.NONE);
    }

    if (!hasTrainerWeatherLock && globalScene.arena.weather && !globalScene.arena.weather.lapse()) {
      globalScene.arena.trySetWeather(WeatherType.NONE);
    }

    // ✅ 트레이너 락(WeatherRockTrainerModifier / TerrainSeedTrainerModifier) 턴 처리
    const weatherMods = globalScene
      .getModifiers(WeatherRockTrainerModifier, true)
      .filter(m => m instanceof WeatherRockTrainerModifier) as WeatherRockTrainerModifier[];
    const terrainMods = globalScene
      .getModifiers(TerrainSeedTrainerModifier, true)
      .filter(m => m instanceof TerrainSeedTrainerModifier) as TerrainSeedTrainerModifier[];

    for (const mod of weatherMods) mod.onTurnEnd();
    for (const mod of terrainMods) mod.onTurnEnd();

    this.end();
  }
}
