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
  isOK: boolean
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
  isOK: boolean
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
  JP: string
}

type NatureDataType = {
  name: string;
  plus: string;
  minus: string;
  isOK: boolean
}

type TypeColorType = {
  name: string;
  light: string;
  normal: string;
  dark: string;
  isOK: boolean
}
