import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import {
  CommanderAbAttr,
  PostSummonAbAttr,
  PostTerrainChangeAddBattlerTagAttr,
  PostWeatherChangeAddBattlerTagAttr,
  BoostEnergyTagAttr,
} from "#app/data/abilities/ability";
import { globalScene } from "#app/global-scene";
import { EntryHazardTag } from "#data/arena-tag";
import { MysteryEncounterPostSummonTag, HighestStatBoostTag, WeatherHighestStatBoostTag, TerrainHighestStatBoostTag } from "#data/battler-tags";
import { BattlerTagType } from "#enums/battler-tag-type";
import { StatusEffect } from "#enums/status-effect";
import { PokemonPhase } from "#phases/pokemon-phase";
import { DynamaxPhase } from "#app/phases/dynamax-phase";
import { BoostEnergyModifier, WishingStarModifier, WeatherRockTrainerModifier, TerrainSeedTrainerModifier, BerryModifier } from "#app/modifier/modifier";
import { SpeciesId } from "#enums/species-id";
import { BATTLE_STATS, EFFECTIVE_STATS, getStatKey, Stat } from "#enums/stat";
import { WeatherType } from "#app/enums/weather-type";
import { TerrainType } from "#data/terrain";
import { BerryType } from "#enums/berry-type";

export class PostSummonPhase extends PokemonPhase {
  public readonly phaseName = "PostSummonPhase";

  start() {
    super.start();

    const pokemon = this.getPokemon();
    console.debug(`[PostSummonPhase] Start for ${pokemon.name}`);

    // 맹독 카운트 초기화
    if (pokemon.status?.effect === StatusEffect.TOXIC) {
      pokemon.status.toxicTurnCount = 0;
    }

    // ✅ 엔트리 해저드 처리 후 바로 추가
globalScene.arena.applyTags(EntryHazardTag, false, pokemon);

// --- [A] 출전 즉시 발동형 능력치 상승 베리 감지 + 즉시 BerryPhase 삽입 ---
const IMMEDIATE_STAT_BERRIES = new Set<BerryType>([
  BerryType.POMEG,
  BerryType.KELPSY,
  BerryType.QUALOT,
  BerryType.HONDEW,
  BerryType.GREPA,
  BerryType.TAMATO,
]);

let heldBerryMod = globalScene
  .getModifiers(BerryModifier, pokemon.isPlayer())
  ?.find((m): m is BerryModifier => m instanceof BerryModifier && m.pokemonId === pokemon.id);

let heldBerryType: BerryType | undefined;
try {
  heldBerryType = pokemon.getHeldBerryType?.();
} catch {
  heldBerryType = undefined;
}

let immediateBerryType: BerryType | undefined = undefined;

// 🧩 HeldModifier가 존재할 때
if (heldBerryMod && IMMEDIATE_STAT_BERRIES.has(heldBerryMod.berryType)) {
  immediateBerryType = heldBerryMod.berryType;
}
// 🧩 HeldItem만 있을 때
else if (heldBerryType && IMMEDIATE_STAT_BERRIES.has(heldBerryType)) {
  immediateBerryType = heldBerryType;
}

if (immediateBerryType !== undefined) {
  const alreadyQueued =
    globalScene.phaseManager.phaseQueuePrepend?.some(p => p.phaseName === "BerryPhase") ||
    globalScene.phaseManager.phaseQueue?.some(p => p.phaseName === "BerryPhase");

  if (!heldBerryMod) {
    const berryModType = ModifierType.BERRY();
    heldBerryMod = new BerryModifier(berryModType, pokemon.id, immediateBerryType);
    globalScene.addModifier(heldBerryMod, pokemon.isPlayer());
    globalScene.updateModifiers(pokemon.isPlayer());
    console.debug(`[PostSummonPhase] ${pokemon.name}에게 BerryModifier(${BerryType[immediateBerryType]}) 생성`);
  }

  if (!alreadyQueued) {
    console.debug(`[PostSummonPhase] ${pokemon.name}: ${BerryType[immediateBerryType]} 감지 → BerryPhase 큐에 추가`);
    globalScene.phaseManager.unshiftNew("BerryPhase");
  }

  // 태그는 BerryPhase 내에서 달리는 것이 가장 안전합니다.
}


// Mystery Encounter Post Summon 처리
if (
  globalScene.currentBattle.isBattleMysteryEncounter() &&
  pokemon.findTags(t => t instanceof MysteryEncounterPostSummonTag).length > 0
) {
  pokemon.lapseTag(BattlerTagType.MYSTERY_ENCOUNTER_POST_SUMMON);
}

    // ✅ Boost Energy 발동 로직
    this.applyBoostEnergyTag(pokemon);

    // ✅ BoostEnergyTagAttr 강제 실행
    console.debug(`[PostSummonPhase] BoostEnergyTagAttr 실행 시도`);
    applyAbAttrs("BoostEnergyTagAttr", pokemon);

    // Commander Abilities
    const field = pokemon.isPlayer() ? globalScene.getPlayerField() : globalScene.getEnemyField();
    for (const p of field) {
      applyAbAttrs("CommanderAbAttr", { pokemon: p });
    }

    // ✅ Wishing Star Dynamax 처리
    const modifiers = globalScene.getModifiers(WishingStarModifier);
    const forbiddenSpecies = new Set([SpeciesId.ZACIAN, SpeciesId.ZAMAZENTA]);
    for (const mod of modifiers) {
      const modPokemon = mod.getPokemon?.();
      if (!modPokemon) continue;
      if (forbiddenSpecies.has(modPokemon.speciesId)) continue;
      if (!modPokemon.isOnField?.()) continue;
      if (!modPokemon.isDynamaxed && !modPokemon.isMax?.()) {
        globalScene.phaseManager.unshiftPhase(new DynamaxPhase(modPokemon, globalScene));
      }
    }

   // ✅ 트레이너 날씨 락 적용 (이 위치가 가장 적절)
const trainerWeatherMods = globalScene
  .getModifiers(WeatherRockTrainerModifier, true)
  .filter(m => m instanceof WeatherRockTrainerModifier) as WeatherRockTrainerModifier[];

if (trainerWeatherMods.length > 0 && globalScene.arena) {
  for (const mod of trainerWeatherMods) {
    const weatherType = mod["weatherType"];
    const currentWeather = globalScene.arena.weather?.weatherType ?? WeatherType.NONE;
    const turnsLeft = globalScene.arena.weather?.turnsLeft ?? 0;
    const savedTurns = mod.getRemainingTurns();

    // ✅ 이미 같은 날씨가 유지 중이라면 재적용하지 않음
    if (currentWeather === weatherType && turnsLeft > 0) {
      console.log(`[PostSummonPhase] ${WeatherType[weatherType]} 이미 유지 중 (남은 턴 ${turnsLeft}) → 스킵`);
      continue;
    }

    console.log(`[PostSummonPhase] WeatherRockTrainerModifier 감지됨 → ${WeatherType[weatherType]} 새로 적용 시도`);
    const success = globalScene.arena.trySetWeather(weatherType);

    if (success && globalScene.arena.weather) {
      if (savedTurns > 0 && savedTurns < mod.getMaxBattles()) {
        globalScene.arena.weather.turnsLeft = savedTurns;
        console.log(`[PostSummonPhase] ${WeatherType[weatherType]} 재적용 (남은 턴 ${savedTurns})`);
      } else {
        globalScene.arena.weather.turnsLeft = mod.getMaxBattles();
        mod.setRemainingTurns(globalScene.arena.weather.turnsLeft);
        console.log(`[PostSummonPhase] ${WeatherType[weatherType]} 새로 설정됨 (턴 ${mod.getMaxBattles()})`);
      }
    }
  }
} else {
  console.log("[PostSummonPhase] WeatherRockTrainerModifier 없음 → 날씨 변경 생략");
}

// ✅ 트레이너 필드 락 (TerrainSeedTrainerModifier) 적용
const trainerTerrainMods = globalScene
  .getModifiers(TerrainSeedTrainerModifier, true)
  .filter(m => m instanceof TerrainSeedTrainerModifier) as TerrainSeedTrainerModifier[];

if (trainerTerrainMods.length > 0 && globalScene.arena) {
  for (const mod of trainerTerrainMods) {
    const terrainType = mod["terrainType"];
    const currentTerrain = globalScene.arena.terrain?.terrainType ?? TerrainType.NONE;
    const turnsLeft = globalScene.arena.terrain?.turnsLeft ?? 0;
    const savedTurns = mod.getRemainingTurns();

    // ✅ 이미 같은 필드가 유지 중이라면 재적용하지 않음
    if (currentTerrain === terrainType && turnsLeft > 0) {
      console.log(`[PostSummonPhase] ${TerrainType[terrainType]} 이미 유지 중 (남은 턴 ${turnsLeft}) → 스킵`);
      continue;
    }

    console.log(`[PostSummonPhase] TerrainSeedTrainerModifier 감지됨 → ${TerrainType[terrainType]} 새로 적용 시도`);
    const success = globalScene.arena.trySetTerrain(terrainType);

    if (success && globalScene.arena.terrain) {
      if (savedTurns > 0 && savedTurns < mod.getMaxBattles()) {
        globalScene.arena.terrain.turnsLeft = savedTurns;
        console.log(`[PostSummonPhase] ${TerrainType[terrainType]} 재적용 (남은 턴 ${savedTurns})`);
      } else {
        globalScene.arena.terrain.turnsLeft = mod.getMaxBattles();
        mod.setRemainingTurns(globalScene.arena.terrain.turnsLeft);
        console.log(`[PostSummonPhase] ${TerrainType[terrainType]} 새로 설정됨 (턴 ${mod.getMaxBattles()})`);
      }
    }
  }
} else {
  console.log("[PostSummonPhase] TerrainSeedTrainerModifier 없음 → 필드 변경 생략");
}

const berryMod = globalScene.findModifier(
  m => m instanceof BerryModifier && m.pokemonId === pokemon.id,
  pokemon.isPlayer()
);
if (berryMod) {
  globalScene.removeModifier(berryMod, pokemon.isPlayer());
  console.debug(`[PostSummonPhase] ${pokemon.name} → BerryModifier 제거 완료`);
}

this.end();
}

  private applyBoostEnergyTag(pokemon: Pokemon) {
  const boostEnergyItem = globalScene
    .getModifiers(BoostEnergyModifier)
    .find(mod => mod.pokemonId === pokemon.id) as BoostEnergyModifier | null;

  if (!boostEnergyItem) return;

  let highestStat: EffectiveStat | null = null;
  let highestValue = Number.NEGATIVE_INFINITY;

  for (const stat of EFFECTIVE_STATS) {
    const value = pokemon.getEffectiveStat(
      stat,
      undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      true
    );
    if (value > highestValue) {
      highestValue = value;
      highestStat = stat;
    }
  }

  if (!highestStat) {
    console.log("[PostSummonPhase] Could not determine highest stat for", pokemon.name);
    return;
  }

  const boostMultiplier = 1.3;
  boostEnergyItem.apply(pokemon, [highestStat], boostMultiplier);
  globalScene.updateModifiers(pokemon.isPlayer());

  // ✅ 아이템 소모 처리
  const heldItem = pokemon.getHeldItems().find(item => item instanceof BoostEnergyModifier);
  if (heldItem) {
    pokemon.loseHeldItem(heldItem);
    globalScene.updateModifiers(pokemon.isPlayer());
    console.log(`[PostSummonPhase] ${pokemon.name} Boost Energy 소모 완료`);
  }

  // 태그 부여
  this.activateProtosynthesis(pokemon);
  this.activateQuarkDrive(pokemon);
}

  private activateProtosynthesis(pokemon: Pokemon) {
  if (!pokemon.summonData?.tags) {
    console.warn(`[PostSummonPhase] ${pokemon.name} tag container not ready, skipping Protosynthesis`);
    return;
  }

  const added = pokemon.addTag(BattlerTagType.PROTOSYNTHESIS, 0);
  if (added) {
    console.log("[PostSummonPhase] Protosynthesis activated (Boost Energy or Sun)");
  } else {
    console.warn("[PostSummonPhase] Failed to add Protosynthesis tag");
  }
}

  private activateQuarkDrive(pokemon: Pokemon) {
  if (!pokemon.summonData?.tags) {
    console.warn(`[PostSummonPhase] ${pokemon.name} tag container not ready, skipping Quark Drive`);
    return;
  }

  const added = pokemon.addTag(BattlerTagType.QUARK_DRIVE, 0); // ✅ QUARK_CHARGE → QUARK_DRIVE
  if (added) {
    console.log("[PostSummonPhase] Quark Drive activated (Boost Energy or Electric Terrain)");
  } else {
    console.warn("[PostSummonPhase] Failed to add Quark Drive tag");
  }
}

  public getPriority() {
    return 0;
  }
}
