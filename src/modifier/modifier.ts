import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import Overrides from "#app/overrides";
import {
  allMoves,
  RecoilAttr,
  MultiHitAttr,
  NeutralDamageAgainstFlyingTypeMultiplierAttr,
  InstantChargeAttr,
  MissEffectAttr,
} from "#app/data/moves/move";
import { FusionSpeciesFormEvolution, pokemonEvolutions } from "#balance/pokemon-evolutions";
import { FRIENDSHIP_GAIN_FROM_RARE_CANDY } from "#balance/starters";
import { getBerryEffectFunc, getBerryPredicate } from "#data/berry";
import { allMoves, modifierTypes } from "#data/data-lists";
import { getLevelTotalExp } from "#data/exp";
import { SpeciesFormChangeItemTrigger } from "#data/form-change-triggers";
import { MAX_PER_TYPE_POKEBALLS } from "#data/pokeball";
import { getStatusEffectHealText } from "#data/status-effect";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BerryType } from "#enums/berry-type";
import { Color, ShadowColor } from "#enums/color";
import { Command } from "#enums/command";
import type { FormChangeItem } from "#enums/form-change-item";
import { LearnMoveType } from "#enums/learn-move-type";
import type { MoveId } from "#enums/move-id";
import type { Nature } from "#enums/nature";
import type { PokeballType } from "#enums/pokeball";
import type { PokemonType } from "#enums/pokemon-type";
import { PokemonType } from "#enums/pokemon-type";
import { SpeciesId } from "#enums/species-id";
import { BATTLE_STATS, type PermanentStat, Stat, TEMP_BATTLE_STATS, type TempBattleStat, EFFECTIVE_STATS, type BattleStat, Stat } from "#enums/stat";
import type { BattleStat, EffectiveStat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { TextStyle } from "#enums/text-style";
import type { PlayerPokemon, Pokemon } from "#field/pokemon";
import type {
  DoubleBattleChanceBoosterModifierType,
  EvolutionItemModifierType,
  FormChangeItemModifierType,
  ModifierOverride,
  ModifierType,
  PokemonBaseStatTotalModifierType,
  PokemonExpBoosterModifierType,
  PokemonFriendshipBoosterModifierType,
  PokemonMoveAccuracyBoosterModifierType,
  PokemonMultiHitModifierType,
  TerastallizeModifierType,
  TmModifierType,
  ModifierTypeGenerator,
} from "#modifiers/modifier-type";
import type { VoucherType } from "#system/voucher";
import type { ModifierInstanceMap, ModifierString } from "#types/modifier-types";
import { addTextObject } from "#ui/text";
import { BooleanHolder, hslToHex, isNullOrUndefined, NumberHolder, randSeedFloat, toDmgValue } from "#utils/common";
import { getModifierType } from "#utils/modifier-utils";
import i18next from "i18next";
import { ChangeAbilityPhase, type ChangeAbilityType } from "#app/phases/change-ability-phase";
import { RegisterAbilityPhase, type RegisterAbilityType } from "#app/phases/register-ability-phase";
import { zmovesSpecies } from "#app/data/balance/zmoves";
import { maxmovesSpecies } from "#app/data/balance/trs";
import { SpeciesFormKey } from "#enums/species-form-key";
import {
  CommanderAbAttr,
  MoveAbilityBypassAbAttr,
  IgnoreOpponentStatStagesAbAttr,
  PreventBerryUseAbAttr,
  FieldPreventExplosiveMovesAbAttr,
  FieldPriorityMoveImmunityAbAttr,
  MoveEffectChanceMultiplierAbAttr,
  IgnoreTypeImmunityAbAttr,
  MovePowerBoostAbAttr,
  StatStageChangeMultiplierAbAttr,
  PreApplyBattlerTagImmunityAbAttr,
  StabBoostAbAttr,
  MoveImmunityAbAttr,
  PreApplyBattlerTagAbAttr,
  PreDefendAbAttr,
  ReceivedMoveDamageMultiplierAbAttr,
  BoostEnergyTagAttr,
  UserFieldBattlerTagImmunityAbAttr,
  BlockCritAbAttr
} from "#app/data/abilities/ability";
import { AbilityId } from "#enums/ability-id";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import {getStatKey, PERMANENT_STATS} from "/src/enums/stat";
import { MoveFlags } from "#enums/move-flags";
import { MoveFlags2 } from "#enums/move-flags-2";
import { HitResult } from "#enums/hit-result";
import { MoveCategory } from "#enums/move-category";
import { Pokemon } from "#app/field/pokemon";;
import { isVirtual, MoveUseMode } from "#enums/move-use-mode";
import { applyMoveAttrs } from "#moves/apply-attrs";
import type { Move } from "#moves/move";
import { WeatherType } from "#app/enums/weather-type";
import { TerrainType } from "#data/terrain";

export type ModifierPredicate = (modifier: Modifier) => boolean;

const iconOverflowIndex = 24;

export const modifierSortFunc = (a: Modifier, b: Modifier): number => {
  const itemNameMatch = a.type.name.localeCompare(b.type.name);
  const typeNameMatch = a.constructor.name.localeCompare(b.constructor.name);
  const aId = a instanceof PokemonHeldItemModifier ? a.pokemonId : -1;
  const bId = b instanceof PokemonHeldItemModifier ? b.pokemonId : -1;

  // First sort by pokemon ID, then by item type and then name
  return aId - bId || typeNameMatch || itemNameMatch;
};

export class ModifierBar extends Phaser.GameObjects.Container {
  private player: boolean;
  private modifierCache: PersistentModifier[];

  constructor(enemy?: boolean) {
    super(globalScene, 1 + (enemy ? 302 : 0), 2);

    this.player = !enemy;
    this.setScale(0.5);
  }

  /**
   * Method to update content displayed in {@linkcode ModifierBar}
   * @param {PersistentModifier[]} modifiers - The list of modifiers to be displayed in the {@linkcode ModifierBar}
   * @param {boolean} hideHeldItems - If set to "true", only modifiers not assigned to a Pokémon are displayed
   */
  updateModifiers(modifiers: PersistentModifier[], hideHeldItems = false) {
    this.removeAll(true);

    const visibleIconModifiers = modifiers.filter(m => m.isIconVisible());
    const nonPokemonSpecificModifiers = visibleIconModifiers
      .filter(m => !(m as PokemonHeldItemModifier).pokemonId)
      .sort(modifierSortFunc);
    const pokemonSpecificModifiers = visibleIconModifiers
      .filter(m => (m as PokemonHeldItemModifier).pokemonId)
      .sort(modifierSortFunc);

    const sortedVisibleIconModifiers = hideHeldItems
      ? nonPokemonSpecificModifiers
      : nonPokemonSpecificModifiers.concat(pokemonSpecificModifiers);

    sortedVisibleIconModifiers.forEach((modifier: PersistentModifier, i: number) => {
      const icon = modifier.getIcon();
      if (i >= iconOverflowIndex) {
        icon.setVisible(false);
      }
      this.add(icon);
      this.setModifierIconPosition(icon, sortedVisibleIconModifiers.length);
      icon.setInteractive(new Phaser.Geom.Rectangle(0, 0, 32, 24), Phaser.Geom.Rectangle.Contains);
      icon.on("pointerover", () => {
        globalScene.ui.showTooltip(modifier.type.name, modifier.type.getDescription());
        if (this.modifierCache && this.modifierCache.length > iconOverflowIndex) {
          this.updateModifierOverflowVisibility(true);
        }
      });
      icon.on("pointerout", () => {
        globalScene.ui.hideTooltip();
        if (this.modifierCache && this.modifierCache.length > iconOverflowIndex) {
          this.updateModifierOverflowVisibility(false);
        }
      });
    });

    for (const icon of this.getAll()) {
      this.sendToBack(icon);
    }

    this.modifierCache = modifiers;
  }

  updateModifierOverflowVisibility(ignoreLimit: boolean) {
    const modifierIcons = this.getAll().reverse() as Phaser.GameObjects.Container[];
    for (const modifier of modifierIcons.slice(iconOverflowIndex)) {
      modifier.setVisible(ignoreLimit);
    }
  }

  setModifierIconPosition(icon: Phaser.GameObjects.Container, modifierCount: number) {
    const rowIcons: number = 12 + 6 * Math.max(Math.ceil(Math.min(modifierCount, 24) / 12) - 2, 0);

    const x = ((this.getIndex(icon) % rowIcons) * 26) / (rowIcons / 12);
    const y = Math.floor(this.getIndex(icon) / rowIcons) * 20;

    icon.setPosition(this.player ? x : -x, y);
  }
}

export abstract class Modifier {
  public type: ModifierType;

  constructor(type: ModifierType) {
    this.type = type;
  }

  /**
   * Return whether this modifier is of the given class
   *
   * @remarks
   * Used to avoid requiring the caller to have imported the specific modifier class, avoiding circular dependencies.
   *
   * @param modifier - The modifier to check against
   * @returns Whether the modiifer is an instance of the given type
   */
  public is<T extends ModifierString>(modifier: T): this is ModifierInstanceMap[T] {
    const targetModifier = ModifierClassMap[modifier];
    if (!targetModifier) {
      return false;
    }
    return this instanceof targetModifier;
  }

  match(_modifier: Modifier): boolean {
    return false;
  }

  /**
   * Checks if {@linkcode Modifier} should be applied
   * @param _args parameters passed to {@linkcode Modifier.apply}
   * @returns always `true` by default
   */
  shouldApply(..._args: Parameters<this["apply"]>): boolean {
    return true;
  }

  /**
   * Handles applying of {@linkcode Modifier}
   * @param args collection of all passed parameters
   */
  abstract apply(...args: unknown[]): boolean;
}

export abstract class PersistentModifier extends Modifier {
  public stackCount: number;
  public virtualStackCount: number;

  /** This field does not exist at runtime and must not be used.
   * Its sole purpose is to ensure that typescript is able to properly narrow when the `is` method is called.
   */
  private declare _: never;

  constructor(type: ModifierType, stackCount = 1) {
    super(type);
    this.stackCount = stackCount;
    this.virtualStackCount = 0;
  }

  add(modifiers: PersistentModifier[], virtual: boolean): boolean {
    for (const modifier of modifiers) {
      if (this.match(modifier)) {
        return modifier.incrementStack(this.stackCount, virtual);
      }
    }

    if (virtual) {
      this.virtualStackCount += this.stackCount;
      this.stackCount = 0;
    }
    modifiers.push(this);
    return true;
  }

  abstract clone(): PersistentModifier;

  getArgs(): any[] {
    return [];
  }

  incrementStack(amount: number, virtual: boolean): boolean {
    if (this.getStackCount() + amount <= this.getMaxStackCount()) {
      if (!virtual) {
        this.stackCount += amount;
      } else {
        this.virtualStackCount += amount;
      }
      return true;
    }

    return false;
  }

  getStackCount(): number {
    return this.stackCount + this.virtualStackCount;
  }

  abstract getMaxStackCount(forThreshold?: boolean): number;

  getCountUnderMax(): number {
    return this.getMaxStackCount() - this.getStackCount();
  }

  isIconVisible(): boolean {
    return true;
  }

  getIcon(_forSummary?: boolean): Phaser.GameObjects.Container {
    const container = globalScene.add.container(0, 0);

    const item = globalScene.add.sprite(0, 12, "items");
    item.setFrame(this.type.iconImage);
    item.setOrigin(0, 0.5);
    container.add(item);

    const stackText = this.getIconStackText();
    if (stackText) {
      container.add(stackText);
    }

    const virtualStackText = this.getIconStackText(true);
    if (virtualStackText) {
      container.add(virtualStackText);
    }

    return container;
  }

  getIconStackText(virtual?: boolean): Phaser.GameObjects.BitmapText | null {
    if (this.getMaxStackCount() === 1 || (virtual && !this.virtualStackCount)) {
      return null;
    }

    const text = globalScene.add.bitmapText(10, 15, "item-count", this.stackCount.toString(), 11);
    text.letterSpacing = -0.5;
    if (this.getStackCount() >= this.getMaxStackCount()) {
      text.setTint(0xf89890);
    }
    text.setOrigin(0, 0);

    return text;
  }
}

export abstract class ConsumableModifier extends Modifier {
  add(_modifiers: Modifier[]): boolean {
    return true;
  }
}

export class AddPokeballModifier extends ConsumableModifier {
  private pokeballType: PokeballType;
  private count: number;

  constructor(type: ModifierType, pokeballType: PokeballType, count: number) {
    super(type);

    this.pokeballType = pokeballType;
    this.count = count;
  }

  /**
   * Applies {@linkcode AddPokeballModifier}
   * @param battleScene {@linkcode BattleScene}
   * @returns always `true`
   */
  override apply(): boolean {
    const pokeballCounts = globalScene.pokeballCounts;
    pokeballCounts[this.pokeballType] = Math.min(
      pokeballCounts[this.pokeballType] + this.count,
      MAX_PER_TYPE_POKEBALLS,
    );

    return true;
  }
}

export class AddVoucherModifier extends ConsumableModifier {
  private voucherType: VoucherType;
  private count: number;

  constructor(type: ModifierType, voucherType: VoucherType, count: number) {
    super(type);

    this.voucherType = voucherType;
    this.count = count;
  }

  /**
   * Applies {@linkcode AddVoucherModifier}
   * @param battleScene {@linkcode BattleScene}
   * @returns always `true`
   */
  override apply(): boolean {
    const voucherCounts = globalScene.gameData.voucherCounts;
    voucherCounts[this.voucherType] += this.count;

    return true;
  }
}

/**
 * Modifier used for party-wide or passive items that start an initial
 * {@linkcode battleCount} equal to {@linkcode maxBattles} that, for every
 * battle, decrements. Typically, when {@linkcode battleCount} reaches 0, the
 * modifier will be removed. If a modifier of the same type is to be added, it
 * will reset {@linkcode battleCount} back to {@linkcode maxBattles} of the
 * existing modifier instead of adding that modifier directly.
 * @extends PersistentModifier
 * @abstract
 * @see {@linkcode add}
 */
export abstract class LapsingPersistentModifier extends PersistentModifier {
  /** The maximum amount of battles the modifier will exist for */
  private maxBattles: number;
  /** The current amount of battles the modifier will exist for */
  private battleCount: number;

  constructor(type: ModifierType, maxBattles: number, battleCount?: number, stackCount?: number) {
    super(type, stackCount);

    this.maxBattles = maxBattles;
    this.battleCount = battleCount ?? this.maxBattles;
  }

  /**
   * Goes through existing modifiers for any that match the selected modifier,
   * which will then either add it to the existing modifiers if none were found
   * or, if one was found, it will refresh {@linkcode battleCount}.
   * @param modifiers {@linkcode PersistentModifier} array of the player's modifiers
   * @param _virtual N/A
   * @param _scene N/A
   * @returns `true` if the modifier was successfully added or applied, false otherwise
   */
  add(modifiers: PersistentModifier[], _virtual: boolean): boolean {
    for (const modifier of modifiers) {
      if (this.match(modifier)) {
        const modifierInstance = modifier as LapsingPersistentModifier;
        if (modifierInstance.getBattleCount() < modifierInstance.getMaxBattles()) {
          modifierInstance.resetBattleCount();
          globalScene.playSound("se/restore");
          return true;
        }
        // should never get here
        return false;
      }
    }

    modifiers.push(this);
    return true;
  }

  /**
   * Lapses the {@linkcode battleCount} by 1.
   * @param _args passed arguments (not in use here)
   * @returns `true` if the {@linkcode battleCount} is greater than 0
   */
  public lapse(..._args: unknown[]): boolean {
    this.battleCount--;
    return this.battleCount > 0;
  }

  getIcon(): Phaser.GameObjects.Container {
    const container = super.getIcon();

    // Linear interpolation on hue
    const hue = Math.floor(120 * (this.battleCount / this.maxBattles) + 5);

    // Generates the color hex code with a constant saturation and lightness but varying hue
    const typeHex = hslToHex(hue, 0.5, 0.9);
    const strokeHex = hslToHex(hue, 0.7, 0.3);

    const battleCountText = addTextObject(27, 0, this.battleCount.toString(), TextStyle.PARTY, {
      fontSize: "66px",
      color: typeHex,
    });
    battleCountText.setShadow(0, 0);
    battleCountText.setStroke(strokeHex, 16);
    battleCountText.setOrigin(1, 0);
    container.add(battleCountText);

    return container;
  }

  getIconStackText(_virtual?: boolean): Phaser.GameObjects.BitmapText | null {
    return null;
  }

  getBattleCount(): number {
    return this.battleCount;
  }

  resetBattleCount(): void {
    this.battleCount = this.maxBattles;
  }

  /**
   * Updates an existing modifier with a new `maxBattles` and `battleCount`.
   */
  setNewBattleCount(count: number): void {
    this.maxBattles = count;
    this.battleCount = count;
  }

  getMaxBattles(): number {
    return this.maxBattles;
  }

  getArgs(): any[] {
    return [this.maxBattles, this.battleCount];
  }

  getMaxStackCount(_forThreshold?: boolean): number {
    // Must be an abitrary number greater than 1
    return 2;
  }
}

/**
 * Modifier used for passive items, specifically lures, that
 * temporarily increases the chance of a double battle.
 * @extends LapsingPersistentModifier
 * @see {@linkcode apply}
 */
export class DoubleBattleChanceBoosterModifier extends LapsingPersistentModifier {
  public declare type: DoubleBattleChanceBoosterModifierType;

  match(modifier: Modifier): boolean {
    return modifier instanceof DoubleBattleChanceBoosterModifier && modifier.getMaxBattles() === this.getMaxBattles();
  }

  clone(): DoubleBattleChanceBoosterModifier {
    return new DoubleBattleChanceBoosterModifier(
      this.type,
      this.getMaxBattles(),
      this.getBattleCount(),
      this.stackCount,
    );
  }

  /**
   * Increases the chance of a double battle occurring
   * @param doubleBattleChance {@linkcode NumberHolder} for double battle chance
   * @returns true
   */
  override apply(doubleBattleChance: NumberHolder): boolean {
    // This is divided because the chance is generated as a number from 0 to doubleBattleChance.value using randSeedInt
    // A double battle will initiate if the generated number is 0
    doubleBattleChance.value = doubleBattleChance.value / 4;

    return true;
  }
}

export class WeatherRockTrainerModifier extends LapsingPersistentModifier {
  private readonly weatherType: WeatherType;
  private readonly duration: number;
  private remainingTurns: number;

  constructor(
    type: ModifierType,
    weatherType: WeatherType,
    duration: number = 10,
    battleCount?: number,
    stackCount?: number,
    remainingTurns: number = 10 // 🟢 기본 10턴
  ) {
    super(type, duration, battleCount, stackCount);
    this.weatherType = weatherType;
    this.duration = duration;
    this.remainingTurns = remainingTurns;
  }

  getRemainingTurns(): number {
    return this.remainingTurns;
  }

  setRemainingTurns(turns: number): void {
    this.remainingTurns = Math.max(turns, 0);
  }

  override match(modifier: Modifier): boolean {
    return modifier instanceof WeatherRockTrainerModifier && modifier.weatherType === this.weatherType;
  }

  override clone(): WeatherRockTrainerModifier {
    return new WeatherRockTrainerModifier(
      this.type,
      this.weatherType,
      this.getMaxBattles(),
      this.getBattleCount(),
      this.stackCount,
      this.remainingTurns
    );
  }

  override getArgs(): any[] {
    return [this.weatherType, this.getMaxBattles(), this.getBattleCount(), this.stackCount, this.remainingTurns];
  }

  /** ✅ 전투 시작 시 날씨 설정 */
  override onBattleStart(): void {
    const arena = globalScene.arena;
    if (!arena) return;

    const trainerPokemon = globalScene.getPlayerParty()?.[0];
    const currentWeather = arena.weather?.weatherType ?? WeatherType.NONE;
    const turnsLeft = arena.weather?.turnsLeft ?? 0;

    // ✅ 이미 같은 날씨가 유지 중이면 다시 설정하지 않음
    if (currentWeather === this.weatherType && turnsLeft > 0) {
      console.log(`[WeatherRockTrainerModifier] ${WeatherType[this.weatherType]} 이미 유지 중 (남은 턴: ${turnsLeft}) → 스킵`);
      return;
    }

    if (arena.weather?.isImmutable?.()) return;

    const success = arena.trySetWeather(this.weatherType, trainerPokemon);
    if (success && arena.weather) {
      // ✅ 이전 저장된 턴이 있다면 그대로 복원
      if (this.remainingTurns > 0 && this.remainingTurns < this.duration) {
        arena.weather.turnsLeft = this.remainingTurns;
        console.log(`[WeatherRockTrainerModifier] ${WeatherType[this.weatherType]} 재적용 (남은 턴: ${this.remainingTurns})`);
      } else {
        // 새로 설정할 때만 초기화
        arena.weather.turnsLeft = this.duration;
        this.remainingTurns = this.duration;
        console.log(`[WeatherRockTrainerModifier] ${WeatherType[this.weatherType]} 새로 설정됨 (${this.duration}턴)`);
      }

      const msg = i18next.t("modifier:weatherRockTrainerApply", {
        pokemonNameWithAffix: getPokemonNameWithAffix(trainerPokemon),
        weatherName: WeatherType[this.weatherType],
        turns: arena.weather.turnsLeft,
      });
      globalScene.phaseManager.queueMessage(msg);
    }
  }

  /** ✅ 턴 종료 시 자동으로 턴 수 감소 및 종료 처리 */
  override onTurnEnd(): void {
    const arena = globalScene.arena;
    if (!arena?.weather || arena.weather.weatherType !== this.weatherType) return;

    // 🔹 턴 감소
    if (arena.weather.turnsLeft > 0) {
      arena.weather.turnsLeft--;
      this.remainingTurns = arena.weather.turnsLeft; // 🟢 남은 턴 저장
    }

    console.log(`[WeatherRockTrainerModifier] ${WeatherType[this.weatherType]} 남은 턴: ${arena.weather.turnsLeft}`);

    // 🔹 날씨 종료 처리
    if (arena.weather.turnsLeft <= 0) {
      const weatherName = WeatherType[this.weatherType];
      console.log(`[WeatherRockTrainerModifier] ${weatherName} 종료 → 날씨 초기화 및 Modifier 제거`);

      const endMessages: Record<WeatherType, string> = {
        [WeatherType.SUNNY]: i18next.t("weather:sunnyEndMessage"),
        [WeatherType.RAIN]: i18next.t("weather:rainEndMessage"),
        [WeatherType.SANDSTORM]: i18next.t("weather:sandstormEndMessage"),
        [WeatherType.SNOW]: i18next.t("weather:snowEndMessage"),
        [WeatherType.NONE]: "",
      };

      const msg = endMessages[this.weatherType] ?? "";
      if (msg) globalScene.phaseManager.queueMessage(msg);

      // 🔹 날씨 해제 및 완전 제거
      arena.trySetWeather(WeatherType.NONE);
      globalScene.removeModifier(this, true);
    }
  }

  override getMaxStackCount(): number {
    return 1;
  }
}

export class TerrainSeedTrainerModifier extends LapsingPersistentModifier {
  private readonly terrainType: TerrainType;
  private readonly duration: number;
  private remainingTurns: number;

  constructor(
    type: ModifierType,
    terrainType: TerrainType,
    duration: number = 10,
    battleCount?: number,
    stackCount?: number,
    remainingTurns: number = 10 // 🟢 기본 10턴
  ) {
    super(type, duration, battleCount, stackCount);
    this.terrainType = terrainType;
    this.duration = duration;
    this.remainingTurns = remainingTurns;
  }

  getRemainingTurns(): number {
    return this.remainingTurns;
  }

  setRemainingTurns(turns: number): void {
    this.remainingTurns = Math.max(turns, 0);
  }

  override match(modifier: Modifier): boolean {
    return modifier instanceof TerrainSeedTrainerModifier && modifier.terrainType === this.terrainType;
  }

  override clone(): TerrainSeedTrainerModifier {
    return new TerrainSeedTrainerModifier(
      this.type,
      this.terrainType,
      this.getMaxBattles(),
      this.getBattleCount(),
      this.stackCount,
      this.remainingTurns
    );
  }

  override getArgs(): any[] {
    return [this.terrainType, this.getMaxBattles(), this.getBattleCount(), this.stackCount, this.remainingTurns];
  }

  /** ✅ 전투 시작 시 필드 설정 */
  override onBattleStart(): void {
    const arena = globalScene.arena;
    if (!arena) return;

    const trainerPokemon = globalScene.getPlayerParty()?.[0];
    const currentTerrain = arena.terrain?.terrainType ?? TerrainType.NONE;
    const turnsLeft = arena.terrain?.turnsLeft ?? 0;

    // ✅ 이미 같은 필드가 유지 중이면 다시 설정하지 않음
    if (currentTerrain === this.terrainType && turnsLeft > 0) {
      console.log(`[TerrainSeedTrainerModifier] ${TerrainType[this.terrainType]} 이미 유지 중 (남은 턴: ${turnsLeft}) → 스킵`);
      return;
    }

    const success = arena.trySetTerrain(this.terrainType, trainerPokemon);
    if (success && arena.terrain) {
      // ✅ 이전 저장된 턴 복원
      if (this.remainingTurns > 0 && this.remainingTurns < this.duration) {
        arena.terrain.turnsLeft = this.duration; // 강제 10턴
  this.remainingTurns = this.duration;
        console.log(`[TerrainSeedTrainerModifier] ${TerrainType[this.terrainType]} 재적용 (남은 턴: ${this.remainingTurns})`);
      } else {
        arena.terrain.turnsLeft = this.duration;
        this.remainingTurns = this.duration;
        console.log(`[TerrainSeedTrainerModifier] ${TerrainType[this.terrainType]} 새로 설정됨 (${this.duration}턴)`);
      }

      const msg = i18next.t("modifier:terrainRockTrainerApply", {
        pokemonNameWithAffix: getPokemonNameWithAffix(trainerPokemon),
        terrainName: TerrainType[this.terrainType],
        turns: arena.terrain.turnsLeft,
      });
      globalScene.phaseManager.queueMessage(msg);
    }
  }

  /** ✅ 턴 종료 시 자동 감소 및 해제 처리 */
  override onTurnEnd(): void {
    const arena = globalScene.arena;
    if (!arena?.terrain || arena.terrain.terrainType !== this.terrainType) return;

    if (arena.terrain.turnsLeft > 0) {
      arena.terrain.turnsLeft--;
      this.remainingTurns = arena.terrain.turnsLeft;
    }

    console.log(`[TerrainSeedTrainerModifier] ${TerrainType[this.terrainType]} 남은 턴: ${arena.terrain.turnsLeft}`);

    if (arena.terrain.turnsLeft <= 0) {
  const terrainName = TerrainType[this.terrainType];
  console.log(`[TerrainSeedTrainerModifier] ${terrainName} 종료 → 필드 초기화 및 Modifier 제거`);

  const endMessages: Record<TerrainType, string> = {
    [TerrainType.MISTY]: i18next.t("terrain:mistyEndMessage"),
    [TerrainType.ELECTRIC]: i18next.t("terrain:electricEndMessage"),
    [TerrainType.GRASSY]: i18next.t("terrain:grassyEndMessage"),
    [TerrainType.PSYCHIC]: i18next.t("terrain:psychicEndMessage"),
    [TerrainType.NONE]: "",
  };

  const msg = endMessages[this.terrainType] ?? "";
  if (msg) globalScene.phaseManager.queueMessage(msg);

  // 🔹 시도 1: 정상 해제
  const cleared = arena.trySetTerrain(TerrainType.NONE);

  // 🔹 시도 2: 실패 시 강제 초기화
  if (!cleared) {
    console.warn(`[TerrainSeedTrainerModifier] ${terrainName} 필드 해제 실패 → 강제 초기화`);
    if (arena.terrain) {
      arena.terrain.terrainType = TerrainType.NONE;
      arena.terrain.turnsLeft = 0;
    }
  }

  globalScene.removeModifier(this, true);
}
  }

  override getMaxStackCount(): number {
    return 1;
  }
}

/**
 * Modifier used for party-wide items, specifically the X items, that
 * temporarily increases the stat stage multiplier of the corresponding
 * {@linkcode TempBattleStat}.
 * @extends LapsingPersistentModifier
 * @see {@linkcode apply}
 */
export class TempStatStageBoosterModifier extends LapsingPersistentModifier {
  /** The stat whose stat stage multiplier will be temporarily increased */
  private stat: TempBattleStat;
  /** The amount by which the stat stage itself or its multiplier will be increased by */
  private boost: number;

  constructor(type: ModifierType, stat: TempBattleStat, maxBattles: number, battleCount?: number, stackCount?: number) {
    super(type, maxBattles, battleCount, stackCount);

    this.stat = stat;
    // Note that, because we want X Accuracy to maintain its original behavior,
    // it will increment as it did previously, directly to the stat stage.
    this.boost = stat !== Stat.ACC ? 0.3 : 1;
  }

  match(modifier: Modifier): boolean {
    if (modifier instanceof TempStatStageBoosterModifier) {
      const modifierInstance = modifier as TempStatStageBoosterModifier;
      return modifierInstance.stat === this.stat;
    }
    return false;
  }

  clone() {
    return new TempStatStageBoosterModifier(
      this.type,
      this.stat,
      this.getMaxBattles(),
      this.getBattleCount(),
      this.stackCount,
    );
  }

  getArgs(): any[] {
    return [this.stat, ...super.getArgs()];
  }

  /**
   * Checks if {@linkcode args} contains the necessary elements and if the
   * incoming stat is matches {@linkcode stat}.
   * @param tempBattleStat {@linkcode TempBattleStat} being affected
   * @param statLevel {@linkcode NumberHolder} that holds the resulting value of the stat stage multiplier
   * @returns `true` if the modifier can be applied, false otherwise
   */
  override shouldApply(tempBattleStat?: TempBattleStat, statLevel?: NumberHolder): boolean {
    return (
      !!tempBattleStat && !!statLevel && TEMP_BATTLE_STATS.includes(tempBattleStat) && tempBattleStat === this.stat
    );
  }

  /**
   * Increases the incoming stat stage matching {@linkcode stat} by {@linkcode boost}.
   * @param _tempBattleStat {@linkcode TempBattleStat} N/A
   * @param statLevel {@linkcode NumberHolder} that holds the resulting value of the stat stage multiplier
   */
  override apply(_tempBattleStat: TempBattleStat, statLevel: NumberHolder): boolean {
    statLevel.value += this.boost;
    return true;
  }
}

/**
 * Modifier used for party-wide items, namely Dire Hit, that
 * temporarily increments the critical-hit stage
 * @extends LapsingPersistentModifier
 * @see {@linkcode apply}
 */
export class TempCritBoosterModifier extends LapsingPersistentModifier {
  clone() {
    return new TempCritBoosterModifier(this.type, this.getMaxBattles(), this.getBattleCount(), this.stackCount);
  }

  match(modifier: Modifier): boolean {
    return modifier instanceof TempCritBoosterModifier;
  }

  /**
   * Checks if {@linkcode args} contains the necessary elements.
   * @param critLevel {@linkcode NumberHolder} that holds the resulting critical-hit level
   * @returns `true` if the critical-hit stage boost applies successfully
   */
  override shouldApply(critLevel?: NumberHolder): boolean {
    return !!critLevel;
  }

  /**
   * Increases the current critical-hit stage value by 1.
   * @param critLevel {@linkcode NumberHolder} that holds the resulting critical-hit level
   * @returns `true` if the critical-hit stage boost applies successfully
   */
  override apply(critLevel: NumberHolder): boolean {
    critLevel.value++;
    return true;
  }
}

export class MapModifier extends PersistentModifier {
  clone(): MapModifier {
    return new MapModifier(this.type, this.stackCount);
  }

  override apply(..._args: unknown[]): boolean {
    return true;
  }

  getMaxStackCount(): number {
    return 1;
  }
}

export class MegaEvolutionAccessModifier extends PersistentModifier {
  clone(): MegaEvolutionAccessModifier {
    return new MegaEvolutionAccessModifier(this.type, this.stackCount);
  }

  override apply(..._args: unknown[]): boolean {
    return true;
  }

  getMaxStackCount(): number {
    return 1;
  }
}

export class GigantamaxAccessModifier extends PersistentModifier {
  clone(): GigantamaxAccessModifier {
    return new GigantamaxAccessModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode GigantamaxAccessModifier}
   * @param _args N/A
   * @returns always `true`
   */
  apply(..._args: unknown[]): boolean {
    return true;
  }

  getMaxStackCount(): number {
    return 1;
  }
}

export class TerastallizeAccessModifier extends PersistentModifier {
  clone(): TerastallizeAccessModifier {
    return new TerastallizeAccessModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode TerastallizeAccessModifier}
   * @param _args N/A
   * @returns always `true`
   */
  override apply(..._args: unknown[]): boolean {
    return true;
  }

  getMaxStackCount(): number {
    return 1;
  }
}

export class GenericZMoveAccessModifier extends PersistentModifier {
  clone(): GenericZMoveAccessModifier {
    return new GenericZMoveAccessModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode GenericZMoveAccessModifier}
   * 범용 Z기술 사용 가능
   * @param _args N/A
   * @returns always `true`
   */
  override apply(..._args: unknown[]): boolean {
    return true;
  }

  getMaxStackCount(): number {
    return 1;
  }
}
window.GenericZMoveAccessModifier = GenericZMoveAccessModifier;

// 전용 Z기술 접근 Modifier
export class ExclusiveZMoveAccessModifier extends PersistentModifier {
  clone(): ExclusiveZMoveAccessModifier {
    return new ExclusiveZMoveAccessModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode ExclusiveZMoveAccessModifier}
   * 포켓몬 전용 Z기술 사용 가능
   * @param _args N/A
   * @returns always `true`
   */
  override apply(..._args: unknown[]): boolean {
    return true;
  }

  getMaxStackCount(): number {
    return 1;
  }
}
window.ExclusiveZMoveAccessModifier = ExclusiveZMoveAccessModifier;

// 다이맥스 및 G-Max 기술 접근 Modifier
export class MaxMoveAccessModifier extends PersistentModifier {
  clone(): MaxMoveAccessModifier {
    return new MaxMoveAccessModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode MaxMoveAccessModifier}
   * 범용 다이맥스 및 전용 G-Max 기술 사용 가능
   * @param _args N/A
   * @returns always `true`
   */
  override apply(..._args: unknown[]): boolean {
    return true;
  }

  getMaxStackCount(): number {
    return 1;
  }
}

export abstract class PokemonHeldItemModifier extends PersistentModifier {
  public pokemonId: number;
  public isTransferable = true;

  private maxBattles?: number;
  private battleCount?: number;

  constructor(type: ModifierType, pokemonId: number, stackCount?: number, maxBattles?: number, battleCount?: number) {
    super(type, stackCount);

    this.pokemonId = pokemonId;

    if (maxBattles !== undefined) {
      this.maxBattles = maxBattles;
      this.battleCount = battleCount ?? maxBattles;
    }
  }

  public hasTurnLimit(): boolean {
    return this.maxBattles !== undefined && this.battleCount !== undefined;
  }

  public getMaxBattles(): number | undefined {
    return this.maxBattles;
  }

  public getBattleCount(): number | undefined {
    return this.battleCount;
  }

  public decrementBattleCount(): boolean {
    if (this.battleCount !== undefined) {
      this.battleCount--;
      return this.battleCount > 0;
    }
    return true;
  }

  public resetBattleCount(): void {
    if (this.maxBattles !== undefined) {
      this.battleCount = this.maxBattles;
    }
  }

  override clone(): PokemonHeldItemModifier {
    throw new Error("Must override clone method in subclass when adding turn limit");
  }

  abstract matchType(_modifier: Modifier): boolean;

  match(modifier: Modifier) {
    return this.matchType(modifier) && (modifier as PokemonHeldItemModifier).pokemonId === this.pokemonId;
  }

  getArgs(): any[] {
    return this.hasTurnLimit() ? [this.pokemonId, this.maxBattles, this.battleCount] : [this.pokemonId];
  }

  abstract override apply(pokemon: Pokemon, ...args: unknown[]): boolean;

  override shouldApply(pokemon?: Pokemon, ..._args: unknown[]): boolean {
    return !!pokemon && (this.pokemonId === -1 || pokemon.id === this.pokemonId);
  }

  isIconVisible(): boolean {
    return !!this.getPokemon()?.isOnField();
  }

  getIcon(forSummary?: boolean): Phaser.GameObjects.Container {
    const container = !forSummary ? globalScene.add.container(0, 0) : super.getIcon();

    if (!forSummary) {
      const pokemon = this.getPokemon();
      if (pokemon) {
        const pokemonIcon = globalScene.addPokemonIcon(pokemon, -2, 10, 0, 0.5);
        container.add(pokemonIcon);
        container.setName(pokemon.id.toString());
      }

      const item = globalScene.add.sprite(16, this.virtualStackCount ? 8 : 16, "items");
      item.setScale(0.5);
      item.setOrigin(0, 0.5);
      item.setTexture("items", this.type.iconImage);
      container.add(item);

      const stackText = this.getIconStackText();
      if (stackText) {
        container.add(stackText);
      }

      const virtualStackText = this.getIconStackText(true);
      if (virtualStackText) {
        container.add(virtualStackText);
      }
    } else {
      container.setScale(0.5);
    }

    return container;
  }

  getPokemon(): Pokemon | undefined {
    return this.pokemonId ? (globalScene.getPokemonById(this.pokemonId) ?? undefined) : undefined;
  }

  getScoreMultiplier(): number {
    return 1;
  }

  getSpecies(): SpeciesId | null {
    return null;
  }

  getMaxStackCount(forThreshold?: boolean): number {
    const pokemon = this.getPokemon();
    if (!pokemon) {
      return 0;
    }
    if (pokemon.isPlayer() && forThreshold) {
      return globalScene
        .getPlayerParty()
        .map(p => this.getMaxHeldItemCount(p))
        .reduce((stackCount: number, maxStackCount: number) => Math.max(stackCount, maxStackCount), 0);
    }
    return this.getMaxHeldItemCount(pokemon);
  }

  abstract getMaxHeldItemCount(pokemon?: Pokemon): number;
}

export abstract class LapsingPokemonHeldItemModifier extends PokemonHeldItemModifier {
  protected battlesLeft: number;
  public isTransferable = false;

  constructor(type: ModifierType, pokemonId: number, battlesLeft?: number, stackCount?: number) {
    super(type, pokemonId, stackCount);

    this.battlesLeft = battlesLeft!; // TODO: is this bang correct?
  }

  /**
   * Lapse the {@linkcode battlesLeft} counter (reduce it by 1)
   * @param _args arguments passed (not used here)
   * @returns `true` if {@linkcode battlesLeft} is not null
   */
  public lapse(..._args: unknown[]): boolean {
    return !!--this.battlesLeft;
  }

  /**
   * Retrieve the {@linkcode Modifier | Modifiers} icon as a {@linkcode Phaser.GameObjects.Container | Container}
   * @param forSummary `true` if the icon is for the summary screen
   * @returns the icon as a {@linkcode Phaser.GameObjects.Container | Container}
   */
  public getIcon(forSummary?: boolean): Phaser.GameObjects.Container {
    const container = super.getIcon(forSummary);

    if (this.getPokemon()?.isPlayer()) {
      const battleCountText = addTextObject(27, 0, this.battlesLeft.toString(), TextStyle.PARTY, {
        fontSize: "66px",
        color: Color.PINK,
      });
      battleCountText.setShadow(0, 0);
      battleCountText.setStroke(ShadowColor.RED, 16);
      battleCountText.setOrigin(1, 0);
      container.add(battleCountText);
    }

    return container;
  }

  getBattlesLeft(): number {
    return this.battlesLeft;
  }

  getMaxStackCount(_forThreshold?: boolean): number {
    return 1;
  }
}

/**
 * Modifier used for held items, specifically vitamins like Carbos, Hp Up, etc., that
 * increase the value of a given {@linkcode PermanentStat}.
 * @extends PokemonHeldItemModifier
 * @see {@linkcode apply}
 */
export class BaseStatModifier extends PokemonHeldItemModifier {
  protected stat: PermanentStat;
  public isTransferable = false;

  constructor(type: ModifierType, pokemonId: number, stat: PermanentStat, stackCount?: number) {
    super(type, pokemonId, stackCount);
    this.stat = stat;
  }

  matchType(modifier: Modifier): boolean {
    if (modifier instanceof BaseStatModifier) {
      return (modifier as BaseStatModifier).stat === this.stat;
    }
    return false;
  }

  clone(): PersistentModifier {
    return new BaseStatModifier(this.type, this.pokemonId, this.stat, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.stat);
  }

  /**
   * Checks if {@linkcode BaseStatModifier} should be applied to the specified {@linkcode Pokemon}.
   * @param _pokemon the {@linkcode Pokemon} to be modified
   * @param baseStats the base stats of the {@linkcode Pokemon}
   * @returns `true` if the {@linkcode Pokemon} should be modified
   */
  override shouldApply(_pokemon?: Pokemon, baseStats?: number[]): boolean {
    return super.shouldApply(_pokemon, baseStats) && Array.isArray(baseStats);
  }

  /**
   * Applies the {@linkcode BaseStatModifier} to the specified {@linkcode Pokemon}.
   * @param _pokemon the {@linkcode Pokemon} to be modified
   * @param baseStats the base stats of the {@linkcode Pokemon}
   * @returns always `true`
   */
  override apply(_pokemon: Pokemon, baseStats: number[]): boolean {
    baseStats[this.stat] = Math.floor(baseStats[this.stat] * (1 + this.getStackCount() * 0.1));
    return true;
  }

  getScoreMultiplier(): number {
    return 1.1;
  }

  getMaxHeldItemCount(pokemon: Pokemon): number {
    return pokemon.ivs[this.stat];
  }
}

export class EvoTrackerModifier extends PokemonHeldItemModifier {
  protected species: SpeciesId;
  protected required: number;
  public isTransferable = false;

  constructor(type: ModifierType, pokemonId: number, species: SpeciesId, required: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
    this.species = species;
    this.required = required;
  }

  matchType(modifier: Modifier): boolean {
    return (
      modifier instanceof EvoTrackerModifier && modifier.species === this.species && modifier.required === this.required
    );
  }

  clone(): PersistentModifier {
    return new EvoTrackerModifier(this.type, this.pokemonId, this.species, this.required, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat([this.species, this.required]);
  }

  /**
   * Applies the {@linkcode EvoTrackerModifier}
   * @returns always `true`
   */
  override apply(): boolean {
    return true;
  }

  getIconStackText(_virtual?: boolean): Phaser.GameObjects.BitmapText | null {
    const pokemon = this.getPokemon();

    const count = (pokemon?.getPersistentTreasureCount() || 0) + this.getStackCount();

    const text = globalScene.add.bitmapText(10, 15, "item-count", count.toString(), 11);
    text.letterSpacing = -0.5;
    if (count >= this.required) {
      text.setTint(0xf89890);
    }
    text.setOrigin(0, 0);

    return text;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 999;
  }

  override getSpecies(): SpeciesId {
    return this.species;
  }
}

/**
 * Currently used by Shuckle Juice item
 */
export class PokemonBaseStatTotalModifier extends PokemonHeldItemModifier {
  public declare type: PokemonBaseStatTotalModifierType;
  public isTransferable = false;
  public statModifier: 10 | -15;

  constructor(type: PokemonBaseStatTotalModifierType, pokemonId: number, statModifier: 10 | -15, stackCount?: number) {
    super(type, pokemonId, stackCount);
    this.statModifier = statModifier;
  }

  override matchType(modifier: Modifier): boolean {
    return modifier instanceof PokemonBaseStatTotalModifier && this.statModifier === modifier.statModifier;
  }

  override clone(): PersistentModifier {
    return new PokemonBaseStatTotalModifier(this.type, this.pokemonId, this.statModifier, this.stackCount);
  }

  override getArgs(): any[] {
    return super.getArgs().concat(this.statModifier);
  }

  /**
   * Checks if {@linkcode PokemonBaseStatTotalModifier} should be applied to the specified {@linkcode Pokemon}.
   * @param pokemon the {@linkcode Pokemon} to be modified
   * @param baseStats the base stats of the {@linkcode Pokemon}
   * @returns `true` if the {@linkcode Pokemon} should be modified
   */
  override shouldApply(pokemon?: Pokemon, baseStats?: number[]): boolean {
    return super.shouldApply(pokemon, baseStats) && Array.isArray(baseStats);
  }

  /**
   * Applies the {@linkcode PokemonBaseStatTotalModifier}
   * @param _pokemon the {@linkcode Pokemon} to be modified
   * @param baseStats the base stats of the {@linkcode Pokemon}
   * @returns always `true`
   */
  override apply(_pokemon: Pokemon, baseStats: number[]): boolean {
    // Modifies the passed in baseStats[] array
    baseStats.forEach((v, i) => {
      // HP is affected by half as much as other stats
      const newVal = i === 0 ? Math.floor(v + this.statModifier / 2) : Math.floor(v + this.statModifier);
      baseStats[i] = Math.min(Math.max(newVal, 1), 999999);
    });

    return true;
  }

  override getScoreMultiplier(): number {
    return 1.2;
  }

  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 2;
  }
}

/**
 * Currently used by Old Gateau item
 */
export class PokemonBaseStatFlatModifier extends PokemonHeldItemModifier {
  public isTransferable = false;

  override matchType(modifier: Modifier): boolean {
    return modifier instanceof PokemonBaseStatFlatModifier;
  }

  override clone(): PersistentModifier {
    return new PokemonBaseStatFlatModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Checks if the {@linkcode PokemonBaseStatFlatModifier} should be applied to the {@linkcode Pokemon}.
   * @param pokemon The {@linkcode Pokemon} that holds the item
   * @param baseStats The base stats of the {@linkcode Pokemon}
   * @returns `true` if the {@linkcode PokemonBaseStatFlatModifier} should be applied
   */
  override shouldApply(pokemon?: Pokemon, baseStats?: number[]): boolean {
    return super.shouldApply(pokemon, baseStats) && Array.isArray(baseStats);
  }

  /**
   * Applies the {@linkcode PokemonBaseStatFlatModifier}
   * @param _pokemon The {@linkcode Pokemon} that holds the item
   * @param baseStats The base stats of the {@linkcode Pokemon}
   * @returns always `true`
   */
  override apply(pokemon: Pokemon, baseStats: number[]): boolean {
    // Modifies the passed in baseStats[] array by a flat value, only if the stat is specified in this.stats
    const stats = this.getStats(pokemon);
    const statModifier = 20;
    baseStats.forEach((v, i) => {
      if (stats.includes(i)) {
        const newVal = Math.floor(v + statModifier);
        baseStats[i] = Math.min(Math.max(newVal, 1), 999999);
      }
    });

    return true;
  }

  /**
   * Get the lowest of HP/Spd, lowest of Atk/SpAtk, and lowest of Def/SpDef
   * @returns Array of 3 {@linkcode Stat}s to boost
   */
  getStats(pokemon: Pokemon): Stat[] {
    const stats: Stat[] = [];
    const baseStats = pokemon.getSpeciesForm().baseStats.slice(0);
    // HP or Speed
    stats.push(baseStats[Stat.HP] < baseStats[Stat.SPD] ? Stat.HP : Stat.SPD);
    // Attack or SpAtk
    stats.push(baseStats[Stat.ATK] < baseStats[Stat.SPATK] ? Stat.ATK : Stat.SPATK);
    // Def or SpDef
    stats.push(baseStats[Stat.DEF] < baseStats[Stat.SPDEF] ? Stat.DEF : Stat.SPDEF);
    return stats;
  }

  override getScoreMultiplier(): number {
    return 1.1;
  }

  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * Currently used by Macho Brace item
 */
export class PokemonIncrementingStatModifier extends PokemonHeldItemModifier {
  public isTransferable = false;

  matchType(modifier: Modifier): boolean {
    return modifier instanceof PokemonIncrementingStatModifier;
  }

  clone(): PokemonIncrementingStatModifier {
    return new PokemonIncrementingStatModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Checks if the {@linkcode PokemonIncrementingStatModifier} should be applied to the {@linkcode Pokemon}.
   * @param pokemon The {@linkcode Pokemon} that holds the item
   * @param stat The affected {@linkcode Stat}
   * @param statHolder The {@linkcode NumberHolder} that holds the stat
   * @returns `true` if the {@linkcode PokemonBaseStatFlatModifier} should be applied
   */
  override shouldApply(pokemon?: Pokemon, stat?: Stat, statHolder?: NumberHolder): boolean {
    return super.shouldApply(pokemon, stat, statHolder) && !!statHolder;
  }

  /**
   * Applies the {@linkcode PokemonIncrementingStatModifier}
   * @param _pokemon The {@linkcode Pokemon} that holds the item
   * @param stat The affected {@linkcode Stat}
   * @param statHolder The {@linkcode NumberHolder} that holds the stat
   * @returns always `true`
   */
  override apply(_pokemon: Pokemon, stat: Stat, statHolder: NumberHolder): boolean {
    // Modifies the passed in stat number holder by +2 per stack for HP, +1 per stack for other stats
    // If the Macho Brace is at max stacks (50), adds additional 10% to total HP and 5% to other stats
    const isHp = stat === Stat.HP;

    if (isHp) {
      statHolder.value += 2 * this.stackCount;
      if (this.stackCount === this.getMaxHeldItemCount()) {
        statHolder.value = Math.floor(statHolder.value * 1.1);
      }
    } else {
      statHolder.value += this.stackCount;
      if (this.stackCount === this.getMaxHeldItemCount()) {
        statHolder.value = Math.floor(statHolder.value * 1.05);
      }
    }

    return true;
  }

  getScoreMultiplier(): number {
    return 1.2;
  }

  getMaxHeldItemCount(_pokemon?: Pokemon): number {
    return 50;
  }
}

/**
 * Modifier used for held items that Applies {@linkcode Stat} boost(s)
 * using a multiplier.
 * @extends PokemonHeldItemModifier
 * @see {@linkcode apply}
 */
export class StatBoosterModifier extends PokemonHeldItemModifier {
  /** The stats that the held item boosts */
  protected stats: Stat[];
  /** The multiplier used to increase the relevant stat(s) */
  protected multiplier: number;

  constructor(type: ModifierType, pokemonId: number, stats: Stat[], multiplier: number, stackCount?: number) {
    super(type, pokemonId, stackCount);

    this.stats = stats;
    this.multiplier = multiplier;
  }

  clone() {
    return new StatBoosterModifier(this.type, this.pokemonId, this.stats, this.multiplier, this.stackCount);
  }

  getArgs(): any[] {
    return [...super.getArgs(), this.stats, this.multiplier];
  }

  matchType(modifier: Modifier): boolean {
    if (modifier instanceof StatBoosterModifier) {
      const modifierInstance = modifier as StatBoosterModifier;
      if (modifierInstance.multiplier === this.multiplier && modifierInstance.stats.length === this.stats.length) {
        return modifierInstance.stats.every((e, i) => e === this.stats[i]);
      }
    }

    return false;
  }

  /**
   * Checks if the incoming stat is listed in {@linkcode stats}
   * @param _pokemon the {@linkcode Pokemon} that holds the item
   * @param _stat the {@linkcode Stat} to be boosted
   * @param statValue {@linkcode NumberHolder} that holds the resulting value of the stat
   * @returns `true` if the stat could be boosted, false otherwise
   */
  override shouldApply(pokemon: Pokemon, stat: Stat, statValue: NumberHolder): boolean {
    return super.shouldApply(pokemon, stat, statValue) && this.stats.includes(stat);
  }

  /**
   * Boosts the incoming stat by a {@linkcode multiplier} if the stat is listed
   * in {@linkcode stats}.
   * @param _pokemon the {@linkcode Pokemon} that holds the item
   * @param _stat the {@linkcode Stat} to be boosted
   * @param statValue {@linkcode NumberHolder} that holds the resulting value of the stat
   * @returns `true` if the stat boost applies successfully, false otherwise
   * @see shouldApply
   */
  override apply(_pokemon: Pokemon, _stat: Stat, statValue: NumberHolder): boolean {
    statValue.value *= this.multiplier;
    return true;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * Modifier used for held items, specifically Eviolite, that apply
 * {@linkcode Stat} boost(s) using a multiplier if the holder can evolve.
 * @extends StatBoosterModifier
 * @see {@linkcode apply}
 */
export class EvolutionStatBoosterModifier extends StatBoosterModifier {
  matchType(modifier: Modifier): boolean {
    return modifier instanceof EvolutionStatBoosterModifier;
  }

  /**
   * Checks if the stat boosts can apply and if the holder is not currently
   * Gigantamax'd.
   * @param pokemon {@linkcode Pokemon} that holds the held item
   * @param stat {@linkcode Stat} The {@linkcode Stat} to be boosted
   * @param statValue {@linkcode NumberHolder} that holds the resulting value of the stat
   * @returns `true` if the stat boosts can be applied, false otherwise
   */
  override shouldApply(pokemon: Pokemon, stat: Stat, statValue: NumberHolder): boolean {
    return super.shouldApply(pokemon, stat, statValue) && !pokemon.isMax();
  }

  /**
   * Boosts the incoming stat value by a {@linkcode EvolutionStatBoosterModifier.multiplier} if the holder
   * can evolve. Note that, if the holder is a fusion, they will receive
   * only half of the boost if either of the fused members are fully
   * evolved. However, if they are both unevolved, the full boost
   * will apply.
   * @param pokemon {@linkcode Pokemon} that holds the item
   * @param _stat {@linkcode Stat} The {@linkcode Stat} to be boosted
   * @param statValue{@linkcode NumberHolder} that holds the resulting value of the stat
   * @returns `true` if the stat boost applies successfully, false otherwise
   * @see shouldApply
   */
  override apply(pokemon: Pokemon, stat: Stat, statValue: NumberHolder): boolean {
    const isUnevolved = pokemon.getSpeciesForm(true).speciesId in pokemonEvolutions;

    if (pokemon.isFusion() && pokemon.getFusionSpeciesForm(true).speciesId in pokemonEvolutions !== isUnevolved) {
      // Half boost applied if pokemon is fused and either part of fusion is fully evolved
      statValue.value *= 1 + (this.multiplier - 1) / 2;
      return true;
    }
    if (isUnevolved) {
      // Full boost applied if holder is unfused and unevolved or, if fused, both parts of fusion are unevolved
      return super.apply(pokemon, stat, statValue);
    }

    return false;
  }
}

export class EvolutionIncenseModifier extends StatBoosterModifier {
  clone() {
    return super.clone() as EvolutionIncenseModifier;
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof EvolutionIncenseModifier;
  }

  override shouldApply(pokemon: Pokemon, stat: Stat, statValue: NumberHolder): boolean {
    // Only apply to specific stats and if not Dynamaxed
    return (
      (stat === Stat.ATK || stat === Stat.SPA || stat === Stat.SPE) &&
      super.shouldApply(pokemon, stat, statValue) &&
      !pokemon.isMax()
    );
  }

  override apply(pokemon: Pokemon, stat: Stat, statValue: NumberHolder): boolean {
    const isUnevolved = pokemon.getSpeciesForm(true).speciesId in pokemonEvolutions;

    if (pokemon.isFusion()) {
      const fusion = pokemon.getFusionSpeciesForm(true);
      const isFusionUnevolved = fusion.speciesId in pokemonEvolutions;

      // Half boost if only one of the fusion members is unevolved
      if (isFusionUnevolved !== isUnevolved) {
        statValue.value *= 1 + (this.multiplier - 1) / 2;
        return true;
      }
    }

    if (isUnevolved) {
      // Full boost
      return super.apply(pokemon, stat, statValue);
    }

    return false;
  }
}

/**
 * Modifier used for held items that Applies {@linkcode Stat} boost(s) using a
 * multiplier if the holder is of a specific {@linkcode SpeciesId}.
 * @extends StatBoosterModifier
 * @see {@linkcode apply}
 */
export class SpeciesStatBoosterModifier extends StatBoosterModifier {
  /** The species that the held item's stat boost(s) apply to */
  private species: SpeciesId[];

  constructor(
    type: ModifierType,
    pokemonId: number,
    stats: Stat[],
    multiplier: number,
    species: SpeciesId[],
    stackCount?: number,
  ) {
    super(type, pokemonId, stats, multiplier, stackCount);

    this.species = species;
  }

  clone() {
    return new SpeciesStatBoosterModifier(
      this.type,
      this.pokemonId,
      this.stats,
      this.multiplier,
      this.species,
      this.stackCount,
    );
  }

  getArgs(): any[] {
    return [...super.getArgs(), this.species];
  }

  matchType(modifier: Modifier): boolean {
    if (modifier instanceof SpeciesStatBoosterModifier) {
      const modifierInstance = modifier as SpeciesStatBoosterModifier;
      if (modifierInstance.species.length === this.species.length) {
        return super.matchType(modifier) && modifierInstance.species.every((e, i) => e === this.species[i]);
      }
    }

    return false;
  }

  /**
   * Checks if the incoming stat is listed in {@linkcode stats} and if the holder's {@linkcode SpeciesId}
   * (or its fused species) is listed in {@linkcode species}.
   * @param pokemon {@linkcode Pokemon} that holds the item
   * @param stat {@linkcode Stat} being checked at the time
   * @param statValue {@linkcode NumberHolder} that holds the resulting value of the stat
   * @returns `true` if the stat could be boosted, false otherwise
   */
  override shouldApply(pokemon: Pokemon, stat: Stat, statValue: NumberHolder): boolean {
    return (
      super.shouldApply(pokemon, stat, statValue) &&
      (this.species.includes(pokemon.getSpeciesForm(true).speciesId) ||
        (pokemon.isFusion() && this.species.includes(pokemon.getFusionSpeciesForm(true).speciesId)))
    );
  }

  /**
   * Checks if either parameter is included in the corresponding lists
   * @param speciesId {@linkcode SpeciesId} being checked
   * @param stat {@linkcode Stat} being checked
   * @returns `true` if both parameters are in {@linkcode species} and {@linkcode stats} respectively, false otherwise
   */
  contains(speciesId: SpeciesId, stat: Stat): boolean {
    return this.species.includes(speciesId) && this.stats.includes(stat);
  }
}

export class StatBoostModifier extends PokemonHeldItemModifier {
  private readonly baseBoostPercent: number = 6; // 1중첩당 증가율
  private static readonly maxStack: number = 5; // 최대 중첩 개수
  private static readonly maxHeldItemCount: number = 5; // 최대 장착 가능 아이템 수량

  constructor(type: ModifierType, pokemonId: number, stackCount = 1) {
    super(type, pokemonId, stackCount);
  }

  clone() {
    return new StatBoostModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat([this.stackCount]);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof StatBoostModifier;
  }

  getStackCount(): number {
    return this.stackCount ?? 1; // 기본적으로 최소 1스택
  }

  /**
   * Checks if the {@linkcode StatBoostModifier} should be applied
   * @param pokemon the {@linkcode Pokemon} that holds the item
   * @param statHolder {@linkcode NumberHolder} that holds the stat to be boosted
   * @returns true if the {@linkcode StatBoostModifier} should be applied
   */
  override shouldApply(pokemon: Pokemon, statHolder: NumberHolder): boolean {
    return super.shouldApply(pokemon, statHolder) && this.stackCount < StatBoostModifier.maxStack;
  }

  /**
   * Applies {@linkcode StatBoostModifier} and increases the stat
   * @param pokemon the {@linkcode Pokemon} that holds the item
   * @param statHolder {@linkcode NumberHolder} that holds the stat to be boosted
   * @returns true if the stat has been boosted
   */
  override apply(_pokemon: Pokemon, moveType: Type, movePower: NumberHolder): boolean {
    // 아이템 장착 수량이 최대 제한에 도달했는지 확인
    if (_pokemon.getHeldItems().length >= StatBoostModifier.maxHeldItemCount) {
      return false; // 최대 장착 수량을 초과하면 적용 불가
    }

    // 스택 수가 최대 스택 수를 초과했는지 확인
    if (this.stackCount >= StatBoostModifier.maxStack) {
      return false; // 최대 스택 수에 도달하면 적용 불가
    }

    // 공격 타입이 일치하고, movePower가 1 이상인 경우
    if (moveType === this.moveType && movePower.value >= 1) {
      // 보정 계산
      const boostMultiplier = 1 + this.getStackCount() * this.boostMultiplier;
      movePower.value = Math.floor(movePower.value * boostMultiplier); // 보정된 공격력 적용

      // 스택 수 증가
      this.stackCount = Math.min(this.stackCount + 1, StatBoostModifier.maxStack);

      // 적용된 보정 정보를 메시지로 전달
      globalScene.phaseManager.queueMessage(
        i18next.t("modifier:attackTypeBoostApply", {
          pokemonNameWithAffix: getPokemonNameWithAffix(_pokemon),
          moveTypeName: moveType, // 공격 타입 이름
          boostPercentage: this.boostMultiplier * this.getStackCount(),
        }),
      );

      return true;
    }

    return false;
  }

  /**
   * 최대 장착 아이템 수량을 설정
   * @param _pokemon Pokemon 객체
   * @returns 최대 장착 가능 아이템 수
   */
  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return StatBoostModifier.maxHeldItemCount; // 최대 5개의 아이템만 장착 가능
  }
}

export class SuperEffectiveBoosterModifier extends PokemonHeldItemModifier {
  private readonly baseBoostPercent: number = 6; // 1중첩당 위력 증가량 (20%)
  private static readonly maxStack: number = 5; // 최대 중첩 개수 (5개)

  constructor(type: ModifierType, pokemonId: number, stackCount = 1) {
    super(type, pokemonId, stackCount);
  }

  clone() {
    return new SuperEffectiveBoosterModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat([this.stackCount]);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof SuperEffectiveBoosterModifier;
  }

  /**
   * 동일 아이템이 다시 적용되었을 때 중첩 개수 증가
   */
  onApply(pokemon: Pokemon): void {
    this.stackCount = Math.min(this.stackCount + 1, SuperEffectiveBoosterModifier.maxStack);
  }

  /**
   * 기술 피해에 보너스 적용 (아이템 효과)
   */
  applyMovePowerBoost(
    move: Move,
    attacker: Pokemon,
    defender: Pokemon,
    power: number,
    battleContext: BattleContext,
  ): number {
    const currentStack = this.getStackCount(); // 현재 중첩 개수 (최대 5)

    // 위력 증가 계산 (0.2배씩 증가)
    const boostMultiplier = 1 + (this.baseBoostPercent / 100) * currentStack;
    const newPower = Math.floor(power * boostMultiplier);

    return newPower;
  }

  /**
   * 포켓몬이 장착할 수 있는 아이템 최대 개수 (5로 제한, 표시값도 5)
   */
  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return SuperEffectiveBoosterModifier.maxStack;
  }

  /**
   * 타입 배율 > 1일 때만 효과 적용
   */
  override shouldApply(pokemon?: Pokemon, move?: Move, typeMultiplier?: number): boolean {
    return super.shouldApply(pokemon) && typeMultiplier > 1;
  }
}

export class StackingRiskyPowerBoosterModifier extends PokemonHeldItemModifier {
  private readonly baseBoostPercent = 30;
  private static readonly maxStack = 3;

  private lastAppliedTurn = -1;
  private lastAppliedMoveId: number | null = null;

  constructor(type: ModifierType, pokemonId: number, stackCount = 1) {
    super(type, pokemonId, stackCount);
  }

  clone() {
    return new StackingRiskyPowerBoosterModifier(this.type, this.pokemonId, this.stackCount);
  }

  // SuperEffectiveBoosterModifier 스타일로 변경
  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof StackingRiskyPowerBoosterModifier;
  }

  // 중첩 적용 함수 (아이템이 다시 적용될 때 호출)
  onApply(pokemon: Pokemon): void {
    this.stackCount = Math.min(this.stackCount + 1, StackingRiskyPowerBoosterModifier.maxStack);
  }

  applyHpLossIfNeeded(attacker: Pokemon, moveId: number, currentTurn: number) {
    const MAGIC_GUARD = AbilityId.MAGIC_GUARD;
    const SHEER_FORCE = AbilityId.SHEER_FORCE;

    const hasSheerForceItem = globalScene
      .getModifiers(SheerForceItemModifier, attacker.isPlayer())
      .some(mod => mod.pokemonId === attacker.id);

    // 매직가드, 우격다짐 특성, 또는 우격다짐 아이템이면 반동 피해 무시
    if (attacker.hasAbility(MAGIC_GUARD, false) || attacker.hasAbility(SHEER_FORCE, false) || hasSheerForceItem) {
      console.log(
        `[RiskyBooster] 매직가드, 우격다짐 능력 또는 우격다짐 아이템으로 반동 피해 무시 - Pokemon ID ${attacker.id}`,
      );
      return;
    }

    const percents = [0.1, 0.06, 0.02];
    const hpLoss = toDmgValue(attacker.getMaxHp() * percents[Math.min(this.stackCount - 1, 2)]);
    console.log(`[RiskyBooster] 반동 피해 적용: ${hpLoss} to Pokemon ID ${attacker.id}`);
    attacker.damageAndUpdate(hpLoss, HitResult.OTHER);
  }

  applyMovePowerBoost(move, attacker, defender, power, battleContext): number {
    const currentStack = this.getStackCount();
    const boostMultiplier = 1 + (this.baseBoostPercent / 100) * currentStack;

    const currentTurn = battleContext?.turn ?? attacker.battle?.turnCount ?? 0;
    const moveId = move?.id;

    this.applyHpLossIfNeeded(attacker, moveId, currentTurn);

    if (typeof power !== "number" || isNaN(power)) {
      console.error("[RiskyBooster] Invalid power:", power);
      return power || 0;
    }

    return Math.floor(power * boostMultiplier);
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return StackingRiskyPowerBoosterModifier.maxStack;
  }
}

export class StackingPowerBoosterModifier extends PokemonHeldItemModifier {
  private readonly baseBoostPercent: number = 10; // Each stack increases power by 10%

  constructor(type: ModifierType, pokemonId: number, stackCount = 1) {
    super(type, pokemonId, stackCount);
  }

  clone(): StackingPowerBoosterModifier {
    return new StackingPowerBoosterModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat([this.stackCount]);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof StackingPowerBoosterModifier;
  }

  /**
   * Applies the power boost to the move based on the stack count
   */
  applyMovePowerBoost(
    move: Move,
    attacker: Pokemon,
    defender: Pokemon,
    power: number,
    battleContext: BattleContext,
  ): number {
    const currentStack = this.getStackCount(); // Get current stack count (max 20)

    // Calculate the power boost based on the stack count
    const boostMultiplier = 1 + (this.baseBoostPercent / 100) * currentStack;
    const newPower = Math.floor(power * boostMultiplier);

    // After applying the power boost, increment the stack count (up to max 20)
    this.incrementStackCount(); // Increment stack count method

    return newPower;
  }

  /**
   * Increments the stack count, capping at the maximum allowed.
   */
  incrementStackCount() {
    this.stackCount = Math.min(this.stackCount + 1, this.getMaxHeldItemCount());
  }

  /**
   * Applies the power boost based on the stack count.
   * For other stats, increase by +2 per stack.
   * If max stacks (20), apply additional percentage boost (10%).
   */
  applyStatBoost(stat: Stat, statHolder: NumberHolder): boolean {
    // Only applies to move power
    statHolder.value += 2 * this.stackCount; // Increase move power (by +2 per stack)

    // If max stack reached, apply 10% additional bonus
    if (this.stackCount === this.getMaxHeldItemCount()) {
      statHolder.value = Math.floor(statHolder.value * 1.1); // 10% bonus
    }

    // **시각적으로 중복된 효과 표시** (UI나 다른 로직을 통해 중복된 효과처럼 보이게 처리)
    this.displayStackEffect(stat, statHolder); // 여기에 중복 효과를 표시하는 로직 추가 가능

    return true;
  }

  /**
   * Displays the effect of stack count (for UI or log purposes)
   */
  private displayStackEffect(stat: Stat, statHolder: NumberHolder): void {
    // 템플릿 리터럴을 백틱으로 감싸고 변수를 ${}로 감싸야 합니다.
    console.log(`${stat} stat increased by ${this.stackCount * 2} due to ${this.stackCount} stack(s).`);
    // 여기에 스택 수와 그에 따른 변화가 중복처럼 표시되게 하는 로직을 추가할 수 있습니다.
  }

  /**
   * Returns the maximum count of the item that a Pokémon can hold (1 in this case)
   */
  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 10; // Always 10 max stacks
  }

  /**
   * Returns the current stack count
   */
  getStackCount(): number {
    return this.stackCount;
  }
}

export class RunSuccessModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId);
  }

  clone(): RunSuccessModifier {
    return new RunSuccessModifier(this.type, this.pokemonId);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof RunSuccessModifier;
  }

  /**
   * 연막탄 효과 적용 - 100% 도망 가능
   */
  apply(
  pokemon: Pokemon,
  passive: boolean,
  simulated: boolean,
  escapeChance?: NumberHolder, // optional
  cancelled?: Utils.BooleanHolder
): boolean {
  if (!pokemon.battleData) return false;

  if (!pokemon.arena?.hasTag(ArenaTagType.NEUTRALIZING_GAS)) {
    pokemon.battleData.escapeChance = 256;

    if (escapeChance) {
      escapeChance.value = 256;
    }

    console.log(`[DEBUG] 연막탄 효과 적용됨 - Neutralizing Gas 없음`);
  }

  if (!simulated) {
    globalScene.phaseManager.queueMessage(
      i18next.t("modifier:runSuccessApply", {
        pokemonName: getPokemonNameWithAffix(pokemon),
        itemName: i18next.t("modifierType:ModifierType.SMOKE_BALL.name"),
      }),
    );
  }

  return true;
}

  /**
   * 연막탄은 소모되지 않는 아이템이므로 항상 1개만 소지 가능
   */
  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

export class EvasiveItemModifier extends PokemonHeldItemModifier {
  private static readonly maxStack: number = 3;
  private readonly accDebuffPercent: number = 10;

  constructor(type: ModifierType, pokemonId: number, stackCount = 1) {
    super(type, pokemonId, stackCount);
  }

  clone(): EvasiveItemModifier {
    return new EvasiveItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat([this.stackCount]);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof EvasiveItemModifier;
  }

  getStackCount(): number {
    return this.stackCount ?? 1;
  }

  /**
   * 명중률 디버프 적용 (자신이 아니라 상대에게 영향)
   */
  override apply(pokemon: Pokemon): boolean {
    if (pokemon.id !== this.pokemonId) return false;

    const debuffPercent = this.getStackCount() * this.accDebuffPercent;

    if (typeof pokemon.setAccuracyDebuffToEnemiesFromItem === "function") {
      pokemon.setAccuracyDebuffToEnemiesFromItem(debuffPercent);
    } else {
      // 예비 fallback: 속성으로 강제로 박아 넣기
      (pokemon as any)._accDebuffFromItem = debuffPercent;
    }

    return true;
  }

  override onApply(pokemon: Pokemon): void {
    this.stackCount = Math.min(this.stackCount + 1, EvasiveItemModifier.maxStack);
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return EvasiveItemModifier.maxStack;
  }

  override shouldApply(pokemon: Pokemon, _statHolder?: NumberHolder): boolean {
    return super.shouldApply(pokemon, _statHolder) && this.stackCount < EvasiveItemModifier.maxStack;
  }
}

export class IgnoreContactItemModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 장착 가능 아이템 수량

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1); // 기본적으로 1번 적용
  }

  clone() {
    return new IgnoreContactItemModifier(this.type, this.pokemonId);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof IgnoreContactItemModifier;
  }

  /**
   * 비접촉 처리 및 위력 증가 적용
   * @param pokemon 적용 대상 포켓몬
   */
  override apply(pokemon: Pokemon, moveType: Type, movePower: NumberHolder): boolean {
    // 아이템 장착 수량이 최대 제한에 도달했는지 확인
    if (pokemon.getHeldItems().length >= IgnoreContactItemModifier.maxHeldItemCount) {
      return false; // 최대 장착 수량을 초과하면 적용 불가
    }

    // 현재 기술이 접촉 기술인지 체크
    if (pokemon.currentMove && this.checkIfMoveMakesContact(pokemon)) {
      // 기술을 비접촉 기술로 변경
      pokemon.currentMove.setFlag(MoveFlags.MAKES_CONTACT, false);

      // 위력 1.3배 적용
      pokemon.increaseMovePower(1.3);

      return true;
    }

    return false;
  }

  /**
   * 기술이 접촉 기술인지 체크
   * @param user 기술을 사용하는 포켓몬
   * @returns true if the move makes contact
   */
  checkIfMoveMakesContact(user: Pokemon): boolean {
    const move = user.currentMove;
    return move?.checkFlag(MoveFlags.MAKES_CONTACT, user, null) ?? false;
  }

  /**
   * 포켓몬이 장착할 수 있는 아이템 최대 개수 (1로 제한)
   */
  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return IgnoreContactItemModifier.maxHeldItemCount; // 최대 1개만 장착 가능
  }
}

export class GuaranteedSurviveDamageModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount = 1) {
    super(type, pokemonId);
    this.stackCount = stackCount; // 기본적으로 stackCount를 설정
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof GuaranteedSurviveDamageModifier;
  }

  clone() {
    return new GuaranteedSurviveDamageModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Applies {@linkcode GuaranteedSurviveDamageModifier}
   * @param playerPokemon The {@linkcode PlayerPokemon} that consumes the item
   * @param surviveDamage {@linkcode BooleanHolder} that holds the survive damage
   * @returns `true` if the survive damage has been applied
   */
  override apply(playerPokemon: PlayerPokemon, surviveDamage: BooleanHolder, damageValue?: number): boolean {
    if (
      !surviveDamage.value &&
      playerPokemon.isFullHp() &&
      typeof damageValue === "number" &&
      damageValue >= playerPokemon.hp &&
      playerPokemon.getMaxHp() > 1
    ) {
      const preserve = new BooleanHolder(false);

      // preserve 적용. berry 아님을 명시
      globalScene.applyModifiers(PreserveItemModifier, playerPokemon.isPlayer(), playerPokemon, preserve, "item");

      surviveDamage.value = true;
      playerPokemon.hp = 1;
 
      globalScene.phaseManager.queueMessage(
        i18next.t("modifier:guaranteedSurviveDamageApply", {
          pokemonNameWithAffix: getPokemonNameWithAffix(playerPokemon),
          typeName: this.type.name,
        }),
      );

      playerPokemon.hp = 1;

      if (!preserve.value) {
        if (this.stackCount > 1) {
          this.stackCount--;
        } else {
          // modifier 제거 전 아이템 소모 처리
          const pokemon = globalScene.getPokemonById(this.pokemonId);
          if (pokemon) {
            pokemon.loseHeldItem(this); // this는 modifier, 필요한 경우 getItem() 등 실제 아이템 반환 메서드 사용
          }
          globalScene.removeModifier(this);
        }
      }

      // UI 갱신 등 필요 시 호출
      globalScene.updateModifiers(playerPokemon);

      return true;
    }

    return false;
  }

  getMaxHeldItemCount(playerPokemon: PlayerPokemon): number {
    return 3; // 사용 가능한 최대 개수
  }

  getStackCount(): number {
    return this.stackCount;
  }
}

export class ContactDamageModifier extends PokemonHeldItemModifier {
  private damageRatio: number;

  constructor(type: ModifierType, pokemonId: number, damageRatio = 6) {
    super(type, pokemonId, 1);
    this.damageRatio = damageRatio;
  }

  clone(): this {
    return new ContactDamageModifier(this.type, this.pokemonId, this.damageRatio) as this;
  }

  getArgs(): any[] {
    return [this.pokemonId, this.damageRatio];
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof ContactDamageModifier;
  }

  override apply(
    pokemon: Pokemon,
    move: Move,
    targetPokemon: Pokemon | null,
    passive: boolean,
    simulated: boolean,
    cancelled: Utils.BooleanHolder,
  ): boolean {
    if (!move || !targetPokemon) return false;

    // 접촉 기술 여부 확인
    const isContact = move.checkFlag(MoveFlags.MAKES_CONTACT, pokemon, targetPokemon);
    const hitsSubstitute = move.hitsSubstitute(pokemon, targetPokemon); // 대타 상태 확인

    if (isContact && !hitsSubstitute) {
      const damage = Math.max(Math.floor(pokemon.getMaxHp() / this.damageRatio), 1); // 최소 1 피해
      pokemon.damageAndUpdate(damage, HitResult.INDIRECT); // 피해 적용

      if (cancelled?.set) {
        cancelled.set(true);
      }

      if (globalScene) {
        globalScene.phaseManager.queueMessage(
          i18next.t("modifier:contactDamageApplied", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            itemName: "울퉁불퉁멧",
          }),
        );
      }

      return true;
    }

    return false;
  }

  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

export class ResetMoveRestrictionModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  matchType(modifier: Modifier) {
    return modifier instanceof ResetMoveRestrictionModifier;
  }

  clone() {
    return new ResetMoveRestrictionModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Goes through the holder's status tags and, if any match the predefined set,
   * removes them (or resets them).
   * @param pokemon {@linkcode Pokemon} that holds the item
   * @returns `true` if any status tags were removed, false otherwise
   */
  override apply(pokemon: Pokemon): boolean {
    let statusTagsRemoved = false;

    // 상태 태그 목록
    const statusTags = new Set([
      TauntTag, // 트집
      TormentTag, // 트집
      HealBlockTag, // 회복봉인
      EncoreTag, // 앙코르
      DisabledTag, // 능력치 제한
      InfatuatedTag, // 사랑에 빠진 상태
      PerishSongTag, // 멸망의 노래
    ]);

    // 포켓몬의 상태 태그 확인 (battlerTags가 undefined인 경우 빈 배열로 초기화)
    const pokemonTags = pokemon.battlerTags || [];

    // 상태 태그가 비어있다면, 상태 태그가 적용되지 않은 상태입니다.
    if (pokemonTags.length === 0) {
      console.log("No tags applied to the pokemon.");
    }

    console.log("Current battlerTags:", pokemonTags); // 상태 태그 목록 출력

    for (const tagInstance of pokemonTags) {
      console.log("Checking tag:", tagInstance.constructor.name); // 상태 태그 종류 출력

      if (statusTags.has(tagInstance.constructor)) {
        console.log("Removing tag:", tagInstance.constructor.name);
        tagInstance.clear(pokemon); // 상태 태그 제거
        statusTagsRemoved = true;
      }
    }

    // 상태 태그 제거된 경우 true 반환
    return statusTagsRemoved;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 10; // 최대 소지 개수
  }
}

export class ProtectStatModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  matchType(modifier: Modifier) {
    return modifier instanceof ProtectStatModifier;
  }

  clone() {
    return new ProtectStatModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * 능력치 감소 보호 기능 적용
   * @param pokemon 능력치가 변화하는 포켓몬
   * @param stat 변경될 능력치
   * @param newStage 적용될 새로운 능력치 단계
   * @returns 보호된 경우 원래 단계 유지, 아니면 변경된 값 반환
   */
  applyStatChange(pokemon: Pokemon, stat: BattleStat, newStage: number): number {
    const currentStage = pokemon.getStatStage(stat);
    console.log("[DEBUG] ProtectStatModifier apply 호출됨", { stat, currentStage, newStage });

    // 🛑 클리어참 효과: 상대방이 능력치를 낮출 때만 보호 (자기 효과는 허용)
    if (newStage < currentStage && pokemon.id === this.pokemonId && this.isEnemyEffect(pokemon)) {
      return currentStage; // 능력치 감소 차단
    }

    return newStage;
  }

  /**
   * 능력치 감소가 상대 효과인지 확인
   * @param pokemon 능력치 변경 대상 포켓몬
   * @returns 상대방 효과 여부 (true면 보호)
   */
  private isEnemyEffect(pokemon: Pokemon): boolean {
    return !globalScene.isPlayerPokemon(pokemon); // 플레이어가 아닌 포켓몬이면 보호
  }

  override apply(pokemon: Pokemon): boolean {
    let statProtected = false;

    for (const s of BATTLE_STATS) {
      const currentStage = pokemon.getStatStage(s);

      // 🛑 능력치가 0보다 낮아지는 경우만 보호
      if (pokemon.id === this.pokemonId && currentStage < 0) {
        statProtected = true;
      }
    }

    if (statProtected) {
      globalScene.phaseManager.queueMessage(
        i18next.t("modifier:protectStatStageApply", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          typeName: this.type.name,
        }),
      );
    }

    return statProtected;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1; // 한 포켓몬에 하나만 적용
  }
}

export class WeaknessTypeModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount = 1) {
    super(type, pokemonId);
    this.stackCount = stackCount;
  }

  override matchType(modifier: Modifier): boolean {
    return modifier instanceof WeaknessTypeModifier;
  }

  override clone(): WeaknessTypeModifier {
    return new WeaknessTypeModifier(this.type, this.pokemonId, this.stackCount);
  }

  canApply(pokemon: Pokemon): boolean {
    return true;
  }

  // apply 메소드 수정
  override apply(pokemon: Pokemon, moveType: Type, movePower: number, result: HitResult, source: Pokemon): boolean {
    if (!this.canApply(pokemon)) {
      console.log("canApply returned false");

      if (result === HitResult.SUPER_EFFECTIVE && source) {
        return false; // 이미 적용된 경우 발동되지 않음
      }
    }
    // 결과가 약점 공격인 경우에만 처리
    if (result === HitResult.SUPER_EFFECTIVE && source) {
      // 공격력과 특수공격력 2단계 증가
      globalScene.phaseManager.unshiftNew(
         "StatStageChangePhase",
          pokemon.getBattlerIndex(),
          true,
          [Stat.ATK, Stat.SPATK],
          2, // 2 스테이지 증가
          true,
        );

      // 아이템 소모 관리
      const preserve = new BooleanHolder(false);
      globalScene.applyModifiers(PreserveItemModifier, pokemon.isPlayer(), pokemon, preserve, "item");

      if (!preserve.value) {
        if (this.stackCount > 1) {
          this.stackCount--;
        } else {
          globalScene.removeModifier(this);
        }
      }

      return true; // 성공적으로 적용됨
    }

    return false; // 타입에 따른 조건을 만족하지 않으면 false
  }

  getMaxHeldItemCount(pokemon: Pokemon): number {
    return 10; // 약점보험은 최대 10개
  }
}

/**
 * Item that increases the holder's Defense and Special Defense when an opposing Pokemon is knocked out by an attack move.
 */
export class PokemonDefensiveStatModifier extends PokemonHeldItemModifier {
  public isTransferable = false;

  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof PokemonDefensiveStatModifier;
  }

  clone(): PokemonDefensiveStatModifier {
    return new PokemonDefensiveStatModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  /**
   * Checks if the {@linkcode PokemonDefensiveStatModifier} should be applied to the {@linkcode Pokemon}.
   * @param pokemon The {@linkcode Pokemon} that holds the item
   * @param stat The affected {@linkcode Stat}
   * @param statHolder The {@linkcode NumberHolder} that holds the stat
   * @returns `true` if the modifier should be applied
   */
  override shouldApply(pokemon?: Pokemon, stat?: Stat, statHolder?: NumberHolder): boolean {
    return super.shouldApply(pokemon, stat, statHolder) && !!statHolder;
  }

  /**
   * Applies the {@linkcode PokemonDefensiveStatModifier} when an opponent's Pokemon is knocked out.
   * @param _pokemon The {@linkcode Pokemon} that holds the item
   * @param stat The affected {@linkcode Stat}
   * @param statHolder The {@linkcode NumberHolder} that holds the stat
   * @returns always `true`
   */
  override apply(_pokemon: Pokemon, stat: Stat, statHolder: NumberHolder): boolean {
    // Modifies the passed in stat number holder by +30% per stack for Defense and Special Defense
    const isDefense = stat === Stat.DEF;
    const isSpecialDefense = stat === Stat.SPDEF;

    if (isDefense || isSpecialDefense) {
      // Apply the stat increase based on the number of stacks
      statHolder.value += Math.floor(statHolder.value * (0.3 * this.stackCount));
    }

    return true;
  }

  /**
   * This function is called to determine the score multiplier for the item.
   * @returns The score multiplier
   */
  getScoreMultiplier(): number {
    return 1.3; // Example multiplier
  }

  /**
   * Gets the maximum number of stacks the item can have.
   * @param pokemon The Pokemon holding the item (optional)
   * @returns Maximum stack count
   */
  getMaxHeldItemCount(pokemon?: Pokemon): number {
    return 5; // Maximum stacks allowed, now limited to 5
  }
}

export class SpeedStatModifier extends PokemonHeldItemModifier {
  public isTransferable = false;

  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount ?? 1); // 기본 1스택 시작
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof SpeedStatModifier;
  }

  clone(): SpeedStatModifier {
    return new SpeedStatModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  /**
   * 상대를 쓰러뜨릴 때마다 스택 증가
   */
  onKnockout(pokemon: Pokemon) {
    if (this.stackCount < this.getMaxHeldItemCount()) {
      this.stackCount++;
      console.log(`SpeedStatModifier: 스택 증가! 현재 스택: ${this.stackCount}`);
    }
  }

  /**
   * 스피드 적용 (스택당 30%씩 증가)
   */
  override apply(pokemon: Pokemon, stat: Stat, statHolder: NumberHolder): boolean {
    if (stat !== Stat.SPD) return false;

    const speedMultiplier = 1 + this.stackCount * 0.3; // 스택당 30% 증가
    statHolder.value = Math.floor(statHolder.value * speedMultiplier);

    return true;
  }

  getScoreMultiplier(): number {
    return 1.3;
  }

  getMaxHeldItemCount(): number {
    return 5; // 최대 5스택 (최대 2.5배)
  }
}

export class SpAtkStatModifier extends PokemonHeldItemModifier {
  public isTransferable = false;

  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount ?? 1); // 기본 1스택 시작
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof SpAtkStatModifier;
  }

  clone(): SpAtkStatModifier {
    return new SpAtkStatModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  /**
   * 상대를 쓰러뜨릴 때마다 스택 증가
   */
  onKnockout(pokemon: Pokemon) {
    if (this.stackCount < this.getMaxHeldItemCount()) {
      this.stackCount++;
      console.log(`SpAtkStatModifier: 스택 증가! 현재 스택: ${this.stackCount}`);
    }
  }

  /**
   * 특수공격력 적용 (스택당 30%씩 증가)
   */
  override apply(pokemon: Pokemon, stat: Stat, statHolder: NumberHolder): boolean {
    if (stat !== Stat.SPATK) return false; // SPD 대신 SPATK로 변경

    const specialAttackMultiplier = 1 + this.stackCount * 0.3; // 스택당 30% 증가
    statHolder.value = Math.floor(statHolder.value * specialAttackMultiplier);

    return true;
  }

  getScoreMultiplier(): number {
    return 1.3;
  }

  getMaxHeldItemCount(): number {
    return 5; // 최대 5스택 (최대 2.5배)
  }
}

export class AtkStatModifier extends PokemonHeldItemModifier {
  public isTransferable = false;

  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount ?? 1); // 기본 1스택 시작
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof AtkStatModifier;
  }

  clone(): AtkStatModifier {
    return new AtkStatModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  /**
   * 상대를 쓰러뜨릴 때마다 스택 증가
   */
  onKnockout(pokemon: Pokemon) {
    if (this.stackCount < this.getMaxHeldItemCount()) {
      this.stackCount++;
      console.log(`AtkStatModifier: 스택 증가! 현재 스택: ${this.stackCount}`);
    }
  }

  /**
   * 공격력 적용 (스택당 30%씩 증가)
   */
  override apply(pokemon: Pokemon, stat: Stat, statHolder: NumberHolder): boolean {
    if (stat !== Stat.ATK) return false; // SPD 대신 ATK로 변경

    const attackMultiplier = 1 + this.stackCount * 0.3; // 스택당 30% 증가
    statHolder.value = Math.floor(statHolder.value * attackMultiplier);

    return true;
  }

  getScoreMultiplier(): number {
    return 1.3;
  }

  getMaxHeldItemCount(): number {
    return 5; // 최대 5스택 (최대 2.5배)
  }
}

export class OvercoatModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 장착 가능 개수

  protected negatesWeatherDamage: boolean;
  protected negatesPowderMoves: boolean;
  protected weatherTypes: WeatherType[];

  constructor(
    type: ModifierType,
    pokemonId: number,
    negatesWeatherDamage: boolean,
    negatesPowderMoves: boolean,
    weatherTypes: WeatherType[],
    stackCount?: number,
  ) {
    super(type, pokemonId, stackCount);

    this.negatesWeatherDamage = negatesWeatherDamage;
    this.negatesPowderMoves = negatesPowderMoves;
    this.weatherTypes = weatherTypes;
  }

  clone() {
    return new OvercoatModifier(
      this.type,
      this.pokemonId,
      this.negatesWeatherDamage,
      this.negatesPowderMoves,
      this.weatherTypes,
      this.stackCount,
    );
  }

  getArgs(): any[] {
    return super.getArgs().concat([this.negatesWeatherDamage, this.negatesPowderMoves, this.weatherTypes]);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof OvercoatModifier;
  }

  apply(_pokemon: Pokemon, move: any, weatherType: WeatherType): boolean {
    const currentWeatherType = weatherType ?? WeatherType.NONE;

    if (currentWeatherType === WeatherType.NONE) {
      console.error("날씨 타입이 올바르게 설정되지 않았습니다!");
      return true;
    }

    // 날씨 피해 무효화 조건
    if (this.negatesWeatherDamage && this.weatherTypes.includes(currentWeatherType)) {
      if (_pokemon.id === this.pokemonId) {
        console.log("이 포켓몬은 날씨 피해를 무효화합니다");
        return false; // 날씨 피해를 무효화
      }
    }

    // 가루계열 기술 무효화 조건
    if (this.negatesPowderMoves && move.hasFlag(MoveFlags.POWDER_MOVE)) {
      if (_pokemon.id === this.pokemonId) {
        console.log("이 포켓몬은 가루계열 기술의 영향을 받지 않습니다.");
        // 가루 계열 기술을 사용하는 경우, move가 실행되지 않도록 막음
        move.setFlag(MoveFlags.POWDER_MOVE, false); // 해당 기술이 가루 계열 기술 플래그를 제거
        return false; // 기술을 더 이상 진행하지 않도록 함
      }
    }

    // 가루 계열 기술 보호 메시지 출력
    if (this.negatesPowderMoves && this.checkIfMoveIsPowderMove(_pokemon)) {
      // 이 포켓몬은 가루계열 기술의 영향을 보호하고 있다는 메시지를 큐에 추가
      globalScene.phaseManager.queueMessage(
        i18next.t("modifier:protectPowderMoveApply", {
          pokemonNameWithAffix: getPokemonNameWithAffix(_pokemon),
          typeName: this.type.name,
        }),
      );

      // 가루 계열 기술의 영향을 무효화
      move.setFlag(MoveFlags.POWDER_MOVE, false);
      return false; // 기술을 더 이상 진행하지 않도록 막음
    }

    return true;
  }

  // 기술이 가루 계열 기술인지 체크
  checkIfMoveIsPowderMove(user: Pokemon): boolean {
    const move = user.currentMove;
    return move?.checkFlag(MoveFlags.POWDER_MOVE, user, null) ?? false;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return OvercoatModifier.maxHeldItemCount; // 최대 1개만 장착 가능
  }
}

export class PunchingGloveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1;

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new PunchingGloveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof PunchingGloveModifier;
  }

  /**
   * ✅ 펀치 계열 기술의 위력 1.2배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 펀치 기술일 때만 적용
    if (!move || !this.isPunchingMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[PunchingGloveModifier] ${move.name} → 펀치 기술 1.2배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 펀치 기술 판정 함수
   */
  private isPunchingMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.PUNCHING_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return PunchingGloveModifier.maxHeldItemCount;
  }
}

/**
 * 🪓 베기 기술 위력 1.3배 & 비접촉 처리 아이템
 * SlicingCharmModifier
 * 예: "칼날부적" 또는 "베기부적"
 */
export class SlicingMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new SlicingMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof SlicingMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!move || !this.isSlicingMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[SlicingCharmModifier] ${move.name} → 베기 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isSlicingMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.SLICING_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return SlicingMoveModifier.maxHeldItemCount;
  }
}

/**
 * 🪓 물기 기술 위력 1.3배 & 비접촉 처리 아이템
 * BitingMoveModifier
 * 예: "튼튼한틀니"
 */
export class BitingMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new BitingMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof BitingMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!move || !this.isBitingMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[BitingMoveModifier] ${move.name} → 물기 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isBitingMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.BITING_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return BitingMoveModifier.maxHeldItemCount;
  }
}

export class HeadMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new HeadMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof HeadMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!move || !this.isHeadMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[HeadMoveModifier] ${move.name} → 박치기 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isHeadMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.HEAD_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return HeadMoveModifier.maxHeldItemCount;
  }
}

export class HornMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new HornMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof HornMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!move || !this.isHornMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[HornMoveModifier] ${move.name} → 박치기 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isHornMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.HORN_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return HornMoveModifier.maxHeldItemCount;
  }
}

export class KickMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new KickMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof KickMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!move || !this.isKickMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[KickMoveModifier] ${move.name} → 발치기, 킥 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isKickMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.KICK_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return KickMoveModifier.maxHeldItemCount;
  }
}

export class SpearMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new SpearMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof SpearMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!move || !this.isSpearMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[SpearMoveModifier] ${move.name} → 창, 찌르기 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isSpearMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.SPEAR_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return SpearMoveModifier.maxHeldItemCount;
  }
}

export class WingMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new WingMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof WingMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!move || !this.isWingMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[WingMoveModifier] ${move.name} → 날개 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isWingMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.WING_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return WingMoveModifier.maxHeldItemCount;
  }
}

export class HammerMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new HammerMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof HammerMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!move || !this.isHammerMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[HammerMoveModifier] ${move.name} → 망치, 둔기 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isHammerMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.HAMMER_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return HammerMoveModifier.maxHeldItemCount;
  }
}

export class ClawMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new ClawMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof ClawMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!move || !this.isClawMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[ClawMoveModifier] ${move.name} → 할퀴기 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isClawMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.CLAW_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return ClawMoveModifier.maxHeldItemCount;
  }
}

export class PinchMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new PinchMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof PinchMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!(this instanceof PinchMoveModifier)) return false;
    if (!move || !this.isPinchMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[PinchMoveModifier] ${move.name} → 찝기, 가위 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isPinchMove(move: Move): boolean {
    return move.hasFlag(MoveFlags2.PINCH_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return PinchMoveModifier.maxHeldItemCount;
  }
}

export class BeakMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new BeakMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof BeakMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!(this instanceof BeakMoveModifier)) return false;
    if (!move || !this.isBeakMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[BeakMoveModifier] ${move.name} → 부리, 쪼기 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isBeakMove(move: Move): boolean {
    return move.hasFlag(MoveFlags2.BEAK_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return BeakMoveModifier.maxHeldItemCount;
  }
}

export class DashMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new DashMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof DashMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!(this instanceof DashMoveModifier)) return false;
    if (!move || !this.isDashMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[DashMoveModifier] ${move.name} → 질주 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isDashMove(move: Move): boolean {
    return move.hasFlag(MoveFlags2.DASH_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return DashMoveModifier.maxHeldItemCount;
  }
}

export class SpinMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new SpinMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof SpinMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!(this instanceof SpinMoveModifier)) return false;
    if (!move || !this.isSpinMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[SpinMoveModifier] ${move.name} → 스핀 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isSpinMove(move: Move): boolean {
    return move.hasFlag(MoveFlags2.SPIN_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return SpinMoveModifier.maxHeldItemCount;
  }
}

export class DrillMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new DrillMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof DrillMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!(this instanceof DrillMoveModifier)) return false;
    if (!move || !this.isDrillMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[DrillMoveModifier] ${move.name} → 드릴 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isDrillMove(move: Move): boolean {
    return move.hasFlag(MoveFlags2.DRILL_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return DrillMoveModifier.maxHeldItemCount;
  }
}

export class WhipMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new WhipMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof WhipMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!(this instanceof WhipMoveModifier)) return false;
    if (!move || !this.isWhipMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[WhipMoveModifier] ${move.name} → 채찍 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isWhipMove(move: Move): boolean {
    return move.hasFlag(MoveFlags2.WHIP_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return WhipMoveModifier.maxHeldItemCount;
  }
}

export class WheelMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new WheelMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof WheelMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!(this instanceof WheelMoveModifier)) return false;
    if (!move || !this.isWheelMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[WheelMoveModifier] ${move.name} → 바퀴, 구르기 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isWheelMove(move: Move): boolean {
    return move.hasFlag(MoveFlags2.WHEEL_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return WheelMoveModifier.maxHeldItemCount;
  }
}

export class TailMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new TailMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof TailMoveModifier;
  }

  /**
   * ✅ 베기 계열 기술의 위력 1.3배 및 비접촉 처리
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 베기 기술일 때만 적용
    if (!(this instanceof TailMoveModifier)) return false;
    if (!move || !this.isTailMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    // 비접촉 처리
    move.setFlag(MoveFlags.MAKES_CONTACT, false);

    console.log(`[TailMoveModifier] ${move.name} → 꼬리 기술 1.3배 & 비접촉 처리`);

    return true;
  }

  /**
   * ✅ 베기 기술 판정 함수
   */
  private isTailMove(move: Move): boolean {
    return move.hasFlag(MoveFlags2.TAIL_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return TailMoveModifier.maxHeldItemCount;
  }
}

export class ArrowMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new ArrowMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof ArrowMoveModifier;
  }

  /**
   * ✅ 꼬리 계열 기술의 위력 1.3배 증가
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 꼬리 기술일 때만 적용
    if (!(this instanceof ArrowMoveModifier)) return false;
    if (!move || !this.isArrowMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    console.log(`[ArrowMoveModifier] ${move.name} → 화살 기술 1.3배 적용`);

    return true;
  }

  /**
   * ✅ 꼬리 기술 판정 함수
   */
  private isArrowMove(move: Move): boolean {
    return move.hasFlag(MoveFlags2.ARROW_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return ArrowMoveModifier.maxHeldItemCount;
  }
}

export class BallBombMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new BallBombMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof BallBombMoveModifier;
  }

  /**
   * ✅ 꼬리 계열 기술의 위력 1.3배 증가
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 꼬리 기술일 때만 적용
    if (!(this instanceof BallBombMoveModifier)) return false;
    if (!move || !this.isBallBombMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    console.log(`[BallBombMoveModifier] ${move.name} → 구슬, 폭탄류 기술 1.3배 적용`);

    return true;
  }

  /**
   * ✅ 꼬리 기술 판정 함수
   */
  private isBallBombMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.BALLBOMB_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return BallBombMoveModifier.maxHeldItemCount;
  }
}

export class BoomerangMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new BoomerangMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof BoomerangMoveModifier;
  }

  /**
   * ✅ 꼬리 계열 기술의 위력 1.3배 증가
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 꼬리 기술일 때만 적용
    if (!(this instanceof BoomerangMoveModifier)) return false;
    if (!move || !this.isBoomerangMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    console.log(`[BoomerangMoveModifier] ${move.name} → 부메랑 기술 1.3배 적용`);

    return true;
  }

  /**
   * ✅ 꼬리 기술 판정 함수
   */
  private isBoomerangMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.BOOMERANG_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return BoomerangMoveModifier.maxHeldItemCount;
  }
}

export class ThrowMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new ThrowMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof ThrowMoveModifier;
  }

  /**
   * ✅ 꼬리 계열 기술의 위력 1.3배 증가
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 꼬리 기술일 때만 적용
    if (!(this instanceof ThrowMoveModifier)) return false;
    if (!move || !this.isThrowMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    console.log(`[ThrowMoveModifier] ${move.name} → 떨구기 던지기 기술 1.3배 적용`);

    return true;
  }

  /**
   * ✅ 꼬리 기술 판정 함수
   */
  private isThrowMove(move: Move): boolean {
    return move.hasFlag(MoveFlags2.THROW_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return ThrowMoveModifier.maxHeldItemCount;
  }
}

export class PulseMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new PulseMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof PulseMoveModifier;
  }

  /**
   * ✅ 꼬리 계열 기술의 위력 1.3배 증가
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 꼬리 기술일 때만 적용
    if (!(this instanceof PulseMoveModifier)) return false;
    if (!move || !this.isPulseMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    console.log(`[PulseMoveModifier] ${move.name} → 파동 기술 1.3배 적용`);

    return true;
  }

  /**
   * ✅ 꼬리 기술 판정 함수
   */
  private isPulseMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.PULSE_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return PulseMoveModifier.maxHeldItemCount;
  }
}

export class BeamMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new BeamMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof BeamMoveModifier;
  }

  /**
   * ✅ 꼬리 계열 기술의 위력 1.3배 증가
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 꼬리 기술일 때만 적용
    if (!(this instanceof BeamMoveModifier)) return false;
    if (!move || !this.isBeamMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    console.log(`[BeamMoveModifier] ${move.name} → 빔, 광선 기술 1.3배 적용`);

    return true;
  }

  /**
   * ✅ 꼬리 기술 판정 함수
   */
  private isBeamMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.BEAM_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return BeamMoveModifier.maxHeldItemCount;
  }
}

export class LightMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new LightMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof LightMoveModifier;
  }

  /**
   * ✅ 꼬리 계열 기술의 위력 1.3배 증가
   * @param pokemon 기술을 사용하는 포켓몬
   * @param simulated 시뮬레이션 여부
   * @param damage 현재 대미지(NumberHolder)
   * @param move 기술 객체
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    // 조건: 기술 존재 + 꼬리 기술일 때만 적용
    if (!(this instanceof LightMoveModifier)) return false;
    if (!move || !this.isLightMove(move)) return false;

    // 위력 증가
    damage.value = Math.floor(damage.value * 1.3);

    console.log(`[LightMoveModifier] ${move.name} → 빛 기술 1.3배 적용`);

    return true;
  }

  /**
   * ✅ 꼬리 기술 판정 함수
   */
  private isLightMove(move: Move): boolean {
    return move.hasFlag(MoveFlags2.LIGHT_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return LightMoveModifier.maxHeldItemCount;
  }
}

/**
 * ✅ 꼬리 장식 아이템 — 꼬리 기술 강화 + 특정 MoveFlags 피해 반감
 * - 자신이 사용하는 꼬리 기술의 위력은 1.3배
 * - 자신이 받는 특정 MoveFlags 기술의 피해는 0.5배
 */
export class SoundMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  // ✅ 받는 피해를 줄이는 기술 플래그들 (예: 베기 기술)
  private static readonly reducedFlags: MoveFlags[] = [MoveFlags.SLICING_MOVE];

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new SoundMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof SoundMoveModifier;
  }

  /**
   * ✅ 공격 시: 꼬리 계열 기술의 위력 1.3배 증가
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    if (!(this instanceof SoundMoveModifier)) return false;
    if (!move || !this.isSoundMove(move)) return false;

    damage.value = Math.floor(damage.value * 1.3);
    console.log(`[SoundMoveModifier] ${move.name} → 꼬리 기술 1.3배 적용`);
    return true;
  }

  /**
   * ✅ 방어 시: 특정 MoveFlags 기술의 피해를 0.5배로 감소
   */
  override preDefendModifyDamage(params: PreDefendModifyDamageItemModifierParams): boolean {
    const { move, damage } = params;
    if (!move) return false;

    for (const flag of SoundMoveModifier.reducedFlags) {
      if (move.hasFlag(flag)) {
        damage.value = toDmgValue(damage.value * 0.5);
        console.log(`[SoundMoveModifier] ${move.name} → ${MoveFlags[flag]} 플래그로 인해 받는 피해 0.5배 감소`);
        return true;
      }
    }

    return false;
  }

  /**
   * ✅ 꼬리 기술 판정 함수
   */
  private isSoundMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.SOUND_BASED);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return SoundMoveModifier.maxHeldItemCount;
  }
}

export class WindMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능

  // ✅ 받는 피해를 줄이는 기술 플래그들 (예: 베기 기술)
  private static readonly reducedFlags: MoveFlags[] = [MoveFlags.SLICING_MOVE];

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new WindMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof WindMoveModifier;
  }

  /**
   * ✅ 공격 시: 꼬리 계열 기술의 위력 1.3배 증가
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    if (!(this instanceof WindMoveModifier)) return false;
    if (!move || !this.isWindMove(move)) return false;

    damage.value = Math.floor(damage.value * 1.3);
    console.log(`[WindMoveModifier] ${move.name} → 바람 기술 1.3배 적용`);
    return true;
  }

  /**
   * ✅ 방어 시: 특정 MoveFlags 기술의 피해를 0.5배로 감소
   */
  override preDefendModifyDamage(params: PreDefendModifyDamageItemModifierParams): boolean {
    const { move, damage } = params;
    if (!move) return false;

    for (const flag of WindMoveModifier.reducedFlags) {
      if (move.hasFlag(flag)) {
        damage.value = toDmgValue(damage.value * 0.5);
        console.log(`[WindMoveModifier] ${move.name} → ${MoveFlags[flag]} 플래그로 인해 받는 피해 0.5배 감소`);
        return true;
      }
    }

    return false;
  }

  /**
   * ✅ 꼬리 기술 판정 함수
   */
  private isWindMove(move: Move): boolean {
    return move.hasFlag(MoveFlags.WIND_MOVE);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return WindMoveModifier.maxHeldItemCount;
  }
}

/**
 * ✅ DanceMoveModifier — 무희(춤 기술 복제) + 춤기술 1.3배 아이템
 * - 자신이 사용하는 DANCE_MOVE 기술 위력 1.3배
 * - 다른 포켓몬이 춤 기술을 사용하면 자동 복사 (무희 특성 효과)
 * - PokemonMove / Move 타입 모두 안전 대응
 */
export class DanceMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1;

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new DanceMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof DanceMoveModifier;
  }

  /**
   * ✅ 춤 기술 위력 1.3배
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move | any): boolean {
    const baseMove = this.toBaseMove(move);
    if (!baseMove || !this.isDanceMove(baseMove)) return false;

    damage.value = Math.floor(damage.value * 1.3);
    console.log(`[DanceMoveModifier] ${baseMove.name} → 춤 기술 1.3배 적용`);
    return true;
  }

  /**
   * ✅ 다른 포켓몬이 춤 기술을 사용했을 때 복사 실행 (무희 로직)
   */
  override onPostMoveUsed({
    source,
    move,
    targets,
    simulated,
  }: PostMoveUsedModifierParams): void {
    if (simulated) return;

    const baseMove = this.toBaseMove(move);
    if (!baseMove || !this.isDanceMove(baseMove)) return;

    const dancer = globalScene.getPokemonById(this.pokemonId);
    if (!dancer || dancer.isFainted()) return;

    // 자신이 시전자면 복제 방지
    if (source.id === this.pokemonId) return;

    // 비활성/무효 상태 예외
    const forbiddenTags = [
      BattlerTagType.FLYING,
      BattlerTagType.UNDERWATER,
      BattlerTagType.UNDERGROUND,
      BattlerTagType.HIDDEN,
    ];
    if (dancer.summonData.tags.some(tag => forbiddenTags.includes(tag.tagType))) return;

    console.log(`[DanceMoveModifier] ${dancer.getName()}이(가) ${source.getName()}의 ${baseMove.name}을(를) 따라 춤춥니다!`);

    dancer.turnData.extraTurns++;

    // 공격기/보조기
    if (typeof baseMove.is === "function" && (baseMove.is("AttackMove") || baseMove.is("StatusMove"))) {
      const target = this.getTarget(dancer, source, targets);
      globalScene.phaseManager.unshiftNew("MovePhase", dancer, target, move, MoveUseMode.INDIRECT);
    }
    // 자가버프(SelfStatusMove)
    else if (typeof baseMove.is === "function" && baseMove.is("SelfStatusMove")) {
      globalScene.phaseManager.unshiftNew(
        "MovePhase",
        dancer,
        [dancer.getBattlerIndex()],
        move,
        MoveUseMode.INDIRECT,
      );
    }
  }

  /**
   * ✅ Move / PokemonMove 타입 구분 없이 안전하게 Move 반환
   */
  private toBaseMove(move: any): Move | null {
    if (!move) return null;
    if (typeof move.getMove === "function") return move.getMove(); // PokemonMove
    return move; // Move
  }

  /**
   * ✅ 춤 기술 판정 (PokemonMove / Move 모두 처리)
   */
  private isDanceMove(move: any): boolean {
    const baseMove = this.toBaseMove(move);
    return !!(baseMove && typeof baseMove.hasFlag === "function" && baseMove.hasFlag(MoveFlags.DANCE_MOVE));
  }

  /**
   * ✅ 무희 로직용 타겟 판정
   */
  private getTarget(dancer: Pokemon, source: Pokemon, targets: BattlerIndex[]): BattlerIndex[] {
    if (dancer.isPlayer()) {
      return source.isPlayer() ? targets : [source.getBattlerIndex()];
    }
    return source.isPlayer() ? [source.getBattlerIndex()] : targets;
  }

  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return DanceMoveModifier.maxHeldItemCount;
  }
}

export class DrainMoveModifier extends PokemonHeldItemModifier {
  private static readonly maxHeldItemCount: number = 1; // 최대 1개만 장착 가능
  private static readonly damageBoost: number = 1.5;    // 대미지 배율
  private static readonly healBoost: number = 1.5;      // 흡수량 배율

  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId, 1);
  }

  clone() {
    return new DrainMoveModifier(this.type, this.pokemonId);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof DrainMoveModifier;
  }

  /**
   * ✅ 흡수 기술의 위력 1.5배 증가
   */
  override apply(pokemon: Pokemon, simulated: boolean, damage: NumberHolder, move?: Move): boolean {
    if (!move || !this.isDrainMove(move)) return false;

    // 대미지 증가
    damage.value = Math.floor(damage.value * DrainMoveModifier.damageBoost);

    console.log(`[DrainMoveModifier] ${move.name} → 흡수 기술 위력 ${DrainMoveModifier.damageBoost}배 적용`);
    return true;
  }

  /**
   * ✅ 흡수 기술 판정 함수
   * (HitHealAttr을 가진 기술일 경우)
   */
  private isDrainMove(move: Move): boolean {
    return move.hasAttr(HitHealAttr);
  }

  /**
   * ✅ 포켓몬이 장착 가능한 최대 개수 (1개 제한)
   */
  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return DrainMoveModifier.maxHeldItemCount;
  }

  /**
   * ✅ 흡수량 1.5배 증가 처리
   * PostMoveUsed 이벤트에서 발동
   */
  override onPostMoveUsed({ source, move, simulated }: PostMoveUsedModifierParams): void {
    if (simulated || !move || !this.isDrainMove(move)) return;

    const lastDamage = source.turnData.singleHitDamageDealt ?? 0;
    const healAmount = Math.floor(lastDamage * (DrainMoveModifier.healBoost - 1) * 0.5);

    if (healAmount > 0) {
      source.heal(healAmount);
      console.log(`[DrainMoveModifier] ${move.name} → 추가 회복 ${healAmount} 적용`);
    }
  }

  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return DrainMoveModifier.maxHeldItemCount;
  }
}


/**
 * Modifies item effects to ignore additional move effects from tools.
 * @extends PokemonHeldItemModifier
 */
export class IgnoreMoveEffectsItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  matchType(modifier: Modifier) {
    return modifier instanceof IgnoreMoveEffectsItemModifier;
  }

  override clone() {
    return new IgnoreMoveEffectsItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * 부가효과(secondary effect)만 무효화하도록 변경
   */
  applyMoveEffect(pokemon: Pokemon, attacker: Pokemon, move: Move, args: [NumberHolder]): void {
    const effectChance = args[0];

    // 🟢 NumberHolder이고 확률이 0보다 큰 경우만 무효화
    // 즉, 순수 변화기(100% 고정효과)는 여기서 막지 않음
    if (effectChance instanceof NumberHolder && effectChance.value > 0) {
      effectChance.value = 0;
      console.debug(`[IgnoreMoveEffectsItemModifier] ${pokemon.name}의 부가효과 무효화`);
    }
  }

  canApplyMoveEffect(pokemon: Pokemon, attacker: Pokemon, move: Move, args: [NumberHolder]): boolean {
    const effectChance = args[0];
    return effectChance instanceof NumberHolder && effectChance.value > 0;
  }

  override shouldApply(pokemon?: Pokemon, moveType?: Type, movePower?: NumberHolder): boolean {
    return (
      super.shouldApply(pokemon, moveType, movePower) &&
      typeof moveType === "number" &&
      movePower instanceof NumberHolder
    );
  }

  override getMaxHeldItemCount(pokemon: Pokemon): number {
    return 1;
  }
}

export class MaxMultiHitModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  matchType(modifier: Modifier) {
    return modifier instanceof MaxMultiHitModifier;
  }

  clone() {
    return new MaxMultiHitModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * 다단히트 기술의 공격 횟수를 최대치로 설정
   * @param pokemon 공격하는 포켓몬
   * @param move 사용된 기술
   * @param hitCount 기본 공격 횟수
   * @returns 속임수주사위 효과가 적용되면 최대 횟수(5), 아니면 기존 값 유지
   */
  applyMultiHit(pokemon: Pokemon, move: Move, hitCount: number): number {
    console.log("[DEBUG] MaxMultiHitModifier 적용됨", { moveId: move.id, originalHitCount: hitCount });

    // 속임수주사위가 적용된 포켓몬이 MultiHitAttr을 가진 경우, 최대 히트 수로 설정
    const multiHitAttr = move.getAttrs(MultiHitAttr)[0];
    if (pokemon.id === this.pokemonId && multiHitAttr) {
      return multiHitAttr.getMaxHitCount(); // 5회 공격 보장
    }

    return hitCount;
  }

  override apply(pokemon: Pokemon): boolean {
    let multiHitBoosted = false;

    if (pokemon.id === this.pokemonId) {
      multiHitBoosted = true;
    }

    return multiHitBoosted;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1; // 한 포켓몬에 하나만 적용
  }
}

/**
 * Modifier used for held items that boost special attack when using a sound-based move.
 * Triggers after using a sound-based move, increasing special attack by 1 stage.
 * @extends PokemonHeldItemModifier
 */
export class SoundBasedMoveSpecialAttackBoostModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount = 1) {
    super(type, pokemonId);
    this.stackCount = stackCount;
  }

  /**
   * Checks if the modifier matches another modifier of the same type and stack count.
   * @param modifier The modifier to compare
   * @returns `true` if modifiers are of the same type and stack count, `false` otherwise
   */
  matchType(modifier: Modifier): boolean {
    return modifier instanceof SoundBasedMoveSpecialAttackBoostModifier;
  }

  /**
   * Clones the modifier.
   * @returns A new instance of SoundBasedMoveSpecialAttackBoostModifier
   */
  clone(): SoundBasedMoveSpecialAttackBoostModifier {
    return new SoundBasedMoveSpecialAttackBoostModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Checks if the modifier can be applied to the given Pokémon.
   * @param pokemon The Pokémon to check
   * @returns `true` if the modifier can be applied, `false` otherwise
   */
  canApply(pokemon: Pokemon): boolean {
    if (!pokemon.currentMove) {
      return false;
    }

    if (!pokemon.currentMove.hasFlag(MoveFlags.SOUND_BASED)) {
      console.debug("[DEBUG] 소리 기반 기술이 아닙니다.");
      return false;
    }

    // 🔽 이 줄을 이렇게 바꿔야 함!
    const hasExistingModifier = pokemon.getHeldItems(SoundBasedMoveSpecialAttackBoostModifier);

    return hasExistingModifier; // 갖고 있어야만 발동됨
  }

  /**
   * Applies the effect of Throat Spray when a sound-based move is used.
   * Increases the special attack by 1 stage.
   * @param pokemon The Pokémon using the move
   * @param moveType The type of the move being used
   * @param movePower The power of the move
   * @returns `true` if the effect was applied, `false` otherwise
   */
  override apply(pokemon: Pokemon, moveType: Type, movePower: NumberHolder): boolean {
    if (!this.canApply(pokemon)) {
      return false;
    }

    // 특수공격 상승 효과 적용
    globalScene.phaseManager.unshiftNew(
  "StatStageChangePhase",
  pokemon.getBattlerIndex(),
  true,              // 아군/적 여부
  [Stat.SPATK],      // 스탯 배열
  1,                 // 단계 수 (+1)
  true,              // 메시지 표시 여부
);

    // preserve 적용 - 아이템이 소모되지 않도록 할 수 있는지 체크
    const preserve = new BooleanHolder(false);
    globalScene.applyModifiers(PreserveItemModifier, pokemon.isPlayer(), pokemon, preserve, "item");

    // preserve가 false일 경우만 아이템을 소모
    if (!preserve.value) {
      if (this.stackCount > 1) {
        this.stackCount--;
      } else {
        globalScene.removeModifier(this);
      }
    }

    return true;
  }

  /**
   * Returns the maximum number of this item that can be held by a Pokémon.
   * @param pokemon The Pokémon holding the item
   * @returns The maximum number of items that can be held
   */
  getMaxHeldItemCount(pokemon: Pokemon): number {
    return 6; // 최대 6개까지 장착 가능
  }

  /**
   * Returns the current stack count of this modifier.
   * @returns The stack count
   */
  getStackCount(): number {
    return this.stackCount;
  }
}

export class AlwaysMoveLastModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  matchType(modifier: Modifier) {
    return modifier instanceof AlwaysMoveLastModifier;
  }

  clone() {
    return new AlwaysMoveLastModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Forces the holder to always move last
   * @param pokemon the {@linkcode Pokemon} that holds the item
   * @param doBypassSpeed {@linkcode BooleanHolder} that determines if speed should be ignored
   * @returns `true` if {@linkcode AlwaysMoveLastModifier} has been applied
   */
  override apply(pokemon: Pokemon, doBypassSpeed: BooleanHolder): boolean {
    doBypassSpeed.value = true; // 속도를 무시
    return true;
  }

  getMaxHeldItemCount(pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * Modifies item effects to ignore weather effects on the Pokémon.
 * @extends PokemonHeldItemModifier
 */
export class IgnoreWeatherEffectsItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  matchType(modifier: Modifier) {
    return modifier instanceof IgnoreWeatherEffectsItemModifier;
  }

  /**
   * Deep copy (clone) of the modifier instance.
   * @returns A new instance of IgnoreWeatherEffectsItemModifier.
   */
  override clone() {
    return new IgnoreWeatherEffectsItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Applies the modification to ignore weather effects for the held item.
   * @param pokemon The Pokémon that is holding the item.
   * @param weather The current weather condition.
   * @param cancelled A BooleanHolder to determine if the effect should be cancelled.
   */
  applyWeatherEffect(pokemon: Pokemon, weather: Weather, cancelled: Utils.BooleanHolder): void {
    cancelled.value = true; // Cancel any weather effect for this Pokémon
  }

  /**
   * Determines whether the modifier applies to the given scenario.
   * @param pokemon The Pokémon whose item is being evaluated.
   * @param weather The current weather condition.
   * @returns True if the modifier can be applied.
   */
  canApplyWeatherEffect(pokemon: Pokemon, weather: Weather): boolean {
    // Check if this item should be applied based on whether weather is present
    return !!weather; // Apply if there is a weather condition
  }

  /**
   * Determines whether the modifier should apply based on the Pokémon and the weather.
   * @param pokemon The Pokémon whose item is being evaluated.
   * @param weather The current weather condition.
   * @returns True if the modifier should apply.
   */
  override shouldApply(pokemon?: Pokemon, weather?: Weather): boolean {
    if (!pokemon || !weather) return false;
    return this.pokemonId === pokemon.id;
  }

  /**
   * Gets the maximum number of items this modifier can be applied to.
   * @param pokemon The Pokémon using the item.
   * @returns Maximum number of items allowed.
   */
  override getMaxHeldItemCount(pokemon: Pokemon): number {
    return 1; // Only one item modifier can be applied to a Pokémon
  }
}

/**
 * Modifier used for held items, namely Light Clay, that extend the duration
 * of Reflect, Light Screen, and Aurora Veil effects.
 * @extends PokemonHeldItemModifier
 * @see {@linkcode apply}
 */
export class WeakenMoveScreenModifier extends PokemonHeldItemModifier {
  /**
   * Extends the duration of specific protective screen effects by 2 turns.
   * @param pokemon {@linkcode Pokemon} that holds the held item
   * @param screenDuration {@linkcode NumberHolder} that stores the current screen effect duration
   * @param tagType {@linkcode ArenaTagType} of the effect being modified
   * @returns `true` if the screen duration extension was applied successfully
   */
  override apply(_pokemon: Pokemon, screenDuration: NumberHolder, tagType: ArenaTagType): boolean {
    // ArenaTagType을 정확하게 비교해야 함
    if (
      tagType === ArenaTagType.REFLECT ||
      tagType === ArenaTagType.LIGHT_SCREEN ||
      tagType === ArenaTagType.AURORA_VEIL
    ) {
      screenDuration.value += 2; // 빛의점토 효과로 2턴 연장
      return true;
    }
    return false;
  }

  override matchType(modifier: Modifier): boolean {
    return modifier instanceof WeakenMoveScreenModifier;
  }

  override clone(): WeakenMoveScreenModifier {
    return new WeakenMoveScreenModifier(this.type, this.pokemonId, this.stackCount);
  }

  override getMaxHeldItemCount(_pokemon?: Pokemon): number {
    return 2; // 최대 2개까지 소지 가능
  }
}

export class BoostEnergyModifier extends PokemonHeldItemModifier {
  private boostedStats: { statList: BattleStat[]; multiplier: number }[] = [];

  constructor(type: string, pokemonId: number, stackCount: number) {
    super(type, pokemonId, stackCount);
  }

  private areStatListsEqual(a: BattleStat[], b: BattleStat[]): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
  }

  override apply(pokemon: Pokemon, ...args: any[]): boolean {
    const ability = pokemon.abilityId;

    // Boost Energy로 발동 가능한 특성 목록
    const allowedAbilities = [
      AbilityId.PROTOSYNTHESIS,
      AbilityId.QUARK_DRIVE,
      AbilityId.PLUVIAFLUX,
      AbilityId.CRYOSYNTHESIS,
      AbilityId.PHYTONCIDE,
      AbilityId.PSAMMOSYNTHESIS,
      AbilityId.UNSEEN_FORCE,
      AbilityId.NEURO_CHARGE,
    ];

    if (!allowedAbilities.includes(ability)) {
      console.log(`[BoostEnergyModifier] ${pokemon.name}은 Boost Energy 대상 특성이 아님 (${ability}).`);
      return false;
    }

    const statList = args[0] as BattleStat[];
    const multiplier = args[1] as number;
    if (!statList?.length || multiplier == null || multiplier <= 0) return false;

    for (const { statList: existingStatList } of this.boostedStats) {
      if (this.areStatListsEqual(existingStatList, statList)) return false;
    }

    this.boostedStats.push({ statList, multiplier });

    // 특성별 태그 타입 결정
    let tagType: BattlerTagType;
    switch (ability) {
      case AbilityId.PROTOSYNTHESIS:
        tagType = BattlerTagType.PROTOSYNTHESIS;
        break;
      case AbilityId.QUARK_DRIVE:
        tagType = BattlerTagType.QUARK_DRIVE;
        break;
      case AbilityId.PLUVIAFLUX:
        tagType = BattlerTagType.PLUVIAFLUX;
        break;
      case AbilityId.CRYOSYNTHESIS:
        tagType = BattlerTagType.CRYOSYNTHESIS;
        break;
      case AbilityId.PHYTONCIDE:
        tagType = BattlerTagType.PHYTONCIDE;
        break;
      case AbilityId.PSAMMOSYNTHESIS:
        tagType = BattlerTagType.PSAMMOSYNTHESIS;
        break;
      case AbilityId.UNSEEN_FORCE:
        tagType = BattlerTagType.UNSEEN_FORCE;
        break;
      case AbilityId.NEURO_CHARGE:
        tagType = BattlerTagType.NEURO_CHARGE;
        break;
      default:
        tagType = BattlerTagType.HIGHEST_STAT_BOOST;
        break;
    }

    // 태그 부여
    new BoostEnergyTagAttr(tagType).apply(pokemon, false, false, null, []);

    // PreserveItemModifier 적용 여부 판단 후 소모 처리
    const preserve = new BooleanHolder(false);
    globalScene.applyModifiers(PreserveItemModifier, pokemon.isPlayer(), pokemon, preserve, "item");

    if (!preserve.value) {
      // 메시지 출력
      globalScene.phaseManager.queueMessage(
        i18next.t("modifier:boostEnergyItemUsed", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          itemName: "Boost Energy",
        }),
      );

      // stackCount 감소 or 제거
      if (this.stackCount > 1) {
        this.stackCount--;
      } else {
        globalScene.removeModifier(this);
      }
    }

    return true;
  }

  override onTurnEnd(): void {
    const pokemon = this.getPokemon();
    if (!pokemon || this.boostedStats.length === 0) return;

    // 저장된 능력치 부스트 적용
    for (const { statList, multiplier } of this.boostedStats) {
      globalScene.phaseManager.unshiftNew(
        "StatStageChangePhase",
        pokemon.getBattlerIndex(),
        true,
        statList,
        multiplier,
        true,
        false,
        false,
      );
    }

    // 상태 초기화 (소모는 apply()에서 이미 처리됨)
    this.boostedStats = [];
  }

  override shouldApply(pokemon?: Pokemon, statList?: BattleStat[], multiplier?: number): boolean {
    return !!pokemon && statList?.length > 0 && (multiplier ?? 0) > 0;
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof BoostEnergyModifier;
  }

  clone() {
    return new BoostEnergyModifier(this.type, this.pokemonId, this.stackCount);
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 10;
  }
}

export class PreserveItemModifier extends PersistentModifier {
  match(modifier: Modifier) {
    return modifier instanceof PreserveItemModifier;
  }

  clone() {
    return new PreserveItemModifier(this.type, this.stackCount);
  }

  override shouldApply(pokemon?: Pokemon, doPreserve?: BooleanHolder, itemType?: string): boolean {
    // 열매면 적용하지 않음
    return !!pokemon && !!doPreserve && itemType !== "berry";
  }

  override apply(pokemon: Pokemon, doPreserve: BooleanHolder, itemType?: string): boolean {
    // 열매면 무조건 소모되게 처리
    if (itemType === "berry") return true;

    // Preserve logic: 30%/60%/90% based on stack count
    if (!doPreserve.value) {
      const chance = this.getStackCount() * 30;
      doPreserve.value = pokemon.randBattleSeedInt(100) < chance;
    }

    return true;
  }

  getMaxStackCount(): number {
    return 3;
  }
}

export class StatStageChangeCopyModifier extends PokemonHeldItemModifier {
  private copiedStats: { statList: BattleStat[]; stage: number }[] = []; // 복사된 능력치 저장
  private applied = false; // ✅ 중복 방지용 플래그

  override apply(pokemon: Pokemon, ...args: any[]): boolean {
    const statList = args[0] as BattleStat[];
    const stage = args[1] as number;

    // 능력치 리스트가 비어있거나 스테이지가 0 이하인 경우 처리 안함
    if (!statList?.length || stage == null || stage <= 0) {
      return false;
    }

    // 중복된 능력치가 복사되지 않도록 체크 (복사된 능력치 중복 방지)
    for (const { statList: existingStatList, stage: existingStage } of this.copiedStats) {
      if (existingStatList === statList && existingStage === stage) {
        return false; // 이미 복사된 능력치라면 중복 적용 방지
      }
    }

    // 중복을 방지하고 능력치 누적
    this.copiedStats.push({ statList, stage });

    const preserve = new BooleanHolder(false);
    globalScene.applyModifiers(PreserveItemModifier, pokemon.isPlayer(), pokemon, preserve, "item");

    // 능력치를 적용
    globalScene.phaseManager.unshiftNew(
  "StatStageChangePhase",
  pokemon.getBattlerIndex(),
  true,
  statList,
  stage,
  true,
  false,
  false,
);

    if (!preserve.value) {
      if (this.stackCount > 1) {
        this.stackCount--;
      } else {
        globalScene.removeModifier(this);
      }
    }

    return true; // 성공적으로 적용됨
  }

  override onTurnEnd(): void {
    const pokemon = this.getPokemon();
    if (!pokemon || this.copiedStats.length === 0) return;

    const preserve = new BooleanHolder(false);
    globalScene.applyModifiers(PreserveItemModifier, pokemon.isPlayer(), pokemon, preserve, "item");

    // 복사된 능력치를 한 번에 처리
    for (const { statList, stage } of this.copiedStats) {
  globalScene.phaseManager.unshiftNew(
    "StatStageChangePhase",
    pokemon.getBattlerIndex(),
    true,
    statList,
    stage,
    true,
    false,
    false,
  );
}

    // 아이템 소모 처리
    if (!preserve.value) {
      if (this.stackCount > 1) {
        this.stackCount--;
      } else {
        globalScene.removeModifier(this);
      }
    }

    // 복사된 능력치 초기화
    this.copiedStats = [];
  }

  override shouldApply(pokemon?: Pokemon, statList?: BattleStat[], stage?: number): boolean {
    return !!pokemon && statList?.length > 0 && (stage ?? 0) > 0;
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof StatStageChangeCopyModifier;
  }

  clone() {
    return new StatStageChangeCopyModifier(this.type, this.pokemonId, this.stackCount);
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 10;
  }
}

export class PostBattleLootItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): PostBattleLootItemModifier {
    return new PostBattleLootItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof PostBattleLootItemModifier;
  }

  // 배열에서 랜덤 아이템 가져오기 
  private getRandomItemFromArray<T>(arr: T[]): T | null {
    if (!arr || arr.length === 0) return null; 
    const index = Math.floor(Math.random() * arr.length); 
    return arr[index]; 
  }

  override applyPostBattle(pokemon: Pokemon, passive: boolean, simulated: boolean, args: any[]): void {
    const postBattleLoot = globalScene.currentBattle.postBattleLoot;
    const randItem = this.getRandomItemFromArray(postBattleLoot);

    if (!randItem) return;

    const success = globalScene.tryTransferHeldItemModifier(randItem, pokemon, true, 1, true, undefined, false);

    if (success) {
      postBattleLoot.splice(postBattleLoot.indexOf(randItem), 1);
      globalScene.phaseManager.queueMessage(
        i18next.t("modifier:treasureBagLoot", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          itemName: randItem.type.name,
        }),
      );
    }
  }

  override hasPostBattleEffect(): boolean {
    return true;
  }

  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1; // ✅ 무조건 1개만
  }

  applyPostBattleIfPossible(pokemon: Pokemon, didWin: boolean): void {
    const postBattleLoot = globalScene.currentBattle.postBattleLoot;
    const simulated = false;

    if (!didWin || postBattleLoot.length === 0) {
      return;
    }

    let canTransfer = false;
    for (const item of postBattleLoot) {
      if (globalScene.canTransferHeldItemModifier(item, pokemon, 1)) canTransfer = true;
    }

    if (canTransfer) {
      this.applyPostBattle(pokemon, false, simulated, [didWin]);
    }
  }
}

export class TypeImmunityModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId);
    this.stackCount = 1; // 풍선은 최대 1개만 소지 가능
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof TypeImmunityModifier;
  }

  clone() {
    return new TypeImmunityModifier(this.type, this.pokemonId);
  }

  /**
   * 배틀 시작 시: 풍선이 있다면 FLOATING 태그 부여 및 메시지 출력
   */
  onBattleStart(playerPokemon: PlayerPokemon): void {
    const heldItem = playerPokemon.getHeldItem();

    if (heldItem?.name === "Air Balloon") {
      playerPokemon.addTag(BattlerTagType.FLOATING); // 부유 상태 부여
      globalScene.phaseManager.queueMessage(
        i18next.t("modifier:airBalloonActivated", {
          pokemonNameWithAffix: getPokemonNameWithAffix(playerPokemon),
        }),
      );
    }
  }

  /**
   * 피해를 입기 전: 풍선의 효과 적용
   */
  applyPreDefend(
    playerPokemon: PlayerPokemon,
    passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: Utils.BooleanHolder,
    args: any[],
  ): boolean {
    const heldItem = playerPokemon.getHeldItem();
    if (!heldItem || heldItem.name !== "Air Balloon") {
      return false;
    }

    // ① 땅타입 기술 무효화 (단, 사우전드애로우는 무효화 불가)
    if (
      move.type === PokemonType.GROUND &&
      move.category !== MoveCategory.STATUS &&
      !move.hasAttr(NeutralDamageAgainstFlyingTypeMultiplierAttr)
    ) {
      cancelled.value = true; // 피해 무효화
      return true;
    }

    // ② 땅 타입이 아닌 공격 기술을 맞은 경우 → 풍선 소모 처리
    if (
      move.type !== PokemonType.GROUND &&
      move.category !== MoveCategory.STATUS &&
      move.hasAttr(NeutralDamageAgainstFlyingTypeMultiplierAttr)
    ) {
      const preserve = new BooleanHolder(false);
      globalScene.applyModifiers(PreserveItemModifier, playerPokemon.isPlayer(), playerPokemon, preserve, "item");

      if (!preserve.value) {
        this.loseHeldItem(heldItem); // 풍선 제거
        globalScene.updateModifiers(playerPokemon); // 모디파이어 업데이트
        playerPokemon.removeTag(BattlerTagType.FLOATING); // 부유 상태 제거

        globalScene.phaseManager.queueMessage(
          i18next.t("modifier:balloonPopped", {
            pokemonNameWithAffix: getPokemonNameWithAffix(playerPokemon),
            itemName: heldItem.name,
          }),
        );
      }
    }

    return false;
  }

  getMaxHeldItemCount(playerPokemon: PlayerPokemon): number {
    return 1;
  }

  /**
   * apply 시에도 FLOATING 태그를 부여하여 안정성 확보
   */
  apply(pokemon: Pokemon): boolean {
    if (pokemon.id !== this.pokemonId) return false;

    pokemon.addTag(BattlerTagType.FLOATING);
    return true;
  }
}

export class MentalHerbModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount = 1) {
    super(type, pokemonId, stackCount);
  }

  clone(): MentalHerbModifier {
    return new MentalHerbModifier(this.type, this.pokemonId, this.stackCount);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof MentalHerbModifier;
  }

  getStackCount(): number {
    return this.stackCount;
  }

  /**
   * 턴 시작 시, 이미 걸려 있는 특정 상태를 1회 해제합니다. (보존 가능성 반영)
   */
  apply(pokemon: Pokemon): boolean {
    if (pokemon.id !== this.pokemonId) return false;

    const removableTags: BattlerTagType[] = [
      BattlerTagType.TAUNT,
      BattlerTagType.TORMENT,
      BattlerTagType.ENCORE,
      BattlerTagType.INFATUATED,
      BattlerTagType.HEAL_BLOCK,
      BattlerTagType.DISABLED,
      BattlerTagType.PERISH_SONG,
    ];

    let tagRemoved = false;

    for (const tag of removableTags) {
      if (pokemon.getTag(tag)) {
        pokemon.removeTag(tag); // 실제로 제거
        tagRemoved = true;

        globalScene.phaseManager.queueMessage(
          i18next.t("modifier:itemMentalHerbTauntRemoved", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            typeName: this.type.name,
          }),
        );
      }
    }

    if (tagRemoved) {
      const preserve = new BooleanHolder(false);
      globalScene.applyModifiers(PreserveItemModifier, pokemon.isPlayer(), pokemon, preserve, "item");

      if (!preserve.value) {
        if (this.stackCount > 1) {
          this.stackCount--;
        } else {
          const heldPokemon = globalScene.getPokemonById(this.pokemonId);
          if (heldPokemon) {
            heldPokemon.loseHeldItem(this);
          }
          globalScene.removeModifier(this);
        }
      }

      globalScene.updateModifiers(pokemon); // UI 반영
    }

    return tagRemoved; // 상태 제거가 있었는지 여부를 반환
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 10; // 멘탈허브는 최대 10개까지 들 수 있음 (이 부분은 수정할 필요가 있을 수 있습니다)
  }
}

export class InstantChargeItemModifier extends PokemonHeldItemModifier {
  override apply(pokemon: Pokemon): boolean {
    const move = pokemon.currentMove;

    if (!move || !(move instanceof ChargingMove)) return false;

    // 이미 충전 효과가 적용되었으면 다시 적용하지 않음
    if (move.hasChargeAttr(InstantChargeAttr)) return false;

    // 아이템 효과 적용 (즉시 충전)
    move.chargeAttr = new InstantChargeAttr(() => true);

    // 아이템 보존 여부 확인
    const preserve = new BooleanHolder(false);
    globalScene.applyModifiers(PreserveItemModifier, pokemon.isPlayer(), pokemon, preserve, "item");

    if (!preserve.value) {
      // 아이템 소모
      globalScene.phaseManager.queueMessage(
        i18next.t("modifier:instantChargeItemUsed", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          itemName: "Powerful Herb",
        }),
      );

      // 스택 수 감소 또는 아이템 삭제
      if (this.stackCount > 1) {
        this.stackCount--;
      } else {
        globalScene.removeModifier(this);
      }
    }

    return true;
  }

  override shouldApply(pokemon?: Pokemon): boolean {
    if (!pokemon) {
      console.log("No pokemon provided");
      return false;
    }

    const move = pokemon.currentMove;
    if (!move) {
      console.log("No current move set for this Pokemon.");
      return false;
    }

    console.log("Checking if current move is ChargingMove for pokemon: ", move);

    // move가 ChargingAttackMove 또는 ChargingSelfStatusMove일 경우에만 true
    return move instanceof ChargingMove;
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof InstantChargeItemModifier;
  }

  clone() {
    return new InstantChargeItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 10;
  }
}

/**
 * Modifier used for held items that increase critical-hit damage multiplier.
 * Applies only when a critical hit occurs.
 * @extends PokemonHeldItemModifier
 * @see {@linkcode apply}
 */
export class CritDamageBoostModifier extends PokemonHeldItemModifier {
  /** Multiplier applied to the critical-hit damage (e.g., 1.3 for 30% boost) */
  protected critMultiplier: number;

  constructor(type: ModifierType, pokemonId: number, critMultiplier: number, stackCount?: number) {
    super(type, pokemonId, stackCount);

    this.critMultiplier = critMultiplier;
  }

  clone() {
    return new CritDamageBoostModifier(this.type, this.pokemonId, this.critMultiplier, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.critMultiplier);
  }

  matchType(modifier: Modifier): boolean {
    if (modifier instanceof CritDamageBoostModifier) {
      return (modifier as CritDamageBoostModifier).critMultiplier === this.critMultiplier;
    }

    return false;
  }

  /**
   * Multiplies the critical-hit damage by {@linkcode critMultiplier} if a critical hit occurs.
   * @param _pokemon {@linkcode Pokemon} N/A
   * @param critDamageMult {@linkcode NumberHolder} that holds the resulting critical-hit damage multiplier
   * @returns `true` if the multiplier was applied
   */
  override apply(_pokemon: Pokemon, critDamageMult: NumberHolder): boolean {
    if (critDamageMult.value > 1) {
      critDamageMult.value *= this.critMultiplier;
      return true;
    }
    return false;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

export class NotEffectiveBoostModifier extends PokemonHeldItemModifier {
  private multiplier: number;

  constructor(type: ModifierType, pokemonId: number, multiplier: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
    this.multiplier = multiplier;
  }

  clone() {
    return new NotEffectiveBoostModifier(this.type, this.pokemonId, this.multiplier, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.multiplier);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof NotEffectiveBoostModifier && modifier.multiplier === this.multiplier;
  }

  /**
   * 효과가 별로인 기술인지 판별하는 로직을 추가
   */
  override shouldApply(pokemon?: Pokemon, move?: Move, typeMultiplier?: number): boolean {
    return super.shouldApply(pokemon) && typeMultiplier < 1; // 효과가 별로인 경우에만 적용
  }

  /**
   * 기술 피해에 보너스 적용 (아이템 효과)
   */
  override apply(pokemon: Pokemon, attrList: PreAttackAbAttr[]): boolean {
    // `shouldApply`에서 `true`일 때만 이 코드가 실행될 것입니다.
    attrList.push(
      new DamageBoostAbAttr(this.multiplier, (user, target, move) => {
        return (target?.getMoveEffectiveness(user!, move) ?? 1) <= 0.5;
      }),
    );
    return true;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * Modifier used for held items that increase the power of moves with 60 or less power.
 * Applies only when the move power is 60 or less.
 * @extends PokemonHeldItemModifier
 * @see {@linkcode apply}
 */
export class MovePowerBoostItemModifier extends PokemonHeldItemModifier {
  /** Multiplier applied to the move's power (e.g., 1.5 for 50% boost) */
  protected powerMultiplier: number;

  constructor(type: ModifierType, pokemonId: number, powerMultiplier: number, stackCount?: number) {
    super(type, pokemonId, stackCount);

    this.powerMultiplier = powerMultiplier;
  }

  clone() {
    return new MovePowerBoostItemModifier(this.type, this.pokemonId, this.powerMultiplier, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.powerMultiplier);
  }

  matchType(modifier: Modifier): boolean {
    if (modifier instanceof MovePowerBoostItemModifier) {
      return (modifier as MovePowerBoostItemModifier).powerMultiplier === this.powerMultiplier;
    }

    return false;
  }

  /**
   * Multiplies the move power by {@linkcode powerMultiplier} if the move power is 60 or less.
   * @param _pokemon {@linkcode Pokemon} N/A
   * @param move {@linkcode Move} The move being used
   * @param power {@linkcode NumberHolder} that holds the resulting move power
   * @returns `true` if the multiplier was applied
   */
  override apply(_pokemon: Pokemon, move: Move, power: NumberHolder): boolean {
    // Check if the move's power is 60 or less
    if (move.power <= 60) {
      // Apply the power multiplier
      power.value *= this.powerMultiplier;
      return true;
    }
    return false;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1; // Only one item can be held at a time
  }
}

/**
 * Modifier used for held items that boost recoil move power and block recoil damage.
 * @extends PokemonHeldItemModifier
 * @see {@linkcode applyMovePower} and {@linkcode applyBlockRecoil}
 */
export class RecoilBoosterModifier extends PokemonHeldItemModifier {
  /** The multiplier applied to the recoil move's power */
  protected powerMultiplier: number;

  constructor(type: ModifierType, pokemonId: number, powerMultiplier: number, stackCount?: number) {
    super(type, pokemonId, stackCount);

    this.powerMultiplier = powerMultiplier;
  }

  clone(): RecoilBoosterModifier {
    return new RecoilBoosterModifier(this.type, this.pokemonId, this.powerMultiplier, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.powerMultiplier);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof RecoilBoosterModifier && modifier.powerMultiplier === this.powerMultiplier;
  }

  /**
   * Boosts the power of recoil moves.
   * @param _pokemon The Pokémon using the move
   * @param move The move being used
   * @param powerHolder A holder for the current power value
   * @returns true if applied
   */
  apply(_pokemon: Pokemon, damage: NumberHolder, move: Move): boolean {
    if (move.hasAttr(RecoilAttr)) {
      damage.value = Math.floor(damage.value * this.powerMultiplier);
    }
    return true;
  }

  /**
   * Cancels recoil damage if the move has recoil.
   * Called in RecoilAttr.apply() through applyItemAttrs.
   * @param _pokemon The Pokémon that would take recoil
   * @param _passive Unused
   * @param _simulated Unused
   * @param cancelled BooleanHolder that will be set to true to block recoil
   * @returns void
   */
  applyBlockRecoil(cancelled: Utils.BooleanHolder): void {
    cancelled.value = true;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

export class MoveAbilityBypassModifier extends PokemonHeldItemModifier {
  // 특정 조건에서만 특성을 무시하도록 커스텀 함수
  moveIgnoreFunc: (user: Pokemon, target: Pokemon, move: Move) => boolean;

  constructor(type: ModifierType, pokemonId: number, stackCount: number) {
    super(type, pokemonId, stackCount);
    // 기본값: 모든 공격에서 상대 특성을 무시
    this.moveIgnoreFunc = () => true;
  }

  /**
   * 공격 시 호출되는 apply
   * bypass.value를 true로 설정하면 상대 특성을 무시
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, bypass: Utils.BooleanHolder): boolean {
  if (this.moveIgnoreFunc(user, target, move)) {
    console.log(`[MABM] ${user.name} uses ${move.name}, bypassing ${target.name}'s ability`);
    bypass.value = true;
    return true;
  }
  return false;
}

  override matchType(modifier: Modifier): boolean {
    return modifier instanceof MoveAbilityBypassModifier;
  }

  override clone(): MoveAbilityBypassModifier {
    const clone = new MoveAbilityBypassModifier(this.type, this.pokemonId, this.stackCount);
    clone.moveIgnoreFunc = this.moveIgnoreFunc;
    return clone;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

export class VictoryStatBoostModifier extends PokemonHeldItemModifier {
  protected stages: number;

  constructor(type: ModifierType, pokemonId: number, stages: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
    this.stages = stages;
  }

  clone(): VictoryStatBoostModifier {
    return new VictoryStatBoostModifier(this.type, this.pokemonId, this.stages, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.stages);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof VictoryStatBoostModifier && modifier.stages === this.stages;
  }

  /**
   * 이 Modifier가 적용 가능한지 판단하는 함수
   * applyModifier(...) 내에서 자동으로 호출됨
   */
  shouldApply(pokemon: Pokemon, stages: number): boolean {
    console.log("[VictoryStatBoostModifier] shouldApply 호출됨", pokemon.name, stages);
    return true;
  }

  /**
   * apply 메서드 정의
   * 이 메서드는 능력치 상승을 실제로 적용하는 메서드입니다.
   * @param pokemon 포켓몬
   * @param stages 능력치 상승 단계
   * @returns 성공 여부
   */
  apply(pokemon: Pokemon, stages: number): boolean {
    // 포켓몬의 능력치를 상승시킴
    const statToBoost: EffectiveStat | null = this.getHighestEffectiveStat(pokemon);

    if (statToBoost !== null) {
      console.log(`Applying stat boost: ${statToBoost} by ${stages} stages`);

      // Stat stage를 조정하는 로직 (예: 최대 6단계까지)
      const currentStage = pokemon.getStatStage(statToBoost);
      const newStage = Math.min(currentStage + stages, 6); // 6단계가 최대
      pokemon.setStatStage(statToBoost, newStage);

      return true;
    }

    console.log("No stat to boost");
    return false;
  }

  /**
   * 능력치 중 가장 효율적인 능력치를 선택하는 헬퍼 함수
   * @param pokemon 포켓몬
   * @returns 가장 높은 효율적인 능력치
   */
  private getHighestEffectiveStat(pokemon: Pokemon): EffectiveStat | null {
    let highestStat: EffectiveStat | null = null;
    let highestValue = Number.NEGATIVE_INFINITY;

    for (const stat of EFFECTIVE_STATS) {
      const value = pokemon.getStat(stat, false);
      if (value > highestValue) {
        highestValue = value;
        highestStat = stat;
      }
    }

    return highestStat;
  }

  /**
   * 승리 후 능력치 변화 처리
   */
  applyPostVictory(attacker: Pokemon, _defender: Pokemon, _move: Move | undefined, simulated: boolean): void {
    // 승리 후 능력치 변화 처리 (이미 구현되어 있음)
    // 필요시 위의 apply 메서드를 호출하여 능력치 상승을 적용
    let highestStat: EffectiveStat | null = null;
    let highestValue = Number.NEGATIVE_INFINITY;

    for (const stat of EFFECTIVE_STATS) {
      const value = attacker.getStat(stat, false);
      const currentStage = attacker.getStatStage(stat);

      if (currentStage < 6 && value > highestValue) {
        highestValue = value;
        highestStat = stat;
      }
    }

   if (highestStat !== null && !simulated) {
  console.log(`✔️ Boosting ${highestStat} by ${this.stages} stages!`);
  globalScene.phaseManager.unshiftNew(
    "StatStageChangePhase",
    attacker.getBattlerIndex(),
    true,
    [highestStat],
    this.stages
  );
}
}
  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

export class DualStatMultiplierModifier extends PokemonHeldItemModifier {
  private readonly boostedStat: Stat;
  private readonly reducedStat: Stat;
  private readonly boostMultiplier: number;
  private readonly reduceMultiplier: number;

  constructor(
    type: ModifierType,
    pokemonId: number,
    boostedStat: Stat,
    reducedStat: Stat,
    boostMultiplier: number = 2,
    reduceMultiplier: number = 0.5,
    stackCount?: number
  ) {
    super(type, pokemonId, stackCount);
    this.boostedStat = boostedStat;
    this.reducedStat = reducedStat;
    this.boostMultiplier = boostMultiplier;
    this.reduceMultiplier = reduceMultiplier;
  }

  clone(): DualStatMultiplierModifier {
    return new DualStatMultiplierModifier(
      this.type,
      this.pokemonId,
      this.boostedStat,
      this.reducedStat,
      this.boostMultiplier,
      this.reduceMultiplier,
      this.stackCount
    );
  }

  /** ✅ 인자 순서를 생성자와 동일하게 수정 */
  getArgs(): any[] {
    return [
      this.pokemonId,
      this.boostedStat,
      this.reducedStat,
      this.boostMultiplier,
      this.reduceMultiplier,
      this.stackCount,
    ];
  }

  matchType(modifier: Modifier): boolean {
    return (
      modifier instanceof DualStatMultiplierModifier &&
      modifier.boostedStat === this.boostedStat &&
      modifier.reducedStat === this.reducedStat
    );
  }

  override apply(
    pokemon: Pokemon,
    simulated: boolean,
    statVal: Utils.NumberHolder,
    stat?: Stat
  ): boolean {
    if (simulated || stat === undefined) return false;

    if (stat === this.boostedStat) {
      statVal.value *= this.boostMultiplier;
      console.debug(`[DualStatMultiplierModifier] ${pokemon.name}의 ${Stat[stat]} → ${this.boostMultiplier}배`);
      return true;
    }

    if (stat === this.reducedStat) {
      statVal.value *= this.reduceMultiplier;
      console.debug(`[DualStatMultiplierModifier] ${pokemon.name}의 ${Stat[stat]} → ${this.reduceMultiplier}배`);
      return true;
    }

    return false;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * 상태이상일 때 가장 높은 능력치가 1.5배로 강화되는 아이템
 * (근성/열폭주/이상한비늘 유사 효과)
 */
export class StatusBoostItemModifier extends PokemonHeldItemModifier {
  private multiplier: number;
  
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
    this.multiplier = 1.5;
  }

  clone(): StatusBoostItemModifier {
    return new StatusBoostItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof StatusBoostItemModifier;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }

 // ✅ WeakSet은 클래스 필드가 아닌, 안전한 정적 getter로 초기화
  private static _calculatingMap: WeakMap<typeof StatusBoostItemModifier, WeakSet<Pokemon>> = new WeakMap();

  private static get calculating(): WeakSet<Pokemon> {
    if (!this._calculatingMap.has(this)) {
      this._calculatingMap.set(this, new WeakSet<Pokemon>());
    }
    return this._calculatingMap.get(this)!;
  }

  private getHighestEffectiveStat(pokemon: Pokemon): Stat {
  const calculating = (StatusBoostItemModifier as any).calculating as WeakSet<Pokemon>;
  if (calculating.has(pokemon)) {
    console.debug(`[StatusBoostItemModifier] 재귀 감지: ${pokemon.name}, 무시`);
    return Stat.ATK;
  }

  calculating.add(pokemon);

  const stats: [Stat, number][] = PERMANENT_STATS.map(stat => [
    stat,
    pokemon.getEffectiveStat(stat, undefined, undefined, true, true, true, false, true),
  ]);

  calculating.delete(pokemon);

  stats.sort((a, b) => b[1] - a[1]);
  const highest = stats[0][0];
  console.debug(`[StatusBoostItemModifier] 최고 능력치 판정 완료: ${Stat[highest]}`);
  return highest;
}

  /**
   * 능력치 계산 중 호출되어 배율을 반영
   * (랭크 상승이 아닌 단순 배율 곱)
   */
  override apply(
  pokemon: Pokemon,
  simulated: boolean,
  stat: BattleStat,
  statVal: Utils.NumberHolder
): boolean {
if (pokemon.modifiers && Array.isArray(pokemon.modifiers)) {
  console.debug(`[TEST] ${pokemon.name} 모디파이어 목록:`, pokemon.modifiers.map(m => m.constructor.name));
} else {
  console.debug(`[TEST] ${pokemon.name} modifiers가 아직 초기화되지 않음`);
}
  console.debug(
    `[StatusBoostItemModifier] apply() 호출됨 - ${pokemon.name}, status=${StatusEffect[pokemon.status]}, simulated=${simulated}`
  );
  console.debug(`[StatusBoostItemModifier] 현재 상태: ${StatusEffect[pokemon.status]} (${pokemon.status})`);
  
  if (pokemon.status === StatusEffect.NONE) {
  console.debug(`[StatusBoostItemModifier] 상태이상 아님, 적용 안됨`);
  return false;
}

// 최고 능력치 계산
console.debug(`[StatusBoostItemModifier] status=${StatusEffect[pokemon.status]}, stat=${Stat[stat]}(${stat})`);
const highestStat = this.getHighestEffectiveStat(pokemon);
console.debug(`[StatusBoostItemModifier] highestStat=${highestStat} (${highestStat !== null ? Stat[highestStat] : "null"})`);

console.debug(`[StatusBoostItemModifier] 최고 능력치=${Stat[highestStat]}, 비교 stat=${Stat[stat]}`);
console.debug(`[StatusBoostItemModifier] highestStat=${highestStat}, Stat.ATK=${Stat.ATK}`);

  // BattleStat과 EffectiveStat 비교
  const battleStatMatches = highestStat === (stat as unknown as Stat);

  console.debug(`[StatusBoostItemModifier] battleStatMatches=${battleStatMatches}`);

  // 일치할 경우 1.5배 적용
  if (battleStatMatches) {
    const before = statVal.value;
    statVal.value *= this.multiplier;
    console.debug(
      `[StatusBoostItemModifier] 적용됨! ${pokemon.name} (${StatusEffect[pokemon.status]}) 상태에서 ${Stat[stat]}: ${before} → ${statVal.value}`
    );
    return true;
  }

  return false;
  }
}
(window as any).StatusBoostItemModifier = StatusBoostItemModifier;

/**
 * Modifier used for held items that ignore the opponent's stat changes (except Speed).
 * Implements the effect of the Unaware Band item.
 * @extends PokemonHeldItemModifier
 */
export class UnawareItemModifier extends PokemonHeldItemModifier {
  /** The stats that will be ignored */
  protected ignoredStats: readonly BattleStat[];

  constructor(type: ModifierType, pokemonId: number, ignoredStats: BattleStat[], stackCount?: number) {
    super(type, pokemonId, stackCount);
    this.ignoredStats = ignoredStats;

    // 수동으로 attributes 배열에 추가
    const attr = new IgnoreOpponentStatStagesAbAttr(this.ignoredStats);
    if (this.attributes) {
      this.attributes.push(attr); // attributes가 존재하면 속성 추가
    } else {
      this.attributes = [attr]; // 없으면 새로 정의
    }
  }

  clone(): UnawareItemModifier {
    return new UnawareItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    const args = super.getArgs().concat(this.ignoredStats);
    console.log("[UnawareItemModifier] getArgs:", args); // args 로깅
    return args;
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof UnawareItemModifier;
  }

  /**
   * Applies the effect by setting the BooleanHolder to true for matching stats
   * @param _pokemon N/A
   * @param _passive N/A
   * @param _simulated N/A
   * @param _cancelled N/A
   * @param args [BattleStat, BooleanHolder]
   */
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: Utils.BooleanHolder,
    args: any[],
  ): void {
    if (!args || !Array.isArray(args) || args.length < 2) {
      console.error("[UnawareItemModifier] Invalid args received:", args);
      return;
    }

    const stat: BattleStat = args[0]; // 스탯 인자
    const holder: Utils.BooleanHolder = args[1]; // BooleanHolder

    if (this.ignoredStats.includes(stat)) {
      holder.value = true; // 해당 스탯 무시
    }
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * Modifier for held items that double the stat stage changes.
 * Functions similarly to the "Simple" ability, but as an item effect.
 * @extends PokemonHeldItemModifier
 */
export class StatStageChangeBoostModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): StatStageChangeBoostModifier {
    return new StatStageChangeBoostModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof StatStageChangeBoostModifier;
  }

  /**
   * Applies the StatStageChangeMultiplierAbAttr to the Pokémon, doubling the stat stage changes.
   */
  applyAbAttrs(type: any, _pokemon: Pokemon, cancelled: Utils.BooleanHolder, ..._args: any[]) {
    if (type === StatStageChangeMultiplierAbAttr) {
      cancelled.value = true; // Prevents the default behavior and applies custom multiplier.
      (args[0] as Utils.NumberHolder).value *= 2; // Multiplies the stat change by 2.
    }
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1; // Only one "Stat Stage Change Boost" item can be held by a Pokémon at a time.
  }
}

/**
 * Modifier for held items that reverse stat stage changes.
 * Functions similarly to the "Contrary" ability, but as an item effect.
 * @extends PokemonHeldItemModifier
 */
export class StatStageChangeReverseModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): StatStageChangeReverseModifier {
    return new StatStageChangeReverseModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof StatStageChangeReverseModifier;
  }

  /**
   * Applies the StatStageChangeMultiplierAbAttr to the Pokémon, reversing the stat stage changes.
   */
  applyAbAttrs(type: any, _pokemon: Pokemon, cancelled: Utils.BooleanHolder, ...args: any[]) {
    if (type === StatStageChangeMultiplierAbAttr) {
      cancelled.value = true; // Prevents the default behavior and applies custom multiplier.
      (args[0] as Utils.NumberHolder).value *= -1; // Multiplies the stat change by -1 to reverse it.
    }
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1; // Only one "Stat Stage Change Reverse" item can be held by a Pokémon at a time.
  }
}

export class PreventBerryUseItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): PreventBerryUseItemModifier {
    return new PreventBerryUseItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof PreventBerryUseItemModifier;
  }

  /**
   * Applies the PreventBerryUseAbAttr to opposing Pokémon during the berry phase.
   */
  applyAbAttrs(type: any, _pokemon: Pokemon, cancelled: Utils.BooleanHolder, ..._args: any[]) {
    if (type === PreventBerryUseAbAttr) {
      cancelled.value = true;
    }
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * Modifier for held items that prevent explosive moves (like Self-Destruct or Explosion) from being used by opponents.
 * Functions similarly to the "Damp" ability, but as an item effect.
 * @extends PokemonHeldItemModifier
 */
export class PreventExplosionItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): PreventExplosionItemModifier {
    return new PreventExplosionItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof PreventExplosionItemModifier;
  }

  /**
   * Applies the FieldPreventExplosiveMovesAbAttr during move condition checks.
   */
  applyAbAttrs(type: any, _pokemon: Pokemon, cancelled: Utils.BooleanHolder, ..._args: any[]) {
    if (type === FieldPreventExplosiveMovesAbAttr) {
      cancelled.value = true;
    }
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * Modifier for held items that prevent priority moves from being used by opponents.
 * Functions similarly to the "FieldPriorityMoveImmunityAbAttr", but as an item effect.
 * @extends PokemonHeldItemModifier
 */
export class PreventPriorityMoveItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): PreventPriorityMoveItemModifier {
    return new PreventPriorityMoveItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof PreventPriorityMoveItemModifier;
  }

  /**
   * 헬퍼 함수: 우선도 기술인지 확인
   */
  private isPriorityMove(move: any): boolean {
    return move && typeof move.priority === "number" && move.priority > 0;
  }

  /**
   * ✅ 핵심: apply() 추가 — applyModifiers() 호출 대응
   */
  override apply(
  cancelledHolder: BooleanHolder,
  source: Pokemon,
  move: Move
): boolean {
  // ✅ 타입 필터 — 다른 아이템이면 무시
  if (this.type.id !== "prevent_priority_item") {
    return false;
  }

  // ✅ 실제 조건
  if (source && source.id !== this.pokemonId && this.isPriorityMove(move)) {
    console.log(
      `[PreventPriorityMoveItemModifier] ${move.name} (priority ${move.priority}) 차단!`
    );
    cancelledHolder.value = true;
    return true;
  }
  return false;
}

  /**
   * 기존 applyAbAttrs()는 별도의 시스템 호출용
   */
  applyAbAttrs(
    type: any,
    pokemon: Pokemon,
    cancelled: Utils.BooleanHolder,
    ...args: any[]
  ) {
    const target = args[0];
    const move = args[1];
    const isStatusMove = move && move.category === MoveCategory.STATUS;
    const isAlly = target?.team === 1;

    if (type === FieldPriorityMoveImmunityAbAttr || type === PreventPriorityMoveItemModifier) {
      if (!isAlly && !isStatusMove && this.isPriorityMove(move)) {
        cancelled.value = true;
      }
    }
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}
(window as any).PreventPriorityMoveItemModifier = PreventPriorityMoveItemModifier;

export class SereneGraceItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): SereneGraceItemModifier {
    return new SereneGraceItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof SereneGraceItemModifier;
  }

  /**
   * Applies the MoveEffectChanceMultiplierAbAttr with x2 multiplier.
   */
  applyAbAttrs(type: any, pokemon: Pokemon, cancelled: Utils.BooleanHolder, ...args: any[]) {
    if (type === MoveEffectChanceMultiplierAbAttr) {
      args[0] = new Utils.NumberHolder(2); // Multiplier
    }
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

export class BlockCritItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): BlockCritItemModifier {
    return new BlockCritItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof BlockCritItemModifier;
  }

  override apply(pokemon: Pokemon, simulated: boolean, ...args: any[]): boolean {
    const blockCrit = args[0] as BooleanHolder;
    console.debug(`[BlockCritItemModifier] 호출됨 simulated=${simulated}, blockCrit=`, blockCrit);

    if (simulated) return false;
    if (blockCrit instanceof BooleanHolder) {
      blockCrit.value = true;
      console.debug(`[BlockCritItemModifier] ${pokemon.name} → 급소 무효화 적용됨`);
      return true;
    }

    console.warn(`[BlockCritItemModifier] blockCrit이 BooleanHolder가 아님:`, blockCrit);
    return false;
  }

  getMaxHeldItemCount(): number {
    return 1;
  }
}

export class IgnoreTypeImmunityModifier extends PokemonHeldItemModifier {
  private abAttr: IgnoreTypeImmunityAbAttr;

  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
    this.abAttr = new IgnoreTypeImmunityAbAttr(
      PokemonType.GHOST, // 단일 타입
      [PokemonType.NORMAL, PokemonType.FIGHTING], // 배열로 무시 가능한 타입 전달
    );
  }

  clone(): IgnoreTypeImmunityModifier {
    const cloned = new IgnoreTypeImmunityModifier(this.type, this.pokemonId, this.stackCount);
    return cloned;
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof IgnoreTypeImmunityModifier;
  }

  getAbAttr(): IgnoreTypeImmunityAbAttr {
    return this.abAttr;
  }

  applyAbAttrs(type: any, _pokemon: Pokemon, cancelled: Utils.BooleanHolder, ...args: any[]): void {
    console.log("[DEBUG] applyAbAttrs called in IgnoreTypeImmunityModifier");

    if (type instanceof IgnoreTypeImmunityAbAttr) {
      const moveType = args[0];
      const defType = args[1];
      const multiplier = args[2];

      console.log("[DEBUG] Args received:", {
        moveType,
        defType,
        multiplierValue: multiplier?.value,
      });

      if (type.canApply(_pokemon, false, false, args)) {
        console.log("[DEBUG] canApply() returned true. Ignoring immunity.");
        cancelled.value = true;

        if (multiplier && multiplier.value === 0) {
          multiplier.value = 1;
          console.log("[DEBUG] Immunity ignored, multiplier set to 1");
        }
      } else {
        console.log("[DEBUG] canApply() returned false.");
      }
    }
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

export class SheerForceItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): SheerForceItemModifier {
    return new SheerForceItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof SheerForceItemModifier;
  }

  override canApply(pokemon: Pokemon, passive: boolean, simulated: boolean, args: any[]): boolean {
    const exceptMoves = [
      MoveId.ORDER_UP,
      MoveId.ELECTRO_SHOT,
      MoveId.MAX_FLARE,
      MoveId.MAX_FLUTTERBY,
      MoveId.MAX_LIGHTNING,
      MoveId.MAX_STRIKE,
      MoveId.MAX_KNUCKLE,
      MoveId.MAX_PHANTASM,
      MoveId.MAX_HAILSTORM,
      MoveId.MAX_OOZE,
      MoveId.MAX_GEYSER,
      MoveId.MAX_AIRSTREAM,
      MoveId.MAX_STARFALL,
      MoveId.MAX_WYRMWIND,
      MoveId.MAX_MINDSTORM,
      MoveId.MAX_ROCKFALL,
      MoveId.MAX_QUAKE,
      Moves.MAX_DARKNESS,
      MoveId.MAX_OVERGROWTH,
      MoveId.MAX_STEELSPIKE,
      MoveId.G_MAX_WILDFIRE,
      MoveId.G_MAX_BEFUDDLE,
      MoveId.G_MAX_VOLT_CRASH,
      MoveId.G_MAX_GOLD_RUSH,
      MoveId.G_MAX_CHI_STRIKE,
      MoveId.G_MAX_TERROR,
      MoveId.G_MAX_RESONANCE,
      MoveId.G_MAX_CUDDLE,
      MoveId.G_MAX_REPLENISH,
      MoveId.G_MAX_MALODOR,
      MoveId.G_MAX_STONESURGE,
      MoveId.G_MAX_WIND_RAGE,
      MoveId.G_MAX_STUN_SHOCK,
      MoveId.G_MAX_FINALE,
      MoveId.G_MAX_DEPLETION,
      MoveId.G_MAX_GRAVITAS,
      MoveId.G_MAX_VOLCALITH,
      MoveId.G_MAX_SANDBLAST,
      MoveId.G_MAX_SNOOZE,
      MoveId.G_MAX_TARTNESS,
      MoveId.G_MAX_SWEETNESS,
      MoveId.G_MAX_SMITE,
      MoveId.G_MAX_STEELSURGE,
      MoveId.G_MAX_MELTDOWN,
      MoveId.G_MAX_FOAM_BURST,
      MoveId.G_MAX_CENTIFERNO,
      MoveId.G_MAX_VINE_LASH,
      MoveId.G_MAX_CANNONADE,
      MoveId.G_MAX_DRUM_SOLO,
      MoveId.G_MAX_FIREBALL,
      MoveId.G_MAX_HYDROSNIPE,
      MoveId.G_MAX_ONE_BLOW,
      MoveId.G_MAX_RAPID_FLOW,
      MoveId.SOLAR_BEAM,
      MoveId.SOLAR_BLADE,
    ];

    const chanceHolder = args[0] as Utils.NumberHolder;
    const move = args[1] as Move;

    return !(chanceHolder.value <= 0 || exceptMoves.includes(move.id));
  }

  /**
   * Applies the MoveEffectChanceMultiplierAbAttr with 0 multiplier
   * and applies the MovePowerBoostAbAttr with 1.3x boost if move has additional effect.
   */
  applyAbAttrs(type: any, pokemon: Pokemon, cancelled: Utils.BooleanHolder, ...args: any[]): void {
    console.log("[SheerForce] applyAbAttrs called with type:", type.name || type);

    if (type === MoveEffectChanceMultiplierAbAttr) {
      const chance = args[0] as Utils.NumberHolder;
      const move = args[1] as Move;

      if (
        (move.category === MoveCategory.PHYSICAL || move.category === MoveCategory.SPECIAL) &&
        move.chance > 0 &&
        this.canApply(pokemon, false, false, args)
      ) {
        chance.value = 0;
        console.log("[SheerForce] MoveEffectChanceMultiplierAbAttr: Set chance to 0");
      } else {
        console.log("[SheerForce] 상태기이거나 부가효과 없음 또는 예외기술, chance 수정 안 함");
      }
    } else if (type === MovePowerBoostAbAttr) {
      const damage = args[1] as Utils.NumberHolder;
      const move = args[2] as Move;

      if (
        move.category !== MoveCategory.STATUS &&
        move.chance > 0 &&
        this.canApply(pokemon, false, false, [new Utils.NumberHolder(move.chance), move])
      ) {
        if (damage) {
          console.log("[SheerForce] Before Damage Boost:", damage.value);
          damage.value = Math.floor(damage.value * 1.3);
          console.log("[SheerForce] After Damage Boost:", damage.value);
        }
      } else {
        console.log("[SheerForce] 상태기, 부가효과 없음, 또는 예외기술: 위력 증가 없음");
      }
    }
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

export class GoldenBodyItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): GoldenBodyItemModifier {
    return new GoldenBodyItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof GoldenBodyItemModifier;
  }

  apply(type: any, ...args: any[]): boolean {
    const [pokemon, cancelled, ...rest] = args;
    this.applyAbAttrs(type, pokemon, cancelled, ...rest);
    return true;
  }

  applyAbAttrs(type: any, pokemon: Pokemon, cancelled: Utils.BooleanHolder, source: Pokemon, move: Move): void {
    if (type === PreDefendAbAttr) {
      const isImmune =
        pokemon !== source &&
        move.category === MoveCategory.STATUS &&
        ![MoveTarget.ENEMY_SIDE, MoveTarget.BOTH_SIDES, MoveTarget.USER_SIDE].includes(move.moveTarget);

      if (isImmune) {
        cancelled.value = true;
      }
    }

    // 기존 PreApplyBattlerTagAbAttr는 남겨도 됨
    if (type === PreApplyBattlerTagAbAttr) {
      pokemon.addBattleAttribute(
        new MoveImmunityAbAttr(
          (pokemon, attacker, move) =>
            pokemon !== attacker &&
            move.category === MoveCategory.STATUS &&
            ![MoveTarget.ENEMY_SIDE, MoveTarget.BOTH_SIDES, MoveTarget.USER_SIDE].includes(move.moveTarget),
        ),
      );
    }
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

export class AromaIncenseItemModifier extends PokemonHeldItemModifier {
  public static readonly IMMUNE_TAGS: BattlerTagType[] = [
    BattlerTagType.TAUNT,
    BattlerTagType.TORMENT,
    BattlerTagType.HEAL_BLOCK,
    BattlerTagType.INFATUATED,
    BattlerTagType.DISABLED,
    BattlerTagType.ENCORE,
    BattlerTagType.PERISH_SONG,
  ];

  private immunityAttr?: UserFieldBattlerTagImmunityAbAttr;

  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): AromaIncenseItemModifier {
    return new AromaIncenseItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof AromaIncenseItemModifier;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }

  /** ✅ 전투 시작/장착 시: 아군 필드 면역 AbAttr 부여 */
  override onApply(pokemon: Pokemon): void {
    super.onApply(pokemon);

    const alreadyHas = pokemon.battleAttributes?.some(
      attr =>
        attr instanceof UserFieldBattlerTagImmunityAbAttr &&
        this.sameImmuneSet(
          (attr as UserFieldBattlerTagImmunityAbAttr)['immuneTagTypes'],
          AromaIncenseItemModifier.IMMUNE_TAGS
        )
    );
    if (alreadyHas) return;

    this.immunityAttr = new UserFieldBattlerTagImmunityAbAttr(AromaIncenseItemModifier.IMMUNE_TAGS);
    pokemon.addBattleAttribute(this.immunityAttr);

    console.debug(`[AromaIncense] ${pokemon.name} → 태그 면역 AbAttr 부여: ${AromaIncenseItemModifier.IMMUNE_TAGS.map(t => BattlerTagType[t]).join(', ')}`);
  }

  /** 🔧 태그 부착 직전 직접 호출될 경우 처리 */
  override apply(defender: Pokemon, cancelled?: BooleanHolder, arg?: any): boolean {
    console.debug("[DEBUG] AromaIncense.apply() called for", defender?.name, arg);

    if (!cancelled) return false;

    const tagType = arg?.tagType;
    if (tagType && AromaIncenseItemModifier.IMMUNE_TAGS.includes(tagType)) {
      cancelled.value = true;
      console.debug(`[AromaIncense] ${defender.name} → ${BattlerTagType[tagType]} 면역 발동 (태그 취소)`);
      return true;
    }
    return false;
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);
    if (this.immunityAttr) {
      pokemon.removeBattleAttribute?.(this.immunityAttr);
      console.debug(`[AromaIncense] ${pokemon.name} → 태그 면역 해제`);
      this.immunityAttr = undefined;
    }
  }

  private sameImmuneSet(a: BattlerTagType[] | undefined, b: BattlerTagType[]): boolean {
    if (!a || a.length !== b.length) return false;
    const set = new Set(a);
    return b.every(x => set.has(x));
  }
}

export class SturdystoneItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): SturdystoneItemModifier {
    return new SturdystoneItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof SturdystoneItemModifier;
  }

  /**
   * Applies conditional damage reduction when HP is full and move is super effective.
   */
  applyAbAttrs(type: any, pokemon: Pokemon, cancelled: Utils.BooleanHolder, ...args: any[]): void {
    if (type === PreDefendAbAttr) {
      const condition: PokemonDefendCondition = (target, attacker, move) => {
        return target.hp === target.maxHp && move && move.getEffectiveness(target) > 1;
      };

      const DAMAGE_REDUCTION = 0.75;

      pokemon.addBattleAttribute(new ReceivedMoveDamageMultiplierAbAttr(condition, DAMAGE_REDUCTION));

      console.log("[Sturdystone] Applied conditional damage reduction (HP full + SE move).");
    }
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * Modifier for held items that increase STAB bonus from 1.5x to 2.0x.
 * Functions similarly to the "Adaptability" ability, but as an item effect.
 * @extends PokemonHeldItemModifier
 */
export class AdaptabilityItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): AdaptabilityItemModifier {
    return new AdaptabilityItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof AdaptabilityItemModifier;
  }

  /**
   * Applies the STAB boost via StabBoostAbAttr during damage calculation.
   */
  applyAbAttrs(type: any, _pokemon: Pokemon, cancelled: Utils.BooleanHolder, ...args: any[]) {
    if (type === StabBoostAbAttr) {
      // Allow the effect to proceed (i.e., don't cancel)
      cancelled.value = false;
    }
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

export class TelepathyItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): TelepathyItemModifier {
    return new TelepathyItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  // 🔑 matchType는 "클래스" 비교여야 매칭됩니다.
  matchType(modifier: Modifier): boolean {
    return modifier instanceof TelepathyItemModifier;
  }

  // ✅ PreDefend 트리거로 불릴 때 실행될 핸들러
  applyAbAttrs(
    type: string,
    params: {
      pokemon: Pokemon;            // 방어자(this)
      opponent: Pokemon;           // 공격자(source)
      move: Move;
      cancelled: Utils.BooleanHolder;
      simulated: boolean;
      typeMultiplier: Utils.NumberHolder;
    }
  ): void {
    if (type !== "PreDefendAbAttr") return;

    const { pokemon, opponent, move, cancelled } = params;

    // 안전 가드
    if (!opponent || typeof opponent.isPlayer !== "function") return;
    if (!move || typeof (move as any).is !== "function") return;

    // 본가 텔레파시: "아군이 쏜 공격기"면 피해 면역
    const isAlly = pokemon !== opponent && pokemon.isPlayer() === opponent.isPlayer();
    const isAttack = (move as any).is("AttackMove");

    // 디버그: 호출 확인
    console.debug("[Telepathy] applyAbAttrs(PreDefend) called", {
      defender: pokemon.name,
      attacker: opponent.name,
      isAlly, isAttack, alreadyCancelled: cancelled.value
    });

    if (isAlly && isAttack) {
      cancelled.value = true; // ✅ 여기서 무효화 신호
      console.debug("[Telepathy] cancelled.value = true (telepathy immunity)");
    }
  }

  // NOTE: PreDefend 경로를 쓰므로 apply()는 굳이 없어도 됩니다.
  // 남겨두고 싶다면 그대로 두세요. (엔진은 PreDefend에서 applyAbAttrs를 먼저 본다고 보면 됩니다.)

  getMaxHeldItemCount(_: Pokemon): number {
    return 1;
  }
}

/**
 * Modifier used for held items that apply the Moody effect after each turn.
 * Randomly increases one stat's stage by 2 and decreases another stat's stage by 1.
 * @extends PokemonHeldItemModifier
 */
export class MoodyItemModifier extends PokemonHeldItemModifier {
  /** The number of stages to boost the stat */
  protected stagesIncrease = 2;
  protected stagesDecrease = -1;

  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): MoodyItemModifier {
    return new MoodyItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof MoodyItemModifier;
  }

  /** 필수로 정의 필요 - 안 하면 apply(...) 호출 시 에러 */
  apply(..._args: any[]): boolean {
    return false;
  }

  /**
   * Called after each turn to apply the Moody effect.
   * Randomly increases one stat's stage by 2 and decreases another stat's stage by 1.
   * @param pokemon The Pokémon holding this item
   * @param _passive Unused
   * @param simulated If true, only simulates the result
   * @param _args Extra arguments (unused)
   */
  applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): void {
    console.log("MoodyItemModifier의 applyPostTurn 호출됨");

    const canRaise = EFFECTIVE_STATS.filter(s => pokemon.getStatStage(s) < 6);
    let canLower = EFFECTIVE_STATS.filter(s => pokemon.getStatStage(s) > -6);

    if (!simulated) {
      if (canRaise.length > 0) {
        const raisedStat = canRaise[pokemon.randBattleSeedInt(canRaise.length)];
        canLower = canRaise.filter(s => s !== raisedStat); // 증가시킬 스탯이 선택되면 해당 스탯은 감소할 수 없는 리스트에서 제외
        globalScene.phaseManager.unshiftNew(
          "StatStageChangePhase"(pokemon.getBattlerIndex(), true, [raisedStat], this.stagesIncrease),
        );
        console.log("StatStageChangePhase가 전투 씬에 추가됨");
        console.log(`${raisedStat} 스탯이 2단계 증가되었습니다.`);
      }

      if (canLower.length > 0) {
        const loweredStat = canLower[pokemon.randBattleSeedInt(canLower.length)];
        globalScene.phaseManager.unshiftNew(
          "StatStageChangePhase"(pokemon.getBattlerIndex(), true, [loweredStat], this.stagesDecrease),
        );
        console.log(`${loweredStat} 스탯이 1단계 감소되었습니다.`);
      }
    }
  }

  applyTurnEnd(pokemon: Pokemon, simulated: boolean, _args: any[]): void {
    this.applyPostTurn(pokemon, false, simulated, _args);
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1; // 이 아이템은 한 번만 착용할 수 있음
  }
}

/**
 * Modifier used for Room Service item.
 * Triggers when Trick Room activates and lowers the Speed stat by 1 stage.
 * @extends PokemonHeldItemModifier
 */
export class RoomServiceModifier extends PokemonHeldItemModifier {
  constructor(
    type: ModifierType,
    pokemonId: number,
    private stackCount = 1,
  ) {
    super(type, pokemonId);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof RoomServiceModifier;
  }

  clone(): RoomServiceModifier {
    return new RoomServiceModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Called when Trick Room is added to the arena.
   * This must be called by the system that applies arena tags like TrickRoomTag.
   */
  onTrickRoomActivated(pokemon: Pokemon): boolean {
    if (!this.canApply(pokemon)) return false;

    // 스피드 능력치를 1단계 낮춤
    globalScene.phaseManager.unshiftNew("StatStageChangePhase"(pokemon.getBattlerIndex(), true, [Stat.SPD], -1, true));

    // 아이템 보존 여부 확인
    const preserve = new BooleanHolder(false);
    globalScene.applyModifiers(PreserveItemModifier, pokemon.isPlayer(), pokemon, preserve, "item");

    if (!preserve.value) {
      if (this.stackCount > 1) {
        this.stackCount--;
      } else {
        globalScene.removeModifier(this);
      }
    }

    return true;
  }

  /**
   * Apply the modifier effect, triggered when Trick Room is activated.
   */
  apply(pokemon: Pokemon): boolean {
    // Trick Room이 활성화되었을 때, RoomServiceModifier가 적용됨
    return this.onTrickRoomActivated(pokemon);
  }

  canApply(pokemon: Pokemon): boolean {
    return pokemon != null && pokemon.isActive();
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 10;
  }

  getStackCount(): number {
    return this.stackCount;
  }
}

export class AbilityGuardItemModifier extends PokemonHeldItemModifier {
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
  }

  clone(): AbilityGuardItemModifier {
    return new AbilityGuardItemModifier(this.type, this.pokemonId, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs();
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof AbilityGuardItemModifier;
  }

  /**
   * MoveAbilityBypassAbAttr로부터 특성을 보호할지 여부
   */
  public protectsFromAbilityBypass(): boolean {
    return true; // 필요 시 조건 추가 가능
  }

  apply(..._args: any[]): boolean {
    return false;
  }

  applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): void {
    console.log("AbilityGuardItemModifier의 applyPostTurn 호출됨");

    if (!simulated) {
      const hasSuppressAbilities = globalScene.arena.hasTag(ArenaTagType.NEUTRALIZING_GAS);
      console.log("hasSuppressAbilities:", hasSuppressAbilities);

      if (hasSuppressAbilities) {
        console.log("Neutralizing Gas가 활성화되었습니다.");
        console.log("Neutralizing Gas에 의한 특성 무효화를 AbilityGuard가 방어함");

        globalScene.phaseManager.queueMessage(
          i18next.t("modifier:abilityGuardPrevented", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            typeName: this.type.name,
          }),
        );
        return;
      }

      console.log(`isAbilitySuppressed: ${pokemon.isAbilitySuppressed()}`);
      console.log(`isAbilityReplaced: ${pokemon.isAbilityReplaced()}`);

      if (!pokemon.isAbilitySuppressed() && !pokemon.isAbilityReplaced()) {
        console.log("특성 변경이 방지되었습니다.");
        globalScene.phaseManager.queueMessage(
          i18next.t("modifier:abilityGuardPrevented", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            typeName: this.type.name,
          }),
        );
      } else {
        pokemon.restoreOriginalAbility();
        console.log("원래 특성으로 복구되었습니다.");
      }
    }
  }

  applyTurnEnd(pokemon: Pokemon, simulated: boolean, _args: any[]): void {
    console.log("applyTurnEnd 호출됨");
    console.log(`simulated: ${simulated}`);
    this.applyPostTurn(pokemon, false, simulated, _args);
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * Modifier used for Miss Effect item (허탕보험).
 * Triggers when a move misses and increases the user's Speed stat.
 * @extends PokemonHeldItemModifier
 */
export class MissEffectModifier extends PokemonHeldItemModifier {
  constructor(
    type: ModifierType,
    pokemonId: number,
    private stackCount = 1,
  ) {
    super(type, pokemonId);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof MissEffectModifier;
  }

  clone(): MissEffectModifier {
    return new MissEffectModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Called when a move misses. This method applies the effect of the item.
   * This should be called by the system that tracks move accuracy.
   */
  onMoveMissed(pokemon: Pokemon, move: Move): boolean {
    if (!this.canApply(pokemon)) return false;

    // Create the MissEffectAttr and apply it (this triggers the speed boost)
    const missEffectAttr = new MissEffectAttr((user, move) => {
  globalScene.phaseManager.unshiftPhase(
  new StatStageChangePhase(
    user.getBattlerIndex(),
    false,
    [Stat.SPD],
    2
  )
);
});

    // Apply the MissEffectAttr
    missEffectAttr.apply(pokemon, null, move, []);

    // Check for item usage and decrement stack or remove item if necessary
    const preserve = new BooleanHolder(false);
    globalScene.applyModifiers(PreserveItemModifier, pokemon.isPlayer(), pokemon, preserve, "item");

    if (!preserve.value) {
      if (this.stackCount > 1) {
        this.stackCount--;
      } else {
        globalScene.removeModifier(this); // Remove the modifier after item usage
      }
    }

    return true;
  }

  /**
   * Apply the modifier effect, triggered when a move misses.
   */
  apply(pokemon: Pokemon, move: Move): boolean {
    // Trigger MissEffectModifier when the move misses
    return this.onMoveMissed(pokemon, move);
  }

  canApply(pokemon: Pokemon): boolean {
    return pokemon != null && pokemon.isActive();
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 10;
  }

  getStackCount(): number {
    return this.stackCount;
  }
}

/**
 * Modifier used for held items that apply critical-hit stage boost(s).
 * @extends PokemonHeldItemModifier
 * @see {@linkcode apply}
 */
export class CritBoosterModifier extends PokemonHeldItemModifier {
  /** The amount of stages by which the held item increases the current critical-hit stage value */
  protected stageIncrement: number;

  constructor(type: ModifierType, pokemonId: number, stageIncrement: number, stackCount?: number) {
    super(type, pokemonId, stackCount);

    this.stageIncrement = stageIncrement;
  }

  clone() {
    return new CritBoosterModifier(this.type, this.pokemonId, this.stageIncrement, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.stageIncrement);
  }

  matchType(modifier: Modifier): boolean {
    if (modifier instanceof CritBoosterModifier) {
      return (modifier as CritBoosterModifier).stageIncrement === this.stageIncrement;
    }

    return false;
  }

  /**
   * Increases the current critical-hit stage value by {@linkcode stageIncrement}.
   * @param _pokemon {@linkcode Pokemon} N/A
   * @param critStage {@linkcode NumberHolder} that holds the resulting critical-hit level
   * @returns always `true`
   */
  override apply(_pokemon: Pokemon, critStage: NumberHolder): boolean {
    critStage.value += this.stageIncrement;
    return true;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * Modifier used for held items that apply critical-hit stage boost(s)
 * if the holder is of a specific {@linkcode SpeciesId}.
 * @extends CritBoosterModifier
 * @see {@linkcode shouldApply}
 */
export class SpeciesCritBoosterModifier extends CritBoosterModifier {
  /** The species that the held item's critical-hit stage boost applies to */
  private species: SpeciesId[];

  constructor(
    type: ModifierType,
    pokemonId: number,
    stageIncrement: number,
    species: SpeciesId[],
    stackCount?: number,
  ) {
    super(type, pokemonId, stageIncrement, stackCount);

    this.species = species;
  }

  clone() {
    return new SpeciesCritBoosterModifier(
      this.type,
      this.pokemonId,
      this.stageIncrement,
      this.species,
      this.stackCount,
    );
  }

  getArgs(): any[] {
    return [...super.getArgs(), this.species];
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof SpeciesCritBoosterModifier;
  }

  /**
   * Checks if the holder's {@linkcode SpeciesId} (or its fused species) is listed
   * in {@linkcode species}.
   * @param pokemon {@linkcode Pokemon} that holds the held item
   * @param critStage {@linkcode NumberHolder} that holds the resulting critical-hit level
   * @returns `true` if the critical-hit level can be incremented, false otherwise
   */
  override shouldApply(pokemon: Pokemon, critStage: NumberHolder): boolean {
    return (
      super.shouldApply(pokemon, critStage) &&
      (this.species.includes(pokemon.getSpeciesForm(true).speciesId) ||
        (pokemon.isFusion() && this.species.includes(pokemon.getFusionSpeciesForm(true).speciesId)))
    );
  }
}

export class TypeSpecificMoveBoosterModifier extends PokemonHeldItemModifier {
  public moveType: Type;
  private boostMultiplier: number;

  private static readonly maxStack: number = 10; // 최대 스택 수
  private static readonly maxHeldItemCount: number = 10; // 최대 장착 가능 아이템 수량

  constructor(type: ModifierType, pokemonId: number, moveType: Type, boostPercent = 50, stackCount = 1) {
    super(type, pokemonId, stackCount);
    this.moveType = moveType;

    // boostPercent가 150이면 boostMultiplier는 1.5가 되어야 합니다.
    this.boostMultiplier = 1 + boostPercent / 100; // 150%라면 1.5로 계산됩니다
  }

  clone() {
    return new TypeSpecificMoveBoosterModifier(
      this.type,
      this.pokemonId,
      this.moveType,
      (this.boostMultiplier - 1) * 100,
      this.stackCount,
    );
  }

  getArgs(): any[] {
    return super.getArgs().concat([this.moveType, this.boostMultiplier * 100, this.stackCount]);
  }

  matchType(modifier: PokemonHeldItemModifier): boolean {
    return modifier instanceof TypeSpecificMoveBoosterModifier && modifier.moveType === this.moveType;
  }

  getStackCount(): number {
    return this.stackCount ?? 1; // 기본적으로 최소 1스택
  }

  override shouldApply(pokemon?: Pokemon, moveType?: Type, movePower?: NumberHolder): boolean {
    const result =
      super.shouldApply(pokemon, moveType, movePower) &&
      moveType === this.moveType &&
      movePower instanceof NumberHolder;

    console.debug("shouldApply called", {
      pokemonId: this.pokemonId,
      expectedType: this.moveType,
      actualMoveType: moveType,
      result,
    });

    return result;
  }

  override apply(pokemon: Pokemon, moveType: Type, movePower: NumberHolder): boolean {
    if (moveType === this.moveType && movePower.value >= 1) {
      const preserve = new BooleanHolder(false);

      // PreserveItemModifier 적용: 열매가 아니므로 "item" 타입
      globalScene.applyModifiers(PreserveItemModifier, pokemon.isPlayer(), pokemon, preserve, "item");

      const originalValue = movePower.value;
      movePower.value = Math.floor(movePower.value * this.boostMultiplier);

      // 최초에만 원래 장착 수 저장
      if (pokemon.getMetadata && !pokemon.getMetadata("originalHeldItemCount")) {
        pokemon.setMetadata("originalHeldItemCount", pokemon.getHeldItemCount());
      }

      globalScene.phaseManager.queueMessage(
        i18next.t("modifier:typeSpecificMoveBoostApply", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          itemName: this.type.name,
        }),
      );

      // preserve 결과에 따라 스택 감소 또는 유지
      if (!preserve.value) {
        if (this.stackCount > 1) {
          this.stackCount--;
        } else {
          globalScene.removeModifier(this);
        }
      }

      return true;
    }

    return false;
  }

  override reset(pokemon: Pokemon): void {
    const originalCount = pokemon.getMetadata("originalHeldItemCount");

    if (originalCount !== undefined) {
      pokemon.setHeldItemCount(originalCount); // 원래 개수로 복구
      pokemon.removeMetadata("originalHeldItemCount"); // 메타데이터 삭제
    }
    return false;
  }

  /**
   * 최대 아이템 장착 수량을 반환
   * @param pokemon 포켓몬
   * @returns 최대 장착 가능 아이템 수
   */
  getMaxHeldItemCount(pokemon: Pokemon): number {
    return TypeSpecificMoveBoosterModifier.maxHeldItemCount; // 최대 5개의 아이템만 장착 가능
  }
}

/**
 * Applies Specific Type item boosts (e.g., Magnet)
 */
export class AttackTypeBoosterModifier extends PokemonHeldItemModifier {
  public moveType: PokemonType;
  private boostMultiplier: number;

  constructor(type: ModifierType, pokemonId: number, moveType: PokemonType, boostPercent: number, stackCount?: number) {
    super(type, pokemonId, stackCount);

    this.moveType = moveType;
    this.boostMultiplier = boostPercent * 0.01;
  }

  matchType(modifier: Modifier): boolean {
    if (modifier instanceof AttackTypeBoosterModifier) {
      const attackTypeBoosterModifier = modifier as AttackTypeBoosterModifier;
      return (
        attackTypeBoosterModifier.moveType === this.moveType &&
        attackTypeBoosterModifier.boostMultiplier === this.boostMultiplier
      );
    }

    return false;
  }

  clone() {
    return new AttackTypeBoosterModifier(
      this.type,
      this.pokemonId,
      this.moveType,
      this.boostMultiplier * 100,
      this.stackCount,
    );
  }

  getArgs(): any[] {
    return super.getArgs().concat([this.moveType, this.boostMultiplier * 100]);
  }

  /**
   * Checks if {@linkcode AttackTypeBoosterModifier} should be applied
   * @param pokemon the {@linkcode Pokemon} that holds the held item
   * @param moveType the {@linkcode PokemonType} of the move being used
   * @param movePower the {@linkcode NumberHolder} that holds the power of the move
   * @returns `true` if boosts should be applied to the move.
   */
  override shouldApply(pokemon?: Pokemon, moveType?: PokemonType, movePower?: NumberHolder): boolean {
    return (
      super.shouldApply(pokemon, moveType, movePower) &&
      typeof moveType === "number" &&
      movePower instanceof NumberHolder &&
      this.moveType === moveType
    );
  }

  /**
   * Applies {@linkcode AttackTypeBoosterModifier}
   * @param pokemon {@linkcode Pokemon} that holds the held item
   * @param moveType {@linkcode PokemonType} of the move being used
   * @param movePower {@linkcode NumberHolder} that holds the power of the move
   * @returns `true` if boosts have been applied to the move.
   */
  override apply(_pokemon: Pokemon, moveType: PokemonType, movePower: NumberHolder): boolean {
    if (moveType === this.moveType && movePower.value >= 1) {
      (movePower as NumberHolder).value = Math.floor(
        (movePower as NumberHolder).value * (1 + this.getStackCount() * this.boostMultiplier),
      );
      return true;
    }

    return false;
  }

  getScoreMultiplier(): number {
    return 1.2;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 99;
  }
}

export class SurviveDamageModifier extends PokemonHeldItemModifier {
  matchType(modifier: Modifier): boolean {
    return modifier instanceof SurviveDamageModifier;
  }

  clone() {
    return new SurviveDamageModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Checks if the {@linkcode SurviveDamageModifier} should be applied
   * @param pokemon the {@linkcode Pokemon} that holds the item
   * @param surviveDamage {@linkcode BooleanHolder} that holds the survive damage
   * @returns `true` if the {@linkcode SurviveDamageModifier} should be applied
   */
  override shouldApply(pokemon?: Pokemon, surviveDamage?: BooleanHolder): boolean {
    return super.shouldApply(pokemon, surviveDamage) && !!surviveDamage;
  }

  /**
   * Applies {@linkcode SurviveDamageModifier}
   * @param pokemon the {@linkcode Pokemon} that holds the item
   * @param surviveDamage {@linkcode BooleanHolder} that holds the survive damage
   * @returns `true` if the survive damage has been applied
   */
  override apply(pokemon: Pokemon, surviveDamage: BooleanHolder): boolean {
    if (!surviveDamage.value && pokemon.randBattleSeedInt(10) < this.getStackCount()) {
      surviveDamage.value = true;

      globalScene.phaseManager.queueMessage(
        i18next.t("modifier:surviveDamageApply", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          typeName: this.type.name,
        }),
      );
      return true;
    }

    return false;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 5;
  }
}

export class BypassSpeedChanceModifier extends PokemonHeldItemModifier {
  matchType(modifier: Modifier) {
    return modifier instanceof BypassSpeedChanceModifier;
  }

  clone() {
    return new BypassSpeedChanceModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Checks if {@linkcode BypassSpeedChanceModifier} should be applied
   * @param pokemon the {@linkcode Pokemon} that holds the item
   * @param doBypassSpeed {@linkcode BooleanHolder} that is `true` if speed should be bypassed
   * @returns `true` if {@linkcode BypassSpeedChanceModifier} should be applied
   */
  override shouldApply(pokemon?: Pokemon, doBypassSpeed?: BooleanHolder): boolean {
    return super.shouldApply(pokemon, doBypassSpeed) && !!doBypassSpeed;
  }

  /**
   * Applies {@linkcode BypassSpeedChanceModifier}
   * @param pokemon the {@linkcode Pokemon} that holds the item
   * @param doBypassSpeed {@linkcode BooleanHolder} that is `true` if speed should be bypassed
   * @returns `true` if {@linkcode BypassSpeedChanceModifier} has been applied
   */
  override apply(pokemon: Pokemon, doBypassSpeed: BooleanHolder): boolean {
    if (!doBypassSpeed.value && pokemon.randBattleSeedInt(10) < this.getStackCount()) {
      doBypassSpeed.value = true;
      const isCommandFight =
        globalScene.currentBattle.turnCommands[pokemon.getBattlerIndex()]?.command === Command.FIGHT;
      const hasQuickClaw = this.type.is("PokemonHeldItemModifierType") && this.type.id === "QUICK_CLAW";

      if (isCommandFight && hasQuickClaw) {
        globalScene.phaseManager.queueMessage(
          i18next.t("modifier:bypassSpeedChanceApply", {
            pokemonName: getPokemonNameWithAffix(pokemon),
            itemName: i18next.t("modifierType:ModifierType.QUICK_CLAW.name"),
          }),
        );
      }
      return true;
    }

    return false;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 3;
  }
}

/**
 * Class for Pokemon held items like King's Rock
 * Because King's Rock can be stacked in PokeRogue, unlike mainline, it does not receive a boost from AbilityId.SERENE_GRACE
 */
export class FlinchChanceModifier extends PokemonHeldItemModifier {
  private chance: number;
  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);

    this.chance = 20;
  }

  matchType(modifier: Modifier) {
    return modifier instanceof FlinchChanceModifier;
  }

  clone() {
    return new FlinchChanceModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Checks if {@linkcode FlinchChanceModifier} should be applied
   * @param pokemon the {@linkcode Pokemon} that holds the item
   * @param flinched {@linkcode BooleanHolder} that is `true` if the pokemon flinched
   * @returns `true` if {@linkcode FlinchChanceModifier} should be applied
   */
  override shouldApply(pokemon?: Pokemon, flinched?: BooleanHolder): boolean {
    return super.shouldApply(pokemon, flinched) && !!flinched;
  }

  /**
   * Applies {@linkcode FlinchChanceModifier} to randomly flinch targets hit.
   * @param pokemon - The {@linkcode Pokemon} that holds the item
   * @param flinched - A {@linkcode BooleanHolder} holding whether the pokemon has flinched
   * @returns `true` if {@linkcode FlinchChanceModifier} was applied successfully
   */
  override apply(pokemon: Pokemon, flinched: BooleanHolder): boolean {
    // The check for pokemon.summonData is to ensure that a crash doesn't occur when a Pokemon with King's Rock procs a flinch
    // TODO: Since summonData is always defined now, we can probably remove this
    if (pokemon.summonData && !flinched.value && pokemon.randBattleSeedInt(100) < this.getStackCount() * this.chance) {
      flinched.value = true;
      return true;
    }

    return false;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 3;
  }
}

export class TurnHealModifier extends PokemonHeldItemModifier {
  matchType(modifier: Modifier) {
    return modifier instanceof TurnHealModifier;
  }

  clone() {
    return new TurnHealModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Applies {@linkcode TurnHealModifier}
   * @param pokemon The {@linkcode Pokemon} that holds the item
   * @returns `true` if the {@linkcode Pokemon} was healed
   */
  override apply(pokemon: Pokemon): boolean {
    if (!pokemon.isFullHp()) {
      globalScene.phaseManager.unshiftNew(
        "PokemonHealPhase",
        pokemon.getBattlerIndex(),
        toDmgValue(pokemon.getMaxHp() / 16) * this.stackCount,
        i18next.t("modifier:turnHealApply", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          typeName: this.type.name,
        }),
        true,
      );
      return true;
    }

    return false;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 4;
  }
}

/**
 * Modifier used for held items, namely Toxic Orb and Flame Orb, that apply a
 * set {@linkcode StatusEffect} at the end of a turn.
 * @extends PokemonHeldItemModifier
 * @see {@linkcode apply}
 */
export class TurnStatusEffectModifier extends PokemonHeldItemModifier {
  /** The status effect to be applied by the held item */
  private effect: StatusEffect;

  constructor(type: ModifierType, pokemonId: number, stackCount?: number) {
    super(type, pokemonId, stackCount);

    switch (type.id) {
      case "TOXIC_ORB":
        this.effect = StatusEffect.TOXIC;
        break;
      case "FLAME_ORB":
        this.effect = StatusEffect.BURN;
        break;
      case "FREEZE_ORB":
        this.effect = StatusEffect.FROSTBITE;
        break;
    }
  }

  /**
   * Checks if {@linkcode modifier} is an instance of this class,
   * intentionally ignoring potentially different {@linkcode effect}s
   * to prevent held item stockpiling since the item obtained first
   * would be the only item able to {@linkcode apply} successfully.
   * @override
   * @param modifier {@linkcode Modifier} being type tested
   * @return `true` if {@linkcode modifier} is an instance of
   * TurnStatusEffectModifier, false otherwise
   */
  matchType(modifier: Modifier): boolean {
    return modifier instanceof TurnStatusEffectModifier;
  }

  clone() {
    return new TurnStatusEffectModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Attempt to inflict the holder with the associated {@linkcode StatusEffect}.
   * @param pokemon - The {@linkcode Pokemon} holding the item
   * @returns `true` if the status effect was applied successfully
   */
  override apply(pokemon: Pokemon): boolean {
    return pokemon.trySetStatus(this.effect, pokemon, undefined, this.type.name);
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }

  getStatusEffect(): StatusEffect {
    return this.effect;
  }
}

export class HitHealModifier extends PokemonHeldItemModifier {
  matchType(modifier: Modifier) {
    return modifier instanceof HitHealModifier;
  }

  clone() {
    return new HitHealModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Applies {@linkcode HitHealModifier}
   * @param pokemon The {@linkcode Pokemon} that holds the item
   * @returns `true` if the {@linkcode Pokemon} was healed
   */
  override apply(pokemon: Pokemon): boolean {
    if (pokemon.turnData.totalDamageDealt && !pokemon.isFullHp()) {
      // TODO: this shouldn't be undefined AFAIK
      globalScene.phaseManager.unshiftNew(
        "PokemonHealPhase",
        pokemon.getBattlerIndex(),
        toDmgValue(pokemon.turnData.totalDamageDealt / 8) * this.stackCount,
        i18next.t("modifier:hitHealApply", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          typeName: this.type.name,
        }),
        true,
      );
    }

    return true;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 4;
  }
}

export class LevelIncrementBoosterModifier extends PersistentModifier {
  match(modifier: Modifier) {
    return modifier instanceof LevelIncrementBoosterModifier;
  }

  clone() {
    return new LevelIncrementBoosterModifier(this.type, this.stackCount);
  }

  /**
   * Checks if {@linkcode LevelIncrementBoosterModifier} should be applied
   * @param count {@linkcode NumberHolder} holding the level increment count
   * @returns `true` if {@linkcode LevelIncrementBoosterModifier} should be applied
   */
  override shouldApply(count: NumberHolder): boolean {
    return !!count;
  }

  /**
   * Applies {@linkcode LevelIncrementBoosterModifier}
   * @param count {@linkcode NumberHolder} holding the level increment count
   * @returns always `true`
   */
  override apply(count: NumberHolder): boolean {
    count.value += this.getStackCount();

    return true;
  }

  getMaxStackCount(_forThreshold?: boolean): number {
    return 99;
  }
}

export class BerryModifier extends PokemonHeldItemModifier {
  public berryType: BerryType;
  public consumed: boolean;

  constructor(type: ModifierType, pokemonId: number, berryType: BerryType, stackCount?: number) {
    super(type, pokemonId, stackCount);

    this.berryType = berryType;
    this.consumed = false;
  }

  matchType(modifier: Modifier) {
    return modifier instanceof BerryModifier && (modifier as BerryModifier).berryType === this.berryType;
  }

  clone() {
    return new BerryModifier(this.type, this.pokemonId, this.berryType, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.berryType);
  }

  /**
   * Checks if {@linkcode BerryModifier} should be applied
   * @param pokemon The {@linkcode Pokemon} that holds the berry
   * @returns `true` if {@linkcode BerryModifier} should be applied
   */
  override shouldApply(pokemon: Pokemon): boolean {
  // 능력치 상승형 열매는 항상 즉시 발동 가능하도록 허용
  if (
    [
      BerryType.POMEG,
      BerryType.KELPSY,
      BerryType.QUALOT,
      BerryType.HONDEW,
      BerryType.GREPA,
      BerryType.TAMATO
    ].includes(this.berryType)
  ) {
    return !this.consumed && getBerryPredicate(this.berryType)(pokemon);
  }

  return !this.consumed && super.shouldApply(pokemon) && getBerryPredicate(this.berryType)(pokemon);
}

  /**
   * Applies {@linkcode BerryModifier}
   * @param pokemon The {@linkcode Pokemon} that holds the berry
   * @returns always `true`
   */
  override apply(pokemon: Pokemon): boolean {
    const preserve = new BooleanHolder(false);
    globalScene.applyModifiers(PreserveBerryModifier, pokemon.isPlayer(), pokemon, preserve);
    this.consumed = !preserve.value;

    // munch the berry and trigger unburden-like effects
    getBerryEffectFunc(this.berryType)(pokemon);
    applyAbAttrs("PostItemLostAbAttr", { pokemon });

    // Update berry eaten trackers for Belch, Harvest, Cud Chew, etc.
    // Don't recover it if we proc berry pouch (no item duplication)
    pokemon.recordEatenBerry(this.berryType, this.consumed);

    return true;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    if ([BerryType.LUM, BerryType.LEPPA, BerryType.SITRUS, BerryType.ENIGMA].includes(this.berryType)) {
      return 2;
    }
    return 3;
  }
}

export class PreserveBerryModifier extends PersistentModifier {
  match(modifier: Modifier) {
    return modifier instanceof PreserveBerryModifier;
  }

  clone() {
    return new PreserveBerryModifier(this.type, this.stackCount);
  }

  /**
   * Checks if all prequired conditions are met to apply {@linkcode PreserveBerryModifier}
   * @param pokemon {@linkcode Pokemon} that holds the berry
   * @param doPreserve {@linkcode BooleanHolder} that is `true` if the berry should be preserved
   * @returns `true` if {@linkcode PreserveBerryModifier} should be applied
   */
  override shouldApply(pokemon?: Pokemon, doPreserve?: BooleanHolder): boolean {
    return !!pokemon && !!doPreserve;
  }

  /**
   * Applies {@linkcode PreserveBerryModifier}
   * @param pokemon The {@linkcode Pokemon} that holds the berry
   * @param doPreserve {@linkcode BooleanHolder} that is `true` if the berry should be preserved
   * @returns always `true`
   */
  override apply(pokemon: Pokemon, doPreserve: BooleanHolder): boolean {
    doPreserve.value ||= pokemon.randBattleSeedInt(10) < this.getStackCount() * 3;

    return true;
  }

  getMaxStackCount(): number {
    return 3;
  }
}

export class PokemonInstantReviveModifier extends PokemonHeldItemModifier {
  matchType(modifier: Modifier) {
    return modifier instanceof PokemonInstantReviveModifier;
  }

  clone() {
    return new PokemonInstantReviveModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Applies {@linkcode PokemonInstantReviveModifier}
   * @param pokemon The {@linkcode Pokemon} that holds the item
   * @returns always `true`
   */
  override apply(pokemon: Pokemon): boolean {
    // Restore the Pokemon to half HP
    globalScene.phaseManager.unshiftNew(
      "PokemonHealPhase",
      pokemon.getBattlerIndex(),
      toDmgValue(pokemon.getMaxHp() / 2),
      i18next.t("modifier:pokemonInstantReviveApply", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        typeName: this.type.name,
      }),
      false,
      false,
      true,
    );

    // Remove the Pokemon's FAINT status
    pokemon.resetStatus(true, false, true, false);

    // Reapply Commander on the Pokemon's side of the field, if applicable
    const field = pokemon.isPlayer() ? globalScene.getPlayerField() : globalScene.getEnemyField();
    for (const p of field) {
      applyAbAttrs("CommanderAbAttr", { pokemon: p });
    }
    return true;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * Modifier used for held items, namely White Herb, that restore adverse stat
 * stages in battle.
 * @extends PokemonHeldItemModifier
 * @see {@linkcode apply}
 */
export class ResetNegativeStatStageModifier extends PokemonHeldItemModifier {
  matchType(modifier: Modifier) {
    return modifier instanceof ResetNegativeStatStageModifier;
  }

  clone() {
    return new ResetNegativeStatStageModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Goes through the holder's stat stages and, if any are negative, resets that
   * stat stage back to 0.
   * @param pokemon {@linkcode Pokemon} that holds the item
   * @returns `true` if any stat stages were reset, false otherwise
   */
  override apply(pokemon: Pokemon): boolean {
    let statRestored = false;

    for (const s of BATTLE_STATS) {
      if (pokemon.getStatStage(s) < 0) {
        pokemon.setStatStage(s, 0);
        statRestored = true;
      }
    }

    if (statRestored) {
      globalScene.phaseManager.queueMessage(
        i18next.t("modifier:resetNegativeStatStageApply", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          typeName: this.type.name,
        }),
      );
    }    

  // 🔄 바꿔야 하는 부분
      const preserve = new BooleanHolder(false);
      globalScene.applyModifiers(PreserveItemModifier, pokemon.isPlayer(), pokemon, preserve, "item");

      if (!preserve.value) {
        if (this.stackCount > 1) {
          this.stackCount--;
        } else {
          globalScene.removeModifier(this);
        }
      }

    return statRestored;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 10;
  }
}

/**
 * Modifier used for held items, namely Mystical Rock, that extend the
 * duration of weather and terrain effects.
 * @extends PokemonHeldItemModifier
 * @see {@linkcode apply}
 */
export class FieldEffectModifier extends PokemonHeldItemModifier {
  /**
   * Provides two more turns per stack to any weather or terrain effect caused
   * by the holder.
   * @param pokemon {@linkcode Pokemon} that holds the held item
   * @param fieldDuration {@linkcode NumberHolder} that stores the current field effect duration
   * @returns `true` if the field effect extension was applied successfully
   */
  override apply(_pokemon: Pokemon, fieldDuration: NumberHolder): boolean {
    fieldDuration.value += 2 * this.stackCount;
    return true;
  }

  override matchType(modifier: Modifier): boolean {
    return modifier instanceof FieldEffectModifier;
  }

  override clone(): FieldEffectModifier {
    return new FieldEffectModifier(this.type, this.pokemonId, this.stackCount);
  }

  override getMaxHeldItemCount(_pokemon?: Pokemon): number {
    return 2;
  }
}

export abstract class ConsumablePokemonModifier extends ConsumableModifier {
  public pokemonId: number;

  constructor(type: ModifierType, pokemonId: number) {
    super(type);

    this.pokemonId = pokemonId;
  }

  /**
   * Checks if {@linkcode ConsumablePokemonModifier} should be applied
   * @param playerPokemon The {@linkcode PlayerPokemon} that consumes the item
   * @param _args N/A
   * @returns `true` if {@linkcode ConsumablePokemonModifier} should be applied
   */
  override shouldApply(playerPokemon?: PlayerPokemon, ..._args: unknown[]): boolean {
    return !!playerPokemon && (this.pokemonId === -1 || playerPokemon.id === this.pokemonId);
  }

  /**
   * Applies {@linkcode ConsumablePokemonModifier}
   * @param playerPokemon The {@linkcode PlayerPokemon} that consumes the item
   * @param args Additional arguments passed to {@linkcode ConsumablePokemonModifier.apply}
   */
  abstract override apply(playerPokemon: PlayerPokemon, ...args: unknown[]): boolean;

  getPokemon() {
    return globalScene.getPlayerParty().find(p => p.id === this.pokemonId);
  }
}

export class TerastallizeModifier extends ConsumablePokemonModifier {
  public declare type: TerastallizeModifierType;
  public teraType: PokemonType;

  constructor(type: TerastallizeModifierType, pokemonId: number, teraType: PokemonType) {
    super(type, pokemonId);

    this.teraType = teraType;
  }

  /**
   * Checks if {@linkcode TerastallizeModifier} should be applied
   * @param playerPokemon The {@linkcode PlayerPokemon} that consumes the item
   * @returns `true` if the {@linkcode TerastallizeModifier} should be applied
   */
  override shouldApply(playerPokemon?: PlayerPokemon): boolean {
    return (
      super.shouldApply(playerPokemon) &&
      [playerPokemon?.species.speciesId, playerPokemon?.fusionSpecies?.speciesId].filter(
        s => s === SpeciesId.TERAPAGOS || s === SpeciesId.OGERPON || s === SpeciesId.SHEDINJA,
      ).length === 0
    );
  }

  /**
   * Applies {@linkcode TerastallizeModifier}
   * @param pokemon The {@linkcode PlayerPokemon} that consumes the item
   * @returns `true` if hp was restored
   */
  override apply(pokemon: Pokemon): boolean {
    pokemon.teraType = this.teraType;
    return true;
  }
}

export class WishingStarModifier extends PokemonHeldItemModifier {
  private maxBattles = 10;
  private battleCount: number;

  constructor(type: ModifierType, pokemonId: number, maxBattles?: number, battleCount?: number) {
    super(type, pokemonId);
    this.maxBattles = maxBattles ?? 10;
    this.battleCount = battleCount ?? this.maxBattles;
  }

  clone(): WishingStarModifier {
    return new WishingStarModifier(this.type, this.pokemonId, this.maxBattles, this.battleCount);
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof WishingStarModifier && modifier.type === this.type;
  }

  /** 장착 적용 시 실행 (실제 효과는 applyToStat에서 처리) */
  override apply(playerPokemon: PlayerPokemon): boolean {
    if (this.isForbiddenSpecies(playerPokemon)) {
      console.log(`[WishingStarModifier] ${playerPokemon.name}은 금지된 종이라 적용되지 않습니다.`);
      return false;
    }

    console.log(`[WishingStarModifier] ${playerPokemon.name}에게 소원의별 장착 완료`);
    return true;
  }

  override shouldApply(pokemon?: Pokemon): boolean {
  if (!pokemon) return false;
  if (this.isForbiddenSpecies(pokemon)) {
    console.log(`[WishingStarModifier] ${pokemon.name}은 금지된 종입니다.`);
    return false;
  }
  // ✅ 조건 완화 → 무조건 true 반환 (자시안·자마젠타만 예외)
  return true;
}

  /** 스탯 보정 (예: 기가맥스면 1.3배 보너스) */
  applyToStat(pokemon: Pokemon, stat: Stat, multiplier: NumberHolder): void {
    if (this.isForbiddenSpecies(pokemon)) return;

    if (this.isGigantamaxForm(pokemon)) {
      multiplier.value *= 1.3;
      console.log(`[WishingStarModifier] ${pokemon.name} 기가맥스폼 → ${Stat[stat]} x1.3`);
    }
  }

  /** 기가맥스 여부 판정 */
  private isGigantamaxForm(pokemon: any): boolean {
    if (!(pokemon instanceof Pokemon)) return false;

    const formKey = pokemon.getFormKey();
    return (
      formKey === SpeciesFormKey.GIGANTAMAX ||
      formKey === SpeciesFormKey.GIGANTAMAX_SINGLE ||
      formKey === SpeciesFormKey.GIGANTAMAX_RAPID ||
      formKey === SpeciesFormKey.ETERNAMAX
    );
  }

  /** 남은 배틀 수 감소 및 자동 해제 */
  lapse(): boolean {
    this.battleCount--;
    if (this.battleCount <= 0) {
      const pokemon = this.getPokemon?.();
      if (pokemon) {
        pokemon.isDynamaxed = false;
        pokemon.maxHp = pokemon.getMaxHp();
        pokemon.hp = Math.min(pokemon.hp, pokemon.maxHp);
        pokemon.updateHpBar?.();
      }
      globalScene.removeModifier(this);
      return false;
    }
    return true;
  }

  /** 아이콘 + 남은 배틀 수 표시 */
  override getIcon(): Phaser.GameObjects.Container {
    const container = super.getIcon();
    const hue = Math.floor(120 * (this.battleCount / this.maxBattles) + 5);
    const typeHex = hslToHex(hue, 0.5, 0.9);
    const strokeHex = hslToHex(hue, 0.7, 0.3);

    const battleCountText = addTextObject(27, 0, this.battleCount.toString(), TextStyle.PARTY, {
      fontSize: "66px",
      color: typeHex,
    });
    battleCountText.setShadow(0, 0);
    battleCountText.setStroke(strokeHex, 16);
    battleCountText.setOrigin(1, 0);
    container.add(battleCountText);

    return container;
  }

  /** 적용 금지 포켓몬 */
  private isForbiddenSpecies(pokemonOrId?: Pokemon | number | null): boolean {
    if (!pokemonOrId) return false;

    let id: number;
    if (typeof pokemonOrId === "number") {
      id = pokemonOrId;
    } else {
      id =
        pokemonOrId.speciesId ??
        pokemonOrId.species?.speciesId ??
        pokemonOrId.speciesData?.speciesId ??
        pokemonOrId.speciesData?.id;
    }

    return id === SpeciesId.ZACIAN || id === SpeciesId.ZAMAZENTA;
  }

  override getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * 소원의별 적용 시도 함수 (성공/실패 모두 메시지 출력)
 */
function tryApplyWishingStar(type: ModifierType, pokemon: Pokemon): boolean {
  if (pokemon.speciesId === SpeciesId.ZACIAN || pokemon.speciesId === SpeciesId.ZAMAZENTA) {
    globalScene.showMessage(`${pokemon.name}에게 소원의별을 사용할 수 없습니다.`);
    return false;
  }

  const modifier = new WishingStarModifier(type, pokemon.id);
  const result = globalScene.addModifier(modifier);

  if (!result) {
    console.warn(`[tryApplyWishingStar] ${pokemon.name} → addModifier 실패`);
    globalScene.showMessage(`${pokemon.name}에게 소원의별을 적용할 수 없습니다.`);
    return false;
  }

  console.debug(`[tryApplyWishingStar] ${pokemon.name}에게 소원의별 적용 성공`);
  globalScene.showMessage(`${pokemon.name}에게 소원의별이 적용되었습니다!`);
  return true;
}

export class ZCrystalMoveModifier extends ConsumablePokemonModifier {
  constructor(
    public readonly type: PokemonModifierType,
    public readonly pokemonId: number,
    public readonly isUniversal: boolean,
  ) {
    super(type, pokemonId);
  }

  override apply(playerPokemon: PlayerPokemon): boolean {
    console.warn(`[ZMove] ${this.isUniversal ? "Generic" : "Exclusive"} LearnMovePhase 삽입`, this.type);

    const moveId = (this.type as any).moveId; // 타입 명확화 필요
    const learnType = this.isUniversal ? LearnMoveType.Z_GENERIC : LearnMoveType.Z_EXCLUSIVE;

    globalScene.phaseManager.unshiftNew(
      "LearnMovePhase",
      globalScene.getPlayerParty().indexOf(playerPokemon),
      this.type.moveId
    );
    return true;
  }
}

export class ZGenericCrystalMoveModifier extends ZCrystalMoveModifier {
  public declare type: ZGenericCrystalMoveModifierType;

  /**
   * Applies {@linkcode TmModifier}
   * @param playerPokemon The {@linkcode PlayerPokemon} that should learn the TM
   * @returns always `true`
   */
  override apply(playerPokemon: PlayerPokemon): boolean {
    globalScene.phaseManager.unshiftNew(
      "LearnMovePhase",
      globalScene.getPlayerParty().indexOf(playerPokemon),
      this.type.moveId,
      LearnMoveType.TM,
    );

    return true;
  }
}

export class ZExclusiveCrystalMoveModifier extends ZCrystalMoveModifier {
  public declare type: ZExclusiveCrystalMoveModifierType;

  /**
   * Applies {@linkcode TmModifier}
   * @param playerPokemon The {@linkcode PlayerPokemon} that should learn the TM
   * @returns always `true`
   */
  override apply(playerPokemon: PlayerPokemon): boolean {
    globalScene.phaseManager.unshiftNew(
      "LearnMovePhase",
      globalScene.getPlayerParty().indexOf(playerPokemon),
      this.type.moveId,
      LearnMoveType.TM,
    );

    return true;
  }
}

export class PokemonHpRestoreModifier extends ConsumablePokemonModifier {
  private restorePoints: number;
  private restorePercent: number;
  private healStatus: boolean;
  public fainted: boolean;

  constructor(
    type: ModifierType,
    pokemonId: number,
    restorePoints: number,
    restorePercent: number,
    healStatus: boolean,
    fainted?: boolean,
  ) {
    super(type, pokemonId);

    this.restorePoints = restorePoints;
    this.restorePercent = restorePercent;
    this.healStatus = healStatus;
    this.fainted = !!fainted;
  }

  /**
   * Checks if {@linkcode PokemonHpRestoreModifier} should be applied
   * @param playerPokemon The {@linkcode PlayerPokemon} that consumes the item
   * @param multiplier The multiplier of the hp restore
   * @returns `true` if the {@linkcode PokemonHpRestoreModifier} should be applied
   */
  override shouldApply(playerPokemon?: PlayerPokemon, multiplier?: number): boolean {
    return (
      super.shouldApply(playerPokemon) &&
      (this.fainted || (!isNullOrUndefined(multiplier) && typeof multiplier === "number"))
    );
  }

  /**
   * Applies {@linkcode PokemonHpRestoreModifier}
   * @param pokemon The {@linkcode PlayerPokemon} that consumes the item
   * @param multiplier The multiplier of the hp restore
   * @returns `true` if hp was restored
   */
  override apply(pokemon: Pokemon, multiplier: number): boolean {
    if (!pokemon.hp === this.fainted) {
      let restorePoints = this.restorePoints;
      if (!this.fainted) {
        restorePoints = Math.floor(restorePoints * multiplier);
      }
      if (this.fainted || this.healStatus) {
        pokemon.resetStatus(true, true, false, false);
      }
      pokemon.hp = Math.min(
        pokemon.hp +
          Math.max(Math.ceil(Math.max(Math.floor(this.restorePercent * 0.01 * pokemon.getMaxHp()), restorePoints)), 1),
        pokemon.getMaxHp(),
      );
      return true;
    }
    return false;
  }
}

export class PokemonStatusHealModifier extends ConsumablePokemonModifier {
  /**
   * Applies {@linkcode PokemonStatusHealModifier}
   * @param playerPokemon The {@linkcode PlayerPokemon} that gets healed from the status
   * @returns always `true`
   */
  override apply(playerPokemon: PlayerPokemon): boolean {
    playerPokemon.resetStatus(true, true, false, false);
    return true;
  }
}

export abstract class ConsumablePokemonMoveModifier extends ConsumablePokemonModifier {
  public moveIndex: number;

  constructor(type: ModifierType, pokemonId: number, moveIndex: number) {
    super(type, pokemonId);

    this.moveIndex = moveIndex;
  }
}

const allZMoveIds: Set<Moves> = new Set(Object.keys(zmovesSpecies).map(Number));
const allMaxMoveIds: Set<Moves> = new Set(Object.keys(maxmovesSpecies).map(Number));

export class PokemonPpRestoreModifier extends ConsumablePokemonMoveModifier {
  private restorePoints: number;

  constructor(type: ModifierType, pokemonId: number, moveIndex: number, restorePoints: number) {
    super(type, pokemonId, moveIndex);
    this.restorePoints = restorePoints;
  }

  override canApply(playerPokemon: PlayerPokemon): boolean {
    const move = playerPokemon.getMoveset()[this.moveIndex];
    return !!move && !allZMoveIds.has(move.moveId);
  }

  override apply(playerPokemon: PlayerPokemon): boolean {
    const move = playerPokemon.getMoveset()[this.moveIndex];

    if (!move || allZMoveIds.has(move.moveId)) {
      console.log(`PP 회복 실패: Z기술 ${move?.moveId}는 대상 아님`);
      return false;
    }

    move.ppUsed = this.restorePoints > -1 ? Math.max(move.ppUsed - this.restorePoints, 0) : 0;

    return true;
  }
}

export class DynamaxMovePpUpModifier extends ConsumablePokemonMoveModifier {
  private upPoints: number;

  constructor(type: ModifierType, pokemonId: number, moveIndex: number, upPoints: number) {
    super(type, pokemonId, moveIndex);
    this.upPoints = upPoints;
  }

  override apply(playerPokemon: PlayerPokemon): boolean {
    const move = playerPokemon.getMoveset()[this.moveIndex];

    if (move && allMaxMoveIds.has(move.moveId) && !move.maxPpOverride) {
      move.ppUp = Math.min(move.ppUp + this.upPoints, 3);
      return true;
    }

    return false;
  }
}

export class PokemonAllMovePpRestoreModifier extends ConsumablePokemonModifier {
  private restorePoints: number;

  constructor(type: ModifierType, pokemonId: number, restorePoints: number) {
    super(type, pokemonId);

    this.restorePoints = restorePoints;
  }

  /**
   * Applies {@linkcode PokemonAllMovePpRestoreModifier}
   * @param playerPokemon The {@linkcode PlayerPokemon} that should get all move pp restored
   * @returns always `true`
   */
  override apply(playerPokemon: PlayerPokemon): boolean {
    for (const move of playerPokemon.getMoveset()) {
      if (move) {
        move.ppUsed = this.restorePoints > -1 ? Math.max(move.ppUsed - this.restorePoints, 0) : 0;
      }
    }

    return true;
  }
}

export class PokemonZMovePpRestoreModifier extends ConsumablePokemonModifier {
  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId);
  }

  override apply(playerPokemon: PlayerPokemon): boolean {
    let recovered = 0;

    for (const move of playerPokemon.getMoveset()) {
      if (move && allZMoveIds.has(move.moveId)) {
        if (move.ppUsed > 0) {
          move.ppUsed = 0;
          recovered++;
        }
      }
    }

    if (recovered > 0) {
      globalScene.ui.showText(`Z기술 ${recovered}개의 기력이 회복되었습니다!`);
    } else {
      globalScene.ui.showText("회복할 Z기술의 기력이 없습니다.");
    }

    return true;
  }
}

export class PokemonMaxMovePpRestoreModifier extends ConsumablePokemonModifier {
  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId);
  }

  override apply(playerPokemon: PlayerPokemon): boolean {
    let recovered = 0;

    for (const move of playerPokemon.getMoveset()) {
      if (move && allMaxMoveIds.has(move.moveId)) {
        if (move.ppUsed > 0) {
          move.ppUsed = 0;
          recovered++;
        }
      }
    }

    if (recovered > 0) {
      globalScene.ui.showText(`다이맥스 기술 ${recovered}개의 기력이 회복되었습니다!`);
    } else {
      globalScene.ui.showText("회복할 다이맥스 기술의 기력이 없습니다.");
    }

    return true;
  }
}

export class PokemonPpUpModifier extends ConsumablePokemonMoveModifier {
  private upPoints: number;

  constructor(type: ModifierType, pokemonId: number, moveIndex: number, upPoints: number) {
    super(type, pokemonId, moveIndex);

    this.upPoints = upPoints;
  }

  /**
   * Applies {@linkcode PokemonPpUpModifier}
   * @param playerPokemon The {@linkcode PlayerPokemon} that gets a pp up on move-slot {@linkcode moveIndex}
   * @returns
   */
  override apply(playerPokemon: PlayerPokemon): boolean {
    const move = playerPokemon.getMoveset()[this.moveIndex];

    if (move && !move.maxPpOverride) {
      move.ppUp = Math.min(move.ppUp + this.upPoints, 3);
    }

    return true;
  }
}

export class PokemonNatureChangeModifier extends ConsumablePokemonModifier {
  public nature: Nature;

  constructor(type: ModifierType, pokemonId: number, nature: Nature) {
    super(type, pokemonId);

    this.nature = nature;
  }

  /**
   * Applies {@linkcode PokemonNatureChangeModifier}
   * @param playerPokemon {@linkcode PlayerPokemon} to apply the {@linkcode Nature} change to
   * @returns
   */
  override apply(playerPokemon: PlayerPokemon): boolean {
    playerPokemon.setCustomNature(this.nature);
    globalScene.gameData.unlockSpeciesNature(playerPokemon.species, this.nature);

    return true;
  }
}

export class PokemonLevelIncrementModifier extends ConsumablePokemonModifier {
  /**
   * Applies {@linkcode PokemonLevelIncrementModifier}
   * @param playerPokemon The {@linkcode PlayerPokemon} that should get levels incremented
   * @param levelCount The amount of levels to increment
   * @returns always `true`
   */
  override apply(playerPokemon: PlayerPokemon, levelCount: NumberHolder = new NumberHolder(1)): boolean {
    globalScene.applyModifiers(LevelIncrementBoosterModifier, true, levelCount);

    playerPokemon.level += levelCount.value;
    if (playerPokemon.level <= globalScene.getMaxExpLevel(true)) {
      playerPokemon.exp = getLevelTotalExp(playerPokemon.level, playerPokemon.species.growthRate);
      playerPokemon.levelExp = 0;
    }

    playerPokemon.addFriendship(FRIENDSHIP_GAIN_FROM_RARE_CANDY, true);

    globalScene.phaseManager.unshiftNew(
      "LevelUpPhase",
      globalScene.getPlayerParty().indexOf(playerPokemon),
      playerPokemon.level - levelCount.value,
      playerPokemon.level,
    );

    return true;
  }
}

export class TmModifier extends ConsumablePokemonModifier {
  public declare type: TmModifierType;

  /**
   * Applies {@linkcode TmModifier}
   * @param playerPokemon The {@linkcode PlayerPokemon} that should learn the TM
   * @returns always `true`
   */
  override apply(playerPokemon: PlayerPokemon): boolean {
    globalScene.phaseManager.unshiftNew(
      "LearnMovePhase",
      globalScene.getPlayerParty().indexOf(playerPokemon),
      this.type.moveId,
      LearnMoveType.TM,
    );

    return true;
  }
}

export class TrModifier extends ConsumablePokemonModifier {
  public declare type: TrModifierType;

  /**
   * Applies {@linkcode TmModifier}
   * @param playerPokemon The {@linkcode PlayerPokemon} that should learn the TM
   * @returns always `true`
   */
  override apply(playerPokemon: PlayerPokemon): boolean {
    globalScene.phaseManager.unshiftNew(
      "LearnMovePhase",
      globalScene.getPlayerParty().indexOf(playerPokemon),
      this.type.moveId,
      LearnMoveType.TM,
    );

    return true;
  }
}

export class RememberMoveModifier extends ConsumablePokemonModifier {
  public levelMoveIndex: number;

  constructor(type: ModifierType, pokemonId: number, levelMoveIndex: number) {
    super(type, pokemonId);

    this.levelMoveIndex = levelMoveIndex;
  }

  /**
   * Applies {@linkcode RememberMoveModifier}
   * @param playerPokemon The {@linkcode PlayerPokemon} that should remember the move
   * @returns always `true`
   */
  override apply(playerPokemon: PlayerPokemon, cost?: number): boolean {
    globalScene.phaseManager.unshiftNew(
      "LearnMovePhase",
      globalScene.getPlayerParty().indexOf(playerPokemon),
      playerPokemon.getLearnableLevelMoves()[this.levelMoveIndex],
      LearnMoveType.MEMORY,
      cost,
    );

    return true;
  }
}

export class MaxIvModifier extends ConsumablePokemonModifier {
  public statIndex: number; // 0: HP, 1: Atk, ..., 5: Speed

  constructor(type: ModifierType, pokemonId: number, statIndex: number) {
    super(type, pokemonId);

    // statIndex가 유효한 값인지 확인
    if (statIndex === undefined || statIndex < 0 || statIndex > 5) {
      throw new Error(`Invalid statIndex value: ${statIndex}`);
    }
    this.statIndex = statIndex;
  }

  /**
   * Applies MaxIvModifier
   * @param pokemonData The PokemonData instance whose IV will be maxed
   * @returns always `true`
   */
  override async apply(pokemon: PlayerPokemon): Promise<boolean> {
    const statKey = PERMANENT_STATS[this.statIndex];
    const currentIv = pokemon.ivs[statKey];

    if (currentIv < 31) {
      const newIvs = [...pokemon.ivs];
      newIvs[this.statIndex] = 31;

      console.log("[MaxIvModifier] Before:", {
        ivs: pokemon.ivs,
        stats: pokemon.stats,
      });

      pokemon.setCustomIVs(newIvs);
      pokemon.calculateStats();

      console.log("[MaxIvModifier] After:", {
        ivs: pokemon.ivs,
        stats: pokemon.stats,
      });

      // 도감 등록 시도
      await globalScene.gameData.setPokemonCaught(pokemon, true);

      const speciesRootForm = pokemon.species.getRootSpeciesId(true);
      if (speciesRootForm) {
        console.log("[DEBUG] Root Species ID:", speciesRootForm);
        globalScene.gameData.updateSpeciesDexIvs(speciesRootForm, newIvs); // ← 여기 핵심
      }
    }

    // 스타터 포켓몬인 경우 추가로 보장
    if (pokemon.isStarter) {
      await globalScene.gameData.setPokemonCaught(pokemon, true);
    }

    return true;
  }
}

export class MaxAllIvModifier extends ConsumablePokemonModifier {
  constructor(type: ModifierType, pokemonId: number) {
    super(type, pokemonId);
  }

  /**
   * Applies MaxAllIvModifier - sets all IVs to 31
   * @param pokemon The PlayerPokemon instance
   * @returns always `true`
   */
  override async apply(pokemon: PlayerPokemon): Promise<boolean> {
    const newIvs = [...pokemon.ivs].map(() => 31);

    console.log("[MaxAllIvModifier] Before:", {
      ivs: pokemon.ivs,
      stats: pokemon.stats,
    });

    pokemon.setCustomIVs(newIvs);
    pokemon.calculateStats();

    console.log("[MaxAllIvModifier] After:", {
      ivs: pokemon.ivs,
      stats: pokemon.stats,
    });

    // 도감 등록 시도
    await globalScene.gameData.setPokemonCaught(pokemon, true);

    const speciesRootForm = pokemon.species.getRootSpeciesId(true);
    if (speciesRootForm) {
      console.log("[DEBUG] Root Species ID:", speciesRootForm);
      globalScene.gameData.updateSpeciesDexIvs(speciesRootForm, newIvs);
    }

    // 스타터 포켓몬이라면 추가 등록
    if (pokemon.isStarter) {
      await globalScene.gameData.setPokemonCaught(pokemon, true);
    }

    return true;
  }
}

export class ChangeAbilityModifier extends ConsumablePokemonModifier {
  public readonly changeAbilityType: ChangeAbilityType;

  constructor(type: ModifierType, pokemonId: number, changeAbilityType: ChangeAbilityType) {
    super(type, pokemonId);
    this.changeAbilityType = changeAbilityType;
  }

  override apply(playerPokemon: PlayerPokemon, cost?: number): boolean {
    globalScene.phaseManager.unshiftPhase(
      new ChangeAbilityPhase(
        globalScene.getPlayerParty().indexOf(playerPokemon),
        this.changeAbilityType, // 여기도 this로 변경!
        cost,
      ),
    );

    return true;
  }
}

export class RegisterAbilityModifier extends ConsumablePokemonModifier {
  public readonly registerAbilityType: RegisterAbilityType;

  constructor(type: ModifierType, pokemonId: number, registerAbilityType: RegisterAbilityType) {
    super(type, pokemonId);
    this.registerAbilityType = registerAbilityType;
  }

  override apply(playerPokemon: PlayerPokemon, cost?: number): boolean {
    globalScene.phaseManager.unshiftPhase(
      new RegisterAbilityPhase(
        globalScene.getPlayerParty().indexOf(playerPokemon),
        this.registerAbilityType, // 여기도 this로 변경!
        cost,
      ),
    );

    return true;
  }
}

export class EvolutionItemModifier extends ConsumablePokemonModifier {
  public declare type: EvolutionItemModifierType;
  /**
   * Applies {@linkcode EvolutionItemModifier}
   * @param playerPokemon The {@linkcode PlayerPokemon} that should evolve via item
   * @returns `true` if the evolution was successful
   */
  override apply(playerPokemon: PlayerPokemon): boolean {
    let matchingEvolution = pokemonEvolutions.hasOwnProperty(playerPokemon.species.speciesId)
      ? pokemonEvolutions[playerPokemon.species.speciesId].find(
          e => e.evoItem === this.type.evolutionItem && e.validate(playerPokemon, false, e.item!),
        )
      : null;

    if (!matchingEvolution && playerPokemon.isFusion()) {
      matchingEvolution = pokemonEvolutions[playerPokemon.fusionSpecies!.speciesId].find(
        e => e.evoItem === this.type.evolutionItem && e.validate(playerPokemon, true, e.item!),
      );
      if (matchingEvolution) {
        matchingEvolution = new FusionSpeciesFormEvolution(playerPokemon.species.speciesId, matchingEvolution);
      }
    }

    if (matchingEvolution) {
      globalScene.phaseManager.unshiftNew("EvolutionPhase", playerPokemon, matchingEvolution, playerPokemon.level - 1);
      return true;
    }

    return false;
  }
}

export class FusePokemonModifier extends ConsumablePokemonModifier {
  public fusePokemonId: number;

  constructor(type: ModifierType, pokemonId: number, fusePokemonId: number) {
    super(type, pokemonId);

    this.fusePokemonId = fusePokemonId;
  }

  /**
   * Checks if {@linkcode FusePokemonModifier} should be applied
   * @param playerPokemon {@linkcode PlayerPokemon} that should be fused
   * @param playerPokemon2 {@linkcode PlayerPokemon} that should be fused with {@linkcode playerPokemon}
   * @returns `true` if {@linkcode FusePokemonModifier} should be applied
   */
  override shouldApply(playerPokemon?: PlayerPokemon, playerPokemon2?: PlayerPokemon): boolean {
    return (
      super.shouldApply(playerPokemon, playerPokemon2) && !!playerPokemon2 && this.fusePokemonId === playerPokemon2.id
    );
  }

  /**
   * Applies {@linkcode FusePokemonModifier}
   * @param playerPokemon {@linkcode PlayerPokemon} that should be fused
   * @param playerPokemon2 {@linkcode PlayerPokemon} that should be fused with {@linkcode playerPokemon}
   * @returns always Promise<true>
   */
  override apply(playerPokemon: PlayerPokemon, playerPokemon2: PlayerPokemon): boolean {
    playerPokemon.fuse(playerPokemon2);
    return true;
  }
}

export class EggHatchSpeedUpModifier extends PersistentModifier {
  tier: number; // 티어 정보 추가

  constructor(type: ModifierType, stackCount = 1, tier = 1) {
    super(type, stackCount);
    this.tier = tier;
  }

  getMaxStackCount(): number {
    return 3;
  }

  match(modifier: Modifier): boolean {
    return modifier instanceof EggHatchSpeedUpModifier && modifier.tier === this.tier;
  }

  apply(): boolean {
    return true;
  }

  clone(): EggHatchSpeedUpModifier {
    return new EggHatchSpeedUpModifier(this.type, this.stackCount, this.tier);
  }

  getHatchTurnMultiplier(): number {
    const stacks = Math.min(this.stackCount, 3);
    return 1 - 0.3 * stacks;
  }
}

export class HealingBoosterModifier extends PersistentModifier {
  private multiplier: number;

  constructor(type: ModifierType, multiplier: number, stackCount?: number) {
    super(type, stackCount);

    this.multiplier = multiplier;
  }

  match(modifier: Modifier): boolean {
    return modifier instanceof HealingBoosterModifier;
  }

  clone(): HealingBoosterModifier {
    return new HealingBoosterModifier(this.type, this.multiplier, this.stackCount);
  }

  getArgs(): any[] {
    return [this.multiplier];
  }

  /**
   * Applies {@linkcode HealingBoosterModifier}
   * @param healingMultiplier the multiplier to apply to the healing
   * @returns always `true`
   */
  override apply(healingMultiplier: NumberHolder): boolean {
    healingMultiplier.value *= 1 + (this.multiplier - 1) * this.getStackCount();

    return true;
  }

  getMaxStackCount(): number {
    return 5;
  }
}

export class ExpBoosterModifier extends PersistentModifier {
  private boostMultiplier: number;

  constructor(type: ModifierType, boostPercent: number, stackCount?: number) {
    super(type, stackCount);

    this.boostMultiplier = boostPercent * 0.01;
  }

  match(modifier: Modifier): boolean {
    if (modifier instanceof ExpBoosterModifier) {
      const expModifier = modifier as ExpBoosterModifier;
      return expModifier.boostMultiplier === this.boostMultiplier;
    }
    return false;
  }

  clone(): ExpBoosterModifier {
    return new ExpBoosterModifier(this.type, this.boostMultiplier * 100, this.stackCount);
  }

  getArgs(): any[] {
    return [this.boostMultiplier * 100];
  }

  /**
   * Applies {@linkcode ExpBoosterModifier}
   * @param boost {@linkcode NumberHolder} holding the boost value
   * @returns always `true`
   */
  override apply(boost: NumberHolder): boolean {
    boost.value = Math.floor(boost.value * (1 + this.getStackCount() * this.boostMultiplier));

    return true;
  }

  getMaxStackCount(_forThreshold?: boolean): number {
    return this.boostMultiplier < 1 ? (this.boostMultiplier < 0.6 ? 99 : 30) : 10;
  }
}

export class PokemonExpBoosterModifier extends PokemonHeldItemModifier {
  public declare type: PokemonExpBoosterModifierType;

  private boostMultiplier: number;

  constructor(type: PokemonExpBoosterModifierType, pokemonId: number, boostPercent: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
    this.boostMultiplier = boostPercent * 0.01;
  }

  matchType(modifier: Modifier): boolean {
    if (modifier instanceof PokemonExpBoosterModifier) {
      const pokemonExpModifier = modifier as PokemonExpBoosterModifier;
      return pokemonExpModifier.boostMultiplier === this.boostMultiplier;
    }
    return false;
  }

  clone(): PersistentModifier {
    return new PokemonExpBoosterModifier(this.type, this.pokemonId, this.boostMultiplier * 100, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.boostMultiplier * 100);
  }

  /**
   * Checks if {@linkcode PokemonExpBoosterModifier} should be applied
   * @param pokemon The {@linkcode Pokemon} to apply the exp boost to
   * @param boost {@linkcode NumberHolder} holding the exp boost value
   * @returns `true` if {@linkcode PokemonExpBoosterModifier} should be applied
   */
  override shouldApply(pokemon: Pokemon, boost: NumberHolder): boolean {
    return super.shouldApply(pokemon, boost) && !!boost;
  }

  /**
   * Applies {@linkcode PokemonExpBoosterModifier}
   * @param _pokemon The {@linkcode Pokemon} to apply the exp boost to
   * @param boost {@linkcode NumberHolder} holding the exp boost value
   * @returns always `true`
   */
  override apply(_pokemon: Pokemon, boost: NumberHolder): boolean {
    boost.value = Math.floor(boost.value * (1 + this.getStackCount() * this.boostMultiplier));

    return true;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 99;
  }
}

export class ExpShareModifier extends PersistentModifier {
  match(modifier: Modifier): boolean {
    return modifier instanceof ExpShareModifier;
  }

  clone(): ExpShareModifier {
    return new ExpShareModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode ExpShareModifier}
   * @returns always `true`
   */
  override apply(): boolean {
    return true;
  }

  getMaxStackCount(): number {
    return 5;
  }
}

export class ExpBalanceModifier extends PersistentModifier {
  match(modifier: Modifier): boolean {
    return modifier instanceof ExpBalanceModifier;
  }

  clone(): ExpBalanceModifier {
    return new ExpBalanceModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode ExpBalanceModifier}
   * @returns always `true`
   */
  override apply(): boolean {
    return true;
  }

  getMaxStackCount(): number {
    return 4;
  }
}

export class PokemonFriendshipBoosterModifier extends PokemonHeldItemModifier {
  public declare type: PokemonFriendshipBoosterModifierType;

  matchType(modifier: Modifier): boolean {
    return modifier instanceof PokemonFriendshipBoosterModifier;
  }

  clone(): PersistentModifier {
    return new PokemonFriendshipBoosterModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Applies {@linkcode PokemonFriendshipBoosterModifier}
   * @param _pokemon The {@linkcode Pokemon} to apply the friendship boost to
   * @param friendship {@linkcode NumberHolder} holding the friendship boost value
   * @returns always `true`
   */
  override apply(_pokemon: Pokemon, friendship: NumberHolder): boolean {
    friendship.value = Math.floor(friendship.value * (1 + 0.5 * this.getStackCount()));

    return true;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 3;
  }
}

export class PokemonNatureWeightModifier extends PokemonHeldItemModifier {
  matchType(modifier: Modifier): boolean {
    return modifier instanceof PokemonNatureWeightModifier;
  }

  clone(): PersistentModifier {
    return new PokemonNatureWeightModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Applies {@linkcode PokemonNatureWeightModifier}
   * @param _pokemon The {@linkcode Pokemon} to apply the nature weight to
   * @param multiplier {@linkcode NumberHolder} holding the nature weight
   * @returns `true` if multiplier was applied
   */
  override apply(_pokemon: Pokemon, multiplier: NumberHolder): boolean {
    if (multiplier.value !== 1) {
      multiplier.value += 0.1 * this.getStackCount() * (multiplier.value > 1 ? 1 : -1);
      return true;
    }

    return false;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 10;
  }
}

export class PokemonMoveAccuracyBoosterModifier extends PokemonHeldItemModifier {
  public declare type: PokemonMoveAccuracyBoosterModifierType;
  private accuracyAmount: number;

  constructor(type: PokemonMoveAccuracyBoosterModifierType, pokemonId: number, accuracy: number, stackCount?: number) {
    super(type, pokemonId, stackCount);
    this.accuracyAmount = accuracy;
  }

  matchType(modifier: Modifier): boolean {
    if (modifier instanceof PokemonMoveAccuracyBoosterModifier) {
      const pokemonAccuracyBoosterModifier = modifier as PokemonMoveAccuracyBoosterModifier;
      return pokemonAccuracyBoosterModifier.accuracyAmount === this.accuracyAmount;
    }
    return false;
  }

  clone(): PersistentModifier {
    return new PokemonMoveAccuracyBoosterModifier(this.type, this.pokemonId, this.accuracyAmount, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.accuracyAmount);
  }

  /**
   * Checks if {@linkcode PokemonMoveAccuracyBoosterModifier} should be applied
   * @param pokemon The {@linkcode Pokemon} to apply the move accuracy boost to
   * @param moveAccuracy {@linkcode NumberHolder} holding the move accuracy boost
   * @returns `true` if {@linkcode PokemonMoveAccuracyBoosterModifier} should be applied
   */
  override shouldApply(pokemon?: Pokemon, moveAccuracy?: NumberHolder): boolean {
    return super.shouldApply(pokemon, moveAccuracy) && !!moveAccuracy;
  }

  /**
   * Applies {@linkcode PokemonMoveAccuracyBoosterModifier}
   * @param _pokemon The {@linkcode Pokemon} to apply the move accuracy boost to
   * @param moveAccuracy {@linkcode NumberHolder} holding the move accuracy boost
   * @returns always `true`
   */
  override apply(_pokemon: Pokemon, moveAccuracy: NumberHolder): boolean {
    moveAccuracy.value = moveAccuracy.value + this.accuracyAmount * this.getStackCount();

    return true;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 3;
  }
}

export class PokemonMultiHitModifier extends PokemonHeldItemModifier {
  public declare type: PokemonMultiHitModifierType;

  matchType(modifier: Modifier): boolean {
    return modifier instanceof PokemonMultiHitModifier;
  }

  clone(): PersistentModifier {
    return new PokemonMultiHitModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * For each stack, converts 25 percent of attack damage into an additional strike.
   * @param pokemon The {@linkcode Pokemon} using the move
   * @param moveId The {@linkcode MoveId | identifier} for the move being used
   * @param count {@linkcode NumberHolder} holding the move's hit count for this turn
   * @param damageMultiplier {@linkcode NumberHolder} holding a damage multiplier applied to a strike of this move
   * @returns always `true`
   */
  override apply(
  pokemon: Pokemon,
  moveId: MoveId,
  count: NumberHolder | null = null,
  damageMultiplier: NumberHolder | null = null,
): boolean {
  const move = allMoves[moveId];

  if (!move || typeof move.canBeMultiStrikeEnhanced !== "function") {
    console.warn(`[PokemonMultiHitModifier] Invalid moveId=${moveId}, cannot apply multi-hit enhancement`);
    return false;
  }

  if (!move.canBeMultiStrikeEnhanced(pokemon)) {
    return false;
  }

  if (count) return this.applyHitCountBoost(count);
  if (damageMultiplier) return this.applyDamageModifier(pokemon, damageMultiplier);

  return false;

    if (!isNullOrUndefined(count)) {
      return this.applyHitCountBoost(count);
    }
    if (!isNullOrUndefined(damageMultiplier)) {
      return this.applyDamageModifier(pokemon, damageMultiplier);
    }

    return false;
  }

  /** Adds strikes to a move equal to the number of stacked Multi-Lenses */
  private applyHitCountBoost(count: NumberHolder): boolean {
    count.value += this.getStackCount();
    return true;
  }

  /**
   * If applied to the first hit of a move, sets the damage multiplier
   * equal to (1 - the number of stacked Multi-Lenses).
   * Additional strikes beyond that are given a 0.25x damage multiplier
   */
  private applyDamageModifier(pokemon: Pokemon, damageMultiplier: NumberHolder): boolean {
    if (pokemon.turnData.hitsLeft === pokemon.turnData.hitCount) {
      // Reduce first hit by 25% for each stack count
      damageMultiplier.value *= 1 - 0.25 * this.getStackCount();
      return true;
    }

    if (pokemon.turnData.hitCount - pokemon.turnData.hitsLeft !== this.getStackCount() + 1) {
      // Deal 25% damage for each remaining Multi Lens hit
      damageMultiplier.value *= 0.25;
      return true;
    }
    // An extra hit not caused by Multi Lens -- assume it is Parental Bond
    return false;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 2;
  }
}

export class PokemonFormChangeItemModifier extends PokemonHeldItemModifier {
  public declare type: FormChangeItemModifierType;
  public formChangeItem: FormChangeItem;
  public active: boolean;
  public isTransferable = false;

  constructor(
    type: FormChangeItemModifierType,
    pokemonId: number,
    formChangeItem: FormChangeItem,
    active: boolean,
    stackCount?: number,
  ) {
    super(type, pokemonId, stackCount);
    this.formChangeItem = formChangeItem;
    this.active = active;
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof PokemonFormChangeItemModifier && modifier.formChangeItem === this.formChangeItem;
  }

  clone(): PersistentModifier {
    return new PokemonFormChangeItemModifier(
      this.type,
      this.pokemonId,
      this.formChangeItem,
      this.active,
      this.stackCount,
    );
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.formChangeItem, this.active);
  }

  /**
   * Applies {@linkcode PokemonFormChangeItemModifier}
   * @param pokemon The {@linkcode Pokemon} to apply the form change item to
   * @param active `true` if the form change item is active
   * @returns `true` if the form change item was applied
   */
  override apply(pokemon: Pokemon, active: boolean): boolean {
    const switchActive = this.active && !active;

    if (switchActive) {
      this.active = false;
    }

    const ret = globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeItemTrigger);

    if (switchActive) {
      this.active = true;
    }

    return ret;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

export class MoneyRewardModifier extends ConsumableModifier {
  private moneyMultiplier: number;

  constructor(type: ModifierType, moneyMultiplier: number) {
    super(type);

    this.moneyMultiplier = moneyMultiplier;
  }

  /**
   * Applies {@linkcode MoneyRewardModifier}
   * @returns always `true`
   */
  override apply(): boolean {
    const moneyAmount = new NumberHolder(globalScene.getWaveMoneyAmount(this.moneyMultiplier));

    globalScene.applyModifiers(MoneyMultiplierModifier, true, moneyAmount);

    globalScene.addMoney(moneyAmount.value);

    globalScene.getPlayerParty().map(p => {
      if (p.species?.speciesId === SpeciesId.GIMMIGHOUL || p.fusionSpecies?.speciesId === SpeciesId.GIMMIGHOUL) {
        const factor = Math.min(Math.floor(this.moneyMultiplier), 3);
        const modifier = getModifierType(modifierTypes.EVOLUTION_TRACKER_GIMMIGHOUL).newModifier(
          p,
          factor,
        ) as EvoTrackerModifier;
        globalScene.addModifier(modifier);
      }
    });

    return true;
  }
}

export class MoneyMultiplierModifier extends PersistentModifier {
  match(modifier: Modifier): boolean {
    return modifier instanceof MoneyMultiplierModifier;
  }

  clone(): MoneyMultiplierModifier {
    return new MoneyMultiplierModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode MoneyMultiplierModifier}
   * @param multiplier {@linkcode NumberHolder} holding the money multiplier value
   * @returns always `true`
   */
  override apply(multiplier: NumberHolder): boolean {
    multiplier.value += Math.floor(multiplier.value * 0.2 * this.getStackCount());

    return true;
  }

  getMaxStackCount(): number {
    return 5;
  }
}

export class DamageMoneyRewardModifier extends PokemonHeldItemModifier {
  matchType(modifier: Modifier): boolean {
    return modifier instanceof DamageMoneyRewardModifier;
  }

  clone(): DamageMoneyRewardModifier {
    return new DamageMoneyRewardModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Applies {@linkcode DamageMoneyRewardModifier}
   * @param pokemon The {@linkcode Pokemon} attacking
   * @param multiplier {@linkcode NumberHolder} holding the multiplier value
   * @returns always `true`
   */
  override apply(_pokemon: Pokemon, multiplier: NumberHolder): boolean {
    const moneyAmount = new NumberHolder(Math.floor(multiplier.value * (0.5 * this.getStackCount())));
    globalScene.applyModifiers(MoneyMultiplierModifier, true, moneyAmount);
    globalScene.addMoney(moneyAmount.value);

    return true;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 5;
  }
}

export class MoneyInterestModifier extends PersistentModifier {
  match(modifier: Modifier): boolean {
    return modifier instanceof MoneyInterestModifier;
  }

  /**
   * Applies {@linkcode MoneyInterestModifier}
   * @returns always `true`
   */
  override apply(): boolean {
    const interestAmount = Math.floor(globalScene.money * 0.1 * this.getStackCount());
    globalScene.addMoney(interestAmount);

    const userLocale = navigator.language || "en-US";
    const formattedMoneyAmount = interestAmount.toLocaleString(userLocale);
    const message = i18next.t("modifier:moneyInterestApply", {
      moneyAmount: formattedMoneyAmount,
      typeName: this.type.name,
    });
    globalScene.phaseManager.queueMessage(message, undefined, true);

    return true;
  }

  clone(): MoneyInterestModifier {
    return new MoneyInterestModifier(this.type, this.stackCount);
  }

  getMaxStackCount(): number {
    return 3;
  }
}

export class HiddenAbilityRateBoosterModifier extends PersistentModifier {
  match(modifier: Modifier): boolean {
    return modifier instanceof HiddenAbilityRateBoosterModifier;
  }

  clone(): HiddenAbilityRateBoosterModifier {
    return new HiddenAbilityRateBoosterModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode HiddenAbilityRateBoosterModifier}
   * @param boost {@linkcode NumberHolder} holding the boost value
   * @returns always `true`
   */
  override apply(boost: NumberHolder): boolean {
    boost.value *= Math.pow(2, -1 - this.getStackCount());

    return true;
  }

  getMaxStackCount(): number {
    return 4;
  }
}

export class ShinyRateBoosterModifier extends PersistentModifier {
  match(modifier: Modifier): boolean {
    return modifier instanceof ShinyRateBoosterModifier;
  }

  clone(): ShinyRateBoosterModifier {
    return new ShinyRateBoosterModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode ShinyRateBoosterModifier}
   * @param boost {@linkcode NumberHolder} holding the boost value
   * @returns always `true`
   */
  override apply(boost: NumberHolder): boolean {
    boost.value *= Math.pow(2, 1 + this.getStackCount());

    return true;
  }

  getMaxStackCount(): number {
    return 4;
  }
}

export class CriticalCatchChanceBoosterModifier extends PersistentModifier {
  match(modifier: Modifier): boolean {
    return modifier instanceof CriticalCatchChanceBoosterModifier;
  }

  clone(): CriticalCatchChanceBoosterModifier {
    return new CriticalCatchChanceBoosterModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode CriticalCatchChanceBoosterModifier}
   * @param boost {@linkcode NumberHolder} holding the boost value
   * @returns always `true`
   */
  override apply(boost: NumberHolder): boolean {
    // 1 stack: 2x
    // 2 stack: 2.5x
    // 3 stack: 3x
    boost.value *= 1.5 + this.getStackCount() / 2;

    return true;
  }

  getMaxStackCount(): number {
    return 3;
  }
}

export class LockModifierTiersModifier extends PersistentModifier {
  match(modifier: Modifier): boolean {
    return modifier instanceof LockModifierTiersModifier;
  }

  /**
   * Applies {@linkcode LockModifierTiersModifier}
   * @returns always `true`
   */
  override apply(): boolean {
    return true;
  }

  clone(): LockModifierTiersModifier {
    return new LockModifierTiersModifier(this.type, this.stackCount);
  }

  getMaxStackCount(): number {
    return 1;
  }
}

/**
 * Black Sludge item
 */
export class HealShopCostModifier extends PersistentModifier {
  public readonly shopMultiplier: number;

  constructor(type: ModifierType, shopMultiplier: number, stackCount?: number) {
    super(type, stackCount);

    this.shopMultiplier = shopMultiplier ?? 2.5;
  }

  match(modifier: Modifier): boolean {
    return modifier instanceof HealShopCostModifier;
  }

  clone(): HealShopCostModifier {
    return new HealShopCostModifier(this.type, this.shopMultiplier, this.stackCount);
  }

  /**
   * Applies {@linkcode HealShopCostModifier}
   * @param cost {@linkcode NumberHolder} holding the heal shop cost
   * @returns always `true`
   */
  apply(moneyCost: NumberHolder): boolean {
    moneyCost.value = Math.floor(moneyCost.value * this.shopMultiplier);

    return true;
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.shopMultiplier);
  }

  getMaxStackCount(): number {
    return 1;
  }
}

export class BoostBugSpawnModifier extends PersistentModifier {
  match(modifier: Modifier): boolean {
    return modifier instanceof BoostBugSpawnModifier;
  }

  clone(): BoostBugSpawnModifier {
    return new BoostBugSpawnModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode BoostBugSpawnModifier}
   * @returns always `true`
   */
  override apply(): boolean {
    return true;
  }

  getMaxStackCount(): number {
    return 1;
  }
}

export class SwitchEffectTransferModifier extends PokemonHeldItemModifier {
  matchType(modifier: Modifier): boolean {
    return modifier instanceof SwitchEffectTransferModifier;
  }

  clone(): SwitchEffectTransferModifier {
    return new SwitchEffectTransferModifier(this.type, this.pokemonId, this.stackCount);
  }

  /**
   * Applies {@linkcode SwitchEffectTransferModifier}
   * @returns always `true`
   */
  override apply(): boolean {
    return true;
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }
}

/**
 * Abstract class for held items that steal other Pokemon's items.
 * @see {@linkcode TurnHeldItemTransferModifier}
 * @see {@linkcode ContactHeldItemTransferChanceModifier}
 */
export abstract class HeldItemTransferModifier extends PokemonHeldItemModifier {
  /**
   * Determines the targets to transfer items from when this applies.
   * @param pokemon the {@linkcode Pokemon} holding this item
   * @param _args N/A
   * @returns the opponents of the source {@linkcode Pokemon}
   */
  getTargets(pokemon?: Pokemon, ..._args: unknown[]): Pokemon[] {
    return pokemon?.getOpponents?.() ?? [];
  }

  /**
   * Steals an item, chosen randomly, from a set of target Pokemon.
   * @param pokemon The {@linkcode Pokemon} holding this item
   * @param target The {@linkcode Pokemon} to steal from (optional)
   * @param _args N/A
   * @returns `true` if an item was stolen; false otherwise.
   */
  override apply(pokemon: Pokemon, target?: Pokemon, ..._args: unknown[]): boolean {
    const opponents = this.getTargets(pokemon, target);

    if (!opponents.length) {
      return false;
    }

    const targetPokemon = opponents[pokemon.randBattleSeedInt(opponents.length)];

    const transferredItemCount = this.getTransferredItemCount();
    if (!transferredItemCount) {
      return false;
    }

    const transferredModifierTypes: ModifierType[] = [];
    const itemModifiers = globalScene.findModifiers(
      m => m instanceof PokemonHeldItemModifier && m.pokemonId === targetPokemon.id && m.isTransferable,
      targetPokemon.isPlayer(),
    ) as PokemonHeldItemModifier[];

    for (let i = 0; i < transferredItemCount; i++) {
      if (!itemModifiers.length) {
        break;
      }
      const randItemIndex = pokemon.randBattleSeedInt(itemModifiers.length);
      const randItem = itemModifiers[randItemIndex];
      if (globalScene.tryTransferHeldItemModifier(randItem, pokemon, false)) {
        transferredModifierTypes.push(randItem.type);
        itemModifiers.splice(randItemIndex, 1);
      }
    }

    for (const mt of transferredModifierTypes) {
      globalScene.phaseManager.queueMessage(this.getTransferMessage(pokemon, targetPokemon, mt));
    }

    return !!transferredModifierTypes.length;
  }

  abstract getTransferredItemCount(): number;

  abstract getTransferMessage(pokemon: Pokemon, targetPokemon: Pokemon, item: ModifierType): string;
}

/**
 * Modifier for held items that steal items from the enemy at the end of
 * each turn.
 * @see {@linkcode modifierTypes[MINI_BLACK_HOLE]}
 */
export class TurnHeldItemTransferModifier extends HeldItemTransferModifier {
  isTransferable = true;

  matchType(modifier: Modifier): boolean {
    return modifier instanceof TurnHeldItemTransferModifier;
  }

  clone(): TurnHeldItemTransferModifier {
    return new TurnHeldItemTransferModifier(this.type, this.pokemonId, this.stackCount);
  }

  getTransferredItemCount(): number {
    return this.getStackCount();
  }

  getTransferMessage(pokemon: Pokemon, targetPokemon: Pokemon, item: ModifierType): string {
    return i18next.t("modifier:turnHeldItemTransferApply", {
      pokemonNameWithAffix: getPokemonNameWithAffix(targetPokemon),
      itemName: item.name,
      pokemonName: pokemon.getNameToRender(),
      typeName: this.type.name,
    });
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 1;
  }

  setTransferrableFalse(): void {
    this.isTransferable = false;
  }
}

/**
 * Modifier for held items that add a chance to steal items from the target of a
 * successful attack.
 * @see {@linkcode modifierTypes[GRIP_CLAW]}
 * @see {@linkcode HeldItemTransferModifier}
 */
export class ContactHeldItemTransferChanceModifier extends HeldItemTransferModifier {
  public readonly chance: number;

  constructor(type: ModifierType, pokemonId: number, chancePercent: number, stackCount?: number) {
    super(type, pokemonId, stackCount);

    this.chance = chancePercent / 100;
  }

  /**
   * Determines the target to steal items from when this applies.
   * @param _holderPokemon The {@linkcode Pokemon} holding this item
   * @param targetPokemon The {@linkcode Pokemon} the holder is targeting with an attack
   * @returns The target {@linkcode Pokemon} as array for further use in `apply` implementations
   */
  override getTargets(_holderPokemon: Pokemon, targetPokemon: Pokemon): Pokemon[] {
    return targetPokemon ? [targetPokemon] : [];
  }

  matchType(modifier: Modifier): boolean {
    return modifier instanceof ContactHeldItemTransferChanceModifier;
  }

  clone(): ContactHeldItemTransferChanceModifier {
    return new ContactHeldItemTransferChanceModifier(this.type, this.pokemonId, this.chance * 100, this.stackCount);
  }

  getArgs(): any[] {
    return super.getArgs().concat(this.chance * 100);
  }

  getTransferredItemCount(): number {
    return randSeedFloat() <= this.chance * this.getStackCount() ? 1 : 0;
  }

  getTransferMessage(pokemon: Pokemon, targetPokemon: Pokemon, item: ModifierType): string {
    return i18next.t("modifier:contactHeldItemTransferApply", {
      pokemonNameWithAffix: getPokemonNameWithAffix(targetPokemon),
      itemName: item.name,
      pokemonName: getPokemonNameWithAffix(pokemon),
      typeName: this.type.name,
    });
  }

  getMaxHeldItemCount(_pokemon: Pokemon): number {
    return 5;
  }
}

export class IvScannerModifier extends PersistentModifier {
  constructor(type: ModifierType, _stackCount?: number) {
    super(type);
  }

  match(modifier: Modifier): boolean {
    return modifier instanceof IvScannerModifier;
  }

  clone(): IvScannerModifier {
    return new IvScannerModifier(this.type);
  }

  /**
   * Applies {@linkcode IvScannerModifier}
   * @returns always `true`
   */
  override apply(): boolean {
    return true; //Dude are you kidding me
  }

  getMaxStackCount(): number {
    return 1;
  }
}

export class ExtraModifierModifier extends PersistentModifier {
  match(modifier: Modifier): boolean {
    return modifier instanceof ExtraModifierModifier;
  }

  clone(): ExtraModifierModifier {
    return new ExtraModifierModifier(this.type, this.stackCount);
  }

  /**
   * Applies {@linkcode ExtraModifierModifier}
   * @param count {NumberHolder} holding the count value
   * @returns always `true`
   */
  override apply(count: NumberHolder): boolean {
    count.value += this.getStackCount();

    return true;
  }

  getMaxStackCount(): number {
    return 3;
  }
}

/**
 * Modifier used for timed boosts to the player's shop item rewards.
 * @extends LapsingPersistentModifier
 * @see {@linkcode apply}
 */
export class TempExtraModifierModifier extends LapsingPersistentModifier {
  /**
   * Goes through existing modifiers for any that match Silver Pokeball,
   * which will then add the max count of the new item to the existing count of the current item.
   * If no existing Silver Pokeballs are found, will add a new one.
   * @param modifiers {@linkcode PersistentModifier} array of the player's modifiers
   * @param _virtual N/A
   * @returns true if the modifier was successfully added or applied, false otherwise
   */
  add(modifiers: PersistentModifier[], _virtual: boolean): boolean {
    for (const modifier of modifiers) {
      if (this.match(modifier)) {
        const modifierInstance = modifier as TempExtraModifierModifier;
        const newBattleCount = this.getMaxBattles() + modifierInstance.getBattleCount();

        modifierInstance.setNewBattleCount(newBattleCount);
        globalScene.playSound("se/restore");
        return true;
      }
    }

    modifiers.push(this);
    return true;
  }

  clone() {
    return new TempExtraModifierModifier(this.type, this.getMaxBattles(), this.getBattleCount(), this.stackCount);
  }

  match(modifier: Modifier): boolean {
    return modifier instanceof TempExtraModifierModifier;
  }

  /**
   * Increases the current rewards in the battle by the `stackCount`.
   * @returns `true` if the shop reward number modifier applies successfully
   * @param count {@linkcode NumberHolder} that holds the resulting shop item reward count
   */
  apply(count: NumberHolder): boolean {
    count.value += this.getStackCount();
    return true;
  }
}

export abstract class EnemyPersistentModifier extends PersistentModifier {
  getMaxStackCount(): number {
    return 5;
  }
}

abstract class EnemyDamageMultiplierModifier extends EnemyPersistentModifier {
  protected damageMultiplier: number;

  constructor(type: ModifierType, damageMultiplier: number, stackCount?: number) {
    super(type, stackCount);

    this.damageMultiplier = damageMultiplier;
  }

  /**
   * Applies {@linkcode EnemyDamageMultiplierModifier}
   * @param multiplier {NumberHolder} holding the multiplier value
   * @returns always `true`
   */
  override apply(multiplier: NumberHolder): boolean {
    multiplier.value = toDmgValue(multiplier.value * Math.pow(this.damageMultiplier, this.getStackCount()));

    return true;
  }

  getMaxStackCount(): number {
    return 99;
  }
}

export class EnemyDamageBoosterModifier extends EnemyDamageMultiplierModifier {
  constructor(type: ModifierType, _boostPercent: number, stackCount?: number) {
    //super(type, 1 + ((boostPercent || 10) * 0.01), stackCount);
    super(type, 1.05, stackCount); // Hardcode multiplier temporarily
  }

  match(modifier: Modifier): boolean {
    return modifier instanceof EnemyDamageBoosterModifier;
  }

  clone(): EnemyDamageBoosterModifier {
    return new EnemyDamageBoosterModifier(this.type, (this.damageMultiplier - 1) * 100, this.stackCount);
  }

  getArgs(): any[] {
    return [(this.damageMultiplier - 1) * 100];
  }

  getMaxStackCount(): number {
    return 20;
  }
}

export class EnemyDamageReducerModifier extends EnemyDamageMultiplierModifier {
  constructor(type: ModifierType, _reductionPercent: number, stackCount?: number) {
    //super(type, 1 - ((reductionPercent || 5) * 0.01), stackCount);
    super(type, 0.975, stackCount); // Hardcode multiplier temporarily
  }

  match(modifier: Modifier): boolean {
    return modifier instanceof EnemyDamageReducerModifier;
  }

  clone(): EnemyDamageReducerModifier {
    return new EnemyDamageReducerModifier(this.type, (1 - this.damageMultiplier) * 100, this.stackCount);
  }

  getArgs(): any[] {
    return [(1 - this.damageMultiplier) * 100];
  }

  getMaxStackCount(): number {
  return 40;
  }
}

export class EnemyTurnHealModifier extends EnemyPersistentModifier {
  public healPercent: number;

  constructor(type: ModifierType, _healPercent: number, stackCount?: number) {
    super(type, stackCount);

    // Hardcode temporarily
    this.healPercent = 2;
  }

  match(modifier: Modifier): boolean {
    return modifier instanceof EnemyTurnHealModifier;
  }

  clone(): EnemyTurnHealModifier {
    return new EnemyTurnHealModifier(this.type, this.healPercent, this.stackCount);
  }

  getArgs(): any[] {
    return [this.healPercent];
  }

  /**
   * Applies {@linkcode EnemyTurnHealModifier}
   * @param enemyPokemon The {@linkcode Pokemon} to heal
   * @returns `true` if the {@linkcode Pokemon} was healed
   */
  override apply(enemyPokemon: Pokemon): boolean {
    if (!enemyPokemon.isFullHp()) {
      globalScene.phaseManager.unshiftNew(
        "PokemonHealPhase",
        enemyPokemon.getBattlerIndex(),
        Math.max(Math.floor(enemyPokemon.getMaxHp() / (100 / this.healPercent)) * this.stackCount, 1),
        i18next.t("modifier:enemyTurnHealApply", {
          pokemonNameWithAffix: getPokemonNameWithAffix(enemyPokemon),
        }),
        true,
        false,
        false,
        false,
        true,
      );
      return true;
    }

    return false;
  }

  getMaxStackCount(): number {
    return 10;
  }
}

export class EnemyAttackStatusEffectChanceModifier extends EnemyPersistentModifier {
  public effect: StatusEffect;
  public chance: number;

  constructor(type: ModifierType, effect: StatusEffect, _chancePercent: number, stackCount?: number) {
    super(type, stackCount);

    this.effect = effect;
    // Hardcode temporarily
    this.chance = 0.025 * (this.effect === StatusEffect.BURN || this.effect === StatusEffect.POISON ? 2 : 1);
  }

  match(modifier: Modifier): boolean {
    return modifier instanceof EnemyAttackStatusEffectChanceModifier && modifier.effect === this.effect;
  }

  clone(): EnemyAttackStatusEffectChanceModifier {
    return new EnemyAttackStatusEffectChanceModifier(this.type, this.effect, this.chance * 100, this.stackCount);
  }

  getArgs(): any[] {
    return [this.effect, this.chance * 100];
  }

  /**
   * Applies {@linkcode EnemyAttackStatusEffectChanceModifier}
   * @param enemyPokemon {@linkcode Pokemon} to apply the status effect to
   * @returns `true` if the {@linkcode Pokemon} was affected
   */
  override apply(enemyPokemon: Pokemon): boolean {
    if (randSeedFloat() <= this.chance * this.getStackCount()) {
      return enemyPokemon.trySetStatus(this.effect);
    }

    return false;
  }

  getMaxStackCount(): number {
    return 10;
  }
}

export class EnemyStatusEffectHealChanceModifier extends EnemyPersistentModifier {
  public chance: number;

  constructor(type: ModifierType, _chancePercent: number, stackCount?: number) {
    super(type, stackCount);

    //Hardcode temporarily
    this.chance = 0.025;
  }

  match(modifier: Modifier): boolean {
    return modifier instanceof EnemyStatusEffectHealChanceModifier;
  }

  clone(): EnemyStatusEffectHealChanceModifier {
    return new EnemyStatusEffectHealChanceModifier(this.type, this.chance * 100, this.stackCount);
  }

  getArgs(): any[] {
    return [this.chance * 100];
  }

  /**
   * Applies {@linkcode EnemyStatusEffectHealChanceModifier} to randomly heal status.
   * @param enemyPokemon - The {@linkcode Pokemon} to heal
   * @returns `true` if the {@linkcode Pokemon} was healed
   */
  override apply(enemyPokemon: Pokemon): boolean {
    if (!enemyPokemon.status || randSeedFloat() > this.chance * this.getStackCount()) {
      return false;
    }

    globalScene.phaseManager.queueMessage(
      getStatusEffectHealText(enemyPokemon.status.effect, getPokemonNameWithAffix(enemyPokemon)),
    );
    enemyPokemon.resetStatus();
    enemyPokemon.updateInfo();
    return true;
  }

  getMaxStackCount(): number {
    return 10;
  }
}

export class EnemyEndureChanceModifier extends EnemyPersistentModifier {
  public chance: number;

  constructor(type: ModifierType, _chancePercent?: number, stackCount?: number) {
    super(type, stackCount || 10);

    //Hardcode temporarily
    this.chance = 0;
  }

  match(modifier: Modifier) {
    return modifier instanceof EnemyEndureChanceModifier;
  }

  clone() {
    return new EnemyEndureChanceModifier(this.type, this.chance, this.stackCount);
  }

  getArgs(): any[] {
    return [this.chance];
  }

  /**
   * Applies a chance of enduring a lethal hit of an attack
   * @param target the {@linkcode Pokemon} to apply the {@linkcode BattlerTagType.ENDURING} chance to
   * @returns `true` if {@linkcode Pokemon} endured
   */
  override apply(target: Pokemon): boolean {
    if (target.waveData.endured || target.randBattleSeedInt(100) >= this.chance * this.getStackCount()) {
      return false;
    }

    target.addTag(BattlerTagType.ENDURE_TOKEN, 1);

    target.waveData.endured = true;

    return true;
  }

  getMaxStackCount(): number {
    return 10;
  }
}

export class EnemyFusionChanceModifier extends EnemyPersistentModifier {
  private chance: number;

  constructor(type: ModifierType, chancePercent: number, stackCount?: number) {
    super(type, stackCount);

    this.chance = chancePercent / 100;
  }

  match(modifier: Modifier) {
    return modifier instanceof EnemyFusionChanceModifier && modifier.chance === this.chance;
  }

  clone() {
    return new EnemyFusionChanceModifier(this.type, this.chance * 100, this.stackCount);
  }

  getArgs(): any[] {
    return [this.chance * 100];
  }

  /**
   * Applies {@linkcode EnemyFusionChanceModifier}
   * @param isFusion {@linkcode BooleanHolder} that will be set to `true` if the {@linkcode EnemyPokemon} is a fusion
   * @returns `true` if the {@linkcode EnemyPokemon} is a fusion
   */
  override apply(isFusion: BooleanHolder): boolean {
    if (randSeedFloat() > this.chance * this.getStackCount()) {
      return false;
    }

    isFusion.value = true;

    return true;
  }

  getMaxStackCount(): number {
    return 10;
  }
}

/**
 * Uses either `MODIFIER_OVERRIDE` in overrides.ts to set {@linkcode PersistentModifier}s for either:
 *  - The player
 *  - The enemy
 * @param isPlayer {@linkcode boolean} for whether the player (`true`) or enemy (`false`) is being overridden
 */
export function overrideModifiers(isPlayer = true): void {
  const modifiersOverride: ModifierOverride[] = isPlayer
    ? Overrides.STARTING_MODIFIER_OVERRIDE
    : Overrides.ENEMY_MODIFIER_OVERRIDE;
  if (!modifiersOverride || modifiersOverride.length === 0 || !globalScene) {
    return;
  }

  // If it's the opponent, clear all of their current modifiers to avoid stacking
  if (!isPlayer) {
    globalScene.clearEnemyModifiers();
  }

  for (const item of modifiersOverride) {
    const modifierFunc = modifierTypes[item.name];
    let modifierType: ModifierType | null = modifierFunc();

    if (modifierType.is("ModifierTypeGenerator")) {
      const pregenArgs = "type" in item && item.type !== null ? [item.type] : undefined;
      modifierType = modifierType.generateType([], pregenArgs);
    }

    const modifier = modifierType && (modifierType.withIdFromFunc(modifierFunc).newModifier() as PersistentModifier);
    if (modifier) {
      modifier.stackCount = item.count || 1;

      if (isPlayer) {
        globalScene.addModifier(modifier, true, false, false, true);
      } else {
        globalScene.addEnemyModifier(modifier, true, true);
      }
    }
  }
}

/**
 * Uses either `HELD_ITEMS_OVERRIDE` in overrides.ts to set {@linkcode PokemonHeldItemModifier}s for either:
 *  - The first member of the player's team when starting a new game
 *  - An enemy {@linkcode Pokemon} being spawned in
 * @param pokemon {@linkcode Pokemon} whose held items are being overridden
 * @param isPlayer {@linkcode boolean} for whether the {@linkcode pokemon} is the player's (`true`) or an enemy (`false`)
 */
export function overrideHeldItems(pokemon: Pokemon, isPlayer = true): void {
  const heldItemsOverride: ModifierOverride[] = isPlayer
    ? Overrides.STARTING_HELD_ITEMS_OVERRIDE
    : Overrides.ENEMY_HELD_ITEMS_OVERRIDE;
  if (!heldItemsOverride || heldItemsOverride.length === 0 || !globalScene) {
    return;
  }

  if (!isPlayer) {
    globalScene.clearEnemyHeldItemModifiers(pokemon);
  }

  for (const item of heldItemsOverride) {
    const modifierFunc = modifierTypes[item.name];
    let modifierType: ModifierType | null = modifierFunc();
    const qty = item.count || 1;

    if (modifierType.is("ModifierTypeGenerator")) {
      const pregenArgs = "type" in item && item.type !== null ? [item.type] : undefined;
      modifierType = modifierType.generateType([], pregenArgs);
    }

    const heldItemModifier =
      modifierType && (modifierType.withIdFromFunc(modifierFunc).newModifier(pokemon) as PokemonHeldItemModifier);
    if (heldItemModifier) {
      heldItemModifier.pokemonId = pokemon.id;
      heldItemModifier.stackCount = qty;
      if (isPlayer) {
        globalScene.addModifier(heldItemModifier, true, false, false, true);
      } else {
        globalScene.addEnemyModifier(heldItemModifier, true, true);
      }
    }
  }
}

/**
 * Private map from modifier strings to their constructors.
 *
 * @remarks
 * Used for {@linkcode Modifier.is} to check if a modifier is of a certain type without
 * requiring modifier types to be imported in every file.
 */
const ModifierClassMap = Object.freeze({
  PersistentModifier,
  ConsumableModifier,
  AddPokeballModifier,
  AddVoucherModifier,
  LapsingPersistentModifier,
  DoubleBattleChanceBoosterModifier,
  TempStatStageBoosterModifier,
  TempCritBoosterModifier,
  MapModifier,
  MegaEvolutionAccessModifier,
  GigantamaxAccessModifier,
  TerastallizeAccessModifier,
  PokemonHeldItemModifier,
  LapsingPokemonHeldItemModifier,
  BaseStatModifier,
  EvoTrackerModifier,
  PokemonBaseStatTotalModifier,
  PokemonBaseStatFlatModifier,
  PokemonIncrementingStatModifier,
  StatBoosterModifier,
  SpeciesStatBoosterModifier,
  CritBoosterModifier,
  SpeciesCritBoosterModifier,
  AttackTypeBoosterModifier,
  SurviveDamageModifier,
  BypassSpeedChanceModifier,
  FlinchChanceModifier,
  TurnHealModifier,
  TurnStatusEffectModifier,
  HitHealModifier,
  LevelIncrementBoosterModifier,
  BerryModifier,
  PreserveBerryModifier,
  PokemonInstantReviveModifier,
  ResetNegativeStatStageModifier,
  FieldEffectModifier,
  ConsumablePokemonModifier,
  TerastallizeModifier,
  PokemonHpRestoreModifier,
  PokemonStatusHealModifier,
  ConsumablePokemonMoveModifier,
  PokemonPpRestoreModifier,
  PokemonAllMovePpRestoreModifier,
  PokemonPpUpModifier,
  PokemonNatureChangeModifier,
  PokemonLevelIncrementModifier,
  TmModifier,
  RememberMoveModifier,
  EvolutionItemModifier,
  FusePokemonModifier,
  EggHatchSpeedUpModifier,
  HealingBoosterModifier,
  ExpBoosterModifier,
  PokemonExpBoosterModifier,
  ExpShareModifier,
  ExpBalanceModifier,
  PokemonFriendshipBoosterModifier,
  PokemonNatureWeightModifier,
  PokemonMoveAccuracyBoosterModifier,
  PokemonMultiHitModifier,
  PokemonFormChangeItemModifier,
  MoneyRewardModifier,
  DamageMoneyRewardModifier,
  MoneyInterestModifier,
  HiddenAbilityRateBoosterModifier,
  ShinyRateBoosterModifier,
  CriticalCatchChanceBoosterModifier,
  LockModifierTiersModifier,
  HealShopCostModifier,
  BoostBugSpawnModifier,
  SwitchEffectTransferModifier,
  HeldItemTransferModifier,
  TurnHeldItemTransferModifier,
  ContactHeldItemTransferChanceModifier,
  IvScannerModifier,
  ExtraModifierModifier,
  TempExtraModifierModifier,
  EnemyPersistentModifier,
  EnemyDamageMultiplierModifier,
  EnemyDamageBoosterModifier,
  EnemyDamageReducerModifier,
  EnemyTurnHealModifier,
  EnemyAttackStatusEffectChanceModifier,
  EnemyStatusEffectHealChanceModifier,
  EnemyEndureChanceModifier,
  EnemyFusionChanceModifier,
  MoneyMultiplierModifier,
  StatBoostModifier,
  StackingRiskyPowerBoosterModifier,
  StackingPowerBoosterModifier,
  RunSuccessModifier,
  SuperEffectiveBoosterModifier,
  EvasiveItemModifier,
  IgnoreContactItemModifier,
  GuaranteedSurviveDamageModifier,
  ContactDamageModifier,
  WeaknessTypeModifier,
  PokemonDefensiveStatModifier,
  SpeedStatModifier,
  SpAtkStatModifier,
  AtkStatModifier,
  ProtectStatModifier,
  OvercoatModifier,
  PunchingGloveModifier,
  IgnoreMoveEffectsItemModifier,
  MaxMultiHitModifier,
  TypeSpecificMoveBoosterModifier,
  SoundBasedMoveSpecialAttackBoostModifier,
  AlwaysMoveLastModifier,
  IgnoreWeatherEffectsItemModifier,
  WeakenMoveScreenModifier,
  BoostEnergyModifier,
  PreserveItemModifier,
  StatStageChangeCopyModifier,
  PostBattleLootItemModifier,
  MentalHerbModifier,
  TypeImmunityModifier,
  InstantChargeItemModifier,
  CritDamageBoostModifier,
  NotEffectiveBoostModifier,
  MovePowerBoostItemModifier,
  RecoilBoosterModifier,
  MoveAbilityBypassModifier,
  VictoryStatBoostModifier,
  UnawareItemModifier,
  StatStageChangeBoostModifier,
  PreventBerryUseItemModifier,
  PreventExplosionItemModifier,
  PreventPriorityMoveItemModifier,
  SereneGraceItemModifier,
  IgnoreTypeImmunityModifier,
  SheerForceItemModifier,
  GoldenBodyItemModifier,
  AromaIncenseItemModifier,
  AdaptabilityItemModifier,
  TelepathyItemModifier,
  StatStageChangeReverseModifier,
  EvolutionIncenseModifier,
  SturdystoneItemModifier,
  MoodyItemModifier,
  RoomServiceModifier,
  AbilityGuardItemModifier,
  MissEffectModifier,
  MaxIvModifier,
  ChangeAbilityModifier,
  MaxAllIvModifier,
  RegisterAbilityModifier,
  GenericZMoveAccessModifier,
  ExclusiveZMoveAccessModifier,
  ZCrystalMoveModifier,
  PokemonZMovePpRestoreModifier,
  WishingStarModifier,
  MaxMoveAccessModifier,
  TrModifier,
  PokemonMaxMovePpRestoreModifier,
  DynamaxMovePpUpModifier,
  SlicingMoveModifier,
  BitingMoveModifier,
  HeadMoveModifier,
  HornMoveModifier,
  KickMoveModifier,
  SpearMoveModifier,
  WingMoveModifier,
  HammerMoveModifier,
  ClawMoveModifier,
  PinchMoveModifier,
  BeakMoveModifier,
  DashMoveModifier,
  SpinMoveModifier,
  DrillMoveModifier,
  WhipMoveModifier,
  WheelMoveModifier,
  TailMoveModifier,
  ArrowMoveModifier,
  BallBombMoveModifier,
  ThrowMoveModifier,
  PulseMoveModifier,
  BeamMoveModifier,
  LightMoveModifier,
  SoundMoveModifier,
  WindMoveModifier,
  DanceMoveModifier,
  DrainMoveModifier,
  WeatherRockTrainerModifier,
  TerrainSeedTrainerModifier,
  BlockCritItemModifier,
  StatusBoostItemModifier,
  DualStatMultiplierModifier
});

export type ModifierConstructorMap = typeof ModifierClassMap;
