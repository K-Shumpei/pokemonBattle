interface PokemonDataType {
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

interface MoveDataType {
  name: string;
  type: string;
  nature: '物理' | '特殊' | '変化';
  power: number;
  accuracy: number;
  powerPoint: number;
  isDirect: boolean;
  isProtect: boolean;
  target: string; // '全体の場' | '味方の場' | '相手の場'
  discription: string;
  isOK: boolean
}

interface ParameterSixType {
  hitPoint: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  [key: string]: number;
}

interface ParameterFiveType {
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  [key: string]: number;
}

interface TranslationDictionaryType { EN: string; JP: string }

interface NatureDataType {
  name: string;
  plus: string;
  minus: string;
  isOK: boolean
}

class ParameterSix implements ParameterSixType {
  hitPoint = 0;
  attack = 0;
  defense = 0;
  specialAttack = 0;
  specialDefense = 0;
  speed = 0;

  [keys: string]: number;
 }
