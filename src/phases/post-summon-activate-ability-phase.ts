import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BattlerIndex } from "#enums/battler-index";
import { PostSummonPhase } from "#phases/post-summon-phase";
import { BerryType } from "#enums/berry-type";
import { BerryModifier } from "#app/modifier/modifier";
import { BattlerTagType } from "#enums/battler-tag-type";

/**
 * Helper to {@linkcode PostSummonPhase} which applies abilities
 */
export class PostSummonActivateAbilityPhase extends PostSummonPhase {
  private priority: number;
  private passive: boolean;

  constructor(battlerIndex: BattlerIndex, priority: number, passive: boolean) {
    super(battlerIndex);
    this.priority = priority;
    this.passive = passive;
  }

  start() {
  const pokemon = this.getPokemon?.();
  if (!pokemon) {
    this.end();
    return;
  }

  // ✅ 기존 능력 발동 유지
  applyAbAttrs("PostSummonAbAttr", { pokemon, passive: this.passive });

  // ✅ 즉시 발동형 능력치상승 열매 6종
  const IMMEDIATE_STAT_BERRIES = new Set<BerryType>([
    BerryType.POMEG, BerryType.KELPSY, BerryType.QUALOT,
    BerryType.HONDEW, BerryType.GREPA, BerryType.TAMATO,
  ]);

  // --- [1] 디버그용 로그 + getHeldBerryType 검사 ---
  const heldFromGetter = pokemon.getHeldBerryType?.();
  console.log(`[PSAAP] getHeldBerryType = ${heldFromGetter !== undefined ? BerryType[heldFromGetter] : "none"}`);

  // --- [2] BerryModifier 탐색 ---
  const berryMods = globalScene
    .getModifiers(BerryModifier, pokemon.isPlayer())
    .filter((m: any) => m instanceof BerryModifier && m.pokemonId === pokemon.id) as BerryModifier[];
  console.log(`[PSAAP] BerryModifier(s) = [${berryMods.map(b => BerryType[b.berryType]).join(", ")}]`);

  // --- [3] 모디파이어가 없고, HeldItem이 즉시형 베리라면 주입 ---
  if (IMMEDIATE_STAT_BERRIES.has(heldFromGetter!) && berryMods.length === 0) {
    const berryModType = ModifierType.BERRY();
    const injected = new BerryModifier(berryModType, pokemon.id, heldFromGetter!);
    globalScene.addModifier(injected, pokemon.isPlayer());
    globalScene.updateModifiers(pokemon.isPlayer());
    console.log(`[PSAAP] 모디파이어가 없어 getHeldBerryType 기반으로 ${BerryType[heldFromGetter!]} 주입`);
    berryMods.push(injected);
  }

  // --- [4] 실제 즉시형 베리 발동 처리 ---
  const activeImmediate = berryMods.find(m => IMMEDIATE_STAT_BERRIES.has(m.berryType));

  if (activeImmediate) {
    const berryType = activeImmediate.berryType;

    const alreadyQueued =
      globalScene.phaseManager.phaseQueuePrepend?.some(p => p.phaseName === "BerryPhase") ||
      globalScene.phaseManager.phaseQueue?.some(p => p.phaseName === "BerryPhase");

    if (!alreadyQueued) {
      console.log(`[PostSummonActivateAbilityPhase] ${pokemon.name}의 ${BerryType[berryType]} → 즉시형 열매 감지`);
      globalScene.phaseManager.unshiftNew("BerryPhase");
    }

    // ✅ 중복 방지용 플래그 기록
    pokemon.turnData.hasUsedBerry = true;
    console.log(`[PostSummonActivateAbilityPhase] ${pokemon.name} → BerryPhase 등록 및 hasUsedBerry 플래그 부여`);
  } 
  else if (berryMods.length > 0) {
    console.log(`[PostSummonActivateAbilityPhase] ${pokemon.name}의 열매(${BerryType[berryMods[0].berryType]})은 즉시형 아님`);
  } 
  else {
    console.log(`[PostSummonActivateAbilityPhase] ${pokemon.name} → BerryModifier 없음`);
  }

  this.end();
}

public override getPriority() {
  return this.priority;
  }
}
