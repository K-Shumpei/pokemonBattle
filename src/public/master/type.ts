type MoveCategoryType = '物理' | '特殊' | '変化';
type MoveTypeType = 'ノーマル' | 'ほのお' | 'みず' | 'でんき' | 'くさ' | 'こおり' | 'かくとう' | 'どく' | 'じめん' | 'ひこう' | 'エスパー' | 'むし' | 'いわ' | 'ゴースト' | 'ドラゴン' | 'あく' | 'はがね' | 'フェアリー' | null;
type MoveTargetType = '自分' | '1体選択' | '味方1体' | '自分か味方' | 'ランダム1体' | '味方全体' | '相手全体' | '自分以外' | '全体' | '味方の場' | '相手の場' | '全体の場' | '不定' ;
type WeatherType = 'にほんばれ' | 'あめ' | 'すなあらし' | 'あられ' | 'ゆき' | 'おおあめ' | 'おおひでり' | 'らんきりゅう' | null;
type TerrainType = 'エレキフィールド' | 'グラスフィールド' | 'サイコフィールド' | 'ミストフィールド' | null;
type StatusAilmentType = 'まひ' | 'ねむり' | 'どく' | 'もうどく' | 'やけど' | 'こおり' | null;
type ParameterStringType = 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed' | 'accuracy' | 'evasion';
type NatureType = 'てれや' | 'さみしがり' | 'いじっぱり' | 'やんちゃ' | 'ゆうかん' | 'ずぶとい' | 'がんばりや' | 'わんぱく' | 'のうてんき' | 'のんき' | 'ひかえめ' | 'おっとり' | 'すなお' | 'うっかりや' | 'れいせい' | 'おだやか' | 'おとなしい' | 'しんちょう' | 'きまぐれ' | 'なまいき' | 'おくびょう' | 'せっかち' | 'ようき' | 'むじゃき' | 'まじめ';
type SignType = '+' | '-';
type GenderType = '♂' | '♀' | '-';

type PokemonDataType = {
  number: string;
  name: string;
  type1: MoveTypeType;
  type2: MoveTypeType;
  gender1: GenderType;
  gender2: GenderType;
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
  type: MoveTypeType;
  category: MoveCategoryType;
  power: number;
  accuracy: number;
  powerPoint: number;
  isDirect: boolean;
  isProtect: boolean;
  target: MoveTargetType;
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

type ParameterSevenType = {
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  accuracy: number;
  evasion: number;
  [key: string]: number;
}

type AdditionalEffectRank = {
  name: string;
  rate: number;
  change: ParameterSevenType;
}

type MoveEffectRank = {
  name: string;
  change: ParameterSevenType;
}

type AdditionalEffectAilment = {
  name: string;
  rate: number;
  ailment: StatusAilmentType;
}

type TranslationDictionaryType = {
  EN: string;
  JP: string;
}

type NatureDataType = {
  name: NatureType;
  plus: ParameterStringType;
  minus: ParameterStringType;
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
  ノーマル: number;
  ほのお: number;
  みず: number;
  くさ: number;
  でんき: number;
  こおり: number;
  かくとう: number;
  どく: number;
  じめん: number;
  ひこう: number;
  エスパー: number;
  むし: number;
  いわ: number;
  ゴースト: number;
  ドラゴン: number;
  あく: number;
  はがね: number;
  フェアリー: number;
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

type BerryTableType = {
  number: number;
  name: string;
  half: MoveTypeType;
  fling: boolean;
}
