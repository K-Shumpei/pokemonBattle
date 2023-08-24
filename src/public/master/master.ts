type PokemonType = ( typeof typeTextList )[number];
type Gender = ( typeof genderTextList )[number];
type StatusAilmentText = ( typeof statusAilmentTextList )[number];
type WeatherText = ( typeof weatherTextList )[number];
type TerrainText = ( typeof terrainTextList )[number];


const typeTextList = [
  'Normal',
  'Fighting',
  'Flying',
  'Poison',
  'Ground',
  'Rock',
  'Bug',
  'Ghost',
  'Steel',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Psychic',
  'Ice',
  'Dragon',
  'Dark',
  'Fairy',
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
