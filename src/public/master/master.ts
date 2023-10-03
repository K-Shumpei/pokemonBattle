type PokemonType = ( typeof typeTextList )[number];
type Gender = ( typeof genderTextList )[number];
type StatusAilmentText = ( typeof statusAilmentTextList )[number];
type MoveClass = ( typeof moveClassText )[number];
type WeatherText = ( typeof weatherTextList )[number];
type TerrainText = ( typeof terrainTextList )[number];


const typeTextList = [
  'NORMAL',
  'FIGHTING',
  'FLYING',
  'POISON',
  'GROUND',
  'ROCK',
  'BUG',
  'GHOST',
  'STEEL',
  'FIRE',
  'WATER',
  'GRASS',
  'ELECTRIC',
  'PSYCHIC',
  'ICE',
  'DRAGON',
  'DARK',
  'FAIRY',
  null,
] as const;

const genderTextList = [
  'both',
  'male',
  'female',
  'genderless',
] as const;

const statusAilmentTextList = [
  'PARALYSIS',
  'FROZEN',
  'BURNED',
  'POISONED',
  'ASLEEP',
  null,
] as const;

const moveClassText = [
  'physical',
  'special',
  'status',
] as const;

const weatherTextList = [
  'HarshSunlight',
  'Rain',
  'Sandstorm',
  'Hail', // あられ
  'Turbulence', // 未確認
  null,
] as const;

const terrainTextList = [
  'electric',
  'grassy',
  'misty',
  'psychic',
  null,
] as const;
