import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { FRIENDSHIP_LOSS_FROM_FAINT } from "#balance/starters";
import { allMoves } from "#data/data-lists";
import { battleSpecDialogue } from "#data/dialogue";
import { SpeciesFormChangeActiveTrigger } from "#data/form-change-triggers";
import { BattleSpec } from "#enums/battle-spec";
import { BattleType } from "#enums/battle-type";
import type { BattlerIndex } from "#enums/battler-index";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import { StatusEffect } from "#enums/status-effect";
import { SwitchType } from "#enums/switch-type";
import type { EnemyPokemon, PlayerPokemon, Pokemon } from "#field/pokemon";
import { PokemonInstantReviveModifier, VictoryStatBoostModifier } from "#modifiers/modifier";
import { PokemonMove } from "#moves/pokemon-move";
import { PokemonPhase } from "#phases/pokemon-phase";
import { isNullOrUndefined } from "#utils/common";
import i18next from "i18next";

export class FaintPhase extends PokemonPhase {
  public readonly phaseName = "FaintPhase";

  private preventInstantRevive: boolean;
  private source?: Pokemon;

  constructor(battlerIndex: BattlerIndex, preventInstantRevive = false, source?: Pokemon) {
    super(battlerIndex);
    this.preventInstantRevive = preventInstantRevive;
    this.source = source;
  }

  start() {
    super.start();

    const faintPokemon = this.getPokemon();

    if (this.source) {
      faintPokemon.getTag(BattlerTagType.DESTINY_BOND)?.lapse(this.source, BattlerTagLapseType.CUSTOM);
      faintPokemon.getTag(BattlerTagType.GRUDGE)?.lapse(faintPokemon, BattlerTagLapseType.CUSTOM, this.source);
    }

    faintPokemon.resetSummonData();

    if (!this.preventInstantRevive) {
      const instantReviveModifier = globalScene.applyModifier(
        PokemonInstantReviveModifier,
        this.player,
        faintPokemon,
      ) as PokemonInstantReviveModifier;

      if (instantReviveModifier) {
        faintPokemon.loseHeldItem(instantReviveModifier);
        globalScene.updateModifiers(this.player);
        return this.end();
      }
    }

    // 플레이어 필드 참여 포켓몬 처리
    for (const pokemon of globalScene.getPlayerField()) {
      if (pokemon?.isActive(true) && pokemon.isPlayer()) {
        globalScene.currentBattle.addParticipant(pokemon as PlayerPokemon);
      }
    }

    if (!this.tryOverrideForBattleSpec()) {
      this.doFaint();
    }
  }

  doFaint(): void {
  const pokemon = this.getPokemon();

  // KO 카운트 기록 (라스트 리스펙트, 대장군 등에 사용)
  if (pokemon.isPlayer()) {
    globalScene.arena.playerFaints += 1;
    globalScene.currentBattle.playerFaintsHistory.push({
      pokemon,
      turn: globalScene.currentBattle.turn,
    });
  } else {
    globalScene.currentBattle.enemyFaints += 1;
    globalScene.currentBattle.enemyFaintsHistory.push({
      pokemon,
      turn: globalScene.currentBattle.turn,
    });
  }

  globalScene.phaseManager.queueMessage(
    i18next.t("battle:fainted", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    null,
    true,
  );

  globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeActiveTrigger, true);
  pokemon.resetTera();

  // PostFaintAbAttr (기절한 포켓몬의 특성 발동)
  if (pokemon.turnData.attacksReceived?.length) {
    const lastAttack = pokemon.turnData.attacksReceived[0];
    applyAbAttrs("PostFaintAbAttr", {
      pokemon,
      attacker: globalScene.getPokemonById(lastAttack.sourceId) ?? undefined,
      move: new PokemonMove(lastAttack.move).getMove(),
      hitResult: lastAttack.result,
    });
  } else {
    applyAbAttrs("PostFaintAbAttr", { pokemon });
  }

  // 🔽 PostKnockOutAbAttr 브로드캐스트 (Soul-Heart, Grim Neigh 등)
  const alivePlayField = globalScene.getField(true);
  for (const p of alivePlayField) {
    if (p !== pokemon) {
      applyAbAttrs("PostKnockOutAbAttr", { pokemon: p, victim: pokemon });
    }
  }

  // 승자 계산 (아이템/특성 로직 포함)
  if (pokemon.turnData.attacksReceived?.length) {
    const lastAttack = pokemon.turnData.attacksReceived[0];
    const victor =
      this.source ??
      (lastAttack?.sourceId ? globalScene.getPokemonById(lastAttack.sourceId) : undefined);

    if (lastAttack && victor && victor.isOnField()) {
      // 1) 승리 모디파이어 적용 (VictoryStatBoostModifier 등)
      const victoryModifier = globalScene.applyModifier(
        VictoryStatBoostModifier,
        victor.isPlayer(),
        victor,
        1
      ) as VictoryStatBoostModifier;

      if (victoryModifier) {
        victoryModifier.applyPostVictory(
          victor,
          pokemon,
          new PokemonMove(lastAttack.move).getMove(),
          false,
        );
      }

      // 2) 승리 특성(PostVictoryAbAttr) 적용
      applyAbAttrs("PostVictoryAbAttr", {
        pokemon: victor,
        victim: pokemon,
        move: new PokemonMove(lastAttack.move).getMove(),
        hitResult: lastAttack.result,
      });

      // 3) PostVictoryStatStageChangeAttr (예: 맘보르기니 Boost 특성)
      const pvmove = allMoves[lastAttack.move];
      const pvattrs = pvmove.getAttrs("PostVictoryStatStageChangeAttr");
      for (const pvattr of pvattrs) {
        pvattr.applyPostVictory(victor, victor, pvmove);
      }
    }
  }

  // 플레이어 파티 체크 & 교체
  if (this.player) {
    const legalPlayerPokemon = globalScene.getPokemonAllowedInBattle();
    const legalPlayerPartyPokemon = legalPlayerPokemon.filter(p => !p.isActive(true));

    if (!legalPlayerPokemon.length) {
      globalScene.phaseManager.unshiftNew("GameOverPhase");
    } else if (
      globalScene.currentBattle.double &&
      legalPlayerPokemon.length === 1 &&
      legalPlayerPartyPokemon.length === 0
    ) {
      globalScene.phaseManager.unshiftNew("ToggleDoublePositionPhase", true);
    } else if (legalPlayerPartyPokemon.length > 0) {
      globalScene.phaseManager.pushNew("SwitchPhase", SwitchType.SWITCH, this.fieldIndex, true, false);
    }
  } else {
    globalScene.phaseManager.unshiftNew("VictoryPhase", this.battlerIndex);
    if ([BattleType.TRAINER, BattleType.MYSTERY_ENCOUNTER].includes(globalScene.currentBattle.battleType)) {
      const hasReservePartyMember = !!globalScene
        .getEnemyParty()
        .filter(p => p.isActive() && !p.isOnField() && p.trainerSlot === (pokemon as EnemyPokemon).trainerSlot)
        .length;
      if (hasReservePartyMember) {
        globalScene.phaseManager.pushNew("SwitchSummonPhase", SwitchType.SWITCH, this.fieldIndex, -1, false, false);
      }
    }
  }

  // 더블배틀 이동 리디렉션
  const allyPokemon = pokemon.getAlly();
  if (globalScene.currentBattle.double && allyPokemon) {
    globalScene.redirectPokemonMoves(pokemon, allyPokemon);
  }

  // 기절 애니메이션 처리
  pokemon.faintCry(() => {
    if (pokemon.isPlayer()) {
      pokemon.addFriendship(-FRIENDSHIP_LOSS_FROM_FAINT);
    }
    pokemon.hideInfo();
    globalScene.playSound("se/faint");
    globalScene.tweens.add({
      targets: pokemon,
      duration: 500,
      y: pokemon.y + 150,
      ease: "Sine.easeIn",
      onComplete: () => {
        pokemon.lapseTags(BattlerTagLapseType.FAINT);
        pokemon.y -= 150;
        pokemon.doSetStatus(StatusEffect.FAINT);

        if (pokemon.isPlayer()) {
          globalScene.currentBattle.removeFaintedParticipant(pokemon as PlayerPokemon);
        } else {
          globalScene.addFaintedEnemyScore(pokemon as EnemyPokemon);
          globalScene.currentBattle.addPostBattleLoot(pokemon as EnemyPokemon);
        }

        pokemon.leaveField();
        this.end();
      },
    });
  });
}

  tryOverrideForBattleSpec(): boolean {
    if (globalScene.currentBattle.battleSpec === BattleSpec.FINAL_BOSS && !this.player) {
      const enemy = this.getPokemon();
      if (enemy.formIndex) {
        globalScene.ui.showDialogue(
          battleSpecDialogue[BattleSpec.FINAL_BOSS].secondStageWin,
          enemy.species.name,
          null,
          () => this.doFaint(),
        );
      } else {
        enemy.hp++;
        globalScene.phaseManager.unshiftNew("DamageAnimPhase", enemy.getBattlerIndex(), 0, HitResult.INDIRECT);
        this.end();
      }
      return true;
    }
    return false;
  }
}
