import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { TurnCommand } from "#app/battle";
import { globalScene } from "#app/global-scene";
import { TrickRoomTag } from "#data/arena-tag";
import { allMoves } from "#data/data-lists";
import { BattlerIndex } from "#enums/battler-index";
import { Command } from "#enums/command";
import { Stat } from "#enums/stat";
import { SwitchType } from "#enums/switch-type";
import type { Pokemon } from "#field/pokemon";
import { BypassSpeedChanceModifier, AlwaysMoveLastModifier, BerryModifier } from "#modifiers/modifier";
import { PokemonMove } from "#moves/pokemon-move";
import { FieldPhase } from "#phases/field-phase";
import { BooleanHolder, randSeedShuffle } from "#utils/common";
import { BerryType } from "#enums/berry-type";
import i18next from "i18next";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonType } from "#enums/pokemon-type";
import { getBerryEffectFunc, berryResistTypeMap, TYPE_PRIORITY_BERRIES, TYPE_PRIORITY_TYPE_MAP } from "#data/berry";

export class TurnStartPhase extends FieldPhase {
  public readonly phaseName = "TurnStartPhase";

  /**
   * Helper method to retrieve the current speed order of the combattants.
   * It also checks for Trick Room and reverses the array if it is present.
   * @returns The {@linkcode BattlerIndex}es of all on-field Pokemon, sorted in speed order.
   * @todo Make this private
   */
  getSpeedOrder(): BattlerIndex[] {
    const playerField = globalScene.getPlayerField().filter(p => p.isActive());
    const enemyField = globalScene.getEnemyField().filter(p => p.isActive());

    // Shuffle the list before sorting so speed ties produce random results
    // This is seeded with the current turn to prevent turn order varying
    // based on how long since you last reloaded.
    let orderedTargets = (playerField as Pokemon[]).concat(enemyField);
    globalScene.executeWithSeedOffset(
      () => {
        orderedTargets = randSeedShuffle(orderedTargets);
      },
      globalScene.currentBattle.turn,
      globalScene.waveSeed,
    );

    // Check for Trick Room and reverse sort order if active.
    // Notably, Pokerogue does NOT have the "outspeed trick room" glitch at >1809 spd.
    const speedReversed = new BooleanHolder(false);
    globalScene.arena.applyTags(TrickRoomTag, false, speedReversed);

    orderedTargets.sort((a: Pokemon, b: Pokemon) => {
      const aSpeed = a.getEffectiveStat(Stat.SPD);
      const bSpeed = b.getEffectiveStat(Stat.SPD);

      return speedReversed.value ? aSpeed - bSpeed : bSpeed - aSpeed;
    });

    return orderedTargets.map(t => t.getFieldIndex() + (t.isEnemy() ? BattlerIndex.ENEMY : BattlerIndex.PLAYER));
  }

  /**
   * This takes the result of {@linkcode getSpeedOrder} and applies priority / bypass speed attributes to it.
   * This also considers the priority levels of various commands and changes the result of `getSpeedOrder` based on such.
   * @returns The `BattlerIndex`es of all on-field Pokemon sorted in action order.
   */
  getCommandOrder(): BattlerIndex[] {
  let moveOrder = this.getSpeedOrder();
  
  // ✅ 타입 선공 열매 매핑
  const typeMap: Record<BerryType, PokemonType> = {
    [BerryType.CHERI]: PokemonType.ELECTRIC,
    [BerryType.CHESTO]: PokemonType.FLYING,
    [BerryType.PECHA]: PokemonType.POISON,
    [BerryType.RAWST]: PokemonType.WATER,
    [BerryType.ASPEAR]: PokemonType.ICE,
    [BerryType.ORAN]: PokemonType.NORMAL,
    [BerryType.PERSIM]: PokemonType.PSYCHIC,
    [BerryType.WEPEAR]: PokemonType.GRASS,
    [BerryType.BELUE]: PokemonType.FAIRY,
    [BerryType.CORNN]: PokemonType.BUG,
    [BerryType.MAGOST]: PokemonType.GHOST,
    [BerryType.RABUTA]: PokemonType.DRAGON,
    [BerryType.NOMEL]: PokemonType.GROUND,
    [BerryType.SPELON]: PokemonType.FIRE,
    [BerryType.PAMTRE]: PokemonType.DARK,
    [BerryType.WATMEL]: PokemonType.FIGHTING,
    [BerryType.DURIN]: PokemonType.STEEL,
    [BerryType.PINAP]: PokemonType.ROCK,
  };

  // ✅ 전역에서 참조할 두 개의 맵
  const battlerBypassSpeed: Record<number, BooleanHolder> = {};
  const battlerAlwaysLast: Record<number, BooleanHolder> = {};
  
  // 모든 필드 포켓몬에 대해 bypassSpeed / alwaysLast 플래그 세팅
  globalScene.getField(true).forEach(p => {
    const bypassSpeed = new BooleanHolder(false);
    const alwaysLast = new BooleanHolder(false);
    const canCheckHeldItems = new BooleanHolder(true);

    // 빠른 행동 특성/아이템 적용
    applyAbAttrs("BypassSpeedChanceAbAttr", { pokemon: p, bypass: bypassSpeed });
    applyAbAttrs("PreventBypassSpeedChanceAbAttr", {
      pokemon: p,
      bypass: bypassSpeed,
      canCheckHeldItems: canCheckHeldItems,
    });

    if (canCheckHeldItems.value) {
  globalScene.applyModifiers(BypassSpeedChanceModifier, p.isPlayer(), p, bypassSpeed);
}

// ✅ 타입 선공 열매 처리 (BerryEffectFunc 대신 이 위치로 이동)
let berryType = p.getHeldBerryType?.();

// 🔹 heldBerryType이 undefined면 BerryModifier에서 찾아줌
if (berryType === undefined) {
  const berryMods = globalScene
    .getModifiers(BerryModifier, p.isPlayer())
    .filter((m: any) => m instanceof BerryModifier && m.pokemonId === p.id);
  if (berryMods.length > 0) {
    berryType = berryMods[0].berryType;
  }
}

if (berryType && TYPE_PRIORITY_BERRIES.has(berryType)) {
  const cmd = globalScene.currentBattle.turnCommands[p.getBattlerIndex()];
  const moveId = cmd?.move?.move;
  const moveData = moveId ? allMoves[moveId] : undefined;

  const typeHolder = new NumberHolder(moveData?.type ?? PokemonType.NONE);
  applyAbAttrs("MoveTypeChangeAbAttr", { pokemon: p, simulated: false, move: moveData, moveType: typeHolder });
  const moveType = typeHolder.value;
  const mappedType = TYPE_PRIORITY_TYPE_MAP[berryType];

  console.debug(`[TypePriorityBerry] ${p.name} → move=${moveData?.name}, moveType=${PokemonType[moveType]}, berry=${BerryType[berryType]}, mapped=${PokemonType[mappedType]}`);

  if (moveType === mappedType) {
    bypassSpeed.value = true;
    p.tryUseBerry(berryType);

    globalScene.phaseManager.queueMessage(
      i18next.t("battle:berryActivatedPriorityType", {
        pokemonName: getPokemonNameWithAffix(p),
        typeName: i18next.t(`pokemonInfo:type.${PokemonType[moveType].toLowerCase()}`),
      }),
    );
  }
}

    // 항상 후공 모디파이어 적용
    globalScene.applyModifiers(AlwaysMoveLastModifier, p.isPlayer(), p, alwaysLast);

    battlerBypassSpeed[p.getBattlerIndex()] = bypassSpeed;
    battlerAlwaysLast[p.getBattlerIndex()] = alwaysLast;
  });

  // 정렬
  moveOrder = moveOrder.slice(0);
  moveOrder.sort((a, b) => {
    const aCommand = globalScene.currentBattle.turnCommands[a];
    const bCommand = globalScene.currentBattle.turnCommands[b];

    // 1️⃣ Fight 이외 커맨드는 우선 처리
    if (aCommand?.command !== bCommand?.command) {
      if (aCommand?.command === Command.FIGHT) return 1;
      if (bCommand?.command === Command.FIGHT) return -1;
    } else if (aCommand?.command === Command.FIGHT) {
      const aUser = globalScene.getField(true).find(p => p.getBattlerIndex() === a)!;
      const bUser = globalScene.getField(true).find(p => p.getBattlerIndex() === b)!;

      const aMoveObj = aUser.getMoveset().find(m => m.moveId === aCommand.move!.move);
      const bMoveObj = bUser.getMoveset().find(m => m.moveId === bCommand!.move!.move);

      const aPriority = aMoveObj?.getMove().getPriority(aUser, false) ?? 0;
      const bPriority = bMoveObj?.getMove().getPriority(bUser, false) ?? 0;

      const isSameBracket = Math.ceil(aPriority) - Math.ceil(bPriority) === 0;
      if (aPriority !== bPriority) {
        if (isSameBracket && battlerBypassSpeed[a].value !== battlerBypassSpeed[b].value) {
          return battlerBypassSpeed[a].value ? -1 : 1;
        }
        return aPriority < bPriority ? 1 : -1;
      }
    }

    // 2️⃣ AlwaysMoveLastModifier → 무조건 뒤로
    if (battlerAlwaysLast[a].value !== battlerAlwaysLast[b].value) {
      return battlerAlwaysLast[a].value ? 1 : -1;
    }

    // 3️⃣ bypassSpeed → 빠른 쪽 먼저
    if (battlerBypassSpeed[a].value !== battlerBypassSpeed[b].value) {
      return battlerBypassSpeed[a].value ? -1 : 1;
    }

    // 4️⃣ 기본 속도 순서
    const aIndex = moveOrder.indexOf(a);
    const bIndex = moveOrder.indexOf(b);
    return aIndex < bIndex ? -1 : aIndex > bIndex ? 1 : 0;
  });

  return moveOrder;
}

  // TODO: Refactor this alongside `CommandPhase.handleCommand` to use SEPARATE METHODS
  // Also need a clearer distinction between "turn command" and queued moves
  start() {
  super.start();

  // ✅ 출전 직후 발동형 능력치상승 열매 (6종) 즉시 발동 처리
  const immediateBerries = new Set([
    BerryType.POMEG,
    BerryType.KELPSY,
    BerryType.QUALOT,
    BerryType.HONDEW,
    BerryType.GREPA,
    BerryType.TAMATO,
  ]);

  let berryTriggered = false; // 🔹 즉시 발동 여부 플래그

  for (const pokemon of globalScene.getField()) {
    if (!pokemon?.isOnField?.() || !pokemon.getHeldBerryType) continue;

    const berryType = pokemon.getHeldBerryType();
    if (berryType === undefined) continue;

    if (immediateBerries.has(berryType) && !pokemon.getTag(BattlerTagType.BERRY_USED)) {
      console.log(`[TurnStartPhase] ${pokemon.name}의 ${BerryType[berryType]} → 턴 시작 즉시 발동`);
      pokemon.addTag(BattlerTagType.BERRY_USED, 0);

      // ✅ BerryPhase를 즉시 큐 앞에 삽입
      globalScene.phaseManager.unshiftNew("BerryPhase");
      berryTriggered = true;
    }
  }

  // ✅ 열매 발동이 감지되면, 바로 Phase를 종료하고 BerryPhase로 이동
  if (berryTriggered) {
    this.end();
    return;
  }

  // 🔹 여기서부터 기존 TurnStartPhase 본문 그대로
  const field = globalScene.getField();
  const moveOrder = this.getCommandOrder();

  for (const o of this.getSpeedOrder()) {
    const pokemon = field[o];
    const preTurnCommand = globalScene.currentBattle.preTurnCommands[o];

    if (preTurnCommand?.skip) continue;

    switch (preTurnCommand?.command) {
      case Command.TERA:
        globalScene.phaseManager.pushNew("TeraPhase", pokemon);
    }
  }

  const phaseManager = globalScene.phaseManager;

  moveOrder.forEach((o, index) => {
    const pokemon = field[o];
    const turnCommand = globalScene.currentBattle.turnCommands[o];
    if (!turnCommand || turnCommand.skip) return;

    if (turnCommand.command === Command.FIGHT) {
      pokemon.turnData.order = index;
    }
    this.handleTurnCommand(turnCommand, pokemon);
  });

  phaseManager.pushNew("CheckInterludePhase");
  phaseManager.pushNew("WeatherEffectPhase");
  phaseManager.pushNew("BerryPhase");
  phaseManager.pushNew("CheckStatusEffectPhase", moveOrder);
  phaseManager.pushNew("PositionalTagPhase");
  phaseManager.pushNew("TurnEndPhase");

  this.end();
}

  private handleTurnCommand(turnCommand: TurnCommand, pokemon: Pokemon) {
    switch (turnCommand?.command) {
      case Command.FIGHT:
        this.handleFightCommand(turnCommand, pokemon);
        break;
      case Command.BALL:
        globalScene.phaseManager.unshiftNew("AttemptCapturePhase", turnCommand.targets![0] % 2, turnCommand.cursor!); //TODO: is the bang correct here?
        break;
      case Command.POKEMON:
        globalScene.phaseManager.unshiftNew(
          "SwitchSummonPhase",
          turnCommand.args?.[0] ? SwitchType.BATON_PASS : SwitchType.SWITCH,
          pokemon.getFieldIndex(),
          turnCommand.cursor!, // TODO: Is this bang correct?
          true,
          pokemon.isPlayer(),
        );
        break;
      case Command.RUN:
        globalScene.phaseManager.unshiftNew("AttemptRunPhase");
        break;
    }
  }

  private handleFightCommand(turnCommand: TurnCommand, pokemon: Pokemon) {
    const queuedMove = turnCommand.move;
    if (!queuedMove) {
      return;
    }

    // TODO: This seems somewhat dubious
    const move =
      pokemon.getMoveset().find(m => m.moveId === queuedMove.move && m.ppUsed < m.getMovePp()) ??
      new PokemonMove(queuedMove.move);

    if (move.getMove().hasAttr("MoveHeaderAttr")) {
      globalScene.phaseManager.unshiftNew("MoveHeaderPhase", pokemon, move);
    }

    globalScene.phaseManager.pushNew(
      "MovePhase",
      pokemon,
      turnCommand.targets ?? queuedMove.targets,
      move,
      queuedMove.useMode,
    );
  }
}
