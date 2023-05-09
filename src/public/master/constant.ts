// ポケモン
const myAllParty = [
  new Pokemon,
  new Pokemon,
  new Pokemon,
  new Pokemon,
  new Pokemon,
  new Pokemon
];

const opponentAllParty: Pokemon[] = [
  new Pokemon,
  new Pokemon,
  new Pokemon,
  new Pokemon,
  new Pokemon,
  new Pokemon
];

const myParty: Pokemon[] = [];
const opponentParty: Pokemon[] = [];

// フィールド
const fieldStatus = new Field;

// 乱数
let randomList: number[] = []


const parameterSix: string[] = [
  'hitPoint',
  'attack',
  'defense',
  'specialAttack',
  'specialDefense',
  'speed'
]

const parameterFive: string[] = [
  'attack',
  'defense',
  'specialAttack',
  'specialDefense',
  'speed'
]

const natureData: NatureDataType[] = [
  // 攻撃上昇補正
  { name: 'てれや', plus: 'attack', minus: 'attack', isOK: true },
  { name: 'さみしがり', plus: 'attack', minus: 'defense', isOK: true },
  { name: 'いじっぱり', plus: 'attack', minus: 'specialAttack', isOK: true },
  { name: 'やんちゃ', plus: 'attack', minus: 'specialDefense', isOK: true },
  { name: 'ゆうかん', plus: 'attack', minus: 'speed', isOK: true },
  // 防御上昇補正
  { name: 'ずぶとい', plus: 'defense', minus: 'attack', isOK: true },
  { name: 'がんばりや', plus: 'defense', minus: 'defense', isOK: true },
  { name: 'わんぱく', plus: 'defense', minus: 'specialAttack', isOK: true },
  { name: 'のうてんき', plus: 'defense', minus: 'specialDefense', isOK: true },
  { name: 'のんき', plus: 'defense', minus: 'speed', isOK: true },
  // 特攻上昇補正
  { name: 'ひかえめ', plus: 'specialAttack', minus: 'attack', isOK: true },
  { name: 'おっとり', plus: 'specialAttack', minus: 'defense', isOK: true },
  { name: 'すなお', plus: 'specialAttack', minus: 'specialAttack', isOK: true },
  { name: 'うっかりや', plus: 'specialAttack', minus: 'specialDefense', isOK: true },
  { name: 'れいせい', plus: 'specialAttack', minus: 'speed', isOK: true },
  // 特防上昇補正
  { name: 'おだやか', plus: 'specialDefense', minus: 'attack', isOK: true },
  { name: 'おとなしい', plus: 'specialDefense', minus: 'defense', isOK: true },
  { name: 'しんちょう', plus: 'specialDefense', minus: 'specialAttack', isOK: true },
  { name: 'きまぐれ', plus: 'specialDefense', minus: 'specialDefense', isOK: true },
  { name: 'なまいき', plus: 'specialDefense', minus: 'speed', isOK: true },
  // 素早さ上昇補正
  { name: 'おくびょう', plus: 'speed', minus: 'attack', isOK: true },
  { name: 'せっかち', plus: 'speed', minus: 'defense', isOK: true },
  { name: 'ようき', plus: 'speed', minus: 'specialAttack', isOK: true },
  { name: 'むじゃき', plus: 'speed', minus: 'specialDefense', isOK: true },
  { name: 'まじめ', plus: 'speed', minus: 'speed', isOK: true },
]

// タイプのカラーコード
// https://wiki.xn--rckteqa2e.com/wiki/%E3%82%AB%E3%83%86%E3%82%B4%E3%83%AA:%E8%89%B2%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88_%E3%82%BF%E3%82%A4%E3%83%97%E5%88%A5
const typeColor: TypeColorType[] = [
  { name: 'あく', light: 'A29288', normal: '705848', dark: '49392F', isOK: true },
  { name: 'いわ', light: 'D1C17D', normal: 'B8A038', dark: '786824', isOK: true },
  { name: 'エスパー', light: 'FA92B2', normal: 'F85888', dark: 'A13959', isOK: true },
  { name: 'かくとう', light: 'D67873', normal: 'C03028', dark: '7D1F1A', isOK: true },
  { name: 'くさ', light: 'A7DB8D', normal: '78C850', dark: '4E8234', isOK: true },
  { name: 'ゴースト', light: 'A292BC', normal: '705898', dark: '493963', isOK: true },
  { name: 'こおり', light: 'BCE6E6', normal: '98D8D8', dark: '638D8D', isOK: true },
  { name: 'じめん', light: 'EBD69D', normal: 'E0C068', dark: '927D44', isOK: true },
  { name: 'でんき', light: 'FAE078', normal: 'F8D030', dark: 'A1871F', isOK: true },
  { name: 'どく', light: 'C183C1', normal: 'A040A0', dark: '682A68', isOK: true },
  { name: 'ドラゴン', light: 'A27DFA', normal: '7038F8', dark: '4924A1', isOK: true },
  { name: 'ノーマル', light: 'C6C6A7', normal: 'A8A878', dark: '6D6D4E', isOK: true },
  { name: 'はがね', light: 'D1D1E0', normal: 'B8B8D0', dark: '787887', isOK: true },
  { name: 'ひこう', light: 'C6B7F5', normal: 'A890F0', dark: '6D5E9C', isOK: true },
  { name: 'フェアリー', light: 'F4BDC9', normal: 'EE99AC', dark: '9B6470', isOK: true },
  { name: 'ほのお', light: 'F5AC78', normal: 'F08030', dark: '9C531F', isOK: true },
  { name: 'みず', light: '9DB7F5', normal: '6890F0', dark: '445E9C', isOK: true },
  { name: 'むし', light: 'C6D16E', normal: 'A8B820', dark: '6D7815', isOK: true },
  { name: '不明', light: '9DC1B7', normal: '68A090', dark: '44685E', isOK: true }
]


// 音技
const musicMoveList: string[] = [
  'いにしえのうた',
  'いびき',
  'いやしのすず',
  'いやなおと',
  'うたう',
  'うたかたのアリア',
  'エコーボイス',
  'オーバードライブ',
  'おしゃべり',
  'おたけび',
  'きんぞくおん',
  'くさぶえ',
  'さわぐ',
  'スケイルノイズ',
  'すてゼリフ',
  'ソウルビート',
  'チャームボイス',
  'ちょうおんぱ',
  'とおぼえ',
  'ないしょばなし',
  'なきごえ',
  'バークアウト',
  'ハイパーボイス',
  'ばくおんぱ',
  'ぶきみなじゅもん',
  'フレアソング',
  'ブレイジングソウルビート',
  'ほえる',
  'ほろびのうた',
  'むしのさざめき',
  'りんしょう'
]

// 爆発技
const explosionMoveList: string[] = [
  'じばく',
  'だいばくはつ',
  'ビックリヘッド',
  'ミストバースト'
]
