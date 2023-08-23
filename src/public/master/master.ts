type PokemonType = ( typeof typeTextList )[number];
type Gender = ( typeof genderTextList )[number];
type StatusAilmentText = ( typeof statusAilmentTextList )[number];
type WeatherText = ( typeof weatherTextList )[number];
type TerrainText = ( typeof terrainTextList )[number];


const typeTextList = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
  null,
] as const;

const genderTextList = [
  'both',
  'male',
  'female',
  'genderless',
] as const;

const statusAilmentTextList = [
  'paralysis',
  'frozen',
  'burned',
  'poisoned',
  'sp-poisoned',
  'asleep',
  null,
] as const;

const weatherTextList = [
  'sunny',
  'rain',
  'sandstorm',
  'snow',
  'turbulence',
  null,
] as const;

const terrainTextList = [
  'electric',
  'grassy',
  'misty',
  'psychic',
  null,
] as const;
