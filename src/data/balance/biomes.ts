import type { SpeciesFormEvolution } from "#balance/pokemon-evolutions";
import { pokemonEvolutions } from "#balance/pokemon-evolutions";
import { BiomeId } from "#enums/biome-id";
import { PokemonType } from "#enums/pokemon-type";
import { SpeciesId } from "#enums/Species-id";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { randSeedInt } from "#utils/common";
import { getEnumValues } from "#utils/enums";
import { toCamelCase } from "#utils/strings";
import i18next from "i18next";
// import beautify from "json-beautify";

export function getBiomeName(biome: BiomeId | -1) {
  if (biome === -1) {
    return i18next.t("biome:unknownLocation");
  }
  switch (biome) {
    case BiomeId.GRASS:
      return i18next.t("biome:grass");
    case BiomeId.RUINS:
      return i18next.t("biome:ruins");
    case BiomeId.END:
      return i18next.t("biome:end");
    default:
      return i18next.t(`biome:${toCamelCase(BiomeId[biome])}`);
  }
}

interface BiomeLinks {
  [key: number]: BiomeId | (BiomeId | [BiomeId, number])[]
}

interface BiomeDepths {
  [key: number]: [number, number]
}

export const biomeLinks: BiomeLinks = {
  [BiomeId.TOWN]: BiomeId.PLAINS,
  [BiomeId.PLAINS]: [ BiomeId.GRASS, BiomeId.METROPOLIS, BiomeId.RIVER ],
  [BiomeId.GRASS]: [ BiomeId.TALL_GRASS, BiomeId.GREEN_MOUNTAIN, BiomeId.BAMBOO_FOREST ],
  [BiomeId.TALL_GRASS]: [ BiomeId.FOREST, BiomeId.CAVE, [ BiomeId.LOG_CAVE, 2 ] ],
  [BiomeId.SLUM]: [ BiomeId.CONSTRUCTION_SITE, BiomeId.SEWER, [ BiomeId.SWAMP, 2 ]],
  [BiomeId.FOREST]: [ BiomeId.JUNGLE, BiomeId.MEADOW ],
  [BiomeId.SEA]: [ BiomeId.SEABED, BiomeId.GLACIER, [ BiomeId.GHOST_SHIP, 3 ]],
  [BiomeId.SWAMP]: [ BiomeId.GRAVEYARD, BiomeId.TALL_GRASS ],
  [BiomeId.BEACH]: [ BiomeId.SEA, [ BiomeId.ISLAND, 2 ]],
  [BiomeId.LAKE]: [ BiomeId.BEACH, BiomeId.SWAMP, BiomeId.CONSTRUCTION_SITE ],
  [BiomeId.SEABED]: [ BiomeId.CAVE, [ BiomeId.VOLCANO, 3 ]],
  [BiomeId.MOUNTAIN]: [ BiomeId.VOLCANO, [ BiomeId.WASTELAND, 2 ], [ BiomeId.SKY, 3 ]],
  [BiomeId.BADLANDS]: [ BiomeId.DESERT, BiomeId.MOUNTAIN, BiomeId.CANYON ],
  [BiomeId.CAVE]: [ BiomeId.BADLANDS, BiomeId.LAKE, [ BiomeId.LABORATORY, 2 ]],
  [BiomeId.DESERT]: [ BiomeId.RUINS, BiomeId.SAND_CAVE, [ BiomeId.CONSTRUCTION_SITE, 2 ]],
  [BiomeId.ICE_CAVE]: [ BiomeId.SNOWY_FOREST, BiomeId.SNOW_MOUNTAIN ],
  [BiomeId.MEADOW]: [ BiomeId.PLAINS, BiomeId.FAIRY_FOREST, [ BiomeId.CASTLE, 3 ]],
  [BiomeId.POWER_PLANT]: [ BiomeId.FACTORY, BiomeId.LIGHTNING_FIELD ],
  [BiomeId.VOLCANO]: [ BiomeId.BEACH, BiomeId.MAGMA_CAVERN, BiomeId.SPA, [ BiomeId.SPACE, 3 ]],
  [BiomeId.GRAVEYARD]: [ BiomeId.ABYSS, BiomeId.DESERTED_HOUSE ],
  [BiomeId.DOJO]: [ BiomeId.PLAINS, [ BiomeId.JUNGLE, 2 ], [ BiomeId.TEMPLE, 2 ]],
  [BiomeId.FACTORY]: [ BiomeId.PLAINS, BiomeId.SHARP_FIELD, [ BiomeId.LABORATORY, 3 ]],
  [BiomeId.RUINS]: [ BiomeId.MOUNTAIN, BiomeId.FOREST, [ BiomeId.CASTLE, 3 ]],
  [BiomeId.WASTELAND]: [ BiomeId.BADLANDS, BiomeId.WYVERN_MOUNTAIN, [ BiomeId.DRAGON_TEMPLE, 3 ]],
  [BiomeId.ABYSS]: [ BiomeId.CAVE, [ BiomeId.SPACE, 2 ], [ BiomeId.WASTELAND, 2 ]],
  [BiomeId.SPACE]: BiomeId.RUINS,
  [BiomeId.CONSTRUCTION_SITE]: [ BiomeId.POWER_PLANT, BiomeId.SEWER, BiomeId.DOJO ],
  [BiomeId.JUNGLE]: [ BiomeId.TEMPLE, BiomeId.LOG_CAVE, BiomeId.MUSHROOM_FOREST ],
  [BiomeId.FAIRY_CAVE]: [ BiomeId.ICE_CAVE, BiomeId.TEMPLE, [ BiomeId.SPACE, 2 ]],
  [BiomeId.TEMPLE]: [ BiomeId.DESERT, [ BiomeId.SWAMP, 2 ], [ BiomeId.RUINS, 2 ]],
  [BiomeId.METROPOLIS]: [ BiomeId.SLUM, BiomeId.SEWER, [ BiomeId.AMUSEMENT_PARK, 2 ] ],
  [BiomeId.SNOWY_FOREST]: [ BiomeId.FOREST, [ BiomeId.MOUNTAIN, 2 ], [ BiomeId.LAKE, 2 ]],
  [BiomeId.ISLAND]: [ BiomeId.SEA, [ BiomeId.AMUSEMENT_PARK, 2 ]],
  [BiomeId.LABORATORY]: BiomeId.CONSTRUCTION_SITE,
  [BiomeId.MAGMA_CAVERN]: [ BiomeId.BLAZE_FIELD, BiomeId.LAVA_LAKE ],
  [BiomeId.BLAZE_FIELD]: [ BiomeId.INFERNO_FOREST, BiomeId.LIGHTNING_FIELD, BiomeId.LAVA_LAKE ],
  [BiomeId.INFERNO_FOREST]: [ BiomeId.VOLCANO, BiomeId.LAVA_LAKE, [ BiomeId.WASTELAND ]],
  [BiomeId.RIVER]: [ BiomeId.BEACH, BiomeId.LAKE, BiomeId.METROPOLIS ],
  [BiomeId.LIGHTNING_FIELD]: [ BiomeId.SPARK_CAVE, BiomeId.THUNDER_MOUNTAIN, [ BiomeId.CONSTRUCTION_SITE, 2 ]],
  [BiomeId.SPARK_CAVE]: [ BiomeId.VORTEX_CAVE, BiomeId.MAGMA_CAVERN, [ BiomeId.WASTELAND, 2 ]],
  [BiomeId.THUNDER_MOUNTAIN]: [ BiomeId.SHARP_FIELD, BiomeId.VOLCANO, [ BiomeId.ABANDONED_CASTLE, 2 ]],
  [BiomeId.SHARP_FIELD]: [ BiomeId.SNOWY_FIELD, BiomeId.BLAZE_FIELD, [ BiomeId.BLACK_MOUNTAIN, 2 ]],
  [BiomeId.VORTEX_CAVE]: [ BiomeId.FAIRY_FOREST, BiomeId.WYVERN_MOUNTAIN, [ BiomeId.DRAGON_TEMPLE, 3 ]],
  [BiomeId.SNOWY_FIELD]: [ BiomeId.GLACIER_LAKE, BiomeId.SNOW_MOUNTAIN, [ BiomeId.STAR_MOUNTAIN, 3 ]],
  [BiomeId.GLACIER_LAKE]: [ BiomeId.GLACIER, BiomeId.ICE_CAVE, [ BiomeId.ABANDONED_CASTLE, 3 ]],
  [BiomeId.ABANDONED_CASTLE]: [ BiomeId.BLACK_FIELD, BiomeId.CANYON, [ BiomeId.STAR_MOUNTAIN, 3 ]],
  [BiomeId.BLACK_MOUNTAIN]: [ BiomeId.DRAGON_FOREST, BiomeId.VORTEX_CAVE, [ BiomeId.ABANDONED_CASTLE, 3 ]],
  [BiomeId.FAIRY_FOREST]: [ BiomeId.INFERNO_FOREST, BiomeId.FOREST, [ BiomeId.FAIRY_CAVE, 2 ]],
  [BiomeId.LAVA_LAKE]: [ BiomeId.SPA, BiomeId.POLLUTED_CAVE, [ BiomeId.LABORATORY, 3 ]],
  [BiomeId.SPA]: [ BiomeId.BEACH, BiomeId.ICE_CAVE ],
  [BiomeId.BLACK_FIELD]: [ BiomeId.GRAVEYARD, BiomeId.POLLUTED_CAVE, [ BiomeId.BLACK_MOUNTAIN, 2 ]],
  [BiomeId.CANYON]: [ BiomeId.DESERT, BiomeId.VORTEX_CAVE, [ BiomeId.STAR_MOUNTAIN, 3 ]],
  [BiomeId.STAR_MOUNTAIN]: [ BiomeId.SKY, [ BiomeId.SPACE, 2 ]],
  [BiomeId.WYVERN_MOUNTAIN]: [ BiomeId.DRAGON_FOREST, BiomeId.DRAKE_LAKE, [ BiomeId.DRAGON_TEMPLE, 2 ]],
  [BiomeId.POLLUTED_CAVE]: [ BiomeId.POWER_PLANT, BiomeId.BLACK_MOUNTAIN, BiomeId.POLLUTED_RIVER ],
  [BiomeId.SKY]: [ BiomeId.SEA, BiomeId.PLAINS, [ BiomeId.SPACE, 3 ]],
  [BiomeId.POLLUTED_RIVER]: [ BiomeId.RIVER, BiomeId.SWAMP, BiomeId.LAKE ],
  [BiomeId.LOG_CAVE]: [ BiomeId.MUSHROOM_FOREST, BiomeId.DARK_FOREST, BiomeId.GREEN_MOUNTAIN ],
  [BiomeId.DRAGON_FOREST]: [ BiomeId.RIVER, BiomeId.MOUNTAIN, [ BiomeId.DRAGON_TEMPLE, 2 ]], 
  [BiomeId.SAND_CAVE]: [ BiomeId.TEMPLE, BiomeId.MAGMA_CAVERN, [ BiomeId.RUINS, 2 ]],
  [BiomeId.GHOST_SHIP]: [ BiomeId.BEACH, [ BiomeId.ISLAND, 3 ]],
  [BiomeId.DESERTED_HOUSE]: [ BiomeId.DARK_FOREST, BiomeId.BLACK_FIELD, [ BiomeId.ABANDONED_CASTLE, 2 ]],
  [BiomeId.GREEN_MOUNTAIN]: [ BiomeId.DRAKE_LAKE, BiomeId.JUNGLE, [ BiomeId.STAR_MOUNTAIN, 3 ]], 
  [BiomeId.DRAKE_LAKE]: [ BiomeId.BAMBOO_FOREST, BiomeId.WYVERN_MOUNTAIN, [ BiomeId.ABANDONED_CASTLE, 3 ]],
  [BiomeId.AMUSEMENT_PARK]: [ BiomeId.PLAINS, BiomeId.MEADOW, [ BiomeId.CASTLE, 2 ]],
  [BiomeId.CASTLE]: [ BiomeId.FOREST, BiomeId.RIVER, [ BiomeId.FAIRY_FOREST, 2 ]],
  [BiomeId.DARK_FOREST]: [ BiomeId.ABYSS, BiomeId.GRAVEYARD, [ BiomeId.ABANDONED_CASTLE, 3 ]],
  [BiomeId.MUSHROOM_FOREST]: [ BiomeId.BLAZE_FIELD, BiomeId.SWAMP, BiomeId.DARK_FOREST ],
  [BiomeId.SNOW_MOUNTAIN]: [ BiomeId.VOLCANO, BiomeId.SPA, [ BiomeId.ABANDONED_CASTLE, 3 ]],
  [BiomeId.SEWER]: [ BiomeId.POLLUTED_RIVER, BiomeId.POLLUTED_CAVE, [ BiomeId.LABORATORY, 3 ]],
  [BiomeId.BAMBOO_FOREST]: [ BiomeId.DOJO, BiomeId.TEMPLE, [ BiomeId.DRAGON_TEMPLE, 3 ]],
  [BiomeId.DRAGON_TEMPLE]: [ BiomeId.BLAZE_FIELD, BiomeId.BLACK_MOUNTAIN, [ BiomeId.ABANDONED_CASTLE, 3 ]],
  [BiomeId.GLACIER]: [ BiomeId.ICE_CAVE, BiomeId.SNOWY_FIELD, [ BiomeId.SNOW_MOUNTAIN, 2 ]]
};

export const biomeDepths: BiomeDepths = {};

export enum BiomePoolTier {
  COMMON,
  UNCOMMON,
  RARE,
  SUPER_RARE,
  ULTRA_RARE,
  BOSS,
  BOSS_RARE,
  BOSS_SUPER_RARE,
  BOSS_ULTRA_RARE
}

export const uncatchableSpecies: SpeciesId[] = [];

interface SpeciesTree {
  [key: number]: SpeciesId[]
}

export interface PokemonPools {
  [key: number]: (SpeciesId | SpeciesTree)[]
}

interface BiomeTierPokemonPools {
  [key: number]: PokemonPools
}

interface BiomePokemonPools {
  [key: number]: BiomeTierPokemonPools
}

export interface BiomeTierTod {
  biome: BiomeId,
  tier: BiomePoolTier,
  tod: TimeOfDay[]
}

export interface CatchableSpecies{
  [key: number]: BiomeTierTod[]
}

export const catchableSpecies: CatchableSpecies = {};

export interface BiomeTierTrainerPools {
  [key: number]: TrainerType[]
}

export interface BiomeTrainerPools {
  [key: number]: BiomeTierTrainerPools
}

export const biomePokemonPools: biomePokemonPools = {
  [BiomeId.TOWN]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [
        { 1: [ SpeciesId.CATERPIE ], 7: [ SpeciesId.METAPOD ], 10: [ SpeciesId.BUTTERFREE ]},
        { 1: [ SpeciesId.SENTRET ], 15: [ SpeciesId.FURRET ]},
        { 1: [ SpeciesId.LEDYBA ], 18: [ SpeciesId.LEDIAN ]},
        { 1: [ SpeciesId.HOPPIP ], 18: [ SpeciesId.SKIPLOOM ], 27: [ SpeciesId.JUMPLUFF ]},
        { 1: [ SpeciesId.SUNKERN ], 20: [ SpeciesId.SUNFLORA ]},
        { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]},
        { 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]},
        { 1: [ SpeciesId.COTTONEE ], 20: [ SpeciesId.WHIMSICOTT ]},
        { 1: [ SpeciesId.SCATTERBUG ], 9: [ SpeciesId.SPEWPA ], 12: [ SpeciesId.VIVILON ]},
        { 1: [ SpeciesId.YUNGOOS ], 20: [ SpeciesId.GUMSHOOS ]},
        { 1: [ SpeciesId.SKWOVET ], 24: [ SpeciesId.GREEDENT ]}
      ],
      [TimeOfDay.DAY]: [
        { 1: [ SpeciesId.CATERPIE ], 7: [ SpeciesId.METAPOD ], 10: [ SpeciesId.BUTTERFREE ]},
        { 1: [ SpeciesId.SENTRET ], 15: [ SpeciesId.FURRET ]},
        { 1: [ SpeciesId.HOPPIP ], 18: [ SpeciesId.SKIPLOOM ], 27: [ SpeciesId.JUMPLUFF ]},
        { 1: [ SpeciesId.SUNKERN ], 20: [ SpeciesId.SUNFLORA ]},
        { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.SILCOON ], 10: [ SpeciesId.BEAUTIFLY ]},
        { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]},
        { 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]},
        { 1: [ SpeciesId.COTTONEE ], 20: [ SpeciesId.WHIMSICOTT ]},
        { 1: [ SpeciesId.SCATTERBUG ], 9: [ SpeciesId.SPEWPA ], 12: [ SpeciesId.VIVILON ]},
        { 1: [ SpeciesId.YUNGOOS ], 20: [ SpeciesId.GUMSHOOS ]},
        { 1: [ SpeciesId.SKWOVET ], 24: [ SpeciesId.GREEDENT ]}
      ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.WEEDLE ], 7: [ SpeciesId.KAKUNA ], 10: [ SpeciesId.BEEDRILL ]}, { 1: [ SpeciesId.POOCHYENA ], 18: [ SpeciesId.MIGHTYENA ]}, { 1: [ SpeciesId.PATRAT ], 20: [ SpeciesId.WATCHOG ]}, { 1: [ SpeciesId.PURRLOIN ], 20: [ SpeciesId.LIEPARD ]}, { 1: [ SpeciesId.BLIPBUG ], 10: [ SpeciesId.DOTTLER ], 30: [ SpeciesId.ORBEETLE ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.WEEDLE ], 7: [ SpeciesId.KAKUNA ], 10: [ SpeciesId.BEEDRILL ]}, { 1: [ SpeciesId.HOOTHOOT ], 20: [ SpeciesId.NOCTOWL ]}, { 1: [ SpeciesId.SPINARAK ], 22: [ SpeciesId.ARIADOS ]}, { 1: [ SpeciesId.POOCHYENA ], 18: [ SpeciesId.MIGHTYENA ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.CASCOON ], 10: [ SpeciesId.DUSTOX ]}, { 1: [ SpeciesId.PATRAT ], 20: [ SpeciesId.WATCHOG ]}, { 1: [ SpeciesId.PURRLOIN ], 20: [ SpeciesId.LIEPARD ]}, { 1: [ SpeciesId.BLIPBUG ], 10: [ SpeciesId.DOTTLER ], 30: [ SpeciesId.ORBEETLE ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUIL ], 32: [ SpeciesId.UNFEAZANT ]}, { 1: [ SpeciesId.RATTATA ], 20: [ SpeciesId.RATICATE ]}, { 1: [ SpeciesId.SPEAROW ], 20: [ SpeciesId.FEAROW ]}, { 1: [ SpeciesId.ZIGZAGOON ], 20: [ SpeciesId.LINOONE ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.SILCOON ], 10: [ SpeciesId.BEAUTIFLY ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.CASCOON ], 10: [ SpeciesId.DUSTOX ]}, { 1: [ SpeciesId.TAILLOW ], 22: [ SpeciesId.SWELLOW ]}, { 1: [ SpeciesId.BIDOOF ], 15: [ SpeciesId.BIBAREL ]}, { 1: [ SpeciesId.LILLIPUP ], 16: [ SpeciesId.HERDIER ], 32: [ SpeciesId.STOUTLAND ]}, { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]}, { 1: [ SpeciesId.WOOLOO ], 24: [ SpeciesId.DUBWOOL ]}, { 1: [ SpeciesId.LECHONK ], 18: [ SpeciesId.OINKOLOGNE ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.BELLSPROUT ], 21: [ SpeciesId.WEEPINBELL ], 35: [ SpeciesId.VICTREEBEL ]}, { 1: [ SpeciesId.POOCHYENA ], 18: [ SpeciesId.MIGHTYENA ]}, { 1: [ SpeciesId.LOTAD ], 14: [ SpeciesId.LOMBRE ]}, { 1: [ SpeciesId.SKITTY ], 30: [ SpeciesId.DELCATTY ]}, { 1: [ SpeciesId.COMBEE ], 21: [ SpeciesId.VESPIQUEN ]}, { 1: [ SpeciesId.CHERUBI ], 25: [ SpeciesId.CHERRIM ]}, { 1: [ SpeciesId.PATRAT ], 20: [ SpeciesId.WATCHOG ]}, { 1: [ SpeciesId.MINCCINO ], 20: [ SpeciesId.CINCCINO ]}, { 1: [ SpeciesId.PAWMI ], 18: [ SpeciesId.PAWMO ], 32: [ SpeciesId.PAWMOT ]}], 
      [TimeOfDay.DAY]: [ { 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ], 30: [ SpeciesId.NIDOQUEEN ]}, { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ], 30: [ SpeciesId.NIDOKING ]}, { 1: [ SpeciesId.BELLSPROUT ], 21: [ SpeciesId.WEEPINBELL ], 35: [ SpeciesId.VICTREEBEL ]}, { 1: [ SpeciesId.POOCHYENA ], 18: [ SpeciesId.MIGHTYENA ]}, { 1: [ SpeciesId.LOTAD ], 14: [ SpeciesId.LOMBRE ]}, { 1: [ SpeciesId.SKITTY ], 30: [ SpeciesId.DELCATTY ]}, { 1: [ SpeciesId.COMBEE ], 21: [ SpeciesId.VESPIQUEN ]}, { 1: [ SpeciesId.CHERUBI ], 25: [ SpeciesId.CHERRIM ]}, { 1: [ SpeciesId.PATRAT ], 20: [ SpeciesId.WATCHOG ]}, { 1: [ SpeciesId.MINCCINO ], 20: [ SpeciesId.CINCCINO ]}, { 1: [ SpeciesId.PAWMI ], 18: [ SpeciesId.PAWMO ], 32: [ SpeciesId.PAWMOT ]}],
      [TimeOfDay.DUSK]: [ { 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]}, { 1: [ SpeciesId.ODDISH ], 21: [ SpeciesId.GLOOM ], 35: [ SpeciesId.VILEPLUME ]}, { 1: [ SpeciesId.ODDISH ], 21: [ SpeciesId.GLOOM ], 35: [ SpeciesId.BELLOSSOM ]}, { 1: [ SpeciesId.MEOWTH ], 28: [ SpeciesId.PERSIAN ]}, { 1: [ SpeciesId.SPINARAK ], 22: [ SpeciesId.ARIADOS ]}, { 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ], 35: [ SpeciesId.SHIFTRY ]}, { 1: [ SpeciesId.SHROOMISH ], 23: [ SpeciesId.BRELOOM ]}, { 1: [ SpeciesId.KRICKETOT ], 10: [ SpeciesId.KRICKETUNE ]}, { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}],
      [TimeOfDay.NIGHT]: [ { 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]}, { 1: [ SpeciesId.ODDISH ], 21: [ SpeciesId.GLOOM ], 35: [ SpeciesId.VILEPLUME ]}, { 1: [ SpeciesId.ODDISH ], 21: [ SpeciesId.GLOOM ], 35: [ SpeciesId.BELLOSSOM ]}, { 1: [ SpeciesId.PARAS ], 24: [ SpeciesId.PARASECT ]}, { 1: [ SpeciesId.VENONAT ], 31: [ SpeciesId.VENOMOTH ]}, { 1: [ SpeciesId.MEOWTH ], 28: [ SpeciesId.PERSIAN ]}, { 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ], 35: [ SpeciesId.SHIFTRY ]}, { 1: [ SpeciesId.SHROOMISH ], 23: [ SpeciesId.BRELOOM ]}, { 1: [ SpeciesId.KRICKETOT ], 10: [ SpeciesId.KRICKETUNE ]}, { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}],
      [TimeOfDay.ALL]: [ { 1: [ SpeciesId.NINCADA ], 20: [ SpeciesId.NINJASK ]}, { 1: [ SpeciesId.NINCADA ], 20: [ SpeciesId.SHEDINJA ]}, { 1: [ SpeciesId.WHISMUR ], 20: [ SpeciesId.LOUDRED ], 40: [ SpeciesId.EXPLOUD ]}, { 1: [ SpeciesId.FIDOUGH ], 26: [ SpeciesId.DACHSBUN ]}]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.TANDEMAUS ], 25: [ SpeciesId.MAUSHOLD ]}], [TimeOfDay.DAY]: [{ 1: [ SpeciesId.TANDEMAUS ], 25: [ SpeciesId.MAUSHOLD ]}], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ABRA ], 16: [ SpeciesId.KADABRA ], 35: [ SpeciesId.ALAKAZAM ]}, { 1: [ SpeciesId.SURSKIT ], 22: [ SpeciesId.MASQUERAIN ]}, { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNIGHT ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.EEVEE ], 35: [ SpeciesId.VAPOREON ]}, { 1: [ SpeciesId.EEVEE ], 35: [ SpeciesId.JOLTEON ]}, { 1: [ SpeciesId.EEVEE ], 35: [ SpeciesId.FLAREON ]}, { 1: [ SpeciesId.EEVEE ], 35: [ SpeciesId.ESPEON ]}, { 1: [ SpeciesId.EEVEE ], 35: [ SpeciesId.UMBREON ]}, { 1: [ SpeciesId.EEVEE ], 35: [ SpeciesId.LEAFEON ]}, { 1: [ SpeciesId.EEVEE ], 35: [ SpeciesId.GLACEON ]}, { 1: [ SpeciesId.EEVEE ], 35: [ SpeciesId.SYLVEON ]}, { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [ SpeciesId.GARDEVOIR ]}, { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [ SpeciesId.GALLADE ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DITTO ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.PLAINS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.SENTRET ], 15: [ SpeciesId.FURRET ]}, { 1: [ SpeciesId.YUNGOOS ], 30: [ SpeciesId.GUMSHOOS ]}, { 1: [ SpeciesId.SKWOVET ], 24: [ SpeciesId.GREEDENT ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.SENTRET ], 15: [ SpeciesId.FURRET ]}, { 1: [ SpeciesId.YUNGOOS ], 30: [ SpeciesId.GUMSHOOS ]}, { 1: [ SpeciesId.SKWOVET ], 24: [ SpeciesId.GREEDENT ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.MEOWTH ], 28: [ SpeciesId.PERSIAN ]}, { 1: [ SpeciesId.POOCHYENA ], 18: [ SpeciesId.MIGHTYENA ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.ZUBAT ], 22: [ SpeciesId.GOLBAT ]}, { 1: [ SpeciesId.MEOWTH ], 28: [ SpeciesId.PERSIAN ]}, { 1: [ SpeciesId.POOCHYENA ], 18: [ SpeciesId.MIGHTYENA ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ZIGZAGOON ], 20: [ SpeciesId.LINOONE ]}, { 1: [ SpeciesId.BIDOOF ], 15: [ SpeciesId.BIBAREL ]}, { 1: [ SpeciesId.LECHONK ], 18: [ SpeciesId.OINKOLOGNE ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [
        { 1: [ SpeciesId.DODUO ], 31: [ SpeciesId.DODRIO ]},
        { 1: [ SpeciesId.POOCHYENA ], 18: [ SpeciesId.MIGHTYENA ]},
        { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]},
        { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUILL ], 32: [ SpeciesId.UNFEZANT ]},
        { 1: [ SpeciesId.PAWMI ], 18: [ SpeciesId.PAWMO ], 32: [ SpeciesId.PAWMOT ]}
      ],
      [TimeOfDay.DAY]: [
        { 1: [ SpeciesId.DODUO ], 31: [ SpeciesId.DODRIO ]},
        { 1: [ SpeciesId.POOCHYENA ], 18: [ SpeciesId.MIGHTYENA ]},
        { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]},
        { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUILL ], 32: [ SpeciesId.UNFEZANT ]},
        { 1: [ SpeciesId.ROCKRUFF ], 25: [ SpeciesId.LYCANROC ]},
        { 1: [ SpeciesId.PAWMI ], 18: [ SpeciesId.PAWMO ], 32: [ SpeciesId.PAWMOT ]}
      ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.MANKEY ], 28: [ SpeciesId.PRIMEAPE ], 75: [ SpeciesId.ANNIHILAPE ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.MANKEY ], 28: [ SpeciesId.PRIMEAPE ], 75: [ SpeciesId.ANNIHILAPE ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]},
        { 1: [ SpeciesId.SPEAROW ], 20: [ SpeciesId.FEAROW ]},
        SpeciesId.PIKACHU,
        { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]}
      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [ SpeciesId.PALDEA_TAUROS ],
      [TimeOfDay.DAY]: [ SpeciesId.PALDEA_TAUROS ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.SHINX ], 15: [ SpeciesId.LUXIO ], 30: [ SpeciesId.LUXRAY ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.SHINX ], 15: [ SpeciesId.LUXIO ], 30: [ SpeciesId.LUXRAY ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ABRA ], 16: [ SpeciesId.KADABRA ]}, { 1: [ SpeciesId.BUNEARY ], 20: [ SpeciesId.LOPUNNY ]}, { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNIGHT ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.FARFETCHD, SpeciesId.LICKITUNG, SpeciesId.CHANSEY, SpeciesId.EEVEE, { 1: [ SpeciesId.MUNCHLAX ], 35: [ SpeciesId.SNORLAX ]}, { 1: [ SpeciesId.DUNSPARCE ], 62: [ SpeciesId.DUDUNSPARCE ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DITTO, SpeciesId.LATIAS, SpeciesId.LATIOS ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.DODRIO, SpeciesId.FURRET, SpeciesId.GUMSHOOS, SpeciesId.GREEDENT ],
      [TimeOfDay.DAY]: [ SpeciesId.DODRIO, SpeciesId.FURRET, SpeciesId.GUMSHOOS, SpeciesId.GREEDENT ],
      [TimeOfDay.DUSK]: [ SpeciesId.PERSIAN, SpeciesId.MIGHTYENA ],
      [TimeOfDay.NIGHT]: [ SpeciesId.PERSIAN, SpeciesId.MIGHTYENA ],
      [TimeOfDay.ALL]: [ SpeciesId.LINOONE, SpeciesId.BIBAREL, SpeciesId.LOPUNNY, SpeciesId.OINKOLOGNE ]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [ SpeciesId.PAWMOT, SpeciesId.PALDEA_TAUROS ],
      [TimeOfDay.DAY]: [ SpeciesId.LYCANROC, SpeciesId.PAWMOT, SpeciesId.PALDEA_TAUROS ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.FARFETCHD, { 1: [ SpeciesId.MUNCHLAX ], 35: [ SpeciesId.SNORLAX ]}, SpeciesId.LICKILICKY, SpeciesId.DUDUNSPARCE ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.LATIAS, SpeciesId.LATIOS ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.GRASS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.HOPPIP ], 18: [ SpeciesId.SKIPLOOM ]}, SpeciesId.SUNKERN, SpeciesId.COTTONEE, SpeciesId.PETILIL ],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.HOPPIP ], 18: [ SpeciesId.SKIPLOOM ]}, SpeciesId.SUNKERN, SpeciesId.COTTONEE, SpeciesId.PETILIL ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ]}, { 1: [ SpeciesId.SHROOMISH ], 23: [ SpeciesId.BRELOOM ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ]}, { 1: [ SpeciesId.SHROOMISH ], 23: [ SpeciesId.BRELOOM ]}],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.COMBEE ], 21: [ SpeciesId.VESPIQUEN ]}, { 1: [ SpeciesId.CHERUBI ], 25: [ SpeciesId.CHERRIM ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.COMBEE ], 21: [ SpeciesId.VESPIQUEN ]}, { 1: [ SpeciesId.CHERUBI ], 25: [ SpeciesId.CHERRIM ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.FOONGUS ], 39: [ SpeciesId.AMOONGUSS ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.FOONGUS ], 39: [ SpeciesId.AMOONGUSS ]}],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BULBASAUR ], 16: [ SpeciesId.IVYSAUR ], 32: [ SpeciesId.VENUSAUR ]}, SpeciesId.GROWLITHE, { 1: [ SpeciesId.TURTWIG ], 18: [ SpeciesId.GROTLE ], 32: [ SpeciesId.TORTERRA ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{1: [ SpeciesId.BONSLY ], 20: [ SpeciesId.SUDOWOODO ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VIRIZION ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [ SpeciesId.JUMPLUFF, SpeciesId.SUNFLORA, SpeciesId.WHIMSICOTT ], [TimeOfDay.DAY]: [ SpeciesId.JUMPLUFF, SpeciesId.SUNFLORA, SpeciesId.WHIMSICOTT ], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VENUSAUR, { 1: [ SpeciesId.BONSLY ], 20: [ SpeciesId.SUDOWOODO ]}, SpeciesId.TORTERRA ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VIRIZION ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_LEAVES ]}
  },
  [BiomeId.TALL_GRASS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.BOUNSWEET ], 18: [ SpeciesId.STEENEE ], 58: [ SpeciesId.TSAREENA ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ]}, { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ]}, { 1: [ SpeciesId.BOUNSWEET ], 18: [ SpeciesId.STEENEE ], 58: [ SpeciesId.TSAREENA ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.ODDISH ], 21: [ SpeciesId.GLOOM ]}, { 1: [ SpeciesId.KRICKETOT ], 10: [ SpeciesId.KRICKETUNE ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.ODDISH ], 21: [ SpeciesId.GLOOM ]}, { 1: [ SpeciesId.KRICKETOT ], 10: [ SpeciesId.KRICKETUNE ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.NINCADA ], 20: [ SpeciesId.NINJASK ]}, { 1: [ SpeciesId.FOMANTIS ], 44: [ SpeciesId.LURANTIS ]}, { 1: [ SpeciesId.NYMBLE ], 24: [ SpeciesId.LOKIX ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.PARAS ], 24: [ SpeciesId.PARASECT ]}, { 1: [ SpeciesId.VENONAT ], 31: [ SpeciesId.VENOMOTH ]}, { 1: [ SpeciesId.SPINARAK ], 22: [ SpeciesId.ARIADOS ]}],
      [TimeOfDay.ALL]: [ SpeciesId.VULPIX ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.PINSIR, { 1: [ SpeciesId.CHIKORITA ], 16: [ SpeciesId.BAYLEEF ], 32: [ SpeciesId.MEGANIUM ]}, { 1: [ SpeciesId.GIRAFARIG ], 62: [ SpeciesId.FARIGIRAF ]}, SpeciesId.ZANGOOSE, SpeciesId.KECLEON, SpeciesId.TROPIUS ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SCYTHER, SpeciesId.SHEDINJA, SpeciesId.ROTOM ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.TSAREENA ],
      [TimeOfDay.DAY]: [ SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.TSAREENA ],
      [TimeOfDay.DUSK]: [ SpeciesId.VILEPLUME, SpeciesId.KRICKETUNE ],
      [TimeOfDay.NIGHT]: [ SpeciesId.VILEPLUME, SpeciesId.KRICKETUNE ],
      [TimeOfDay.ALL]: [ SpeciesId.NINJASK, SpeciesId.ZANGOOSE, SpeciesId.KECLEON, SpeciesId.LURANTIS, SpeciesId.LOKIX ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [ SpeciesId.BELLOSSOM ], [TimeOfDay.DAY]: [ SpeciesId.BELLOSSOM ], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.PINSIR, SpeciesId.MEGANIUM, SpeciesId.FARIGIRAF, SpeciesId.ROTOM ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_LEAVES  ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.GRASS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.HOPPIP ], 18: [ SpeciesId.SKIPLOOM ]}, SpeciesId.SUNKERN, SpeciesId.COTTONEE, SpeciesId.PETILIL ],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.HOPPIP ], 18: [ SpeciesId.SKIPLOOM ]}, SpeciesId.SUNKERN, SpeciesId.COTTONEE, SpeciesId.PETILIL ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ]}, { 1: [ SpeciesId.SHROOMISH ], 23: [ SpeciesId.BRELOOM ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ]}, { 1: [ SpeciesId.SHROOMISH ], 23: [ SpeciesId.BRELOOM ]}],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.COMBEE ], 21: [ SpeciesId.VESPIQUEN ]}, { 1: [ SpeciesId.CHERUBI ], 25: [ SpeciesId.CHERRIM ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.COMBEE ], 21: [ SpeciesId.VESPIQUEN ]}, { 1: [ SpeciesId.CHERUBI ], 25: [ SpeciesId.CHERRIM ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.FOONGUS ], 39: [ SpeciesId.AMOONGUSS ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.FOONGUS ], 39: [ SpeciesId.AMOONGUSS ]}],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BULBASAUR ], 16: [ SpeciesId.IVYSAUR ], 32: [ SpeciesId.VENUSAUR ]}, SpeciesId.GROWLITHE, { 1: [ SpeciesId.TURTWIG ], 18: [ SpeciesId.GROTLE ], 32: [ SpeciesId.TORTERRA ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{1: [ SpeciesId.BONSLY ], 20: [ SpeciesId.SUDOWOODO ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VIRIZION ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [ SpeciesId.JUMPLUFF, SpeciesId.SUNFLORA, SpeciesId.WHIMSICOTT ], [TimeOfDay.DAY]: [ SpeciesId.JUMPLUFF, SpeciesId.SUNFLORA, SpeciesId.WHIMSICOTT ], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VENUSAUR, { 1: [ SpeciesId.BONSLY ], 20: [ SpeciesId.SUDOWOODO ]}, SpeciesId.TORTERRA ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VIRIZION ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.GREEN_MOUNTAIN]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BOUNSWEET ], 18: [ SpeciesId.STEENEE ], 58: [ SpeciesId.TSAREENA ]}, { 1: [ SpeciesId.NINCADA ], 20: [ SpeciesId.NINJASK ]}, { 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ]}, { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ]}, { 1: [ SpeciesId.FOMANTIS ], 44: [ SpeciesId.LURANTIS ]}, { 1: [ SpeciesId.NYMBLE ], 24: [ SpeciesId.LOKIX ]}, { 1: [ SpeciesId.ODDISH ], 21: [ SpeciesId.GLOOM ]}, { 1: [ SpeciesId.KRICKETOT ], 10: [ SpeciesId.KRICKETUNE ]}, { 1: [ SpeciesId.LITLEO ], 35: [ SpeciesId.PYROAR ]}, { 1: [ SpeciesId.SENTRET ], 15: [ SpeciesId.FURRET ]}, { 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]}, { 1: [ SpeciesId.SPEAROW ], 20: [ SpeciesId.FEAROW ]}, { 1: [ SpeciesId.BELLSPROUT ], 21: [ SpeciesId.WEEPRNBELL ], 36: [ SpeciesId.VICTREEBEL ]}, { 1: [ SpeciesId.HOPPIP ], 18: [ SpeciesId.SKIPLOOM ], 27: [ SpeciesId.JUMPLUFF ]}, { 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.WORMADAM ]}, { 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.MOTHIM ]}, { 1: [ SpeciesId.COMBEE ], 21: [ SpeciesId.VESPIQUEN ]}, { 1: [ SpeciesId.SCATTERBUG ], 9: [ SpeciesId.SPEWPA ], 12: [ SpeciesId.VIVILON ]}, { 1: [ SpeciesId.CATERPIE ], 7: [ SpeciesId.METAPOD ], 10: [ SpeciesId.BUTTERFREE ]}, { 1: [ SpeciesId.WEEDLE ], 7: [ SpeciesId.KAKUNA ], 10: [ SpeciesId.BEEDRILL ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.SILCOON ], 10: [ SpeciesId.BEAUTIFLY ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.CASCOON ], 10: [ SpeciesId.DUSTOX ]}, { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.HOOTHOOT ], 20: [ SpeciesId.NOCTOWL ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.PHANTUMP ], 35: [ SpeciesId.TREVENANT ]}],
      [TimeOfDay.ALL]: [ SpeciesId.VULPIX, { 1: [ SpeciesId.TANGELA ], 38: [ SpeciesId.TANGROWTH ]}, { 1: [ SpeciesId.PARAS ], 24: [ SpeciesId.PARASECT ]}, { 1: [ SpeciesId.VENONAT ], 31: [ SpeciesId.VENOMOTH ]}, { 1: [ SpeciesId.SPINARAK ], 22: [ SpeciesId.ARIADOS ]}, { 1: [ SpeciesId.LEDYBA ], 18: [ SpeciesId.LEDIAN ]}, { 1: [ SpeciesId.PINECO ], 31: [ SpeciesId.FORRETRESS ]}, { 1: [ SpeciesId.SHROOMISH ], 23: [ SpeciesId.BRELOOM ]}, { 1: [ SpeciesId.CHERUBI ], 25: [ SpeciesId.CHERRIM ]}, { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUIL ], 32: [ SpeciesId.UNFEAZANT ]}, { 1: [ SpeciesId.DEERLING ], 34: [ SpeciesId.SAWSBUCK ]}, { 1: [ SpeciesId.FOONGUS ], 39: [ SpeciesId.AMOONGUSS ]}, { 1: [ SpeciesId.CUTIEFLY ], 25: [ SpeciesId.RIBOMBEE ]}, { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]}, { 1: [ SpeciesId.SHINX ], 15: [ SpeciesId.LUXIO ], 30: [ SpeciesId.LUXRAY ]}, { 1: [ SpeciesId.SKIDDO ], 32: [ SpeciesId.GOGOAT ]}, { 1: [ SpeciesId.SEWADDLE ], 20: [ SpeciesId.SWADLOON ], 30: [ SpeciesId.LEAVANNY ]}, { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}, { 1: [ SpeciesId.COTTONEE ], 25: [ SpeciesId.WHIMSICOTT ]}, { 1: [ SpeciesId.PETILIL ], 25: [ SpeciesId.LILLIGANT ]}]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.PINSIR, SpeciesId.HERACROSS, SpeciesId.EMOLGA, SpeciesId.PACHIRISU, { 1: [ SpeciesId.SNIVY ], 17: [ SpeciesId.SERVINE ], 36: [ SpeciesId.SERPERIOR ]}, { 1: [ SpeciesId.BONSLY ], 15: [ SpeciesId.SUDOWOODO ]}, SpeciesId.ZANGOOSE, SpeciesId.KECLEON, SpeciesId.TROPIUS, { 1: [ SpeciesId.YANMA ], 33: [ SpeciesId.YANMEGA ]}, { 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ], 32: [ SpeciesId.SHIFTRY ]}, { 1: [ SpeciesId.TAILLOW ], 22: [ SpeciesId.SWELLOW ]}, SpeciesId.CHATOT, SpeciesId.CARNIVINE, { 1: [ SpeciesId.PANSAGE ], 22: [ SpeciesId.SIMISAGE ]}, SpeciesId.DURANT, { 1: [ SpeciesId.GRUBBIN ], 20: [ SpeciesId.CHARJABUG ], 32: [ SpeciesId.VIKAVOLT ]}, { 1: [ SpeciesId.TOEDSCOOL ], 30: [ SpeciesId.TOEDSCRUEL ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SCYTHER ], 30: [ SpeciesId.SCIZOR ]}, { 1: [ SpeciesId.SCYTHER ], 30: [ SpeciesId.KLEAVOR ]}, SpeciesId.SHEDINJA, { 1: [ SpeciesId.SWINUB ], 33: [ SpeciesId.PILOSWINE ], 45: [ SpeciesId.MOMOSWINE ]}, { 1: [ SpeciesId.KARRABLAST ], 35: [ SpeciesId.ESCAVALIER ]}, { 1: [ SpeciesId.SHELMET ], 35: [ SpeciesId.ACCELGOR ]}, { 1: [ SpeciesId.FERROSEED ], 40: [ SpeciesId.FERROTHORN ]}, { 1: [ SpeciesId.APPLIN ], 34: [ SpeciesId.FLAPPLE ]}, { 1: [ SpeciesId.APPLIN ], 34: [ SpeciesId.APPLETUN ]}, { 1: [ SpeciesId.APPLIN ], 34: [ SpeciesId.DIPPLIN ], 45: [ SpeciesId.HYDRAPPLE ]}, { 1: [ SpeciesId.SLAKOTH ], 18: [ SpeciesId.VIGOROTH ], 36: [ SpeciesId.SLAKING ]}, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ], 45: [ SpeciesId.URSALUNA ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.WO_CHIEN ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ SpeciesId.NOCTOWL, SpeciesId.TREVENANT ],
      [TimeOfDay.ALL]: [ SpeciesId.TSAREENA, SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.TSAREENA, SpeciesId.VILEPLUME, SpeciesId.KRICKETUNE, SpeciesId.NINJASK, SpeciesId.ZANGOOSE, SpeciesId.KECLEON, SpeciesId.LURANTIS, SpeciesId.LOKIX, SpeciesId.PYROAR, SpeciesId.LEDIAN, SpeciesId.FURRET, SpeciesId.PIDGEOT, SpeciesId.VICTREEBEL, SpeciesId.FEAROW, SpeciesId.JUMPLUFF, SpeciesId.WORMADAM, SpeciesId.MOTHIM, SpeciesId.VESPIQUEN, SpeciesId.VIVILON, SpeciesId.BUTTERFREE, SpeciesId.BEEDRILL, SpeciesId.BEAUTIFLY, SpeciesId.DUSTOX, SpeciesId.STARAPTOR, SpeciesId.TANGROWTH, SpeciesId.PARASECT, SpeciesId.VENOMOTH, SpeciesId.ARIADOS, SpeciesId.FORRETRESS, SpeciesId.BRELOOM, SpeciesId.CHERRIM, SpeciesId.UNFEAZANT, SpeciesId.SAWSBUCK, SpeciesId.AMOONGUSS, SpeciesId.RIBOMBEE, SpeciesId.TALONFLAME, SpeciesId.LUXRAY, SpeciesId.GOGOAT ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.BELLOSSOM, SpeciesId.PINSIR, SpeciesId.HERACROSS, SpeciesId.EMOLGA, SpeciesId.PACHIRISU, SpeciesId.SERPERIOR, SpeciesId.SUDOWOODO, SpeciesId.ZANGOOSE, SpeciesId.KECLEON, SpeciesId.TROPIUS, SpeciesId.YANMEGA, SpeciesId.SHIFTRY, SpeciesId.SWELLOW,  SpeciesId.CHATOT, SpeciesId.CARNIVINE, SpeciesId.SIMISAGE, SpeciesId.LEAVANNY, SpeciesId.SCOLIPEDE, SpeciesId.WHIMSICOTT, SpeciesId.LILLIGANT, SpeciesId.DURANT, SpeciesId.VIKAVOLT, SpeciesId.TOEDSCRUEL, SpeciesId.SCIZOR, SpeciesId.KLEAVOR, SpeciesId.SHEDINJA, SpeciesId.MOMOSWINE, SpeciesId.ESCAVALIER, SpeciesId.ACCELGOR, SpeciesId.FERROTHORN, SpeciesId.FLAPPLE, SpeciesId.APPLETUN, SpeciesId.HYDRAPPLE, SpeciesId.SLAKING, SpeciesId.URSALUNA ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.WO_CHIEN ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.SKY]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.NINCADA ], 20: [ SpeciesId.NINJASK ]}, SpeciesId.FARFETCHD, { 1: [ SpeciesId.DODUO ], 31: [ SpeciesId.DODRIO ]}, { 1: [ SpeciesId.MISDREAVUS ], 30: [ SpeciesId.MISMAGIUS ]}, { 1: [ SpeciesId.NATU ], 24: [ SpeciesId.XATU ]}, { 1: [ SpeciesId.WINGULL ], 25: [ SpeciesId.PELIPPER ]}, { 1: [ SpeciesId.SURSKIT ], 22: [ SpeciesId.MASQUERAIN ]}, { 1: [ SpeciesId.KOFFING ], 35: [ SpeciesId.WEEZING ]}, { 1: [ SpeciesId.KOFFING ], 35: [ SpeciesId.GALAR_WEEZING ]}, { 1: [ SpeciesId.TAILLOW ], 22: [ SpeciesId.SWELLOW ]}, { 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]}, { 1: [ SpeciesId.SPEAROW ], 20: [ SpeciesId.FEAROW ]}, { 1: [ SpeciesId.BALTOY ], 36: [ SpeciesId.CLAYDOL ]}, { 1: [ SpeciesId.HOPPIP ], 18: [ SpeciesId.SKIPLOOM ], 27: [ SpeciesId.JUMPLUFF ]}, { 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.WORMADAM ]}, { 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.MOTHIM ]}, { 1: [ SpeciesId.COMBEE ], 21: [ SpeciesId.VESPIQUEN ]}, { 1: [ SpeciesId.SCATTERBUG ], 9: [ SpeciesId.SPEWPA ], 12: [ SpeciesId.VIVILON ]}, { 1: [ SpeciesId.CATERPIE ], 7: [ SpeciesId.METAPOD ], 10: [ SpeciesId.BUTTERFREE ]}, { 1: [ SpeciesId.WEEDLE ], 7: [ SpeciesId.KAKUNA ], 10: [ SpeciesId.BEEDRILL ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.SILCOON ], 10: [ SpeciesId.BEAUTIFLY ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.CASCOON ], 10: [ SpeciesId.DUSTOX ]}, { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]}, { 1: [ SpeciesId.PIKIPEK ], 14: [ SpeciesId.TRUMBEAK ], 28: [ SpeciesId.TOUCANNON ]}, SpeciesId.ORIOCORIO, { 1: [ SpeciesId.TRAPIMCH ], 35: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.ZUBAT ], 22: [ SpeciesId.GOLBAT ], 35: [ SpeciesId.CROBAT ]}, { 1: [ SpeciesId.HOOTHOOT ], 20: [ SpeciesId.NOCTOWL ]}, { 1: [ SpeciesId.WOOBAT ], 22: [ SpeciesId.SWOOBAT ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.AERODACTYL, { 1: [ SpeciesId.GLIGAR ], 35: [ SpeciesId.GLISCOR ]}, { 1: [ SpeciesId.MANTYKE ], 24: [ SpeciesId.MANTINE ]}, { 1: [ SpeciesId.VENONAT ], 31: [ SpeciesId.VENOMOTH ]}, SpeciesId.SKARMORY, SpeciesId.DELIBIRD, { 1: [ SpeciesId.LEDYBA ], 18: [ SpeciesId.LEDIAN ]}, { 1: [ SpeciesId.MURKROW ], 31: [ SpeciesId.HONCHKROW ]}, { 1: [ SpeciesId.SWABLU ], 35: [ SpeciesId.ALTARIA ]}, SpeciesId.LUNATONE, SpeciesId.SOLROCK, { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUIL ], 32: [ SpeciesId.UNFEAZANT ]}, { 1: [ SpeciesId.BALTOY ], 36: [ SpeciesId.CLAYDOL ]}, { 1: [ SpeciesId.SHUPPET ], 37: [ SpeciesId.BANETTE ]}, { 1: [ SpeciesId.CUTIEFLY ], 25: [ SpeciesId.RIBOMBEE ]}, { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]}, { 1: [ SpeciesId.DUSKULL ], 37: [ SpeciesId.DUSCLOPS ], 45: [ SpeciesId.DUSKNOIR ]}, { 1: [ SpeciesId.DRIFLOON ], 28: [ SpeciesId.DRIFBLIM ]}, { 1: [ SpeciesId.TOGEPI ], 16: [ SpeciesId.TOGETIC ], 34: [ SpeciesId.TOGEKISS ]}, { 1: [ SpeciesId.COTTONEE ], 25: [ SpeciesId.WHIMSICOTT ]}, SpeciesId.CHATOT, SpeciesId.SIGILYPH, { 1: [ SpeciesId.DUCKLETT ], 35: [ SpeciesId.SWANNA ]}, { 1: [ SpeciesId.RUFFLET ], 54: [ SpeciesId.BRAVIARY ]}, { 1: [ SpeciesId.RUFFLET ], 54: [ SpeciesId.HISUI_BRAVIARY ]}, { 1: [ SpeciesId.VULLABY ], 54: [ SpeciesId.MANDIBUZZ ]}]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.PINSIR, SpeciesId.HERACROSS, SpeciesId.EMOLGA, SpeciesId.MINIOR, { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNIGHT ]}, { 1: [ SpeciesId.WATTREL ], 25: [ SpeciesId.KILOWATTREL ]}, SpeciesId.FLAMIGO, SpeciesId.SQUAWKABILLY, SpeciesId.TROPIUS, { 1: [ SpeciesId.YANMA ], 33: [ SpeciesId.YANMEGA ]}, SpeciesId.CRAMORANT, { 1: [ SpeciesId.ARCHEN ], 37: [ SpeciesId.ARCHEOPS ]}, SpeciesId.BOMBIRDIER, SpeciesId.CARNIVINE, { 1: [ SpeciesId.GOLETT ], 43: [ SpeciesId.GOLURK ]}, SpeciesId.HAWLUCHA, { 1: [ SpeciesId.GRUBBIN ], 20: [ SpeciesId.CHARJABUG ], 32: [ SpeciesId.VIKAVOLT ]}, { 1: [ SpeciesId.NOIBAT ], 48: [ SpeciesId.NOIVERN ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SCYTHER ], 30: [ SpeciesId.SCIZOR ]}, { 1: [ SpeciesId.SCYTHER ], 30: [ SpeciesId.KLEAVOR ]}, SpeciesId.SHEDINJA, { 1: [ SpeciesId.GASTLY ], 25: [ SpeciesId.HAUNTER ], 35: [ SpeciesId.GENGAR ]}, { 1: [ SpeciesId.BRONZOR ], 33: [ SpeciesId.BRONZONG ]}, { 1: [ SpeciesId.PORYGON ], 35: [ SpeciesId.PORYGON2 ], 45: [ SpeciesId.PORYGON_Z ]}, { 1: [ SpeciesId.SOLOSIS ], 32: [ SpeciesId.DUOSION ], 41: [ SpeciesId.REUNICLUS ]}, { 1: [ SpeciesId.TYNAMO ], 39: [ SpeciesId.EELEKTRIK ], 45: [ SpeciesId.EELEKTROSS ]}, { 1: [ SpeciesId.ELGYEM ], 42: [ SpeciesId.BEHEEYEM ]}, { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ], 45: [ SpeciesId.CHANDELURE ]}, { 1: [ SpeciesId.DRATINI ], 30: [ SpeciesId.DRAGONAIR ], 55: [ SpeciesId.DRAGONITE ]}, { 1: [ SpeciesId.BAGON ], 30: [ SpeciesId.SHELGON ], 55: [ SpeciesId.SALAMENCE ]}, { 1: [ SpeciesId.BELDUM ], 20: [ SpeciesId.METANG ], 45: [ SpeciesId.METAGROSS ]}, { 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]}, { 1: [ SpeciesId.DREEPY ], 50: [ SpeciesId.DRAKLOAK ], 60: [ SpeciesId.DRAGAPULT ]}, { 1: [ SpeciesId.LARVESTA ], 59: [ SpeciesId.VOLCARONA ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TORNADUS ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ SpeciesId.NOCTOWL, SpeciesId.CROBAT, SpeciesId.SWOOBAT ],
      [TimeOfDay.ALL]: [ SpeciesId.NINJASK, SpeciesId.FARFETCHD, SpeciesId.DODRIO, SpeciesId.MISMAGIUS, SpeciesId.XATU, SpeciesId.PELIPPER, SpeciesId.MASQUERAIN, SpeciesId.WEEZING, SpeciesId.GALAR_WEEZING, SpeciesId.SWELLOW, SpeciesId.CLAYDOL, SpeciesId.TOUCANNON, SpeciesId.LEDIAN, SpeciesId.ORIOCORIO, SpeciesId.PIDGEOT, SpeciesId.AERODACTYL, SpeciesId.FEAROW, SpeciesId.JUMPLUFF, SpeciesId.WORMADAM, SpeciesId.MOTHIM, SpeciesId.VESPIQUEN, SpeciesId.VIVILON, SpeciesId.BUTTERFREE, SpeciesId.BEEDRILL, SpeciesId.BEAUTIFLY, SpeciesId.DUSTOX, SpeciesId.STARAPTOR, SpeciesId.GLISCOR, SpeciesId.MANTINE, SpeciesId.VENOMOTH, SpeciesId.SKARMORY, SpeciesId.DELIBIRD, SpeciesId.HONCHKROW, SpeciesId.ALTARIA, SpeciesId.LUNATONE, SpeciesId.SOLROCK, SpeciesId.UNFEAZANT, SpeciesId.CLAYDOL, SpeciesId.BANETTE, SpeciesId.RIBOMBEE, SpeciesId.TALONFLAME, SpeciesId.DUSKNOIR, SpeciesId.DRIFBLIM, SpeciesId.TOGEKISS, SpeciesId.WHIMSICOTT, SpeciesId.CHATOT, SpeciesId.SIGILYPH, SpeciesId.SWANNA, SpeciesId.BRAIVIARY, SpeciesId.HISUI_BRAVIARY, SpeciesId.MANDIBUZZ ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.BELLOSSOM, SpeciesId.PINSIR, SpeciesId.HERACROSS, SpeciesId.EMOLGA, SpeciesId.MINIOR, SpeciesId.CORVIKNIGHT, SpeciesId.KILOWATTREL, SpeciesId.FLAMIGO, SpeciesId.SQUAWKABILLY, SpeciesId.TROPIUS, SpeciesId.YANMEGA, SpeciesId.CRAMORANT, SpeciesId.ARCHEOPS,  SpeciesId.BOMBIRDIER, SpeciesId.CARNIVINE, SpeciesId.GOLURK, SpeciesId.HAWLUCHA, SpeciesId.NOIVERN, SpeciesId.WHIMSICOTT, SpeciesId.GENGAR, SpeciesId.BRONZONG, SpeciesId.VIKAVOLT, SpeciesId.PORYGON_Z, SpeciesId.SCIZOR, SpeciesId.KLEAVOR, SpeciesId.SHEDINJA, SpeciesId.BEHEEYEM, SpeciesId.CHANDELURE, SpeciesId.DRAGONITE, SpeciesId.REUNICLUS, SpeciesId.EELEKTROSS, SpeciesId.SALAMENCE, SpeciesId.METAGROSS, SpeciesId.HYDREIGON, SpeciesId.DRAGAPULT, SpeciesId.VOLCARONA ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TORNADUS ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.RAYQUAZA ]}
  },
  [BiomeId.LOG_CAVE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ZUBAT ], 22: [ SpeciesId.GOLBAT ], 35: [ SpeciesId.CROBAT ]}, { 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]}, { 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ]}, { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ]}, { 1: [ SpeciesId.DIGLETT ], 26: [ SpeciesId.DUGTRIO ]}, { 1: [ SpeciesId.NYMBLE ], 24: [ SpeciesId.LOKIX ]}, { 1: [ SpeciesId.ODDISH ], 21: [ SpeciesId.GLOOM ]}, { 1: [ SpeciesId.KRICKETOT ], 10: [ SpeciesId.KRICKETUNE ]}, { 1: [ SpeciesId.MISDREAVUS ], 35: [ SpeciesId.MISMAGIUS ]}, { 1: [ SpeciesId.ALOLA_RATTATA ], 20: [ SpeciesId.ALOLA_RATICATE ]}, { 1: [ SpeciesId.WHISMUR ], 20: [ SpeciesId.LOUDRED ], 40: [ SpeciesId.EXPLOUD ]}, { 1: [ SpeciesId.WOOBAT ], 20: [ SpeciesId.SWOOBAT ]}, { 1: [ SpeciesId.BELLSPROUT ], 21: [ SpeciesId.WEEPRNBELL ], 36: [ SpeciesId.VICTREEBEL ]}, { 1: [ SpeciesId.SOLOSIS ], 32: [ SpeciesId.DUOSION ], 41: [ SpeciesId.REUNICLUS ]}, { 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.WORMADAM ]}, { 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.MOTHIM ]}, { 1: [ SpeciesId.COMBEE ], 21: [ SpeciesId.VESPIQUEN ]}, { 1: [ SpeciesId.BLIPBUG ], 10: [ SpeciesId.DOTTLER ], 30: [ SpeciesId.ORBEETLE ]}, { 1: [ SpeciesId.SIZZLIPEDE ], 28: [ SpeciesId.CENTISKORCH ]}, { 1: [ SpeciesId.WEEDLE ], 7: [ SpeciesId.KAKUNA ], 10: [ SpeciesId.BEEDRILL ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.SILCOON ], 10: [ SpeciesId.BEAUTIFLY ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.CASCOON ], 10: [ SpeciesId.DUSTOX ]}, { 1: [ SpeciesId.GALAR_ZIGZAGOON ], 20: [ SpeciesId.GALAR_LINOONE ], 35: [ SpeciesId.OBSTAGOON ]}],
      [TimeOfDay.NIGHT]: []
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ { 1: [ SpeciesId.PHANTUMP ], 35: [ SpeciesId.TREVENANT ]}, { 1: [ SpeciesId.TANGELA ], 38: [ SpeciesId.TANGROWTH ]}, { 1: [ SpeciesId.PARAS ], 24: [ SpeciesId.PARASECT ]}, { 1: [ SpeciesId.VENONAT ], 31: [ SpeciesId.VENOMOTH ]}, { 1: [ SpeciesId.SPINARAK ], 22: [ SpeciesId.ARIADOS ]}, { 1: [ SpeciesId.LEDYBA ], 18: [ SpeciesId.LEDIAN ]}, { 1: [ SpeciesId.PINECO ], 31: [ SpeciesId.FORRETRESS ]}, { 1: [ SpeciesId.SHROOMISH ], 23: [ SpeciesId.BRELOOM ]}, SpeciesId.SABLEYE, SpeciesId.MAWILE, { 1: [ SpeciesId.IMPIDIMP ], 32: [ SpeciesId.MORGREM ], 42: [ SpeciesId.GRIMMSNARL ]}, { 1: [ SpeciesId.MEDITITE ], 37: [ SpeciesId.MEDICHAM ]}, { 1: [ SpeciesId.FOONGUS ], 39: [ SpeciesId.AMOONGUSS ]}, { 1: [ SpeciesId.GULPIN ], 26: [ SpeciesId.SWALOT ]}, { 1: [ SpeciesId.TRAPINCH ], 35: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]}, { 1: [ SpeciesId.DUSKULL ], 37: [ SpeciesId.DUSCLOPS ], 48: [ SpeciesId.DUSKNOIR ]}, { 1: [ SpeciesId.SHUPPET ], 37: [ SpeciesId.BANETTE ]}, { 1: [ SpeciesId.SEWADDLE ], 20: [ SpeciesId.SWADLOON ], 30: [ SpeciesId.LEAVANNY ]}, { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}, { 1: [ SpeciesId.STUNKY ], 34: [ SpeciesId.SKUNTANK ]}, { 1: [ SpeciesId.SKORUPI ], 40: [ SpeciesId.DRAPION ]}]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.PINSIR, SpeciesId.HERACROSS, SpeciesId.THROH, SpeciesId.SAWK, { 1: [ SpeciesId.TIMBURR ], 25: [ SpeciesId.GURDURR ], 36: [ SpeciesId.CONKELDURR ]}, { 1: [ SpeciesId.BONSLY ], 15: [ SpeciesId.SUDOWOODO ]}, SpeciesId.ZANGOOSE, SpeciesId.KECLEON, SpeciesId.SEVIPER, { 1: [ SpeciesId.TAROUNTULA ], 15: [ SpeciesId.SPIDOPS ]}, { 1: [ SpeciesId.TINKATINK ], 24: [ SpeciesId.TINKATUFF ], 38: [ SpeciesId.TINKATON ]}, { 1: [ SpeciesId.JOLTIK ], 37: [ SpeciesId.GALVANTULA ]}, SpeciesId.DRUDDIGON, SpeciesId.CARNIVINE, SpeciesId.ORTHWORM, SpeciesId.DURANT, { 1: [ SpeciesId.GRUBBIN ], 20: [ SpeciesId.CHARJABUG ], 32: [ SpeciesId.VIKAVOLT ]}, { 1: [ SpeciesId.TOEDSCOOL ], 30: [ SpeciesId.TOEDSCRUEL ]}, { 1: [ SpeciesId.SALANDIT ], 37: [ SpeciesId.SALAZZLE ]}, { 1: [ SpeciesId.DRILBUR ], 31: [ SpeciesId.EXCADRILL ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SCYTHER ], 30: [ SpeciesId.SCIZOR ]}, { 1: [ SpeciesId.SCYTHER ], 30: [ SpeciesId.KLEAVOR ]}, { 1: [ SpeciesId.SWINUB ], 33: [ SpeciesId.PILOSWINE ], 45: [ SpeciesId.MOMOSWINE ]}, { 1: [ SpeciesId.KARRABLAST ], 35: [ SpeciesId.ESCAVALIER ]}, { 1: [ SpeciesId.SHELMET ], 35: [ SpeciesId.ACCELGOR ]}, { 1: [ SpeciesId.FERROSEED ], 40: [ SpeciesId.FERROTHORN ]}, { 1: [ SpeciesId.GLIMMET ], 35: [ SpeciesId.GLIMMORA ]}, { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.HISUI_SLIGGOO ], 50: [ SpeciesId.HISUI_GOODRA ]}, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ], 45: [ SpeciesId.URSALUNA ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.BUZZWOLE ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.CROBAT, SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.DUGTRIO, SpeciesId.VILEPLUME, SpeciesId.KRICKETUNE, SpeciesId.MISMAGIUS, SpeciesId.ZANGOOSE, SpeciesId.KECLEON, SpeciesId.EXPLOUD, SpeciesId.LOKIX, SpeciesId.PYROAR, SpeciesId.LEDIAN, SpeciesId.ALOLA_RATICATE, SpeciesId.SWOOBAT, SpeciesId.VICTREEBEL, SpeciesId.ORBEETLE, SpeciesId.REUNICLUS, SpeciesId.WORMADAM, SpeciesId.MOTHIM, SpeciesId.VESPIQUEN, SpeciesId.CENTISKORCH, SpeciesId.OBSTAGOON, SpeciesId.BEEDRILL, SpeciesId.BEAUTIFLY, SpeciesId.DUSTOX, SpeciesId.GRIMMSNARL, SpeciesId.TANGROWTH, SpeciesId.PARASECT, SpeciesId.VENOMOTH, SpeciesId.ARIADOS, SpeciesId.FORRETRESS, SpeciesId.BRELOOM, SpeciesId.MEDICHAM, SpeciesId.SWALOT, SpeciesId.FLYGON, SpeciesId.AMOONGUSS, SpeciesId.DUSKNOIR, SpeciesId.SKUNTANK, SpeciesId.DRAPION, SpeciesId.BANETTE ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.BELLOSSOM, SpeciesId.PINSIR, SpeciesId.HERACROSS, SpeciesId.THROH, SpeciesId.SAWK, SpeciesId.CONKELDURR, SpeciesId.SUDOWOODO, SpeciesId.ZANGOOSE, SpeciesId.KECLEON, SpeciesId.SEVIPER, SpeciesId.SPIDOPS, SpeciesId.TINKATON, SpeciesId.SABLEYE, SpeciesId.MAWILE, SpeciesId.CARNIVINE, SpeciesId.SIMISAGE, SpeciesId.LEAVANNY, SpeciesId.SCOLIPEDE, SpeciesId.GALVANTULA, SpeciesId.SALAZZLE, SpeciesId.DRUDDIGON, SpeciesId.ORTHWORM, SpeciesId.DURANT, SpeciesId.VIKAVOLT, SpeciesId.TOEDSCRUEL, SpeciesId.SCIZOR, SpeciesId.KLEAVOR, SpeciesId.EXCADRILL, SpeciesId.MOMOSWINE, SpeciesId.ESCAVALIER, SpeciesId.ACCELGOR, SpeciesId.FERROTHORN, SpeciesId.GLIMMORA, SpeciesId.HISUI_GOODRA, SpeciesId.URSALUNA ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.BUZZWOLE ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.MUSHROOM_FOREST]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ZUBAT ], 22: [ SpeciesId.GOLBAT ], 35: [ SpeciesId.CROBAT ]}, { 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]}, { 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ]}, { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ]}, { 1: [ SpeciesId.DIGLETT ], 26: [ SpeciesId.DUGTRIO ]}, { 1: [ SpeciesId.NYMBLE ], 24: [ SpeciesId.LOKIX ]}, { 1: [ SpeciesId.ODDISH ], 21: [ SpeciesId.GLOOM ]}, { 1: [ SpeciesId.KRICKETOT ], 10: [ SpeciesId.KRICKETUNE ]}, { 1: [ SpeciesId.MISDREAVUS ], 35: [ SpeciesId.MISMAGIUS ]}, { 1: [ SpeciesId.ALOLA_RATTATA ], 20: [ SpeciesId.ALOLA_RATICATE ]}, { 1: [ SpeciesId.WHISMUR ], 20: [ SpeciesId.LOUDRED ], 40: [ SpeciesId.EXPLOUD ]}, { 1: [ SpeciesId.WOOBAT ], 20: [ SpeciesId.SWOOBAT ]}, { 1: [ SpeciesId.BELLSPROUT ], 21: [ SpeciesId.WEEPRNBELL ], 36: [ SpeciesId.VICTREEBEL ]}, { 1: [ SpeciesId.SOLOSIS ], 32: [ SpeciesId.DUOSION ], 41: [ SpeciesId.REUNICLUS ]}, { 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.WORMADAM ]}, { 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.MOTHIM ]}, { 1: [ SpeciesId.COMBEE ], 21: [ SpeciesId.VESPIQUEN ]}, { 1: [ SpeciesId.BLIPBUG ], 10: [ SpeciesId.DOTTLER ], 30: [ SpeciesId.ORBEETLE ]}, { 1: [ SpeciesId.SIZZLIPEDE ], 28: [ SpeciesId.CENTISKORCH ]}, { 1: [ SpeciesId.WEEDLE ], 7: [ SpeciesId.KAKUNA ], 10: [ SpeciesId.BEEDRILL ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.SILCOON ], 10: [ SpeciesId.BEAUTIFLY ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.CASCOON ], 10: [ SpeciesId.DUSTOX ]}, { 1: [ SpeciesId.GALAR_ZIGZAGOON ], 20: [ SpeciesId.GALAR_LINOONE ], 35: [ SpeciesId.OBSTAGOON ]}, { 1: [ SpeciesId.ALOLA_GRIMER ], 38: [ SpeciesId.ALOLA_MUK ]}, SpeciesId.SHUCKLE, { 1: [ SpeciesId.MORELULL ], 24: [ SpeciesId.SHIINOTIC ]}]},
      [TimeOfDay.NIGHT]: []
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ { 1: [ SpeciesId.PHANTUMP ], 35: [ SpeciesId.TREVENANT ]}, { 1: [ SpeciesId.TANGELA ], 38: [ SpeciesId.TANGROWTH ]}, { 1: [ SpeciesId.PARAS ], 24: [ SpeciesId.PARASECT ]}, { 1: [ SpeciesId.VENONAT ], 31: [ SpeciesId.VENOMOTH ]}, { 1: [ SpeciesId.SPINARAK ], 22: [ SpeciesId.ARIADOS ]}, { 1: [ SpeciesId.LEDYBA ], 18: [ SpeciesId.LEDIAN ]}, { 1: [ SpeciesId.PINECO ], 31: [ SpeciesId.FORRETRESS ]}, { 1: [ SpeciesId.SHROOMISH ], 23: [ SpeciesId.BRELOOM ]}, SpeciesId.SABLEYE, SpeciesId.MAWILE, { 1: [ SpeciesId.IMPIDIMP ], 32: [ SpeciesId.MORGREM ], 42: [ SpeciesId.GRIMMSNARL ]}, { 1: [ SpeciesId.MEDITITE ], 37: [ SpeciesId.MEDICHAM ]}, { 1: [ SpeciesId.FOONGUS ], 39: [ SpeciesId.AMOONGUSS ]}, { 1: [ SpeciesId.GULPIN ], 26: [ SpeciesId.SWALOT ]}, { 1: [ SpeciesId.TRAPINCH ], 35: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]}, { 1: [ SpeciesId.DUSKULL ], 37: [ SpeciesId.DUSCLOPS ], 48: [ SpeciesId.DUSKNOIR ]}, { 1: [ SpeciesId.SHUPPET ], 37: [ SpeciesId.BANETTE ]}, { 1: [ SpeciesId.SEWADDLE ], 20: [ SpeciesId.SWADLOON ], 30: [ SpeciesId.LEAVANNY ]}, { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}, { 1: [ SpeciesId.STUNKY ], 34: [ SpeciesId.SKUNTANK ]}, { 1: [ SpeciesId.SKORUPI ], 40: [ SpeciesId.DRAPION ]}, { 1: [ SpeciesId.HATENNA], 32: [ SpeciesId.HATTREM ], 42: [ SpeciesId.HATTERENE ]}]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.PINSIR, SpeciesId.HERACROSS, SpeciesId.THROH, SpeciesId.SAWK, { 1: [ SpeciesId.TIMBURR ], 25: [ SpeciesId.GURDURR ], 36: [ SpeciesId.CONKELDURR ]}, { 1: [ SpeciesId.BONSLY ], 15: [ SpeciesId.SUDOWOODO ]}, SpeciesId.ZANGOOSE, SpeciesId.KECLEON, SpeciesId.SEVIPER, { 1: [ SpeciesId.TAROUNTULA ], 15: [ SpeciesId.SPIDOPS ]}, { 1: [ SpeciesId.TINKATINK ], 24: [ SpeciesId.TINKATUFF ], 38: [ SpeciesId.TINKATON ]}, { 1: [ SpeciesId.JOLTIK ], 37: [ SpeciesId.GALVANTULA ]}, SpeciesId.DRUDDIGON, SpeciesId.CARNIVINE, SpeciesId.ORTHWORM, SpeciesId.DURANT, { 1: [ SpeciesId.GRUBBIN ], 20: [ SpeciesId.CHARJABUG ], 32: [ SpeciesId.VIKAVOLT ]}, { 1: [ SpeciesId.TOEDSCOOL ], 30: [ SpeciesId.TOEDSCRUEL ]}, { 1: [ SpeciesId.SALANDIT ], 37: [ SpeciesId.SALAZZLE ]}, { 1: [ SpeciesId.DRILBUR ], 31: [ SpeciesId.EXCADRILL ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SCYTHER ], 30: [ SpeciesId.SCIZOR ]}, { 1: [ SpeciesId.SCYTHER ], 30: [ SpeciesId.KLEAVOR ]}, { 1: [ SpeciesId.KARRABLAST ], 35: [ SpeciesId.ESCAVALIER ]}, { 1: [ SpeciesId.SHELMET ], 35: [ SpeciesId.ACCELGOR ]}, { 1: [ SpeciesId.GLIMMET ], 35: [ SpeciesId.GLIMMORA ]}, { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.HISUI_SLIGGOO ], 50: [ SpeciesId.HISUI_GOODRA ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.BRUTE_BONNET ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.CROBAT, SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.DUGTRIO, SpeciesId.VILEPLUME, SpeciesId.KRICKETUNE, SpeciesId.MISMAGIUS, SpeciesId.ZANGOOSE, SpeciesId.KECLEON, SpeciesId.EXPLOUD, SpeciesId.LOKIX, SpeciesId.LEDIAN, SpeciesId.ALOLA_RATICATE, SpeciesId.SWOOBAT, SpeciesId.VICTREEBEL, SpeciesId.ORBEETLE, SpeciesId.REUNICLUS, SpeciesId.WORMADAM, SpeciesId.MOTHIM, SpeciesId.VESPIQUEN, SpeciesId.CENTISKORCH, SpeciesId.OBSTAGOON, SpeciesId.BEEDRILL, SpeciesId.BEAUTIFLY, SpeciesId.DUSTOX, SpeciesId.GRIMMSNARL, SpeciesId.TANGROWTH, SpeciesId.PARASECT, SpeciesId.VENOMOTH, SpeciesId.ARIADOS, SpeciesId.FORRETRESS, SpeciesId.BRELOOM, SpeciesId.MEDICHAM, SpeciesId.SWALOT, SpeciesId.FLYGON, SpeciesId.AMOONGUSS, SpeciesId.DUSKNOIR, SpeciesId.SKUNTANK, SpeciesId.DRAPION, SpeciesId.BANETTE, SpeciesId.ALOLA_MUK, SpeciesId.SHUCKLE, SpeciesId.HATTERENE ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.BELLOSSOM, SpeciesId.PINSIR, SpeciesId.HERACROSS, SpeciesId.THROH, SpeciesId.SAWK, SpeciesId.CONKELDURR, SpeciesId.SUDOWOODO, SpeciesId.ZANGOOSE, SpeciesId.KECLEON, SpeciesId.SEVIPER, SpeciesId.SPIDOPS, SpeciesId.TINKATON, SpeciesId.SABLEYE, SpeciesId.MAWILE, SpeciesId.CARNIVINE, SpeciesId.SIMISAGE, SpeciesId.LEAVANNY, SpeciesId.SCOLIPEDE, SpeciesId.GALVANTULA, SpeciesId.SALAZZLE, SpeciesId.DRUDDIGON, SpeciesId.ORTHWORM, SpeciesId.DURANT, SpeciesId.VIKAVOLT, SpeciesId.TOEDSCRUEL, SpeciesId.SCIZOR, SpeciesId.KLEAVOR, SpeciesId.EXCADRILL, SpeciesId.ESCAVALIER, SpeciesId.ACCELGOR, SpeciesId.GLIMMORA, SpeciesId.HISUI_GOODRA ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.BRUTE_BONNET ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []
  },
  [BiomeId.SEWER]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.RATTATA ], 20: [ SpeciesId.RATICATE ]}, { 1: [ SpeciesId.ZUBAT ], 22: [ SpeciesId.GOLBAT ], 35: [ SpeciesId.CROBAT ]}, { 1: [ SpeciesId.GRIMER ], 38: [ SpeciesId.MUK ]},  { 1: [ SpeciesId.VOLTORB ], 30: [ SpeciesId.ELECTRODE ]}, { 1: [ SpeciesId.KOFFING ], 30: [ SpeciesId.WEEZING ]}, { 1: [ SpeciesId.TRUBBISH ], 36: [ SpeciesId.GARBODOR ]} ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SPINARAK ], 22: [ SpeciesId.ARIADOS ]}, { 1: [ SpeciesId.GULPIN ], 26: [ SpeciesId.SWALOT ]}, { 1: [ SpeciesId.WOOBAT ], 26: [ SpeciesId.SWOOBAT ]}, { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}, { 1: [ SpeciesId.FRILLISH ], 40: [ SpeciesId.JELLICENT ]}, { 1: [ SpeciesId.SALANDIT ], 35: [ SpeciesId.SALAZZLE ]}, { 1: [ SpeciesId.CHEWTLE ], 22: [ SpeciesId.DREDNAW ]}, { 1: [ SpeciesId.TOXEL ], 30: [ SpeciesId.TOXTRICITY ]}, { 1: [ SpeciesId.SIZZLIPEDE ], 28: [ SpeciesId.CENTISKORCH ]}]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.FEEBAS ], 35: [ SpeciesId.MILOTIC ]}, { 1: [ SpeciesId.GASTLY ], 25: [ SpeciesId.HAUNTER ], 35: [ SpeciesId.GENGAR ]}, { 1: [ SpeciesId.VAROOM ], 40: [ SpeciesId.REVAVROOM ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DITTO ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GENESECT ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.RATICATE, SpeciesId.CROBAT, SpeciesId.MUK, SpeciesId.ELECTRODE, SpeciesId.WEEZING, SpeciesId.DREDNAW, SpeciesId.TOXTRICITY, SpeciesId.CENTISKORCH ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ARIADOS, SpeciesId.SWALOT, SpeciesId.SWOOBAT, SpeciesId.SCOLIPEDE, SpeciesId.DREDNAW, SpeciesId.JELLICENT, SpeciesId.SALAZZLE, SpeciesId.MILOTIC, SpeciesId.GENGAR, SpeciesId.DITTO, SpeciesId.REVAVROOM ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GENESECT ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.POLLUTED_CAVE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.RATTATA ], 20: [ SpeciesId.RATICATE ]}, { 1: [ SpeciesId.ZUBAT ], 22: [ SpeciesId.GOLBAT ], 35: [ SpeciesId.CROBAT ]}, { 1: [ SpeciesId.GEODUDE ], 25: [ SpeciesId.GRAVELER ], 35: [ SpeciesId.GOLEM ]},  { 1: [ SpeciesId.CUBONE ], 28: [ SpeciesId.MAROWAK ]}, { 1: [ SpeciesId.STUNKY ], 34: [ SpeciesId.SKUNTANK ]}, { 1: [ SpeciesId.TRUBBISH ], 36: [ SpeciesId.GARBODOR ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SPINARAK ], 22: [ SpeciesId.ARIADOS ]}, { 1: [ SpeciesId.GULPIN ], 26: [ SpeciesId.SWALOT ]}, { 1: [ SpeciesId.WOOBAT ], 26: [ SpeciesId.SWOOBAT ]}, { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}, { 1: [ SpeciesId.GLIGAR ], 40: [ SpeciesId.GLISCOR ]}, { 1: [ SpeciesId.SALANDIT ], 35: [ SpeciesId.SALAZZLE ]}, { 1: [ SpeciesId.SKORUPI ], 40: [ SpeciesId.DRAPION ]}, { 1: [ SpeciesId.TOXEL ], 30: [ SpeciesId.TOXTRICITY ]}, { 1: [ SpeciesId.SIZZLIPEDE ], 28: [ SpeciesId.CENTISKORCH ]}]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.FERROSEED ], 40: [ SpeciesId.FERROTHORN ]}, { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ], 35: [ SpeciesId.GIGALITH ]}, { 1: [ SpeciesId.DRILBUR ], 31: [ SpeciesId.EXCADRILL ]}, { 1: [ SpeciesId.ONIX ], 25: [ SpeciesId.STEELIX ]}, { 1: [ SpeciesId.KLINK ], 38: [ SpeciesId.KLANG ], 49: [ SpeciesId.KLINKLANG ]}, { 1: [ SpeciesId.VAROOM ], 40: [ SpeciesId.REVAVROOM ]}, SpeciesId.DURANT ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.GLIMMET ], 35: [ SpeciesId.GLIMMORA ]}, { 1: [ SpeciesId.HONEDGE ], 35: [ SpeciesId.DOUBLADE ], 49: [ SpeciesId.AEGISLASH ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.NIHILEGO ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.RATICATE, SpeciesId.CROBAT, SpeciesId.MAROWAK, SpeciesId.GOLEM, SpeciesId.SKUNTANK, SpeciesId.GARBODOR ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ARIADOS, SpeciesId.SWALOT, SpeciesId.SWOOBAT, SpeciesId.SCOLIPEDE, SpeciesId.GLISCOR, SpeciesId.DRAPION, SpeciesId.SALAZZLE, SpeciesId.FERROTHORN, SpeciesId.GIGALITH, SpeciesId.EXCADRILL, SpeciesId.STEELIX, SpeciesId.KLINKLANG, SpeciesId.DURANT, SpeciesId.GLIMMORA, SpeciesId.REVAVROOM, SpeciesId.AEGISLASH ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.NIHILEGO ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.POLLUTED_RIVER]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]}, { 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ], 35: [ SpeciesId.NIDOQUEEN ]}, { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ], 35: [ SpeciesId.NIDOKING ]}, { 1: [ SpeciesId.STUNKY ], 34: [ SpeciesId.SKUNTANK ]}, { 1: [ SpeciesId.TRUBBISH ], 36: [ SpeciesId.GARBODOR ]}, { 1: [ SpeciesId.ODDISH ], 21: [ SpeciesId.GLOOM ], 35: [ SpeciesId.VILEPLUME ]}, { 1: [ SpeciesId.BELLSPROUT ], 21: [ SpeciesId.WEEPINBELL ], 35: [ SpeciesId.VECTREEBEL ]}, { 1: [ SpeciesId.PARAS ], 24: [ SpeciesId.PARASECT ]}, { 1: [ SpeciesId.VENONAT ], 31: [ SpeciesId.VENOMOTH ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.GULPIN ], 26: [ SpeciesId.SWALOT ]}, { 1: [ SpeciesId.SURSKIT ], 26: [ SpeciesId.MASQUERAIN ]}, { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}, { 1: [ SpeciesId.GLIGAR ], 40: [ SpeciesId.GLISCOR ]}, { 1: [ SpeciesId.SALANDIT ], 35: [ SpeciesId.SALAZZLE ]}, { 1: [ SpeciesId.SKORUPI ], 40: [ SpeciesId.DRAPION ]}, { 1: [ SpeciesId.TOXEL ], 30: [ SpeciesId.TOXTRICITY ]}, { 1: [ SpeciesId.CROAGUNK ], 37: [ SpeciesId.TOXICROAK ]}]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.MURKROW ], 40: [ SpeciesId.HONCHKROW ]}, { 1: [ SpeciesId.TYMPOLE ], 25: [ SpeciesId.PALPITOAD ], 36: [ SpeciesId.SEISMITOAD ]}, { 1: [ SpeciesId.SKRELP ], 48: [ SpeciesId.DRAGALGE ]}, { 1: [ SpeciesId.PHANTUMP ], 38: [ SpeciesId.TREVENANT ]}, { 1: [ SpeciesId.MAREANIE ], 38: [ SpeciesId.TOXAPEX ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SEVIPER, SpeciesId.ZANGOOSE, { 1: [ SpeciesId.PALDEA_WOOPER ], 20: [ SpeciesId.CLODSIRE ]}, { 1: [ SpeciesId.GALAR_SLOWPOKE ], 40: [ SpeciesId.GALAR_SLOWBRO ]}, { 1: [ SpeciesId.GALAR_SLOWPOKE ], 40: [ SpeciesId.GALAR_SLOWKING ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_MOTH ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ARBOK, SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.MASQUERAIN, SpeciesId.VILEPLUME, SpeciesId.VECTREEBEL, SpeciesId.SKUNTANK, SpeciesId.PARASECT, SpeciesId.VENOMOTH, SpeciesId.GARBODOR ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.HONCHKROW, SpeciesId.SEISMITOAD, SpeciesId.DRAGALGE, SpeciesId.SCOLIPEDE, SpeciesId.GLISCOR, SpeciesId.DRAPION, SpeciesId.SALAZZLE, SpeciesId.TOXICROAK, SpeciesId.TOXAPEX, SpeciesId.SEVIPER, SpeciesId.ZANGOOSE, SpeciesId.CLODSIRE, SpeciesId.TREVENANT, SpeciesId.GALAR_SLOWBRO, SpeciesId.GALAR_SLOWKING ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_MOTH ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.METROPOLIS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.YAMPER ], 25: [ SpeciesId.BOLTUND ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.YAMPER ], 25: [ SpeciesId.BOLTUND ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.PATRAT ], 20: [ SpeciesId.WATCHOG ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.HOUNDOUR ], 24: [ SpeciesId.HOUNDOOM ]}, { 1: [ SpeciesId.PATRAT ], 20: [ SpeciesId.WATCHOG ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.RATTATA ], 20: [ SpeciesId.RATICATE ]}, { 1: [ SpeciesId.ZIGZAGOON ], 20: [ SpeciesId.LINOONE ]}, { 1: [ SpeciesId.LILLIPUP ], 16: [ SpeciesId.HERDIER ], 32: [ SpeciesId.STOUTLAND ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.PATRAT ], 20: [ SpeciesId.WATCHOG ]}, SpeciesId.INDEEDEE ],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.PATRAT ], 20: [ SpeciesId.WATCHOG ]}, SpeciesId.INDEEDEE ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.ESPURR ], 25: [ SpeciesId.MEOWSTIC ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.ESPURR ], 25: [ SpeciesId.MEOWSTIC ]}],
      [TimeOfDay.ALL]: [ SpeciesId.PIKACHU, { 1: [ SpeciesId.GLAMEOW ], 38: [ SpeciesId.PURUGLY ]}, SpeciesId.FURFROU, { 1: [ SpeciesId.FIDOUGH ], 26: [ SpeciesId.DACHSBUN ]}, SpeciesId.SQUAWKABILLY ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.TANDEMAUS ], 25: [ SpeciesId.MAUSHOLD ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.TANDEMAUS ], 25: [ SpeciesId.MAUSHOLD ]}],
      [TimeOfDay.DUSK]: [ SpeciesId.MORPEKO ],
      [TimeOfDay.NIGHT]: [ SpeciesId.MORPEKO ],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.VAROOM ], 40: [ SpeciesId.REVAVROOM ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DITTO, SpeciesId.EEVEE, SpeciesId.SMEARGLE ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CASTFORM, SpeciesId.MELOETTA ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [ SpeciesId.BOLTUND ], [TimeOfDay.DAY]: [ SpeciesId.BOLTUND ], [TimeOfDay.DUSK]: [ SpeciesId.MEOWSTIC ], [TimeOfDay.NIGHT]: [ SpeciesId.MEOWSTIC ], [TimeOfDay.ALL]: [ SpeciesId.STOUTLAND, SpeciesId.FURFROU, SpeciesId.DACHSBUN ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [ SpeciesId.MAUSHOLD ], [TimeOfDay.DAY]: [ SpeciesId.MAUSHOLD ], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CASTFORM, SpeciesId.REVAVROOM ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MELOETTA ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.AMUSEMENT_PARK]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SENTRET ], 15: [ SpeciesId.FURRET ]}, { 1: [ SpeciesId.CATERPIE ], 7: [ SpeciesId.METAPOD ], 10: [ SpeciesId.BUTTERFREE ]}, { 1: [ SpeciesId.ABRA ], 16: [ SpeciesId.KADABRA ], 35: [ SpeciesId.ALAKAZAM ]},  { 1: [ SpeciesId.WYNAUT ], 15: [ SpeciesId.WOBBUFFET ]}, { 1: [ SpeciesId.MUNNA ], 34: [ SpeciesId.MUSHARNA ]}, { 1: [ SpeciesId.MINCCINO ], 36: [ SpeciesId.CINCCINO ]}, { 1: [ SpeciesId.BUDEW ], 16: [ SpeciesId.ROSELIA ], 35: [ SpeciesId.ROSERADE ]}, { 1: [ SpeciesId.HATENNA], 32: [ SpeciesId.HATTREM ], 42: [ SpeciesId.HATTERENE ]}, { 1: [ SpeciesId.SPRITZEE ], 30: [ SpeciesId.AROMATISSE ]}, { 1: [ SpeciesId.SWIRLIX ], 30: [ SpeciesId.SLURPUFF ]}, { 1: [ SpeciesId.FIDOUGH ], 26: [ SpeciesId.DACHSBUN ]}, { 1: [ SpeciesId.MILCERY ], 25: [ SpeciesId.ALCREMIE ]}, { 1: [ SpeciesId.CUTIEFLY ], 25: [ SpeciesId.RIBOMBEE ]}, { 1: [ SpeciesId.DRIFLOON ], 28: [ SpeciesId.DRIFBLIM ]}]},
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ESPURR ], 25: [ SpeciesId.MEOWSTIC ]}, { 1: [ SpeciesId.CUFANT ], 34: [ SpeciesId.COPPERAJAH ]}, { 1: [ SpeciesId.MIME_JR ], 15: [ SpeciesId.GALAR_MR_MIME ], 30: [ SpeciesId.MR_RIME ]}, { 1: [ SpeciesId.MIME_JR ], 15: [ SpeciesId.MR_MIME ]}, { 1: [ SpeciesId.GIRAFARIG ], 32: [ SpeciesId.FARIGIRAF ]}, { 1: [ SpeciesId.PHANPY ], 25: [ SpeciesId.DONPHAN ]}, { 1: [ SpeciesId.LITLEO ], 35: [ SpeciesId.PYROAR ]}, { 1: [ SpeciesId.SHINX ], 15: [ SpeciesId.LUXIO ], 30: [ SpeciesId.LUXRAY ]}, SpeciesId.INDEEDEE, { 1: [ SpeciesId.CLEFFA ], 15: [ SpeciesId.CLEFAIRY ], 30: [ SpeciesId.CLEFABLE ]}, { 1: [ SpeciesId.IGGLYBUFF ], 15: [ SpeciesId.JIGGLYPUFF ], 30: [ SpeciesId.WIGGLYTUFF ]}, { 1: [ SpeciesId.PONYTA ], 40: [ SpeciesId.RAPIDASH ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.SILCOON ], 10: [ SpeciesId.BEAUTIFLY ]}, { 1: [ SpeciesId.WURMPLE ], 7: [ SpeciesId.CASCOON ], 10: [ SpeciesId.DUSTOX ]}, { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUILL ], 32: [ SpeciesId.UNFEAZANT ]}, SpeciesId.COMFEY, { 1: [ SpeciesId.MANKEY ], 28: [ SpeciesId.PRIMEAPE ], 35: [ SpeciesId.ANNIHILAPE ]}, { 1: [ SpeciesId.AIPOM ], 32: [ SpeciesId.AMBIPOM ]}, SpeciesId.SMEARGLE, { 1: [ SpeciesId.PANSAGE ], 25: [ SpeciesId.SIMISAGE ]}, { 1: [ SpeciesId.PANSEAR ], 25: [ SpeciesId.SIMISEAR ]}, { 1: [ SpeciesId.PANPOUR ], 25: [ SpeciesId.SIMIPOUR ]}, { 1: [ SpeciesId.SEEL ], 34: [ SpeciesId.DEWGONG ]}, { 1: [ SpeciesId.SPHEAL ], 32: [ SpeciesId.SEALEO ], 44: [ SpeciesId.WALREIN ]}]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.GALAR_PONYTA ], 40: [ SpeciesId.GALAR_RAPIDASH ]}, { 1: [ SpeciesId.GOTHITA ], 32: [ SpeciesId.GOTHORITA ], 41: [ SpeciesId.GOTHITELLE ]}, { 1: [ SpeciesId.SOLOSIS ], 32: [ SpeciesId.DUOSION ], 41: [ SpeciesId.REUNICLUS ]}, { 1: [ SpeciesId.DUCKLETT ], 35: [ SpeciesId.SWANNA ]}, { 1: [ SpeciesId.FLABEBE ], 19: [ SpeciesId.FLOETTE ], 49: [ SpeciesId.FLORGES ]}, { 1: [ SpeciesId.SNUBBULL ], 23: [ SpeciesId.GRANBULL ]}, SpeciesId.AUDINO, SpeciesId.MILTANK, { 1: [ SpeciesId.STUFFUL ], 27: [ SpeciesId.BEWEAR ]}, SpeciesId.FLAMIGO, { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [ SpeciesId.GARDEVOIR ]}, { 1: [ SpeciesId.SLAKOTH ], 18: [ SpeciesId.VIGOROTH ], 36: [ SpeciesId.SLAKING ]}, { 1: [ SpeciesId.CHIMCHAR ], 14: [ SpeciesId.MONFERNO ], 36: [ SpeciesId.INFERNAPE ]}, SpeciesId.ORANGURU, SpeciesId.PASSIMIAN, { 1: [ SpeciesId.LITTEN ], 17: [ SpeciesId.TORRACAT ], 34: [ SpeciesId.INCINEROAR ]}, { 1: [ SpeciesId.POPPLIO ], 17: [ SpeciesId.BRIONNE ], 34: [ SpeciesId.PRIMARINA ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TOGEPI ], 15: [ SpeciesId.TOGETIC ], 35: [ SpeciesId.TOGEKISS ]}, { 1: [ SpeciesId.AZURILL ], 10: [ SpeciesId.MARILL ], 18: [ SpeciesId.AZUMARILL ]}, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ], 45: [ SpeciesId.URSALUNA ]}, { 1: [ SpeciesId.SWINUB ], 33: [ SpeciesId.PILOSWINE ], 45: [ SpeciesId.MAMOSWINE ]}, { 1: [ SpeciesId.HAPPINY ], 20: [ SpeciesId.CHANSEY ], 35: [ SpeciesId.BLISSEY ]}, { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [ SpeciesId.GALLADE ]}, { 1: [ SpeciesId.GROOKEY ], 16: [ SpeciesId.THWACKEY ], 35: [ SpeciesId.RILABOOM ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.BLACEPHALON ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.FURRET, SpeciesId.DRIFBLIM, SpeciesId.BUTTERFREE, SpeciesId.ALAKAZAM, SpeciesId.WOBBUFFET, SpeciesId.MUSHARNA, SpeciesId.CINCCINO, SpeciesId.ROSERADE, SpeciesId.HATTERENE, SpeciesId.AROMATISSE, SpeciesId.SLURPUFF, SpeciesId.DACHSBUN, SpeciesId.ALCREMIE, SpeciesId.MEOWSTIC, SpeciesId.COPPERAJAH, SpeciesId.MR_RIME, SpeciesId.MR_MIME, SpeciesId.FARIGIRAF, SpeciesId.DONPHAN, SpeciesId.PYROAR, SpeciesId.LUXRAY, SpeciesId.INDEEDEE, SpeciesId.CLEFABLE, SpeciesId.WIGGLYTUFF, SpeciesId.RAPIDASH, SpeciesId.BEAUTIFLY, SpeciesId.DUSTOX, SpeciesId.UNFEAZANT, SpeciesId.COMFEY, SpeciesId.RIBOMBEE, SpeciesId.ANNIHILAPE, SpeciesId.AMBIPOM, SpeciesId.SMEARGLE, SpeciesId.SIMISAGE, SpeciesId.PANSEAR, SpeciesId.SIMIPOUR, SpeciesId.WALREIN, SpeciesId.DEWGONG ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GALAR_RAPIDASH, SpeciesId.GOTHITELLE, SpeciesId.REUNICLUS, SpeciesId.SWANNA, SpeciesId.FLORGES, SpeciesId.GRANBULL, SpeciesId.AUDINO, SpeciesId.MILTANK, SpeciesId.BEWEAR, SpeciesId.FLAMIGO, SpeciesId.TOGEKISS, SpeciesId.AZUMARILL, SpeciesId.URSALUNA, SpeciesId.MAMOSWINE, SpeciesId.BLISSEY, SpeciesId.GARDEVOIR, SpeciesId.GALLADE, SpeciesId.SLAKING, SpeciesId.INFERNAPE, SpeciesId.ORANGURU, SpeciesId.PASSIMIAN, SpeciesId.RILABOOM, SpeciesId.INCINEROAR, SpeciesId.PRIMARINA ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.BLACEPHALON ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.CASTLE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ALOLA_MEOWTH ], 28: [ SpeciesId.ALOLA_PERSIAN ]}, { 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ], 35: [ SpeciesId.NIDOQUEEN ]}, { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ], 35: [ SpeciesId.NIDOKING ]},  { 1: [ SpeciesId.PONYTA ], 40: [ SpeciesId.RAPIDASH ]}, { 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]}, { 1: [ SpeciesId.MINCCINO ], 36: [ SpeciesId.CINCCINO ]}, { 1: [ SpeciesId.BUDEW ], 16: [ SpeciesId.ROSELIA ], 35: [ SpeciesId.ROSERADE ]}, { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]}, { 1: [ SpeciesId.SPRITZEE ], 30: [ SpeciesId.AROMATISSE ]}, { 1: [ SpeciesId.SWIRLIX ], 30: [ SpeciesId.SLURPUFF ]}, { 1: [ SpeciesId.SPOINK ], 32: [ SpeciesId.GRUMPIG ]}, { 1: [ SpeciesId.MILCERY ], 25: [ SpeciesId.ALCREMIE ]}, { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]}, { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNGHT ]}, { 1: [ SpeciesId.SINISTEA ], 35: [ SpeciesId.POLTEAGEIST ]}, { 1: [ SpeciesId.GALAR_FARFETCHD ], 35: [ SpeciesId.SIRFETCHD ]}, { 1: [ SpeciesId.KARRABLAST ], 35: [ SpeciesId.ESCAVALIER ]}, { 1: [ SpeciesId.SHELMET ], 35: [ SpeciesId.ACCELGOR ]}, { 1: [ SpeciesId.PETILIL ], 25: [ SpeciesId.LILLIGANT ]}, SpeciesId.FALINKS, { 1: [ SpeciesId.SMOLIV ], 25: [ SpeciesId.DOLIV ], 35: [ SpeciesId.ARBOLIVA ]}, { 1: [ SpeciesId.NACLI ], 24: [ SpeciesId.NACLSTACK ], 38: [ SpeciesId.GARGANACL ]}]},
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ESPURR ], 25: [ SpeciesId.MEOWSTIC ]}, { 1: [ SpeciesId.CUFANT ], 34: [ SpeciesId.COPPERAJAH ]}, { 1: [ SpeciesId.MIME_JR ], 15: [ SpeciesId.GALAR_MR_MIME ], 30: [ SpeciesId.MR_RIME ]}, { 1: [ SpeciesId.MIME_JR ], 15: [ SpeciesId.MR_MIME ]}, { 1: [ SpeciesId.CHARCADET ], 35: [ SpeciesId.ARMAROUGUE ]}, { 1: [ SpeciesId.CHARCADET ], 35: [ SpeciesId.CERULEDGE ]}, { 1: [ SpeciesId.PHANPY ], 25: [ SpeciesId.DONPHAN ]}, { 1: [ SpeciesId.LITLEO ], 35: [ SpeciesId.PYROAR ]}, { 1: [ SpeciesId.SHINX ], 15: [ SpeciesId.LUXIO ], 30: [ SpeciesId.LUXRAY ]}, SpeciesId.INDEEDEE, { 1: [ SpeciesId.CLEFFA ], 15: [ SpeciesId.CLEFAIRY ], 30: [ SpeciesId.CLEFABLE ]}, { 1: [ SpeciesId.IGGLYBUFF ], 15: [ SpeciesId.JIGGLYPUFF ], 30: [ SpeciesId.WIGGLYTUFF ]}, { 1: [ SpeciesId.MASCHIFF ], 30: [ SpeciesId.MABOSSTIFF ]}, { 1: [ SpeciesId.TINKATINK ], 24: [ SpeciesId.TINKATUFF ], 38: [ SpeciesId.TINKATON ]}, { 1: [ SpeciesId.PAWNIARD ], 52: [ SpeciesId.BISHARP ], 55: [ SpeciesId.KINGAMBIT ]}, { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUILL ], 32: [ SpeciesId.UNFEAZANT ]}, SpeciesId.COMFEY, { 1: [ SpeciesId.LILLIPUP ], 16: [ SpeciesId.HERDERIER ], 32: [ SpeciesId.STOUTLAND ]}, { 1: [ SpeciesId.RIOLU ], 35: [ SpeciesId.LUCARIO ]}, SpeciesId.SMEARGLE, { 1: [ SpeciesId.PURRLOIN ], 20: [ SpeciesId.LIEPARD ]}, { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ], 45: [ SpeciesId.CHANDELURE ]}, { 1: [ SpeciesId.AXEW ], 38: [ SpeciesId.FRAXURE ], 48: [ SpeciesId.HAXORUS ]}, { 1: [ SpeciesId.NOIBAT ], 48: [ SpeciesId.NOIVERN ]}, { 1: [ SpeciesId.HONEDGE ], 35: [ SpeciesId.DOUBLADE ], 45: [ SpeciesId.AEGISLASH ]}]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.GALAR_PONYTA ], 40: [ SpeciesId.GALAR_RAPIDASH ]}, { 1: [ SpeciesId.GOTHITA ], 32: [ SpeciesId.GOTHORITA ], 41: [ SpeciesId.GOTHITELLE ]}, { 1: [ SpeciesId.GROOKEY ], 16: [ SpeciesId.THWACKEY ], 35: [ SpeciesId.RILABOOM ]}, { 1: [ SpeciesId.MURKROW ], 35: [ SpeciesId.HONCHKROW ]}, { 1: [ SpeciesId.JANGMO_O ], 35: [ SpeciesId.HAKAMO_O ], 45: [ SpeciesId.KOMMO_O ]}, { 1: [ SpeciesId.RUFFLET ], 54: [ SpeciesId.BRAVIARY ]}, { 1: [ SpeciesId.RUFFLET ], 54: [ SpeciesId.HISUI_BRAVIARY ]}, SpeciesId.AUDINO, SpeciesId.FLAMIGO, { 1: [ SpeciesId.GIMMIGHOUL ], 35: [ SpeciesId.GHOLDENGO ]}, SpeciesId.MIMIKYU, { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [ SpeciesId.GARDEVOIR ]}, { 1: [ SpeciesId.SLAKOTH ], 18: [ SpeciesId.VIGOROTH ], 36: [ SpeciesId.SLAKING ]}, { 1: [ SpeciesId.ROWLET ], 17: [ SpeciesId.DARTRIX ], 34: [ SpeciesId.DECIDUEYE ]}, SpeciesId.KLEFKI, SpeciesId.FURFROU, { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.DIPPLIN ], 35: [ SpeciesId.HYDRAPPLE ]}, { 1: [ SpeciesId.SWABLU ], 35: [ SpeciesId.ALTARIA ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TOGEPI ], 15: [ SpeciesId.TOGETIC ], 35: [ SpeciesId.TOGEKISS ]}, { 1: [ SpeciesId.BAGON ], 30: [ SpeciesId.SHELGON ], 55: [ SpeciesId.SALAMENCE ]}, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ], 45: [ SpeciesId.URSALUNA ]}, { 1: [ SpeciesId.SWINUB ], 33: [ SpeciesId.PILOSWINE ], 45: [ SpeciesId.MAMOSWINE ]}, { 1: [ SpeciesId.HAPPINY ], 20: [ SpeciesId.CHANSEY ], 35: [ SpeciesId.BLISSEY ]}, { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [ SpeciesId.GALLADE ]}, { 1: [ SpeciesId.DRATINI ], 30: [ SpeciesId.DRAGONAIR ], 55: [ SpeciesId.DRAGONITE ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ENAMORUS ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ALOLA_PERSIAN, SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.RAPIDASH, SpeciesId.PIDGEOT, SpeciesId.AGGRON, SpeciesId.CINCCINO, SpeciesId.ROSERADE, SpeciesId.HATTERENE, SpeciesId.AROMATISSE, SpeciesId.SLURPUFF, SpeciesId.GRUMPIG, SpeciesId.ALCREMIE, SpeciesId.STARAPTOR, SpeciesId.CORVIKNGHT, SpeciesId.MEOWSTIC, SpeciesId.MR_RIME, SpeciesId.MR_MIME, SpeciesId.POLTEAGEIST, SpeciesId.SIRFETCHD, SpeciesId.FALINKS, SpeciesId.ARBOLIVA, SpeciesId.GARGANACL, SpeciesId.COPPERAJAH, SpeciesId.ARMAROUGUE, SpeciesId.CERULEDGE, SpeciesId.DONPHAN, SpeciesId.PYROAR, SpeciesId.LUXRAY, SpeciesId.INDEEDEE, SpeciesId.CLEFABLE, SpeciesId.WIGGLYTUFF, SpeciesId.RAPIDASH, SpeciesId.MABOSSTIFF, SpeciesId.TINKATON, SpeciesId.UNFEAZANT, SpeciesId.KINGAMBIT, SpeciesId.COMFEY, SpeciesId.STOUTLAND, SpeciesId.LUCARIO, SpeciesId.LIEPARD, SpeciesId.CHANDELURE, SpeciesId.HAXORUS, SpeciesId.NOIVERN, SpeciesId.AEGISLASH ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GALAR_RAPIDASH, SpeciesId.GOTHITELLE, SpeciesId.HONCHKROW, SpeciesId.KOMMO_O, SpeciesId.BRAVIARY, SpeciesId.HISUI_BRAVIARY, SpeciesId.AUDINO, SpeciesId.FLAMIGO, SpeciesId.GHOLDENGO, SpeciesId.MIMIKYU, SpeciesId.FLAMIGO, SpeciesId.TOGEKISS, SpeciesId.SALAMENCE, SpeciesId.URSALUNA, SpeciesId.MAMOSWINE, SpeciesId.BLISSEY, SpeciesId.GARDEVOIR, SpeciesId.GALLADE, SpeciesId.SLAKING, SpeciesId.DECIDUEYE, SpeciesId.KLEFKI, SpeciesId.FURFROU, SpeciesId.RILABOOM, SpeciesId.HYDRAPPLE, SpeciesId.ALTARIA, SpeciesId.DRAGONITE ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ENAMORUS ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CALYREX ]}
  },
  [BiomeId.ABANDONED_CASTLE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.MURKROW,
        { 1: [ SpeciesId.HOUNDOUR ], 24: [ SpeciesId.HOUNDOOM ]},
        SpeciesId.SABLEYE,
        { 1: [ SpeciesId.PURRLOIN ], 20: [ SpeciesId.LIEPARD ]},
        { 1: [ SpeciesId.PAWNIARD ], 52: [ SpeciesId.BISHARP ], 64: [ SpeciesId.KINGAMBIT ]},
        { 1: [ SpeciesId.NICKIT ], 18: [ SpeciesId.THIEVUL ]},
        { 1: [ SpeciesId.IMPIDIMP ], 32: [ SpeciesId.MORGREM ], 42: [ SpeciesId.GRIMMSNARL ]},
        { 1: [ SpeciesId.MASCHIFF ], 30: [ SpeciesId.MABOSSTIFF ]},
        { 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ], 34: [ SpeciesId.SHIFTRY ]},
        { 1: [ SpeciesId.STUNKY ], 34: [ SpeciesId.SKUNTANK ]},
        { 1: [ SpeciesId.SCRAGGY ], 39: [ SpeciesId.SCRAFTY ]},
        { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]},
        { 1: [ SpeciesId.VULLABY ], 54: [ SpeciesId.MANDIBUZZ ]},
        SpeciesId.BOMBIRDIER,
        { 1: [ SpeciesId.BONSLY ], 15: [ SpeciesId.SUDOWOODO ]},
        { 1: [ SpeciesId.MISDREAVUS ], 30: [ SpeciesId.MISMAGIUS ]},
        { 1: [ SpeciesId.SHUPPET ], 37: [ SpeciesId.BANETTE ]},
        { 1: [ SpeciesId.TRAPINCH ], 35: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]},
        { 1: [ SpeciesId.SWABLU ], 35: [ SpeciesId.ALTARIA ]},
        { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.FLAPPLE ]},
        { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.APPLETUN ]},
        { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.DIPPLIN ], 35: [ SpeciesId.HYDRAPPLE ]},
        SpeciesId.CYCLIZAR
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.DRIFLOON ], 28: [ SpeciesId.DRIFBLIM ]}, { 1: [ SpeciesId.DUSKULL ], 37: [ SpeciesId.DUSCLOPS ], 45: [ SpeciesId.DUSKNOIR ]}, { 1: [ SpeciesId.GASTLY ], 25: [ SpeciesId.HAUNTER ], 35: [ SpeciesId.GENGAR ]}, { 1: [ SpeciesId.YAMASK ], 34: [ SpeciesId.COFAGRIGUS ]}, { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ], 45: [ SpeciesId.CHANDELURE ]}, { 1: [ SpeciesId.GOLETT ], 43: [ SpeciesId.GOLURK ]}, { 1: [ SpeciesId.PHANTUMP ], 35: [ SpeciesId.TREVENANT ]}, { 1: [ SpeciesId.PUMKABOO ], 35: [ SpeciesId.GOURGEIST ]}, { 1: [ SpeciesId.GREAVARD ], 30: [ SpeciesId.HOUNDSTONE ]}, { 1: [ SpeciesId.AXEW ], 38: [ SpeciesId.FRAXURE ], 48: [ SpeciesId.HAXORUS ]}, SpeciesId.DRUDDIGON, { 1: [ SpeciesId.TYRUNT ], 39: [ SpeciesId.TYRANTRUM ]}, { 1: [ SpeciesId.AMAURA ], 39: [ SpeciesId.AURORUS ]}, { 1: [ SpeciesId.NOIBAT ], 48: [ SpeciesId.NOIVERN ]}, SpeciesId.DRAMPA, SpeciesId.TURTONATOR ]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.ABSOL, SpeciesId.SPIRITOMB, { 1: [ SpeciesId.ZORUA ], 30: [ SpeciesId.ZOROARK ]}, { 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]}, { 1: [ SpeciesId.HONEDGE ], 35: [ SpeciesId.DOUBLADE ], 45: [ SpeciesId.AEGISLASH ]}, { 1: [ SpeciesId.DREEPY ], 50: [ SpeciesId.DRAKLOAK ], 60: [ SpeciesId.DRAGAPULT ]}, { 1: [ SpeciesId.GALAR_YAMASK ], 34: [ SpeciesId.RUNERIGUS ]}, { 1: [ SpeciesId.GIMMIGHOUL ], 40: [ SpeciesId.GHOLDENGO ]}, { 1: [ SpeciesId.DRATINI ], 30: [ SpeciesId.DRAGONAIR ], 55: [ SpeciesId.DRAGONITE ]}, { 1: [ SpeciesId.BAGON ], 30: [ SpeciesId.SHELGON ], 50: [ SpeciesId.SALAMENCE ]}, { 1: [ SpeciesId.GIBLE ], 24: [ SpeciesId.GABITE ], 48: [ SpeciesId.GARCHOMP ]}, { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.SLIGGOO ], 50: [ SpeciesId.GOODRA ]}, { 1: [ SpeciesId.JANGMO_O ], 35: [ SpeciesId.HAKAMO_O ], 45: [ SpeciesId.KOMMO_O ]}, SpeciesId.DRACOZOLT, SpeciesId.ARCTOZOLT, SpeciesId.DRACOVISH, SpeciesId.ARCTOVISH, { 1: [ SpeciesId.FRIGIBAX ], 35: [ SpeciesId.ARCTIBAX ], 54: [ SpeciesId.BAXCALIBUR ]}, { 1: [ SpeciesId.DURALUDON ], 50: [ SpeciesId.ARCHALUDON ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.UMBREON, { 1: [ SpeciesId.HISUI_ZORUA ], 30: [ SpeciesId.HISUI_ZOROARK ]}, { 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR ], 55: [ SpeciesId.TYRANITAR ]}, { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.HISUI_SLIGGOO ], 50: [ SpeciesId.HISUI_GOODRA ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ROARING_MOON ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.HOUNDOOM, SpeciesId.SABLEYE, SpeciesId.ABSOL, SpeciesId.HONCHKROW, SpeciesId.SPIRITOMB, SpeciesId.LIEPARD, SpeciesId.ZOROARK, SpeciesId.HYDREIGON, SpeciesId.THIEVUL, SpeciesId.GRIMMSNARL, SpeciesId.MABOSSTIFF, SpeciesId.KINGAMBIT, SpeciesId.SHIFTRY, SpeciesId.SKUNTANK, SpeciesId.SCRAFTY, SpeciesId.KROOKODILE, SpeciesId.MANDIBUZZ, SpeciesId.BOMBIRDIER, SpeciesId.SUDOWOODO, SpeciesId.MISMAGIUS, SpeciesId.BANETTE, SpeciesId.DRIFBLIM, SpeciesId.DUSKNOIR, SpeciesId.GENGAR, SpeciesId.COFAGRIGUS, SpeciesId.CHANDELURE, SpeciesId.GOURGEIST, SpeciesId.HOUNDSTONE ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.UMBREON, SpeciesId.HISUI_SAMUROTT, SpeciesId.AEGISLASH, SpeciesId.DRAGAPULT, SpeciesId.RUNERIGUS, SpeciesId.GHOLDENGO, SpeciesId.HISUI_ZOROARK, SpeciesId.TYRANITAR ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ROARING_MOON ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.FOREST]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [
        SpeciesId.BUTTERFREE,
        { 1: [ SpeciesId.BELLSPROUT ], 21: [ SpeciesId.WEEPINBELL ]},
        { 1: [ SpeciesId.COMBEE ], 21: [ SpeciesId.VESPIQUEN ]},
        SpeciesId.PETILIL,
        { 1: [ SpeciesId.DEERLING ], 34: [ SpeciesId.SAWSBUCK ]},
        SpeciesId.VIVILLON
      ],
      [TimeOfDay.DAY]: [
        SpeciesId.BUTTERFREE,
        { 1: [ SpeciesId.BELLSPROUT ], 21: [ SpeciesId.WEEPINBELL ]},
        SpeciesId.BEAUTIFLY,
        { 1: [ SpeciesId.COMBEE ], 21: [ SpeciesId.VESPIQUEN ]},
        SpeciesId.PETILIL,
        { 1: [ SpeciesId.DEERLING ], 34: [ SpeciesId.SAWSBUCK ]},
        SpeciesId.VIVILLON
      ],
      [TimeOfDay.DUSK]: [
        SpeciesId.BEEDRILL,
        { 1: [ SpeciesId.PINECO ], 31: [ SpeciesId.FORRETRESS ]},
        { 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ]},
        { 1: [ SpeciesId.SHROOMISH ], 23: [ SpeciesId.BRELOOM ]},
        { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}
      ],
      [TimeOfDay.NIGHT]: [
        SpeciesId.BEEDRILL,
        { 1: [ SpeciesId.VENONAT ], 31: [ SpeciesId.VENOMOTH ]},
        { 1: [ SpeciesId.SPINARAK ], 22: [ SpeciesId.ARIADOS ]},
        { 1: [ SpeciesId.PINECO ], 31: [ SpeciesId.FORRETRESS ]},
        SpeciesId.DUSTOX,
        { 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ]},
        { 1: [ SpeciesId.SHROOMISH ], 23: [ SpeciesId.BRELOOM ]},
        { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}
      ],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TAROUNTULA ], 15: [ SpeciesId.SPIDOPS ]}, { 1: [ SpeciesId.NYMBLE ], 24: [ SpeciesId.LOKIX ]}, { 1: [ SpeciesId.SHROODLE ], 28: [ SpeciesId.GRAFAIAI ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [ SpeciesId.ROSELIA, SpeciesId.MOTHIM, { 1: [ SpeciesId.SEWADDLE ], 20: [ SpeciesId.SWADLOON ], 30: [ SpeciesId.LEAVANNY ]}],
      [TimeOfDay.DAY]: [ SpeciesId.ROSELIA, SpeciesId.MOTHIM, { 1: [ SpeciesId.SEWADDLE ], 20: [ SpeciesId.SWADLOON ], 30: [ SpeciesId.LEAVANNY ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.SPINARAK ], 22: [ SpeciesId.ARIADOS ]}, { 1: [ SpeciesId.DOTTLER ], 30: [ SpeciesId.ORBEETLE ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.HOOTHOOT ], 20: [ SpeciesId.NOCTOWL ]}, { 1: [ SpeciesId.ROCKRUFF ], 25: [ SpeciesId.LYCANROC ]}, { 1: [ SpeciesId.DOTTLER ], 30: [ SpeciesId.ORBEETLE ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]},
        { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]},
        { 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.WORMADAM ]},
        { 1: [ SpeciesId.PANSAGE ], 30: [ SpeciesId.SIMISAGE ]}
      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [ SpeciesId.EXEGGCUTE, SpeciesId.STANTLER ],
      [TimeOfDay.DAY]: [ SpeciesId.EXEGGCUTE, SpeciesId.STANTLER ],
      [TimeOfDay.DUSK]: [ SpeciesId.SCYTHER ],
      [TimeOfDay.NIGHT]: [ SpeciesId.SCYTHER ],
      [TimeOfDay.ALL]: [
        SpeciesId.HERACROSS,
        { 1: [ SpeciesId.TREECKO ], 16: [ SpeciesId.GROVYLE ], 36: [ SpeciesId.SCEPTILE ]},
        SpeciesId.TROPIUS,
        SpeciesId.KARRABLAST,
        SpeciesId.SHELMET,
        { 1: [ SpeciesId.CHESPIN ], 16: [ SpeciesId.QUILLADIN ], 36: [ SpeciesId.CHESNAUGHT ]},
        { 1: [ SpeciesId.ROWLET ], 17: [ SpeciesId.DARTRIX ], 34: [ SpeciesId.DECIDUEYE ]},
        SpeciesId.SQUAWKABILLY,
        { 1: [ SpeciesId.TOEDSCOOL ], 30: [ SpeciesId.TOEDSCRUEL ]}
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [ SpeciesId.BLOODMOON_URSALUNA ], [TimeOfDay.ALL]: [ SpeciesId.DURANT ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CELEBI ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.VICTREEBEL, SpeciesId.MOTHIM, SpeciesId.VESPIQUEN, SpeciesId.LILLIGANT, SpeciesId.SAWSBUCK ],
      [TimeOfDay.DAY]: [ SpeciesId.VICTREEBEL, SpeciesId.BEAUTIFLY, SpeciesId.MOTHIM, SpeciesId.VESPIQUEN, SpeciesId.LILLIGANT, SpeciesId.SAWSBUCK ],
      [TimeOfDay.DUSK]: [ SpeciesId.ARIADOS, SpeciesId.FORRETRESS, SpeciesId.SHIFTRY, SpeciesId.BRELOOM, SpeciesId.SCOLIPEDE, SpeciesId.ORBEETLE ],
      [TimeOfDay.NIGHT]: [ SpeciesId.VENOMOTH, SpeciesId.NOCTOWL, SpeciesId.ARIADOS, SpeciesId.FORRETRESS, SpeciesId.DUSTOX, SpeciesId.SHIFTRY, SpeciesId.BRELOOM, SpeciesId.SCOLIPEDE, SpeciesId.ORBEETLE ],
      [TimeOfDay.ALL]: [ SpeciesId.WORMADAM, SpeciesId.SIMISAGE, SpeciesId.SPIDOPS, SpeciesId.LOKIX, SpeciesId.GRAFAIAI ]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [ SpeciesId.STANTLER ],
      [TimeOfDay.DAY]: [ SpeciesId.STANTLER ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ SpeciesId.LYCANROC, SpeciesId.BLOODMOON_URSALUNA ],
      [TimeOfDay.ALL]: [ SpeciesId.HERACROSS, SpeciesId.SCEPTILE, SpeciesId.ESCAVALIER, SpeciesId.ACCELGOR, SpeciesId.DURANT, SpeciesId.CHESNAUGHT, SpeciesId.DECIDUEYE, SpeciesId.TOEDSCRUEL ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CELEBI ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.SEA]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.SLOWPOKE ], 37: [ SpeciesId.SLOWBRO ]}, { 1: [ SpeciesId.WINGULL ], 25: [ SpeciesId.PELIPPER ]}, SpeciesId.CRAMORANT, { 1: [ SpeciesId.FINIZEN ], 38: [ SpeciesId.PALAFIN ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.SLOWPOKE ], 37: [ SpeciesId.SLOWBRO ]}, { 1: [ SpeciesId.WINGULL ], 25: [ SpeciesId.PELIPPER ]}, SpeciesId.CRAMORANT, { 1: [ SpeciesId.FINIZEN ], 38: [ SpeciesId.PALAFIN ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.INKAY ], 30: [ SpeciesId.MALAMAR ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.FINNEON ], 31: [ SpeciesId.LUMINEON ]}, { 1: [ SpeciesId.INKAY ], 30: [ SpeciesId.MALAMAR ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TENTACOOL ], 30: [ SpeciesId.TENTACRUEL ]}, { 1: [ SpeciesId.MAGIKARP ], 20: [ SpeciesId.GYARADOS ]}, { 1: [ SpeciesId.BUIZEL ], 26: [ SpeciesId.FLOATZEL ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.STARYU ], 30: [ SpeciesId.STARMIE ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.STARYU ], 30: [ SpeciesId.STARMIE ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.SLOWPOKE ], 37: [ SpeciesId.SLOWBRO ]}, SpeciesId.SHELLDER, { 1: [ SpeciesId.CARVANHA ], 30: [ SpeciesId.SHARPEDO ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.SLOWPOKE ], 37: [ SpeciesId.SLOWBRO ]}, SpeciesId.SHELLDER, { 1: [ SpeciesId.CHINCHOU ], 27: [ SpeciesId.LANTURN ]}, { 1: [ SpeciesId.CARVANHA ], 30: [ SpeciesId.SHARPEDO ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.POLIWAG ], 25: [ SpeciesId.POLIWHIRL ]},
        { 1: [ SpeciesId.HORSEA ], 32: [ SpeciesId.SEADRA ]},
        { 1: [ SpeciesId.GOLDEEN ], 33: [ SpeciesId.SEAKING ]},
        { 1: [ SpeciesId.WAILMER ], 40: [ SpeciesId.WAILORD ]},
        { 1: [ SpeciesId.PANPOUR ], 30: [ SpeciesId.SIMIPOUR ]},
        { 1: [ SpeciesId.WATTREL ], 25: [ SpeciesId.KILOWATTREL ]}
      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.LAPRAS, { 1: [ SpeciesId.PIPLUP ], 16: [ SpeciesId.PRINPLUP ], 36: [ SpeciesId.EMPOLEON ]}, { 1: [ SpeciesId.POPPLIO ], 17: [ SpeciesId.BRIONNE ], 34: [ SpeciesId.PRIMARINA ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.KINGDRA, SpeciesId.ROTOM, { 1: [ SpeciesId.TIRTOUGA ], 37: [ SpeciesId.CARRACOSTA ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.PELIPPER, SpeciesId.CRAMORANT, SpeciesId.PALAFIN ],
      [TimeOfDay.DAY]: [ SpeciesId.PELIPPER, SpeciesId.CRAMORANT, SpeciesId.PALAFIN ],
      [TimeOfDay.DUSK]: [ SpeciesId.SHARPEDO, SpeciesId.MALAMAR ],
      [TimeOfDay.NIGHT]: [ SpeciesId.SHARPEDO, SpeciesId.LUMINEON, SpeciesId.MALAMAR ],
      [TimeOfDay.ALL]: [ SpeciesId.TENTACRUEL, SpeciesId.FLOATZEL, SpeciesId.SIMIPOUR, SpeciesId.KILOWATTREL ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.KINGDRA, SpeciesId.EMPOLEON, SpeciesId.PRIMARINA ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ROTOM, SpeciesId.PHIONE, SpeciesId.MANAPHY ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.LUGIA ]}
  },
  [BiomeId.SWAMP]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.WOOPER ], 20: [ SpeciesId.QUAGSIRE ]}, { 1: [ SpeciesId.LOTAD ], 14: [ SpeciesId.LOMBRE ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.WOOPER ], 20: [ SpeciesId.QUAGSIRE ]}, { 1: [ SpeciesId.LOTAD ], 14: [ SpeciesId.LOMBRE ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]}, { 1: [ SpeciesId.PALDEA_WOOPER ], 20: [ SpeciesId.CLODSIRE ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]}, { 1: [ SpeciesId.PALDEA_WOOPER ], 20: [ SpeciesId.CLODSIRE ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.POLIWAG ], 25: [ SpeciesId.POLIWHIRL ]},
        { 1: [ SpeciesId.GULPIN ], 26: [ SpeciesId.SWALOT ]},
        { 1: [ SpeciesId.SHELLOS ], 30: [ SpeciesId.GASTRODON ]},
        { 1: [ SpeciesId.TYMPOLE ], 25: [ SpeciesId.PALPITOAD ], 36: [ SpeciesId.SEISMITOAD ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.CROAGUNK ], 37: [ SpeciesId.TOXICROAK ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.CROAGUNK ], 37: [ SpeciesId.TOXICROAK ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.PSYDUCK ], 33: [ SpeciesId.GOLDUCK ]},
        { 1: [ SpeciesId.BARBOACH ], 30: [ SpeciesId.WHISCASH ]},
        { 1: [ SpeciesId.SKORUPI ], 40: [ SpeciesId.DRAPION ]},
        SpeciesId.STUNFISK,
        { 1: [ SpeciesId.MAREANIE ], 38: [ SpeciesId.TOXAPEX ]}
      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TOTODILE ], 18: [ SpeciesId.CROCONAW ], 30: [ SpeciesId.FERALIGATR ]}, { 1: [ SpeciesId.MUDKIP ], 16: [ SpeciesId.MARSHTOMP ], 36: [ SpeciesId.SWAMPERT ]}]
    },
    [BiomePoolTier.SUPER_RARE]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.GALAR_SLOWPOKE ], 40: [ SpeciesId.GALAR_SLOWBRO ]}, { 1: [ SpeciesId.HISUI_SLIGGOO ], 80: [ SpeciesId.HISUI_GOODRA ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.GALAR_SLOWPOKE ], 40: [ SpeciesId.GALAR_SLOWBRO ]}, { 1: [ SpeciesId.HISUI_SLIGGOO ], 80: [ SpeciesId.HISUI_GOODRA ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.POLITOED, SpeciesId.GALAR_STUNFISK ]
    },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.PECHARUNT ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.QUAGSIRE, SpeciesId.LUDICOLO ],
      [TimeOfDay.DAY]: [ SpeciesId.QUAGSIRE, SpeciesId.LUDICOLO ],
      [TimeOfDay.DUSK]: [ SpeciesId.ARBOK, SpeciesId.CLODSIRE ],
      [TimeOfDay.NIGHT]: [ SpeciesId.ARBOK, SpeciesId.CLODSIRE ],
      [TimeOfDay.ALL]: [ SpeciesId.POLIWRATH, SpeciesId.SWALOT, SpeciesId.WHISCASH, SpeciesId.GASTRODON, SpeciesId.SEISMITOAD, SpeciesId.STUNFISK, SpeciesId.TOXAPEX ]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [ SpeciesId.GALAR_SLOWBRO, SpeciesId.GALAR_SLOWKING, SpeciesId.HISUI_GOODRA ],
      [TimeOfDay.DAY]: [ SpeciesId.GALAR_SLOWBRO, SpeciesId.GALAR_SLOWKING, SpeciesId.HISUI_GOODRA ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.FERALIGATR, SpeciesId.POLITOED, SpeciesId.SWAMPERT, SpeciesId.GALAR_STUNFISK ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.PECHARUNT ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.BEACH]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.STARYU ], 30: [ SpeciesId.STARMIE ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.STARYU ], 30: [ SpeciesId.STARMIE ]}],
      [TimeOfDay.DUSK]: [ SpeciesId.SHELLDER ],
      [TimeOfDay.NIGHT]: [ SpeciesId.SHELLDER ],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.KRABBY ], 28: [ SpeciesId.KINGLER ]},
        { 1: [ SpeciesId.CORPHISH ], 30: [ SpeciesId.CRAWDAUNT ]},
        { 1: [ SpeciesId.DWEBBLE ], 34: [ SpeciesId.CRUSTLE ]},
        { 1: [ SpeciesId.BINACLE ], 39: [ SpeciesId.BARBARACLE ]},
        { 1: [ SpeciesId.MAREANIE ], 38: [ SpeciesId.TOXAPEX ]},
        { 1: [ SpeciesId.WIGLETT ], 26: [ SpeciesId.WUGTRIO ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.WORMADAM ]}, { 1: [ SpeciesId.CLAUNCHER ], 37: [ SpeciesId.CLAWITZER ]}, { 1: [ SpeciesId.SANDYGAST ], 42: [ SpeciesId.PALOSSAND ]}]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.QUAXLY ], 16: [ SpeciesId.QUAXWELL ], 36: [ SpeciesId.QUAQUAVAL ]}, SpeciesId.TATSUGIRI ]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TIRTOUGA ], 37: [ SpeciesId.CARRACOSTA ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CRESSELIA, SpeciesId.KELDEO ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.STARMIE ],
      [TimeOfDay.DAY]: [ SpeciesId.STARMIE ],
      [TimeOfDay.DUSK]: [ SpeciesId.CLOYSTER ],
      [TimeOfDay.NIGHT]: [ SpeciesId.CLOYSTER ],
      [TimeOfDay.ALL]: [ SpeciesId.KINGLER, SpeciesId.CRAWDAUNT, SpeciesId.WORMADAM, SpeciesId.CRUSTLE, SpeciesId.BARBARACLE, SpeciesId.CLAWITZER, SpeciesId.TOXAPEX, SpeciesId.PALOSSAND ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CARRACOSTA, SpeciesId.QUAQUAVAL ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CRESSELIA, SpeciesId.KELDEO ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.DRAKE_LAKE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.LOTAD ], 14: [ SpeciesId.LOMBRE ]}, { 1: [ SpeciesId.DUCKLETT ], 35: [ SpeciesId.SWANNA ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.LOTAD ], 14: [ SpeciesId.LOMBRE ]}, { 1: [ SpeciesId.DUCKLETT ], 35: [ SpeciesId.SWANNA ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.MARILL ], 18: [ SpeciesId.AZUMARILL ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.MARILL ], 18: [ SpeciesId.AZUMARILL ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.PSYDUCK ], 33: [ SpeciesId.GOLDUCK ]},
        { 1: [ SpeciesId.GOLDEEN ], 33: [ SpeciesId.SEAKING ]},
        { 1: [ SpeciesId.MAGIKARP ], 20: [ SpeciesId.GYARADOS ]},
        { 1: [ SpeciesId.CHEWTLE ], 22: [ SpeciesId.DREDNAW ]},
        { 1: [ SpeciesId.TIRTOUGA ], 37: [ SpeciesId.CARRACOSTA ]},
        { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.FLAPPLE ]},
        { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.APPLETUN ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.DEWPIDER ], 22: [ SpeciesId.ARAQUANID ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.DEWPIDER ], 22: [ SpeciesId.ARAQUANID ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SLOWPOKE ], 37: [ SpeciesId.SLOWBRO ]}, { 1: [ SpeciesId.WOOPER ], 20: [ SpeciesId.QUAGSIRE ]}, { 1: [ SpeciesId.SURSKIT ], 22: [ SpeciesId.MASQUERAIN ]}, SpeciesId.WISHIWASHI, SpeciesId.FLAMIGO, { 1: [ SpeciesId.HORSEA ], 32: [ SpeciesId.SEADRA ], 40: [ SpeciesId.KINGDRA ]}, { 1: [ SpeciesId.SWABLU ], 35: [ SpeciesId.ALTARIA ]}, { 1: [ SpeciesId.AXEW ], 32: [ SpeciesId.FRAXURE ], 48: [ SpeciesId.HAXORUS ]}, SpeciesId.DRUDDIGON, SpeciesId.DRAMPA, { 1: [ SpeciesId.SKRELP ], 48: [ SpeciesId.DRAGALGE ]}, SpeciesId.CYCLIZAR, SpeciesId.TATSUGIRI, SpeciesId.DONDOZO, { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.DIPPLIN ], 35: [ SpeciesId.HYDRAPPLE ]}, { 1: [ SpeciesId.CORPHISH ], 30: [ SpeciesId.CRAWDAUNT ]}, { 1: [ SpeciesId.BARBOACH ], 30: [ SpeciesId.WHISCASH ]}]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.SQUIRTLE ], 16: [ SpeciesId.WARTORTLE ], 36: [ SpeciesId.BLASTOISE ]},
        { 1: [ SpeciesId.DRATINI ], 30: [ SpeciesId.DRAGONAIR ], 55: [ SpeciesId.DRAGONITE ]},
        { 1: [ SpeciesId.BAGON ], 30: [ SpeciesId.SHELGON ], 50: [ SpeciesId.SALAMENCE ]},
        { 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]},
        { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.SLIGGOO ], 50: [ SpeciesId.GOODRA ]},
        { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.HISUI_SLIGGOO ], 50: [ SpeciesId.HISUI_GOODRA ]},
        { 1: [ SpeciesId.DREEPY ], 50: [ SpeciesId.DRAKLOAK ], 60: [ SpeciesId.DRAGAPULT ]},
        { 1: [ SpeciesId.FRIGIBAX ], 35: [ SpeciesId.ARCTIBAX ], 54: [ SpeciesId.BAXCALIBUR ]},
        { 1: [ SpeciesId.DURALUDON ], 50: [ SpeciesId.ARCHALUDON ]},
        { 1: [ SpeciesId.FEEBAS ], 35: [ SpeciesId.MILOTIC ]},
        SpeciesId.DRACOZOLT,
        SpeciesId.ARCTOZOLT,
        SpeciesId.DRACOVISH,
        SpeciesId.ARCTOVISH,
        SpeciesId.LAPRAS
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VAPOREON, SpeciesId.SLOWKING ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.WALKING_WAKE ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.SWANNA, SpeciesId.ARAQUANID ],
      [TimeOfDay.DAY]: [ SpeciesId.SWANNA, SpeciesId.ARAQUANID ],
      [TimeOfDay.DUSK]: [ SpeciesId.AZUMARILL ],
      [TimeOfDay.NIGHT]: [ SpeciesId.AZUMARILL ],
      [TimeOfDay.ALL]: [ SpeciesId.GOLDUCK, SpeciesId.SLOWBRO, SpeciesId.SEAKING, SpeciesId.GYARADOS, SpeciesId.MASQUERAIN, SpeciesId.WISHIWASHI, SpeciesId.SWANNA, SpeciesId.DREDNAW, SpeciesId.CARRACOSTA, SpeciesId.FLAPPLE, SpeciesId.APPLETUN, SpeciesId.KINGDRA, SpeciesId.ALTARIA, SpeciesId.HAXORUS, SpeciesId.DRUDDIGON, SpeciesId.DRAMPA, SpeciesId.DRAGALGE, SpeciesId.CYCLIZAR, SpeciesId.TATSUGIRI, SpeciesId.DONDOZO, SpeciesId.HYDRAPPLE, SpeciesId.CRAWDAUNT, SpeciesId.WHISCASH ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.BLASTOISE, SpeciesId.VAPOREON, SpeciesId.SLOWKING, SpeciesId.DRAGONITE, SpeciesId.SALAMENCE, SpeciesId.HYDREIGON, SpeciesId.GOODRA, SpeciesId.HISUI_GOODRA, SpeciesId.DRAGAPULT, SpeciesId.BAXCALIBUR, SpeciesId.ARCHALUDON, SpeciesId.MILOTIC, SpeciesId.DRACOZOLT, SpeciesId.ARCTOZOLT, SpeciesId.DRACOVISH, SpeciesId.ARCTOVISH, SpeciesId.LAPRAS ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.WALKING_WAKE ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.WYVERN_MOUNTAIN]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]}, 
        { 1: [ SpeciesId.SPEAROW ], 20: [ SpeciesId.FEAROW ]},
        { 1: [ SpeciesId.WOOBAT ], 22: [ SpeciesId.SWOOBAT ]},
        { 1: [ SpeciesId.ONIX ], 25: [ SpeciesId.STEELIX ]},
        { 1: [ SpeciesId.EXEGGCUTE ], 35: [ SpeciesId.ALOLA_EXEGGUTOR ]},
        { 1: [ SpeciesId.CUBONE ], 37: [ SpeciesId.ALOLA_MAROWAK ]},
        { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.FLAPPLE ]},
        { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.APPLETUN ]},
        { 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ], 36: [ SpeciesId.NIDOQUEEN ]},
        { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ], 36: [ SpeciesId.NIDOKING ]},
        { 1: [ SpeciesId.ALOLA_GEODUDE ], 25: [ SpeciesId.ALOLA_GRAVELER ], 36: [ SpeciesId.ALOLA_GOLEM ]},
        { 1: [ SpeciesId.HOOTHOOT ], 20: [ SpeciesId.NOCTOWL ]},
        { 1: [ SpeciesId.ZUBAT ], 22: [ SpeciesId.GOLBAT ], 35: [ SpeciesId.CROBAT ]},
        { 1: [ SpeciesId.NATU ], 25: [ SpeciesId.XATU ]},
        { 1: [ SpeciesId.MAREEP ], 15: [ SpeciesId.FLAAFFY ], 30: [ SpeciesId.AMPHAROS ]},
        { 1: [ SpeciesId.TAILLOW ], 22: [ SpeciesId.SWELLOW ]},
        { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]},
        { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUILL ], 32: [ SpeciesId.UNFEZANT ]},
        { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]},
        { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ], 35: [ SpeciesId.GIGALITH ]},
        { 1: [ SpeciesId.NACLI ], 24: [ SpeciesId.NACLSTACK ], 38: [ SpeciesId.GARGANACL ]},
        { 1: [ SpeciesId.SCRAGGY ], 39: [ SpeciesId.SCRAFTY ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ], 45: [ SpeciesId.RHYPERIOR ]}, SpeciesId.KANGASKHAN, { 1: [ SpeciesId.SCYTHER ], 35: [ SpeciesId.SCIZOR ]}, { 1: [ SpeciesId.SCYTHER ], 35: [ SpeciesId.KLEAVOR ]}, SpeciesId.AERODACTYL, { 1: [ SpeciesId.MUNCHLAX ], 35: [ SpeciesId.SNORLAX ]}, { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNIGHT ]}, { 1: [ SpeciesId.SWABLU ], 35: [ SpeciesId.ALTARIA ]}, { 1: [ SpeciesId.AXEW ], 32: [ SpeciesId.FRAXURE ], 48: [ SpeciesId.HAXORUS ]}, SpeciesId.DRUDDIGON, SpeciesId.DRAMPA, { 1: [ SpeciesId.GLIGAR ], 35: [ SpeciesId.GLISCOR ]}, SpeciesId.CYCLIZAR, SpeciesId.SKARMORY, SpeciesId.BOMBIRDIER, { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.DIPPLIN ], 35: [ SpeciesId.HYDRAPPLE ]}, { 1: [ SpeciesId.MURKROW ], 30: [ SpeciesId.HONCHKROW ]}, { 1: [ SpeciesId.YANMA ], 33: [ SpeciesId.YANMEGA ]}, { 1: [ SpeciesId.DRIFLOON ], 28: [ SpeciesId.DRIFBLIM ]}, { 1: [ SpeciesId.NOIBAT ], 48: [ SpeciesId.NOIVERN ]}, { 1: [ SpeciesId.SALANDIT ], 35: [ SpeciesId.SALAZZLE ]}, { 1: [ SpeciesId.TRAPINCH ], 35: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]}, { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]}, { 1: [ SpeciesId.NOSEPASS ], 35: [ SpeciesId.PROBOPASS ]}, { 1: [ SpeciesId.ROCKRUFF ], 25: [ SpeciesId.LYCANROC ]}, SpeciesId.KLAWF, { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]}, { 1: [ SpeciesId.RUFFLET ], 54: [ SpeciesId.BRAVIARY ]}, { 1: [ SpeciesId.VULLABY ], 54: [ SpeciesId.MANDIBUZZ ]}, SpeciesId.TROPIUS ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR], 55: [ SpeciesId.TYRANITAR ]},
        { 1: [ SpeciesId.DRATINI ], 30: [ SpeciesId.DRAGONAIR ], 55: [ SpeciesId.DRAGONITE ]},
        { 1: [ SpeciesId.BAGON ], 30: [ SpeciesId.SHELGON ], 50: [ SpeciesId.SALAMENCE ]},
        { 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]},
        { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.SLIGGOO ], 50: [ SpeciesId.GOODRA ]},
        { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.HISUI_SLIGGOO ], 50: [ SpeciesId.HISUI_GOODRA ]},
        { 1: [ SpeciesId.DREEPY ], 50: [ SpeciesId.DRAKLOAK ], 60: [ SpeciesId.DRAGAPULT ]},
        { 1: [ SpeciesId.FRIGIBAX ], 35: [ SpeciesId.ARCTIBAX ], 54: [ SpeciesId.BAXCALIBUR ]},
        { 1: [ SpeciesId.JANGMO_O ], 35: [ SpeciesId.HAKAMO_O ], 45: [ SpeciesId.KOMMO_O ]},
        { 1: [ SpeciesId.GIBLE ], 24: [ SpeciesId.GABITE ], 48: [ SpeciesId.GARCHOMP ]},
        { 1: [ SpeciesId.DURALUDON ], 50: [ SpeciesId.ARCHALUDON ]},
        { 1: [ SpeciesId.TYRUNT ], 39: [ SpeciesId.TYRANTRUM ]},
        { 1: [ SpeciesId.AMAURA ], 39: [ SpeciesId.AURORUS ]},
        { 1: [ SpeciesId.CRANIDOS ], 30: [ SpeciesId.RAMPARDOS ]},
        { 1: [ SpeciesId.SHIELDON ], 30: [ SpeciesId.BASTIODON ]},
        { 1: [ SpeciesId.ARCHEN ], 37: [ SpeciesId.ARCHEOPS ]},
        SpeciesId.DRACOZOLT,
        SpeciesId.ARCTOZOLT,
        SpeciesId.DRACOVISH,
        SpeciesId.ARCTOVISH
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.GLIMMET ], 35: [ SpeciesId.GLIMMORA ]}, { 1: [ SpeciesId.RUFFLET ], 54: [ SpeciesId.HISUI_BRAVIARY ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_THORNS ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.PIDGEOT, SpeciesId.FEAROW, SpeciesId.SWOOBAT, SpeciesId.STEELIX, SpeciesId.ALOLA_EXEGGUTOR, SpeciesId.ALOLA_MAROWAK, SpeciesId.FLAPPLE, SpeciesId.APPLETUN, SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.ALOLA_GOLEM, SpeciesId.NOCTOWL, SpeciesId.CROBAT, SpeciesId.XATU, SpeciesId.AMPHAROS, SpeciesId.SWELLOW, SpeciesId.STARAPTOR, SpeciesId.UNFEZANT, SpeciesId.TALONFLAME, SpeciesId.GIGALITH, SpeciesId.GARGANACL, SpeciesId.RHYPERIOR, SpeciesId.KANGASKHAN, SpeciesId.SCIZOR, SpeciesId.KLEAVOR, SpeciesId.AERODACTYL, SpeciesId.SNORLAX, SpeciesId.CORVIKNIGHT, SpeciesId.ALTARIA, SpeciesId.HAXORUS, SpeciesId.DRUDDIGON, SpeciesId.DRAMPA, SpeciesId.GLISCOR, SpeciesId.CYCLIZAR, SpeciesId.SKARMORY, SpeciesId.BOMBIRDIER, SpeciesId.HYDRAPPLE, SpeciesId.HONCHKROW, SpeciesId.YANMEGA, SpeciesId.DRIFBLIM, SpeciesId.NOIVERN, SpeciesId.SALAZZLE, SpeciesId.FLYGON, SpeciesId.AGGRON, SpeciesId.PROBOPASS, SpeciesId.LYCANROC, SpeciesId.KLAWF, SpeciesId.KROOKODILE, SpeciesId.BRAVIARY, SpeciesId.MANDIBUZZ, SpeciesId.TROPIUS ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TYRANITAR, SpeciesId.KOMMO_O, SpeciesId.GARCHOMP, SpeciesId.DRAGONITE, SpeciesId.SALAMENCE, SpeciesId.HYDREIGON, SpeciesId.GOODRA, SpeciesId.HISUI_GOODRA, SpeciesId.DRAGAPULT, SpeciesId.BAXCALIBUR, SpeciesId.ARCHALUDON, SpeciesId.TYRANTRUM, SpeciesId.DRACOZOLT, SpeciesId.ARCTOZOLT, SpeciesId.DRACOVISH, SpeciesId.ARCTOVISH, SpeciesId.RAMPARDOS, SpeciesId.BASTIODON, SpeciesId.ARCHEOPS, SpeciesId.GLIMMORA, SpeciesId.HISUI_BRAVIARY ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_THORNS ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ZYGARDE ]}
  },
  [BiomeId.LAKE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.LOTAD ], 14: [ SpeciesId.LOMBRE ]}, { 1: [ SpeciesId.DUCKLETT ], 35: [ SpeciesId.SWANNA ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.LOTAD ], 14: [ SpeciesId.LOMBRE ]}, { 1: [ SpeciesId.DUCKLETT ], 35: [ SpeciesId.SWANNA ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.MARILL ], 18: [ SpeciesId.AZUMARILL ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.MARILL ], 18: [ SpeciesId.AZUMARILL ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.PSYDUCK ], 33: [ SpeciesId.GOLDUCK ]},
        { 1: [ SpeciesId.GOLDEEN ], 33: [ SpeciesId.SEAKING ]},
        { 1: [ SpeciesId.MAGIKARP ], 20: [ SpeciesId.GYARADOS ]},
        { 1: [ SpeciesId.CHEWTLE ], 22: [ SpeciesId.DREDNAW ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.DEWPIDER ], 22: [ SpeciesId.ARAQUANID ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.DEWPIDER ], 22: [ SpeciesId.ARAQUANID ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SLOWPOKE ], 37: [ SpeciesId.SLOWBRO ]}, { 1: [ SpeciesId.WOOPER ], 20: [ SpeciesId.QUAGSIRE ]}, { 1: [ SpeciesId.SURSKIT ], 22: [ SpeciesId.MASQUERAIN ]}, SpeciesId.WISHIWASHI, SpeciesId.FLAMIGO ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.SQUIRTLE ], 16: [ SpeciesId.WARTORTLE ], 36: [ SpeciesId.BLASTOISE ]},
        { 1: [ SpeciesId.OSHAWOTT ], 17: [ SpeciesId.DEWOTT ], 36: [ SpeciesId.SAMUROTT ]},
        { 1: [ SpeciesId.FROAKIE ], 16: [ SpeciesId.FROGADIER ], 36: [ SpeciesId.GRENINJA ]},
        { 1: [ SpeciesId.SOBBLE ], 16: [ SpeciesId.DRIZZILE ], 35: [ SpeciesId.INTELEON ]}
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VAPOREON, SpeciesId.SLOWKING ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MESPRIT ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.SWANNA, SpeciesId.ARAQUANID ],
      [TimeOfDay.DAY]: [ SpeciesId.SWANNA, SpeciesId.ARAQUANID ],
      [TimeOfDay.DUSK]: [ SpeciesId.AZUMARILL ],
      [TimeOfDay.NIGHT]: [ SpeciesId.AZUMARILL ],
      [TimeOfDay.ALL]: [ SpeciesId.GOLDUCK, SpeciesId.SLOWBRO, SpeciesId.SEAKING, SpeciesId.GYARADOS, SpeciesId.MASQUERAIN, SpeciesId.WISHIWASHI, SpeciesId.SWANNA, SpeciesId.DREDNAW ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.BLASTOISE, SpeciesId.VAPOREON, SpeciesId.SLOWKING, SpeciesId.SAMUROTT, SpeciesId.GRENINJA, SpeciesId.INTELEON ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MESPRIT ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.GLACIER_LAKE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.SEEL ], 34: [ SpeciesId.DEWGONG ]}, { 1: [ SpeciesId.DUCKLETT ], 35: [ SpeciesId.SWANNA ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.SEEL ], 34: [ SpeciesId.DEWGONG ]}, { 1: [ SpeciesId.DUCKLETT ], 35: [ SpeciesId.SWANNA ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.MARILL ], 18: [ SpeciesId.AZUMARILL ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.MARILL ], 18: [ SpeciesId.AZUMARILL ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.PSYDUCK ], 33: [ SpeciesId.GOLDUCK ]},
        { 1: [ SpeciesId.GOLDEEN ], 33: [ SpeciesId.SEAKING ]},
        { 1: [ SpeciesId.MAGIKARP ], 20: [ SpeciesId.GYARADOS ]},
        { 1: [ SpeciesId.SNEASEL ], 35: [ SpeciesId.WEAVILE ]},
        { 1: [ SpeciesId.SHELLDER ], 34: [ SpeciesId.CLOYSTER ]},
        { 1: [ SpeciesId.KRABBY ], 28: [ SpeciesId.KINGLER ]},
        { 1: [ SpeciesId.SMOOCHUM ], 30: [ SpeciesId.JYNX ]},
        { 1: [ SpeciesId.VANILLITE ], 35: [ SpeciesId.VANILLISH ], 47: [ SpeciesId.VANILUXE ]},
        SpeciesId.DELIBIRD
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.CUBCHOO ], 37: [ SpeciesId.BEARTIC ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.CUBCHOO ], 37: [ SpeciesId.BEARTIC ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SLOWPOKE ], 37: [ SpeciesId.SLOWBRO ]}, { 1: [ SpeciesId.HISUI_SNEASEL ], 35: [ SpeciesId.SNEASLER ]}, { 1: [ SpeciesId.SNOVER ], 40: [ SpeciesId.ABOMASNOW ]}, { 1: [ SpeciesId.SNORUNT ], 42: [ SpeciesId.GLALIE ]}, { 1: [ SpeciesId.SNORUNT ], 42: [ SpeciesId.FROSLASS ]}, { 1: [ SpeciesId.SPHEAL ], 32: [ SpeciesId.SEALEO ], 44: [ SpeciesId.WALREIN ]}, { 1: [ SpeciesId.VANILLITE ], 35: [ SpeciesId.VANILLISH ], 47: [ SpeciesId.VANILUXE ]}, { 1: [ SpeciesId.BERGMITE ], 37: [ SpeciesId.AVALUGG ]}, { 1: [ SpeciesId.ALOLA_SANDSHREW ], 22: [ SpeciesId.ALOLA_SANDSLASH ]}, { 1: [ SpeciesId.ALOLA_VULPIX ], 37: [ SpeciesId.ALOLA_NINETALES ]}, { 1: [ SpeciesId.CRABRAWLER ], 37: [ SpeciesId.CRABOMINABLE ]}, { 1: [ SpeciesId.MIME_JR ], 15: [ SpeciesId.GALAR_MR_MIME ], 42: [ SpeciesId.MR_RIME ]}, { 1: [ SpeciesId.CETODDLE ], 35: [ SpeciesId.CETITAN ]}, SpeciesId.WISHIWASHI, SpeciesId.FLAMIGO, SpeciesId.CRYGONAL, SpeciesId.EISCUE ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.LAPRAS,
        { 1: [ SpeciesId.OSHAWOTT ], 17: [ SpeciesId.DEWOTT ], 36: [ SpeciesId.SAMUROTT ]},
        { 1: [ SpeciesId.PIPLUP ], 16: [ SpeciesId.PRINPLUP ], 36: [ SpeciesId.EMPOLEON ]},
        { 1: [ SpeciesId.AMAURA ], 39: [ SpeciesId.AURORUS ]},
        { 1: [ SpeciesId.BERGMITE ], 37: [ SpeciesId.HISUI_AVALUGG ]},
        { 1: [ SpeciesId.GALAR_DARUMAKA ], 35: [ SpeciesId.GALAR_DARMANITAN ]},
        { 1: [ SpeciesId.OSHAWOTT ], 17: [ SpeciesId.DEWOTT ], 36: [ SpeciesId.HISUI_SAMUROTT ]},
        SpeciesId.ARCTOZOLT,
        SpeciesId.ARCTOVISH,
        { 1: [ SpeciesId.FEEBAS ], 35: [ SpeciesId.MILOTIC ]},
        { 1: [ SpeciesId.FRIGIBAX ], 35: [ SpeciesId.ARCTIBAX ], 54: [ SpeciesId.BAXCALIBUR ]}
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VAPOREON, SpeciesId.SLOWKING, SpeciesId.GLACEON ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GALAR_ARTICUNO ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.SWANNA, SpeciesId.DEWGONG ],
      [TimeOfDay.DAY]: [ SpeciesId.SWANNA, SpeciesId.DEWGONG ],
      [TimeOfDay.DUSK]: [ SpeciesId.AZUMARILL ],
      [TimeOfDay.NIGHT]: [ SpeciesId.AZUMARILL ],
      [TimeOfDay.ALL]: [ SpeciesId.GOLDUCK, SpeciesId.SLOWBRO, SpeciesId.SEAKING, SpeciesId.GYARADOS, SpeciesId.WEAVILE, SpeciesId.WISHIWASHI, SpeciesId.SWANNA, SpeciesId.CLOYSTER, SpeciesId.KINGLER, SpeciesId.JYNX, SpeciesId.VANILUXE, SpeciesId.DELIBIRD, SpeciesId.SNEASLER, SpeciesId.ABOMASNOW, SpeciesId.GLALIE, SpeciesId.FROSLASS, SpeciesId.WALREIN, SpeciesId.VANILUXE, SpeciesId.AVALUGG, SpeciesId.ALOLA_SANDSLASH, SpeciesId.ALOLA_NINETALES, SpeciesId.CRABOMINABLE, SpeciesId.MR_RIME, SpeciesId.CETITAN, SpeciesId.CRYGONAL, SpeciesId.EISCUE ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.AURORUS, SpeciesId.VAPOREON, SpeciesId.SLOWKING, SpeciesId.SAMUROTT, SpeciesId.HISUI_AVALUGG, SpeciesId.GALAR_DARMANITAN, SpeciesId.HISUI_SAMUROTT, SpeciesId.ARCTOZOLT, SpeciesId.ARCTOVISH, SpeciesId.BAXCALIBUR, SpeciesId.GLACEON, SpeciesId.MILOTIC
 ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GALAR_ARTICUNO ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.RIVER]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.LOTAD ], 14: [ SpeciesId.LOMBRE ]}, { 1: [ SpeciesId.DUCKLETT ], 35: [ SpeciesId.SWANNA ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.LOTAD ], 14: [ SpeciesId.LOMBRE ]}, { 1: [ SpeciesId.DUCKLETT ], 35: [ SpeciesId.SWANNA ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.MARILL ], 18: [ SpeciesId.AZUMARILL ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.MARILL ], 18: [ SpeciesId.AZUMARILL ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.PSYDUCK ], 33: [ SpeciesId.GOLDUCK ]},
        { 1: [ SpeciesId.GOLDEEN ], 33: [ SpeciesId.SEAKING ]},
        { 1: [ SpeciesId.MAGIKARP ], 20: [ SpeciesId.GYARADOS ]},
        { 1: [ SpeciesId.CHEWTLE ], 22: [ SpeciesId.DREDNAW ]},
        { 1: [ SpeciesId.PANPOUR ], 22: [ SpeciesId.SIMIPOUR ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.YANMA ], 33: [ SpeciesId.YANMEGA ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.YANMA ], 33: [ SpeciesId.YANMEGA ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SLOWPOKE ], 37: [ SpeciesId.SLOWBRO ]}, { 1: [ SpeciesId.BARBOACH ], 30: [ SpeciesId.WHISCASH ]}, { 1: [ SpeciesId.CORPHSH ], 30: [ SpeciesId.CRAWDAUNT ]}, { 1: [ SpeciesId.BUIZEL ], 30: [ SpeciesId.FLOATZEL ]}, { 1: [ SpeciesId.KRABBY ], 28: [ SpeciesId.KINGLER ]}, { 1: [ SpeciesId.SHELLDER ], 30: [ SpeciesId.CLOYSTER ]}, { 1: [ SpeciesId.BASCULIN ], 40: [ SpeciesId.BASCULEGION ]}, { 1: [ SpeciesId.TYNAMO ], 39: [ SpeciesId.EELECTRIK ], 45: [ SpeciesId.EELEKTROSS ]}, SpeciesId.FLAMIGO ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ SpeciesId.VOLBEAT, SpeciesId.ILLUMISE ],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SOBBLE ], 16: [ SpeciesId.DRIZZILE ], 35: [ SpeciesId.INTELEON ]}, SpeciesId.DONDOZO ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VAPOREON, SpeciesId.SLOWKING ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.FEEBAS ], 37: [ SpeciesId.MILOTIC ]}, SpeciesId.SUICUNE ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.SWANNA, SpeciesId.ARAQUANID ],
      [TimeOfDay.DAY]: [ SpeciesId.SWANNA, SpeciesId.ARAQUANID ],
      [TimeOfDay.DUSK]: [ SpeciesId.AZUMARILL ],
      [TimeOfDay.NIGHT]: [ SpeciesId.AZUMARILL ],
      [TimeOfDay.ALL]: [ SpeciesId.GOLDUCK, SpeciesId.SLOWBRO, SpeciesId.SEAKING, SpeciesId.GYARADOS, SpeciesId.MASQUERAIN, SpeciesId.WISHIWASHI, SpeciesId.CRAWDAUNT, SpeciesId.CLOYSTER, SpeciesId.KINGLER, SpeciesId.BASCULEGION, SpeciesId.EELEKTROSS, SpeciesId.YANMEGA, SpeciesId.SIMIPOUR, SpeciesId.DREDNAW,  SpeciesId.DONDOZO ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VAPOREON, SpeciesId.SLOWKING, SpeciesId.MILOTIC, SpeciesId.INTELEON, SpeciesId.DONDOZO ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SUICUNE ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.SEABED]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.CHINCHOU ], 27: [ SpeciesId.LANTURN ]},
        SpeciesId.REMORAID,
        SpeciesId.CLAMPERL,
        SpeciesId.BASCULIN,
        { 1: [ SpeciesId.FRILLISH ], 40: [ SpeciesId.JELLICENT ]},
        { 1: [ SpeciesId.ARROKUDA ], 26: [ SpeciesId.BARRASKEWDA ]},
        SpeciesId.VELUZA
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.TENTACOOL ], 30: [ SpeciesId.TENTACRUEL ]},
        SpeciesId.SHELLDER,
        { 1: [ SpeciesId.WAILMER ], 40: [ SpeciesId.WAILORD ]},
        SpeciesId.LUVDISC,
        { 1: [ SpeciesId.SHELLOS ], 30: [ SpeciesId.GASTRODON ]},
        { 1: [ SpeciesId.SKRELP ], 48: [ SpeciesId.DRAGALGE ]},
        SpeciesId.PINCURCHIN,
        SpeciesId.DONDOZO
      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.QWILFISH, SpeciesId.CORSOLA, SpeciesId.OCTILLERY, { 1: [ SpeciesId.MANTYKE ], 52: [ SpeciesId.MANTINE ]}, SpeciesId.ALOMOMOLA, { 1: [ SpeciesId.TYNAMO ], 39: [ SpeciesId.EELEKTRIK ]}, SpeciesId.DHELMISE ]
    },
    [BiomePoolTier.SUPER_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.OMANYTE ], 40: [ SpeciesId.OMASTAR ]},
        { 1: [ SpeciesId.KABUTO ], 40: [ SpeciesId.KABUTOPS ]},
        SpeciesId.RELICANTH,
        SpeciesId.PYUKUMUKU,
        { 1: [ SpeciesId.GALAR_CORSOLA ], 38: [ SpeciesId.CURSOLA ]},
        SpeciesId.ARCTOVISH,
        SpeciesId.HISUI_QWILFISH
      ]
    },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.FEEBAS, SpeciesId.MANAPHY ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.LANTURN, SpeciesId.QWILFISH, SpeciesId.CORSOLA, SpeciesId.OCTILLERY, SpeciesId.MANTINE, SpeciesId.WAILORD, SpeciesId.HUNTAIL, SpeciesId.GOREBYSS, SpeciesId.LUVDISC, SpeciesId.JELLICENT, SpeciesId.ALOMOMOLA, SpeciesId.DRAGALGE, SpeciesId.BARRASKEWDA, SpeciesId.DONDOZO ]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.OMASTAR, SpeciesId.KABUTOPS, SpeciesId.RELICANTH, SpeciesId.EELEKTROSS, SpeciesId.PYUKUMUKU, SpeciesId.DHELMISE, SpeciesId.CURSOLA, SpeciesId.ARCTOVISH, SpeciesId.BASCULEGION, SpeciesId.OVERQWIL ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MILOTIC, SpeciesId.MANAPHY ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.KYOGRE ]}
  },
  [BiomeId.MOUNTAIN]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [
        { 1: [ SpeciesId.TAILLOW ], 22: [ SpeciesId.SWELLOW ]},
        { 1: [ SpeciesId.SWABLU ], 35: [ SpeciesId.ALTARIA ]},
        { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]},
        { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUILL ], 32: [ SpeciesId.UNFEZANT ]},
        { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]}
      ],
      [TimeOfDay.DAY]: [
        { 1: [ SpeciesId.TAILLOW ], 22: [ SpeciesId.SWELLOW ]},
        { 1: [ SpeciesId.SWABLU ], 35: [ SpeciesId.ALTARIA ]},
        { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]},
        { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUILL ], 32: [ SpeciesId.UNFEZANT ]},
        { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]}
      ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ]}, { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]}, { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ]}, { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]}, { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]}, { 1: [ SpeciesId.SPEAROW ], 20: [ SpeciesId.FEAROW ]}, { 1: [ SpeciesId.SKIDDO ], 32: [ SpeciesId.GOGOAT ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [
        { 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ]},
        { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]},
        { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ]},
        { 1: [ SpeciesId.RUFFLET ], 54: [ SpeciesId.BRAVIARY ]},
        { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNIGHT ]},
        { 1: [ SpeciesId.FLITTLE ], 35: [ SpeciesId.ESPATHRA ]},
        SpeciesId.BOMBIRDIER
      ],
      [TimeOfDay.DAY]: [
        { 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ]},
        { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]},
        { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ]},
        { 1: [ SpeciesId.RUFFLET ], 54: [ SpeciesId.BRAVIARY ]},
        { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNIGHT ]},
        { 1: [ SpeciesId.FLITTLE ], 35: [ SpeciesId.ESPATHRA ]},
        SpeciesId.BOMBIRDIER
      ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.VULLABY ], 54: [ SpeciesId.MANDIBUZZ ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.VULLABY ], 54: [ SpeciesId.MANDIBUZZ ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.MACHOP ], 28: [ SpeciesId.MACHOKE ]},
        { 1: [ SpeciesId.GEODUDE ], 25: [ SpeciesId.GRAVELER ]},
        { 1: [ SpeciesId.NATU ], 25: [ SpeciesId.XATU ]},
        { 1: [ SpeciesId.SLUGMA ], 38: [ SpeciesId.MAGCARGO ]},
        { 1: [ SpeciesId.NACLI ], 24: [ SpeciesId.NACLSTACK ], 38: [ SpeciesId.GARGANACL ]}
      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ SpeciesId.MURKROW ],
      [TimeOfDay.ALL]: [ SpeciesId.SKARMORY, { 1: [ SpeciesId.TORCHIC ], 16: [ SpeciesId.COMBUSKEN ], 36: [ SpeciesId.BLAZIKEN ]}, { 1: [ SpeciesId.SPOINK ], 32: [ SpeciesId.GRUMPIG ]}, SpeciesId.HAWLUCHA, SpeciesId.KLAWF ]
    },
    [BiomePoolTier.SUPER_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR ]},
        { 1: [ SpeciesId.CRANIDOS ], 30: [ SpeciesId.RAMPARDOS ]},
        { 1: [ SpeciesId.SHIELDON ], 30: [ SpeciesId.BASTIODON ]},
        { 1: [ SpeciesId.GIBLE ], 24: [ SpeciesId.GABITE ], 48: [ SpeciesId.GARCHOMP ]},
        SpeciesId.ROTOM,
        SpeciesId.ARCHEOPS,
        { 1: [ SpeciesId.AXEW ], 38: [ SpeciesId.FRAXURE ]}
      ]
    },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TING_LU, SpeciesId.OGERPON ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.SWELLOW, SpeciesId.ALTARIA, SpeciesId.STARAPTOR, SpeciesId.UNFEZANT, SpeciesId.BRAVIARY, SpeciesId.TALONFLAME, SpeciesId.CORVIKNIGHT, SpeciesId.ESPATHRA ],
      [TimeOfDay.DAY]: [ SpeciesId.SWELLOW, SpeciesId.ALTARIA, SpeciesId.STARAPTOR, SpeciesId.UNFEZANT, SpeciesId.BRAVIARY, SpeciesId.TALONFLAME, SpeciesId.CORVIKNIGHT, SpeciesId.ESPATHRA ],
      [TimeOfDay.DUSK]: [ SpeciesId.MANDIBUZZ ],
      [TimeOfDay.NIGHT]: [ SpeciesId.MANDIBUZZ ],
      [TimeOfDay.ALL]: [ SpeciesId.PIDGEOT, SpeciesId.FEAROW, SpeciesId.SKARMORY, SpeciesId.AGGRON, SpeciesId.GOGOAT, SpeciesId.GARGANACL ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [ SpeciesId.HISUI_BRAVIARY ], [TimeOfDay.DAY]: [ SpeciesId.HISUI_BRAVIARY ], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ROTOM, SpeciesId.BLAZIKEN, SpeciesId.RAMPARDOS, SpeciesId.BASTIODON, SpeciesId.HAWLUCHA ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TING_LU, SpeciesId.OGERPON, SpeciesId.IRON_THORNS ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.HO_OH ]}
  },
  [BiomeId.BADLANDS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.PHANPY ], 25: [ SpeciesId.DONPHAN ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.PHANPY ], 25: [ SpeciesId.DONPHAN ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.CUBONE ], 28: [ SpeciesId.MAROWAK ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.DIGLETT ], 26: [ SpeciesId.DUGTRIO ]},
        { 1: [ SpeciesId.GEODUDE ], 25: [ SpeciesId.GRAVELER ]},
        { 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ]},
        { 1: [ SpeciesId.DRILBUR ], 31: [ SpeciesId.EXCADRILL ]},
        { 1: [ SpeciesId.MUDBRAY ], 30: [ SpeciesId.MUDSDALE ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.SIZZLIPEDE ], 28: [ SpeciesId.CENTISKORCH ]}, { 1: [ SpeciesId.CAPSAKID ], 30: [ SpeciesId.SCOVILLAIN ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.SIZZLIPEDE ], 28: [ SpeciesId.CENTISKORCH ]}, { 1: [ SpeciesId.CAPSAKID ], 30: [ SpeciesId.SCOVILLAIN ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.SANDSHREW ], 22: [ SpeciesId.SANDSLASH ]},
        { 1: [ SpeciesId.NUMEL ], 33: [ SpeciesId.CAMERUPT ]},
        { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ]},
        { 1: [ SpeciesId.CUFANT ], 34: [ SpeciesId.COPPERAJAH ]}
      ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ONIX, SpeciesId.GLIGAR, { 1: [ SpeciesId.POLTCHAGEIST ], 30: [ SpeciesId.SINISTCHA ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.OKIDOGI ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.DONPHAN, SpeciesId.CENTISKORCH, SpeciesId.SCOVILLAIN ],
      [TimeOfDay.DAY]: [ SpeciesId.DONPHAN, SpeciesId.CENTISKORCH, SpeciesId.SCOVILLAIN ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ SpeciesId.MAROWAK ],
      [TimeOfDay.ALL]: [ SpeciesId.DUGTRIO, SpeciesId.GOLEM, SpeciesId.RHYPERIOR, SpeciesId.GLISCOR, SpeciesId.EXCADRILL, SpeciesId.MUDSDALE, SpeciesId.COPPERAJAH ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.STEELIX, SpeciesId.SINISTCHA ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.OKIDOGI ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.VORTEX_CAVE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.DIGLETT ], 26: [ SpeciesId.DUGTRIO ]},
        { 1: [ SpeciesId.GEODUDE ], 25: [ SpeciesId.GRAVELER ]},
        { 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ]},
        { 1: [ SpeciesId.DRILBUR ], 31: [ SpeciesId.EXCADRILL ]},
        { 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ], 36: [ SpeciesId.NIDOQUEEN ]},
        { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ], 36: [ SpeciesId.NIDOKING ]},
        { 1: [ SpeciesId.NOSEPASS ], 35: [ SpeciesId.PROBOPASS ]},
        { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]},
        { 1: [ SpeciesId.DWEBBLE ], 34: [ SpeciesId.CRUSTLE ]},
        { 1: [ SpeciesId.SPEAROW ], 20: [ SpeciesId.FEAROW ]},
        { 1: [ SpeciesId.DODUO ], 31: [ SpeciesId.DODRIO ]},
        { 1: [ SpeciesId.NATU ], 25: [ SpeciesId.XATU ]},
        { 1: [ SpeciesId.MURKROW ], 35: [ SpeciesId.HONCHKROW ]},
        { 1: [ SpeciesId.DRIFLOON ], 28: [ SpeciesId.DRIFBLIM ]},
        SpeciesId.CARBINK,
        { 1: [ SpeciesId.ROCKRUFF ], 25: [ SpeciesId.LYCANROC ]},
        { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]},
        { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNIGHT ]},
        { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]},
        { 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]},
        { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUIL ], 32: [ SpeciesId.UNFEZANT ]},
        { 1: [ SpeciesId.PIKIPEK ], 14: [ SpeciesId.TRUMBEAK ], 28: [ SpeciesId.TOUCANNON ]},
        { 1: [ SpeciesId.ZUBAT ], 22: [ SpeciesId.GOLBAT ], 35: [ SpeciesId.CROBAT ]},
        { 1: [ SpeciesId.WOOBAT ], 22: [ SpeciesId.SWOOBAT ]},
        { 1: [ SpeciesId.HOOTHOOT ], 20: [ SpeciesId.NOCTOWL ]},
        { 1: [ SpeciesId.MUDBRAY ], 30: [ SpeciesId.MUDSDALE ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.SANDSHREW ], 22: [ SpeciesId.SANDSLASH ]},
        { 1: [ SpeciesId.NUMEL ], 33: [ SpeciesId.CAMERUPT ]},
        { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ]},
        { 1: [ SpeciesId.TRAPINCH ], 35: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]},
        { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]},
        { 1: [ SpeciesId.BALTOY ], 36: [ SpeciesId.CLAYDOL ]},
        { 1: [ SpeciesId.HIPPOPOTAS ], 34: [ SpeciesId.HIPPOWDON ]},
        { 1: [ SpeciesId.TAILLOW ], 22: [ SpeciesId.SWELLOW ]},
        { 1: [ SpeciesId.SILICOBRA ], 36: [ SpeciesId.SANDACONDA ]},
        { 1: [ SpeciesId.GALAR_YAMASK ], 34: [ SpeciesId.RUNERIGUS ]},
        { 1: [ SpeciesId.BONSLY ], 15: [ SpeciesId.SUDOWOODO ]},
        SpeciesId.SHUCKLE,
        SpeciesId.LUNATONE,
        SpeciesId.SOLROCK,
        SpeciesId.ORTHWORM,
        SpeciesId.SIGILYPH, 
        SpeciesId.TROPIUS,
        { 1: [ SpeciesId.WINGULL ], 25: [ SpeciesId.PELIPPER ]},
        { 1: [ SpeciesId.SWABLU ], 35: [ SpeciesId.ALTARIA ]},
        { 1: [ SpeciesId.NOIBAT ], 48: [ SpeciesId.NOIVERN ]},
        { 1: [ SpeciesId.WATTREL ], 25: [ SpeciesId.KILOWATTREL ]},
        { 1: [ SpeciesId.ARCHEN ], 37: [ SpeciesId.ARCHEOPS ]},
        { 1: [ SpeciesId.TYRUNT ], 39: [ SpeciesId.TYRANTRUM ]},
        { 1: [ SpeciesId.AMAURA ], 39: [ SpeciesId.AURORUS ]},
        SpeciesId.STONJOURNER,
        { 1: [ SpeciesId.RIOLU ], 35: [ SpeciesId.LUCARIO ]},
        { 1: [ SpeciesId.NACLI ], 24: [ SpeciesId.NACLSTACK ], 38: [ SpeciesId.GARGANACL ]},
        SpeciesId.KLAWF,
        SpeciesId.SKARMORY,
        SpeciesId.DURANT,
        SpeciesId.HEATMOR,
        SpeciesId.HAWLUCHA, 
        SpeciesId.BOMBIRDIER,
        SpeciesId.FALINKS,
        { 1: [ SpeciesId.HISUI_SNEASEL ], 35: [ SpeciesId.SNEASLER ]},
        { 1: [ SpeciesId.ALOLA_DIGLETT ], 26: [ SpeciesId.ALOLA_DUGTRIO ]},
        { 1: [ SpeciesId.GALAR_FARFETCHD ], 35: [ SpeciesId.SIRFETCHD ]},
        { 1: [ SpeciesId.CUFANT ], 34: [ SpeciesId.COPPERAJAH ]}
      ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ONIX, SpeciesId.GLIGAR, SpeciesId.AERODACTYL, { 1: [ SpeciesId.SCYTHER ], 35: [ SpeciesId.SCIZOR ]}, { 1: [ SpeciesId.SCYTHER ], 35: [ SpeciesId.KLEAVOR ]}, { 1: [ SpeciesId.GLIMMET ], 35: [ SpeciesId.GLIMMORA ]}, { 1: [ SpeciesId.RUFFLET ], 54: [ SpeciesId.BRAVIARY ]}, { 1: [ SpeciesId.VULLABY ], 54: [ SpeciesId.MANDIBUZZ ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.DRATINI ], 30: [ SpeciesId.DRAGONAIR ], 55: [ SpeciesId.DRAGONITE ]}, { 1: [ SpeciesId.BAGON ], 30: [ SpeciesId.SHELGON ], 50: [ SpeciesId.SALAMENCE ]}, { 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]}, { 1: [ SpeciesId.DURALUDON ], 50: [ SpeciesId.ARCHALUDON ]}, { 1: [ SpeciesId.RUFFLET ], 54: [ SpeciesId.HISUI_BRAVIARY ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.THUNDURUS ]},
    [BiomePoolTier.BOSS]: {
  [TimeOfDay.DAWN]: [],
  [TimeOfDay.DAY]: [],
  [TimeOfDay.DUSK]: [],
  [TimeOfDay.NIGHT]: [],
  [TimeOfDay.ALL]: [ SpeciesId.DUGTRIO, SpeciesId.GOLEM, SpeciesId.RHYPERIOR, SpeciesId.EXCADRILL, SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.PROBOPASS, SpeciesId.AGGRON, SpeciesId.CRUSTLE, SpeciesId.FEAROW, SpeciesId.DODRIO, SpeciesId.XATU, SpeciesId.HONCHKROW, SpeciesId.DRIFBLIM, SpeciesId.LYCANROC, SpeciesId.CORVIKNIGHT, SpeciesId.REVAVROOM, SpeciesId.TROPIUS, SpeciesId.TALONFLAME, SpeciesId.UNFEZANT, SpeciesId.TOUCANNON, SpeciesId.CROBAT, SpeciesId.SWOOBAT, SpeciesId.NOCTOWL, SpeciesId.MUDSDALE, SpeciesId.STARAPTOR, SpeciesId.PIDGEOT, SpeciesId.SANDSLASH, SpeciesId.CAMERUPT, SpeciesId.GIGALITH, SpeciesId.FLYGON, SpeciesId.KROOKODILE, SpeciesId.CLAYDOL, SpeciesId.HIPPOWDON, SpeciesId.SWELLOW, SpeciesId.SANDACONDA, SpeciesId.RUNERIGUS, SpeciesId.SUDOWOODO, SpeciesId.PELIPPER, SpeciesId.ALTARIA, SpeciesId.NOIVERN, SpeciesId.KILOWATTREL, SpeciesId.ARCHEOPS, SpeciesId.TYRANTRUM, SpeciesId.AURORUS, SpeciesId.LUCARIO, SpeciesId.GARGANACL, SpeciesId.SIRFETCHD, SpeciesId.COPPERAJAH, SpeciesId.CARBINK, SpeciesId.SHUCKLE, SpeciesId.LUNATONE, SpeciesId.SOLROCK, SpeciesId.ORTHWORM, SpeciesId.SIGILYPH, SpeciesId.KLAWF, SpeciesId.STONJOURNER, SpeciesId.SKARMORY, SpeciesId.DURANT, SpeciesId.HEATMOR, SpeciesId.HAWLUCHA, SpeciesId.BOMBIRDIER, SpeciesId.FALINKS, SpeciesId.SNEASLER ]
},
    [BiomePoolTier.BOSS_RARE]: {
  [TimeOfDay.DAWN]: [],
  [TimeOfDay.DAY]: [],
  [TimeOfDay.DUSK]: [],
  [TimeOfDay.NIGHT]: [],
  [TimeOfDay.ALL]: [ SpeciesId.STEELIX, SpeciesId.GLISCOR, SpeciesId.AERODACTYL, SpeciesId.SCIZOR, SpeciesId.KLEAVOR, SpeciesId.GLIMMORA, SpeciesId.BRAVIARY, SpeciesId.MANDIBUZZ, SpeciesId.DRAGONITE, SpeciesId.SALAMENCE, SpeciesId.HYDREIGON, SpeciesId.ARCHALUDON, SpeciesId.HISUI_BRAVIARY ]
},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.THUNDURUS ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.CANYON]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.PHANPY ], 25: [ SpeciesId.DONPHAN ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.PHANPY ], 25: [ SpeciesId.DONPHAN ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.CUBONE ], 28: [ SpeciesId.MAROWAK ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.DIGLETT ], 26: [ SpeciesId.DUGTRIO ]},
        { 1: [ SpeciesId.GEODUDE ], 25: [ SpeciesId.GRAVELER ]},
        { 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ]},
        { 1: [ SpeciesId.DRILBUR ], 31: [ SpeciesId.EXCADRILL ]},
        { 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ], 36: [ SpeciesId.NIDOQUEEN ]},
        { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ], 36: [ SpeciesId.NIDOKING ]},
        { 1: [ SpeciesId.SLUGMA ], 38: [ SpeciesId.MAGCARGO ]},
        { 1: [ SpeciesId.NOSEPASS ], 35: [ SpeciesId.PROBOPASS ]},
        { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]},
        { 1: [ SpeciesId.DWEBBLE ], 34: [ SpeciesId.CRUSTLE ]},
        { 1: [ SpeciesId.SPEAROW ], 20: [ SpeciesId.FEAROW ]},
        { 1: [ SpeciesId.DODUO ], 31: [ SpeciesId.DODRIO ]},
        { 1: [ SpeciesId.NATU ], 25: [ SpeciesId.XATU ]},
        { 1: [ SpeciesId.MURKROW ], 35: [ SpeciesId.HONCHKROW ]},
        { 1: [ SpeciesId.DRIFLOON ], 28: [ SpeciesId.DRIFBLIM ]},
        SpeciesId.CARBINK,
        { 1: [ SpeciesId.ROCKRUFF ], 25: [ SpeciesId.LYCANROC ]},
        { 1: [ SpeciesId.ROLYCOLY ], 18: [ SpeciesId.CARKOL ], 34: [ SpeciesId.COALOSSAL ]},
        { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNIGHT ]},
        { 1: [ SpeciesId.VAROOM ], 40: [ SpeciesId.REVAVROOM ]},
        { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]},
        { 1: [ SpeciesId.MANKEY ], 28: [ SpeciesId.PRIMEAPE ], 35: [ SpeciesId.ANNIHILAPE ]},
        { 1: [ SpeciesId.MACHOP ], 28: [ SpeciesId.MACHOKE ], 35: [ SpeciesId.MACHAMP ]},
        { 1: [ SpeciesId.MAKUHITA ], 24: [ SpeciesId.HARIYAMA ]},
        { 1: [ SpeciesId.MEDITITE ], 37: [ SpeciesId.MEDICHAM ]},
        { 1: [ SpeciesId.MIENFOO ], 50: [ SpeciesId.MIENSHAO ]},
        { 1: [ SpeciesId.SCRAGGY ], 39: [ SpeciesId.SCRAFTY ]},
        { 1: [ SpeciesId.PAWMI ], 18: [ SpeciesId.PAWMO ], 35: [ SpeciesId.PAWMOT ]},
        { 1: [ SpeciesId.MUDBRAY ], 30: [ SpeciesId.MUDSDALE ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.SIZZLIPEDE ], 28: [ SpeciesId.CENTISKORCH ]}, { 1: [ SpeciesId.CAPSAKID ], 30: [ SpeciesId.SCOVILLAIN ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.SIZZLIPEDE ], 28: [ SpeciesId.CENTISKORCH ]}, { 1: [ SpeciesId.CAPSAKID ], 30: [ SpeciesId.SCOVILLAIN ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.SANDSHREW ], 22: [ SpeciesId.SANDSLASH ]},
        { 1: [ SpeciesId.NUMEL ], 33: [ SpeciesId.CAMERUPT ]},
        { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ]},
        { 1: [ SpeciesId.TRAPINCH ], 35: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]},
        { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]},
        { 1: [ SpeciesId.BALTOY ], 36: [ SpeciesId.CLAYDOL ]},
        { 1: [ SpeciesId.HIPPOPOTAS ], 34: [ SpeciesId.HIPPOWDON ]},
        { 1: [ SpeciesId.GOLETT ], 43: [ SpeciesId.GOLURK ]},
        { 1: [ SpeciesId.SILICOBRA ], 36: [ SpeciesId.SANDACONDA ]},
        { 1: [ SpeciesId.GALAR_YAMASK ], 34: [ SpeciesId.RUNERIGUS ]},
        { 1: [ SpeciesId.BONSLY ], 15: [ SpeciesId.SUDOWOODO ]},
        SpeciesId.SHUCKLE,
        SpeciesId.LUNATONE,
        SpeciesId.SOLROCK,
        SpeciesId.ORTHWORM,
        SpeciesId.SIGILYPH, 
        { 1: [ SpeciesId.LILEEP ], 40: [ SpeciesId.CRADILY ]},
        { 1: [ SpeciesId.ANORITH ], 40: [ SpeciesId.ARMALDO ]},
        { 1: [ SpeciesId.CRANIDOS ], 30: [ SpeciesId.RAMPARDOS ]},
        { 1: [ SpeciesId.SHIELDON ], 30: [ SpeciesId.BASTIODON ]},
        { 1: [ SpeciesId.ARCHEN ], 37: [ SpeciesId.ARCHEOPS ]},
        { 1: [ SpeciesId.TYRUNT ], 39: [ SpeciesId.TYRANTRUM ]},
        { 1: [ SpeciesId.AMAURA ], 39: [ SpeciesId.AURORUS ]},
        SpeciesId.STONJOURNER,
        { 1: [ SpeciesId.RIOLU ], 35: [ SpeciesId.LUCARIO ]},
        { 1: [ SpeciesId.NACLI ], 24: [ SpeciesId.NACLSTACK ], 38: [ SpeciesId.GARGANACL ]},
        SpeciesId.KLAWF,
        SpeciesId.SKARMORY,
        SpeciesId.DURANT,
        SpeciesId.HEATMOR,
        SpeciesId.HAWLUCHA, 
        SpeciesId.BOMBIRDIER,
        SpeciesId.FALINKS,
        { 1: [ SpeciesId.HISUI_SNEASEL ], 35: [ SpeciesId.SNEASLER ]},
        { 1: [ SpeciesId.ALOLA_DIGLETT ], 26: [ SpeciesId.ALOLA_DUGTRIO ]},
        { 1: [ SpeciesId.PAWNIARD ], 52: [ SpeciesId.BISHARP ], 64: [ SpeciesId.KINGAMBIT ]},
        { 1: [ SpeciesId.TINKATINK ], 24: [ SpeciesId.TINKATUFF ], 38: [ SpeciesId.TINKATON ]},
        { 1: [ SpeciesId.TYROGUE ], 15: [ SpeciesId.HITMONLEE ]},
        { 1: [ SpeciesId.TYROGUE ], 15: [ SpeciesId.HITMONCHAN ]},
        { 1: [ SpeciesId.TYROGUE ], 15: [ SpeciesId.HITMONTOP ]},
        { 1: [ SpeciesId.GALAR_FARFETCHD ], 35: [ SpeciesId.SIRFETCHD ]},
        { 1: [ SpeciesId.CUFANT ], 34: [ SpeciesId.COPPERAJAH ]}
      ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ONIX, SpeciesId.GLIGAR, { 1: [ SpeciesId.POLTCHAGEIST ], 30: [ SpeciesId.SINISTCHA ]}, SpeciesId.AERODACTYL, { 1: [ SpeciesId.SCYTHER ], 35: [ SpeciesId.SCIZOR ]}, { 1: [ SpeciesId.SCYTHER ], 35: [ SpeciesId.KLEAVOR ]}, { 1: [ SpeciesId.GLIMMET ], 35: [ SpeciesId.GLIMMORA ]}, SpeciesId.DRACOZOLT, SpeciesId.ARCTOZOLT, SpeciesId.DRACOVISH, SpeciesId.ARCTOVISH, { 1: [ SpeciesId.RUFFLET ], 54: [ SpeciesId.BRAVIARY ]}, { 1: [ SpeciesId.VULLABY ], 54: [ SpeciesId.MANDIBUZZ ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR ], 55: [ SpeciesId.TYRANITAR ]}, { 1: [ SpeciesId.GIBLE ], 24: [ SpeciesId.GABITE ], 48: [ SpeciesId.GARCHOMP ]}, { 1: [ SpeciesId.BELDUM ], 20: [ SpeciesId.METANG ], 45: [ SpeciesId.METAGROSS ]}, { 1: [ SpeciesId.DURALUDON ], 50: [ SpeciesId.ARCHALUDON ]}, { 1: [ SpeciesId.RUFFLET ], 54: [ SpeciesId.HISUI_BRAVIARY ]}, { 1: [ SpeciesId.JANGMO_O ], 35: [ SpeciesId.HAKAMO_O ], 45: [ SpeciesId.KOMMO_O ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.LANDORUS ]},
    [BiomePoolTier.BOSS]: {
  [TimeOfDay.DAWN]: [ SpeciesId.DONPHAN, SpeciesId.CENTISKORCH, SpeciesId.SCOVILLAIN ],
  [TimeOfDay.DAY]: [ SpeciesId.DONPHAN, SpeciesId.CENTISKORCH, SpeciesId.SCOVILLAIN ],
  [TimeOfDay.DUSK]: [],
  [TimeOfDay.NIGHT]: [ SpeciesId.MAROWAK ],
  [TimeOfDay.ALL]: [ SpeciesId.DUGTRIO, SpeciesId.GOLEM, SpeciesId.RHYPERIOR, SpeciesId.EXCADRILL, SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.MAGCARGO, SpeciesId.PROBOPASS, SpeciesId.AGGRON, SpeciesId.CRUSTLE, SpeciesId.FEAROW, SpeciesId.DODRIO, SpeciesId.XATU, SpeciesId.HONCHKROW, SpeciesId.DRIFBLIM, SpeciesId.LYCANROC, SpeciesId.COALOSSAL, SpeciesId.CORVIKNIGHT, SpeciesId.REVAVROOM, SpeciesId.TALONFLAME, SpeciesId.ANNIHILAPE, SpeciesId.MACHAMP, SpeciesId.HARIYAMA, SpeciesId.MEDICHAM, SpeciesId.MIENSHAO, SpeciesId.SCRAFTY, SpeciesId.PAWMOT, SpeciesId.MUDSDALE, SpeciesId.SANDSLASH, SpeciesId.CAMERUPT, SpeciesId.GIGALITH, SpeciesId.FLYGON, SpeciesId.KROOKODILE, SpeciesId.CLAYDOL, SpeciesId.HIPPOWDON, SpeciesId.GOLURK, SpeciesId.SANDACONDA, SpeciesId.RUNERIGUS, SpeciesId.SUDOWOODO, SpeciesId.CRADILY, SpeciesId.ARMALDO, SpeciesId.RAMPARDOS, SpeciesId.BASTIODON, SpeciesId.ARCHEOPS, SpeciesId.TYRANTRUM, SpeciesId.AURORUS, SpeciesId.STONJOURNER, SpeciesId.LUCARIO, SpeciesId.GARGANACL, SpeciesId.KINGAMBIT, SpeciesId.TINKATON, SpeciesId.HITMONLEE, SpeciesId.HITMONCHAN, SpeciesId.HITMONTOP, SpeciesId.SIRFETCHD, SpeciesId.COPPERAJAH, SpeciesId.CARBINK, SpeciesId.SHUCKLE, SpeciesId.LUNATONE, SpeciesId.SOLROCK, SpeciesId.ORTHWORM, SpeciesId.SIGILYPH, SpeciesId.KLAWF, SpeciesId.SKARMORY, SpeciesId.DURANT, SpeciesId.HEATMOR, SpeciesId.HAWLUCHA, SpeciesId.BOMBIRDIER, SpeciesId.FALINKS, SpeciesId.SNEASLER
  ]
},
    [BiomePoolTier.BOSS_RARE]: {
  [TimeOfDay.DAWN]: [],
  [TimeOfDay.DAY]: [],
  [TimeOfDay.DUSK]: [],
  [TimeOfDay.NIGHT]: [],
  [TimeOfDay.ALL]: [ SpeciesId.STEELIX, SpeciesId.SINISTCHA, SpeciesId.GLISCOR, SpeciesId.AERODACTYL, SpeciesId.SCIZOR, SpeciesId. KLEAVOR, SpeciesId.GLIMMORA, SpeciesId.DRACOZOLT, SpeciesId.ARCTOZOLT, SpeciesId.DRACOVISH, SpeciesId.ARCTOVISH, SpeciesId.BRAVIARY, SpeciesId.MANDIBUZZ, SpeciesId.TYRANITAR, SpeciesId.GARCHOMP, SpeciesId.METAGROSS, SpeciesId.ARCHALUDON, SpeciesId.HISUI_BRAVIARY, SpeciesId.KOMMO_O ]
},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.LANDORUS ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.CAVE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.ZUBAT ], 22: [ SpeciesId.GOLBAT ]},
        { 1: [ SpeciesId.PARAS ], 24: [ SpeciesId.PARASECT ]},
        { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]},
        { 1: [ SpeciesId.WHISMUR ], 20: [ SpeciesId.LOUDRED ], 40: [ SpeciesId.EXPLOUD ]},
        { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ]},
        { 1: [ SpeciesId.WOOBAT ], 20: [ SpeciesId.SWOOBAT ]},
        { 1: [ SpeciesId.BUNNELBY ], 20: [ SpeciesId.DIGGERSBY ]},
        { 1: [ SpeciesId.NACLI ], 24: [ SpeciesId.NACLSTACK ], 38: [ SpeciesId.GARGANACL ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.ROCKRUFF ], 25: [ SpeciesId.LYCANROC ]}],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.GEODUDE ], 25: [ SpeciesId.GRAVELER ]},
        { 1: [ SpeciesId.MAKUHITA ], 24: [ SpeciesId.HARIYAMA ]},
        SpeciesId.NOSEPASS,
        { 1: [ SpeciesId.NOIBAT ], 48: [ SpeciesId.NOIVERN ]},
        { 1: [ SpeciesId.WIMPOD ], 30: [ SpeciesId.GOLISOPOD ]}
      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.ONIX, { 1: [ SpeciesId.FERROSEED ], 40: [ SpeciesId.FERROTHORN ]}, SpeciesId.CARBINK, { 1: [ SpeciesId.GLIMMET ], 35: [ SpeciesId.GLIMMORA ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SHUCKLE ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.UXIE ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.PARASECT, SpeciesId.ONIX, SpeciesId.CROBAT, SpeciesId.URSARING, SpeciesId.EXPLOUD, SpeciesId.PROBOPASS, SpeciesId.GIGALITH, SpeciesId.SWOOBAT, SpeciesId.DIGGERSBY, SpeciesId.NOIVERN, SpeciesId.GOLISOPOD, SpeciesId.GARGANACL ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [ SpeciesId.LYCANROC ], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SHUCKLE, SpeciesId.FERROTHORN, SpeciesId.GLIMMORA ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.UXIE, SpeciesId.IRON_BOULDER, SpeciesId.IRON_CROWN ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TERAPAGOS ]}
  },
  [BiomeId.DESERT]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [ SpeciesId.TRAPINCH, { 1: [ SpeciesId.HIPPOPOTAS ], 34: [ SpeciesId.HIPPOWDON ]}, { 1: [ SpeciesId.RELLOR ], 29: [ SpeciesId.RABSCA ]}],
      [TimeOfDay.DAY]: [ SpeciesId.TRAPINCH, { 1: [ SpeciesId.HIPPOPOTAS ], 34: [ SpeciesId.HIPPOWDON ]}, { 1: [ SpeciesId.RELLOR ], 29: [ SpeciesId.RABSCA ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.CACNEA ], 32: [ SpeciesId.CACTURNE ]}, { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.CACNEA ], 32: [ SpeciesId.CACTURNE ]}, { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SANDSHREW ], 22: [ SpeciesId.SANDSLASH ]}, { 1: [ SpeciesId.SKORUPI ], 40: [ SpeciesId.DRAPION ]}, { 1: [ SpeciesId.SILICOBRA ], 36: [ SpeciesId.SANDACONDA ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]}, SpeciesId.HELIOPTILE ],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]}, SpeciesId.HELIOPTILE ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.MARACTUS, { 1: [ SpeciesId.BRAMBLIN ], 30: [ SpeciesId.BRAMBLEGHAST ]}, SpeciesId.ORTHWORM ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.DARUMAKA ], 35: [ SpeciesId.DARMANITAN ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.LILEEP ], 40: [ SpeciesId.CRADILY ]}, { 1: [ SpeciesId.ANORITH ], 40: [ SpeciesId.ARMALDO ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.REGIROCK, SpeciesId.TAPU_BULU, SpeciesId.PHEROMOSA ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.HIPPOWDON, SpeciesId.HELIOLISK, SpeciesId.RABSCA ],
      [TimeOfDay.DAY]: [ SpeciesId.HIPPOWDON, SpeciesId.HELIOLISK, SpeciesId.RABSCA ],
      [TimeOfDay.DUSK]: [ SpeciesId.CACTURNE, SpeciesId.KROOKODILE ],
      [TimeOfDay.NIGHT]: [ SpeciesId.CACTURNE, SpeciesId.KROOKODILE ],
      [TimeOfDay.ALL]: [ SpeciesId.SANDSLASH, SpeciesId.DRAPION, SpeciesId.DARMANITAN, SpeciesId.MARACTUS, SpeciesId.SANDACONDA, SpeciesId.BRAMBLEGHAST ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CRADILY, SpeciesId.ARMALDO ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.REGIROCK, SpeciesId.TAPU_BULU, SpeciesId.PHEROMOSA ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GREAT_TUSK ]}
  },
  [BiomeId.SAND_CAVE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [ SpeciesId.TRAPINCH, { 1: [ SpeciesId.HIPPOPOTAS ], 34: [ SpeciesId.HIPPOWDON ]}, { 1: [ SpeciesId.RELLOR ], 29: [ SpeciesId.RABSCA ]}],
      [TimeOfDay.DAY]: [ SpeciesId.TRAPINCH, { 1: [ SpeciesId.HIPPOPOTAS ], 34: [ SpeciesId.HIPPOWDON ]}, { 1: [ SpeciesId.RELLOR ], 29: [ SpeciesId.RABSCA ]}],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.CACNEA ], 32: [ SpeciesId.CACTURNE ]}, { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.CACNEA ], 32: [ SpeciesId.CACTURNE ]}, { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SANDSHREW ], 22: [ SpeciesId.SANDSLASH ]}, { 1: [ SpeciesId.SKORUPI ], 40: [ SpeciesId.DRAPION ]}, { 1: [ SpeciesId.SILICOBRA ], 36: [ SpeciesId.SANDACONDA ]}, { 1: [ SpeciesId.GEODUDE ], 25: [ SpeciesId.GRAVELER ], 35: [ SpeciesId.GOLEM ]}, { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]}, { 1: [ SpeciesId.NOSEPASS ], 35: [ SpeciesId.PROBOPASS ]}, { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ], 35: [ SpeciesId.GIGALITH ]}, { 1: [ SpeciesId.DWEBBLE ], 34: [ SpeciesId.CRUSTLE ]}, { 1: [ SpeciesId.ROCKRUFF ], 25: [ SpeciesId.LYCANROC ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]}, SpeciesId.HELIOPTILE ],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]}, SpeciesId.HELIOPTILE ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.MARACTUS, { 1: [ SpeciesId.BRAMBLIN ], 30: [ SpeciesId.BRAMBLEGHAST ]}, SpeciesId.ORTHWORM, { 1: [ SpeciesId.CRANIDOS ], 30: [ SpeciesId.RAMPARDOS ]}, { 1: [ SpeciesId.SHIELDON ], 30: [ SpeciesId.BASTIODON ]}, { 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ], 45: [ SpeciesId.RHYPERIOR ]}, { 1: [ SpeciesId.ARCHEN ], 37: [ SpeciesId.ARCHEOPS ]}, { 1: [ SpeciesId.TYRUNT ], 39: [ SpeciesId.TYRANTRUM ]}, { 1: [ SpeciesId.AMAURA ], 39: [ SpeciesId.AURORUS ]}, { 1: [ SpeciesId.NACLI ], 24: [ SpeciesId.NACLSTACK ], 38: [ SpeciesId.GARGANACL ]}, SpeciesId.KLAWF, { 1: [ SpeciesId.GLIGAR ], 40: [ SpeciesId.GLISCOR ]}, SpeciesId.AERODACTYL ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.DARUMAKA ], 35: [ SpeciesId.DARMANITAN ]}, { 1: [ SpeciesId.GLIMMET ], 35: [ SpeciesId.GLIMMORA ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.LILEEP ], 40: [ SpeciesId.CRADILY ]}, { 1: [ SpeciesId.ANORITH ], 40: [ SpeciesId.ARMALDO ]}, { 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR ], 55: [ SpeciesId.TYRANITAR ]}, { 1: [ SpeciesId.BELDUM ], 20: [ SpeciesId.METANG ], 45: [ SpeciesId.METAGROSS ]}, { 1: [ SpeciesId.GIBLE ], 24: [ SpeciesId.GABITE ], 48: [ SpeciesId.GARCHOMP ]}, { 1: [ SpeciesId.DURALUDON ], 50: [ SpeciesId.ARCHALUDON ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_TREADS ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.HIPPOWDON, SpeciesId.HELIOLISK, SpeciesId.RABSCA ],
      [TimeOfDay.DAY]: [ SpeciesId.HIPPOWDON, SpeciesId.HELIOLISK, SpeciesId.RABSCA ],
      [TimeOfDay.DUSK]: [ SpeciesId.CACTURNE, SpeciesId.KROOKODILE ],
      [TimeOfDay.NIGHT]: [ SpeciesId.CACTURNE, SpeciesId.KROOKODILE ],
      [TimeOfDay.ALL]: [ SpeciesId.SANDSLASH, SpeciesId.DRAPION, SpeciesId.DARMANITAN, SpeciesId.MARACTUS, SpeciesId.SANDACONDA, SpeciesId.BRAMBLEGHAST, SpeciesId.GOLEM, SpeciesId.AGGRON, SpeciesId.PROBOPASS, SpeciesId.GIGALITH, SpeciesId.CRUSTLE, SpeciesId.LYCANROC, SpeciesId.RAMPARDOS, SpeciesId.BASTIODON, SpeciesId.RHYPERIOR, SpeciesId.ARCHEOPS, SpeciesId.TYRANTRUM, SpeciesId.AURORUS, SpeciesId.GARGANACL, SpeciesId.KLAWF, SpeciesId.GLISCOR, SpeciesId.AERODACTYL ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CRADILY, SpeciesId.ARMALDO, SpeciesId.TYRANITAR, SpeciesId.METAGROSS, SpeciesId.GARCHOMP, SpeciesId.ARCHALUDON, SpeciesId.GLIMMORA ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_TREADS ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.ICE_CAVE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.SEEL ], 34: [ SpeciesId.DEWGONG ]},
        { 1: [ SpeciesId.SWINUB ], 33: [ SpeciesId.PILOSWINE ]},
        { 1: [ SpeciesId.SNOVER ], 40: [ SpeciesId.ABOMASNOW ]},
        { 1: [ SpeciesId.VANILLITE ], 35: [ SpeciesId.VANILLISH ], 47: [ SpeciesId.VANILLUXE ]},
        { 1: [ SpeciesId.CUBCHOO ], 37: [ SpeciesId.BEARTIC ]},
        { 1: [ SpeciesId.BERGMITE ], 37: [ SpeciesId.AVALUGG ]},
        SpeciesId.CRABRAWLER,
        { 1: [ SpeciesId.SNOM ], 20: [ SpeciesId.FROSMOTH ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.SNEASEL,
        { 1: [ SpeciesId.SNORUNT ], 42: [ SpeciesId.GLALIE ]},
        { 1: [ SpeciesId.SPHEAL ], 32: [ SpeciesId.SEALEO ], 44: [ SpeciesId.WALREIN ]},
        SpeciesId.EISCUE,
        { 1: [ SpeciesId.CETODDLE ], 30: [ SpeciesId.CETITAN ]}
      ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JYNX, SpeciesId.LAPRAS, SpeciesId.FROSLASS, SpeciesId.CRYOGONAL ]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DELIBIRD, SpeciesId.ROTOM, { 1: [ SpeciesId.AMAURA ], 59: [ SpeciesId.AURORUS ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ARTICUNO, SpeciesId.REGICE ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.DEWGONG, SpeciesId.GLALIE, SpeciesId.WALREIN, SpeciesId.WEAVILE, SpeciesId.MAMOSWINE, SpeciesId.FROSLASS, SpeciesId.VANILLUXE, SpeciesId.BEARTIC, SpeciesId.CRYOGONAL, SpeciesId.AVALUGG, SpeciesId.CRABOMINABLE, SpeciesId.CETITAN ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JYNX, SpeciesId.LAPRAS, SpeciesId.GLACEON, SpeciesId.AURORUS ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ARTICUNO, SpeciesId.REGICE, SpeciesId.ROTOM, SpeciesId.IRON_BUNDLE ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.KYUREM ]}
  },
  [BiomeId.GLACIER]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.SEEL ], 34: [ SpeciesId.DEWGONG ]},
        { 1: [ SpeciesId.ALOLA_SANDSHREW ], 22: [ SpeciesId.ALOLA_SANDSLASH ]},
        { 1: [ SpeciesId.SNOVER ], 40: [ SpeciesId.ABOMASNOW ]},
        { 1: [ SpeciesId.VANILLITE ], 35: [ SpeciesId.VANILLISH ], 47: [ SpeciesId.VANILLUXE ]},
        { 1: [ SpeciesId.CUBCHOO ], 37: [ SpeciesId.BEARTIC ]},
        { 1: [ SpeciesId.BERGMITE ], 37: [ SpeciesId.AVALUGG ]},
        SpeciesId.CRABRAWLER,
        { 1: [ SpeciesId.SNOM ], 20: [ SpeciesId.FROSMOTH ]},
        { 1: [ SpeciesId.ALOLA_VULPIX ], 22: [ SpeciesId.ALOLA_NINETALES ]},
        { 1: [ SpeciesId.FRILLISH ], 40: [ SpeciesId.JELLICENT ]},
        { 1: [ SpeciesId.TENTACOOL ], 30: [ SpeciesId.TENTACRUEL ]},
        { 1: [ SpeciesId.SHELLDER ], 30: [ SpeciesId.CLOYSTER ]},
        { 1: [ SpeciesId.KRABBY ], 28: [ SpeciesId.KINGLER ]},
        { 1: [ SpeciesId.WINGULL ], 25: [ SpeciesId.PELIPPER ]},
        SpeciesId.WISHIWASHI,
        { 1: [ SpeciesId.WATTREL ], 25: [ SpeciesId.KILOWATTREL ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.SNEASEL,
        { 1: [ SpeciesId.SNORUNT ], 42: [ SpeciesId.GLALIE ]},
        { 1: [ SpeciesId.SPHEAL ], 32: [ SpeciesId.SEALEO ], 44: [ SpeciesId.WALREIN ]},
        SpeciesId.EISCUE,
        { 1: [ SpeciesId.GALAR_DARUMAKA ], 35: [ SpeciesId.GALAR_DARMANITAN ]},
        { 1: [ SpeciesId.CETODDLE ], 30: [ SpeciesId.CETITAN ]},
        { 1: [ SpeciesId.MIME_JR ], 15: [ SpeciesId.GALAR_MR_MIME ], 42: [ SpeciesId.MR_RIME ]},
        { 1: [ SpeciesId.CARVANHA ], 30: [ SpeciesId.SHARPEDO ]},
        { 1: [ SpeciesId.WAILMER ], 40: [ SpeciesId.WAILORD ]},
        { 1: [ SpeciesId.STARYU ], 30: [ SpeciesId.STARMIE ]},
        { 1: [ SpeciesId.CHINCHOU ], 27: [ SpeciesId.LANTURN ]}
      ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JYNX, SpeciesId.LAPRAS, SpeciesId.FROSLASS, SpeciesId.CRYOGONAL, SpeciesId.ARCTOZOLT, SpeciesId.ARCTOVISH, { 1: [ SpeciesId.FEEBAS ], 30: [ SpeciesId.MILOTIC ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DELIBIRD, { 1: [ SpeciesId.AMAURA ], 59: [ SpeciesId.AURORUS ]}, { 1: [ SpeciesId.PIPLUP ], 16: [ SpeciesId.PRINPLUP ], 36: [ SpeciesId.EMPOLEON ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_BUNDLE ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.DEWGONG, SpeciesId.GLALIE, SpeciesId.WALREIN, SpeciesId.WEAVILE, SpeciesId.MAMOSWINE, SpeciesId.FROSLASS, SpeciesId.VANILLUXE, SpeciesId.BEARTIC, SpeciesId.CRYOGONAL, SpeciesId.AVALUGG, SpeciesId.CRABOMINABLE, SpeciesId.CETITAN, SpeciesId.ALOLA_NINETALES, SpeciesId.JELLICENT, SpeciesId.TENTACRUEL, SpeciesId.CLOYSTER, SpeciesId.KINGLER, SpeciesId.PELIPPER, SpeciesId.WISHIWASHI, SpeciesId.KILOWATTREL, SpeciesId.MR_RIME, SpeciesId.SHARPEDO, SpeciesId.WAILORD, SpeciesId.STARMIE, SpeciesId.LANTURN ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JYNX, SpeciesId.LAPRAS, SpeciesId.GLACEON, SpeciesId.AURORUS, SpeciesId.ARCTOZOLT, SpeciesId.ARCTOVISH, SpeciesId.MILOTIC, SpeciesId.EMPOLEON ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_BUNDLE ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.MEADOW]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.LEDYBA ], 18: [ SpeciesId.LEDIAN ]}, SpeciesId.ROSELIA, SpeciesId.COTTONEE, SpeciesId.MINCCINO ],
      [TimeOfDay.DAY]: [ SpeciesId.ROSELIA, SpeciesId.COTTONEE, SpeciesId.MINCCINO ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.BLITZLE ], 27: [ SpeciesId.ZEBSTRIKA ]},
        { 1: [ SpeciesId.FLABEBE ], 19: [ SpeciesId.FLOETTE ]},
        { 1: [ SpeciesId.CUTIEFLY ], 25: [ SpeciesId.RIBOMBEE ]},
        { 1: [ SpeciesId.GOSSIFLEUR ], 20: [ SpeciesId.ELDEGOSS ]},
        { 1: [ SpeciesId.WOOLOO ], 24: [ SpeciesId.DUBWOOL ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [
        { 1: [ SpeciesId.PONYTA ], 40: [ SpeciesId.RAPIDASH ]},
        { 1: [ SpeciesId.SNUBBULL ], 23: [ SpeciesId.GRANBULL ]},
        { 1: [ SpeciesId.SKITTY ], 30: [ SpeciesId.DELCATTY ]},
        SpeciesId.BOUFFALANT,
        { 1: [ SpeciesId.SMOLIV ], 25: [ SpeciesId.DOLLIV ], 35: [ SpeciesId.ARBOLIVA ]}
      ],
      [TimeOfDay.DAY]: [
        { 1: [ SpeciesId.PONYTA ], 40: [ SpeciesId.RAPIDASH ]},
        { 1: [ SpeciesId.SNUBBULL ], 23: [ SpeciesId.GRANBULL ]},
        { 1: [ SpeciesId.SKITTY ], 30: [ SpeciesId.DELCATTY ]},
        SpeciesId.BOUFFALANT,
        { 1: [ SpeciesId.SMOLIV ], 25: [ SpeciesId.DOLLIV ], 35: [ SpeciesId.ARBOLIVA ]}
      ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.JIGGLYPUFF ], 30: [ SpeciesId.WIGGLYTUFF ]},
        { 1: [ SpeciesId.MAREEP ], 15: [ SpeciesId.FLAAFFY ], 30: [ SpeciesId.AMPHAROS ]},
        { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [ SpeciesId.GARDEVOIR ]},
        { 1: [ SpeciesId.GLAMEOW ], 38: [ SpeciesId.PURUGLY ]},
        SpeciesId.ORICORIO
      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ SpeciesId.VOLBEAT, SpeciesId.ILLUMISE ],
      [TimeOfDay.ALL]: [ SpeciesId.TAUROS, SpeciesId.EEVEE, SpeciesId.MILTANK, SpeciesId.SPINDA, { 1: [ SpeciesId.APPLIN ], 30: [ SpeciesId.DIPPLIN ]}, { 1: [ SpeciesId.SPRIGATITO ], 16: [ SpeciesId.FLORAGATO ], 36: [ SpeciesId.MEOWSCARADA ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.HAPPINY ], 20: [ SpeciesId.CHANSEY ]}, SpeciesId.SYLVEON ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SHAYMIN ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.LEDIAN, SpeciesId.GRANBULL, SpeciesId.DELCATTY, SpeciesId.ROSERADE, SpeciesId.CINCCINO, SpeciesId.BOUFFALANT, SpeciesId.ARBOLIVA ],
      [TimeOfDay.DAY]: [ SpeciesId.GRANBULL, SpeciesId.DELCATTY, SpeciesId.ROSERADE, SpeciesId.CINCCINO, SpeciesId.BOUFFALANT, SpeciesId.ARBOLIVA ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.TAUROS, SpeciesId.MILTANK, SpeciesId.GARDEVOIR, SpeciesId.PURUGLY, SpeciesId.ZEBSTRIKA, SpeciesId.FLORGES, SpeciesId.RIBOMBEE, SpeciesId.DUBWOOL ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [ SpeciesId.HISUI_LILLIGANT ], [TimeOfDay.DAY]: [ SpeciesId.HISUI_LILLIGANT ], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.HAPPINY ], 20: [ SpeciesId.CHANSEY ], 35: [ SpeciesId.BLISSEY ]}, SpeciesId.SYLVEON, SpeciesId.FLAPPLE, SpeciesId.APPLETUN, SpeciesId.MEOWSCARADA, SpeciesId.HYDRAPPLE ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SHAYMIN ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SCREAM_TAIL ]}
  },
  [BiomeId.POWER_PLANT]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.PIKACHU,
        { 1: [ SpeciesId.MAGNEMITE ], 30: [ SpeciesId.MAGNETON ]},
        { 1: [ SpeciesId.VOLTORB ], 30: [ SpeciesId.ELECTRODE ]},
        { 1: [ SpeciesId.ELECTRIKE ], 26: [ SpeciesId.MANECTRIC ]},
        { 1: [ SpeciesId.SHINX ], 15: [ SpeciesId.LUXIO ], 30: [ SpeciesId.LUXRAY ]},
        SpeciesId.DEDENNE,
        { 1: [ SpeciesId.GRUBBIN ], 20: [ SpeciesId.CHARJABUG ]},
        { 1: [ SpeciesId.PAWMI ], 18: [ SpeciesId.PAWMO ], 32: [ SpeciesId.PAWMOT ]},
        { 1: [ SpeciesId.TADBULB ], 30: [ SpeciesId.BELLIBOLT ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ELEKID ], 30: [ SpeciesId.ELECTABUZZ ]}, SpeciesId.PLUSLE, SpeciesId.MINUN, SpeciesId.PACHIRISU, SpeciesId.EMOLGA, SpeciesId.TOGEDEMARU ]},
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.MAREEP ], 15: [ SpeciesId.FLAAFFY ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JOLTEON, SpeciesId.HISUI_VOLTORB ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.RAIKOU, SpeciesId.THUNDURUS, SpeciesId.XURKITREE, SpeciesId.ZERAORA, SpeciesId.REGIELEKI ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.RAICHU, SpeciesId.MANECTRIC, SpeciesId.LUXRAY, SpeciesId.MAGNEZONE, { 1: [ SpeciesId.ELEKID ], 30: [ SpeciesId.ELECTABUZZ ], 40: [ SpeciesId.ELECTIVIRE ]}, SpeciesId.DEDENNE, SpeciesId.VIKAVOLT, SpeciesId.TOGEDEMARU, SpeciesId.PAWMOT, SpeciesId.BELLIBOLT ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JOLTEON, SpeciesId.AMPHAROS, SpeciesId.HISUI_ELECTRODE ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.RAIKOU, SpeciesId.REGIELEKI ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ZEKROM ]}
  },
  [BiomeId.LIGHTNING_FIELD]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.PIKACHU,
        { 1: [ SpeciesId.YAMPER ], 25: [ SpeciesId.BOLTUND ]},
        { 1: [ SpeciesId.VOLTORB ], 30: [ SpeciesId.ELECTRODE ]},
        { 1: [ SpeciesId.ELECTRIKE ], 26: [ SpeciesId.MANECTRIC ]},
        { 1: [ SpeciesId.SHINX ], 15: [ SpeciesId.LUXIO ], 30: [ SpeciesId.LUXRAY ]},
        SpeciesId.DEDENNE,
        { 1: [ SpeciesId.GRUBBIN ], 20: [ SpeciesId.CHARJABUG ]},
        { 1: [ SpeciesId.PAWMI ], 18: [ SpeciesId.PAWMO ], 32: [ SpeciesId.PAWMOT ]},
        { 1: [ SpeciesId.BLITZLE ], 27: [ SpeciesId.ZEBSTRIKA ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ELEKID ], 30: [ SpeciesId.ELECTABUZZ ]}, SpeciesId.PLUSLE, SpeciesId.MINUN, SpeciesId.PACHIRISU, SpeciesId.EMOLGA, SpeciesId.TOGEDEMARU ]},
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.MAREEP ], 15: [ SpeciesId.FLAAFFY ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JOLTEON ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.XURKITREE, SpeciesId.ZERAORA ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.RAICHU, SpeciesId.MANECTRIC, SpeciesId.LUXRAY, SpeciesId.ZEBSTRIKA, { 1: [ SpeciesId.ELEKID ], 30: [ SpeciesId.ELECTABUZZ ], 40: [ SpeciesId.ELECTIVIRE ]}, SpeciesId.DEDENNE, SpeciesId.VIKAVOLT, SpeciesId.TOGEDEMARU, SpeciesId.PAWMOT, SpeciesId.BOLTUND ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JOLTEON, SpeciesId.AMPHAROS, SpeciesId.HISUI_ELECTRODE ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.XURKITREE, SpeciesId.ZERAORA ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.SPARK_CAVE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.JOLTIK ], 36: [ SpeciesId.GALVANTULA ]},
        { 1: [ SpeciesId.VOLTORB ], 30: [ SpeciesId.ELECTRODE ]},
        { 1: [ SpeciesId.FERROSEED ], 26: [ SpeciesId.FERROTHORN ]},
        { 1: [ SpeciesId.SHINX ], 15: [ SpeciesId.LUXIO ], 30: [ SpeciesId.LUXRAY ]},
        SpeciesId.DEDENNE,
        { 1: [ SpeciesId.GRUBBIN ], 20: [ SpeciesId.CHARJABUG ]},
        { 1: [ SpeciesId.KLINK ], 38: [ SpeciesId.KLANG ], 49: [ SpeciesId.KLINKLANG ]},
        { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ], 35: [ SpeciesId.GIGALITH ]},
        { 1: [ SpeciesId.NOSEPASS ], 35: [ SpeciesId.PROBOPASS ]},
        SpeciesId.STUNFISK
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ELEKID ], 30: [ SpeciesId.ELECTABUZZ ]}, { 1: [ SpeciesId.HELIOPTILE ], 30: [ SpeciesId.HELIOLISK ]}, { 1: [ SpeciesId.TOXEL ], 30: [ SpeciesId.TORXTRICITY ]}, { 1: [ SpeciesId.TYNAMO ], 39: [ SpeciesId.EELEKTRIK ], 49: [ SpeciesId.EELEKTROSS ]}, SpeciesId.TOGEDEMARU, { 1: [ SpeciesId.ONIX ], 25: [ SpeciesId.STEELIX ]}]},
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ALOLA_GEODUDE ], 39: [ SpeciesId.ALOLA_GRAVELER ], 49: [ SpeciesId.ALOLA_GOLEM ]}, { 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ], 49: [ SpeciesId.RHYPERIOR ]}, { 1: [ SpeciesId.DRILBUR ], 31: [ SpeciesId.EXCADRILL ]},
{ 1: [ SpeciesId.GLIGAR ], 31: [ SpeciesId.GLISCOR ]}, { 1: [ SpeciesId.CUBONE ], 28: [ SpeciesId.MAROWAK ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JOLTEON, SpeciesId.GALAR_STUNFISK ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.REGIELEKI ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.GALVANTULA, SpeciesId.FERROTHORN, SpeciesId.ELECTRODE, SpeciesId.KLINKLANG, { 1: [ SpeciesId.ELEKID ], 30: [ SpeciesId.ELECTABUZZ ], 40: [ SpeciesId.ELECTIVIRE ]}, SpeciesId.DEDENNE, SpeciesId.VIKAVOLT, SpeciesId.TOGEDEMARU, SpeciesId.GIGALITH, SpeciesId.PROBOPASS, SpeciesId.STUNFISK, SpeciesId.HELIOLISK, SpeciesId.TORXTRICITY, SpeciesId.EELEKTROSS, SpeciesId.STEELIX ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JOLTEON, SpeciesId.ALOLA_GOLEM, SpeciesId.RHYPERIOR, SpeciesId.EXCADRILL, SpeciesId.GLISCOR, SpeciesId.MAROWAK, SpeciesId.GALAR_STUNFISK ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.REGIELEKI ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.THUNDER_MOUNTAIN]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.PICHU ], 14: [ SpeciesId.PIKACHU ], 25: [ SpeciesId.RAICHU ]},
        { 1: [ SpeciesId.VOLTORB ], 30: [ SpeciesId.ELECTRODE ]},
        { 1: [ SpeciesId.ELECTRIKE ], 26: [ SpeciesId.MANECTRIC ]},
        { 1: [ SpeciesId.SHINX ], 15: [ SpeciesId.LUXIO ], 30: [ SpeciesId.LUXRAY ]},
        SpeciesId.DEDENNE,
        { 1: [ SpeciesId.GRUBBIN ], 20: [ SpeciesId.CHARJABUG ]},
        { 1: [ SpeciesId.MAREEP ], 15: [ SpeciesId.FLAAFFY ], 30: [ SpeciesId.AMPHAROS ]},
        { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ], 35: [ SpeciesId.GIGALITH ]},
        { 1: [ SpeciesId.NOSEPASS ], 35: [ SpeciesId.PROBOPASS ]},
        { 1: [ SpeciesId.DIGLETT ], 26: [ SpeciesId.DUGTRIO ]},
        SpeciesId.EMOLGA
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ELEKID ], 30: [ SpeciesId.ELECTABUZZ ]}, { 1: [ SpeciesId.HELIOPTILE ], 30: [ SpeciesId.HELIOLISK ]}, { 1: [ SpeciesId.SNOVER ], 40: [ SpeciesId.ABOMASNOW ]}, { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LATRON ], 42: [ SpeciesId.AGGRON ]}, SpeciesId.TOGEDEMARU, { 1: [ SpeciesId.ONIX ], 25: [ SpeciesId.STEELIX ]}, { 1: [ SpeciesId.NACLI ], 24: [ SpeciesId.NACLSTACK ], 38: [ SpeciesId.GARGANACL ]}, { 1: [ SpeciesId.BONSLY ], 15: [ SpeciesId.SUDOWOODO ]}]},
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ALOLA_GEODUDE ], 25: [ SpeciesId.ALOLA_GRAVELER ], 35: [ SpeciesId.ALOLA_GOLEM ]}, { 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ], 49: [ SpeciesId.RHYPERIOR ]}, { 1: [ SpeciesId.DRILBUR ], 31: [ SpeciesId.EXCADRILL ]},
{ 1: [ SpeciesId.GLIGAR ], 31: [ SpeciesId.GLISCOR ]}, { 1: [ SpeciesId.CUBONE ], 28: [ SpeciesId.MAROWAK ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JOLTEON, { 1: [ SpeciesId.ALOLA_DIGLETT ], 26: [ SpeciesId.ALOLA_DUGTRIO ]}, { 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR ], 55: [ SpeciesId.TYRANITAR ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ZAPDOS ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.AGGRON, SpeciesId.RAICHU, SpeciesId.ELECTRODE, SpeciesId.KLINKLANG, { 1: [ SpeciesId.ELEKID ], 30: [ SpeciesId.ELECTABUZZ ], 40: [ SpeciesId.ELECTIVIRE ]}, SpeciesId.DEDENNE, SpeciesId.VIKAVOLT, SpeciesId.TOGEDEMARU, SpeciesId.GIGALITH, SpeciesId.PROBOPASS, SpeciesId.DUGTRIO, SpeciesId.HELIOLISK, SpeciesId.ABOMASNOW, SpeciesId.EELEKTROSS, SpeciesId.STEELIX, SpeciesId.EMOLGA, SpeciesId.GARGANACL, SpeciesId.SUDOWOODO ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JOLTEON, SpeciesId.ALOLA_GOLEM, SpeciesId.RHYPERIOR, SpeciesId.EXCADRILL, SpeciesId.GLISCOR, SpeciesId.MAROWAK, SpeciesId.ALOLA_DUGTRIO, SpeciesId.TYRANITAR ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ZAPDOS ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.VOLCANO]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.VULPIX,
        SpeciesId.GROWLITHE,
        { 1: [ SpeciesId.PONYTA ], 40: [ SpeciesId.RAPIDASH ]},
        { 1: [ SpeciesId.SLUGMA ], 38: [ SpeciesId.MAGCARGO ]},
        { 1: [ SpeciesId.NUMEL ], 33: [ SpeciesId.CAMERUPT ]},
        { 1: [ SpeciesId.SALANDIT ], 33: [ SpeciesId.SALAZZLE ]},
        { 1: [ SpeciesId.ROLYCOLY ], 18: [ SpeciesId.CARKOL ], 34: [ SpeciesId.COALOSSAL ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.MAGBY ], 30: [ SpeciesId.MAGMAR ]}, SpeciesId.TORKOAL, { 1: [ SpeciesId.PANSEAR ], 30: [ SpeciesId.SIMISEAR ]}, SpeciesId.HEATMOR, SpeciesId.TURTONATOR ]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.CHARMANDER ], 16: [ SpeciesId.CHARMELEON ], 36: [ SpeciesId.CHARIZARD ]},
        { 1: [ SpeciesId.CYNDAQUIL ], 14: [ SpeciesId.QUILAVA ], 36: [ SpeciesId.TYPHLOSION ]},
        { 1: [ SpeciesId.CHIMCHAR ], 14: [ SpeciesId.MONFERNO ], 36: [ SpeciesId.INFERNAPE ]},
        { 1: [ SpeciesId.FENNEKIN ], 16: [ SpeciesId.BRAIXEN ], 36: [ SpeciesId.DELPHOX ]},
        { 1: [ SpeciesId.LITTEN ], 17: [ SpeciesId.TORRACAT ], 34: [ SpeciesId.INCINEROAR ]},
        { 1: [ SpeciesId.SCORBUNNY ], 16: [ SpeciesId.RABOOT ], 35: [ SpeciesId.CINDERACE ]},
        { 1: [ SpeciesId.CHARCADET ], 30: [ SpeciesId.ARMAROUGE ]}
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.FLAREON, SpeciesId.ROTOM ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ENTEI ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.NINETALES, SpeciesId.ARCANINE, SpeciesId.RAPIDASH, SpeciesId.MAGCARGO, SpeciesId.CAMERUPT, SpeciesId.TORKOAL, { 1: [ SpeciesId.MAGBY ], 30: [ SpeciesId.MAGMAR ], 40: [ SpeciesId.MAGMORTAR ]}, SpeciesId.SIMISEAR, SpeciesId.HEATMOR, SpeciesId.SALAZZLE, SpeciesId.TURTONATOR, SpeciesId.COALOSSAL ]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.CHARIZARD, SpeciesId.FLAREON, SpeciesId.TYPHLOSION, SpeciesId.INFERNAPE, SpeciesId.DELPHOX, SpeciesId.INCINEROAR, SpeciesId.CINDERACE, SpeciesId.ARMAROUGE, SpeciesId.ROTOM ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ENTEI ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.RESHIRAM ]}
  },
  [BiomeId.MAGMA_CAVERN]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.GROWLITHE,
        { 1: [ SpeciesId.GEODUDE ], 25: [ SpeciesId.GRAVELER ], 40: [ SpeciesId.GOLEM ]},
        { 1: [ SpeciesId.GRIMER ], 38: [ SpeciesId.MUK ]},
        { 1: [ SpeciesId.SLUGMA ], 38: [ SpeciesId.MAGCARGO ]},
        { 1: [ SpeciesId.KOFFING ], 35: [ SpeciesId.WEEZING ]},
        { 1: [ SpeciesId.NUMEL ], 33: [ SpeciesId.CAMERUPT ]},
        { 1: [ SpeciesId.SIZZLIPEDE ], 28: [ SpeciesId.CENTISKORCH ]},
        { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ], 34: [ SpeciesId.GIGALITH ]},
        { 1: [ SpeciesId.ROLYCOLY ], 18: [ SpeciesId.CARKOL ], 34: [ SpeciesId.COALOSSAL ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.MAGBY ], 30: [ SpeciesId.MAGMAR ]}, SpeciesId.TORKOAL, { 1: [ SpeciesId.PANSEAR ], 30: [ SpeciesId.SIMISEAR ]}, SpeciesId.HEATMOR, SpeciesId.TURTONATOR ]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.ONIX ], 25: [ SpeciesId.STEELIX ]},
        { 1: [ SpeciesId.TEPIG ], 17: [ SpeciesId.PIGNITE ], 36: [ SpeciesId.EMBOAR ]}
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.FLAREON, { 1: [ SpeciesId.LARVESTA ], 59: [ SpeciesId.VOLCARONA ]}, SpeciesId.HISUI_GROWLITHE ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.HEATRAN ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.ARCANINE, SpeciesId.GOLEM, SpeciesId.STEELIX, SpeciesId.MUK, SpeciesId.WEEZING, SpeciesId.CENTISKORCH, SpeciesId.MAGCARGO, SpeciesId.CAMERUPT, SpeciesId.TORKOAL, { 1: [ SpeciesId.MAGBY ], 30: [ SpeciesId.MAGMAR ], 40: [ SpeciesId.MAGMORTAR ]}, SpeciesId.SIMISEAR, SpeciesId.HEATMOR, SpeciesId.GIGALITH, SpeciesId.TURTONATOR, SpeciesId.COALOSSAL ]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.FLAREON, SpeciesId.EMBOAR, SpeciesId.VOLCARONA, SpeciesId.HISUI_ARCANINE ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.HEATRAN ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GROUDON ]}
  },
  [BiomeId.BLAZE_FIELD]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.VULPIX,
        SpeciesId.GROWLITHE,
        { 1: [ SpeciesId.PONYTA ], 40: [ SpeciesId.RAPIDASH ]},
        { 1: [ SpeciesId.SLUGMA ], 38: [ SpeciesId.MAGCARGO ]},
        { 1: [ SpeciesId.NUMEL ], 33: [ SpeciesId.CAMERUPT ]},
        { 1: [ SpeciesId.SALANDIT ], 33: [ SpeciesId.SALAZZLE ]},
        { 1: [ SpeciesId.ROLYCOLY ], 18: [ SpeciesId.CARKOL ], 34: [ SpeciesId.COALOSSAL ]},
        { 1: [ SpeciesId.SIZZLIPEDE ], 28: [ SpeciesId.CENTISKORCH ]},
        { 1: [ SpeciesId.LITLEO ], 35: [ SpeciesId.PYROAR ]},
        { 1: [ SpeciesId.HOUNDOUR ], 24: [ SpeciesId.HOUNDOOM ]},
        { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]},
        { 1: [ SpeciesId.DARUMAKA ], 35: [ SpeciesId.DARMANITAN ]},
        { 1: [ SpeciesId.ELECTRIKE ], 26: [ SpeciesId.MANECTRIC ]},
        { 1: [ SpeciesId.BLITZLE ], 27: [ SpeciesId.ZEBSTRIKA ]},
        { 1: [ SpeciesId.HELIOPTILE ], 30: [ SpeciesId.HELIOLISK ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.MAGBY ], 30: [ SpeciesId.MAGMAR ]}, SpeciesId.TORKOAL, { 1: [ SpeciesId.PANSEAR ], 30: [ SpeciesId.SIMISEAR ]}, SpeciesId.HEATMOR, SpeciesId.TURTONATOR, { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ], 45: [ SpeciesId.CHANDELURE ]}, { 1: [ SpeciesId.CAPSAKID ], 30: [ SpeciesId.SCOVILLAIN ]}]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.SCORBUNNY ], 16: [ SpeciesId.RABOOT ], 35: [ SpeciesId.CINDERACE ]},
        { 1: [ SpeciesId.CHARCADET ], 30: [ SpeciesId.ARMAROUGE ]},
        { 1: [ SpeciesId.LARVESTA ], 59: [ SpeciesId.VOLCARONA ]}
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.FLAREON ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MOLTRES ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.NINETALES, SpeciesId.ARCANINE, SpeciesId.RAPIDASH, SpeciesId.MAGCARGO, SpeciesId.CAMERUPT, SpeciesId.TORKOAL, { 1: [ SpeciesId.MAGBY ], 30: [ SpeciesId.MAGMAR ], 40: [ SpeciesId.MAGMORTAR ]}, SpeciesId.SIMISEAR, SpeciesId.HEATMOR, SpeciesId.SALAZZLE, SpeciesId.TURTONATOR, SpeciesId.COALOSSAL, SpeciesId.CENTISKORCH, SpeciesId.PYROAR, SpeciesId.HOUNDOOM, SpeciesId.TALONFLAME, SpeciesId.DARMANITAN, SpeciesId.CHANDELURE, SpeciesId.MANECTRIC, SpeciesId.ZEBSTRIKA, SpeciesId.HELIOLISK, SpeciesId.SCOVILLAIN ]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.CINDERACE, SpeciesId.ARMAROUGE, SpeciesId.VOLCARONA
    ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MOLTRES ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.INFERNO_FOREST]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.VULPIX,
        SpeciesId.GROWLITHE,
        { 1: [ SpeciesId.PONYTA ], 40: [ SpeciesId.RAPIDASH ]},
        { 1: [ SpeciesId.SLUGMA ], 38: [ SpeciesId.MAGCARGO ]},
        { 1: [ SpeciesId.NUMEL ], 33: [ SpeciesId.CAMERUPT ]},
        { 1: [ SpeciesId.SALANDIT ], 33: [ SpeciesId.SALAZZLE ]},
        { 1: [ SpeciesId.ROLYCOLY ], 18: [ SpeciesId.CARKOL ], 34: [ SpeciesId.COALOSSAL ]},
        { 1: [ SpeciesId.SIZZLIPEDE ], 28: [ SpeciesId.CENTISKORCH ]},
        { 1: [ SpeciesId.LITLEO ], 35: [ SpeciesId.PYROAR ]},
        { 1: [ SpeciesId.HOUNDOUR ], 24: [ SpeciesId.HOUNDOOM ]},
        { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]},
        { 1: [ SpeciesId.DARUMAKA ], 35: [ SpeciesId.DARMANITAN ]},
        { 1: [ SpeciesId.ELECTRIKE ], 26: [ SpeciesId.MANECTRIC ]},
        { 1: [ SpeciesId.BLITZLE ], 27: [ SpeciesId.ZEBSTRIKA ]},
        { 1: [ SpeciesId.HELIOPTILE ], 30: [ SpeciesId.HELIOLISK ]},
        { 1: [ SpeciesId.BONSLY ], 15: [ SpeciesId.SUDOWOODO ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.MAGBY ], 30: [ SpeciesId.MAGMAR ]}, SpeciesId.TORKOAL, { 1: [ SpeciesId.PANSEAR ], 30: [ SpeciesId.SIMISEAR ]}, SpeciesId.HEATMOR, SpeciesId.TURTONATOR, { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ], 45: [ SpeciesId.CHANDELURE ]}, { 1: [ SpeciesId.CAPSAKID ], 30: [ SpeciesId.SCOVILLAIN ]}]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.FENNEKIN ], 16: [ SpeciesId.BRAIXEN ], 36: [ SpeciesId.DELPHOX ]},
        { 1: [ SpeciesId.LITTEN ], 17: [ SpeciesId.TORRACAT ], 34: [ SpeciesId.INCINEROAR ]},
        { 1: [ SpeciesId.CHARCADET ], 30: [ SpeciesId.ARMAROUGE ]},
        { 1: [ SpeciesId.CHARCADET ], 30: [ SpeciesId.CERULEDGE ]},
        { 1: [ SpeciesId.LARVESTA ], 59: [ SpeciesId.VOLCARONA ]}
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.FLAREON ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GOUGING_FIRE ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.NINETALES, SpeciesId.ARCANINE, SpeciesId.RAPIDASH, SpeciesId.MAGCARGO, SpeciesId.CAMERUPT, SpeciesId.TORKOAL, { 1: [ SpeciesId.MAGBY ], 30: [ SpeciesId.MAGMAR ], 40: [ SpeciesId.MAGMORTAR ]}, SpeciesId.SIMISEAR, SpeciesId.HEATMOR, SpeciesId.SALAZZLE, SpeciesId.TURTONATOR, SpeciesId.COALOSSAL, SpeciesId.CENTISKORCH, SpeciesId.PYROAR, SpeciesId.HOUNDOOM, SpeciesId.TALONFLAME, SpeciesId.DARMANITAN, SpeciesId.CHANDELURE, SpeciesId.MANECTRIC, SpeciesId.ZEBSTRIKA, SpeciesId.HELIOLISK, SpeciesId.SCOVILLAIN ]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.DELPHOX, SpeciesId.INCINEROAR, SpeciesId.CERULEDGE, SpeciesId.ARMAROUGE, SpeciesId.VOLCARONA
    ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GOUGING_FIRE ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.LAVA_LAKE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.VULPIX,
        SpeciesId.GROWLITHE,
        { 1: [ SpeciesId.GRIMER ], 38: [ SpeciesId.MUK ]},
        { 1: [ SpeciesId.EKANS ], 38: [ SpeciesId.ARBOK ]},
        { 1: [ SpeciesId.SLUGMA ], 38: [ SpeciesId.MAGCARGO ]},
        { 1: [ SpeciesId.NUMEL ], 33: [ SpeciesId.CAMERUPT ]},
        { 1: [ SpeciesId.SALANDIT ], 33: [ SpeciesId.SALAZZLE ]},
        { 1: [ SpeciesId.DWEBBLE ], 34: [ SpeciesId.CRUSTLE ]},
        { 1: [ SpeciesId.SKORUPI ], 40: [ SpeciesId.DRAPION ]},
        { 1: [ SpeciesId.PHANPY ], 40: [ SpeciesId.DONPHAN ]},
        { 1: [ SpeciesId.KOFFING ], 35: [ SpeciesId.WEEZING ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.MAGBY ], 30: [ SpeciesId.MAGMAR ]}, SpeciesId.TORKOAL, { 1: [ SpeciesId.PANSEAR ], 30: [ SpeciesId.SIMISEAR ]}, { 1: [ SpeciesId.LITLEO ], 35: [ SpeciesId.PYROAR ]}, SpeciesId.HEATMOR, SpeciesId.TURTONATOR ]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.STUNFISK,
        { 1: [ SpeciesId.ONIX ], 25: [ SpeciesId.STEELIX ]},
        { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]},
        { 1: [ SpeciesId.HIPPOPOTAS ], 34: [ SpeciesId.HIPPOWDON ]},
        { 1: [ SpeciesId.FUECOCO ], 16: [ SpeciesId.CROCALOR ], 36: [ SpeciesId.SKELEDIRGE ]}
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.FLAREON, { 1: [ SpeciesId.TYNAMO ], 39: [ SpeciesId.EELECTRIK ], 45: [ SpeciesId.EELEKTROSS ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CHI_YU ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.NINETALES, SpeciesId.ARCANINE, SpeciesId.MUK, SpeciesId.ARBOK, SpeciesId.MAGCARGO, SpeciesId.CAMERUPT, SpeciesId.WEEZING, SpeciesId.TORKOAL, SpeciesId.PYROAR, SpeciesId.CRUSTLE, SpeciesId.DONPHAN, SpeciesId.DRAPION, { 1: [ SpeciesId.MAGBY ], 30: [ SpeciesId.MAGMAR ], 40: [ SpeciesId.MAGMORTAR ]}, SpeciesId.SIMISEAR, SpeciesId.HEATMOR, SpeciesId.SALAZZLE, SpeciesId.TURTONATOR, SpeciesId.SKELEDIRGE ]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.SKELEDIRGE, SpeciesId.FLAREON, SpeciesId.HIPPOWDON, SpeciesId.STUNFISK, SpeciesId.STEELIX, SpeciesId.KROOKODILE, SpeciesId.EELEKTROSS ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CHI_YU ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.SPA]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.VULPIX,
        SpeciesId.GROWLITHE,
        { 1: [ SpeciesId.PSYDUCK ], 33: [ SpeciesId.GOLDUCK ]},
        { 1: [ SpeciesId.MAGIKARP ], 20: [ SpeciesId.GYARADOS ]},
        { 1: [ SpeciesId.SLUGMA ], 38: [ SpeciesId.MAGCARGO ]},
        { 1: [ SpeciesId.NUMEL ], 33: [ SpeciesId.CAMERUPT ]},
        { 1: [ SpeciesId.SALANDIT ], 33: [ SpeciesId.SALAZZLE ]},
        { 1: [ SpeciesId.MAKUHITA ], 24: [ SpeciesId.HARIYAMA ]},
        { 1: [ SpeciesId.SIZZLIPEDE ], 28: [ SpeciesId.CENTISKORCH ]},
        { 1: [ SpeciesId.MEDITITE ], 37: [ SpeciesId.MEDICHAM ]},
        { 1: [ SpeciesId.PHANPY ], 25: [ SpeciesId.DONPHAN ]},
        { 1: [ SpeciesId.KOFFING ], 35: [ SpeciesId.WEEZING ]},
        { 1: [ SpeciesId.AIPOM ], 32: [ SpeciesId.AMBIPOM ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.MAGBY ], 30: [ SpeciesId.MAGMAR ]}, SpeciesId.TORKOAL, { 1: [ SpeciesId.PANSEAR ], 30: [ SpeciesId.SIMISEAR ]}, { 1: [ SpeciesId.PANPOUR ], 30: [ SpeciesId.SIMIPOUR ]}, { 1: [ SpeciesId.MANKEY ], 28: [ SpeciesId.PRIMEAPE ], 40: [ SpeciesId.ANNIHILAPE ]}, { 1: [ SpeciesId.MACHOP ], 28: [ SpeciesId.MACHOKE ], 35: [ SpeciesId.MACHAMP ]}, SpeciesId.HEATMOR, SpeciesId.TURTONATOR ]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.SHUCKLE,
        SpeciesId.ORANGURU,
        SpeciesId.PASSIMIAN,
        { 1: [ SpeciesId.HOUNDOUR ], 24: [ SpeciesId.HOUNDOOM ]},
        { 1: [ SpeciesId.DARUMAKA ], 35: [ SpeciesId.DARMANITAN ]},
        { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ], 45: [ SpeciesId.CHANDELURE ]},
        { 1: [ SpeciesId.MIENFOO ], 50: [ SpeciesId.MIENSHAO ]},
        { 1: [ SpeciesId.CLOBBOPUS ], 35: [ SpeciesId.GRAPPLOCT ]},
        { 1: [ SpeciesId.NACLI ], 24: [ SpeciesId.NACLSTACK ], 38: [ SpeciesId.GARGANACL ]},
        { 1: [ SpeciesId.ROLYCOLY ], 18: [ SpeciesId.CARKOL ], 34: [ SpeciesId.COALLOSSAL ]}
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.FLAREON, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ], 45: [ SpeciesId.URSALUNA ]}, { 1: [ SpeciesId.CHIMCHAR ], 14: [ SpeciesId.MONFERNO ], 36: [ SpeciesId.INFERNAPE ]}, { 1: [ SpeciesId.POLTCHAGEIST ], 30: [ SpeciesId.SINISTCHA ]}, { 1: [ SpeciesId.FEEBAS ], 30: [ SpeciesId.MILOTIC ]}, { 1: [ SpeciesId.SLAKOTH ], 18: [ SpeciesId.VIGOROTH ], 36: [ SpeciesId.SLAKING ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VOLCANION ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.NINETALES, SpeciesId.ARCANINE, SpeciesId.GOLDUCK, SpeciesId.GYARADOS, SpeciesId.MAGCARGO, SpeciesId.CAMERUPT, SpeciesId.WEEZING, SpeciesId.TORKOAL, SpeciesId.MEDICHAM, SpeciesId.HARIYAMA, SpeciesId.CENTISKORCH, SpeciesId.DONPHAN, SpeciesId.AMBIPOM, { 1: [ SpeciesId.MAGBY ], 30: [ SpeciesId.MAGMAR ], 40: [ SpeciesId.MAGMORTAR ]}, SpeciesId.SIMIPOUR, SpeciesId.MIENSHAO, SpeciesId.ANNIHILAPE, SpeciesId.SIMISEAR, SpeciesId.HEATMOR, SpeciesId.SALAZZLE, SpeciesId.TURTONATOR, SpeciesId.MACHAMP ]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.MIENSHAO, SpeciesId.FLAREON, SpeciesId.SHUCKLE, SpeciesId.ORANGURU, SpeciesId.PASSIMIAN, SpeciesId.GARGANACL, SpeciesId.CHANDELURE, SpeciesId.COALLOSSAL, SpeciesId.URSALUNA, SpeciesId.INFERNAPE, SpeciesId.SINISTCHA, SpeciesId.MILOTIC, SpeciesId.SLAKING ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VOLCANION ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.GRAVEYARD]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.GASTLY ], 25: [ SpeciesId.HAUNTER ]},
        { 1: [ SpeciesId.SHUPPET ], 37: [ SpeciesId.BANETTE ]},
        { 1: [ SpeciesId.DUSKULL ], 37: [ SpeciesId.DUSCLOPS ]},
        { 1: [ SpeciesId.DRIFLOON ], 28: [ SpeciesId.DRIFBLIM ]},
        { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ]},
        SpeciesId.PHANTUMP,
        SpeciesId.PUMPKABOO,
        { 1: [ SpeciesId.GREAVARD ], 60: [ SpeciesId.HOUNDSTONE ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.CUBONE ], 28: [ SpeciesId.MAROWAK ]}, { 1: [ SpeciesId.YAMASK ], 34: [ SpeciesId.COFAGRIGUS ]}, { 1: [ SpeciesId.SINISTEA ], 30: [ SpeciesId.POLTEAGEIST ]}]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MISDREAVUS, SpeciesId.MIMIKYU, SpeciesId.CERULEDGE ]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SPIRITOMB ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MARSHADOW ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.MAROWAK ],
      [TimeOfDay.DAY]: [ SpeciesId.MAROWAK ],
      [TimeOfDay.DUSK]: [ SpeciesId.MAROWAK ],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.GENGAR, SpeciesId.BANETTE, SpeciesId.DRIFBLIM, SpeciesId.MISMAGIUS, SpeciesId.DUSKNOIR, SpeciesId.CHANDELURE, SpeciesId.TREVENANT, SpeciesId.GOURGEIST, SpeciesId.MIMIKYU, SpeciesId.POLTEAGEIST, SpeciesId.HOUNDSTONE ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SKELEDIRGE, SpeciesId.CERULEDGE, SpeciesId.HISUI_TYPHLOSION ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MARSHADOW ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GIRATINA ]}
  },
  [BiomeId.DESERTED_HOUSE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.GASTLY ], 25: [ SpeciesId.HAUNTER ]},
        { 1: [ SpeciesId.SHUPPET ], 37: [ SpeciesId.BANETTE ]},
        { 1: [ SpeciesId.DUSKULL ], 37: [ SpeciesId.DUSCLOPS ]},
        { 1: [ SpeciesId.DRIFLOON ], 28: [ SpeciesId.DRIFBLIM ]},
        { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ]},
        SpeciesId.PHANTUMP,
        SpeciesId.PUMPKABOO,
        { 1: [ SpeciesId.GREAVARD ], 60: [ SpeciesId.HOUNDSTONE ]},
        { 1: [ SpeciesId.WOOBAT ], 24: [ SpeciesId.SWOOBAT ]},
        { 1: [ SpeciesId.ZUBAT ], 22: [ SpeciesId.GOLBAT ], 35: [ SpeciesId.CROBAT ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.CUBONE ], 28: [ SpeciesId.MAROWAK ]}, { 1: [ SpeciesId.YAMASK ], 34: [ SpeciesId.COFAGRIGUS ]}, { 1: [ SpeciesId.SINISTEA ], 30: [ SpeciesId.POLTEAGEIST ]}, { 1: [ SpeciesId.GOLETT ], 43: [ SpeciesId.GOLURK ]}, { 1: [ SpeciesId.HONEDGE ], 35: [ SpeciesId.DOUBLADE ], 45: [ SpeciesId.AEGISLASH ]}, { 1: [ SpeciesId.GALAR_YAMASK ], 34: [ SpeciesId.RUNERIGUS ]}, { 1: [ SpeciesId.POLTCHAGEIST ], 30: [ SpeciesId.SINISTCHA ]}]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MISDREAVUS, SpeciesId.MIMIKYU, SpeciesId.CERULEDGE, { 1: [ SpeciesId.DREEPY ], 50: [ SpeciesId.DRAKLOAK ], 60: [ SpeciesId.DRAGAPULT ]}, { 1: [ SpeciesId.HISUI_ZORUA ], 30: [ SpeciesId.HISUI_ZOROARK ]}, { 1: [ SpeciesId.GIMMIGHOUL ], 40: [ SpeciesId.GHOLDENGO ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SPIRITOMB ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.FLUTTER_MANE ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.MAROWAK ],
      [TimeOfDay.DAY]: [ SpeciesId.MAROWAK ],
      [TimeOfDay.DUSK]: [ SpeciesId.MAROWAK ],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.GENGAR, SpeciesId.BANETTE, SpeciesId.DRIFBLIM, SpeciesId.MISMAGIUS, SpeciesId.DUSKNOIR, SpeciesId.CHANDELURE, SpeciesId.TREVENANT, SpeciesId.GOURGEIST, SpeciesId.MIMIKYU, SpeciesId.POLTEAGEIST, SpeciesId.HOUNDSTONE, SpeciesId.SWOOBAT, SpeciesId.CROBAT, SpeciesId.GOLURK, SpeciesId.AEGISLASH, SpeciesId.RUNERIGUS, SpeciesId.SINISTCHA ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SKELEDIRGE, SpeciesId.CERULEDGE, SpeciesId.HISUI_TYPHLOSION, SpeciesId.DRAGAPULT, SpeciesId.HISUI_ZOROARK, SpeciesId.GHOLDENGO ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.FLUTTER_MANE ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.GHOST_SHIP]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.GASTLY ], 25: [ SpeciesId.HAUNTER ]},
        { 1: [ SpeciesId.SHUPPET ], 37: [ SpeciesId.BANETTE ]},
        { 1: [ SpeciesId.DUSKULL ], 37: [ SpeciesId.DUSCLOPS ]},
        { 1: [ SpeciesId.DRIFLOON ], 28: [ SpeciesId.DRIFBLIM ]},
        { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ]},
        { 1: [ SpeciesId.GREAVARD ], 60: [ SpeciesId.HOUNDSTONE ]},
        { 1: [ SpeciesId.TENTACOOL ], 30: [ SpeciesId.TENTACRUEL ]},
        { 1: [ SpeciesId.SLOWPOKE ], 37: [ SpeciesId.SLOWBRO ]},
        { 1: [ SpeciesId.KRABBY ], 28: [ SpeciesId.KINGLER ]},
        { 1: [ SpeciesId.STARYU ], 41: [ SpeciesId.STARMIE ]},
        { 1: [ SpeciesId.MAGIKARP ], 20: [ SpeciesId.GYARADOS ]},
        { 1: [ SpeciesId.REMORAID ], 25: [ SpeciesId.OCTILLERY ]},
        { 1: [ SpeciesId.WINGULL ], 25: [ SpeciesId.PELIPPER ]},
        { 1: [ SpeciesId.SHELLOS ], 30: [ SpeciesId.GASTRODON ]},
        { 1: [ SpeciesId.FRILLISH ], 40: [ SpeciesId.JELICENT ]},
        { 1: [ SpeciesId.WIMPOD ], 30: [ SpeciesId.GOLISOPOD ]},
        { 1: [ SpeciesId.WIGLETT ], 26: [ SpeciesId.WUGTRIO ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.CUBONE ], 28: [ SpeciesId.MAROWAK ]}, { 1: [ SpeciesId.YAMASK ], 34: [ SpeciesId.COFAGRIGUS ]}, { 1: [ SpeciesId.SINISTEA ], 30: [ SpeciesId.POLTEAGEIST ]}, { 1: [ SpeciesId.SLOWPOKE ], 37: [ SpeciesId.SLOWKING ]}, { 1: [ SpeciesId.SHELLDER ], 37: [ SpeciesId.CLOYSTER ]}, { 1: [ SpeciesId.HORSEA ], 32: [ SpeciesId.SEADRA ], 40: [ SpeciesId.KINGDRA ]}, { 1: [ SpeciesId.CHINCHOU ], 27: [ SpeciesId.LANTURN ]}, { 1: [ SpeciesId.CARVANHA ], 30: [ SpeciesId.SHARPEDO ]}, { 1: [ SpeciesId.CLAMPERL ], 37: [ SpeciesId.HUNTAIL ]}, { 1: [ SpeciesId.CLAMPERL ], 37: [ SpeciesId.GOREBYSS ]}, { 1: [ SpeciesId.FINNEON ], 31: [ SpeciesId.LUMINEON ]}, { 1: [ SpeciesId.BINACLE ], 39: [ SpeciesId.BARBARACLE ]}, { 1: [ SpeciesId.SKRELP ], 37: [ SpeciesId.DRAGALGE ]}, SpeciesId.WISHIWASHI, { 1: [ SpeciesId.MAREANIE ], 38: [ SpeciesId.TOXAPEX ]}, SpeciesId.DHELMISE ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MISDREAVUS, SpeciesId.MIMIKYU, { 1: [ SpeciesId.BASCULIN ], 38: [ SpeciesId.BASCULEGION ]}, SpeciesId.DONDOZO ]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SPIRITOMB ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TAPU_FINI ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.MAROWAK ],
      [TimeOfDay.DAY]: [ SpeciesId.MAROWAK ],
      [TimeOfDay.DUSK]: [ SpeciesId.MAROWAK ],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.GENGAR, SpeciesId.BANETTE, SpeciesId.DRIFBLIM, SpeciesId.MISMAGIUS, SpeciesId.DUSKNOIR, SpeciesId.CHANDELURE, SpeciesId.MIMIKYU, SpeciesId.POLTEAGEIST, SpeciesId.HOUNDSTONE, SpeciesId.SLOWBRO, SpeciesId.KINGLER, SpeciesId.STARMIE, SpeciesId.GYARADOS, SpeciesId.JELICENT, SpeciesId.GOLISOPOD, SpeciesId.WUGTRIO, SpeciesId.SLOWKING, SpeciesId.CLOYSTER, SpeciesId.KINGDRA, SpeciesId.LANTURN, SpeciesId.SHARPEDO, SpeciesId.HUNTAIL, SpeciesId.GOREBYSS, SpeciesId.DRAGALGE, SpeciesId.WISHIWASHI, SpeciesId.TOXAPEX, SpeciesId.DHELMISE ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DONDOZO, SpeciesId.BASCULEGION ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TAPU_FINI ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.DOJO]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.MANKEY ], 28: [ SpeciesId.PRIMEAPE ], 75: [ SpeciesId.ANNIHILAPE ]},
        { 1: [ SpeciesId.MAKUHITA ], 24: [ SpeciesId.HARIYAMA ]},
        { 1: [ SpeciesId.MEDITITE ], 37: [ SpeciesId.MEDICHAM ]},
        { 1: [ SpeciesId.STUFFUL ], 27: [ SpeciesId.BEWEAR ]},
        { 1: [ SpeciesId.CLOBBOPUS ], 55: [ SpeciesId.GRAPPLOCT ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.CROAGUNK ], 37: [ SpeciesId.TOXICROAK ]}, { 1: [ SpeciesId.SCRAGGY ], 39: [ SpeciesId.SCRAFTY ]}, { 1: [ SpeciesId.MIENFOO ], 50: [ SpeciesId.MIENSHAO ]}]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONLEE ]}, { 1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONCHAN ]}, { 1: [ SpeciesId.RIOLU ], 30: [ SpeciesId.LUCARIO ]}, SpeciesId.THROH, SpeciesId.SAWK, { 1: [ SpeciesId.PANCHAM ], 52: [ SpeciesId.PANGORO ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONTOP ]}, { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [ SpeciesId.GALLADE ]}, SpeciesId.GALAR_FARFETCHD ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TERRAKION, SpeciesId.KUBFU, SpeciesId.GALAR_ZAPDOS ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONLEE ]}, { 1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONCHAN ]}, SpeciesId.HARIYAMA, SpeciesId.MEDICHAM, SpeciesId.LUCARIO, SpeciesId.TOXICROAK, SpeciesId.THROH, SpeciesId.SAWK, SpeciesId.SCRAFTY, SpeciesId.MIENSHAO, SpeciesId.BEWEAR, SpeciesId.GRAPPLOCT, SpeciesId.ANNIHILAPE ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONTOP ]}, { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [SpeciesId.GALLADE]}, SpeciesId.PANGORO, SpeciesId.SIRFETCHD, SpeciesId.HISUI_DECIDUEYE ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TERRAKION, SpeciesId.URSHIFU, SpeciesId.GALAR_ZAPDOS, SpeciesId.IRON_HANDS ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ZAMAZENTA ]}
  },
  [BiomeId.BAMBOO_FOREST]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.MANKEY ], 28: [ SpeciesId.PRIMEAPE ], 75: [ SpeciesId.ANNIHILAPE ]},
        { 1: [ SpeciesId.MAKUHITA ], 24: [ SpeciesId.HARIYAMA ]},
        { 1: [ SpeciesId.MEDITITE ], 37: [ SpeciesId.MEDICHAM ]},
        { 1: [ SpeciesId.STUFFUL ], 27: [ SpeciesId.BEWEAR ]},
        { 1: [ SpeciesId.CLOBBOPUS ], 55: [ SpeciesId.GRAPPLOCT ]},
        { 1: [ SpeciesId.PAWMI ], 18: [ SpeciesId.PAWMO ], 35: [ SpeciesId.PAWMOT ]},
        SpeciesId.FLAMIGO, 
        SpeciesId.PALDEA_TAUROS,
        { 1: [ SpeciesId.MACHOP ], 28: [ SpeciesId.MACHOKE ], 35: [ SpeciesId.MACHCHAMP ]},
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.CROAGUNK ], 37: [ SpeciesId.TOXICROAK ]}, { 1: [ SpeciesId.SCRAGGY ], 39: [ SpeciesId.SCRAFTY ]}, { 1: [ SpeciesId.MIENFOO ], 50: [ SpeciesId.MIENSHAO ]}, SpeciesId.PINSIR, SpeciesId.HERACROSS, { 1: [ SpeciesId.SHROOMISH ], 23: [ SpeciesId.BRELOOM ]}, { 1: [ SpeciesId.TIMBURR ], 25: [ SpeciesId.GURDURR ], 35: [ SpeciesId.CONKELDURR ]}, { 1: [ SpeciesId.CRABRAWLER ], 35: [ SpeciesId.CRABOMINABLE ]}, SpeciesId.HAWLUCHA, { 1: [ SpeciesId.PETILI ], 25: [ SpeciesId.HISUI_LILLIGANT ]}, { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}, { 1: [ SpeciesId.KARRABLAST ], 35: [ SpeciesId.ESCAVALIER ]}, { 1: [ SpeciesId.SHELMET ], 35: [ SpeciesId.ACCELGOR ]}]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONLEE ]}, { 1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONCHAN ]}, { 1: [ SpeciesId.RIOLU ], 30: [ SpeciesId.LUCARIO ]}, SpeciesId.THROH, SpeciesId.SAWK, { 1: [ SpeciesId.PANCHAM ], 52: [ SpeciesId.PANGORO ]}, { 1: [ SpeciesId.SNEASEL ], 35: [ SpeciesId.SNEASLER ]}, SpeciesId.FALINKS ]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONTOP ]}, { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [ SpeciesId.GALLADE ]}, SpeciesId.GALAR_FARFETCHD, { 1: [ SpeciesId.SCYTHER ], 30: [ SpeciesId.SCIZOR ]}, { 1: [ SpeciesId.SCYTHER ], 30: [ SpeciesId.KLEAVOR ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CELESTEELA ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONLEE ]}, { 1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONCHAN ]}, SpeciesId.HARIYAMA, SpeciesId.MEDICHAM, SpeciesId.LUCARIO, SpeciesId.TOXICROAK, SpeciesId.THROH, SpeciesId.SAWK, SpeciesId.SCRAFTY, SpeciesId.MIENSHAO, SpeciesId.BEWEAR, SpeciesId.GRAPPLOCT, SpeciesId.ANNIHILAPE, SpeciesId.PAWMOT, SpeciesId.FLAMIGO, SpeciesId.PALDEA_TAUROS, SpeciesId.MACHCHAMP, SpeciesId.PINSIR, SpeciesId.HERACROSS, SpeciesId.BRELOOM, SpeciesId.CONKELDURR, SpeciesId.CRABOMINABLE, SpeciesId.HAWLUCHA, SpeciesId.HISUI_LILLIGANT, SpeciesId.SCOLIPEDE, SpeciesId.ESCAVALIER, SpeciesId.ACCELGOR ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONTOP ]}, { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [SpeciesId.GALLADE]}, SpeciesId.PANGORO, SpeciesId.SIRFETCHD, SpeciesId.HISUI_DECIDUEYE, SpeciesId.SCIZOR, SpeciesId.KLEAVOR ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CELESTEELA ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.FACTORY]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.MACHOP ], 28: [ SpeciesId.MACHOKE ]},
        { 1: [ SpeciesId.MAGNEMITE ], 30: [ SpeciesId.MAGNETON ]},
        { 1: [ SpeciesId.VOLTORB ], 30: [ SpeciesId.ELECTRODE ]},
        { 1: [ SpeciesId.TIMBURR ], 25: [ SpeciesId.GURDURR ]},
        { 1: [ SpeciesId.KLINK ], 38: [ SpeciesId.KLANG ], 49: [ SpeciesId.KLINKLANG ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BRONZOR ], 33: [ SpeciesId.BRONZONG ]}, SpeciesId.KLEFKI ]},
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.PORYGON ], 30: [ SpeciesId.PORYGON2 ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BELDUM ], 20: [ SpeciesId.METANG ], 45: [ SpeciesId.METAGROSS ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MAGEARNA ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.KLINKLANG, SpeciesId.KLEFKI ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MAGEARNA ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.MELTAN ], 48: [ SpeciesId.MELMETAL ]}]}
  },
  [BiomeId.SHARP_FIELD]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.VAROOM ], 40: [ SpeciesId.REVAVROOM ]},
        { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]},
        SpeciesId.SKARMORY, 
        SpeciesId.MAWILE,
        { 1: [ SpeciesId.NOSEPASS ], 35: [ SpeciesId.PROBOPASS ]},
        { 1: [ SpeciesId.KLINK ], 38: [ SpeciesId.KLANG ], 49: [ SpeciesId.KLINKLANG ]},
        { 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.WORMADAM ]},
        { 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.MOTHIM ]},
        { 1: [ SpeciesId.ALOLA_SANDSHREW ], 30: [ SpeciesId.ALOLA_SANDSLASH ]},
        { 1: [ SpeciesId.ALOLA_DIGLETT ], 26: [ SpeciesId.ALOLA_DUGTRIO ]},
        SpeciesId.TOGEDEMARU,
        SpeciesId.ORTHWORM
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BRONZOR ], 33: [ SpeciesId.BRONZONG ]}, SpeciesId.KLEFKI, { 1: [ SpeciesId.CRANIDOS ], 30: [ SpeciesId.RAMPARDOS ]}, { 1: [ SpeciesId.SHIELDON ], 30: [ SpeciesId.BASTIODON ]}, { 1: [ SpeciesId.RIOLU ], 35: [ SpeciesId.LUCARIO ]}, { 1: [ SpeciesId.DRILBUR ], 31: [ SpeciesId.EXCADRILL ]}, {1: [ SpeciesId.KARRABLAST ], 35: [ SpeciesId.ESCAVALIER ]}, { 1: [ SpeciesId.SHELMET ], 35: [ SpeciesId.ACCELGOR ]}, { 1: [ SpeciesId.FERROSEED ], 40: [ SpeciesId.FERROTHORN ]}, SpeciesId.DURANT ]},
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.PAWNIARD ], 52: [ SpeciesId.BISHARP ], 64: [ SpeciesId.KINGAMBIT ]}, { 1: [ SpeciesId.HONEDGE ], 35: [ SpeciesId.DOUBLADE ], 45: [ SpeciesId.AEGISLASH ]}, { 1: [ SpeciesId.GALAR_MEOWTH ], 28: [ SpeciesId.PERRSERKER ]}, { 1: [ SpeciesId.CUFANT ], 34: [ SpeciesId.COPPERAJAH ]}, { 1: [ SpeciesId.TINKATINK ], 24: [ SpeciesId.TINKATUFF ], 38: [ SpeciesId.TINKATON ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BELDUM ], 20: [ SpeciesId.METANG ], 45: [ SpeciesId.METAGROSS ]}, { 1: [ SpeciesId.DURALUDON ], 50: [ SpeciesId.ARCHALUDON ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.COBALION ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.KLINKLANG, SpeciesId.KLEFKI,SpeciesId.REVAVROOM, SpeciesId.AGGRON, SpeciesId.SKARMORY, SpeciesId.MAWILE, SpeciesId.PROBOPASS, SpeciesId.WORMADAM, SpeciesId.MOTHIM, SpeciesId.ALOLA_SANDSLASH, SpeciesId.ALOLA_DUGTRIO, SpeciesId.TOGEDEMARU, SpeciesId.ORTHWORM, SpeciesId.RAMPARDOS, SpeciesId.BASTIODON, SpeciesId.LUCARIO, SpeciesId.EXCADRILL, SpeciesId.ESCAVALIER, SpeciesId.ACCELGOR, SpeciesId.FERROTHORN, SpeciesId.DURANT ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.KINGAMBIT, SpeciesId.AEGISLASH, SpeciesId.PERRSERKER, SpeciesId.COPPERAJAH, SpeciesId.TINKATON ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.COBALION ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.RUINS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.DROWZEE ], 26: [ SpeciesId.HYPNO ]},
        { 1: [ SpeciesId.NATU ], 25: [ SpeciesId.XATU ]},
        SpeciesId.UNOWN,
        { 1: [ SpeciesId.SPOINK ], 32: [ SpeciesId.GRUMPIG ]},
        { 1: [ SpeciesId.BALTOY ], 36: [ SpeciesId.CLAYDOL ]},
        { 1: [ SpeciesId.ELGYEM ], 42: [ SpeciesId.BEHEEYEM ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ABRA ], 16: [ SpeciesId.KADABRA ]}, SpeciesId.SIGILYPH, { 1: [ SpeciesId.TINKATINK ], 24: [ SpeciesId.TINKATUFF ], 38: [ SpeciesId.TINKATON ]}]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MR_MIME, SpeciesId.WOBBUFFET, { 1: [ SpeciesId.GOTHITA ], 32: [ SpeciesId.GOTHORITA ], 41: [ SpeciesId.GOTHITELLE ]}, SpeciesId.STONJOURNER ]},
    [BiomePoolTier.SUPER_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [ SpeciesId.ESPEON ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.GALAR_YAMASK ], 34: [ SpeciesId.RUNERIGUS ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.GALAR_YAMASK ], 34: [ SpeciesId.RUNERIGUS ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.ARCHEN ], 37: [ SpeciesId.ARCHEOPS ]}]
    },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.REGISTEEL, SpeciesId.FEZANDIPITI ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ALAKAZAM, SpeciesId.HYPNO, SpeciesId.XATU, SpeciesId.GRUMPIG, SpeciesId.CLAYDOL, SpeciesId.SIGILYPH, SpeciesId.GOTHITELLE, SpeciesId.BEHEEYEM, SpeciesId.TINKATON ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [ SpeciesId.ESPEON ], [TimeOfDay.DUSK]: [ SpeciesId.RUNERIGUS ], [TimeOfDay.NIGHT]: [ SpeciesId.RUNERIGUS ], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.MIME_JR ], 20: [ SpeciesId.MR_MIME ]}, { 1: [ SpeciesId.WYNAUT ], 15: [ SpeciesId.WOBBUFFET ]}, SpeciesId.ARCHEOPS ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.REGISTEEL, SpeciesId.FEZANDIPITI ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DIALGA ]}
  },
  [BiomeId.WASTELAND]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [
        { 1: [ SpeciesId.BAGON ], 30: [ SpeciesId.SHELGON ], 50: [ SpeciesId.SALAMENCE ]},
        { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.SLIGGOO ], 80: [ SpeciesId.GOODRA ]},
        { 1: [ SpeciesId.JANGMO_O ], 35: [ SpeciesId.HAKAMO_O ], 45: [ SpeciesId.KOMMO_O ]}
      ],
      [TimeOfDay.DAY]: [
        { 1: [ SpeciesId.BAGON ], 30: [ SpeciesId.SHELGON ], 50: [ SpeciesId.SALAMENCE ]},
        { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.SLIGGOO ], 80: [ SpeciesId.GOODRA ]},
        { 1: [ SpeciesId.JANGMO_O ], 35: [ SpeciesId.HAKAMO_O ], 45: [ SpeciesId.KOMMO_O ]}
      ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR ], 55: [ SpeciesId.TYRANITAR ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR ], 55: [ SpeciesId.TYRANITAR ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]},
        { 1: [ SpeciesId.GIBLE ], 24: [ SpeciesId.GABITE ], 48: [ SpeciesId.GARCHOMP ]},
        { 1: [ SpeciesId.AXEW ], 38: [ SpeciesId.FRAXURE ], 48: [ SpeciesId.HAXORUS ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SWABLU ], 35: [ SpeciesId.ALTARIA ]}, SpeciesId.DRAMPA, SpeciesId.CYCLIZAR ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.DREEPY ], 50: [ SpeciesId.DRAKLOAK ], 60: [ SpeciesId.DRAGAPULT ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.DREEPY ], 50: [ SpeciesId.DRAKLOAK ], 60: [ SpeciesId.DRAGAPULT ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.DRATINI ], 30: [ SpeciesId.DRAGONAIR ], 55: [ SpeciesId.DRAGONITE ]}, { 1: [ SpeciesId.FRIGIBAX ], 35: [ SpeciesId.ARCTIBAX ], 54: [ SpeciesId.BAXCALIBUR ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.AERODACTYL, SpeciesId.DRUDDIGON, { 1: [ SpeciesId.TYRUNT ], 59: [ SpeciesId.TYRANTRUM ]}, SpeciesId.DRACOZOLT, SpeciesId.DRACOVISH ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.REGIDRAGO ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.SALAMENCE, SpeciesId.GOODRA, SpeciesId.KOMMO_O ],
      [TimeOfDay.DAY]: [ SpeciesId.SALAMENCE, SpeciesId.GOODRA, SpeciesId.KOMMO_O ],
      [TimeOfDay.DUSK]: [ SpeciesId.TYRANITAR, SpeciesId.DRAGAPULT ],
      [TimeOfDay.NIGHT]: [ SpeciesId.TYRANITAR, SpeciesId.DRAGAPULT ],
      [TimeOfDay.ALL]: [ SpeciesId.DRAGONITE, SpeciesId.FLYGON, SpeciesId.GARCHOMP, SpeciesId.HAXORUS, SpeciesId.DRAMPA, SpeciesId.BAXCALIBUR ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.AERODACTYL, SpeciesId.DRUDDIGON, SpeciesId.TYRANTRUM, SpeciesId.DRACOZOLT, SpeciesId.DRACOVISH ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.REGIDRAGO, SpeciesId.ROARING_MOON,  SpeciesId.RAGING_BOLT ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.KORAIDON ]}
  },
  [BiomeId.DRAGON_TEMPLE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]},
        { 1: [ SpeciesId.GIBLE ], 24: [ SpeciesId.GABITE ], 48: [ SpeciesId.GARCHOMP ]},
        { 1: [ SpeciesId.AXEW ], 38: [ SpeciesId.FRAXURE ], 48: [ SpeciesId.HAXORUS ]},
        { 1: [ SpeciesId.BAGON ], 30: [ SpeciesId.SHELGON ], 50: [ SpeciesId.SALAMENCE ]},
        { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.SLIGGOO ], 80: [ SpeciesId.GOODRA ]},
        { 1: [ SpeciesId.JANGMO_O ], 35: [ SpeciesId.HAKAMO_O ], 45: [ SpeciesId.KOMMO_O ]},
        { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.HISUI_SLIGGOO ], 80: [ SpeciesId.HISUI_GOODRA ]},
        { 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR ], 55: [ SpeciesId.TYRANITAR ]},
        { 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]},
        { 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ], 30: [ SpeciesId.NIDOQUEEN ]},
        { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ], 30: [ SpeciesId.NIDOKING ]},
        { 1: [ SpeciesId.CUBONE ], 28: [ SpeciesId.MAROWAK ]},
        { 1: [ SpeciesId.MAGIKARP ], 20: [ SpeciesId.GYARADOS ]},
        { 1: [ SpeciesId.DUNSPARCE ], 32:[ SpeciesId.DUDUNSPARCE ]},
        { 1: [ SpeciesId.SCRAGGY ], 39: [ SpeciesId.SCRAFTY ]},
        { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]},
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SWABLU ], 35: [ SpeciesId.ALTARIA ]}, SpeciesId.DRAMPA, SpeciesId.CYCLIZAR, { 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]}, { 1: [ SpeciesId.ONIX ], 25: [ SpeciesId.STEELIX ]}, { 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ], 49: [ SpeciesId.RHYPERIOR ]}, { 1: [ SpeciesId.HORSEA ], 32: [ SpeciesId.SEADRA ], 45: [ SpeciesId.KINGDRA ]}, { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]}, { 1: [ SpeciesId.MAREEP ], 15: [ SpeciesId.FLAAFFY ], 30: [ SpeciesId.AMPHAROS ]}, { 1: [ SpeciesId.CRANIDOS ], 30: [ SpeciesId.RAMPARDOS ]}, { 1: [ SpeciesId.SHIELDON ], 30: [ SpeciesId.BASTIODON ]}, { 1: [ SpeciesId.YANMA ], 33: [ SpeciesId.YANMEGA ]}, { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}, { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ], 45: [ SpeciesId.CHANDELURE ]}, { 1: [ SpeciesId.GOLETT ], 43: [ SpeciesId.GOLURK ]}, { 1: [ SpeciesId.SKRELP ], 48: [ SpeciesId.DRAGALGE ]}, { 1: [ SpeciesId.AMAURA ], 39: [ SpeciesId.AURORUS ]}, { 1: [ SpeciesId.NOIBAT ], 48: [ SpeciesId.NOIVERN ]}, SpeciesId.TURTONATOR, { 1: [ SpeciesId.SALANDIT ], 37: [ SpeciesId.SALAZZLE ]}
    ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.DRATINI ], 30: [ SpeciesId.DRAGONAIR ], 55: [ SpeciesId.DRAGONITE ]}, { 1: [ SpeciesId.FRIGIBAX ], 35: [ SpeciesId.ARCTIBAX ], 54: [ SpeciesId.BAXCALIBUR ]}, { 1: [ SpeciesId.DREEPY ], 50: [ SpeciesId.DRAKLOAK ], 60: [ SpeciesId.DRAGAPULT ]}, SpeciesId.TROPIUS, { 1: [ SpeciesId.TYNAMO ], 39: [ SpeciesId.EELEKTRIK ], 45: [ SpeciesId.EELEKTROSS ]}, { 1: [ SpeciesId.DURALUDON ], 50: [ SpeciesId.ARCHALUDON ]}
    ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.AERODACTYL, SpeciesId.DRUDDIGON, { 1: [ SpeciesId.TYRUNT ], 59: [ SpeciesId.TYRANTRUM ]}, SpeciesId.DRACOZOLT, SpeciesId.DRACOVISH, SpeciesId.LAPRAS, { 1: [ SpeciesId.CHARMANDER ], 16: [ SpeciesId.CHARMELEON ], 36: [ SpeciesId.CHARIZARD ]}, { 1: [ SpeciesId.TOTODILE ], 18: [ SpeciesId.CROCONAW ], 30: [ SpeciesId.FERALIGATR ]}, { 1: [ SpeciesId.TREECKO ], 16: [ SpeciesId.GROVYLE ], 36: [ SpeciesId.SCEPTILE ]}, { 1: [ SpeciesId.SNIVY ], 17: [ SpeciesId.SERVINE ], 36: [ SpeciesId.SERPERIOR ]}, { 1: [ SpeciesId.TIRTOUGA ], 37: [ SpeciesId.CARRACOSTA ]}, { 1: [ SpeciesId.ARCHEN ], 37: [ SpeciesId.ARCHEOPS ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.REGIDRAGO ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.DRAGONITE, SpeciesId.FLYGON, SpeciesId.GARCHOMP, SpeciesId.HAXORUS, SpeciesId.DRAMPA, SpeciesId.BAXCALIBUR,  SpeciesId.SALAMENCE, SpeciesId.GOODRA, SpeciesId.KOMMO_O, SpeciesId.TYRANITAR, SpeciesId.DRAGAPULT, SpeciesId.ARBOK, SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.MAROWAK, SpeciesId.GYARADOS, SpeciesId.DUDUNSPARCE, SpeciesId.SCRAFTY, SpeciesId.KROOKODILE, SpeciesId.STEELIX, SpeciesId.RHYPERIOR, SpeciesId.KINGDRA, SpeciesId.AGGRON, SpeciesId.AMPHAROS, SpeciesId.RAMPARDOS, SpeciesId.BASTIODON, SpeciesId.YANMEGA, SpeciesId.SCOLIPEDE, SpeciesId.CHANDELURE, SpeciesId.GOLURK, SpeciesId.DRAGALGE, SpeciesId.AURORUS, SpeciesId.NOIVERN, SpeciesId.SALAZZLE ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.AERODACTYL, SpeciesId.DRUDDIGON, SpeciesId.TYRANTRUM, SpeciesId.DRACOZOLT, SpeciesId.DRACOVISH, SpeciesId.TROPIUS, SpeciesId.EELEKTROSS, SpeciesId.ARCHALUDON, SpeciesId.LAPRAS, SpeciesId.CHARIZARD, SpeciesId.FERALIGATR, SpeciesId.SCEPTILE, SpeciesId.SERPERIOR, SpeciesId.CARRACOSTA, SpeciesId.ARCHEOPS ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.REGIDRAGO ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.PALKIA ]}
  },
  [BiomeId.DRAGON_FOREST]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.VIBRAVA ], 45: [ SpeciesId.FLYGON ]},
        { 1: [ SpeciesId.GIBLE ], 24: [ SpeciesId.GABITE ], 48: [ SpeciesId.GARCHOMP ]},
        { 1: [ SpeciesId.AXEW ], 38: [ SpeciesId.FRAXURE ], 48: [ SpeciesId.HAXORUS ]},
        { 1: [ SpeciesId.BAGON ], 30: [ SpeciesId.SHELGON ], 50: [ SpeciesId.SALAMENCE ]},
        { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.SLIGGOO ], 80: [ SpeciesId.GOODRA ]},
        { 1: [ SpeciesId.JANGMO_O ], 35: [ SpeciesId.HAKAMO_O ], 45: [ SpeciesId.KOMMO_O ]},
        { 1: [ SpeciesId.GOOMY ], 40: [ SpeciesId.HISUI_SLIGGOO ], 80: [ SpeciesId.HISUI_GOODRA ]},
        { 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR ], 55: [ SpeciesId.TYRANITAR ]},
        { 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]},
        { 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ], 30: [ SpeciesId.NIDOQUEEN ]},
        { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ], 30: [ SpeciesId.NIDOKING ]},
        { 1: [ SpeciesId.CUBONE ], 28: [ SpeciesId.ALOLA_MAROWAK ]},
        { 1: [ SpeciesId.PINECO ], 31: [ SpeciesId.FORRETRESS ]},
        { 1: [ SpeciesId.DUNSPARCE ], 32:[ SpeciesId.DUDUNSPARCE ]},
        { 1: [ SpeciesId.SCRAGGY ], 39: [ SpeciesId.SCRAFTY ]},
        { 1: [ SpeciesId.VENONAT ], 31: [ SpeciesId.VENOMOTH ]},
        { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]},
        { 1: [ SpeciesId.SKORUPI ], 40: [ SpeciesId.DRAPION ]},
        { 1: [ SpeciesId.EXEGGCUTE ], 35: [ SpeciesId.ALOLA_EXEGGUTOR ]},
        { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.FLAPPLE ]},
        { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.APPLETUN ]},
        { 1: [ SpeciesId.APPLIN ], 25: [ SpeciesId.DIPPLIN ], 35: [ SpeciesId.HYDRAPPLE ]},
        { 1: [ SpeciesId.CAPSAKID ], 35: [ SpeciesId.SCOVILLAIN ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SWABLU ], 35: [ SpeciesId.ALTARIA ]}, SpeciesId.DRAMPA, SpeciesId.CYCLIZAR, { 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]}, { 1: [ SpeciesId.ONIX ], 25: [ SpeciesId.STEELIX ]}, { 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ], 49: [ SpeciesId.RHYPERIOR ]}, { 1: [ SpeciesId.HORSEA ], 32: [ SpeciesId.SEADRA ], 45: [ SpeciesId.KINGDRA ]}, { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]}, { 1: [ SpeciesId.MAREEP ], 15: [ SpeciesId.FLAAFFY ], 30: [ SpeciesId.AMPHAROS ]}, { 1: [ SpeciesId.CRANIDOS ], 30: [ SpeciesId.RAMPARDOS ]}, { 1: [ SpeciesId.SHIELDON ], 30: [ SpeciesId.BASTIODON ]}, { 1: [ SpeciesId.YANMA ], 33: [ SpeciesId.YANMEGA ]}, { 1: [ SpeciesId.VENIPEDE ], 22: [ SpeciesId.WHIRLIPEDE ], 30: [ SpeciesId.SCOLIPEDE ]}, { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ], 45: [ SpeciesId.CHANDELURE ]}, { 1: [ SpeciesId.GOLETT ], 43: [ SpeciesId.GOLURK ]}, { 1: [ SpeciesId.SKRELP ], 48: [ SpeciesId.DRAGALGE ]}, { 1: [ SpeciesId.AMAURA ], 39: [ SpeciesId.AURORUS ]}, { 1: [ SpeciesId.NOIBAT ], 48: [ SpeciesId.NOIVERN ]}, SpeciesId.TURTONATOR, { 1: [ SpeciesId.SALANDIT ], 37: [ SpeciesId.SALAZZLE ]}, { 1: [ SpeciesId.SCYTHER ], 35: [ SpeciesId.SCIZOR ]}, { 1: [ SpeciesId.SCYTHER ], 35: [ SpeciesId.KLEAVOR ]}
    ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.DRATINI ], 30: [ SpeciesId.DRAGONAIR ], 55: [ SpeciesId.DRAGONITE ]}, { 1: [ SpeciesId.FRIGIBAX ], 35: [ SpeciesId.ARCTIBAX ], 54: [ SpeciesId.BAXCALIBUR ]}, { 1: [ SpeciesId.DREEPY ], 50: [ SpeciesId.DRAKLOAK ], 60: [ SpeciesId.DRAGAPULT ]}, SpeciesId.TROPIUS, { 1: [ SpeciesId.DURALUDON ], 50: [ SpeciesId.ARCHALUDON ]}, { 1: [ SpeciesId.LARVESTA ], 59: [ SpeciesId.VOLCARONA ]}
    ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.AERODACTYL, SpeciesId.DRUDDIGON, { 1: [ SpeciesId.TYRUNT ], 59: [ SpeciesId.TYRANTRUM ]}, SpeciesId.DRACOZOLT, SpeciesId.DRACOVISH, { 1: [ SpeciesId.CHARMANDER ], 16: [ SpeciesId.CHARMELEON ], 36: [ SpeciesId.CHARIZARD ]}, { 1: [ SpeciesId.TREECKO ], 16: [ SpeciesId.GROVYLE ], 36: [ SpeciesId.SCEPTILE ]}, { 1: [ SpeciesId.SNIVY ], 17: [ SpeciesId.SERVINE ], 36: [ SpeciesId.SERPERIOR ]}, { 1: [ SpeciesId.ARCHEN ], 37: [ SpeciesId.ARCHEOPS ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.POIPOLE ], 45: [ SpeciesId.NAGANADEL ]}]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.DRAGONITE, SpeciesId.FLYGON, SpeciesId.GARCHOMP, SpeciesId.HAXORUS, SpeciesId.DRAMPA, SpeciesId.BAXCALIBUR,  SpeciesId.SALAMENCE, SpeciesId.GOODRA, SpeciesId.KOMMO_O, SpeciesId.TYRANITAR, SpeciesId.DRAGAPULT, SpeciesId.ARBOK, SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.MAROWAK, SpeciesId.VENOMOTH, SpeciesId.DUDUNSPARCE, SpeciesId.SCRAFTY, SpeciesId.KROOKODILE, SpeciesId.STEELIX, SpeciesId.RHYPERIOR, SpeciesId.KINGDRA, SpeciesId.AGGRON, SpeciesId.AMPHAROS, SpeciesId.RAMPARDOS, SpeciesId.BASTIODON, SpeciesId.YANMEGA, SpeciesId.SCOLIPEDE, SpeciesId.CHANDELURE, SpeciesId.GOLURK, SpeciesId.DRAGALGE, SpeciesId.AURORUS, SpeciesId.NOIVERN, SpeciesId.SALAZZLE, SpeciesId.DRAPION, SpeciesId.ALOLA_EXEGGUTOR, SpeciesId.FLAPPLE, SpeciesId.APPLETUN, SpeciesId.HYDRAPPLE, SpeciesId.SCOVILLAIN, SpeciesId.SCIZOR, SpeciesId.KLEAVOR ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.AERODACTYL, SpeciesId.DRUDDIGON, SpeciesId.TYRANTRUM, SpeciesId.DRACOZOLT, SpeciesId.DRACOVISH, SpeciesId.TROPIUS, SpeciesId.ARCHALUDON, SpeciesId.CHARIZARD, SpeciesId.FERALIGATR, SpeciesId.SCEPTILE, SpeciesId.SERPERIOR, SpeciesId.VOLCARONA, SpeciesId.ARCHEOPS ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.POIPOLE ], 45: [ SpeciesId.NAGANADEL ]}]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.ABYSS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.MURKROW,
        { 1: [ SpeciesId.HOUNDOUR ], 24: [ SpeciesId.HOUNDOOM ]},
        SpeciesId.SABLEYE,
        { 1: [ SpeciesId.PURRLOIN ], 20: [ SpeciesId.LIEPARD ]},
        { 1: [ SpeciesId.PAWNIARD ], 52: [ SpeciesId.BISHARP ], 64: [ SpeciesId.KINGAMBIT ]},
        { 1: [ SpeciesId.NICKIT ], 18: [ SpeciesId.THIEVUL ]},
        { 1: [ SpeciesId.IMPIDIMP ], 32: [ SpeciesId.MORGREM ], 42: [ SpeciesId.GRIMMSNARL ]},
        { 1: [ SpeciesId.MASCHIFF ], 30: [ SpeciesId.MABOSSTIFF ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.ABSOL, SpeciesId.SPIRITOMB, { 1: [ SpeciesId.ZORUA ], 30: [ SpeciesId.ZOROARK ]}, { 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.UMBREON ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DARKRAI ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.HOUNDOOM, SpeciesId.SABLEYE, SpeciesId.ABSOL, SpeciesId.HONCHKROW, SpeciesId.SPIRITOMB, SpeciesId.LIEPARD, SpeciesId.ZOROARK, SpeciesId.HYDREIGON, SpeciesId.THIEVUL, SpeciesId.GRIMMSNARL, SpeciesId.MABOSSTIFF, SpeciesId.KINGAMBIT ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.UMBREON, SpeciesId.HISUI_SAMUROTT ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DARKRAI ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.YVELTAL ]}
  },
  [BiomeId.BLACK_MOUNTAIN]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.MURKROW,
        { 1: [ SpeciesId.HOUNDOUR ], 24: [ SpeciesId.HOUNDOOM ]},
        SpeciesId.SABLEYE,
        { 1: [ SpeciesId.PURRLOIN ], 20: [ SpeciesId.LIEPARD ]},
        { 1: [ SpeciesId.PAWNIARD ], 52: [ SpeciesId.BISHARP ], 64: [ SpeciesId.KINGAMBIT ]},
        { 1: [ SpeciesId.NICKIT ], 18: [ SpeciesId.THIEVUL ]},
        { 1: [ SpeciesId.IMPIDIMP ], 32: [ SpeciesId.MORGREM ], 42: [ SpeciesId.GRIMMSNARL ]},
        { 1: [ SpeciesId.MASCHIFF ], 30: [ SpeciesId.MABOSSTIFF ]},
        { 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ], 34: [ SpeciesId.SHIFTRY ]},
        { 1: [ SpeciesId.STUNKY ], 34: [ SpeciesId.SKUNTANK ]},
        { 1: [ SpeciesId.SCRAGGY ], 39: [ SpeciesId.SCRAFTY ]},
        { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]},
        { 1: [ SpeciesId.VULLABY ], 54: [ SpeciesId.MANDIBUZZ ]},
        SpeciesId.BOMBIRDIER,
        { 1: [ SpeciesId.BONSLY ], 15: [ SpeciesId.SUDOWOODO ]},
        { 1: [ SpeciesId.MISDREAVUS ], 30: [ SpeciesId.MISMAGIUS ]},
        { 1: [ SpeciesId.SHUPPET ], 37: [ SpeciesId.BANETTE ]},
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.DRIFLOON ], 28: [ SpeciesId.DRIFBLIM ]}, { 1: [ SpeciesId.DUSKULL ], 37: [ SpeciesId.DUSCLOPS ], 45: [ SpeciesId.DUSKNOIR ]}, { 1: [ SpeciesId.GASTLY ], 25: [ SpeciesId.HAUNTER ], 35: [ SpeciesId.GENGAR ]}, { 1: [ SpeciesId.YAMASK ], 34: [ SpeciesId.COFAGRIGUS ]}, { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ], 45: [ SpeciesId.CHANDELURE ]}, { 1: [ SpeciesId.GOLETT ], 43: [ SpeciesId.GOLURK ]}, { 1: [ SpeciesId.PHANTUMP ], 35: [ SpeciesId.TREVENANT ]}, { 1: [ SpeciesId.PUMKABOO ], 35: [ SpeciesId.GOURGEIST ]}, { 1: [ SpeciesId.GREAVARD ], 30: [ SpeciesId.HOUNDSTONE ]}]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.ABSOL, SpeciesId.SPIRITOMB, { 1: [ SpeciesId.ZORUA ], 30: [ SpeciesId.ZOROARK ]}, { 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]}, { 1: [ SpeciesId.HONEDGE ], 35: [ SpeciesId.DOUBLADE ], 45: [ SpeciesId.AEGISLASH ]}, { 1: [ SpeciesId.DREEPY ], 50: [ SpeciesId.DRAKLOAK ], 60: [ SpeciesId.DRAGAPULT ]}, { 1: [ SpeciesId.GALAR_YAMASK ], 34: [ SpeciesId.RUNERIGUS ]}, { 1: [ SpeciesId.GIMMIGHOUL ], 40: [ SpeciesId.GHOLDENGO ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.UMBREON, { 1: [ SpeciesId.HISUI_ZORUA ], 30: [ SpeciesId.HISUI_ZOROARK ]}, { 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR ], 55: [ SpeciesId.TYRANITAR ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GALAR_MOLTRES ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.HOUNDOOM, SpeciesId.SABLEYE, SpeciesId.ABSOL, SpeciesId.HONCHKROW, SpeciesId.SPIRITOMB, SpeciesId.LIEPARD, SpeciesId.ZOROARK, SpeciesId.HYDREIGON, SpeciesId.THIEVUL, SpeciesId.GRIMMSNARL, SpeciesId.MABOSSTIFF, SpeciesId.KINGAMBIT, SpeciesId.SHIFTRY, SpeciesId.SKUNTANK, SpeciesId.SCRAFTY, SpeciesId.KROOKODILE, SpeciesId.MANDIBUZZ, SpeciesId.BOMBIRDIER, SpeciesId.SUDOWOODO, SpeciesId.MISMAGIUS, SpeciesId.BANETTE, SpeciesId.DRIFBLIM, SpeciesId.DUSKNOIR, SpeciesId.GENGAR, SpeciesId.COFAGRIGUS, SpeciesId.CHANDELURE, SpeciesId.GOURGEIST, SpeciesId.HOUNDSTONE ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.UMBREON, SpeciesId.HISUI_SAMUROTT, SpeciesId.AEGISLASH, SpeciesId.DRAGAPULT, SpeciesId.RUNERIGUS, SpeciesId.GHOLDENGO, SpeciesId.HISUI_ZOROARK, SpeciesId.TYRANITAR ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GALAR_MOLTRES ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.BLACK_FIELD]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.MURKROW,
        { 1: [ SpeciesId.HOUNDOUR ], 24: [ SpeciesId.HOUNDOOM ]},
        SpeciesId.SABLEYE,
        { 1: [ SpeciesId.PURRLOIN ], 20: [ SpeciesId.LIEPARD ]},
        { 1: [ SpeciesId.PAWNIARD ], 52: [ SpeciesId.BISHARP ], 64: [ SpeciesId.KINGAMBIT ]},
        { 1: [ SpeciesId.NICKIT ], 18: [ SpeciesId.THIEVUL ]},
        { 1: [ SpeciesId.IMPIDIMP ], 32: [ SpeciesId.MORGREM ], 42: [ SpeciesId.GRIMMSNARL ]},
        { 1: [ SpeciesId.MASCHIFF ], 30: [ SpeciesId.MABOSSTIFF ]},
        { 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ], 34: [ SpeciesId.SHIFTRY ]},
        { 1: [ SpeciesId.STUNKY ], 34: [ SpeciesId.SKUNTANK ]},
        { 1: [ SpeciesId.SCRAGGY ], 39: [ SpeciesId.SCRAFTY ]},
        { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]},
        { 1: [ SpeciesId.VULLABY ], 54: [ SpeciesId.MANDIBUZZ ]},
        SpeciesId.BOMBIRDIER,
        { 1: [ SpeciesId.BONSLY ], 15: [ SpeciesId.SUDOWOODO ]},
        { 1: [ SpeciesId.MISDREAVUS ], 30: [ SpeciesId.MISMAGIUS ]},
        { 1: [ SpeciesId.SHUPPET ], 37: [ SpeciesId.BANETTE ]},
        { 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]},
        { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUIL ], 32: [ SpeciesId.UNFEAZANT ]},
        { 1: [ SpeciesId.SPEAROW ], 20: [ SpeciesId.FEAROW ]},
        { 1: [ SpeciesId.ALOLA_MEOWTH ], 30: [ SpeciesId.ALOLA_PERSIAN ]},
        { 1: [ SpeciesId.DODUO ], 31: [ SpeciesId.DODRIO ]},
        { 1: [ SpeciesId.POOCHYENA ], 18: [ SpeciesId.MIGHTYENA ]},
        { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]},
        SpeciesId.FARFETCHD,
        { 1: [ SpeciesId.TAILLOW ], 22: [ SpeciesId.SWELLOW ]},
        SpeciesId.SQUAWKABILLY
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.DRIFLOON ], 28: [ SpeciesId.DRIFBLIM ]}, { 1: [ SpeciesId.DUSKULL ], 37: [ SpeciesId.DUSCLOPS ], 45: [ SpeciesId.DUSKNOIR ]}, { 1: [ SpeciesId.GASTLY ], 25: [ SpeciesId.HAUNTER ], 35: [ SpeciesId.GENGAR ]}, { 1: [ SpeciesId.YAMASK ], 34: [ SpeciesId.COFAGRIGUS ]}, { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ], 45: [ SpeciesId.CHANDELURE ]}, { 1: [ SpeciesId.GOLETT ], 43: [ SpeciesId.GOLURK ]}, { 1: [ SpeciesId.PHANTUMP ], 35: [ SpeciesId.TREVENANT ]}, { 1: [ SpeciesId.PUMKABOO ], 35: [ SpeciesId.GOURGEIST ]}, { 1: [ SpeciesId.GREAVARD ], 30: [ SpeciesId.HOUNDSTONE ]}, SpeciesId.CHATOT, { 1: [ SpeciesId.ARCHEN ], 37: [ SpeciesId.ARCHEOPS ]}, { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]}, SpeciesId.HAWLUCHA, { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNIGHT ]}]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.ABSOL, SpeciesId.SPIRITOMB, { 1: [ SpeciesId.ZORUA ], 30: [ SpeciesId.ZOROARK ]}, { 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]}, { 1: [ SpeciesId.HONEDGE ], 35: [ SpeciesId.DOUBLADE ], 45: [ SpeciesId.AEGISLASH ]}, { 1: [ SpeciesId.DREEPY ], 50: [ SpeciesId.DRAKLOAK ], 60: [ SpeciesId.DRAGAPULT ]}, { 1: [ SpeciesId.GALAR_YAMASK ], 34: [ SpeciesId.RUNERIGUS ]}, { 1: [ SpeciesId.GIMMIGHOUL ], 40: [ SpeciesId.GHOLDENGO ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.UMBREON, { 1: [ SpeciesId.HISUI_ZORUA ], 30: [ SpeciesId.HISUI_ZOROARK ]}, { 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR ], 55: [ SpeciesId.TYRANITAR ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SPECTRIER ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.HOUNDOOM, SpeciesId.SABLEYE, SpeciesId.ABSOL, SpeciesId.HONCHKROW, SpeciesId.SPIRITOMB, SpeciesId.LIEPARD, SpeciesId.ZOROARK, SpeciesId.HYDREIGON, SpeciesId.THIEVUL, SpeciesId.GRIMMSNARL, SpeciesId.MABOSSTIFF, SpeciesId.KINGAMBIT, SpeciesId.SHIFTRY, SpeciesId.SKUNTANK, SpeciesId.SCRAFTY, SpeciesId.KROOKODILE, SpeciesId.MANDIBUZZ, SpeciesId.BOMBIRDIER, SpeciesId.SUDOWOODO, SpeciesId.MISMAGIUS, SpeciesId.BANETTE, SpeciesId.DRIFBLIM, SpeciesId.DUSKNOIR, SpeciesId.GENGAR, SpeciesId.COFAGRIGUS, SpeciesId.CHANDELURE, SpeciesId.GOURGEIST, SpeciesId.HOUNDSTONE, SpeciesId.PIDGEOT, SpeciesId.UNFEAZANT, SpeciesId.FEAROW, SpeciesId.ALOLA_PERSIAN, SpeciesId.DODRIO, SpeciesId.MIGHTYENA, SpeciesId.STARAPTOR, SpeciesId.FARFETCHD, SpeciesId.SWELLOW, SpeciesId.SQUAWKABILLY, SpeciesId.CHATOT, SpeciesId.ARCHEOPS, SpeciesId.TALONFLAME, SpeciesId.HAWLUCHA, SpeciesId.CORVIKNIGHT ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.UMBREON, SpeciesId.HISUI_SAMUROTT, SpeciesId.AEGISLASH, SpeciesId.DRAGAPULT, SpeciesId.RUNERIGUS, SpeciesId.GHOLDENGO, SpeciesId.HISUI_ZOROARK, SpeciesId.TYRANITAR ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SPECTRIER ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.DARK_FOREST]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.MURKROW,
        { 1: [ SpeciesId.HOUNDOUR ], 24: [ SpeciesId.HOUNDOOM ]},
        SpeciesId.SABLEYE,
        { 1: [ SpeciesId.PURRLOIN ], 20: [ SpeciesId.LIEPARD ]},
        { 1: [ SpeciesId.PAWNIARD ], 52: [ SpeciesId.BISHARP ], 64: [ SpeciesId.KINGAMBIT ]},
        { 1: [ SpeciesId.NICKIT ], 18: [ SpeciesId.THIEVUL ]},
        { 1: [ SpeciesId.IMPIDIMP ], 32: [ SpeciesId.MORGREM ], 42: [ SpeciesId.GRIMMSNARL ]},
        { 1: [ SpeciesId.MASCHIFF ], 30: [ SpeciesId.MABOSSTIFF ]},
        { 1: [ SpeciesId.SEEDOT ], 14: [ SpeciesId.NUZLEAF ], 34: [ SpeciesId.SHIFTRY ]},
        { 1: [ SpeciesId.STUNKY ], 34: [ SpeciesId.SKUNTANK ]},
        { 1: [ SpeciesId.SCRAGGY ], 39: [ SpeciesId.SCRAFTY ]},
        { 1: [ SpeciesId.SANDILE ], 29: [ SpeciesId.KROKOROK ], 40: [ SpeciesId.KROOKODILE ]},
        { 1: [ SpeciesId.VULLABY ], 54: [ SpeciesId.MANDIBUZZ ]},
        SpeciesId.BOMBIRDIER,
        { 1: [ SpeciesId.BONSLY ], 15: [ SpeciesId.SUDOWOODO ]},
        { 1: [ SpeciesId.MISDREAVUS ], 30: [ SpeciesId.MISMAGIUS ]},
        { 1: [ SpeciesId.SHUPPET ], 37: [ SpeciesId.BANETTE ]},
        { 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]},
        { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUIL ], 32: [ SpeciesId.UNFEAZANT ]},
        { 1: [ SpeciesId.SPEAROW ], 20: [ SpeciesId.FEAROW ]},
        { 1: [ SpeciesId.ALOLA_MEOWTH ], 30: [ SpeciesId.ALOLA_PERSIAN ]},
        { 1: [ SpeciesId.DODUO ], 31: [ SpeciesId.DODRIO ]},
        { 1: [ SpeciesId.POOCHYENA ], 18: [ SpeciesId.MIGHTYENA ]},
        { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]},
        SpeciesId.FARFETCHD,
        { 1: [ SpeciesId.TAILLOW ], 22: [ SpeciesId.SWELLOW ]},
        SpeciesId.SQUAWKABILLY,
        { 1: [ SpeciesId.EKANS ], 22: [ SpeciesId.ARBOK ]},
        { 1: [ SpeciesId.NIDORAN_F ], 16: [ SpeciesId.NIDORINA ], 36: [ SpeciesId.NIDOQUEEN ]},
        { 1: [ SpeciesId.NIDORAN_M ], 16: [ SpeciesId.NIDORINO ], 36: [ SpeciesId.NIDOKING ]},
        { 1: [ SpeciesId.ZUBAT ], 22: [ SpeciesId.GOLBAT ], 36: [ SpeciesId.CROBAT ]},
        { 1: [ SpeciesId.ODDISH ], 21: [ SpeciesId.GLOOM ], 36: [ SpeciesId.VILEPLUME ]},
        { 1: [ SpeciesId.PINECO ], 31: [ SpeciesId.FORRETRESS ]},
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.DRIFLOON ], 28: [ SpeciesId.DRIFBLIM ]}, { 1: [ SpeciesId.DUSKULL ], 37: [ SpeciesId.DUSCLOPS ], 45: [ SpeciesId.DUSKNOIR ]}, { 1: [ SpeciesId.GASTLY ], 25: [ SpeciesId.HAUNTER ], 35: [ SpeciesId.GENGAR ]}, { 1: [ SpeciesId.YAMASK ], 34: [ SpeciesId.COFAGRIGUS ]}, { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ], 45: [ SpeciesId.CHANDELURE ]}, { 1: [ SpeciesId.GOLETT ], 43: [ SpeciesId.GOLURK ]}, { 1: [ SpeciesId.PHANTUMP ], 35: [ SpeciesId.TREVENANT ]}, { 1: [ SpeciesId.PUMKABOO ], 35: [ SpeciesId.GOURGEIST ]}, { 1: [ SpeciesId.GREAVARD ], 30: [ SpeciesId.HOUNDSTONE ]}, SpeciesId.CHATOT, { 1: [ SpeciesId.ARCHEN ], 37: [ SpeciesId.ARCHEOPS ]}, { 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]}, SpeciesId.HAWLUCHA, { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNIGHT ]}, { 1: [ SpeciesId.ALOLA_VULPIX ], 30: [ SpeciesId.ALOLA_NINETALES ]}, { 1: [ SpeciesId.VENONAT ], 31: [ SpeciesId.VENOMOTH ]}, { 1: [ SpeciesId.ALOLA_GRIMER ], 38: [ SpeciesId.ALOLA_MUK ]}]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.ABSOL, SpeciesId.SPIRITOMB, { 1: [ SpeciesId.ZORUA ], 30: [ SpeciesId.ZOROARK ]}, { 1: [ SpeciesId.DEINO ], 50: [ SpeciesId.ZWEILOUS ], 64: [ SpeciesId.HYDREIGON ]}, { 1: [ SpeciesId.HONEDGE ], 35: [ SpeciesId.DOUBLADE ], 45: [ SpeciesId.AEGISLASH ]}, { 1: [ SpeciesId.DREEPY ], 50: [ SpeciesId.DRAKLOAK ], 60: [ SpeciesId.DRAGAPULT ]}, { 1: [ SpeciesId.GALAR_YAMASK ], 34: [ SpeciesId.RUNERIGUS ]}, { 1: [ SpeciesId.GIMMIGHOUL ], 40: [ SpeciesId.GHOLDENGO ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.UMBREON, { 1: [ SpeciesId.HISUI_ZORUA ], 30: [ SpeciesId.HISUI_ZOROARK ]}, { 1: [ SpeciesId.LARVITAR ], 30: [ SpeciesId.PUPITAR ], 55: [ SpeciesId.TYRANITAR ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_JUGULIS ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.HOUNDOOM, SpeciesId.SABLEYE, SpeciesId.ABSOL, SpeciesId.HONCHKROW, SpeciesId.SPIRITOMB, SpeciesId.LIEPARD, SpeciesId.ZOROARK, SpeciesId.HYDREIGON, SpeciesId.THIEVUL, SpeciesId.GRIMMSNARL, SpeciesId.MABOSSTIFF, SpeciesId.KINGAMBIT, SpeciesId.SHIFTRY, SpeciesId.SKUNTANK, SpeciesId.SCRAFTY, SpeciesId.KROOKODILE, SpeciesId.MANDIBUZZ, SpeciesId.BOMBIRDIER, SpeciesId.SUDOWOODO, SpeciesId.MISMAGIUS, SpeciesId.BANETTE, SpeciesId.DRIFBLIM, SpeciesId.DUSKNOIR, SpeciesId.GENGAR, SpeciesId.COFAGRIGUS, SpeciesId.CHANDELURE, SpeciesId.GOURGEIST, SpeciesId.HOUNDSTONE, SpeciesId.PIDGEOT, SpeciesId.UNFEAZANT, SpeciesId.FEAROW, SpeciesId.ALOLA_PERSIAN, SpeciesId.DODRIO, SpeciesId.MIGHTYENA, SpeciesId.STARAPTOR, SpeciesId.FARFETCHD, SpeciesId.SWELLOW, SpeciesId.SQUAWKABILLY, SpeciesId.CHATOT, SpeciesId.ARCHEOPS, SpeciesId.TALONFLAME, SpeciesId.HAWLUCHA, SpeciesId.CORVIKNIGHT, SpeciesId.ARBOK, SpeciesId.NIDOQUEEN, SpeciesId.NIDOKING, SpeciesId.CROBAT, SpeciesId.VILEPLUME, SpeciesId.FORRETRESS, SpeciesId.ALOLA_NINETALES, SpeciesId.VENOMOTH, SpeciesId.ALOLA_MUK, SpeciesId.GRIMSNARL ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.UMBREON, SpeciesId.HISUI_SAMUROTT, SpeciesId.AEGISLASH, SpeciesId.DRAGAPULT, SpeciesId.RUNERIGUS, SpeciesId.GHOLDENGO, SpeciesId.HISUI_ZOROARK, SpeciesId.TYRANITAR ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_JUGULIS ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.STAR_MOUNTAIN]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BLIPBUG ], 10: [ SpeciesId.DOTTLER ], 30: [ SpeciesId.ORBEETLE ]}, SpeciesId.SOLROCK,  SpeciesId.LUNATONE, SpeciesId.CLEFAIRY, SpeciesId.JIGGLYPUFF, { 1: [ SpeciesId.BRONZOR ], 33: [ SpeciesId.BRONZONG ]}, { 1: [ SpeciesId.MUNNA ], 30: [ SpeciesId.MUSHARNA ]}, { 1: [ SpeciesId.ABRA ], 16: [ SpeciesId.KADABRA ], 35: [ SpeciesId.ALAKAZAM ]}, SpeciesId.MINIOR, { 1: [ SpeciesId.MIME_JR ], 15: [ SpeciesId.MR_MIME ]}, { 1: [ SpeciesId.MIME_JR ], 15: [ SpeciesId.GALAR_MR_MIME ], 42: [ SpeciesId.MR_RIME ]}, SpeciesId.INDEEDEE ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BALTOY ], 36: [ SpeciesId.CLAYDOL ]}, { 1: [ SpeciesId.ELGYEM ], 42: [ SpeciesId.BEHEEYEM ]}]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BELDUM ], 20: [ SpeciesId.METANG ], 45: [ SpeciesId.METAGROSS ]}, SpeciesId.SIGILYPH, { 1: [ SpeciesId.GOTHITA ], 32: [ SpeciesId.GOTHORITA ], 41: [ SpeciesId.GOTHITELLE ]}, { 1: [ SpeciesId.SOLOSIS ], 32: [ SpeciesId.DUOSION ], 41: [ SpeciesId.REUNICLUS ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.PORYGON ], 30: [ SpeciesId.PORYGON2 ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JIRACHI ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SOLROCK, SpeciesId.CLEFABLE, SpeciesId.WIGGLYTUFF, SpeciesId.LUNATONE, SpeciesId.BRONZONG, SpeciesId.ORBEETLE, SpeciesId.MUSHARNA, SpeciesId.MINIOR, SpeciesId.ALAKAZAM, SpeciesId.MR_MIME, SpeciesId.MR_RIME, SpeciesId.INDEEDEE ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GOTHITELLE, SpeciesId.SIGILYPH, SpeciesId.REUNICLUS, SpeciesId.METAGROSS, SpeciesId.PORYGON_Z ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.JIRACHI ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: []}
  },
  [BiomeId.SPACE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [ SpeciesId.SOLROCK ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ SpeciesId.LUNATONE ],
      [TimeOfDay.ALL]: [ SpeciesId.CLEFAIRY, { 1: [ SpeciesId.BRONZOR ], 33: [ SpeciesId.BRONZONG ]}, { 1: [ SpeciesId.MUNNA ], 30: [ SpeciesId.MUSHARNA ]}, SpeciesId.MINIOR ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BALTOY ], 36: [ SpeciesId.CLAYDOL ]}, { 1: [ SpeciesId.ELGYEM ], 42: [ SpeciesId.BEHEEYEM ]}]},
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BELDUM ], 20: [ SpeciesId.METANG ], 45: [ SpeciesId.METAGROSS ]}, SpeciesId.SIGILYPH, { 1: [ SpeciesId.SOLOSIS ], 32: [ SpeciesId.DUOSION ], 41: [ SpeciesId.REUNICLUS ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.PORYGON ], 30: [ SpeciesId.PORYGON2 ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.COSMOG ], 43: [ SpeciesId.COSMOEM ]} ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [ SpeciesId.SOLROCK ], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [ SpeciesId.LUNATONE ], [TimeOfDay.ALL]: [ SpeciesId.CLEFABLE, SpeciesId.BRONZONG, SpeciesId.MUSHARNA, SpeciesId.REUNICLUS, SpeciesId.MINIOR ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.METAGROSS, SpeciesId.PORYGON_Z ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DEOXYS ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [ SpeciesId.SOLGALEO ], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [ SpeciesId.LUNALA ], [TimeOfDay.ALL]: [ SpeciesId.NECROZMA ]}
  },
  [BiomeId.CONSTRUCTION_SITE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.MACHOP ], 28: [ SpeciesId.MACHOKE ]},
        { 1: [ SpeciesId.MAGNEMITE ], 30: [ SpeciesId.MAGNETON ]},
        { 1: [ SpeciesId.DRILBUR ], 31: [ SpeciesId.EXCADRILL ]},
        { 1: [ SpeciesId.TIMBURR ], 25: [ SpeciesId.GURDURR ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.GRIMER ], 38: [ SpeciesId.MUK ]},
        { 1: [ SpeciesId.KOFFING ], 35: [ SpeciesId.WEEZING ]},
        { 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ]},
        { 1: [ SpeciesId.SCRAGGY ], 39: [ SpeciesId.SCRAFTY ]}
      ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.GALAR_MEOWTH ], 28: [ SpeciesId.PERRSERKER ]}], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ONIX, {1: [ SpeciesId.TYROGUE ], 20: [ SpeciesId.HITMONLEE ], 20: [ SpeciesId.HITMONCHAN ]}, SpeciesId.DURALUDON ]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DITTO, {1: [ SpeciesId. TYROGUE ], 20: [ SpeciesId.HITMONTOP ]}]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.STAKATAKA ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MACHAMP, SpeciesId.CONKELDURR ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [ SpeciesId.PERRSERKER ], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ARCHALUDON ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.STAKATAKA ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.SANDY_SHOCKS ]}
  },
  [BiomeId.JUNGLE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [ SpeciesId.VESPIQUEN, { 1: [ SpeciesId.CHERUBI ], 25: [ SpeciesId.CHERRIM ]}, { 1: [ SpeciesId.SEWADDLE ], 20: [ SpeciesId.SWADLOON ], 30: [ SpeciesId.LEAVANNY ]}],
      [TimeOfDay.DAY]: [ SpeciesId.VESPIQUEN, { 1: [ SpeciesId.CHERUBI ], 25: [ SpeciesId.CHERRIM ]}, { 1: [ SpeciesId.SEWADDLE ], 20: [ SpeciesId.SWADLOON ], 30: [ SpeciesId.LEAVANNY ]}],
      [TimeOfDay.DUSK]: [ SpeciesId.SHROOMISH, { 1: [ SpeciesId.PURRLOIN ], 20: [ SpeciesId.LIEPARD ]}, { 1: [ SpeciesId.FOONGUS ], 39: [ SpeciesId.AMOONGUSS ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.SPINARAK ], 22: [ SpeciesId.ARIADOS ]}, SpeciesId.SHROOMISH, { 1: [ SpeciesId.PURRLOIN ], 20: [ SpeciesId.LIEPARD ]}, { 1: [ SpeciesId.FOONGUS ], 39: [ SpeciesId.AMOONGUSS ]}],
      [TimeOfDay.ALL]: [ SpeciesId.AIPOM, { 1: [ SpeciesId.BLITZLE ], 27: [ SpeciesId.ZEBSTRIKA ]}, { 1: [ SpeciesId.PIKIPEK ], 14: [ SpeciesId.TRUMBEAK ], 28: [ SpeciesId.TOUCANNON ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [ SpeciesId.EXEGGCUTE, SpeciesId.TROPIUS, SpeciesId.COMBEE, SpeciesId.KOMALA ],
      [TimeOfDay.DAY]: [ SpeciesId.EXEGGCUTE, SpeciesId.TROPIUS, SpeciesId.COMBEE, SpeciesId.KOMALA ],
      [TimeOfDay.DUSK]: [ SpeciesId.TANGELA, { 1: [ SpeciesId.SPINARAK ], 22: [ SpeciesId.ARIADOS ]}, { 1: [ SpeciesId.PANCHAM ], 52: [ SpeciesId.PANGORO ]}],
      [TimeOfDay.NIGHT]: [ SpeciesId.TANGELA, { 1: [ SpeciesId.PANCHAM ], 52: [ SpeciesId.PANGORO ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.PANSAGE ], 30: [ SpeciesId.SIMISAGE ]},
        { 1: [ SpeciesId.PANSEAR ], 30: [ SpeciesId.SIMISEAR ]},
        { 1: [ SpeciesId.PANPOUR ], 30: [ SpeciesId.SIMIPOUR ]},
        { 1: [ SpeciesId.JOLTIK ], 36: [ SpeciesId.GALVANTULA ]},
        { 1: [ SpeciesId.LITLEO ], 35: [ SpeciesId.PYROAR ]},
        { 1: [ SpeciesId.FOMANTIS ], 44: [ SpeciesId.LURANTIS ]},
        SpeciesId.FALINKS
      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.FOONGUS ], 39: [ SpeciesId.AMOONGUSS ]}, SpeciesId.PASSIMIAN, { 1: [ SpeciesId.GALAR_PONYTA ], 40: [ SpeciesId.GALAR_RAPIDASH ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.FOONGUS ], 39: [ SpeciesId.AMOONGUSS ]}, SpeciesId.PASSIMIAN ],
      [TimeOfDay.DUSK]: [ SpeciesId.ORANGURU ],
      [TimeOfDay.NIGHT]: [ SpeciesId.ORANGURU ],
      [TimeOfDay.ALL]: [
        SpeciesId.SCYTHER,
        SpeciesId.YANMA,
        { 1: [ SpeciesId.SLAKOTH ], 18: [ SpeciesId.VIGOROTH ], 36: [ SpeciesId.SLAKING ]},
        SpeciesId.SEVIPER,
        SpeciesId.CARNIVINE,
        { 1: [ SpeciesId.SNIVY ], 17: [ SpeciesId.SERVINE ], 36: [ SpeciesId.SERPERIOR ]},
        { 1: [ SpeciesId.GROOKEY ], 16: [ SpeciesId.THWACKEY ], 35: [ SpeciesId.RILLABOOM ]}
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.KANGASKHAN, SpeciesId.CHATOT, SpeciesId.KLEAVOR ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TAPU_LELE, SpeciesId.ZARUDE, SpeciesId.MUNKIDORI ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.EXEGGUTOR, SpeciesId.TROPIUS, SpeciesId.CHERRIM, SpeciesId.LEAVANNY, SpeciesId.KOMALA ],
      [TimeOfDay.DAY]: [ SpeciesId.EXEGGUTOR, SpeciesId.TROPIUS, SpeciesId.CHERRIM, SpeciesId.LEAVANNY, SpeciesId.KOMALA ],
      [TimeOfDay.DUSK]: [ SpeciesId.BRELOOM, SpeciesId.TANGROWTH, SpeciesId.AMOONGUSS, SpeciesId.PANGORO ],
      [TimeOfDay.NIGHT]: [ SpeciesId.BRELOOM, SpeciesId.TANGROWTH, SpeciesId.AMOONGUSS, SpeciesId.PANGORO ],
      [TimeOfDay.ALL]: [ SpeciesId.SEVIPER, SpeciesId.AMBIPOM, SpeciesId.CARNIVINE, SpeciesId.YANMEGA, SpeciesId.GALVANTULA, SpeciesId.PYROAR, SpeciesId.TOUCANNON, SpeciesId.LURANTIS, SpeciesId.FALINKS ]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [ SpeciesId.AMOONGUSS, SpeciesId.GALAR_RAPIDASH ],
      [TimeOfDay.DAY]: [ SpeciesId.AMOONGUSS ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.KANGASKHAN, SpeciesId.SCIZOR, SpeciesId.SLAKING, SpeciesId.LEAFEON, SpeciesId.SERPERIOR, SpeciesId.RILLABOOM, SpeciesId.KLEAVOR ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TAPU_LELE, SpeciesId.ZARUDE, SpeciesId.MUNKIDORI ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MEW, SpeciesId.SLITHER_WING ]}
  },
  [BiomeId.FAIRY_CAVE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.JIGGLYPUFF ], 30: [ SpeciesId.WIGGLYTUFF ]},
        { 1: [ SpeciesId.MARILL ], 18: [ SpeciesId.AZUMARILL ]},
        SpeciesId.MAWILE,
        { 1: [ SpeciesId.SPRITZEE ], 40: [ SpeciesId.AROMATISSE ]},
        { 1: [ SpeciesId.SWIRLIX ], 40: [ SpeciesId.SLURPUFF ]},
        { 1: [ SpeciesId.CUTIEFLY ], 25: [ SpeciesId.RIBOMBEE ]},
        { 1: [ SpeciesId.MORELULL ], 24: [ SpeciesId.SHIINOTIC ]},
        { 1: [ SpeciesId.MILCERY ], 30: [ SpeciesId.ALCREMIE ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.CLEFAIRY,
        SpeciesId.TOGETIC,
        { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [ SpeciesId.GARDEVOIR ]},
        SpeciesId.CARBINK,
        SpeciesId.COMFEY,
        { 1: [ SpeciesId.HATENNA ], 32: [ SpeciesId.HATTREM ], 42: [ SpeciesId.HATTERENE ]}
      ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.AUDINO ]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DIANCIE ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.WIGGLYTUFF, SpeciesId.MAWILE, SpeciesId.TOGEKISS, SpeciesId.AUDINO, SpeciesId.AROMATISSE, SpeciesId.SLURPUFF, SpeciesId.CARBINK, SpeciesId.RIBOMBEE, SpeciesId.SHIINOTIC, SpeciesId.COMFEY, SpeciesId.HATTERENE, SpeciesId.ALCREMIE ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DIANCIE ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.FAIRY_FOREST]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.JIGGLYPUFF ], 30: [ SpeciesId.WIGGLYTUFF ]},
        { 1: [ SpeciesId.MARILL ], 18: [ SpeciesId.AZUMARILL ]},
        SpeciesId.MAWILE,
        { 1: [ SpeciesId.SPRITZEE ], 40: [ SpeciesId.AROMATISSE ]},
        { 1: [ SpeciesId.SWIRLIX ], 40: [ SpeciesId.SLURPUFF ]},
        { 1: [ SpeciesId.CUTIEFLY ], 25: [ SpeciesId.RIBOMBEE ]},
        { 1: [ SpeciesId.MORELULL ], 24: [ SpeciesId.SHIINOTIC ]},
        { 1: [ SpeciesId.MIME_JR ], 15: [ SpeciesId.MR_MIME ]},
        { 1: [ SpeciesId.SNUBBULL ], 23: [ SpeciesId.GRANBULL ]},
        { 1: [ SpeciesId.COTTONEE ], 30: [ SpeciesId.WHIMSICOTT ]},
        SpeciesId.DEDENNE,
        SpeciesId.KLEFKI,
        { 1: [ SpeciesId.FIDOUGH ], 26: [ SpeciesId.DACHSBUN ]},
        { 1: [ SpeciesId.MILCERY ], 30: [ SpeciesId.ALCREMIE ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.CLEFAIRY,
        SpeciesId.TOGETIC,
        { 1: [ SpeciesId.RALTS ], 20: [ SpeciesId.KIRLIA ], 30: [ SpeciesId.GARDEVOIR ]},
        { 1: [ SpeciesId.GALAR_PONYTA ], 40: [ SpeciesId.GALAR_RAPIDASH ]}, 
        { 1: [ SpeciesId.ALOLA_VULPIX ], 35: [ SpeciesId.ALOLA_NINETALES ]},
        { 1: [ SpeciesId.GIRAFARIG ], 32: [ SpeciesId.FARIGIRAF ]},
        { 1: [ SpeciesId.MINCCINO ], 25: [ SpeciesId.CINCCINO ]},
        { 1: [ SpeciesId.DEERLING ], 34: [ SpeciesId.SAWSBUCK ]},
        { 1: [ SpeciesId.TANDEMAUS ], 25: [ SpeciesId.MAUSHOLD ]},
        SpeciesId.CARBINK,
        SpeciesId.COMFEY,
        { 1: [ SpeciesId.IMPIDIMP ], 32: [ SpeciesId.MORGREM ], 42: [ SpeciesId.GRIMMSNARL ]},
        { 1: [ SpeciesId.TINKATINK ], 24: [ SpeciesId.TINKATUFF ], 38: [ SpeciesId.TINKATON ]},
        { 1: [ SpeciesId.HATENNA ], 32: [ SpeciesId.HATTREM ], 42: [ SpeciesId.HATTERENE ]}
      ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.AUDINO, SpeciesId.MIMIKYU, { 1: [ SpeciesId.HAPPINY ], 25: [ SpeciesId.CHANSEY ], 35: [ SpeciesId.BLISSEY ]}, SpeciesId.INDEEDEE, { 1: [ SpeciesId.HISUI_ZORUA ], 30: [ SpeciesId.HISUI_ZOROARK ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ETERNAL_FLOETTE ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.WIGGLYTUFF, SpeciesId.MAWILE, SpeciesId.TOGEKISS, SpeciesId.AUDINO, SpeciesId.AROMATISSE, SpeciesId.SLURPUFF, SpeciesId.CARBINK, SpeciesId.RIBOMBEE, SpeciesId.SHIINOTIC, SpeciesId.COMFEY, SpeciesId.HATTERENE, SpeciesId.ALCREMIE, SpeciesId.MR_MIME, SpeciesId.GRANBULL, SpeciesId.WHIMSICOTT, SpeciesId.DEDENNE, SpeciesId.KLEFKI, SpeciesId.DACHSBUN, SpeciesId.GALAR_RAPIDASH, SpeciesId.ALOLA_NINETALES, SpeciesId.FARIGIRAF, SpeciesId.CINCCINO, SpeciesId.SAWSBUCK, SpeciesId.MAUSHOLD, SpeciesId.GRIMMSNARL, SpeciesId.TINKATON ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ETERNAL_FLOETTE, SpeciesId.MIMIKYU, SpeciesId.BLISSEY, SpeciesId.INDEEDEE, SpeciesId.HISUI_ZOROARK ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.IRON_VALIANT ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.XERNEAS ]}
  },
  [BiomeId.TEMPLE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.GASTLY ], 25: [ SpeciesId.HAUNTER ]},
        { 1: [ SpeciesId.NATU ], 25: [ SpeciesId.XATU ]},
        { 1: [ SpeciesId.DUSKULL ], 37: [ SpeciesId.DUSCLOPS ]},
        { 1: [ SpeciesId.YAMASK ], 34: [ SpeciesId.COFAGRIGUS ]},
        { 1: [ SpeciesId.GOLETT ], 43: [ SpeciesId.GOLURK ]},
        { 1: [ SpeciesId.HONEDGE ], 35: [ SpeciesId.DOUBLADE ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.CUBONE ], 28: [ SpeciesId.MAROWAK ]},
        { 1: [ SpeciesId.BALTOY ], 36: [ SpeciesId.CLAYDOL ]},
        { 1: [ SpeciesId.CHINGLING ], 20: [ SpeciesId.CHIMECHO ]},
        { 1: [ SpeciesId.SKORUPI ], 40: [ SpeciesId.DRAPION ]},
        { 1: [ SpeciesId.LITWICK ], 41: [ SpeciesId.LAMPENT ]}
      ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.GIMMIGHOUL ], 40: [ SpeciesId.GHOLDENGO ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.HOOPA, SpeciesId.TAPU_KOKO ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CHIMECHO, SpeciesId.COFAGRIGUS, SpeciesId.GOLURK, SpeciesId.AEGISLASH ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GHOLDENGO ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.HOOPA, SpeciesId.TAPU_KOKO ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.REGIGIGAS ]}
  },
  [BiomeId.SLUM]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.PATRAT ], 20: [ SpeciesId.WATCHOG ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.PATRAT ], 20: [ SpeciesId.WATCHOG ]}],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.RATTATA ], 20: [ SpeciesId.RATICATE ]},
        { 1: [ SpeciesId.GRIMER ], 38: [ SpeciesId.MUK ]},
        { 1: [ SpeciesId.KOFFING ], 35: [ SpeciesId.WEEZING ]},
        { 1: [ SpeciesId.TRUBBISH ], 36: [ SpeciesId.GARBODOR ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.STUNKY ], 34: [ SpeciesId.SKUNTANK ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.STUNKY ], 34: [ SpeciesId.SKUNTANK ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.BURMY ], 20: [ SpeciesId.WORMADAM ]}]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [ SpeciesId.TOXTRICITY, { 1: [ SpeciesId.GALAR_LINOONE ], 65: [ SpeciesId.OBSTAGOON ]}, SpeciesId.GALAR_ZIGZAGOON ],
      [TimeOfDay.NIGHT]: [ SpeciesId.TOXTRICITY, { 1: [ SpeciesId.GALAR_LINOONE ], 65: [ SpeciesId.OBSTAGOON ]}, SpeciesId.GALAR_ZIGZAGOON ],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.VAROOM ], 40: [ SpeciesId.REVAVROOM ]}]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GUZZLORD ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [ SpeciesId.SKUNTANK, SpeciesId.WATCHOG ], [TimeOfDay.NIGHT]: [ SpeciesId.SKUNTANK, SpeciesId.WATCHOG ], [TimeOfDay.ALL]: [ SpeciesId.MUK, SpeciesId.WEEZING, SpeciesId.WORMADAM, SpeciesId.GARBODOR ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [ SpeciesId.TOXTRICITY, SpeciesId.OBSTAGOON ], [TimeOfDay.NIGHT]: [ SpeciesId.TOXTRICITY, SpeciesId.OBSTAGOON ], [TimeOfDay.ALL]: [ SpeciesId.REVAVROOM, SpeciesId.GALAR_WEEZING ]},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GUZZLORD ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.SNOWY_FOREST]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [ SpeciesId.SNEASEL, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]}, { 1: [ SpeciesId.SNOM ], 20: [ SpeciesId.FROSMOTH ]}],
      [TimeOfDay.NIGHT]: [ SpeciesId.SNEASEL, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]}, { 1: [ SpeciesId.SNOM ], 20: [ SpeciesId.FROSMOTH ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SWINUB ], 33: [ SpeciesId.PILOSWINE ]}, { 1: [ SpeciesId.SNOVER ], 40: [ SpeciesId.ABOMASNOW ]}, SpeciesId.EISCUE ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [ SpeciesId.SNEASEL, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]}, SpeciesId.STANTLER ],
      [TimeOfDay.DAY]: [ SpeciesId.SNEASEL, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]}, SpeciesId.STANTLER ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.GALAR_DARUMAKA ], 30: [ SpeciesId.GALAR_DARMANITAN ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.GALAR_DARUMAKA ], 30: [ SpeciesId.GALAR_DARMANITAN ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.DELIBIRD, { 1: [ SpeciesId.ALOLA_SANDSHREW ], 30: [ SpeciesId.ALOLA_SANDSLASH ]}, { 1: [ SpeciesId.ALOLA_VULPIX ], 30: [ SpeciesId.ALOLA_NINETALES ]}]
    },
    [BiomePoolTier.SUPER_RARE]: {
      [TimeOfDay.DAWN]: [ SpeciesId.HISUI_SNEASEL ],
      [TimeOfDay.DAY]: [ SpeciesId.HISUI_SNEASEL ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.HISUI_ZORUA ], 30: [ SpeciesId.HISUI_ZOROARK ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.HISUI_ZORUA ], 30: [ SpeciesId.HISUI_ZOROARK ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.GALAR_MR_MIME ], 42: [ SpeciesId.MR_RIME ]}, SpeciesId.ARCTOZOLT, SpeciesId.HISUI_AVALUGG ]
    },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CHIEN_PAO ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [ SpeciesId.WYRDEER ], [TimeOfDay.DAY]: [ SpeciesId.WYRDEER ], [TimeOfDay.DUSK]: [ SpeciesId.FROSMOTH ], [TimeOfDay.NIGHT]: [ SpeciesId.FROSMOTH ], [TimeOfDay.ALL]: [ SpeciesId.ABOMASNOW, SpeciesId.URSALUNA ]},
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [ SpeciesId.SNEASLER, SpeciesId.GALAR_DARMANITAN ],
      [TimeOfDay.DAY]: [ SpeciesId.SNEASLER, SpeciesId.GALAR_DARMANITAN ],
      [TimeOfDay.DUSK]: [ SpeciesId.HISUI_ZOROARK ],
      [TimeOfDay.NIGHT]: [ SpeciesId.HISUI_ZOROARK ],
      [TimeOfDay.ALL]: [ SpeciesId.MR_RIME, SpeciesId.ARCTOZOLT, SpeciesId.ALOLA_SANDSLASH, SpeciesId.ALOLA_NINETALES ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.CHIEN_PAO ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ZACIAN ]}
  },
  [BiomeId.SNOWY_FIELD]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [ SpeciesId.SNEASEL, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]}, { 1: [ SpeciesId.SNOM ], 20: [ SpeciesId.FROSMOTH ]}, { 1: [ SpeciesId.HOOTHOOT ], 20: [ SpeciesId.NOCTOWL ]}, { 1: [ SpeciesId.MURKROW ], 30: [ SpeciesId.HONCHKROW ]}],
      [TimeOfDay.NIGHT]: [ SpeciesId.SNEASEL, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]}, { 1: [ SpeciesId.SNOM ], 20: [ SpeciesId.FROSMOTH ]}, { 1: [ SpeciesId.HOOTHOOT ], 20: [ SpeciesId.NOCTOWL ]}, { 1: [ SpeciesId.MURKROW ], 30: [ SpeciesId.HONCHKROW ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SWINUB ], 33: [ SpeciesId.PILOSWINE ]}, { 1: [ SpeciesId.SNOVER ], 40: [ SpeciesId.ABOMASNOW ]}, SpeciesId.EISCUE, { 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]}, { 1: [ SpeciesId.SPEAROW ], 20: [ SpeciesId.FEAROW ]}, { 1: [ SpeciesId.DODUO ], 31: [ SpeciesId.DODRIO ]}, SpeciesId.FARFETCHD, { 1: [ SpeciesId.SNORUNT ], 42: [ SpeciesId.GLALIE ]}, { 1: [ SpeciesId.SNORUNT ], 42: [ SpeciesId.FROSLASS ]}, { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUILL ], 32: [ SpeciesId.UNFEAZANT ]}, { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [ SpeciesId.SNEASEL, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]}, SpeciesId.STANTLER ],
      [TimeOfDay.DAY]: [ SpeciesId.SNEASEL, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]}, SpeciesId.STANTLER ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]}, { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNIGHT ]}]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.GALAR_DARUMAKA ], 30: [ SpeciesId.GALAR_DARMANITAN ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.GALAR_DARUMAKA ], 30: [ SpeciesId.GALAR_DARMANITAN ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.DELIBIRD, { 1: [ SpeciesId.ALOLA_SANDSHREW ], 30: [ SpeciesId.ALOLA_SANDSLASH ]}, { 1: [ SpeciesId.ALOLA_VULPIX ], 30: [ SpeciesId.ALOLA_NINETALES ]}]
    },
    [BiomePoolTier.SUPER_RARE]: {
      [TimeOfDay.DAWN]: [ SpeciesId.HISUI_SNEASEL ],
      [TimeOfDay.DAY]: [ SpeciesId.HISUI_SNEASEL ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.HISUI_ZORUA ], 30: [ SpeciesId.HISUI_ZOROARK ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.HISUI_ZORUA ], 30: [ SpeciesId.HISUI_ZOROARK ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.GALAR_MR_MIME ], 42: [ SpeciesId.MR_RIME ]}, SpeciesId.ARCTOZOLT, SpeciesId.HISUI_AVALUGG ]
    },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GLASTRIER ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [ SpeciesId.WYRDEER ], [TimeOfDay.DAY]: [ SpeciesId.WYRDEER ], [TimeOfDay.DUSK]: [ SpeciesId.FROSMOTH, SpeciesId.NOCTOWL, SpeciesId.HONCHKROW ], [TimeOfDay.NIGHT]: [ SpeciesId.FROSMOTH, SpeciesId.NOCTOWL, SpeciesId.HONCHKROW ], [TimeOfDay.ALL]: [ SpeciesId.ABOMASNOW, SpeciesId.URSALUNA, SpeciesId.PIDGEOT, SpeciesId.FEAROW, SpeciesId.DODRIO, SpeciesId.FARFETCHD, SpeciesId.GLALIE, SpeciesId.FROSLASS, SpeciesId.UNFEAZANT, SpeciesId.TALONFLAME, SpeciesId.CORVIKNIGHT ]},
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [ SpeciesId.SNEASLER, SpeciesId.GALAR_DARMANITAN ],
      [TimeOfDay.DAY]: [ SpeciesId.SNEASLER, SpeciesId.GALAR_DARMANITAN ],
      [TimeOfDay.DUSK]: [ SpeciesId.HISUI_ZOROARK ],
      [TimeOfDay.NIGHT]: [ SpeciesId.HISUI_ZOROARK ],
      [TimeOfDay.ALL]: [ SpeciesId.MR_RIME, SpeciesId.ARCTOZOLT, SpeciesId.ALOLA_SANDSLASH, SpeciesId.ALOLA_NINETALES ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.GLASTRIER ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.SNOW_MOUNTAIN]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [ SpeciesId.SNEASEL, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]}, { 1: [ SpeciesId.SNOM ], 20: [ SpeciesId.FROSMOTH ]}, { 1: [ SpeciesId.HOOTHOOT ], 20: [ SpeciesId.NOCTOWL ]}, { 1: [ SpeciesId.MURKROW ], 30: [ SpeciesId.HONCHKROW ]}],
      [TimeOfDay.NIGHT]: [ SpeciesId.SNEASEL, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]}, { 1: [ SpeciesId.SNOM ], 20: [ SpeciesId.FROSMOTH ]}, { 1: [ SpeciesId.HOOTHOOT ], 20: [ SpeciesId.NOCTOWL ]}, { 1: [ SpeciesId.MURKROW ], 30: [ SpeciesId.HONCHKROW ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SWINUB ], 33: [ SpeciesId.PILOSWINE ]}, { 1: [ SpeciesId.SNOVER ], 40: [ SpeciesId.ABOMASNOW ]}, SpeciesId.EISCUE, { 1: [ SpeciesId.PIDGEY ], 18: [ SpeciesId.PIDGEOTTO ], 36: [ SpeciesId.PIDGEOT ]}, { 1: [ SpeciesId.SPEAROW ], 20: [ SpeciesId.FEAROW ]}, { 1: [ SpeciesId.DODUO ], 31: [ SpeciesId.DODRIO ]}, SpeciesId.FARFETCHD, { 1: [ SpeciesId.SNORUNT ], 42: [ SpeciesId.GLALIE ]}, { 1: [ SpeciesId.SNORUNT ], 42: [ SpeciesId.FROSLASS ]}, { 1: [ SpeciesId.PIDOVE ], 21: [ SpeciesId.TRANQUILL ], 32: [ SpeciesId.UNFEAZANT ]}, { 1: [ SpeciesId.STARLY ], 14: [ SpeciesId.STARAVIA ], 34: [ SpeciesId.STARAPTOR ]}, { 1: [ SpeciesId.GEODUDE ], 25: [ SpeciesId.GRAVELER ], 35: [ SpeciesId.GOLEM ]}, { 1: [ SpeciesId.ROGGENROLA ], 25: [ SpeciesId.BOLDORE ], 35: [ SpeciesId.GIGALITH ]}]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [ SpeciesId.SNEASEL, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]}, SpeciesId.STANTLER ],
      [TimeOfDay.DAY]: [ SpeciesId.SNEASEL, { 1: [ SpeciesId.TEDDIURSA ], 30: [ SpeciesId.URSARING ]}, SpeciesId.STANTLER ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.FLETCHLING ], 17: [ SpeciesId.FLETCHINDER ], 35: [ SpeciesId.TALONFLAME ]}, { 1: [ SpeciesId.ROOKIDEE ], 18: [ SpeciesId.CORVISQUIRE ], 38: [ SpeciesId.CORVIKNIGHT ]}, { 1: [ SpeciesId.RHYHORN ], 42: [ SpeciesId.RHYDON ], 45: [ SpeciesId.RHYPERIOR ]}, { 1: [ SpeciesId.NACLI ], 24: [ SpeciesId.NACLSTACK ], 38: [ SpeciesId.GARGANACL ]}, { 1: [ SpeciesId.NOSEPASS ], 30: [ SpeciesId.PROBOPASS ]}, SpeciesId.SKARMORY, SpeciesId.CRYOGONAL, { 1: [ SpeciesId.CUBCHOO ], 37: [ SpeciesId.BEARTIC ]}, { 1: [ SpeciesId.ARON ], 32: [ SpeciesId.LAIRON ], 42: [ SpeciesId.AGGRON ]}]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [{ 1: [ SpeciesId.GALAR_DARUMAKA ], 30: [ SpeciesId.GALAR_DARMANITAN ]}],
      [TimeOfDay.DAY]: [{ 1: [ SpeciesId.GALAR_DARUMAKA ], 30: [ SpeciesId.GALAR_DARMANITAN ]}],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ SpeciesId.DELIBIRD, { 1: [ SpeciesId.ALOLA_SANDSHREW ], 30: [ SpeciesId.ALOLA_SANDSLASH ]}, { 1: [ SpeciesId.ALOLA_VULPIX ], 30: [ SpeciesId.ALOLA_NINETALES ]}, { 1: [ SpeciesId.AMAURA ], 39: [ SpeciesId.AURORUS ]}]
    },
    [BiomePoolTier.SUPER_RARE]: {
      [TimeOfDay.DAWN]: [ SpeciesId.HISUI_SNEASEL ],
      [TimeOfDay.DAY]: [ SpeciesId.HISUI_SNEASEL ],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.HISUI_ZORUA ], 30: [ SpeciesId.HISUI_ZOROARK ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.HISUI_ZORUA ], 30: [ SpeciesId.HISUI_ZOROARK ]}],
      [TimeOfDay.ALL]: [{ 1: [ SpeciesId.GALAR_MR_MIME ], 42: [ SpeciesId.MR_RIME ]}, SpeciesId.ARCTOZOLT, SpeciesId.HISUI_AVALUGG ]
    },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ARTICUNO ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [ SpeciesId.WYRDEER ], [TimeOfDay.DAY]: [ SpeciesId.WYRDEER ], [TimeOfDay.DUSK]: [ SpeciesId.FROSMOTH, SpeciesId.NOCTOWL, SpeciesId.HONCHKROW ], [TimeOfDay.NIGHT]: [ SpeciesId.FROSMOTH, SpeciesId.NOCTOWL, SpeciesId.HONCHKROW ], [TimeOfDay.ALL]: [ SpeciesId.ABOMASNOW, SpeciesId.URSALUNA, SpeciesId.PIDGEOT, SpeciesId.FEAROW, SpeciesId.DODRIO, SpeciesId.FARFETCHD, SpeciesId.GLALIE, SpeciesId.FROSLASS, SpeciesId.UNFEAZANT, SpeciesId.TALONFLAME, SpeciesId.CORVIKNIGHT, SpeciesId.GOLEM, SpeciesId.GIGALITH, SpeciesId.RHYPERIOR, SpeciesId.SKARMORY, SpeciesId.PROBOPASS ]},
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [ SpeciesId.SNEASLER, SpeciesId.GALAR_DARMANITAN ],
      [TimeOfDay.DAY]: [ SpeciesId.SNEASLER, SpeciesId.GALAR_DARMANITAN ],
      [TimeOfDay.DUSK]: [ SpeciesId.HISUI_ZOROARK ],
      [TimeOfDay.NIGHT]: [ SpeciesId.HISUI_ZOROARK ],
      [TimeOfDay.ALL]: [ SpeciesId.MR_RIME, SpeciesId.ARCTOZOLT, SpeciesId.ALOLA_SANDSLASH, SpeciesId.ALOLA_NINETALES, SpeciesId.AURORUS ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ARTICUNO ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.ISLAND]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [{ 1: [ SpeciesId.ALOLA_RATTATA ], 30: [ SpeciesId.ALOLA_RATICATE ]}, { 1: [ SpeciesId.ALOLA_MEOWTH ], 30: [ SpeciesId.ALOLA_PERSIAN ]}],
      [TimeOfDay.NIGHT]: [{ 1: [ SpeciesId.ALOLA_RATTATA ], 30: [ SpeciesId.ALOLA_RATICATE ]}, { 1: [ SpeciesId.ALOLA_MEOWTH ], 30: [ SpeciesId.ALOLA_PERSIAN ]}],
      [TimeOfDay.ALL]: [
        SpeciesId.ORICORIO,
        { 1: [ SpeciesId.ALOLA_SANDSHREW ], 30: [ SpeciesId.ALOLA_SANDSLASH ]},
        { 1: [ SpeciesId.ALOLA_VULPIX ], 30: [ SpeciesId.ALOLA_NINETALES ]},
        { 1: [ SpeciesId.ALOLA_DIGLETT ], 26: [ SpeciesId.ALOLA_DUGTRIO ]},
        { 1: [ SpeciesId.ALOLA_GEODUDE ], 25: [ SpeciesId.ALOLA_GRAVELER ], 40: [ SpeciesId.ALOLA_GOLEM ]},
        { 1: [ SpeciesId.ALOLA_GRIMER ], 38: [ SpeciesId.ALOLA_MUK ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [ SpeciesId.ALOLA_RAICHU, SpeciesId.ALOLA_EXEGGUTOR ],
      [TimeOfDay.DAY]: [ SpeciesId.ALOLA_RAICHU, SpeciesId.ALOLA_EXEGGUTOR ],
      [TimeOfDay.DUSK]: [ SpeciesId.ALOLA_MAROWAK ],
      [TimeOfDay.NIGHT]: [ SpeciesId.ALOLA_MAROWAK ],
      [TimeOfDay.ALL]: [ SpeciesId.BRUXISH ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VICTINI ]},
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ SpeciesId.ALOLA_RAICHU, SpeciesId.ALOLA_EXEGGUTOR ],
      [TimeOfDay.DAY]: [ SpeciesId.ALOLA_RAICHU, SpeciesId.ALOLA_EXEGGUTOR ],
      [TimeOfDay.DUSK]: [ SpeciesId.ALOLA_RATICATE, SpeciesId.ALOLA_PERSIAN, SpeciesId.ALOLA_MAROWAK ],
      [TimeOfDay.NIGHT]: [ SpeciesId.ALOLA_RATICATE, SpeciesId.ALOLA_PERSIAN, SpeciesId.ALOLA_MAROWAK ],
      [TimeOfDay.ALL]: [ SpeciesId.ORICORIO, SpeciesId.BRUXISH, SpeciesId.ALOLA_SANDSLASH, SpeciesId.ALOLA_NINETALES, SpeciesId.ALOLA_DUGTRIO, SpeciesId.ALOLA_GOLEM, SpeciesId.ALOLA_MUK ]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.VICTINI ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  },
  [BiomeId.LABORATORY]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ SpeciesId.MAGNEMITE ], 30: [ SpeciesId.MAGNETON ]},
        { 1: [ SpeciesId.GRIMER ], 38: [ SpeciesId.MUK ]},
        { 1: [ SpeciesId.VOLTORB ], 30: [ SpeciesId.ELECTRODE ]},
        { 1: [ SpeciesId.BRONZOR ], 33: [ SpeciesId.BRONZONG ]},
        { 1: [ SpeciesId.KLINK ], 38: [ SpeciesId.KLANG ], 49: [ SpeciesId.KLINKLANG ]}
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [{ 1: [ SpeciesId.SOLOSIS ], 32: [ SpeciesId.DUOSION ], 41: [ SpeciesId.REUNICLUS ]}]},
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.DITTO, { 1: [ SpeciesId.PORYGON ], 30: [ SpeciesId.PORYGON2 ]}]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ROTOM ]},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.TYPE_NULL ]},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MUK, SpeciesId.ELECTRODE, SpeciesId.BRONZONG, SpeciesId.MAGNEZONE, SpeciesId.PORYGON_Z, SpeciesId.REUNICLUS, SpeciesId.KLINKLANG ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ROTOM, SpeciesId.SILVALLY ]},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.MEWTWO, SpeciesId.MIRAIDON ]}
  },
  [BiomeId.END]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        SpeciesId.GREAT_TUSK,
        SpeciesId.SCREAM_TAIL,
        SpeciesId.BRUTE_BONNET,
        SpeciesId.FLUTTER_MANE,
        SpeciesId.SLITHER_WING,
        SpeciesId.SANDY_SHOCKS,
        SpeciesId.IRON_TREADS,
        SpeciesId.IRON_BUNDLE,
        SpeciesId.IRON_HANDS,
        SpeciesId.IRON_JUGULIS,
        SpeciesId.IRON_MOTH,
        SpeciesId.IRON_THORNS
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ROARING_MOON, SpeciesId.IRON_VALIANT ]},
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.WALKING_WAKE, SpeciesId.IRON_LEAVES, SpeciesId.GOUGING_FIRE, SpeciesId.RAGING_BOLT, SpeciesId.IRON_BOULDER, SpeciesId.IRON_CROWN ]},
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ SpeciesId.ETERNATUS ]},
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []},
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: []}
  }
};

export const biomeTrainerPools: BiomeTrainerPools = {
  [BiomeId.TOWN]: {
    [BiomePoolTier.COMMON]: [ TrainerType.YOUNGSTER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.PLAINS]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BREEDER, TrainerType.TWINS ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.CYCLIST ],
    [BiomePoolTier.RARE]: [ TrainerType.BLACK_BELT ],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.CILAN, TrainerType.CHILI, TrainerType.CRESS, TrainerType.CHEREN ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.GRASS]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BREEDER, TrainerType.SCHOOL_KID ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.POKEFAN ],
    [BiomePoolTier.RARE]: [ TrainerType.BLACK_BELT ],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.ERIKA ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.TALL_GRASS]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.BREEDER, TrainerType.RANGER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.GARDENIA, TrainerType.VIOLA, TrainerType.BRASSIUS ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.METROPOLIS]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BEAUTY, TrainerType.CLERK, TrainerType.CYCLIST, TrainerType.OFFICER, TrainerType.WAITER ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.BREEDER, TrainerType.DEPOT_AGENT, TrainerType.GUITARIST ],
    [BiomePoolTier.RARE]: [ TrainerType.ARTIST, TrainerType.RICH_KID ],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.WHITNEY, TrainerType.NORMAN, TrainerType.IONO, TrainerType.LARRY ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.FOREST]: {
    [BiomePoolTier.COMMON]: [ TrainerType.RANGER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.BUGSY, TrainerType.BURGH, TrainerType.KATY ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.SEA]: {
    [BiomePoolTier.COMMON]: [ TrainerType.SAILOR, TrainerType.SWIMMER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.MARLON ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.SWAMP]: {
    [BiomePoolTier.COMMON]: [ TrainerType.PARASOL_LADY ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER ],
    [BiomePoolTier.RARE]: [ TrainerType.BLACK_BELT ],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.JANINE, TrainerType.ROXIE ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.BEACH]: {
    [BiomePoolTier.COMMON]: [ TrainerType.FISHERMAN, TrainerType.SAILOR ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.BREEDER ],
    [BiomePoolTier.RARE]: [ TrainerType.BLACK_BELT ],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.MISTY, TrainerType.KOFU ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.LAKE]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BREEDER, TrainerType.FISHERMAN, TrainerType.PARASOL_LADY ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER ],
    [BiomePoolTier.RARE]: [ TrainerType.BLACK_BELT ],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.CRASHER_WAKE ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.SEABED]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.JUAN ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.MOUNTAIN]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BACKPACKER, TrainerType.BLACK_BELT, TrainerType.HIKER ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.PILOT ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.FALKNER, TrainerType.WINONA, TrainerType.SKYLA ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.BADLANDS]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BACKPACKER, TrainerType.HIKER ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.CLAY, TrainerType.GRANT ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.CAVE]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BACKPACKER, TrainerType.HIKER ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.BLACK_BELT ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.BROCK, TrainerType.ROXANNE, TrainerType.ROARK ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.DESERT]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BACKPACKER, TrainerType.SCIENTIST ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.GORDIE ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.ICE_CAVE]: {
    [BiomePoolTier.COMMON]: [ TrainerType.SNOW_WORKER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.PRYCE, TrainerType.BRYCEN, TrainerType.WULFRIC, TrainerType.GRUSHA ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.MEADOW]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BEAUTY, TrainerType.MUSICIAN, TrainerType.PARASOL_LADY ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.BAKER, TrainerType.BREEDER, TrainerType.POKEFAN ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.LENORA, TrainerType.MILO ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.POWER_PLANT]: {
    [BiomePoolTier.COMMON]: [ TrainerType.GUITARIST, TrainerType.WORKER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.VOLKNER, TrainerType.ELESA, TrainerType.CLEMONT ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.VOLCANO]: {
    [BiomePoolTier.COMMON]: [ TrainerType.FIREBREATHER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.BLAINE, TrainerType.FLANNERY, TrainerType.KABU ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.GRAVEYARD]: {
    [BiomePoolTier.COMMON]: [ TrainerType.PSYCHIC ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.HEX_MANIAC ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.MORTY, TrainerType.ALLISTER, TrainerType.RYME ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.DOJO]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BLACK_BELT ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.BRAWLY, TrainerType.MAYLENE, TrainerType.KORRINA, TrainerType.BEA ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.FACTORY]: {
    [BiomePoolTier.COMMON]: [ TrainerType.WORKER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.JASMINE, TrainerType.BYRON ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.RUINS]: {
    [BiomePoolTier.COMMON]: [ TrainerType.PSYCHIC, TrainerType.SCIENTIST ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.BLACK_BELT, TrainerType.HEX_MANIAC ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.SABRINA, TrainerType.TATE, TrainerType.LIZA, TrainerType.TULIP ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.WASTELAND]: {
    [BiomePoolTier.COMMON]: [ TrainerType.VETERAN ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.CLAIR, TrainerType.DRAYDEN, TrainerType.RAIHAN ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.ABYSS]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.MARNIE ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.SPACE]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.OLYMPIA ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.CONSTRUCTION_SITE]: {
    [BiomePoolTier.COMMON]: [ TrainerType.OFFICER, TrainerType.WORKER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.LT_SURGE, TrainerType.CHUCK, TrainerType.WATTSON ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.JUNGLE]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BACKPACKER, TrainerType.RANGER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.RAMOS ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.FAIRY_CAVE]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BEAUTY ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.BREEDER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.VALERIE, TrainerType.OPAL, TrainerType.BEDE ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.TEMPLE]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.FANTINA ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.SLUM]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BIKER, TrainerType.OFFICER, TrainerType.ROUGHNECK ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.BAKER, TrainerType.HOOLIGANS ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.PIERS ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.SNOWY_FOREST]: {
    [BiomePoolTier.COMMON]: [ TrainerType.SNOW_WORKER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.CANDICE, TrainerType.MELONY ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.ISLAND]: {
    [BiomePoolTier.COMMON]: [ TrainerType.RICH_KID ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.RICH ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.NESSA ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.LABORATORY]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.GIOVANNI ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [BiomeId.END]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  }
};

// BiomeId-ignore lint/complexity/noExcessiveCognitiveComplexity: init methods are expected to have many lines.
export function initBiomes() {

  const pokemonBiomes = [
    [ SpeciesId.BULBASAUR, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.GRASS, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.IVYSAUR, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.GRASS, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.VENUSAUR, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.GRASS, BiomePoolTier.RARE ],
      [ BiomeId.GRASS, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.CHARMANDER, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.CHARMELEON, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.CHARIZARD, PokemonType.FIRE, PokemonType.FLYING, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SQUIRTLE, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.WARTORTLE, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.BLASTOISE, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.RARE ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.CATERPIE, PokemonType.BUG, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.METAPOD, PokemonType.BUG, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.BUTTERFREE, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.WEEDLE, PokemonType.BUG, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ], 
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.KAKUNA, PokemonType.BUG, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.BEEDRILL, PokemonType.BUG, PokemonType.POISON, [
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PIDGEY, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.PIDGEOTTO, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.PIDGEOT, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ], 
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.RATTATA, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON ],
      [ BiomeId.SLUM, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.RATICATE, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON ],
      [ BiomeId.SLUM, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SPEAROW, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ], 
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.FEAROW, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.EKANS, PokemonType.POISON, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SWAMP, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ARBOK, PokemonType.POISON, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SWAMP, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PIKACHU, PokemonType.ELECTRIC, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.RAICHU, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SANDSHREW, PokemonType.GROUND, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERT, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SANDSLASH, PokemonType.GROUND, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERT, BiomePoolTier.COMMON ],
      [ BiomeId.DESERT, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.NIDORAN_F, PokemonType.POISON, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.DAY ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON, TimeOfDay.DAY ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.NIDORINA, PokemonType.POISON, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.DAY ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON, TimeOfDay.DAY ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ], 
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.NIDOQUEEN, PokemonType.POISON, PokemonType.GROUND, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.DAY ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS, TimeOfDay.DAY ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.NIDORAN_M, PokemonType.POISON, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.DAY ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON, TimeOfDay.DAY ], 
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.NIDORINO, PokemonType.POISON, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.DAY ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON, TimeOfDay.DAY ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.NIDOKING, PokemonType.POISON, PokemonType.GROUND, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.DAY ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS, TimeOfDay.DAY ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CLEFAIRY, PokemonType.FAIRY, -1, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPACE, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.CLEFABLE, PokemonType.FAIRY, -1, [
      [ BiomeId.SPACE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.VULPIX, PokemonType.FIRE, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.NINETALES, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.JIGGLYPUFF, PokemonType.NORMAL, PokemonType.FAIRY, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.WIGGLYTUFF, PokemonType.NORMAL, PokemonType.FAIRY, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ZUBAT, PokemonType.POISON, PokemonType.FLYING, [
      [ BiomeId.PLAINS, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GOLBAT, PokemonType.POISON, PokemonType.FLYING, [
      [ BiomeId.PLAINS, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ODDISH, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GLOOM, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.VILEPLUME, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PARAS, PokemonType.BUG, PokemonType.GRASS, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.PARASECT, PokemonType.BUG, PokemonType.GRASS, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.VENONAT, PokemonType.BUG, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.VENOMOTH, PokemonType.BUG, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, TimeOfDay.NIGHT ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ], 
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DIGLETT, PokemonType.GROUND, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DUGTRIO, PokemonType.GROUND, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON ],
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MEOWTH, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.PERSIAN, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.PSYDUCK, PokemonType.WATER, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GOLDUCK, PokemonType.WATER, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MANKEY, PokemonType.FIGHTING, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.DOJO, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.PRIMEAPE, PokemonType.FIGHTING, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.DOJO, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GROWLITHE, PokemonType.FIRE, -1, [
      [ BiomeId.GRASS, BiomePoolTier.RARE ],
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ARCANINE, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.POLIWAG, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.POLIWHIRL, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.POLIWRATH, PokemonType.WATER, PokemonType.FIGHTING, [
      [ BiomeId.SWAMP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ABRA, PokemonType.PSYCHIC, -1, [
      [ BiomeId.TOWN, BiomePoolTier.RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.RARE ],
      [ BiomeId.RUINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.KADABRA, PokemonType.PSYCHIC, -1, [
      [ BiomeId.TOWN, BiomePoolTier.RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.RARE ],
      [ BiomeId.RUINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ALAKAZAM, PokemonType.PSYCHIC, -1, [
      [ BiomeId.TOWN, BiomePoolTier.RARE ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MACHOP, PokemonType.FIGHTING, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FACTORY, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MACHOKE, PokemonType.FIGHTING, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FACTORY, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MACHAMP, PokemonType.FIGHTING, -1, [
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BELLSPROUT, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.WEEPINBELL, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.VICTREEBEL, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TENTACOOL, PokemonType.WATER, PokemonType.POISON, [
      [ BiomeId.SEA, BiomePoolTier.COMMON ],
      [ BiomeId.SEABED, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.TENTACRUEL, PokemonType.WATER, PokemonType.POISON, [
      [ BiomeId.SEA, BiomePoolTier.COMMON ],
      [ BiomeId.SEA, BiomePoolTier.BOSS ],
      [ BiomeId.SEABED, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.GEODUDE, PokemonType.ROCK, PokemonType.GROUND, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GRAVELER, PokemonType.ROCK, PokemonType.GROUND, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GOLEM, PokemonType.ROCK, PokemonType.GROUND, [
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PONYTA, PokemonType.FIRE, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.RAPIDASH, PokemonType.FIRE, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SLOWPOKE, PokemonType.WATER, PokemonType.PSYCHIC, [
      [ BiomeId.SEA, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SLOWBRO, PokemonType.WATER, PokemonType.PSYCHIC, [
      [ BiomeId.SEA, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MAGNEMITE, PokemonType.ELECTRIC, PokemonType.STEEL, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.FACTORY, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.COMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MAGNETON, PokemonType.ELECTRIC, PokemonType.STEEL, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.FACTORY, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.COMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.FARFETCHD, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.PLAINS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DODUO, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DODRIO, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ], 
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SEEL, PokemonType.WATER, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.DEWGONG, PokemonType.WATER, PokemonType.ICE, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ] ,
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.GRIMER, PokemonType.POISON, -1, [
      [ BiomeId.SLUM, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MUK, PokemonType.POISON, -1, [
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SLUM, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.SLUM, BiomePoolTier.BOSS ],
      [ BiomeId.LABORATORY, BiomePoolTier.COMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.BOSS ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SHELLDER, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.BEACH, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEABED, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.CLOYSTER, PokemonType.WATER, PokemonType.ICE, [
      [ BiomeId.BEACH, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.GASTLY, PokemonType.GHOST, PokemonType.POISON, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.HAUNTER, PokemonType.GHOST, PokemonType.POISON, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GENGAR, PokemonType.GHOST, PokemonType.POISON, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ],
      [ BiomeId.SEWER, BiomePoolTier.RARE ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ONIX, PokemonType.ROCK, PokemonType.GROUND, [
      [ BiomeId.BADLANDS, BiomePoolTier.RARE ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.RARE ],
      [ BiomeId.CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.DROWZEE, PokemonType.PSYCHIC, -1, [
      [ BiomeId.RUINS, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.HYPNO, PokemonType.PSYCHIC, -1, [
      [ BiomeId.RUINS, BiomePoolTier.COMMON ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.KRABBY, PokemonType.WATER, -1, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.KINGLER, PokemonType.WATER, -1, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BEACH, BiomePoolTier.BOSS ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.VOLTORB, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.FACTORY, BiomePoolTier.COMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ELECTRODE, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.FACTORY, BiomePoolTier.COMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.COMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.BOSS ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.EXEGGCUTE, PokemonType.GRASS, PokemonType.PSYCHIC, [
      [ BiomeId.FOREST, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.EXEGGUTOR, PokemonType.GRASS, PokemonType.PSYCHIC, [
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.CUBONE, PokemonType.GROUND, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.GRAVEYARD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ], 
      [ BiomeId.SPARK_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON, TimeOfDay.NIGHT ]
    ]
    ],
    [ SpeciesId.MAROWAK, PokemonType.GROUND, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.GRAVEYARD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS, TimeOfDay.NIGHT ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY, TimeOfDay.DUSK ]],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS, TimeOfDay.NIGHT ]
    ]
    ],
    [ SpeciesId.HITMONLEE, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.HITMONCHAN, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.LICKITUNG, PokemonType.NORMAL, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.KOFFING, PokemonType.POISON, -1, [
      [ BiomeId.SLUM, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.WEEZING, PokemonType.POISON, -1, [
      [ BiomeId.SLUM, BiomePoolTier.COMMON ],
      [ BiomeId.SLUM, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.RHYHORN, PokemonType.GROUND, PokemonType.ROCK, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.RHYDON, PokemonType.GROUND, PokemonType.ROCK, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.CHANSEY, PokemonType.NORMAL, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MEADOW, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.TANGELA, PokemonType.GRASS, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.KANGASKHAN, PokemonType.NORMAL, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.HORSEA, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SEADRA, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.GOLDEEN, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SEAKING, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.STARYU, PokemonType.WATER, -1, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.STARMIE, PokemonType.WATER, PokemonType.PSYCHIC, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.BEACH, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MR_MIME, PokemonType.PSYCHIC, PokemonType.FAIRY, [
      [ BiomeId.RUINS, BiomePoolTier.RARE ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SCYTHER, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.FOREST, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.JYNX, PokemonType.ICE, PokemonType.PSYCHIC, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ], 
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ELECTABUZZ, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.MAGMAR, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PINSIR, PokemonType.BUG, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.RARE ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.TAUROS, PokemonType.NORMAL, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.RARE ],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MAGIKARP, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.COMMON ],
      [ BiomeId.LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GYARADOS, PokemonType.WATER, PokemonType.FLYING, [
      [ BiomeId.SEA, BiomePoolTier.COMMON ],
      [ BiomeId.LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS ], 
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ], 
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.LAPRAS, PokemonType.WATER, PokemonType.ICE, [
      [ BiomeId.SEA, BiomePoolTier.RARE ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.DITTO, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.METROPOLIS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SEWER, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LABORATORY, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.EEVEE, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.METROPOLIS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MEADOW, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.VAPOREON, PokemonType.WATER, -1, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LAKE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.JOLTEON, PokemonType.ELECTRIC, -1, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.FLAREON, PokemonType.FIRE, -1, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.VOLCANO, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.PORYGON, PokemonType.NORMAL, -1, [
      [ BiomeId.FACTORY, BiomePoolTier.RARE ],
      [ BiomeId.SPACE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LABORATORY, BiomePoolTier.RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.OMANYTE, PokemonType.ROCK, PokemonType.WATER, [
      [ BiomeId.SEABED, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.OMASTAR, PokemonType.ROCK, PokemonType.WATER, [
      [ BiomeId.SEABED, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.KABUTO, PokemonType.ROCK, PokemonType.WATER, [
      [ BiomeId.SEABED, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.KABUTOPS, PokemonType.ROCK, PokemonType.WATER, [
      [ BiomeId.SEABED, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.AERODACTYL, PokemonType.ROCK, PokemonType.FLYING, [
      [ BiomeId.WASTELAND, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SNORLAX, PokemonType.NORMAL, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ARTICUNO, PokemonType.ICE, PokemonType.FLYING, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.ZAPDOS, PokemonType.ELECTRIC, PokemonType.FLYING, [
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS_SUPER_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.MOLTRES, PokemonType.FIRE, PokemonType.FLYING, [
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.DRATINI, PokemonType.DRAGON, -1, [
      [ BiomeId.WASTELAND, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.DRAGONAIR, PokemonType.DRAGON, -1, [
      [ BiomeId.WASTELAND, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.DRAGONITE, PokemonType.DRAGON, PokemonType.FLYING, [
      [ BiomeId.WASTELAND, BiomePoolTier.RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ], 
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ], 
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.MEWTWO, PokemonType.PSYCHIC, -1, [
      [ BiomeId.LABORATORY, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.MEW, PokemonType.PSYCHIC, -1, [ 
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.CHIKORITA, PokemonType.GRASS, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.BAYLEEF, PokemonType.GRASS, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.MEGANIUM, PokemonType.GRASS, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.RARE ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.CYNDAQUIL, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.QUILAVA, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.TYPHLOSION, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.TOTODILE, PokemonType.WATER, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.CROCONAW, PokemonType.WATER, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.FERALIGATR, PokemonType.WATER, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.RARE ],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SENTRET, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.FURRET, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.HOOTHOOT, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.SKY, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.NOCTOWL, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, TimeOfDay.NIGHT ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS, TimeOfDay.NIGHT ],
      [ BiomeId.SKY, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.SKY, BiomePoolTier.BOSS, TimeOfDay.NIGHT ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.LEDYBA, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, TimeOfDay.DAWN ],
      [ BiomeId.MEADOW, BiomePoolTier.COMMON, TimeOfDay.DAWN ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.LEDIAN, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, TimeOfDay.DAWN ],
      [ BiomeId.MEADOW, BiomePoolTier.COMMON, TimeOfDay.DAWN ],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS, TimeOfDay.DAWN ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SPINARAK, PokemonType.BUG, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.DUSK ],
      [ BiomeId.TOWN, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, TimeOfDay.DUSK ],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON, TimeOfDay.DUSK ],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.ARIADOS, PokemonType.BUG, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.DUSK ],
      [ BiomeId.TOWN, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, TimeOfDay.DUSK ],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON, TimeOfDay.DUSK ],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ], 
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CROBAT, PokemonType.POISON, PokemonType.FLYING, [
      [ BiomeId.CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.SKY, BiomePoolTier.BOSS, TimeOfDay.NIGHT ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CHINCHOU, PokemonType.WATER, PokemonType.ELECTRIC, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.SEABED, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.LANTURN, PokemonType.WATER, PokemonType.ELECTRIC, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.SEABED, BiomePoolTier.COMMON ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PICHU, PokemonType.ELECTRIC, -1, [ 
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.CLEFFA, PokemonType.FAIRY, -1, [ 
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.IGGLYBUFF, PokemonType.NORMAL, PokemonType.FAIRY, [ 
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.TOGEPI, PokemonType.FAIRY, -1, [ 
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.TOGETIC, PokemonType.FAIRY, PokemonType.FLYING, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.NATU, PokemonType.PSYCHIC, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RUINS, BiomePoolTier.COMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.XATU, PokemonType.PSYCHIC, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RUINS, BiomePoolTier.COMMON ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS ],
      [ BiomeId.TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MAREEP, PokemonType.ELECTRIC, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.RARE ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.FLAAFFY, PokemonType.ELECTRIC, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.RARE ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.AMPHAROS, PokemonType.ELECTRIC, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BELLOSSOM, PokemonType.GRASS, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.MARILL, PokemonType.WATER, PokemonType.FAIRY, [
      [ BiomeId.LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.RIVER, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.AZUMARILL, PokemonType.WATER, PokemonType.FAIRY, [
      [ BiomeId.LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.RIVER, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LAKE, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.RIVER, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SUDOWOODO, PokemonType.ROCK, -1, [
      [ BiomeId.GRASS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GRASS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.POLITOED, PokemonType.WATER, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.HOPPIP, PokemonType.GRASS, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SKIPLOOM, PokemonType.GRASS, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.JUMPLUFF, PokemonType.GRASS, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GRASS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.AIPOM, PokemonType.NORMAL, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SUNKERN, PokemonType.GRASS, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.SUNFLORA, PokemonType.GRASS, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GRASS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.YANMA, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.WOOPER, PokemonType.WATER, PokemonType.GROUND, [
      [ BiomeId.LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.QUAGSIRE, PokemonType.WATER, PokemonType.GROUND, [
      [ BiomeId.LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.ESPEON, PokemonType.PSYCHIC, -1, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.RUINS, BiomePoolTier.SUPER_RARE, TimeOfDay.DAY ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS_RARE, TimeOfDay.DAY ]
    ]
    ],
    [ SpeciesId.UMBREON, PokemonType.DARK, -1, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABYSS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.MURKROW, PokemonType.DARK, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.RARE, TimeOfDay.NIGHT ],
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SLOWKING, PokemonType.WATER, PokemonType.PSYCHIC, [
      [ BiomeId.LAKE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.MISDREAVUS, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.RARE ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.UNOWN, PokemonType.PSYCHIC, -1, [
      [ BiomeId.RUINS, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.WOBBUFFET, PokemonType.PSYCHIC, -1, [
      [ BiomeId.RUINS, BiomePoolTier.RARE ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.GIRAFARIG, PokemonType.NORMAL, PokemonType.PSYCHIC, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.PINECO, PokemonType.BUG, -1, [
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.FORRETRESS, PokemonType.BUG, PokemonType.STEEL, [
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DUNSPARCE, PokemonType.NORMAL, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GLIGAR, PokemonType.GROUND, PokemonType.FLYING, [
      [ BiomeId.BADLANDS, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.STEELIX, PokemonType.STEEL, PokemonType.GROUND, [
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SNUBBULL, PokemonType.FAIRY, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GRANBULL, PokemonType.FAIRY, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.QWILFISH, PokemonType.WATER, PokemonType.POISON, [
      [ BiomeId.SEABED, BiomePoolTier.RARE ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SCIZOR, PokemonType.BUG, PokemonType.STEEL, [
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SHUCKLE, PokemonType.BUG, PokemonType.ROCK, [
      [ BiomeId.CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.HERACROSS, PokemonType.BUG, PokemonType.FIGHTING, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SNEASEL, PokemonType.DARK, PokemonType.ICE, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.TEDDIURSA, PokemonType.NORMAL, -1, [
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.URSARING, PokemonType.NORMAL, -1, [
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.SLUGMA, PokemonType.FIRE, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MAGCARGO, PokemonType.FIRE, PokemonType.ROCK, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SWINUB, PokemonType.ICE, PokemonType.GROUND, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.PILOSWINE, PokemonType.ICE, PokemonType.GROUND, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.CORSOLA, PokemonType.WATER, PokemonType.ROCK, [
      [ BiomeId.SEABED, BiomePoolTier.RARE ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.REMORAID, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.OCTILLERY, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.RARE ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DELIBIRD, PokemonType.ICE, PokemonType.FLYING, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MANTINE, PokemonType.WATER, PokemonType.FLYING, [
      [ BiomeId.SEABED, BiomePoolTier.RARE ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SKARMORY, PokemonType.STEEL, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.HOUNDOUR, PokemonType.DARK, PokemonType.FIRE, [
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.HOUNDOOM, PokemonType.DARK, PokemonType.FIRE, [
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.KINGDRA, PokemonType.WATER, PokemonType.DRAGON, [
      [ BiomeId.SEA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SEA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PHANPY, PokemonType.GROUND, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.DONPHAN, PokemonType.GROUND, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CANYON, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.PORYGON2, PokemonType.NORMAL, -1, [
      [ BiomeId.FACTORY, BiomePoolTier.RARE ],
      [ BiomeId.SPACE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LABORATORY, BiomePoolTier.RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.STANTLER, PokemonType.NORMAL, -1, [
      [ BiomeId.FOREST, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FOREST, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.SMEARGLE, PokemonType.NORMAL, -1, [
      [ BiomeId.METROPOLIS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TYROGUE, PokemonType.FIGHTING, -1, [ 
      [ BiomeId.DOJO, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DOJO, BiomePoolTier.RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.RARE ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.HITMONTOP, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SMOOCHUM, PokemonType.ICE, PokemonType.PSYCHIC, [ 
      [ BiomeId.ICE_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ELEKID, PokemonType.ELECTRIC, -1, [ 
      [ BiomeId.POWER_PLANT, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.MAGBY, PokemonType.FIRE, -1, [ 
      [ BiomeId.VOLCANO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MILTANK, PokemonType.NORMAL, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.RARE ],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BLISSEY, PokemonType.NORMAL, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.RAIKOU, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.ENTEI, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.SUICUNE, PokemonType.WATER, -1, [
      [ BiomeId.RIVER, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.LARVITAR, PokemonType.ROCK, PokemonType.GROUND, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.PUPITAR, PokemonType.ROCK, PokemonType.GROUND, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.TYRANITAR, PokemonType.ROCK, PokemonType.DARK, [
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.SUPER_RARE ], 
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ], 
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.LUGIA, PokemonType.PSYCHIC, PokemonType.FLYING, [
      [ BiomeId.SEA, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.HO_OH, PokemonType.FIRE, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.CELEBI, PokemonType.PSYCHIC, PokemonType.GRASS, [ 
      [ BiomeId.FOREST, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.TREECKO, PokemonType.GRASS, -1, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.GROVYLE, PokemonType.GRASS, -1, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.SCEPTILE, PokemonType.GRASS, -1, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.TORCHIC, PokemonType.FIRE, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.COMBUSKEN, PokemonType.FIRE, PokemonType.FIGHTING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.BLAZIKEN, PokemonType.FIRE, PokemonType.FIGHTING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.MUDKIP, PokemonType.WATER, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.MARSHTOMP, PokemonType.WATER, PokemonType.GROUND, [
      [ BiomeId.SWAMP, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.SWAMPERT, PokemonType.WATER, PokemonType.GROUND, [
      [ BiomeId.SWAMP, BiomePoolTier.RARE ],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.POOCHYENA, PokemonType.DARK, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MIGHTYENA, PokemonType.DARK, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ZIGZAGOON, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.LINOONE, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS ],
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.WURMPLE, PokemonType.BUG, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SILCOON, PokemonType.BUG, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, TimeOfDay.DAY ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.BEAUTIFLY, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, TimeOfDay.DAY ],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, TimeOfDay.DAY ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, TimeOfDay.DAY ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CASCOON, PokemonType.BUG, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DUSTOX, PokemonType.BUG, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, TimeOfDay.NIGHT ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.LOTAD, PokemonType.WATER, PokemonType.GRASS, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SWAMP, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.RIVER, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.LOMBRE, PokemonType.WATER, PokemonType.GRASS, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SWAMP, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.RIVER, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.LUDICOLO, PokemonType.WATER, PokemonType.GRASS, [
      [ BiomeId.SWAMP, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.SEEDOT, PokemonType.GRASS, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.NUZLEAF, PokemonType.GRASS, PokemonType.DARK, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SHIFTRY, PokemonType.GRASS, PokemonType.DARK, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TAILLOW, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SWELLOW, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.TOWN, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.WINGULL, PokemonType.WATER, PokemonType.FLYING, [
      [ BiomeId.SEA, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.PELIPPER, PokemonType.WATER, PokemonType.FLYING, [
      [ BiomeId.SEA, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SEA, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.RALTS, PokemonType.PSYCHIC, PokemonType.FAIRY, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DOJO, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.KIRLIA, PokemonType.PSYCHIC, PokemonType.FAIRY, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DOJO, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.GARDEVOIR, PokemonType.PSYCHIC, PokemonType.FAIRY, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SURSKIT, PokemonType.BUG, PokemonType.WATER, [
      [ BiomeId.TOWN, BiomePoolTier.RARE ],
      [ BiomeId.LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.MASQUERAIN, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.RARE ],
      [ BiomeId.LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SHROOMISH, PokemonType.GRASS, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.BRELOOM, PokemonType.GRASS, PokemonType.FIGHTING, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SLAKOTH, PokemonType.NORMAL, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.VIGOROTH, PokemonType.NORMAL, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.SLAKING, PokemonType.NORMAL, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.NINCADA, PokemonType.BUG, PokemonType.GROUND, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.NINJASK, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SHEDINJA, PokemonType.BUG, PokemonType.GHOST, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.WHISMUR, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.LOUDRED, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.EXPLOUD, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS ], 
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MAKUHITA, PokemonType.FIGHTING, -1, [
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DOJO, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.HARIYAMA, PokemonType.FIGHTING, -1, [
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DOJO, BiomePoolTier.COMMON ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.AZURILL, PokemonType.NORMAL, PokemonType.FAIRY, [ 
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.NOSEPASS, PokemonType.ROCK, -1, [
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SKITTY, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.DELCATTY, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.SABLEYE, PokemonType.DARK, PokemonType.GHOST, [
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MAWILE, PokemonType.STEEL, PokemonType.FAIRY, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ARON, PokemonType.STEEL, PokemonType.ROCK, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.LAIRON, PokemonType.STEEL, PokemonType.ROCK, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.AGGRON, PokemonType.STEEL, PokemonType.ROCK, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MEDITITE, PokemonType.FIGHTING, PokemonType.PSYCHIC, [
      [ BiomeId.DOJO, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MEDICHAM, PokemonType.FIGHTING, PokemonType.PSYCHIC, [
      [ BiomeId.DOJO, BiomePoolTier.COMMON ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ELECTRIKE, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MANECTRIC, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PLUSLE, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.MINUN, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.VOLBEAT, PokemonType.BUG, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.RARE, TimeOfDay.NIGHT ],
      [ BiomeId.RIVER, BiomePoolTier.RARE, TimeOfDay.NIGHT ]
    ]
    ],
    [ SpeciesId.ILLUMISE, PokemonType.BUG, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.RARE, TimeOfDay.NIGHT ],
      [ BiomeId.RIVER, BiomePoolTier.RARE, TimeOfDay.NIGHT ]
    ]
    ],
    [ SpeciesId.ROSELIA, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MEADOW, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GULPIN, PokemonType.POISON, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SWALOT, PokemonType.POISON, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.COMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CARVANHA, PokemonType.WATER, PokemonType.DARK, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SHARPEDO, PokemonType.WATER, PokemonType.DARK, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SEA, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.WAILMER, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEABED, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.WAILORD, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEABED, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.NUMEL, PokemonType.FIRE, PokemonType.GROUND, [
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.CAMERUPT, PokemonType.FIRE, PokemonType.GROUND, [
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TORKOAL, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SPOINK, PokemonType.PSYCHIC, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.RUINS, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GRUMPIG, PokemonType.PSYCHIC, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.RUINS, BiomePoolTier.COMMON ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SPINDA, PokemonType.NORMAL, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.TRAPINCH, PokemonType.GROUND, -1, [
      [ BiomeId.DESERT, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.VIBRAVA, PokemonType.GROUND, PokemonType.DRAGON, [
      [ BiomeId.DESERT, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.FLYGON, PokemonType.GROUND, PokemonType.DRAGON, [
      [ BiomeId.DESERT, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ], 
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ], 
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.CACNEA, PokemonType.GRASS, -1, [
      [ BiomeId.DESERT, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.CACTURNE, PokemonType.GRASS, PokemonType.DARK, [
      [ BiomeId.DESERT, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.DESERT, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.SWABLU, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.WASTELAND, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.ALTARIA, PokemonType.DRAGON, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.WASTELAND, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ZANGOOSE, PokemonType.NORMAL, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.RARE ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SEVIPER, PokemonType.POISON, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.LUNATONE, PokemonType.ROCK, PokemonType.PSYCHIC, [
      [ BiomeId.SPACE, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.SPACE, BiomePoolTier.BOSS, TimeOfDay.NIGHT ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SOLROCK, PokemonType.ROCK, PokemonType.PSYCHIC, [
      [ BiomeId.SPACE, BiomePoolTier.COMMON, TimeOfDay.DAY ],
      [ BiomeId.SPACE, BiomePoolTier.BOSS, TimeOfDay.DAY ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BARBOACH, PokemonType.WATER, PokemonType.GROUND, [
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.WHISCASH, PokemonType.WATER, PokemonType.GROUND, [
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CORPHISH, PokemonType.WATER, -1, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.CRAWDAUNT, PokemonType.WATER, PokemonType.DARK, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON ],
      [ BiomeId.BEACH, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BALTOY, PokemonType.GROUND, PokemonType.PSYCHIC, [
      [ BiomeId.RUINS, BiomePoolTier.COMMON ],
      [ BiomeId.SPACE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.CLAYDOL, PokemonType.GROUND, PokemonType.PSYCHIC, [
      [ BiomeId.RUINS, BiomePoolTier.COMMON ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS ],
      [ BiomeId.SPACE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.LILEEP, PokemonType.ROCK, PokemonType.GRASS, [
      [ BiomeId.DESERT, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.CRADILY, PokemonType.ROCK, PokemonType.GRASS, [
      [ BiomeId.DESERT, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DESERT, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.ANORITH, PokemonType.ROCK, PokemonType.BUG, [
      [ BiomeId.DESERT, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.ARMALDO, PokemonType.ROCK, PokemonType.BUG, [
      [ BiomeId.DESERT, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DESERT, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.FEEBAS, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.RIVER, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.SEWER, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.MILOTIC, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.BOSS_SUPER_RARE ],
      [ BiomeId.RIVER, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.CASTFORM, PokemonType.NORMAL, -1, [
      [ BiomeId.METROPOLIS, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.KECLEON, PokemonType.NORMAL, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.RARE ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SHUPPET, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.BANETTE, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DUSKULL, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DUSCLOPS, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.TROPIUS, PokemonType.GRASS, PokemonType.FLYING, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.RARE ],
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.CHIMECHO, PokemonType.PSYCHIC, -1, [
      [ BiomeId.TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ABSOL, PokemonType.DARK, -1, [
      [ BiomeId.ABYSS, BiomePoolTier.RARE ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.WYNAUT, PokemonType.PSYCHIC, -1, [ 
      [ BiomeId.RUINS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SNORUNT, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.GLALIE, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SPHEAL, PokemonType.ICE, PokemonType.WATER, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.UNCOMMON ], 
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SEALEO, PokemonType.ICE, PokemonType.WATER, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.WALREIN, PokemonType.ICE, PokemonType.WATER, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CLAMPERL, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.HUNTAIL, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.GOREBYSS, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.RELICANTH, PokemonType.WATER, PokemonType.ROCK, [
      [ BiomeId.SEABED, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.LUVDISC, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BAGON, PokemonType.DRAGON, -1, [
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.SHELGON, PokemonType.DRAGON, -1, [
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.SALAMENCE, PokemonType.DRAGON, PokemonType.FLYING, [
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ], 
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.BELDUM, PokemonType.STEEL, PokemonType.PSYCHIC, [
      [ BiomeId.FACTORY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPACE, BiomePoolTier.RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.METANG, PokemonType.STEEL, PokemonType.PSYCHIC, [
      [ BiomeId.FACTORY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPACE, BiomePoolTier.RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.METAGROSS, PokemonType.STEEL, PokemonType.PSYCHIC, [
      [ BiomeId.FACTORY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPACE, BiomePoolTier.RARE ],
      [ BiomeId.SPACE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.REGIROCK, PokemonType.ROCK, -1, [
      [ BiomeId.DESERT, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.DESERT, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.REGICE, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.REGISTEEL, PokemonType.STEEL, -1, [
      [ BiomeId.RUINS, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.LATIAS, PokemonType.DRAGON, PokemonType.PSYCHIC, [
      [ BiomeId.PLAINS, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.LATIOS, PokemonType.DRAGON, PokemonType.PSYCHIC, [
      [ BiomeId.PLAINS, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.KYOGRE, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.GROUDON, PokemonType.GROUND, -1, [
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.RAYQUAZA, PokemonType.DRAGON, PokemonType.FLYING, [
      [ BiomeId.SKY, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.JIRACHI, PokemonType.STEEL, PokemonType.PSYCHIC, [ 
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS_SUPER_RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.ULTRA_RARE ]
    ] 
    ],
    [ SpeciesId.DEOXYS, PokemonType.PSYCHIC, -1, [ 
      [ BiomeId.SPACE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.TURTWIG, PokemonType.GRASS, -1, [
      [ BiomeId.GRASS, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.GROTLE, PokemonType.GRASS, -1, [
      [ BiomeId.GRASS, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.TORTERRA, PokemonType.GRASS, PokemonType.GROUND, [
      [ BiomeId.GRASS, BiomePoolTier.RARE ],
      [ BiomeId.GRASS, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.CHIMCHAR, PokemonType.FIRE, -1, [
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.MONFERNO, PokemonType.FIRE, PokemonType.FIGHTING, [
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.INFERNAPE, PokemonType.FIRE, PokemonType.FIGHTING, [
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.PIPLUP, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.PRINPLUP, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.EMPOLEON, PokemonType.WATER, PokemonType.STEEL, [
      [ BiomeId.SEA, BiomePoolTier.RARE ],
      [ BiomeId.SEA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.STARLY, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.STARAVIA, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.STARAPTOR, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BIDOOF, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.BIBAREL, PokemonType.NORMAL, PokemonType.WATER, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.KRICKETOT, PokemonType.BUG, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.KRICKETUNE, PokemonType.BUG, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SHINX, PokemonType.ELECTRIC, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.LUXIO, PokemonType.ELECTRIC, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.LUXRAY, PokemonType.ELECTRIC, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BUDEW, PokemonType.GRASS, PokemonType.POISON, [ 
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ROSERADE, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.MEADOW, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CRANIDOS, PokemonType.ROCK, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.RAMPARDOS, PokemonType.ROCK, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SHIELDON, PokemonType.ROCK, PokemonType.STEEL, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.BASTIODON, PokemonType.ROCK, PokemonType.STEEL, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ], 
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BURMY, PokemonType.BUG, -1, [
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BEACH, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SLUM, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.WORMADAM, PokemonType.BUG, PokemonType.GRASS, [
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.BEACH, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BEACH, BiomePoolTier.BOSS ],
      [ BiomeId.SLUM, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SLUM, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MOTHIM, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.COMBEE, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GRASS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.VESPIQUEN, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GRASS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PACHIRISU, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.BUIZEL, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.FLOATZEL, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEA, BiomePoolTier.BOSS ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CHERUBI, PokemonType.GRASS, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GRASS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.CHERRIM, PokemonType.GRASS, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GRASS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SHELLOS, PokemonType.WATER, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.COMMON ],
      [ BiomeId.SEABED, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GASTRODON, PokemonType.WATER, PokemonType.GROUND, [
      [ BiomeId.SWAMP, BiomePoolTier.COMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS ],
      [ BiomeId.SEABED, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.AMBIPOM, PokemonType.NORMAL, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DRIFLOON, PokemonType.GHOST, PokemonType.FLYING, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DRIFBLIM, PokemonType.GHOST, PokemonType.FLYING, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],   
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BUNEARY, PokemonType.NORMAL, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.LOPUNNY, PokemonType.NORMAL, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MISMAGIUS, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.HONCHKROW, PokemonType.DARK, PokemonType.FLYING, [
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.GLAMEOW, PokemonType.NORMAL, -1, [
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.PURUGLY, PokemonType.NORMAL, -1, [
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CHINGLING, PokemonType.PSYCHIC, -1, [
      [ BiomeId.TEMPLE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.STUNKY, PokemonType.POISON, PokemonType.DARK, [
      [ BiomeId.SLUM, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SKUNTANK, PokemonType.POISON, PokemonType.DARK, [
      [ BiomeId.SLUM, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SLUM, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BRONZOR, PokemonType.STEEL, PokemonType.PSYCHIC, [
      [ BiomeId.FACTORY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPACE, BiomePoolTier.COMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.BRONZONG, PokemonType.STEEL, PokemonType.PSYCHIC, [
      [ BiomeId.FACTORY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPACE, BiomePoolTier.COMMON ],
      [ BiomeId.SPACE, BiomePoolTier.BOSS ],
      [ BiomeId.LABORATORY, BiomePoolTier.COMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.BOSS ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BONSLY, PokemonType.ROCK, -1, [ 
      [ BiomeId.GRASS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GRASS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MIME_JR, PokemonType.PSYCHIC, PokemonType.FAIRY, [ 
      [ BiomeId.RUINS, BiomePoolTier.RARE ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.HAPPINY, PokemonType.NORMAL, -1, [ 
      [ BiomeId.PLAINS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MEADOW, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.CHATOT, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.JUNGLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SPIRITOMB, PokemonType.GHOST, PokemonType.DARK, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABYSS, BiomePoolTier.RARE ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.GIBLE, PokemonType.DRAGON, PokemonType.GROUND, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.GABITE, PokemonType.DRAGON, PokemonType.GROUND, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.GARCHOMP, PokemonType.DRAGON, PokemonType.GROUND, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.MUNCHLAX, PokemonType.NORMAL, -1, [ 
      [ BiomeId.PLAINS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.RIOLU, PokemonType.FIGHTING, -1, [ 
      [ BiomeId.DOJO, BiomePoolTier.RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.LUCARIO, PokemonType.FIGHTING, PokemonType.STEEL, [
      [ BiomeId.DOJO, BiomePoolTier.RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.HIPPOPOTAS, PokemonType.GROUND, -1, [
      [ BiomeId.DESERT, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.HIPPOWDON, PokemonType.GROUND, -1, [
      [ BiomeId.DESERT, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DESERT, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.SKORUPI, PokemonType.POISON, PokemonType.BUG, [
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERT, BiomePoolTier.COMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DRAPION, PokemonType.POISON, PokemonType.DARK, [
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERT, BiomePoolTier.COMMON ],
      [ BiomeId.DESERT, BiomePoolTier.BOSS ],
      [ BiomeId.TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CROAGUNK, PokemonType.POISON, PokemonType.FIGHTING, [
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.DOJO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.TOXICROAK, PokemonType.POISON, PokemonType.FIGHTING, [
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.DOJO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CARNIVINE, PokemonType.GRASS, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.FINNEON, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.LUMINEON, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.SEA, BiomePoolTier.BOSS, TimeOfDay.NIGHT ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MANTYKE, PokemonType.WATER, PokemonType.FLYING, [
      [ BiomeId.SEABED, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SNOVER, PokemonType.GRASS, PokemonType.ICE, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.ABOMASNOW, PokemonType.GRASS, PokemonType.ICE, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.WEAVILE, PokemonType.DARK, PokemonType.ICE, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MAGNEZONE, PokemonType.ELECTRIC, PokemonType.STEEL, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ],
      [ BiomeId.LABORATORY, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.LICKILICKY, PokemonType.NORMAL, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.RHYPERIOR, PokemonType.GROUND, PokemonType.ROCK, [
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ], 
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TANGROWTH, PokemonType.GRASS, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ELECTIVIRE, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MAGMORTAR, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TOGEKISS, PokemonType.FAIRY, PokemonType.FLYING, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.YANMEGA, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.LEAFEON, PokemonType.GRASS, -1, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.GLACEON, PokemonType.ICE, -1, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.GLISCOR, PokemonType.GROUND, PokemonType.FLYING, [
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MAMOSWINE, PokemonType.ICE, PokemonType.GROUND, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.PORYGON_Z, PokemonType.NORMAL, -1, [
      [ BiomeId.SPACE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LABORATORY, BiomePoolTier.BOSS ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.GALLADE, PokemonType.PSYCHIC, PokemonType.FIGHTING, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DOJO, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.PROBOPASS, PokemonType.ROCK, PokemonType.STEEL, [
      [ BiomeId.CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DUSKNOIR, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.FROSLASS, PokemonType.ICE, PokemonType.GHOST, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ROTOM, PokemonType.ELECTRIC, PokemonType.GHOST, [
      [ BiomeId.LABORATORY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LABORATORY, BiomePoolTier.BOSS_SUPER_RARE ],
      [ BiomeId.VOLCANO, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS_SUPER_RARE ],
      [ BiomeId.SEA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SEA, BiomePoolTier.BOSS_SUPER_RARE ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS_SUPER_RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS_SUPER_RARE ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.UXIE, PokemonType.PSYCHIC, -1, [
      [ BiomeId.CAVE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.MESPRIT, PokemonType.PSYCHIC, -1, [
      [ BiomeId.LAKE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.AZELF, PokemonType.PSYCHIC, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.DIALGA, PokemonType.STEEL, PokemonType.DRAGON, [
      [ BiomeId.RUINS, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.PALKIA, PokemonType.WATER, PokemonType.DRAGON, [
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.HEATRAN, PokemonType.FIRE, PokemonType.STEEL, [
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.REGIGIGAS, PokemonType.NORMAL, -1, [
      [ BiomeId.TEMPLE, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.GIRATINA, PokemonType.GHOST, PokemonType.DRAGON, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.CRESSELIA, PokemonType.PSYCHIC, -1, [
      [ BiomeId.BEACH, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.BEACH, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.PHIONE, PokemonType.WATER, -1, [ 
      [ BiomeId.SEA, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.MANAPHY, PokemonType.WATER, -1, [ 
      [ BiomeId.SEA, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.DARKRAI, PokemonType.DARK, -1, [
      [ BiomeId.ABYSS, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.SHAYMIN, PokemonType.GRASS, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.ARCEUS, PokemonType.NORMAL, -1, [ ]
    ],
    [ SpeciesId.VICTINI, PokemonType.PSYCHIC, PokemonType.FIRE, [ 
      [ BiomeId.ISLAND, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.SNIVY, PokemonType.GRASS, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.SERVINE, PokemonType.GRASS, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.SERPERIOR, PokemonType.GRASS, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.TEPIG, PokemonType.FIRE, -1, [
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.PIGNITE, PokemonType.FIRE, PokemonType.FIGHTING, [
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.EMBOAR, PokemonType.FIRE, PokemonType.FIGHTING, [
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.RARE ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.OSHAWOTT, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.DEWOTT, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.SAMUROTT, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.RARE ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.PATRAT, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SLUM, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.WATCHOG, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SLUM, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SLUM, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.LILLIPUP, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.HERDIER, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.STOUTLAND, PokemonType.NORMAL, -1, [
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PURRLOIN, PokemonType.DARK, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.LIEPARD, PokemonType.DARK, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PANSAGE, PokemonType.GRASS, -1, [
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.SIMISAGE, PokemonType.GRASS, -1, [
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ], 
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.PANSEAR, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SIMISEAR, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PANPOUR, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ]
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SIMIPOUR, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEA, BiomePoolTier.BOSS ],
      [ BiomeId.RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ], 
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MUNNA, PokemonType.PSYCHIC, -1, [
      [ BiomeId.SPACE, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MUSHARNA, PokemonType.PSYCHIC, -1, [
      [ BiomeId.SPACE, BiomePoolTier.COMMON ],
      [ BiomeId.SPACE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PIDOVE, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.TRANQUILL, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.UNFEZANT, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BLITZLE, PokemonType.ELECTRIC, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ZEBSTRIKA, PokemonType.ELECTRIC, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS ],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ROGGENROLA, PokemonType.ROCK, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.BOLDORE, PokemonType.ROCK, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GIGALITH, PokemonType.ROCK, -1, [
      [ BiomeId.CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.WOOBAT, PokemonType.PSYCHIC, PokemonType.FLYING, [
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SWOOBAT, PokemonType.PSYCHIC, PokemonType.FLYING, [
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ BiomeId.SKY, BiomePoolTier.BOSS, TimeOfDay.NIGHT ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DRILBUR, PokemonType.GROUND, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.EXCADRILL, PokemonType.GROUND, PokemonType.STEEL, [
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON ],
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.AUDINO, PokemonType.NORMAL, -1, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TIMBURR, PokemonType.FIGHTING, -1, [
      [ BiomeId.FACTORY, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.GURDURR, PokemonType.FIGHTING, -1, [
      [ BiomeId.FACTORY, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.CONKELDURR, PokemonType.FIGHTING, -1, [
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.TYMPOLE, PokemonType.WATER, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.PALPITOAD, PokemonType.WATER, PokemonType.GROUND, [
      [ BiomeId.SWAMP, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.SEISMITOAD, PokemonType.WATER, PokemonType.GROUND, [
      [ BiomeId.SWAMP, BiomePoolTier.COMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.THROH, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SAWK, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SEWADDLE, PokemonType.BUG, PokemonType.GRASS, [
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SWADLOON, PokemonType.BUG, PokemonType.GRASS, [
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.LEAVANNY, PokemonType.BUG, PokemonType.GRASS, [
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.VENIPEDE, PokemonType.BUG, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.WHIRLIPEDE, PokemonType.BUG, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SCOLIPEDE, PokemonType.BUG, PokemonType.POISON, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.COTTONEE, PokemonType.GRASS, PokemonType.FAIRY, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MEADOW, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.WHIMSICOTT, PokemonType.GRASS, PokemonType.FAIRY, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GRASS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.PETILIL, PokemonType.GRASS, -1, [
      [ BiomeId.GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.LILLIGANT, PokemonType.GRASS, -1, [
      [ BiomeId.FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BASCULIN, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.SANDILE, PokemonType.GROUND, PokemonType.DARK, [
      [ BiomeId.DESERT, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DESERT, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.KROKOROK, PokemonType.GROUND, PokemonType.DARK, [
      [ BiomeId.DESERT, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DESERT, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.KROOKODILE, PokemonType.GROUND, PokemonType.DARK, [
      [ BiomeId.DESERT, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DESERT, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.DESERT, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS_RARE],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.DARUMAKA, PokemonType.FIRE, -1, [
      [ BiomeId.DESERT, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.DARMANITAN, PokemonType.FIRE, -1, [
      [ BiomeId.DESERT, BiomePoolTier.RARE ],
      [ BiomeId.DESERT, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MARACTUS, PokemonType.GRASS, -1, [
      [ BiomeId.DESERT, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERT, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DWEBBLE, PokemonType.BUG, PokemonType.ROCK, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.CRUSTLE, PokemonType.BUG, PokemonType.ROCK, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON ],
      [ BiomeId.BEACH, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SCRAGGY, PokemonType.DARK, PokemonType.FIGHTING, [
      [ BiomeId.DOJO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SCRAFTY, PokemonType.DARK, PokemonType.FIGHTING, [
      [ BiomeId.DOJO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SIGILYPH, PokemonType.PSYCHIC, PokemonType.FLYING, [
      [ BiomeId.RUINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS ],
      [ BiomeId.SPACE, BiomePoolTier.RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.YAMASK, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.COFAGRIGUS, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ], 
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.TIRTOUGA, PokemonType.WATER, PokemonType.ROCK, [
      [ BiomeId.SEA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BEACH, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.CARRACOSTA, PokemonType.WATER, PokemonType.ROCK, [
      [ BiomeId.SEA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BEACH, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BEACH, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ARCHEN, PokemonType.ROCK, PokemonType.FLYING, [
      [ BiomeId.RUINS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.ARCHEOPS, PokemonType.ROCK, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.RUINS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TRUBBISH, PokemonType.POISON, -1, [
      [ BiomeId.SLUM, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GARBODOR, PokemonType.POISON, -1, [
      [ BiomeId.SLUM, BiomePoolTier.COMMON ],
      [ BiomeId.SLUM, BiomePoolTier.BOSS ],
      [ BiomeId.SEWER, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ZORUA, PokemonType.DARK, -1, [
      [ BiomeId.ABYSS, BiomePoolTier.RARE ], 
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.ZOROARK, PokemonType.DARK, -1, [
      [ BiomeId.ABYSS, BiomePoolTier.RARE ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MINCCINO, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MEADOW, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.CINCCINO, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.GOTHITA, PokemonType.PSYCHIC, -1, [
      [ BiomeId.RUINS, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.GOTHORITA, PokemonType.PSYCHIC, -1, [
      [ BiomeId.RUINS, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.GOTHITELLE, PokemonType.PSYCHIC, -1, [
      [ BiomeId.RUINS, BiomePoolTier.RARE ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SOLOSIS, PokemonType.PSYCHIC, -1, [
      [ BiomeId.SPACE, BiomePoolTier.RARE ],
      [ BiomeId.LABORATORY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DUOSION, PokemonType.PSYCHIC, -1, [
      [ BiomeId.SPACE, BiomePoolTier.RARE ],
      [ BiomeId.LABORATORY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.REUNICLUS, PokemonType.PSYCHIC, -1, [
      [ BiomeId.SPACE, BiomePoolTier.RARE ],
      [ BiomeId.SPACE, BiomePoolTier.BOSS ],
      [ BiomeId.LABORATORY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DUCKLETT, PokemonType.WATER, PokemonType.FLYING, [
      [ BiomeId.LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.RIVER, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.SWANNA, PokemonType.WATER, PokemonType.FLYING, [
      [ BiomeId.LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.RIVER, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.RIVER, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.VANILLITE, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.VANILLISH, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.VANILLUXE, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DEERLING, PokemonType.NORMAL, PokemonType.GRASS, [
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SAWSBUCK, PokemonType.NORMAL, PokemonType.GRASS, [
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.EMOLGA, PokemonType.ELECTRIC, PokemonType.FLYING, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.KARRABLAST, PokemonType.BUG, -1, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.ESCAVALIER, PokemonType.BUG, PokemonType.STEEL, [
      [ BiomeId.FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.FOONGUS, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.GRASS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.JUNGLE, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.AMOONGUSS, PokemonType.GRASS, PokemonType.POISON, [
      [ BiomeId.GRASS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.JUNGLE, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.FRILLISH, PokemonType.WATER, PokemonType.GHOST, [
      [ BiomeId.SEABED, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.JELLICENT, PokemonType.WATER, PokemonType.GHOST, [
      [ BiomeId.SEABED, BiomePoolTier.COMMON ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ALOMOMOLA, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.RARE ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.JOLTIK, PokemonType.BUG, PokemonType.ELECTRIC, [
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.GALVANTULA, PokemonType.BUG, PokemonType.ELECTRIC, [
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.FERROSEED, PokemonType.GRASS, PokemonType.STEEL, [
      [ BiomeId.CAVE, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.FERROTHORN, PokemonType.GRASS, PokemonType.STEEL, [
      [ BiomeId.CAVE, BiomePoolTier.RARE ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.KLINK, PokemonType.STEEL, -1, [
      [ BiomeId.FACTORY, BiomePoolTier.COMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.KLANG, PokemonType.STEEL, -1, [
      [ BiomeId.FACTORY, BiomePoolTier.COMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.KLINKLANG, PokemonType.STEEL, -1, [
      [ BiomeId.FACTORY, BiomePoolTier.COMMON ],
      [ BiomeId.FACTORY, BiomePoolTier.BOSS ],
      [ BiomeId.LABORATORY, BiomePoolTier.COMMON ],
      [ BiomeId.LABORATORY, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TYNAMO, PokemonType.ELECTRIC, -1, [
      [ BiomeId.SEABED, BiomePoolTier.RARE ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.EELEKTRIK, PokemonType.ELECTRIC, -1, [
      [ BiomeId.SEABED, BiomePoolTier.RARE ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.EELEKTROSS, PokemonType.ELECTRIC, -1, [
      [ BiomeId.SEABED, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.ELGYEM, PokemonType.PSYCHIC, -1, [
      [ BiomeId.RUINS, BiomePoolTier.COMMON ],
      [ BiomeId.SPACE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.BEHEEYEM, PokemonType.PSYCHIC, -1, [
      [ BiomeId.RUINS, BiomePoolTier.COMMON ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS ],
      [ BiomeId.SPACE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.LITWICK, PokemonType.GHOST, PokemonType.FIRE, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.LAMPENT, PokemonType.GHOST, PokemonType.FIRE, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.CHANDELURE, PokemonType.GHOST, PokemonType.FIRE, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ],
      [ BiomeId.TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.AXEW, PokemonType.DRAGON, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.FRAXURE, PokemonType.DRAGON, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.HAXORUS, PokemonType.DRAGON, -1, [
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CUBCHOO, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ SpeciesId.BEARTIC, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ], 
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ SpeciesId.CRYOGONAL, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SHELMET, PokemonType.BUG, -1, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.ACCELGOR, PokemonType.BUG, -1, [
      [ BiomeId.FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.STUNFISK, PokemonType.GROUND, PokemonType.ELECTRIC, [
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MIENFOO, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MIENSHAO, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DRUDDIGON, PokemonType.DRAGON, -1, [
      [ BiomeId.WASTELAND, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.GOLETT, PokemonType.GROUND, PokemonType.GHOST, [
      [ BiomeId.TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.GOLURK, PokemonType.GROUND, PokemonType.GHOST, [
      [ BiomeId.TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PAWNIARD, PokemonType.DARK, PokemonType.STEEL, [
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.BISHARP, PokemonType.DARK, PokemonType.STEEL, [
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.BOUFFALANT, PokemonType.NORMAL, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.RUFFLET, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.BRAVIARY, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.VULLABY, PokemonType.DARK, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.MANDIBUZZ, PokemonType.DARK, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.HEATMOR, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DURANT, PokemonType.BUG, PokemonType.STEEL, [
      [ BiomeId.FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DEINO, PokemonType.DARK, PokemonType.DRAGON, [
      [ BiomeId.WASTELAND, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.ABYSS, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.ZWEILOUS, PokemonType.DARK, PokemonType.DRAGON, [
      [ BiomeId.WASTELAND, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.ABYSS, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.HYDREIGON, PokemonType.DARK, PokemonType.DRAGON, [
      [ BiomeId.WASTELAND, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.ABYSS, BiomePoolTier.RARE ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.LARVESTA, PokemonType.BUG, PokemonType.FIRE, [
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.VOLCARONA, PokemonType.BUG, PokemonType.FIRE, [
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.COBALION, PokemonType.STEEL, PokemonType.FIGHTING, [
      [ BiomeId.SHARP_FIELD, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.TERRAKION, PokemonType.ROCK, PokemonType.FIGHTING, [
      [ BiomeId.DOJO, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.VIRIZION, PokemonType.GRASS, PokemonType.FIGHTING, [
      [ BiomeId.GRASS, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.GRASS, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.TORNADUS, PokemonType.FLYING, -1, [
      [ BiomeId.SKY, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.THUNDURUS, PokemonType.ELECTRIC, PokemonType.FLYING, [
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.RESHIRAM, PokemonType.DRAGON, PokemonType.FIRE, [
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.ZEKROM, PokemonType.DRAGON, PokemonType.ELECTRIC, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.LANDORUS, PokemonType.GROUND, PokemonType.FLYING, [
      [ BiomeId.CANYON, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.KYUREM, PokemonType.DRAGON, PokemonType.ICE, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.KELDEO, PokemonType.WATER, PokemonType.FIGHTING, [
      [ BiomeId.BEACH, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.BEACH, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.MELOETTA, PokemonType.NORMAL, PokemonType.PSYCHIC, [
      [ BiomeId.METROPOLIS, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.GENESECT, PokemonType.BUG, PokemonType.STEEL, [
      [ BiomeId.SEWER, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.CHESPIN, PokemonType.GRASS, -1, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.QUILLADIN, PokemonType.GRASS, -1, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.CHESNAUGHT, PokemonType.GRASS, PokemonType.FIGHTING, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.FENNEKIN, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.BRAIXEN, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.DELPHOX, PokemonType.FIRE, PokemonType.PSYCHIC, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.FROAKIE, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.FROGADIER, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.GRENINJA, PokemonType.WATER, PokemonType.DARK, [
      [ BiomeId.LAKE, BiomePoolTier.RARE ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.BUNNELBY, PokemonType.NORMAL, -1, [
      [ BiomeId.CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DIGGERSBY, PokemonType.NORMAL, PokemonType.GROUND, [
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.FLETCHLING, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.FLETCHINDER, PokemonType.FIRE, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ], 
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.TALONFLAME, PokemonType.FIRE, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SCATTERBUG, PokemonType.BUG, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SPEWPA, PokemonType.BUG, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ], 
      [ BiomeId.SKY, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.VIVILLON, PokemonType.BUG, PokemonType.FLYING, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.LITLEO, PokemonType.FIRE, PokemonType.NORMAL, [
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.PYROAR, PokemonType.FIRE, PokemonType.NORMAL, [
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ], 
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.FLABEBE, PokemonType.FAIRY, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.FLOETTE, PokemonType.FAIRY, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.FLORGES, PokemonType.FAIRY, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SKIDDO, PokemonType.GRASS, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.GOGOAT, PokemonType.GRASS, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PANCHAM, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.PANGORO, PokemonType.FIGHTING, PokemonType.DARK, [
      [ BiomeId.DOJO, BiomePoolTier.RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.FURFROU, PokemonType.NORMAL, -1, [
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.ESPURR, PokemonType.PSYCHIC, -1, [
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.MEOWSTIC, PokemonType.PSYCHIC, -1, [
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.HONEDGE, PokemonType.STEEL, PokemonType.GHOST, [
      [ BiomeId.TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.DOUBLADE, PokemonType.STEEL, PokemonType.GHOST, [
      [ BiomeId.TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.AEGISLASH, PokemonType.STEEL, PokemonType.GHOST, [
      [ BiomeId.TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SPRITZEE, PokemonType.FAIRY, -1, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.AROMATISSE, PokemonType.FAIRY, -1, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SWIRLIX, PokemonType.FAIRY, -1, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SLURPUFF, PokemonType.FAIRY, -1, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.INKAY, PokemonType.DARK, PokemonType.PSYCHIC, [
      [ BiomeId.SEA, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.MALAMAR, PokemonType.DARK, PokemonType.PSYCHIC, [
      [ BiomeId.SEA, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SEA, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.BINACLE, PokemonType.ROCK, PokemonType.WATER, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.BARBARACLE, PokemonType.ROCK, PokemonType.WATER, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON ],
      [ BiomeId.BEACH, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SKRELP, PokemonType.POISON, PokemonType.WATER, [
      [ BiomeId.SEABED, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.DRAGALGE, PokemonType.POISON, PokemonType.DRAGON, [
      [ BiomeId.SEABED, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CLAUNCHER, PokemonType.WATER, -1, [
      [ BiomeId.BEACH, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.CLAWITZER, PokemonType.WATER, -1, [
      [ BiomeId.BEACH, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BEACH, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.HELIOPTILE, PokemonType.ELECTRIC, PokemonType.NORMAL, [
      [ BiomeId.DESERT, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.HELIOLISK, PokemonType.ELECTRIC, PokemonType.NORMAL, [
      [ BiomeId.DESERT, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.TYRUNT, PokemonType.ROCK, PokemonType.DRAGON, [
      [ BiomeId.WASTELAND, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.TYRANTRUM, PokemonType.ROCK, PokemonType.DRAGON, [
      [ BiomeId.WASTELAND, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.AMAURA, PokemonType.ROCK, PokemonType.ICE, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.AURORUS, PokemonType.ROCK, PokemonType.ICE, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SYLVEON, PokemonType.FAIRY, -1, [
      [ BiomeId.TOWN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MEADOW, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.HAWLUCHA, PokemonType.FIGHTING, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DEDENNE, PokemonType.ELECTRIC, PokemonType.FAIRY, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CARBINK, PokemonType.ROCK, PokemonType.FAIRY, [
      [ BiomeId.CAVE, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.GOOMY, PokemonType.DRAGON, -1, [
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SLIGGOO, PokemonType.DRAGON, -1, [
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GOODRA, PokemonType.DRAGON, -1, [
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.KLEFKI, PokemonType.STEEL, PokemonType.FAIRY, [
      [ BiomeId.FACTORY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FACTORY, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PHANTUMP, PokemonType.GHOST, PokemonType.GRASS, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.NIGHT ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.TREVENANT, PokemonType.GHOST, PokemonType.GRASS, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.NIGHT ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.NIGHT ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PUMPKABOO, PokemonType.GHOST, PokemonType.GRASS, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GOURGEIST, PokemonType.GHOST, PokemonType.GRASS, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BERGMITE, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.AVALUGG, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.NOIBAT, PokemonType.FLYING, PokemonType.DRAGON, [
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.NOIVERN, PokemonType.FLYING, PokemonType.DRAGON, [
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.XERNEAS, PokemonType.FAIRY, -1, [
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.YVELTAL, PokemonType.DARK, PokemonType.FLYING, [
      [ BiomeId.ABYSS, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.ZYGARDE, PokemonType.DRAGON, PokemonType.GROUND, [
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.DIANCIE, PokemonType.ROCK, PokemonType.FAIRY, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.HOOPA, PokemonType.PSYCHIC, PokemonType.GHOST, [
      [ BiomeId.TEMPLE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.TEMPLE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.VOLCANION, PokemonType.FIRE, PokemonType.WATER, [
      [ BiomeId.SPA, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.ROWLET, PokemonType.GRASS, PokemonType.FLYING, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.DARTRIX, PokemonType.GRASS, PokemonType.FLYING, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.DECIDUEYE, PokemonType.GRASS, PokemonType.GHOST, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.LITTEN, PokemonType.FIRE, -1, [
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.TORRACAT, PokemonType.FIRE, -1, [
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.INCINEROAR, PokemonType.FIRE, PokemonType.DARK, [
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.POPPLIO, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.BRIONNE, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.PRIMARINA, PokemonType.WATER, PokemonType.FAIRY, [
      [ BiomeId.SEA, BiomePoolTier.RARE ],
      [ BiomeId.SEA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.PIKIPEK, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.TRUMBEAK, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.TOUCANNON, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.YUNGOOS, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.GUMSHOOS, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.GRUBBIN, PokemonType.BUG, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.CHARJABUG, PokemonType.BUG, PokemonType.ELECTRIC, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.VIKAVOLT, PokemonType.BUG, PokemonType.ELECTRIC, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.CRABRAWLER, PokemonType.FIGHTING, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.CRABOMINABLE, PokemonType.FIGHTING, PokemonType.ICE, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ORICORIO, PokemonType.FIRE, PokemonType.FLYING, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CUTIEFLY, PokemonType.BUG, PokemonType.FAIRY, [
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.RIBOMBEE, PokemonType.BUG, PokemonType.FAIRY, [
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ROCKRUFF, PokemonType.ROCK, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, TimeOfDay.DAY ],
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON, TimeOfDay.DUSK ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.LYCANROC, PokemonType.ROCK, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, TimeOfDay.DAY ],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS_RARE, TimeOfDay.DAY ],
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS_RARE, TimeOfDay.NIGHT ],
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON, TimeOfDay.DUSK ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS_RARE, TimeOfDay.DUSK ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.WISHIWASHI, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MAREANIE, PokemonType.POISON, PokemonType.WATER, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.RARE ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.TOXAPEX, PokemonType.POISON, PokemonType.WATER, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON ],
      [ BiomeId.BEACH, BiomePoolTier.BOSS ],
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MUDBRAY, PokemonType.GROUND, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MUDSDALE, PokemonType.GROUND, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON ],
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DEWPIDER, PokemonType.WATER, PokemonType.BUG, [
      [ BiomeId.LAKE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.ARAQUANID, PokemonType.WATER, PokemonType.BUG, [
      [ BiomeId.LAKE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LAKE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.FOMANTIS, PokemonType.GRASS, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.LURANTIS, PokemonType.GRASS, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS ],
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MORELULL, PokemonType.GRASS, PokemonType.FAIRY, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SHIINOTIC, PokemonType.GRASS, PokemonType.FAIRY, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SALANDIT, PokemonType.POISON, PokemonType.FIRE, [
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SALAZZLE, PokemonType.POISON, PokemonType.FIRE, [
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.STUFFUL, PokemonType.NORMAL, PokemonType.FIGHTING, [
      [ BiomeId.DOJO, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.BEWEAR, PokemonType.NORMAL, PokemonType.FIGHTING, [
      [ BiomeId.DOJO, BiomePoolTier.COMMON ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BOUNSWEET, PokemonType.GRASS, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.STEENEE, PokemonType.GRASS, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.TSAREENA, PokemonType.GRASS, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.COMFEY, PokemonType.FAIRY, -1, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ORANGURU, PokemonType.NORMAL, PokemonType.PSYCHIC, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.PASSIMIAN, PokemonType.FIGHTING, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.WIMPOD, PokemonType.BUG, PokemonType.WATER, [
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GOLISOPOD, PokemonType.BUG, PokemonType.WATER, [
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SANDYGAST, PokemonType.GHOST, PokemonType.GROUND, [
      [ BiomeId.BEACH, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.PALOSSAND, PokemonType.GHOST, PokemonType.GROUND, [
      [ BiomeId.BEACH, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BEACH, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PYUKUMUKU, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.TYPE_NULL, PokemonType.NORMAL, -1, [
      [ BiomeId.LABORATORY, BiomePoolTier.ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.SILVALLY, PokemonType.NORMAL, -1, [
      [ BiomeId.LABORATORY, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.MINIOR, PokemonType.ROCK, PokemonType.FLYING, [
      [ BiomeId.SPACE, BiomePoolTier.COMMON ],
      [ BiomeId.SPACE, BiomePoolTier.BOSS ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.KOMALA, PokemonType.NORMAL, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.TURTONATOR, PokemonType.FIRE, PokemonType.DRAGON, [
      [ BiomeId.VOLCANO, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TOGEDEMARU, PokemonType.ELECTRIC, PokemonType.STEEL, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MIMIKYU, PokemonType.GHOST, PokemonType.FAIRY, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.RARE ],
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.RARE ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.BRUXISH, PokemonType.WATER, PokemonType.PSYCHIC, [
      [ BiomeId.ISLAND, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DRAMPA, PokemonType.NORMAL, PokemonType.DRAGON, [
      [ BiomeId.WASTELAND, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DHELMISE, PokemonType.GHOST, PokemonType.GRASS, [
      [ BiomeId.SEABED, BiomePoolTier.RARE ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.JANGMO_O, PokemonType.DRAGON, -1, [
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.HAKAMO_O, PokemonType.DRAGON, PokemonType.FIGHTING, [
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.KOMMO_O, PokemonType.DRAGON, PokemonType.FIGHTING, [
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.TAPU_KOKO, PokemonType.ELECTRIC, PokemonType.FAIRY, [
      [ BiomeId.TEMPLE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.TEMPLE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.TAPU_LELE, PokemonType.PSYCHIC, PokemonType.FAIRY, [
      [ BiomeId.JUNGLE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.TAPU_BULU, PokemonType.GRASS, PokemonType.FAIRY, [
      [ BiomeId.DESERT, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.DESERT, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.TAPU_FINI, PokemonType.WATER, PokemonType.FAIRY, [
      [ BiomeId.GHOST_SHIP, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.COSMOG, PokemonType.PSYCHIC, -1, [
      [ BiomeId.SPACE, BiomePoolTier.ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.COSMOEM, PokemonType.PSYCHIC, -1, [
      [ BiomeId.SPACE, BiomePoolTier.ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.SOLGALEO, PokemonType.PSYCHIC, PokemonType.STEEL, [
      [ BiomeId.SPACE, BiomePoolTier.BOSS_ULTRA_RARE, TimeOfDay.DAY ]
    ]
    ],
    [ SpeciesId.LUNALA, PokemonType.PSYCHIC, PokemonType.GHOST, [
      [ BiomeId.SPACE, BiomePoolTier.BOSS_ULTRA_RARE, TimeOfDay.NIGHT ]
    ]
    ],
    [ SpeciesId.NIHILEGO, PokemonType.ROCK, PokemonType.POISON, [
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.BUZZWOLE, PokemonType.BUG, PokemonType.FIGHTING, [
      [ BiomeId.LOG_CAVE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.PHEROMOSA, PokemonType.BUG, PokemonType.FIGHTING, [
      [ BiomeId.DESERT, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.DESERT, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.XURKITREE, PokemonType.ELECTRIC, -1, [
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.CELESTEELA, PokemonType.STEEL, PokemonType.FLYING, [
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.KARTANA, PokemonType.GRASS, PokemonType.STEEL, [
      [ BiomeId.FOREST, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.GUZZLORD, PokemonType.DARK, PokemonType.DRAGON, [
      [ BiomeId.SLUM, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.SLUM, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.NECROZMA, PokemonType.PSYCHIC, -1, [
      [ BiomeId.SPACE, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.MAGEARNA, PokemonType.STEEL, PokemonType.FAIRY, [
      [ BiomeId.FACTORY, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.FACTORY, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.MARSHADOW, PokemonType.FIGHTING, PokemonType.GHOST, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.POIPOLE, PokemonType.POISON, -1, [
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.NAGANADEL, PokemonType.POISON, PokemonType.DRAGON, [
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.STAKATAKA, PokemonType.ROCK, PokemonType.STEEL, [
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.BLACEPHALON, PokemonType.FIRE, PokemonType.GHOST, [
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.ZERAORA, PokemonType.ELECTRIC, -1, [
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.MELTAN, PokemonType.STEEL, -1, [ 
      [ BiomeId.FACTORY, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.MELMETAL, PokemonType.STEEL, -1, [ 
      [ BiomeId.FACTORY, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.GROOKEY, PokemonType.GRASS, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.THWACKEY, PokemonType.GRASS, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.RILLABOOM, PokemonType.GRASS, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SCORBUNNY, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.RABOOT, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.CINDERACE, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SOBBLE, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.DRIZZILE, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.INTELEON, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.RARE ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SKWOVET, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.GREEDENT, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.ROOKIDEE, PokemonType.FLYING, -1, [
      [ BiomeId.TOWN, BiomePoolTier.RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.CORVISQUIRE, PokemonType.FLYING, -1, [
      [ BiomeId.TOWN, BiomePoolTier.RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.CORVIKNIGHT, PokemonType.FLYING, PokemonType.STEEL, [
      [ BiomeId.TOWN, BiomePoolTier.RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BLIPBUG, PokemonType.BUG, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DOTTLER, PokemonType.BUG, PokemonType.PSYCHIC, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ORBEETLE, PokemonType.BUG, PokemonType.PSYCHIC, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.NICKIT, PokemonType.DARK, -1, [
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.THIEVUL, PokemonType.DARK, -1, [
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.GOSSIFLEUR, PokemonType.GRASS, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ELDEGOSS, PokemonType.GRASS, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.WOOLOO, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DUBWOOL, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CHEWTLE, PokemonType.WATER, -1, [
      [ BiomeId.LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DREDNAW, PokemonType.WATER, PokemonType.ROCK, [
      [ BiomeId.LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.RIVER, BiomePoolTier.COMMON ],
      [ BiomeId.LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.YAMPER, PokemonType.ELECTRIC, -1, [
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.BOLTUND, PokemonType.ELECTRIC, -1, [
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ROLYCOLY, PokemonType.ROCK, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.CARKOL, PokemonType.ROCK, PokemonType.FIRE, [
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.COALOSSAL, PokemonType.ROCK, PokemonType.FIRE, [
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.APPLIN, PokemonType.GRASS, PokemonType.DRAGON, [
      [ BiomeId.MEADOW, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.FLAPPLE, PokemonType.GRASS, PokemonType.DRAGON, [
      [ BiomeId.MEADOW, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.APPLETUN, PokemonType.GRASS, PokemonType.DRAGON, [
      [ BiomeId.MEADOW, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SILICOBRA, PokemonType.GROUND, -1, [
      [ BiomeId.DESERT, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.SANDACONDA, PokemonType.GROUND, -1, [
      [ BiomeId.DESERT, BiomePoolTier.COMMON ],
      [ BiomeId.DESERT, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CRAMORANT, PokemonType.FLYING, PokemonType.WATER, [
      [ BiomeId.SEA, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SEA, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.ARROKUDA, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.BARRASKEWDA, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.COMMON ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TOXEL, PokemonType.ELECTRIC, PokemonType.POISON, [ 
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.TOXTRICITY, PokemonType.ELECTRIC, PokemonType.POISON, [
      [ BiomeId.SLUM, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SLUM, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SIZZLIPEDE, PokemonType.FIRE, PokemonType.BUG, [
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.CENTISKORCH, PokemonType.FIRE, PokemonType.BUG, [
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.COMMON ],
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS ],
      [ BiomeId.SEWER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CANYON, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CLOBBOPUS, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.COMMON ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GRAPPLOCT, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.COMMON ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SINISTEA, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.POLTEAGEIST, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.HATENNA, PokemonType.PSYCHIC, -1, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.HATTREM, PokemonType.PSYCHIC, -1, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.HATTERENE, PokemonType.PSYCHIC, PokemonType.FAIRY, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.IMPIDIMP, PokemonType.DARK, PokemonType.FAIRY, [
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.MORGREM, PokemonType.DARK, PokemonType.FAIRY, [
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.GRIMMSNARL, PokemonType.DARK, PokemonType.FAIRY, [
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.OBSTAGOON, PokemonType.DARK, PokemonType.NORMAL, [
      [ BiomeId.SLUM, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SLUM, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PERRSERKER, PokemonType.STEEL, -1, [
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.RARE, TimeOfDay.DUSK ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.BOSS_RARE, TimeOfDay.DUSK ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.CURSOLA, PokemonType.GHOST, -1, [
      [ BiomeId.SEABED, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SIRFETCHD, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MR_RIME, PokemonType.ICE, PokemonType.PSYCHIC, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.RUNERIGUS, PokemonType.GROUND, PokemonType.GHOST, [
      [ BiomeId.RUINS, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.RUINS, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MILCERY, PokemonType.FAIRY, -1, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ALCREMIE, PokemonType.FAIRY, -1, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.FALINKS, PokemonType.FIGHTING, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PINCURCHIN, PokemonType.ELECTRIC, -1, [
      [ BiomeId.SEABED, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SNOM, PokemonType.ICE, PokemonType.BUG, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.FROSMOTH, PokemonType.ICE, PokemonType.BUG, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.STONJOURNER, PokemonType.ROCK, -1, [
      [ BiomeId.RUINS, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.EISCUE, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.INDEEDEE, PokemonType.PSYCHIC, PokemonType.NORMAL, [
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.MORPEKO, PokemonType.ELECTRIC, PokemonType.DARK, [
      [ BiomeId.METROPOLIS, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]]
    ]
    ],
    [ SpeciesId.CUFANT, PokemonType.STEEL, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.COPPERAJAH, PokemonType.STEEL, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DRACOZOLT, PokemonType.ELECTRIC, PokemonType.DRAGON, [
      [ BiomeId.WASTELAND, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.ARCTOZOLT, PokemonType.ELECTRIC, PokemonType.ICE, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.DRACOVISH, PokemonType.WATER, PokemonType.DRAGON, [
      [ BiomeId.WASTELAND, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.ARCTOVISH, PokemonType.WATER, PokemonType.ICE, [
      [ BiomeId.SEABED, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.DURALUDON, PokemonType.STEEL, PokemonType.DRAGON, [
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.DREEPY, PokemonType.DRAGON, PokemonType.GHOST, [
      [ BiomeId.WASTELAND, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.DRAKLOAK, PokemonType.DRAGON, PokemonType.GHOST, [
      [ BiomeId.WASTELAND, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.DRAGAPULT, PokemonType.DRAGON, PokemonType.GHOST, [
      [ BiomeId.WASTELAND, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.ZACIAN, PokemonType.FAIRY, -1, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.ZAMAZENTA, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.ETERNATUS, PokemonType.POISON, PokemonType.DRAGON, [
      [ BiomeId.END, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.KUBFU, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.URSHIFU, PokemonType.FIGHTING, PokemonType.DARK, [
      [ BiomeId.DOJO, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.ZARUDE, PokemonType.DARK, PokemonType.GRASS, [
      [ BiomeId.JUNGLE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.REGIELEKI, PokemonType.ELECTRIC, -1, [
      [ BiomeId.SPARK_CAVE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.REGIDRAGO, PokemonType.DRAGON, -1, [
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.GLASTRIER, PokemonType.ICE, -1, [
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.SPECTRIER, PokemonType.GHOST, -1, [
      [ BiomeId.BLACK_FIELD, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.CALYREX, PokemonType.PSYCHIC, PokemonType.GRASS, [
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.WYRDEER, PokemonType.NORMAL, PokemonType.PSYCHIC, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.KLEAVOR, PokemonType.BUG, PokemonType.ROCK, [
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.URSALUNA, PokemonType.GROUND, PokemonType.NORMAL, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.BASCULEGION, PokemonType.WATER, PokemonType.GHOST, [
      [ BiomeId.SEABED, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.RIVER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RIVER, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.RARE ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.SNEASLER, PokemonType.FIGHTING, PokemonType.POISON, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.OVERQWIL, PokemonType.DARK, PokemonType.POISON, [
      [ BiomeId.SEABED, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.ENAMORUS, PokemonType.FAIRY, PokemonType.FLYING, [
      [ BiomeId.CASTLE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.SPRIGATITO, PokemonType.GRASS, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.FLORAGATO, PokemonType.GRASS, -1, [
      [ BiomeId.MEADOW, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.MEOWSCARADA, PokemonType.GRASS, PokemonType.DARK, [
      [ BiomeId.MEADOW, BiomePoolTier.RARE ],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.FUECOCO, PokemonType.FIRE, -1, [
      [ BiomeId.LAVA_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.CROCALOR, PokemonType.FIRE, -1, [
      [ BiomeId.LAVA_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.SKELEDIRGE, PokemonType.FIRE, PokemonType.GHOST, [
      [ BiomeId.LAVA_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.QUAXLY, PokemonType.WATER, -1, [
      [ BiomeId.BEACH, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.QUAXWELL, PokemonType.WATER, -1, [
      [ BiomeId.BEACH, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.QUAQUAVAL, PokemonType.WATER, PokemonType.FIGHTING, [
      [ BiomeId.BEACH, BiomePoolTier.RARE ],
      [ BiomeId.BEACH, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.LECHONK, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.OINKOLOGNE, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TAROUNTULA, PokemonType.BUG, -1, [
      [ BiomeId.FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.SPIDOPS, PokemonType.BUG, -1, [
      [ BiomeId.FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.NYMBLE, PokemonType.BUG, -1, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON ],
      [ BiomeId.FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.LOKIX, PokemonType.BUG, PokemonType.DARK, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.COMMON ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS ],
      [ BiomeId.FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PAWMI, PokemonType.ELECTRIC, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.PAWMO, PokemonType.ELECTRIC, PokemonType.FIGHTING, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.PAWMOT, PokemonType.ELECTRIC, PokemonType.FIGHTING, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.LIGHTNING_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TANDEMAUS, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.METROPOLIS, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.MAUSHOLD, PokemonType.NORMAL, -1, [
      [ BiomeId.TOWN, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.METROPOLIS, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.FIDOUGH, PokemonType.FAIRY, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DACHSBUN, PokemonType.FAIRY, -1, [
      [ BiomeId.TOWN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.COMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SMOLIV, PokemonType.GRASS, PokemonType.NORMAL, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DOLLIV, PokemonType.GRASS, PokemonType.NORMAL, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ARBOLIVA, PokemonType.GRASS, PokemonType.NORMAL, [
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SQUAWKABILLY, PokemonType.NORMAL, PokemonType.FLYING, [
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.NACLI, PokemonType.ROCK, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.NACLSTACK, PokemonType.ROCK, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.GARGANACL, PokemonType.ROCK, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CHARCADET, PokemonType.FIRE, -1, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.ARMAROUGE, PokemonType.FIRE, PokemonType.PSYCHIC, [
      [ BiomeId.VOLCANO, BiomePoolTier.RARE ],
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.CERULEDGE, PokemonType.FIRE, PokemonType.GHOST, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.RARE ],
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.TADBULB, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.BELLIBOLT, PokemonType.ELECTRIC, -1, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.WATTREL, PokemonType.ELECTRIC, PokemonType.FLYING, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.KILOWATTREL, PokemonType.ELECTRIC, PokemonType.FLYING, [
      [ BiomeId.SEA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEA, BiomePoolTier.BOSS ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.MASCHIFF, PokemonType.DARK, -1, [
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.MABOSSTIFF, PokemonType.DARK, -1, [
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.SHROODLE, PokemonType.POISON, PokemonType.NORMAL, [
      [ BiomeId.FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GRAFAIAI, PokemonType.POISON, PokemonType.NORMAL, [
      [ BiomeId.FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BRAMBLIN, PokemonType.GRASS, PokemonType.GHOST, [
      [ BiomeId.DESERT, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.BRAMBLEGHAST, PokemonType.GRASS, PokemonType.GHOST, [
      [ BiomeId.DESERT, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERT, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TOEDSCOOL, PokemonType.GROUND, PokemonType.GRASS, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.TOEDSCRUEL, PokemonType.GROUND, PokemonType.GRASS, [
      [ BiomeId.FOREST, BiomePoolTier.RARE ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.KLAWF, PokemonType.ROCK, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ], 
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CAPSAKID, PokemonType.GRASS, -1, [
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.SCOVILLAIN, PokemonType.GRASS, PokemonType.FIRE, [
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLAZE_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CANYON, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.RELLOR, PokemonType.BUG, -1, [
      [ BiomeId.DESERT, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.RABSCA, PokemonType.BUG, PokemonType.PSYCHIC, [
      [ BiomeId.DESERT, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.DESERT, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SAND_CAVE, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.FLITTLE, PokemonType.PSYCHIC, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.ESPATHRA, PokemonType.PSYCHIC, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.TINKATINK, PokemonType.FAIRY, PokemonType.STEEL, [
      [ BiomeId.RUINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.TINKATUFF, PokemonType.FAIRY, PokemonType.STEEL, [
      [ BiomeId.RUINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.TINKATON, PokemonType.FAIRY, PokemonType.STEEL, [
      [ BiomeId.RUINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.WIGLETT, PokemonType.WATER, -1, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.WUGTRIO, PokemonType.WATER, -1, [
      [ BiomeId.BEACH, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.BOMBIRDIER, PokemonType.FLYING, PokemonType.DARK, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.FINIZEN, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.PALAFIN, PokemonType.WATER, -1, [
      [ BiomeId.SEA, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SEA, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.VAROOM, PokemonType.STEEL, PokemonType.POISON, [
      [ BiomeId.METROPOLIS, BiomePoolTier.RARE ],
      [ BiomeId.SLUM, BiomePoolTier.RARE ],
      [ BiomeId.SEWER, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.REVAVROOM, PokemonType.STEEL, PokemonType.POISON, [
      [ BiomeId.METROPOLIS, BiomePoolTier.RARE ],
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SLUM, BiomePoolTier.RARE ],
      [ BiomeId.SEWER, BiomePoolTier.RARE ],
      [ BiomeId.SEWER, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SLUM, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CYCLIZAR, PokemonType.DRAGON, PokemonType.NORMAL, [
      [ BiomeId.WASTELAND, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ORTHWORM, PokemonType.STEEL, -1, [
      [ BiomeId.DESERT, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.GLIMMET, PokemonType.ROCK, PokemonType.POISON, [
      [ BiomeId.CAVE, BiomePoolTier.RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.GLIMMORA, PokemonType.ROCK, PokemonType.POISON, [
      [ BiomeId.CAVE, BiomePoolTier.RARE ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.POLLUTED_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.GREAVARD, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.HOUNDSTONE, PokemonType.GHOST, -1, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.COMMON ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.FLAMIGO, PokemonType.FLYING, PokemonType.FIGHTING, [
      [ BiomeId.LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.RARE ],
      [ BiomeId.SKY, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CETODDLE, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.CETITAN, PokemonType.ICE, -1, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.VELUZA, PokemonType.WATER, PokemonType.PSYCHIC, [
      [ BiomeId.SEABED, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.DONDOZO, PokemonType.WATER, -1, [
      [ BiomeId.SEABED, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SEABED, BiomePoolTier.BOSS ],
      [ BiomeId.RIVER, BiomePoolTier.RARE ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.RARE ],
      [ BiomeId.GHOST_SHIP, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.TATSUGIRI, PokemonType.DRAGON, PokemonType.WATER, [
      [ BiomeId.BEACH, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ANNIHILAPE, PokemonType.FIGHTING, PokemonType.GHOST, [
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.DOJO, BiomePoolTier.COMMON ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.SPA, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SPA, BiomePoolTier.BOSS ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.CLODSIRE, PokemonType.POISON, PokemonType.GROUND, [
      [ BiomeId.SWAMP, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.FARIGIRAF, PokemonType.NORMAL, PokemonType.PSYCHIC, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.RARE ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.DUDUNSPARCE, PokemonType.NORMAL, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.KINGAMBIT, PokemonType.DARK, PokemonType.STEEL, [
      [ BiomeId.ABYSS, BiomePoolTier.COMMON ],
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],  
      [ BiomeId.CANYON, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.GREAT_TUSK, PokemonType.GROUND, PokemonType.FIGHTING, [
      [ BiomeId.END, BiomePoolTier.COMMON ],
      [ BiomeId.DESERT, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.SCREAM_TAIL, PokemonType.FAIRY, PokemonType.PSYCHIC, [
      [ BiomeId.END, BiomePoolTier.COMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.BRUTE_BONNET, PokemonType.GRASS, PokemonType.DARK, [
      [ BiomeId.END, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.FLUTTER_MANE, PokemonType.GHOST, PokemonType.FAIRY, [
      [ BiomeId.END, BiomePoolTier.COMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.SLITHER_WING, PokemonType.BUG, PokemonType.FIGHTING, [
      [ BiomeId.END, BiomePoolTier.COMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.SANDY_SHOCKS, PokemonType.ELECTRIC, PokemonType.GROUND, [
      [ BiomeId.END, BiomePoolTier.COMMON ],  
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.BOSS_ULTRA_RARE ] 
    ]
    ],
    [ SpeciesId.IRON_TREADS, PokemonType.GROUND, PokemonType.STEEL, [
      [ BiomeId.END, BiomePoolTier.COMMON ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.IRON_BUNDLE, PokemonType.ICE, PokemonType.WATER, [
      [ BiomeId.END, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.IRON_HANDS, PokemonType.FIGHTING, PokemonType.ELECTRIC, [
      [ BiomeId.END, BiomePoolTier.COMMON ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.IRON_JUGULIS, PokemonType.DARK, PokemonType.FLYING, [
      [ BiomeId.END, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.IRON_MOTH, PokemonType.FIRE, PokemonType.POISON, [
      [ BiomeId.END, BiomePoolTier.COMMON ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.IRON_THORNS, PokemonType.ROCK, PokemonType.ELECTRIC, [
      [ BiomeId.END, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.FRIGIBAX, PokemonType.DRAGON, PokemonType.ICE, [
      [ BiomeId.WASTELAND, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.ARCTIBAX, PokemonType.DRAGON, PokemonType.ICE, [
      [ BiomeId.WASTELAND, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.BAXCALIBUR, PokemonType.DRAGON, PokemonType.ICE, [
      [ BiomeId.WASTELAND, BiomePoolTier.RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.GIMMIGHOUL, PokemonType.GHOST, -1, [
      [ BiomeId.TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.GHOLDENGO, PokemonType.STEEL, PokemonType.GHOST, [
      [ BiomeId.TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.WO_CHIEN, PokemonType.DARK, PokemonType.GRASS, [
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.CHIEN_PAO, PokemonType.DARK, PokemonType.ICE, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.TING_LU, PokemonType.DARK, PokemonType.GROUND, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.CHI_YU, PokemonType.DARK, PokemonType.FIRE, [
      [ BiomeId.LAVA_LAKE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.LAVA_LAKE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.ROARING_MOON, PokemonType.DRAGON, PokemonType.DARK, [
      [ BiomeId.END, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.IRON_VALIANT, PokemonType.FAIRY, PokemonType.FIGHTING, [
      [ BiomeId.END, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.KORAIDON, PokemonType.FIGHTING, PokemonType.DRAGON, [
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.MIRAIDON, PokemonType.ELECTRIC, PokemonType.DRAGON, [
      [ BiomeId.LABORATORY, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.WALKING_WAKE, PokemonType.WATER, PokemonType.DRAGON, [
      [ BiomeId.END, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.IRON_LEAVES, PokemonType.GRASS, PokemonType.PSYCHIC, [
      [ BiomeId.END, BiomePoolTier.RARE ],
      [ BiomeId.GRASS, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.DIPPLIN, PokemonType.GRASS, PokemonType.DRAGON, [
      [ BiomeId.MEADOW, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.POLTCHAGEIST, PokemonType.GRASS, PokemonType.GHOST, [
      [ BiomeId.BADLANDS, BiomePoolTier.RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.SINISTCHA, PokemonType.GRASS, PokemonType.GHOST, [
      [ BiomeId.BADLANDS, BiomePoolTier.RARE ],
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPA, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPA, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.OKIDOGI, PokemonType.POISON, PokemonType.FIGHTING, [
      [ BiomeId.BADLANDS, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.MUNKIDORI, PokemonType.POISON, PokemonType.PSYCHIC, [
      [ BiomeId.JUNGLE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.FEZANDIPITI, PokemonType.POISON, PokemonType.FAIRY, [
      [ BiomeId.RUINS, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.RUINS, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.OGERPON, PokemonType.GRASS, -1, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.ARCHALUDON, PokemonType.STEEL, PokemonType.DRAGON, [
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SAND_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.HYDRAPPLE, PokemonType.GRASS, PokemonType.DRAGON, [
      [ BiomeId.MEADOW, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GREEN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.GOUGING_FIRE, PokemonType.FIRE, PokemonType.DRAGON, [
      [ BiomeId.END, BiomePoolTier.RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.INFERNO_FOREST, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.RAGING_BOLT, PokemonType.ELECTRIC, PokemonType.DRAGON, [
      [ BiomeId.END, BiomePoolTier.RARE ],
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.IRON_BOULDER, PokemonType.ROCK, PokemonType.PSYCHIC, [
      [ BiomeId.END, BiomePoolTier.RARE ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.IRON_CROWN, PokemonType.STEEL, PokemonType.PSYCHIC, [
      [ BiomeId.END, BiomePoolTier.RARE ],
      [ BiomeId.CAVE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.TERAPAGOS, PokemonType.NORMAL, -1, [
      [ BiomeId.CAVE, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.PECHARUNT, PokemonType.POISON, PokemonType.GHOST, [ 
      [ BiomeId.SWAMP, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ SpeciesId.ALOLA_RATTATA, PokemonType.DARK, PokemonType.NORMAL, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ALOLA_RATICATE, PokemonType.DARK, PokemonType.NORMAL, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ALOLA_RAICHU, PokemonType.ELECTRIC, PokemonType.PSYCHIC, [
      [ BiomeId.ISLAND, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]]
    ]
    ],
    [ SpeciesId.ALOLA_SANDSHREW, PokemonType.ICE, PokemonType.STEEL, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.ALOLA_SANDSLASH, PokemonType.ICE, PokemonType.STEEL, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ALOLA_VULPIX, PokemonType.ICE, -1, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.ALOLA_NINETALES, PokemonType.ICE, PokemonType.FAIRY, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.COMMON ],
      [ BiomeId.GLACIER, BiomePoolTier.BOSS ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ALOLA_DIGLETT, PokemonType.GROUND, PokemonType.STEEL, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.ALOLA_DUGTRIO, PokemonType.GROUND, PokemonType.STEEL, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.COMMON ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.BOSS ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ALOLA_MEOWTH, PokemonType.DARK, -1, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ALOLA_PERSIAN, PokemonType.DARK, -1, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ALOLA_GEODUDE, PokemonType.ROCK, PokemonType.ELECTRIC, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ALOLA_GRAVELER, PokemonType.ROCK, PokemonType.ELECTRIC, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.ALOLA_GOLEM, PokemonType.ROCK, PokemonType.ELECTRIC, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.THUNDER_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ALOLA_GRIMER, PokemonType.POISON, PokemonType.DARK, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.ALOLA_MUK, PokemonType.POISON, PokemonType.DARK, [
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ALOLA_EXEGGUTOR, PokemonType.GRASS, PokemonType.DRAGON, [
      [ BiomeId.ISLAND, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ALOLA_MAROWAK, PokemonType.FIRE, PokemonType.GHOST, [
      [ BiomeId.ISLAND, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.ISLAND, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.ETERNAL_FLOETTE, PokemonType.FAIRY, -1, [
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.GALAR_MEOWTH, PokemonType.STEEL, -1, [
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.RARE, TimeOfDay.DUSK ],
      [ BiomeId.SHARP_FIELD, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.GALAR_PONYTA, PokemonType.PSYCHIC, -1, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE, TimeOfDay.DAWN ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.GALAR_RAPIDASH, PokemonType.PSYCHIC, PokemonType.FAIRY, [
      [ BiomeId.JUNGLE, BiomePoolTier.RARE, TimeOfDay.DAWN ],
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS_RARE, TimeOfDay.DAWN ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.GALAR_SLOWPOKE, PokemonType.PSYCHIC, -1, [
      [ BiomeId.SWAMP, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]], 
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.GALAR_SLOWBRO, PokemonType.POISON, PokemonType.PSYCHIC, [
      [ BiomeId.SWAMP, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.GALAR_FARFETCHD, PokemonType.FIGHTING, -1, [
      [ BiomeId.DOJO, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.GALAR_WEEZING, PokemonType.POISON, PokemonType.FAIRY, [
      [ BiomeId.SLUM, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.COMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.GALAR_MR_MIME, PokemonType.ICE, PokemonType.PSYCHIC, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.AMUSEMENT_PARK, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CASTLE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.STAR_MOUNTAIN, BiomePoolTier.BOSS ],
      [ BiomeId.GLACIER, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.GALAR_ARTICUNO, PokemonType.PSYCHIC, PokemonType.FLYING, [
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.GALAR_ZAPDOS, PokemonType.FIGHTING, PokemonType.FLYING, [
      [ BiomeId.DOJO, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.DOJO, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.GALAR_MOLTRES, PokemonType.DARK, PokemonType.FLYING, [
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.ULTRA_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ SpeciesId.GALAR_SLOWKING, PokemonType.POISON, PokemonType.PSYCHIC, [
      [ BiomeId.SWAMP, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.GALAR_CORSOLA, PokemonType.GHOST, -1, [
      [ BiomeId.SEABED, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.GALAR_ZIGZAGOON, PokemonType.DARK, PokemonType.NORMAL, [
      [ BiomeId.SLUM, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GALAR_LINOONE, PokemonType.DARK, PokemonType.NORMAL, [
      [ BiomeId.SLUM, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.GALAR_DARUMAKA, PokemonType.ICE, -1, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.GALAR_DARMANITAN, PokemonType.ICE, -1, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.GALAR_YAMASK, PokemonType.GROUND, PokemonType.GHOST, [
      [ BiomeId.RUINS, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.GALAR_STUNFISK, PokemonType.GROUND, PokemonType.STEEL, [
      [ BiomeId.SWAMP, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SPARK_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.HISUI_GROWLITHE, PokemonType.FIRE, PokemonType.ROCK, [
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.HISUI_ARCANINE, PokemonType.FIRE, PokemonType.ROCK, [
      [ BiomeId.MAGMA_CAVERN, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.HISUI_VOLTORB, PokemonType.ELECTRIC, PokemonType.GRASS, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.HISUI_ELECTRODE, PokemonType.ELECTRIC, PokemonType.GRASS, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.HISUI_TYPHLOSION, PokemonType.FIRE, PokemonType.GHOST, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.HISUI_QWILFISH, PokemonType.DARK, PokemonType.POISON, [
      [ BiomeId.SEABED, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.HISUI_SNEASEL, PokemonType.FIGHTING, PokemonType.POISON, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CANYON, BiomePoolTier.UNCOMMON ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ SpeciesId.HISUI_SAMUROTT, PokemonType.WATER, PokemonType.DARK, [
      [ BiomeId.ABYSS, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.HISUI_LILLIGANT, PokemonType.GRASS, PokemonType.FIGHTING, [
      [ BiomeId.MEADOW, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.HISUI_ZORUA, PokemonType.NORMAL, PokemonType.GHOST, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.RARE ]
    ]
    ],
    [ SpeciesId.HISUI_ZOROARK, PokemonType.NORMAL, PokemonType.GHOST, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.ABANDONED_CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.BLACK_FIELD, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DARK_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.RARE ],
      [ BiomeId.DESERTED_HOUSE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.RARE ],
      [ BiomeId.FAIRY_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.HISUI_BRAVIARY, PokemonType.PSYCHIC, PokemonType.FLYING, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.CASTLE, BiomePoolTier.RARE ],
      [ BiomeId.CASTLE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.SKY, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SKY, BiomePoolTier.BOSS ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.WYVERN_MOUNTAIN, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.CANYON, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.VORTEX_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.HISUI_SLIGGOO, PokemonType.STEEL, PokemonType.DRAGON, [
      [ BiomeId.SWAMP, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ SpeciesId.HISUI_GOODRA, PokemonType.STEEL, PokemonType.DRAGON, [
      [ BiomeId.SWAMP, BiomePoolTier.SUPER_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.SWAMP, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.LOG_CAVE, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.LOG_CAVE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_TEMPLE, BiomePoolTier.BOSS ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.MUSHROOM_FOREST, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.DRAKE_LAKE, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.DRAGON_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.HISUI_AVALUGG, PokemonType.ICE, PokemonType.ROCK, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOWY_FIELD, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.SNOW_MOUNTAIN, BiomePoolTier.SUPER_RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.RARE ],
      [ BiomeId.GLACIER_LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.HISUI_DECIDUEYE, PokemonType.GRASS, PokemonType.FIGHTING, [
      [ BiomeId.DOJO, BiomePoolTier.BOSS_RARE ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ SpeciesId.PALDEA_TAUROS, PokemonType.FIGHTING, -1, [
      [ BiomeId.PLAINS, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.PLAINS, BiomePoolTier.BOSS_RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ]],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.BAMBOO_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ SpeciesId.PALDEA_WOOPER, PokemonType.POISON, PokemonType.GROUND, [
      [ BiomeId.SWAMP, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ]],
      [ BiomeId.POLLUTED_RIVER, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ SpeciesId.BLOODMOON_URSALUNA, PokemonType.GROUND, PokemonType.NORMAL, [
      [ BiomeId.FOREST, BiomePoolTier.SUPER_RARE, TimeOfDay.NIGHT ],
      [ BiomeId.FOREST, BiomePoolTier.BOSS_RARE, TimeOfDay.NIGHT ]
    ]
    ]
  ];
  
  const trainerBiomes = [
    [ TrainerType.ACE_TRAINER, [
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GRASS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.SWAMP, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BEACH, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAKE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BADLANDS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RUINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.ABYSS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.TEMPLE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.ARTIST, [
      [ BiomeId.METROPOLIS, BiomePoolTier.RARE ]
    ]
    ],
    [ TrainerType.BACKERS, []],
    [ TrainerType.BACKPACKER, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON ],
      [ BiomeId.DESERT, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.BAKER, [
      [ BiomeId.SLUM, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.BEAUTY, [
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.BIKER, [
      [ BiomeId.SLUM, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.BLACK_BELT, [
      [ BiomeId.DOJO, BiomePoolTier.COMMON ],
      [ BiomeId.PLAINS, BiomePoolTier.RARE ],
      [ BiomeId.GRASS, BiomePoolTier.RARE ],
      [ BiomeId.SWAMP, BiomePoolTier.RARE ],
      [ BiomeId.BEACH, BiomePoolTier.RARE ],
      [ BiomeId.LAKE, BiomePoolTier.RARE ],
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CAVE, BiomePoolTier.UNCOMMON ],
      [ BiomeId.RUINS, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.BREEDER, [
      [ BiomeId.PLAINS, BiomePoolTier.COMMON ],
      [ BiomeId.GRASS, BiomePoolTier.COMMON ],
      [ BiomeId.TALL_GRASS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.BEACH, BiomePoolTier.UNCOMMON ],
      [ BiomeId.LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.CLERK, [
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.CYCLIST, [
      [ BiomeId.PLAINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.DANCER, []],
    [ TrainerType.DEPOT_AGENT, [
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.DOCTOR, []],
    [ TrainerType.FIREBREATHER, [
      [ BiomeId.VOLCANO, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.FISHERMAN, [
      [ BiomeId.LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.BEACH, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.GUITARIST, [
      [ BiomeId.METROPOLIS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.HARLEQUIN, []],
    [ TrainerType.HIKER, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.COMMON ],
      [ BiomeId.CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.BADLANDS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.HOOLIGANS, [
      [ BiomeId.SLUM, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.HOOPSTER, []],
    [ TrainerType.INFIELDER, []],
    [ TrainerType.JANITOR, []],
    [ TrainerType.LINEBACKER, []],
    [ TrainerType.MAID, []],
    [ TrainerType.MUSICIAN, [
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.HEX_MANIAC, [
      [ BiomeId.RUINS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.GRAVEYARD, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.NURSERY_AIDE, []],
    [ TrainerType.OFFICER, [
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.COMMON ],
      [ BiomeId.SLUM, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.PARASOL_LADY, [
      [ BiomeId.SWAMP, BiomePoolTier.COMMON ],
      [ BiomeId.LAKE, BiomePoolTier.COMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.PILOT, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.POKEFAN, [
      [ BiomeId.GRASS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.MEADOW, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.PRESCHOOLER, []],
    [ TrainerType.PSYCHIC, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.COMMON ],
      [ BiomeId.RUINS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.RANGER, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.UNCOMMON ],
      [ BiomeId.FOREST, BiomePoolTier.COMMON ],
      [ BiomeId.JUNGLE, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.RICH, [
      [ BiomeId.ISLAND, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.RICH_KID, [
      [ BiomeId.METROPOLIS, BiomePoolTier.RARE ],
      [ BiomeId.ISLAND, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.ROUGHNECK, [
      [ BiomeId.SLUM, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.SAILOR, [
      [ BiomeId.SEA, BiomePoolTier.COMMON ],
      [ BiomeId.BEACH, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.SCIENTIST, [
      [ BiomeId.DESERT, BiomePoolTier.COMMON ],
      [ BiomeId.RUINS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.SMASHER, []],
    [ TrainerType.SNOW_WORKER, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.COMMON ],
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.STRIKER, []],
    [ TrainerType.SCHOOL_KID, [
      [ BiomeId.GRASS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.SWIMMER, [
      [ BiomeId.SEA, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.TWINS, [
      [ BiomeId.PLAINS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.VETERAN, [
      [ BiomeId.WASTELAND, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.WAITER, [
      [ BiomeId.METROPOLIS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.WORKER, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.COMMON ],
      [ BiomeId.FACTORY, BiomePoolTier.COMMON ],
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.YOUNGSTER, [
      [ BiomeId.TOWN, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.BROCK, [
      [ BiomeId.CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.MISTY, [
      [ BiomeId.BEACH, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.LT_SURGE, [
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.ERIKA, [
      [ BiomeId.GRASS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.JANINE, [
      [ BiomeId.SWAMP, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.SABRINA, [
      [ BiomeId.RUINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.GIOVANNI, [
      [ BiomeId.LABORATORY, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.BLAINE, [
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.FALKNER, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.BUGSY, [
      [ BiomeId.FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.WHITNEY, [
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.MORTY, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.CHUCK, [
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.JASMINE, [
      [ BiomeId.FACTORY, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.PRYCE, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.CLAIR, [
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.ROXANNE, [
      [ BiomeId.CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.BRAWLY, [
      [ BiomeId.DOJO, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.WATTSON, [
      [ BiomeId.CONSTRUCTION_SITE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.FLANNERY, [
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.NORMAN, [
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.WINONA, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.TATE, [
      [ BiomeId.RUINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.LIZA, [
      [ BiomeId.RUINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.JUAN, [
      [ BiomeId.SEABED, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.ROARK, [
      [ BiomeId.CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.GARDENIA, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.CRASHER_WAKE, [
      [ BiomeId.LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.MAYLENE, [
      [ BiomeId.DOJO, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.FANTINA, [
      [ BiomeId.TEMPLE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.BYRON, [
      [ BiomeId.FACTORY, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.CANDICE, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.VOLKNER, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.CILAN, [
      [ BiomeId.PLAINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.CHILI, [
      [ BiomeId.PLAINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.CRESS, [
      [ BiomeId.PLAINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.CHEREN, [
      [ BiomeId.PLAINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.LENORA, [
      [ BiomeId.MEADOW, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.ROXIE, [
      [ BiomeId.SWAMP, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.BURGH, [
      [ BiomeId.FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.ELESA, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.CLAY, [
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.SKYLA, [
      [ BiomeId.MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.BRYCEN, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.DRAYDEN, [
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.MARLON, [
      [ BiomeId.SEA, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.VIOLA, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.GRANT, [
      [ BiomeId.BADLANDS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.KORRINA, [
      [ BiomeId.DOJO, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.RAMOS, [
      [ BiomeId.JUNGLE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.CLEMONT, [
      [ BiomeId.POWER_PLANT, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.VALERIE, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.OLYMPIA, [
      [ BiomeId.SPACE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.WULFRIC, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.MILO, [
      [ BiomeId.MEADOW, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.NESSA, [
      [ BiomeId.ISLAND, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.KABU, [
      [ BiomeId.VOLCANO, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.BEA, [
      [ BiomeId.DOJO, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.ALLISTER, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.OPAL, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.BEDE, [
      [ BiomeId.FAIRY_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.GORDIE, [
      [ BiomeId.DESERT, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.MELONY, [
      [ BiomeId.SNOWY_FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.PIERS, [
      [ BiomeId.SLUM, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.MARNIE, [
      [ BiomeId.ABYSS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.RAIHAN, [
      [ BiomeId.WASTELAND, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.KATY, [
      [ BiomeId.FOREST, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.BRASSIUS, [
      [ BiomeId.TALL_GRASS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.IONO, [
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.KOFU, [
      [ BiomeId.BEACH, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.LARRY, [
      [ BiomeId.METROPOLIS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.RYME, [
      [ BiomeId.GRAVEYARD, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.TULIP, [
      [ BiomeId.RUINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.GRUSHA, [
      [ BiomeId.ICE_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.LORELEI, []],
    [ TrainerType.BRUNO, []],
    [ TrainerType.AGATHA, []],
    [ TrainerType.LANCE, []],
    [ TrainerType.WILL, []],
    [ TrainerType.KOGA, []],
    [ TrainerType.KAREN, []],
    [ TrainerType.SIDNEY, []],
    [ TrainerType.PHOEBE, []],
    [ TrainerType.GLACIA, []],
    [ TrainerType.DRAKE, []],
    [ TrainerType.AARON, []],
    [ TrainerType.BERTHA, []],
    [ TrainerType.FLINT, []],
    [ TrainerType.LUCIAN, []],
    [ TrainerType.SHAUNTAL, []],
    [ TrainerType.MARSHAL, []],
    [ TrainerType.GRIMSLEY, []],
    [ TrainerType.CAITLIN, []],
    [ TrainerType.MALVA, []],
    [ TrainerType.SIEBOLD, []],
    [ TrainerType.WIKSTROM, []],
    [ TrainerType.DRASNA, []],
    [ TrainerType.HALA, []],
    [ TrainerType.MOLAYNE, []],
    [ TrainerType.OLIVIA, []],
    [ TrainerType.ACEROLA, []],
    [ TrainerType.KAHILI, []],
    [ TrainerType.RIKA, []],
    [ TrainerType.POPPY, []],
    [ TrainerType.LARRY_ELITE, []],
    [ TrainerType.HASSEL, []],
    [ TrainerType.CRISPIN, []],
    [ TrainerType.AMARYS, []],
    [ TrainerType.LACEY, []],
    [ TrainerType.DRAYTON, []],
    [ TrainerType.BLUE, []],
    [ TrainerType.RED, []],
    [ TrainerType.LANCE_CHAMPION, []],
    [ TrainerType.STEVEN, []],
    [ TrainerType.WALLACE, []],
    [ TrainerType.CYNTHIA, []],
    [ TrainerType.ALDER, []],
    [ TrainerType.IRIS, []],
    [ TrainerType.DIANTHA, []],
    [ TrainerType.HAU, []],
    [ TrainerType.GEETA, []],
    [ TrainerType.NEMONA, []],
    [ TrainerType.KIERAN, []],
    [ TrainerType.LEON, []],
    [ TrainerType.RIVAL, []]
  ];

  biomeDepths[BiomeId.TOWN] = [ 0, 1 ];

  const traverseBiome = (biome: BiomeId, depth: number) => {
    if (biome === BiomeId.END) {
      const biomeList = getEnumValues(BiomeId)
      biomeList.pop(); // Removes BiomeId.END from the list
      const randIndex = randSeedInt(biomeList.length, 1); // Will never be BiomeId.TOWN
      biome = biomeList[randIndex];
    }
    const linkedBiomes: (BiomeId | [ BiomeId, number ])[] = Array.isArray(biomeLinks[biome])
      ? biomeLinks[biome] as (BiomeId | [ BiomeId, number ])[]
      : [ biomeLinks[biome] as BiomeId ];
    for (const linkedBiomeEntry of linkedBiomes) {
      const linkedBiome = !Array.isArray(linkedBiomeEntry)
        ? linkedBiomeEntry as BiomeId
        : linkedBiomeEntry[0];
      const biomeChance = !Array.isArray(linkedBiomeEntry)
        ? 1
        : linkedBiomeEntry[1];
      if (!biomeDepths.hasOwnProperty(linkedBiome) || biomeChance < biomeDepths[linkedBiome][1] || (depth < biomeDepths[linkedBiome][0] && biomeChance === biomeDepths[linkedBiome][1])) {
        biomeDepths[linkedBiome] = [ depth + 1, biomeChance ];
        traverseBiome(linkedBiome, depth + 1);
      }
    }
  };

  traverseBiome(BiomeId.TOWN, 0);
  biomeDepths[BiomeId.END] = [ Object.values(biomeDepths).map(d => d[0]).reduce((max: number, value: number) => Math.max(max, value), 0) + 1, 1 ];

  for (const biome of getEnumValues(BiomeId)) {
    biomePokemonPools[biome] = {};
    biomeTrainerPools[biome] = {};

    for (const tier of getEnumValues(BiomePoolTier)) {
      biomePokemonPools[biome][tier] = {};
      biomeTrainerPools[biome][tier] = [];

      for (const tod of getEnumValues(TimeOfDay)) {
        biomePokemonPools[biome][tier][tod] = [];
      }
    }
  }

  for (const pb of pokemonBiomes) {
    const speciesId = pb[0] as SpeciesId;
    const biomeEntries = pb[3] as (BiomeId | BiomePoolTier)[][];

    const speciesEvolutions: SpeciesFormEvolution[] = pokemonEvolutions.hasOwnProperty(speciesId)
      ? pokemonEvolutions[speciesId]
      : [];

    if (!biomeEntries.filter(b => b[0] !== BiomeId.END).length && !speciesEvolutions.filter(es => !!((pokemonBiomes.find(p => p[0] === es.speciesId)!)[3] as any[]).filter(b => b[0] !== BiomeId.END).length).length) { // TODO: is the bang on the `find()` correct?
      uncatchableSpecies.push(speciesId);
    }

    // array of biome options for the current species
    catchableSpecies[speciesId] = [];

    for (const b of biomeEntries) {
      const biome = b[0];
      const tier = b[1];
      const timesOfDay = b.length > 2
        ? Array.isArray(b[2])
          ? b[2]
          : [ b[2] ]
        : [ TimeOfDay.ALL ];

      catchableSpecies[speciesId].push({
        biome: biome as BiomeId,
        tier: tier as BiomePoolTier,
        tod: timesOfDay as TimeOfDay[]
      });

      for (const tod of timesOfDay) {
        if (!biomePokemonPools.hasOwnProperty(biome) || !biomePokemonPools[biome].hasOwnProperty(tier) || !biomePokemonPools[biome][tier].hasOwnProperty(tod)) {
          continue;
        }

        const biomeTierPool = biomePokemonPools[biome][tier][tod];

        let treeIndex = -1;
        let arrayIndex = 0;

        for (let t = 0; t < biomeTierPool.length; t++) {
          const existingSpeciesIds = biomeTierPool[t] as unknown as SpeciesId[];
          for (let es = 0; es < existingSpeciesIds.length; es++) {
            const existingSpeciesId = existingSpeciesIds[es];
            if (pokemonEvolutions.hasOwnProperty(existingSpeciesId) && (pokemonEvolutions[existingSpeciesId] as SpeciesFormEvolution[]).find(ese => ese.speciesId === speciesId)) {
              treeIndex = t;
              arrayIndex = es + 1;
              break;
            }
            if (speciesEvolutions?.find(se => se.speciesId === existingSpeciesId)) {
              treeIndex = t;
              arrayIndex = es;
              break;
            }
          }
          if (treeIndex > -1) {
            break;
          }
        }

        if (treeIndex > -1) {
          (biomeTierPool[treeIndex] as unknown as SpeciesId[]).splice(arrayIndex, 0, speciesId);
        } else {
          (biomeTierPool as unknown as SpeciesId[][]).push([ speciesId ]);
        }
      }
    }
  }

  for (const b of Object.keys(biomePokemonPools)) {
    for (const t of Object.keys(biomePokemonPools[b])) {
      const tier = Number.parseInt(t) as BiomePoolTier;
      for (const tod of Object.keys(biomePokemonPools[b][t])) {
        const biomeTierTimePool = biomePokemonPools[b][t][tod];
        for (let e = 0; e < biomeTierTimePool.length; e++) {
          const entry = biomeTierTimePool[e];
          if (entry.length === 1) {
            biomeTierTimePool[e] = entry[0];
          } else {
            const newEntry = {
              1: [ entry[0] ]
            };
            for (let s = 1; s < entry.length; s++) {
              const speciesId = entry[s];
              const prevolution = entry.flatMap((s: string | number) => pokemonEvolutions[s]).find(e => e && e.speciesId === speciesId);
              const level = prevolution.level - (prevolution.level === 1 ? 1 : 0) + (prevolution.wildDelay * 10) - (tier >= BiomePoolTier.BOSS ? 10 : 0);
              if (!newEntry.hasOwnProperty(level)) {
                newEntry[level] = [ speciesId ];
              } else {
                newEntry[level].push(speciesId);
              }
            }
            biomeTierTimePool[e] = newEntry;
          }
        }
      }
    }
  }

  for (const tb of trainerBiomes) {
    const trainerType = tb[0] as TrainerType;
    const biomeEntries = tb[1] as BiomePoolTier[][];

    for (const b of biomeEntries) {
      const biome = b[0];
      const tier = b[1];

      if (!biomeTrainerPools.hasOwnProperty(biome) || !biomeTrainerPools[biome].hasOwnProperty(tier)) {
        continue;
      }

      const biomeTierPool = biomeTrainerPools[biome][tier];
      biomeTierPool.push(trainerType);
    }
    //outputPools();
  }


  // used in a commented code
  // function outputPools() {
  //   const pokemonOutput = {};
  //   const trainerOutput = {};

  //   for (const b of Object.keys(biomePokemonPools)) {
  //     const biome = BiomeId[b];
  //     pokemonOutput[biome] = {};
  //     trainerOutput[biome] = {};

  //     for (const t of Object.keys(biomePokemonPools[b])) {
  //       const tier = BiomePoolTier[t];

  //       pokemonOutput[biome][tier] = {};

  //       for (const tod of Object.keys(biomePokemonPools[b][t])) {
  //         const timeOfDay = TimeOfDay[tod];

  //         pokemonOutput[biome][tier][timeOfDay] = [];

  //         for (const f of biomePokemonPools[b][t][tod]) {
  //           if (typeof f === "number") {
  //             pokemonOutput[biome][tier][timeOfDay].push(SpeciesId[f]);
  //           } else {
  //             const tree = {};

  //             for (const l of Object.keys(f)) {
  //               tree[l] = f[l].map(s => SpeciesId[s]);
  //             }

  //             pokemonOutput[biome][tier][timeOfDay].push(tree);
  //           }
  //         }

  //       }
  //     }

  //     for (const t of Object.keys(biomeTrainerPools[b])) {
  //       const tier = BiomePoolTier[t];

  //       trainerOutput[biome][tier] = [];

  //       for (const f of biomeTrainerPools[b][t]) {
  //         trainerOutput[biome][tier].push(TrainerType[f]);
  //       }
  //     }
  //   }

  //   console.log(beautify(pokemonOutput, null, 2, 180).replace(/(        |        (?:\{ "\d+": \[ )?|    "(?:.*?)": \[ |(?:,|\[) (?:"\w+": \[ |(?:\{ )?"\d+": \[ )?)"(\w+)"(?= |,|\n)/g, "$1SpeciesId.$2").replace(/"(\d+)": /g, "$1: ").replace(/((?:      )|(?:(?!\n)    "(?:.*?)": \{) |\[(?: .*? )?\], )"(\w+)"/g, "$1[TimeOfDay.$2]").replace(/(    )"(.*?)"/g, "$1[BiomePoolTier.$2]").replace(/(  )"(.*?)"/g, "$1[BiomeId.$2]"));
  //   console.log(beautify(trainerOutput, null, 2, 120).replace(/(      |      (?:\{ "\d+": \[ )?|    "(?:.*?)": \[ |, (?:(?:\{ )?"\d+": \[ )?)"(.*?)"/g, "$1TrainerType.$2").replace(/"(\d+)": /g, "$1: ").replace(/(    )"(.*?)"/g, "$1[BiomePoolTier.$2]").replace(/(  )"(.*?)"/g, "$1[BiomeId.$2]"));
  // }

  /*for (let pokemon of allSpecies) {
    if (pokemon.speciesId >= SpeciesId.XERNEAS)
      break;
    pokemonBiomes[pokemon.speciesId - 1][0] = Species[pokemonBiomes[pokemon.speciesId - 1][0]];
    pokemonBiomes[pokemon.speciesId - 1][1] = Type[pokemonBiomes[pokemon.speciesId - 1][1]];
    if (pokemonBiomes[pokemon.speciesId - 1][2] > -1)
      pokemonBiomes[pokemon.speciesId - 1][2] = Type[pokemonBiomes[pokemon.speciesId - 1][2]];
    for (let b of Utils.getEnumValues(Biome)) {
      if (biomePools.hasOwnProperty(b)) {
        let poolTier = -1;
        for (let t of Object.keys(biomePools[b])) {
          for (let p = 0; p < biomePools[b][t].length; p++) {
            if (biomePools[b][t][p] === pokemon.speciesId) {
              poolTier = parseInt(t) as BiomePoolTier;
              break;
            }
          }
        }
        if (poolTier > -1)
          pokemonBiomes[pokemon.speciesId - 1][3].push([ Biome[b], BiomePoolTier[poolTier] ]);
      } else if (biomePoolPredicates[b](pokemon)) {
        pokemonBiomes[pokemon.speciesId - 1][3].push([ Biome[b], BiomePoolTier[BiomePoolTier.COMMON] ]);
      }
    }
  }

  console.log(JSON.stringify(pokemonBiomes, null, '  '));*/
}

