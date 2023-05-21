type PokemonDataType = {
  number: string;
  name: string;
  type1: string;
  type2: string;
  gender1: '♂' | '♀' | '-';
  gender2: '♀' | '';
  ability1: string;
  ability2: string;
  ability3: string;
  hitPoint: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  height: number;
  weight: number;
  isOK: boolean;
}

type MoveDataType = {
  name: string;
  type: string;
  category: '物理' | '特殊' | '変化';
  power: number;
  accuracy: number;
  powerPoint: number;
  isDirect: boolean;
  isProtect: boolean;
  target: string; // '全体の場' | '味方の場' | '相手の場'
  discription: string;
}

type ParameterSixType = {
  hitPoint: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  [key: string]: number;
}

type ParameterFiveType = {
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  [key: string]: number;
}

type TranslationDictionaryType = {
  EN: string;
  JP: string;
}

type NatureDataType = {
  name: string;
  plus: string;
  minus: string;
  isOK: boolean;
}

type TypeColorType = {
  name: string;
  light: string;
  normal: string;
  dark: string;
  isOK: boolean;
}

type TypeCompatibilityType = {
  attackType: string;
  rate: TypeCompatibilityRateType;
}

type TypeCompatibilityRateType = {
  normal: number;
  fire: number;
  water: number;
  grass: number;
  electric: number;
  ice: number;
  fighting: number;
  poison: number;
  ground: number;
  flying: number;
  psychic: number;
  bug: number;
  rock: number;
  ghost: number;
  dragon: number;
  dark: number;
  steel: number;
  fairy: number;
  [key: string]: number;
}

// 参考：https://wiki.xn--rckteqa2e.com/wiki/%E3%81%A8%E3%81%8F%E3%81%9B%E3%81%84
// 0：(◯)技や特性の効果を受ける
// 1：(×)技や特性を無効化する
// 2：(△)効果を受けるが、他のポケモンが特性を得ても発動しない
// 3：(-)確認する術がない
type changeAbilityType = {
  name: string;
  exchange: number;
  overwrite: number;
  noAbility: number;
  neutral: number;
  copy: number;
  copied: number;
  transform: number;
}
