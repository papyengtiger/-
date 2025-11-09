/*
 * Module holding functions to apply move attributes.
 * Must not import anything that is not a type.
 */

import type { Pokemon } from "#field/pokemon";
import type { Move, MoveAttr } from "#moves/move";
import type { ChargingMove, MoveAttrFilter, MoveAttrString } from "#types/move-types";

function applyMoveAttrsInternal(
  attrFilter: MoveAttrFilter,
  user: Pokemon | null,
  target: Pokemon | null,
  move: Move,
  args: any[],
): void {
  if (!move?.attrs || !Array.isArray(move.attrs)) {
    console.warn("applyMoveAttrsInternal: move.attrs is invalid", move);
    return;
  }

  move.attrs
    .filter(attr => attrFilter(attr))
    .forEach(attr => {
      try {
        attr.apply(user ?? undefined, target ?? undefined, move, args);
      } catch (e) {
        console.error("Error applying move attr", attr, e);
      }
    });
}

function applyMoveChargeAttrsInternal(
  attrFilter: MoveAttrFilter,
  user: Pokemon | null,
  target: Pokemon | null,
  move: ChargingMove,
  args: any[],
): void {
  if (!move?.chargeAttrs || !Array.isArray(move.chargeAttrs)) {
    console.warn("applyMoveChargeAttrsInternal: move.chargeAttrs is invalid", move);
    return;
  }

  move.chargeAttrs
    .filter(attr => attrFilter(attr))
    .forEach(attr => {
      try {
        attr.apply(user ?? undefined, target ?? undefined, move, args);
      } catch (e) {
        console.error("Error applying charge attr", attr, e);
      }
    });
}

export function applyMoveAttrs(
  attrType: MoveAttrString,
  user: Pokemon | null,
  target: Pokemon | null,
  move: Move,
  ...args: any[]
): void {
  applyMoveAttrsInternal((attr: MoveAttr) => attr.is(attrType), user, target, move, args);
}

export function applyFilteredMoveAttrs(
  attrFilter: MoveAttrFilter,
  user: Pokemon,
  target: Pokemon | null,
  move: Move,
  ...args: any[]
): void {
  applyMoveAttrsInternal(attrFilter, user, target, move, args);
}

export function applyMoveChargeAttrs(
  attrType: MoveAttrString,
  user: Pokemon | null,
  target: Pokemon | null,
  move: ChargingMove,
  ...args: any[]
): void {
  applyMoveChargeAttrsInternal((attr: MoveAttr) => attr.is(attrType), user, target, move, args);
}
