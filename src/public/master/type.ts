type PokemonData = {
  id: number;
  order: number;
  nameEN: string;
  nameJA: string;
  gender: Gender;
  type: PokemonType[];
  ability: string[];
  baseStatus: {
    hp: number;
    atk: number;
    def: number;
    spA: number;
    spD: number;
    spe: number;
  };
  height: number;
  weight: number;
  isEvolve: boolean;
  text: string;
}

type MoveData = {
  id: number;
  nameJA: string;
  nameEN: string;
  type: PokemonType;
  class: MoveClass;
  target: MoveTargetText;
  category: MoveCategoryText;
  power: number | null;
  accuracy: number | null;
  powerPoint: number;
  priority: number;
  critical: number;
  drain: number;
  flinch: number;
  healing: number;
  hits: { max: number | null, min: number | null };
  turns: { max: number | null, min: number | null };
  ailment: { chance: number, name: string };
  stat: { chance: number, changes: { stat: RankStrings, change: number }[]};
  text: string;
}

type MoveFlagData = {
  id: number;
  nameEN: string;
  nameJA: string;
  contact: boolean;
  charge: boolean;
  recharge: boolean;
  protect: boolean;
  reflectable: boolean;
  snatch: boolean;
  mirror: boolean;
  punch: boolean;
  sound: boolean;
  gravity: boolean;
  defrost: boolean;
  distance: boolean;
  heal: boolean;
  authentic: boolean;
  powder: boolean;
  bite: boolean;
  pulse: boolean;
  ballistics: boolean;
  mental: boolean;
  nonSkyBattle: boolean;
  dance: boolean;
}

type MoveAddOnData = {
  id: number;
  nameJA: string;
  nameEN: string;
  additional: boolean;
  wind: boolean;
}

type MoveLearned = {
  id: number;
  order: number;
  nameEN: string;
  move: string[];
}

type ItemData = {
  id: number;
  nameJA: string;
  nameEN: string;
  category: string;
  flingPower: number | null;
  flingEffect: string | null;
}

type AbilityData = {
  id: number;
  nameJA: string;
  nameEN: string;
  text: string;
}

type NatureData = {
  nameEN: NatureText;
  nameJA: string;
  atk: number;
  def: number;
  spA: number;
  spD: number;
  spe: number;
  plus: string;
  minus: string;
}

type ItemForType = {
  name: string;
  type: PokemonType;
}

type BerryData = {
  number: number;
  name: string;
  half: PokemonType;
  fling: boolean;
  naturalGift: {
    type: PokemonType;
    power: number;
  };
}

type RankStrings = 'atk' | 'def' | 'spA' | 'spD' | 'spe' | 'acc' | 'eva';



type MoveTargetType = '自分' | '1体選択' | '味方1体' | '自分か味方' | 'ランダム1体' | '味方全体' | '相手全体' | '自分以外' | '全体' | '味方の場' | '相手の場' | '全体の場' | '不定' ;



type ParameterStringType = 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed' | 'accuracy' | 'evasion';
type NatureType = 'てれや' | 'さみしがり' | 'いじっぱり' | 'やんちゃ' | 'ゆうかん' | 'ずぶとい' | 'がんばりや' | 'わんぱく' | 'のうてんき' | 'のんき' | 'ひかえめ' | 'おっとり' | 'すなお' | 'うっかりや' | 'れいせい' | 'おだやか' | 'おとなしい' | 'しんちょう' | 'きまぐれ' | 'なまいき' | 'おくびょう' | 'せっかち' | 'ようき' | 'むじゃき' | 'まじめ';
type SignType = '+' | '-';



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
  ailment: StatusAilmentText;
}

type TranslationDictionaryType = {
  EN: string;
  JP: string;
}

type NatureDataType = {
  name: NatureText;
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
  atkType: string;
  rate: { defType: PokemonType, rate: number }[];
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
  half: PokemonType;
  fling: boolean;
  naturalGift: { type: PokemonType, power: number };
}

type TargetDataType = {
  target: Pokemon;
  damage: Attack;
}
