// ポケモン
const myAllParty = [
  new Pokemon(),
  new Pokemon(),
  new Pokemon(),
  new Pokemon(),
  new Pokemon(),
  new Pokemon()
];

const opponentAllParty: Pokemon[] = [
  new Pokemon(),
  new Pokemon(),
  new Pokemon(),
  new Pokemon(),
  new Pokemon(),
  new Pokemon()
];

const myParty: Pokemon[] = [];
const opponentParty: Pokemon[] = [];
const regPokemon: Register = new Register();

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

const natureList: NatureType[] = [
  'てれや',
  'さみしがり',
  'いじっぱり',
  'やんちゃ',
  'ゆうかん',
  'ずぶとい',
  'がんばりや',
  'わんぱく',
  'のうてんき',
  'のんき',
  'ひかえめ',
  'おっとり',
  'すなお',
  'うっかりや',
  'れいせい',
  'おだやか',
  'おとなしい',
  'しんちょう',
  'きまぐれ',
  'なまいき',
  'おくびょう',
  'せっかち',
  'ようき',
  'むじゃき',
  'まじめ'
]

/*
const natureData: NatureDataType[] = [
  // 攻撃上昇補正
  { name: 'てれや', plus: 'attack', minus: 'attack' },
  { name: 'さみしがり', plus: 'attack', minus: 'defense' },
  { name: 'いじっぱり', plus: 'attack', minus: 'specialAttack' },
  { name: 'やんちゃ', plus: 'attack', minus: 'specialDefense' },
  { name: 'ゆうかん', plus: 'attack', minus: 'speed' },
  // 防御上昇補正
  { name: 'ずぶとい', plus: 'defense', minus: 'attack' },
  { name: 'がんばりや', plus: 'defense', minus: 'defense' },
  { name: 'わんぱく', plus: 'defense', minus: 'specialAttack' },
  { name: 'のうてんき', plus: 'defense', minus: 'specialDefense' },
  { name: 'のんき', plus: 'defense', minus: 'speed' },
  // 特攻上昇補正
  { name: 'ひかえめ', plus: 'specialAttack', minus: 'attack' },
  { name: 'おっとり', plus: 'specialAttack', minus: 'defense' },
  { name: 'すなお', plus: 'specialAttack', minus: 'specialAttack' },
  { name: 'うっかりや', plus: 'specialAttack', minus: 'specialDefense' },
  { name: 'れいせい', plus: 'specialAttack', minus: 'speed' },
  // 特防上昇補正
  { name: 'おだやか', plus: 'specialDefense', minus: 'attack' },
  { name: 'おとなしい', plus: 'specialDefense', minus: 'defense' },
  { name: 'しんちょう', plus: 'specialDefense', minus: 'specialAttack' },
  { name: 'きまぐれ', plus: 'specialDefense', minus: 'specialDefense' },
  { name: 'なまいき', plus: 'specialDefense', minus: 'speed' },
  // 素早さ上昇補正
  { name: 'おくびょう', plus: 'speed', minus: 'attack' },
  { name: 'せっかち', plus: 'speed', minus: 'defense' },
  { name: 'ようき', plus: 'speed', minus: 'specialAttack' },
  { name: 'むじゃき', plus: 'speed', minus: 'specialDefense' },
  { name: 'まじめ', plus: 'speed', minus: 'speed' },
]
*/

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

// タイプ相性
const typeCompatibility: TypeCompatibilityType[] = [
  { attackType: 'ノーマル', rate: { ノーマル: 1.0, ほのお: 1.0, みず: 1.0, でんき: 1.0, くさ: 1.0, こおり: 1.0, かくとう: 1.0, どく: 1.0, じめん: 1.0, ひこう: 1.0, エスパー: 1.0, むし: 1.0, いわ: 0.5, ゴースト: 0.0, ドラゴン: 1.0, あく: 1.0, はがね: 0.5, フェアリー: 1.0 } },
  { attackType: 'ほのお', rate: { ノーマル: 1.0, ほのお: 0.5, みず: 0.5, でんき: 1.0, くさ: 2.0, こおり: 2.0, かくとう: 1.0, どく: 1.0, じめん: 1.0, ひこう: 1.0, エスパー: 1.0, むし: 2.0, いわ: 0.5, ゴースト: 1.0, ドラゴン: 0.5, あく: 1.0, はがね: 2.0, フェアリー: 1.0 } },
  { attackType: 'みず', rate: { ノーマル: 1.0, ほのお: 2.0, みず: 0.5, でんき: 1.0, くさ: 0.5, こおり: 1.0, かくとう: 1.0, どく: 1.0, じめん: 2.0, ひこう: 1.0, エスパー: 1.0, むし: 1.0, いわ: 2.0, ゴースト: 1.0, ドラゴン: 0.5, あく: 1.0, はがね: 1.0, フェアリー: 1.0 } },
  { attackType: 'でんき', rate: { ノーマル: 1.0, ほのお: 1.0, みず: 2.0, でんき: 0.5, くさ: 0.5, こおり: 1.0, かくとう: 1.0, どく: 1.0, じめん: 0.0, ひこう: 2.0, エスパー: 1.0, むし: 1.0, いわ: 1.0, ゴースト: 1.0, ドラゴン: 0.5, あく: 1.0, はがね: 1.0, フェアリー: 1.0 } },
  { attackType: 'くさ', rate: { ノーマル: 1.0, ほのお: 0.5, みず: 2.0, でんき: 1.0, くさ: 0.5, こおり: 1.0, かくとう: 1.0, どく: 0.5, じめん: 2.0, ひこう: 0.5, エスパー: 1.0, むし: 0.5, いわ: 2.0, ゴースト: 1.0, ドラゴン: 0.5, あく: 1.0, はがね: 0.5, フェアリー: 1.0 } },
  { attackType: 'こおり', rate: { ノーマル: 1.0, ほのお: 0.5, みず: 0.5, でんき: 1.0, くさ: 2.0, こおり: 0.5, かくとう: 1.0, どく: 1.0, じめん: 2.0, ひこう: 2.0, エスパー: 1.0, むし: 1.0, いわ: 1.0, ゴースト: 1.0, ドラゴン: 2.0, あく: 1.0, はがね: 0.5, フェアリー: 1.0 } },
  { attackType: 'かくとう', rate: { ノーマル: 2.0, ほのお: 1.0, みず: 1.0, でんき: 1.0, くさ: 1.0, こおり: 2.0, かくとう: 1.0, どく: 0.5, じめん: 1.0, ひこう: 0.5, エスパー: 0.5, むし: 0.5, いわ: 2.0, ゴースト: 0.0, ドラゴン: 1.0, あく: 2.0, はがね: 2.0, フェアリー: 0.5 } },
  { attackType: 'どく', rate: { ノーマル: 1.0, ほのお: 1.0, みず: 1.0, でんき: 1.0, くさ: 2.0, こおり: 1.0, かくとう: 1.0, どく: 0.5, じめん: 0.5, ひこう: 1.0, エスパー: 1.0, むし: 1.0, いわ: 0.5, ゴースト: 0.5, ドラゴン: 1.0, あく: 1.0, はがね: 0.0, フェアリー: 2.0 } },
  { attackType: 'じめん', rate: { ノーマル: 1.0, ほのお: 2.0, みず: 1.0, でんき: 2.0, くさ: 0.5, こおり: 1.0, かくとう: 1.0, どく: 2.0, じめん: 1.0, ひこう: 0.0, エスパー: 1.0, むし: 0.5, いわ: 2.0, ゴースト: 1.0, ドラゴン: 1.0, あく: 1.0, はがね: 2.0, フェアリー: 1.0 } },
  { attackType: 'ひこう', rate: { ノーマル: 1.0, ほのお: 1.0, みず: 1.0, でんき: 0.5, くさ: 2.0, こおり: 1.0, かくとう: 2.0, どく: 1.0, じめん: 1.0, ひこう: 1.0, エスパー: 1.0, むし: 2.0, いわ: 0.5, ゴースト: 1.0, ドラゴン: 1.0, あく: 1.0, はがね: 0.5, フェアリー: 1.0 } },
  { attackType: 'エスパー', rate: { ノーマル: 1.0, ほのお: 1.0, みず: 1.0, でんき: 1.0, くさ: 1.0, こおり: 1.0, かくとう: 2.0, どく: 2.0, じめん: 1.0, ひこう: 1.0, エスパー: 0.5, むし: 1.0, いわ: 1.0, ゴースト: 1.0, ドラゴン: 1.0, あく: 0.0, はがね: 0.5, フェアリー: 1.0 } },
  { attackType: 'むし', rate: { ノーマル: 1.0, ほのお: 0.5, みず: 1.0, でんき: 1.0, くさ: 2.0, こおり: 1.0, かくとう: 0.5, どく: 0.5, じめん: 1.0, ひこう: 0.5, エスパー: 2.0, むし: 1.0, いわ: 1.0, ゴースト: 0.5, ドラゴン: 1.0, あく: 2.0, はがね: 0.5, フェアリー: 0.5 } },
  { attackType: 'いわ', rate: { ノーマル: 1.0, ほのお: 2.0, みず: 1.0, でんき: 1.0, くさ: 1.0, こおり: 2.0, かくとう: 0.5, どく: 1.0, じめん: 0.5, ひこう: 2.0, エスパー: 1.0, むし: 2.0, いわ: 1.0, ゴースト: 1.0, ドラゴン: 1.0, あく: 1.0, はがね: 0.5, フェアリー: 1.0 } },
  { attackType: 'ゴースト', rate: { ノーマル: 0.0, ほのお: 1.0, みず: 1.0, でんき: 1.0, くさ: 1.0, こおり: 1.0, かくとう: 1.0, どく: 1.0, じめん: 1.0, ひこう: 1.0, エスパー: 2.0, むし: 1.0, いわ: 1.0, ゴースト: 2.0, ドラゴン: 1.0, あく: 0.5, はがね: 1.0, フェアリー: 1.0 } },
  { attackType: 'ドラゴン', rate: { ノーマル: 1.0, ほのお: 1.0, みず: 1.0, でんき: 1.0, くさ: 1.0, こおり: 1.0, かくとう: 1.0, どく: 1.0, じめん: 1.0, ひこう: 1.0, エスパー: 1.0, むし: 1.0, いわ: 1.0, ゴースト: 1.0, ドラゴン: 2.0, あく: 1.0, はがね: 0.5, フェアリー: 0.0 } },
  { attackType: 'あく', rate: { ノーマル: 1.0, ほのお: 1.0, みず: 1.0, でんき: 1.0, くさ: 1.0, こおり: 1.0, かくとう: 0.5, どく: 1.0, じめん: 1.0, ひこう: 1.0, エスパー: 2.0, むし: 1.0, いわ: 1.0, ゴースト: 2.0, ドラゴン: 1.0, あく: 0.5, はがね: 1.0, フェアリー: 0.5 } },
  { attackType: 'はがね', rate: { ノーマル: 1.0, ほのお: 0.5, みず: 0.5, でんき: 0.5, くさ: 1.0, こおり: 2.0, かくとう: 1.0, どく: 1.0, じめん: 1.0, ひこう: 1.0, エスパー: 1.0, むし: 1.0, いわ: 2.0, ゴースト: 1.0, ドラゴン: 1.0, あく: 1.0, はがね: 0.5, フェアリー: 2.0 } },
  { attackType: 'フェアリー', rate: { ノーマル: 1.0, ほのお: 0.5, みず: 1.0, でんき: 1.0, くさ: 1.0, こおり: 1.0, かくとう: 2.0, どく: 0.5, じめん: 1.0, ひこう: 1.0, エスパー: 1.0, むし: 1.0, いわ: 1.0, ゴースト: 1.0, ドラゴン: 2.0, あく: 2.0, はがね: 0.5, フェアリー: 1.0 } },
]


// 音技
const soundMoveList: string[] = [
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

// 粉技
const powderMoveList: string[] = [
  'いかりのこな',
  'キノコのほうし',
  'しびれごな',
  'どくのこな',
  'ねむりごな',
  'ふんじん',
  'まほうのこな',
  'わたほうし'
]

// 弾技
const ballMoveList: string[] = [
  'アイスボール',
  'アシッドボム',
  'ウェザーボール',
  'エナジーボール',
  'エレキボール',
  'オクタンほう',
  'かえんだん',
  'かえんボール',
  'かふんだんご',
  'がんせきほう',
  'きあいだま',
  'くちばしキャノン',
  'ジャイロボール',
  'シャドーボール',
  'タネばくだん',
  'タネマシンガン',
  'タマゴばくだん',
  'たまなげ',
  'でんじほう',
  'どろばくだん',
  'はどうだん',
  'ヘドロばくだん',
  'マグネットボム',
  'ミストボール',
  'ロックブラスト'
]

// 一撃必殺技
const oneShotMoveList: string[] = [
  'じわれ',
  'ぜったいれいど',
  'つのドリル',
  'ハサミギロチン'
]

// 踏付技(ちいさくなる状態に対して筆誅となる技)
const stompMoveList: string[] = [
  'ドラゴンダイブ',
  'のしかかり',
  'ハードローラー',
  'ハイパーダーククラッシャー',
  'ヒートスタンプ',
  'ふみつけ',
  'フライングプレス',
  'ヘビーボンバー'
]

// 解氷技
const meltMoveList: string[] = [
  'かえんぐるま',
  'かえんボール',
  'クロスフレイム',
  'スチームバースト',
  'せいなるほのお',
  'ねっさのだいち',
  'ねっとう',
  'ハイドロスチーム',
  'めらめらバーン',
  'もえつきる'
]

// ねむり状態でも使用可能な技
const sleepingMoveList: string[] = [
  'いびき',
  'ねごと'
]

// 重力で使えなくなるわざ
const flyingMoveList: string[] = [
  'はねる',
  'とびげり',
  'とびひざげり',
  'でんじふゆう',
  'そらをとぶ',
  'とびはねる',
  'フリーフォール',
  'テレキネシス',
  'フライングプレス'
]

// かいふくふうじで使えなくなる技
const healMoveList: string[] = [
  'じこさいせい',
  'タマゴうみ',
  'ミルクのみ',
  'なまける',
  'かいふくしれい',
  'ねむる',
  'あさのひざし',
  'こうごうせい',
  'つきのひかり',
  'すなあつめ',
  'はねやすめ',
  'のみこむ',
  'ねがいごと',
  'いやしのねがい',
  'みかづきのまい',
  'いやしのはどう',
  'フラワーヒール',
  'じょうか',
  'ちからをすいとる',
  'かふんだんご'
]

// 捨身技　すてみ
const recklessMoveList: string[] = [
  'アフロブレイク',
  'ウェーブタックル',
  'ウッドハンマー',
  'かかとおとし',
  'じごくぐるま',
  'すてみタックル',
  'とっしん',
  'とびげり',
  'とびひざげり',
  'はめつのひかり',
  'フレアドライブ',
  'ブレイブバード',
  'ボルテッカー',
  'もろはのずつき',
  'ワイルドボルト'
]

// 拳技　てつのこぶし
const ironFistMoveList: string[] = [
  'アームハンマー',
  'アイスハンマー',
  'あんこくきょうだ',
  'かみなりパンチ',
  'きあいパンチ',
  'グロウパンチ',
  'コメットパンチ',
  'ジェットパンチ',
  'シャドーパンチ',
  'すいりゅうれんだ',
  'スカイアッパー',
  'ダブルパンツァー',
  'ドレインパンチ',
  'ばくれつパンチ',
  'バレットパンチ',
  'ピヨピヨパンチ',
  'ぶちかまし',
  'プラズマフィスト',
  'ふんどのこぶし',
  'ほのおのパンチ',
  'マッハパンチ',
  'メガトンパンチ',
  'れいとうパンチ',
  'れんぞくパンチ'
]

// 噛付技　がんじょうあご
const biteMoveList: string[] = [
  'エラがみ',
  'かみくだく',
  'かみつく',
  'かみなりのキバ',
  'くらいつく',
  'こおりのキバ',
  'サイコファング',
  'どくどくのキバ',
  'ひっさつまえば',
  'ほのおのキバ'
]

// 波動技　メガランチャー
const waveMoveList: string[] = [
  'あくのはどう',
  'いやしのはどう',
  'こんげんのはどう',
  'だいちのはどう',
  'はどうだん',
  'みずのはどう',
  'りゅうのはどう'
]

// 吸収技
const absorbingMoveList = [
  { name: 'いきいきバブル', rate: 0.5 },
  { name: 'ウッドホーン', rate: 0.5 },
  { name: 'ギガドレイン', rate: 0.5 },
  { name: 'きゅうけつ', rate: 0.5 },
  { name: 'すいとる', rate: 0.5 },
  { name: 'デスウィング', rate: 0.75 },
  { name: 'ドレインキッス', rate: 0.75 },
  { name: 'ドレインパンチ', rate: 0.5 },
  { name: 'パラボラチャージ', rate: 0.5 },
  { name: 'むねんのつるぎ', rate: 0.5 },
  { name: 'メガドレイン', rate: 0.5 },
  { name: 'やどりぎのタネ', rate: 0.5 },
  { name: 'ゆめくい', rate: 0.5 },
]

// 風技
const windMoveList: string[] = [
  'エアカッター',
  'おいかぜ',
  'かぜおこし',
  'かみなりあらし',
  'こがらしあらし',
  'こごえるかぜ',
  'すなあらし',
  'たつまき',
  'ねっさのあらし',
  'ねっぷう',
  'はなふぶき',
  'はるのあらし',
  'ふきとばし',
  'ふぶき',
  'ぼうふう',
  'ようせいのかぜ'
]

// 縛技
const bindMoveList = [
  'うずしお',
  'からではさむ',
  'キョダイサジン',
  'キョダイヒャッカ',
  'サンダープリズン',
  'しめつける',
  'すなじごく',
  'トラバサミ',
  'ほのおのうず',
  'まきつく',
  'マグマストーム',
  'まとわりつく'
]

// タイプ変化技
const changeTypeMoveList = [
  'ウェザーボール',
  'オーラぐるま',
  'さばきのつぶて',
  'しぜんのめぐみ',
  'だいちのはどう',
  'テクノバスター',
  'テラバースト',
  'マルチアタック',
  'めざめるダンス',
  'めざめるパワー',
  'レイジングブル'
]

// 特性の変更可否
// https://wiki.xn--rckteqa2e.com/wiki/%E3%81%A8%E3%81%8F%E3%81%9B%E3%81%84
const changeAbilityTable: changeAbilityType[] = [
  { name: 'ARシステム', exchange: 1, overwrite: 1, noAbility: 1, neutral: 1, copy: 1, copied: 1, transform: 2 },
  { name: 'アイスフェイス', exchange: 1, overwrite: 1, noAbility: 1, neutral: 1, copy: 1, copied: 1, transform: 2 },
  { name: 'イリュージョン', exchange: 1, overwrite: 0, noAbility: 0, neutral: 0, copy: 1, copied: 1, transform: 2 },
  { name: 'うのミサイル', exchange: 1, overwrite: 1, noAbility: 1, neutral: 1, copy: 1, copied: 1, transform: 2 },
  { name: 'かがくのちから', exchange: 0, overwrite: 0, noAbility: 0, neutral: 0, copy: 1, copied: 1, transform: 0 },
  { name: 'かがくへんかガス', exchange: 1, overwrite: 0, noAbility: 0, neutral: 1, copy: 1, copied: 1, transform: 2 },
  { name: 'かわりもの', exchange: 2, overwrite: 0, noAbility: 0, neutral: 0, copy: 1, copied: 1, transform: 2 },
  { name: 'きずなへんげ', exchange: 1, overwrite: 1, noAbility: 1, neutral: 4, copy: 1, copied: 1, transform: 2 },
  { name: 'ぎょぐん', exchange: 1, overwrite: 1, noAbility: 1, neutral: 1, copy: 1, copied: 1, transform: 2 },
  { name: 'クォークチャージ', exchange: 1, overwrite: 1, noAbility: 1, neutral: 4, copy: 1, copied: 1, transform: 2 },
  { name: 'こだいかっせい', exchange: 1, overwrite: 1, noAbility: 1, neutral: 4, copy: 1, copied: 1, transform: 2 },
  { name: 'しれいとう', exchange: 1, overwrite: 1, noAbility: 1, neutral: 4, copy: 1, copied: 1, transform: 2 },
  { name: 'じんばいったい', exchange: 1, overwrite: 1, noAbility: 1, neutral: 1, copy: 1, copied: 1, transform: 0 },
  { name: 'スワームチェンジ', exchange: 1, overwrite: 1, noAbility: 1, neutral: 1, copy: 1, copied: 1, transform: 2 },
  { name: 'ぜったいねむり', exchange: 1, overwrite: 1, noAbility: 1, neutral: 4, copy: 1, copied: 1, transform: 0 },
  { name: 'ダルマモード', exchange: 1, overwrite: 1, noAbility: 1, neutral: 1, copy: 1, copied: 1, transform: 2 },
  { name: 'てんきや', exchange: 2, overwrite: 0, noAbility: 0, neutral: 0, copy: 1, copied: 1, transform: 2 },
  { name: 'トレース', exchange: 0, overwrite: 0, noAbility: 0, neutral: 0, copy: 1, copied: 1, transform: 0 },
  { name: 'なまけ', exchange: 0, overwrite: 1, noAbility: 0, neutral: 0, copy: 0, copied: 0, transform: 0 },
  { name: 'ばけのかわ', exchange: 1, overwrite: 1, noAbility: 1, neutral: 1, copy: 1, copied: 1, transform: 2 },
  { name: 'バトルスイッチ', exchange: 1, overwrite: 1, noAbility: 1, neutral: 1, copy: 1, copied: 1, transform: 2 },
  { name: 'ハドロンエンジン', exchange: 1, overwrite: 1, noAbility: 1, neutral: 4, copy: 1, copied: 1, transform: 2 },
  { name: 'はらぺこスイッチ', exchange: 1, overwrite: 0, noAbility: 0, neutral: 0, copy: 1, copied: 1, transform: 2 },
  { name: 'ひひいろのこどう', exchange: 1, overwrite: 1, noAbility: 1, neutral: 4, copy: 1, copied: 1, transform: 2 },
  { name: 'ふしぎなまもり', exchange: 1, overwrite: 0, noAbility: 0, neutral: 0, copy: 0, copied: 1, transform: 0 },
  { name: 'フラワーギフト', exchange: 2, overwrite: 0, noAbility: 0, neutral: 0, copy: 1, copied: 1, transform: 2 },
  { name: 'マイティチェンジ', exchange: 1, overwrite: 1, noAbility: 1, neutral: 4, copy: 1, copied: 1, transform: 2 },
  { name: 'マルチタイプ', exchange: 1, overwrite: 1, noAbility: 1, neutral: 4, copy: 1, copied: 1, transform: 2 },
  { name: 'リミットシールド', exchange: 1, overwrite: 1, noAbility: 1, neutral: 4, copy: 1, copied: 1, transform: 2 },
  { name: 'レシーバー', exchange: 0, overwrite: 0, noAbility: 0, neutral: 0, copy: 1, copied: 1, transform: 2 },
]


// プレート
const plateTable = [
  { name: 'あおぞらプレート', type: 'ひこう' },
  { name: 'いかずちプレート', type: 'でんき' },
  { name: 'がんせきプレート', type: 'いわ' },
  { name: 'こうてつプレート', type: 'はがね' },
  { name: 'こぶしのプレート', type: 'かくとう' },
  { name: 'こわもてプレート', type: 'あく' },
  { name: 'しずくプレート', type: 'みず' },
  { name: 'せいれいプレート', type: 'フェアリー' },
  { name: 'だいちのプレート', type: 'じめん' },
  { name: 'たまむしプレート', type: 'むし' },
  { name: 'つららのプレート', type: 'こおり' },
  { name: 'ひのたまプレート', type: 'ほのお' },
  { name: 'ふしぎのプレート', type: 'エスパー' },
  { name: 'みどりのプレート', type: 'くさ' },
  { name: 'もうどくプレート', type: 'どく' },
  { name: 'もののけプレート', type: 'ゴースト' },
  { name: 'りゅうのプレート', type: 'ドラゴン' }
]

// ジュエル
const gemTable = [
  { name: 'あくのジュエル', type: 'あく' },
  { name: 'いわのジュエル', type: 'いわ' },
  { name: 'エスパージュエル', type: 'エスパー' },
  { name: 'かくとうジュエル', type: 'かくとう' },
  { name: 'くさのジュエル', type: 'くさ' },
  { name: 'ゴーストジュエル', type: 'ゴースト' },
  { name: 'こおりのジュエル', type: 'こおり' },
  { name: 'じめんのジュエル', type: 'じめん' },
  { name: 'でんきのジュエル', type: 'でんき' },
  { name: 'どくのジュエル', type: 'どく' },
  { name: 'ドラゴンジュエル', type: 'ドラゴン' },
  { name: 'ノーマルジュエル', type: 'ノーマル' },
  { name: 'はがねのジュエル', type: 'はがね' },
  { name: 'ひこうのジュエル', type: 'ひこう' },
  { name: 'ようせいジュエル', type: 'フェアリー' },
  { name: 'ほのおのジュエル', type: 'ほのお' },
  { name: 'みずのジュエル', type: 'みず' },
  { name: 'むしのジュエル', type: 'むし' }
]

// メモリ
const memoryTable = [
  { name: 'アイスメモリ', type: 'こおり' },
  { name: 'ウオーターメモリ', type: 'みず' },
  { name: 'エレクトロメモリ', type: 'でんき' },
  { name: 'グラウンドメモリ', type: 'じめん' },
  { name: 'グラスメモリ', type: 'くさ' },
  { name: 'ゴーストメモリ', type: 'ゴースト' },
  { name: 'サイキックメモリ', type: 'エスパー' },
  { name: 'スチールメモリ', type: 'はがね' },
  { name: 'ダークメモリ', type: 'あく' },
  { name: 'ドラゴンメモリ', type: 'ドラゴン' },
  { name: 'バグメモリ', type: 'むし' },
  { name: 'ファイトメモリ', type: 'かくとう' },
  { name: 'ファイヤーメモリ', type: 'ほのお' },
  { name: 'フェアリーメモリ', type: 'フェアリー' },
  { name: 'フライングメモリ', type: 'ひこう' },
  { name: 'ポイズンメモリ', type: 'どく' },
  { name: 'ロックメモリ', type: 'いわ' }
]

// カセット
const driveTable = [
  { name: 'アクアカセット', type: 'みず' },
  { name: 'イナズマカセット', type: 'でんき' },
  { name: 'フリーズカセット', type: 'こおり' },
  { name: 'ブレイズカセット', type: 'ほのお' }
]

// シルクのスカーフ、おこう
const incenseTable = [
  { name: 'あやしいおこう', type: 'エスパー' },
  { name: 'うしおのおこう', type: 'みず' },
  { name: 'おはなのおこう', type: 'くさ' },
  { name: 'かたいいし', type: 'いわ' },
  { name: 'がんせきおこう', type: 'いわ' },
  { name: 'きせきのタネ', type: 'くさ' },
  { name: 'ぎんのこな', type: 'むし' },
  { name: 'くろいメガネ', type: 'あく' },
  { name: 'くろおび', type: 'かくとう' },
  { name: 'さざなみのおこう', type: 'みず' },
  { name: 'じしゃく', type: 'でんき' },
  { name: 'シルクのスカーフ', type: 'ノーマル' },
  { name: 'しんぴのしずく', type: 'みず' },
  { name: 'するどいくちばし', type: 'ひこう' },
  { name: 'どくバリ', type: 'どく' },
  { name: 'とけないこおり', type: 'こおり' },
  { name: 'のろいのおふだ', type: 'ゴースト' },
  { name: 'まがったスプーン', type: 'エスパー' },
  { name: 'メタルコート', type: 'はがね' },
  { name: 'もくたん', type: 'ほのお' },
  { name: 'やわらかいすな', type: 'じめん' },
  { name: 'りゅうのキバ', type: 'ドラゴン' }
]

// Zクリスタル
const zCrystalTable = [
  { name: 'アクZ', type: 'あく', Zmove: 'ブラックホールイクリプス', move: '', pokemon: '' },
  { name: 'アシレーヌZ', type: 'みず', Zmove: 'わだつみのシンフォニア', move: 'うたかたのアリア', pokemon: 'アシレーヌ' },
  { name: 'アロライZ', type: 'でんき', Zmove: 'ライトニングサーフライド', move: '10まんボルト', pokemon: 'ライチュウ(アローラ)' },
  { name: 'イーブイZ', type: 'ノーマル', Zmove: 'ナインエボルブースト', move: 'とっておき', pokemon: 'イーブイ' },
  { name: 'イワZ', type: 'いわ', Zmove: 'ワールズエンドフォール', move: '', pokemon: '' },
  { name: 'ウルトラネクロZ', type: 'エスパー', Zmove: 'てんこがすめつぼうのひかり', move: 'フォトンゲイザー', pokemon: 'ネクロズマ(ウルトラ)' },
  { name: 'エスパーZ', type: 'エスパー', Zmove: 'マキシマムサイブレイカー', move: '', pokemon: '' },
  { name: 'ガオガエンZ', type: 'あく', Zmove: 'ハイパーダーククラッシャー', move: 'DDラリアット', pokemon: 'ガオガエン' },
  { name: 'カクトウZ', type: 'かくとう', Zmove: 'ぜんりょくむそうげきれつけん', move: '', pokemon: '' },
  { name: 'カビゴンZ', type: 'ノーマル', Zmove: 'ほんきをだすこうげき', move: 'ギガインパクト', pokemon: 'カビゴン' },
  { name: 'カプZ', type: 'フェアリー', Zmove: 'ガーディアン・デ・アローラ', move: 'しぜんのいかり', pokemon: 'カプ・コケコ' },
  { name: 'カプZ', type: 'フェアリー', Zmove: 'ガーディアン・デ・アローラ', move: 'しぜんのいかり', pokemon: 'カプ・テテフ' },
  { name: 'カプZ', type: 'フェアリー', Zmove: 'ガーディアン・デ・アローラ', move: 'しぜんのいかり', pokemon: 'カプ・ブルル' },
  { name: 'カプZ', type: 'フェアリー', Zmove: 'ガーディアン・デ・アローラ', move: 'しぜんのいかり', pokemon: 'カプ・レヒレ' },
  { name: 'クサZ', type: 'くさ', Zmove: 'ブルームシャインエクストラ', move: '', pokemon: '' },
  { name: 'ゴーストZ', type: 'ゴースト', Zmove: 'むげんあんやへのいざない', move: '', pokemon: '' },
  { name: 'コオリZ', type: 'こおり', Zmove: 'レイジングジオフリーズ', move: '', pokemon: '' },
  { name: 'サトピカZ', type: '', Zmove: '', move: '', pokemon: '' },
  { name: 'ジメンZ', type: 'じめん', Zmove: 'ライジングランドオーバー', move: '', pokemon: '' },
  { name: 'ジャラランガZ', type: 'ドラゴン', Zmove: 'ブレイジングソウルビート', move: 'スケイルノイズ', pokemon: 'ジャラランガ' },
  { name: 'ジュナイパーZ', type: 'ゴースト', Zmove: 'シャドーアローズストライク', move: 'かげぬい', pokemon: 'ジュナイパー' },
  { name: 'ソルガレオZ', type: 'はがね', Zmove: 'サンシャインスマッシャー', move: 'メテオドライブ', pokemon: 'ソルガレオ' },
  { name: 'ソルガレオZ', type: 'はがね', Zmove: 'サンシャインスマッシャー', move: 'メテオドライブ', pokemon: 'ネクロズマ(日食)' },
  { name: 'デンキZ', type: 'でんき', Zmove: 'スパーキングギガボルト', move: '', pokemon: '' },
  { name: 'ドクZ', type: 'どく', Zmove: 'アシッドポイズンデリート', move: '', pokemon: '' },
  { name: 'ドラゴンZ', type: 'ドラゴン', Zmove: 'アルティメットドラゴンバーン', move: '', pokemon: '' },
  { name: 'ノーマルZ', type: 'ノーマル', Zmove: 'ウルトラダッシュアタック', move: '', pokemon: '' },
  { name: 'ハガネZ', type: 'はがね', Zmove: 'ちょうぜつらせんれんげき', move: '', pokemon: '' },
  { name: 'ピカチュウZ', type: 'でんき', Zmove: 'ひっさつのピカチュート', move: 'ボルテッカー', pokemon: 'ピカチュウ' },
  { name: 'ヒコウZ', type: 'ひこう', Zmove: 'ファイナルダイブクラッシュ', move: '', pokemon: '' },
  { name: 'フェアリーZ', type: 'フェアリー', Zmove: 'ラブリースターインパクト', move: '', pokemon: '' },
  { name: 'ホノオZ', type: 'ほのお', Zmove: 'ダイナミックフルフレイム', move: '', pokemon: '' },
  { name: 'マーシャドーZ', type: 'ゴースト', Zmove: 'しちせいだっこんたい', move: 'シャドースチール', pokemon: 'マーシャドー' },
  { name: 'ミズZ', type: 'みず', Zmove: 'スーパーアクアトルネード', move: '', pokemon: '' },
  { name: 'ミミッキュZ', type: 'フェアリー', Zmove: 'ぽかぽかフレンドタイム', move: 'じゃれつく', pokemon: 'ミミッキュ' },
  { name: 'ミュウZ', type: 'エスパー', Zmove: 'オリジンズスーパーノヴァ', move: 'サイコキネシス', pokemon: 'ミュウ' },
  { name: 'ムシZ', type: 'むし', Zmove: 'ぜったいほしょくかいてんざん', move: '', pokemon: '' },
  { name: 'ルガルガンZ', type: 'いわ', Zmove: 'ラジアルエッジストーム', move: 'ストーンエッジ', pokemon: 'ルガルガン(真昼)' },
  { name: 'ルガルガンZ', type: 'いわ', Zmove: 'ラジアルエッジストーム', move: 'ストーンエッジ', pokemon: 'ルガルガン(真夜中)' },
  { name: 'ルガルガンZ', type: 'いわ', Zmove: 'ラジアルエッジストーム', move: 'ストーンエッジ', pokemon: 'ルガルガン(黄昏)' },
  { name: 'ルナアーラZ', type: 'ゴースト', Zmove: 'ムーンライトブラスター', move: 'シャドーレイ', pokemon: 'ルナアーラ' },
  { name: 'ルナアーラZ', type: 'ゴースト', Zmove: 'ムーンライトブラスター', move: 'シャドーレイ', pokemon: 'ネクロズマ(月食)' }
]

// メガストーン
const megaStoneTable = [
  { name: 'アブソルナイト', pokemon: 'アブソル', mega: 'メガアブソル' },
  { name: 'エルレイドナイト', pokemon: 'エルレイド', mega: 'メガエルレイド' },
  { name: 'オニゴーリナイト', pokemon: 'オニゴーリ', mega: 'メガオニゴーリ' },
  { name: 'カイロスナイト', pokemon: 'カイロス', mega: 'メガカイロス' },
  { name: 'ガブリアスナイト', pokemon: 'ガブリアス', mega: 'メガガブリアス' },
  { name: 'カメックスナイト', pokemon: 'カメックス', mega: 'メガカメックス' },
  { name: 'ガルーラナイト', pokemon: 'ガルーラ', mega: 'メガガルーラ' },
  { name: 'ギャラドスナイト', pokemon: 'ギャラドス', mega: 'メガギャラドス' },
  { name: 'クチートナイト', pokemon: 'クチート', mega: 'メガクチート' },
  { name: 'ゲンガナイト', pokemon: 'ゲンガー', mega: 'メガゲンガー' },
  { name: 'サーナイトナイト', pokemon: 'サーナイト', mega: 'メガサーナイト' },
  { name: 'サメハダナイト', pokemon: 'サメハダー', mega: 'メガサメハダー' },
  { name: 'ジュカインナイト', pokemon: 'ジュカイン', mega: 'メガジュカイン' },
  { name: 'ジュペッタナイト', pokemon: 'ジュペッタ', mega: 'メガジュペッタ' },
  { name: 'スピアナイト', pokemon: 'スピアー', mega: 'メガスピアー' },
  { name: 'タブンネナイト', pokemon: 'タブンネ', mega: 'メガタブンネ' },
  { name: 'チャーレムナイト', pokemon: 'チャーレム', mega: 'メガチャーレム' },
  { name: 'チルタリスナイト', pokemon: 'チルタリス', mega: 'メガチルタリス' },
  { name: 'ディアンシナイト', pokemon: 'ディアンシー', mega: 'メガディアンシー' },
  { name: 'デンリュウナイト', pokemon: 'デンリュウ', mega: 'メガデンリュウ' },
  { name: 'ハガネールナイト', pokemon: 'ハガネール', mega: 'メガハガネール' },
  { name: 'バクーダナイト', pokemon: 'バクーダ', mega: 'メガバクーダ' },
  { name: 'バシャーモナイト', pokemon: 'バシャーモ', mega: 'メガバシャーモ' },
  { name: 'ハッサムナイト', pokemon: 'ハッサム', mega: 'メガハッサム' },
  { name: 'バンギラスナイト', pokemon: 'バンギラス', mega: 'メガバンギラス' },
  { name: 'ピジョットナイト', pokemon: 'ピジョット', mega: 'メガピジョット' },
  { name: 'フーディナイト', pokemon: 'フーディン', mega: 'メガフーディン' },
  { name: 'フシギバナイト', pokemon: 'フシギバナ', mega: 'メガフシギバナ' },
  { name: 'プテラナイト', pokemon: 'プテラ', mega: 'メガプテラ' },
  { name: 'ヘラクロスナイト', pokemon: 'ヘラクロス', mega: 'メガヘラクロス' },
  { name: 'ヘルガナイト', pokemon: 'ヘルガー', mega: 'メガヘルガー' },
  { name: 'ボーマンダナイト', pokemon: 'ボーマンダ', mega: 'メガボーマンダ' },
  { name: 'ボスゴドラナイト', pokemon: 'ボスゴドラ', mega: 'メガボスゴドラ' },
  { name: 'ミミロップナイト', pokemon: 'ミミロップ', mega: 'メガミミロップ' },
  { name: 'ミュウツナイトX', pokemon: 'ミュウツー', mega: 'メガミュウーツーX' },
  { name: 'ミュウツナイトY', pokemon: 'ミュウツー', mega: 'メガミュウツーY' },
  { name: 'メタグロスナイト', pokemon: 'メタグロス', mega: 'メガメタグロス' },
  { name: 'ヤドランナイト', pokemon: 'ヤドラン', mega: 'メガヤドラン' },
  { name: 'ヤミラミナイト', pokemon: 'ヤミラミ', mega: 'メガヤミラミ' },
  { name: 'ユキノオナイト', pokemon: 'ユキノオー', mega: 'メガユキノオー' },
  { name: 'ライボルトナイト', pokemon: 'ライボルト', mega: 'メガライボルト' },
  { name: 'ラグラージナイト', pokemon: 'ラグラージ', mega: 'メガラグラージ' },
  { name: 'ラティアスナイト', pokemon: 'ラティアス', mega: 'メガラティアス' },
  { name: 'ラティオスナイト', pokemon: 'ラティオス', mega: 'メガラティオス' },
  { name: 'リザードナイトX', pokemon: 'リザードンX', mega: 'メガリザードンX' },
  { name: 'リザードナイトY', pokemon: 'リザードンY', mega: 'メガリザードンY' },
  { name: 'ルカリオナイト', pokemon: 'ルカリオ', mega: 'メガルカリオ' },
]

// 追加効果のある技（対象のランクを変化させる）
const additionalEffectTargetRank: AdditionalEffectRank[] = [
  { name: 'オーロラビーム', rate: 10, change: { attack: -1, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'じゃれつく', rate: 10, change: { attack: -1, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'はるのあらし', rate: 30, change: { attack: -1, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'うらみつらみ', rate: 100, change: { attack: -1, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'とびかかる', rate: 100, change: { attack: -1, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'トロピカルキック', rate: 100, change: { attack: -1, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ひやみず', rate: 100, change: { attack: -1, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ワイドブレイカー', rate: 100, change: { attack: -1, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'アクアブレイク', rate: 20, change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'かみくだく', rate: 20, change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'シャドーボーン', rate: 20, change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'アイアンテール', rate: 30, change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: '3ぼんのや', rate: 50, change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'いわくだき', rate: 50, change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'シェルブレード', rate: 50, change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ブレイククロー', rate: 50, change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'Gのちから', rate: 100, change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ほのおのムチ', rate: 100, change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'らいめいげり', rate: 100, change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ムーンフォース', rate: 30, change: { attack: 0, defense: 0, specialAttack: -1, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ミストボール', rate: 50, change: { attack: 0, defense: 0, specialAttack: -1, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ソウルクラッシュ', rate: 100, change: { attack: 0, defense: 0, specialAttack: -1, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'バークアウト', rate: 100, change: { attack: 0, defense: 0, specialAttack: -1, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'はいよるいちげき', rate: 100, change: { attack: 0, defense: 0, specialAttack: -1, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'マジカルフレイム', rate: 100, change: { attack: 0, defense: 0, specialAttack: -1, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'むしのていこう', rate: 100, change: { attack: 0, defense: 0, specialAttack: -1, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'エナジーボール', rate: 10, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'きあいだま', rate: 10, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'サイコキネシス', rate: 10, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'シードフレア', rate: 40, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -2, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'シャドーボール', rate: 20, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'だいちのちから', rate: 10, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'むしのさざめき', rate: 10, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ようかいえき', rate: 10, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ラスターカノン', rate: 10, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ラスターパージ', rate: 50, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'アシッドボム', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -2, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'りんごさん', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ルミナコリジョン', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: -2, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'あわ', rate: 10, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'エレキネット', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'からみつく', rate: 10, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'がんせきふうじ', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'こがらしあらし', rate: 30, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'こごえるかぜ', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'こごえるせかい', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'じならし', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'とびつく', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'ドラムアタック', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'バブルこうせん', rate: 10, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'マッドショット', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'ローキック', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'オクタンほう', rate: 50, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: -1, evasion: 0 } },
  { name: 'グラスミキサー', rate: 50, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: -1, evasion: 0 } },
  { name: 'だくりゅう', rate: 30, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: -1, evasion: 0 } },
  { name: 'どろかけ', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: -1, evasion: 0 } },
  { name: 'どろばくだん', rate: 30, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: -1, evasion: 0 } },
  { name: 'ナイトバースト', rate: 40, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: -1, evasion: 0 } },
  { name: 'ミラーショット', rate: 30, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: -1, evasion: 0 } },
]

// 追加効果のある技（自分のランクを変化させる）
const additionalEffectMyRank: AdditionalEffectRank[] = [
  { name: 'メタルクロー', rate: 10, change: { attack: 1, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'コメットパンチ', rate: 20, change: { attack: 1, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'グロウパンチ', rate: 100, change: { attack: 1, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'はがねのつばさ', rate: 10, change: { attack: 0, defense: 1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ダイヤストーム', rate: 50, change: { attack: 0, defense: 2, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'バリアーラッシュ', rate: 100, change: { attack: 0, defense: 1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ほのおのまい', rate: 50, change: { attack: 0, defense: 0, specialAttack: 1, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'チャージビーム', rate: 70, change: { attack: 0, defense: 0, specialAttack: 1, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'しんぴのちから', rate: 100, change: { attack: 0, defense: 0, specialAttack: 1, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'フレアソング', rate: 100, change: { attack: 0, defense: 0, specialAttack: 1, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'アクアステップ', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 1, accuracy: 0, evasion: 0 } },
  { name: 'オーラウイング', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 1, accuracy: 0, evasion: 0 } },
  { name: 'オーラぐるま', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 1, accuracy: 0, evasion: 0 } },
  { name: 'くさわけ', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 1, accuracy: 0, evasion: 0 } },
  { name: 'こうそくスピン', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 1, accuracy: 0, evasion: 0 } },
  { name: 'ニトロチャージ', rate: 100, change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 1, accuracy: 0, evasion: 0 } },
  { name: 'あやしいかぜ', rate: 10, change: { attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1, accuracy: 0, evasion: 0 } },
  { name: 'げんしのちから', rate: 10, change: { attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1, accuracy: 0, evasion: 0 } },
  { name: 'ぎんいろのかぜ', rate: 10, change: { attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1, accuracy: 0, evasion: 0 } },
  { name: 'ブレイジングソウルビート', rate: 100, change: { attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1, accuracy: 0, evasion: 0 } },
]

// 追加効果のある技（対象をひるみ状態にさせる）
const additionalEffectFlinch = [
  { name: '3ぼんのや', rate: 30 },
  { name: 'アイアンヘッド', rate: 30 },
  { name: 'あくのはどう', rate: 20 },
  { name: 'いびき', rate: 30 },
  { name: 'いわなだれ', rate: 30 },
  { name: 'エアスラッシュ', rate: 30 },
  { name: 'おどろかす', rate: 30 },
  { name: 'かみつく', rate: 30 },
  { name: 'かみなりのキバ', rate: 10 },
  { name: 'けたぐり', rate: 30 },
  { name: 'こおりのキバ', rate: 10 },
  { name: 'ゴッドバード', rate: 30 },
  { name: 'しねんのずつき', rate: 20 },
  { name: 'じんつうりき', rate: 10 },
  { name: 'ずつき', rate: 30 },
  { name: 'たきのぼり', rate: 20 },
  { name: 'たつまき', rate: 20 },
  { name: 'ダブルパンツァー', rate: 30 },
  { name: 'つららおとし', rate: 30 },
  { name: 'ドラゴンダイブ', rate: 20 },
  { name: 'ニードルアーム', rate: 30 },
  { name: 'ねこだまし', rate: 100 },
  { name: 'ハートスタンプ', rate: 30 },
  { name: 'ハードローラー', rate: 30 },
  { name: 'ひっさつまえば', rate: 10 },
  { name: 'ひょうざんおろし', rate: 30 },
  { name: 'びりびりちくちく', rate: 30 },
  { name: 'ふみつけ', rate: 30 },
  { name: 'ふわふわフォール', rate: 30 },
  { name: 'ホネこんぼう', rate: 10 },
  { name: 'ほのおのキバ', rate: 10 },
  { name: 'まわしげり', rate: 30 },
  { name: 'もえあがるいかり', rate: 20 },
]

// 追加効果のある技（対象を状態異常にさせる）
const additionalEffectAilment = [
  { name: '10まんボルト', rate: 10, ailment: 'まひ' },
  { name: 'かみなり', rate: 30, ailment: 'まひ' },
  { name: 'かみなりあらし', rate: 20, ailment: 'まひ' },
  { name: 'かみなりのキバ', rate: 10, ailment: 'まひ' },
  { name: 'かみなりパンチ', rate: 10, ailment: 'まひ' },
  { name: 'ざぶざぶサーフ', rate: 30, ailment: 'まひ' },
  { name: 'スパーク', rate: 30, ailment: 'まひ' },
  { name: 'でんきショック', rate: 10, ailment: 'まひ' },
  { name: 'でんじほう', rate: 100, ailment: 'まひ' },
  { name: 'とびはねる', rate: 30, ailment: 'まひ' },
  { name: 'のしかかり', rate: 30, ailment: 'まひ' },
  { name: 'はっけい', rate: 30, ailment: 'まひ' },
  { name: 'びりびりエレキ', rate: 100, ailment: 'まひ' },
  { name: 'ファイトアクセル', rate: 30, ailment: 'まひ' },
  { name: 'フリーズボルト', rate: 30, ailment: 'まひ' },
  { name: 'ほうでん', rate: 30, ailment: 'まひ' },
  { name: 'ほっぺすりすり', rate: 100, ailment: 'まひ' },
  { name: 'ボルテッカー', rate: 10, ailment: 'まひ' },
  { name: 'らいげき', rate: 20, ailment: 'まひ' },
  { name: 'ライトニングサーフライド', rate: 100, ailment: 'まひ' },
  { name: 'りゅうのいぶき', rate: 30, ailment: 'まひ' },
  { name: 'いてつくしせん', rate: 10, ailment: 'こおり' },
  { name: 'こおりのキバ', rate: 10, ailment: 'こおり' },
  { name: 'こなゆき', rate: 10, ailment: 'こおり' },
  { name: 'ふぶき', rate: 10, ailment: 'こおり' },
  { name: 'フリーズドライ', rate: 10, ailment: 'こおり' },
  { name: 'れいとうパンチ', rate: 10, ailment: 'こおり' },
  { name: 'れいとうビーム', rate: 10, ailment: 'こおり' },
  { name: 'かえんだん', rate: 30, ailment: 'やけど' },
  { name: 'かえんほうしゃ', rate: 10, ailment: 'やけど' },
  { name: 'かえんボール', rate: 10, ailment: 'やけど' },
  { name: 'コールドフレア', rate: 30, ailment: 'やけど' },
  { name: 'スチームバースト', rate: 30, ailment: 'やけど' },
  { name: 'せいなるほのお', rate: 50, ailment: 'やけど' },
  { name: 'だいもんじ', rate: 30, ailment: 'やけど' },
  { name: 'ねっさのあらし', rate: 20, ailment: 'やけど' },
  { name: 'ねっさのだいち', rate: 30, ailment: 'やけど' },
  { name: 'ねっとう', rate: 30, ailment: 'やけど' },
  { name: 'ねっぷう', rate: 10, ailment: 'やけど' },
  { name: 'バーンアクセル', rate: 30, ailment: 'やけど' },
  { name: 'ひのこ', rate: 10, ailment: 'やけど' },
  { name: 'ひゃっきやこう', rate: 30, ailment: 'やけど' },
  { name: 'ブレイズキック', rate: 10, ailment: 'やけど' },
  { name: 'ふんえん', rate: 30, ailment: 'やけど' },
  { name: 'ほのおのキバ', rate: 10, ailment: 'やけど' },
  { name: 'ほのおのパンチ', rate: 10, ailment: 'やけど' },
  { name: 'めらめらバーン', rate: 100, ailment: 'やけど' },
  { name: 'れんごく', rate: 100, ailment: 'やけど' },
  { name: 'キラースピン', rate: 100, ailment: 'どく' },
  { name: 'クロスポイズン', rate: 10, ailment: 'どく' },
  { name: 'シェルアームズ', rate: 20, ailment: 'どく' },
  { name: 'スモッグ', rate: 40, ailment: 'どく' },
  { name: 'ダストシュート', rate: 30, ailment: 'どく' },
  { name: 'ダブルニードル', rate: 20, ailment: 'どく' },
  { name: 'どくづき', rate: 30, ailment: 'どく' },
  { name: 'どくばり', rate: 30, ailment: 'どく' },
  { name: 'どくばりセンボン', rate: 50, ailment: 'どく' },
  { name: 'ヘドロウェーブ', rate: 10, ailment: 'どく' },
  { name: 'ヘドロこうげき', rate: 30, ailment: 'どく' },
  { name: 'ヘドロばくだん', rate: 30, ailment: 'どく' },
  { name: 'ポイズンアクセル', rate: 30, ailment: 'どく' },
  { name: 'ポイズンテール', rate: 10, ailment: 'どく' },
  { name: 'どくどくのキバ', rate: 50, ailment: 'もうどく' },
  { name: 'いにしえのうた', rate: 10, ailment: 'ねむり' },
]

const additionalEffectConfuse = [
  { name: 'おしゃべり', rate: 100 },
  { name: 'かかとおとし', rate: 30 },
  { name: 'サイケこうせん', rate: 10 },
  { name: 'シグナルビーム', rate: 10 },
  { name: 'ねんりき', rate: 10 },
  { name: 'ばくれつパンチ', rate: 100 },
  { name: 'ぼうふう', rate: 30 },
  { name: 'ピヨピヨパンチ', rate: 20 },
  { name: 'マジカルアクセル', rate: 30 },
  { name: 'みずのはどう', rate: 20 },
  { name: 'ロッククライム', rate: 20 },
  { name: 'ワンダースチーム', rate: 20 },
]

const additionalEffectOthers = [
  'アンカーショット',
  'いっちょうあがり',
  'うたかたのアリア',
  'オリジンズスーパーノヴァ',
  'かげぬい',
  'がんせきアックス',
  'ジェットパンチ',
  'しおづけ',
  'じごくづき',
  'しっとのほのお',
  'トライアタック',
  'ひけん・ちえなみ',
  'ひみつのちから',
  'フェイタルクロー',
  'ぶきみなじゅもん',
]

const berryTable = [
  { number: 1, name: 'クラボのみ', half: null, fling: true, naturalGift: { type: 'ほのお', power: 80 } },
  { number: 2, name: 'カゴのみ', half: null, fling: true, naturalGift: { type: 'みず', power: 80 } },
  { number: 3, name: 'モモンのみ', half: null, fling: true, naturalGift: { type: 'でんき', power: 80 } },
  { number: 4, name: 'チーゴのみ', half: null, fling: true, naturalGift: { type: 'くさ', power: 80 } },
  { number: 5, name: 'ナナシのみ', half: null, fling: true, naturalGift: { type: 'こおり', power: 80 } },
  { number: 6, name: 'ヒメリのみ', half: null, fling: true, naturalGift: { type: 'かくとう', power: 80 } },
  { number: 7, name: 'オレンのみ', half: null, fling: true, naturalGift: { type: 'どく', power: 80 } },
  { number: 8, name: 'キーのみ', half: null, fling: true, naturalGift: { type: 'じめん', power: 80 } },
  { number: 9, name: 'ラムのみ', half: null, fling: true, naturalGift: { type: 'ひこう', power: 80 } },
  { number: 10, name: 'オボンのみ', half: null, fling: true, naturalGift: { type: 'エスパー', power: 80 } },
  { number: 11, name: 'フィラのみ', half: null, fling: true, naturalGift: { type: 'ほのお', power: 80 } },
  { number: 12, name: 'ウイのみ', half: null, fling: true, naturalGift: { type: 'いわ', power: 80 } },
  { number: 13, name: 'マゴのみ', half: null, fling: true, naturalGift: { type: 'ゴースト', power: 80 } },
  { number: 14, name: 'バンジのみ', half: null, fling: true, naturalGift: { type: 'ドラゴン', power: 80 } },
  { number: 15, name: 'イアのみ', half: null, fling: true, naturalGift: { type: 'あく', power: 80 } },
  { number: 16, name: 'ズリのみ', half: null, fling: false, naturalGift: { type: 'はがね', power: 80 } },
  { number: 17, name: 'ブリーのみ', half: null, fling: false, naturalGift: { type: 'ほのお', power: 90 } },
  { number: 18, name: 'ナナのみ', half: null, fling: false, naturalGift: { type: 'みず', power: 90 } },
  { number: 19, name: 'セシナのみ', half: null, fling: false, naturalGift: { type: 'でんき', power: 90 } },
  { number: 20, name: 'パイルのみ', half: null, fling: false, naturalGift: { type: 'くさ', power: 90 } },
  { number: 21, name: 'ザロクのみ', half: null, fling: false, naturalGift: { type: 'こおり', power: 90 } },
  { number: 22, name: 'ネコブのみ', half: null, fling: false, naturalGift: { type: 'かくとう', power: 90 } },
  { number: 23, name: 'タポルのみ', half: null, fling: false, naturalGift: { type: 'どく', power: 90 } },
  { number: 24, name: 'ロメのみ', half: null, fling: false, naturalGift: { type: 'じめん', power: 90 } },
  { number: 25, name: 'ウブのみ', half: null, fling: false, naturalGift: { type: 'ひこう', power: 90 } },
  { number: 26, name: 'マトマのみ', half: null, fling: false, naturalGift: { type: 'エスパー', power: 90 } },
  { number: 27, name: 'モコシのみ', half: null, fling: false, naturalGift: { type: 'むし', power: 90 } },
  { number: 28, name: 'ゴスのみ', half: null, fling: false, naturalGift: { type: 'いわ', power: 90 } },
  { number: 29, name: 'ラブタのみ', half: null, fling: false, naturalGift: { type: 'ゴースト', power: 90 } },
  { number: 30, name: 'ノメルのみ', half: null, fling: false, naturalGift: { type: 'ドラゴン', power: 90 } },
  { number: 31, name: 'ノワキのみ', half: null, fling: false, naturalGift: { type: 'あく', power: 90 } },
  { number: 32, name: 'シーヤのみ', half: null, fling: false, naturalGift: { type: 'はがね', power: 90 } },
  { number: 33, name: 'カイスのみ', half: null, fling: false, naturalGift: { type: 'ほのお', power: 100 } },
  { number: 34, name: 'ドリのみ', half: null, fling: false, naturalGift: { type: 'みず', power: 100 } },
  { number: 35, name: 'ベリブのみ', half: null, fling: false, naturalGift: { type: 'でんき', power: 100 } },
  { number: 36, name: 'オッカのみ', half: 'ほのお', fling: false, naturalGift: { type: 'ほのお', power: 80 } },
  { number: 37, name: 'イトケのみ', half: 'みず', fling: false, naturalGift: { type: 'みず', power: 80 } },
  { number: 38, name: 'ソクノのみ', half: 'でんき', fling: false, naturalGift: { type: 'でんき', power: 80 } },
  { number: 39, name: 'リンドのみ', half: 'くさ', fling: false, naturalGift: { type: 'くさ', power: 80 } },
  { number: 40, name: 'ヤチェのみ', half: 'こおり', fling: false, naturalGift: { type: 'こおり', power: 80 } },
  { number: 41, name: 'ヨプのみ', half: 'かくとう', fling: false, naturalGift: { type: 'かくとう', power: 80 } },
  { number: 42, name: 'ビアーのみ', half: 'どく', fling: false, naturalGift: { type: 'どく', power: 80 } },
  { number: 43, name: 'シュカのみ', half: 'じめん', fling: false, naturalGift: { type: 'じめん', power: 80 } },
  { number: 44, name: 'バコウのみ', half: 'ひこう', fling: false, naturalGift: { type: 'ひこう', power: 80 } },
  { number: 45, name: 'ウタンのみ', half: 'エスパー', fling: false, naturalGift: { type: 'エスパー', power: 80 } },
  { number: 46, name: 'タンガのみ', half: 'むし', fling: false, naturalGift: { type: 'むし', power: 80 } },
  { number: 47, name: 'ヨロギのみ', half: 'いわ', fling: false, naturalGift: { type: 'いわ', power: 80 } },
  { number: 48, name: 'カシブのみ', half: 'ゴースト', fling: false, naturalGift: { type: 'ゴースト', power: 80 } },
  { number: 49, name: 'ハバンのみ', half: 'ドラゴン', fling: false, naturalGift: { type: 'ドラゴン', power: 80 } },
  { number: 50, name: 'ナモのみ', half: 'あく', fling: false, naturalGift: { type: 'あく', power: 80 } },
  { number: 51, name: 'リリバのみ', half: 'はがね', fling: false, naturalGift: { type: 'はがね', power: 80 } },
  { number: 52, name: 'ホズのみ', half: 'ノーマル', fling: false, naturalGift: { type: 'ノーマル', power: 80 } },
  { number: 53, name: 'チイラのみ', half: null, fling: true, naturalGift: { type: 'くさ', power: 100 } },
  { number: 54, name: 'リュガのみ', half: null, fling: true, naturalGift: { type: 'こおり', power: 100 } },
  { number: 55, name: 'カムラのみ', half: null, fling: true, naturalGift: { type: 'かくとう', power: 100 } },
  { number: 56, name: 'ヤタピのみ', half: null, fling: true, naturalGift: { type: 'どく', power: 100 } },
  { number: 57, name: 'ズアのみ', half: null, fling: true, naturalGift: { type: 'じめん', power: 100 } },
  { number: 58, name: 'サンのみ', half: null, fling: true, naturalGift: { type: 'ひこう', power: 100 } },
  { number: 59, name: 'スターのみ', half: null, fling: true, naturalGift: { type: 'エスパー', power: 100 } },
  { number: 60, name: 'ナゾのみ', half: null, fling: false, naturalGift: { type: 'むし', power: 100 } },
  { number: 61, name: 'ミクルのみ', half: null, fling: true, naturalGift: { type: 'いわ', power: 100 } },
  { number: 62, name: 'イバンのみ', half: null, fling: false, naturalGift: { type: 'ゴースト', power: 100 } },
  { number: 63, name: 'ジャポのみ', half: null, fling: false, naturalGift: { type: 'ドラゴン', power: 100 } },
  { number: 64, name: 'レンブのみ', half: null, fling: false, naturalGift: { type: 'あく', power: 100 } },
  { number: 65, name: 'ロゼルのみ', half: 'フェアリー', fling: false, naturalGift: { type: 'フェアリー', power: 80 } },
  { number: 66, name: 'アッキのみ', half: null, fling: true, naturalGift: { type: 'フェアリー', power: 100 } },
  { number: 67, name: 'タラプのみ', half: null, fling: true, naturalGift: { type: 'あく', power: 100 } },
]

const moveEffectMyRank: MoveEffectRank[] = [
  { name: 'アーマーキャノン', change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'アームハンマー', change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'アイスハンマー', change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'いじげんラッシュ', change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'インファイト', change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'オーバーヒート', change: { attack: 0, defense: 0, specialAttack: -2, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ガリョウテンセイ', change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ゴールドラッシュ', change: { attack: 0, defense: 0, specialAttack: -1, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'サイコブースト', change: { attack: 0, defense: 0, specialAttack: -2, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'スケイルショット', change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 1, accuracy: 0, evasion: 0 } },
  { name: 'スケイルノイズ', change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ばかぢから', change: { attack: -1, defense: -1, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'Vジェネレート', change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: -1, speed: -1, accuracy: 0, evasion: 0 } },
  { name: 'ぶちかまし', change: { attack: 0, defense: -1, specialAttack: 0, specialDefense: -1, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'フルールカノン', change: { attack: 0, defense: 0, specialAttack: -2, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'ホイールスピン', change: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: -2, accuracy: 0, evasion: 0 } },
  { name: 'リーフストーム', change: { attack: 0, defense: 0, specialAttack: -2, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
  { name: 'りゅうせいぐん', change: { attack: 0, defense: 0, specialAttack: -2, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 } },
]

// 連続攻撃技
const continuousAttackMoveList = [
  { name: 'ギアソーサー', count: 2 },
  { name: 'ダブルアタック', count: 2 },
  { name: 'ダブルウィング', count: 2 },
  { name: 'ダブルチョップ', count: 2 },
  { name: 'ダブルニードル', count: 2 },
  { name: 'ダブルパンツァー', count: 2 },
  { name: 'ツインビーム', count: 2 },
  { name: 'ドラゴンアロー', count: 2 },
  { name: 'にどげり', count: 2 },
  { name: 'ホネブーメラン', count: 2 },
  { name: 'すいりゅうれんだ', count: 3 },
  { name: 'トリプルダイブ', count: 3 },
  { name: 'おうふくビンタ', count: 5 },
  { name: 'スイープビンタ', count: 5 },
  { name: 'スケイルショット', count: 5 },
  { name: 'タネマシンガン', count: 5 },
  { name: 'たまなげ', count: 5 },
  { name: 'つっぱり', count: 5 },
  { name: 'つららばり', count: 5 },
  { name: 'とげキャノン', count: 5 },
  { name: 'ボーンラッシュ', count: 5 },
  { name: 'ミサイルばり', count: 5 },
  { name: 'みずしゅりけん', count: 5 },
  { name: 'みだれづき', count: 5 },
  { name: 'みだれひっかき', count: 5 },
  { name: 'れんぞくパンチ', count: 5 },
  { name: 'ロックブラスト', count: 5 },
  { name: 'トリプルキック', count: 1 },
  { name: 'トリプルアクセル', count: 1 },
  { name: 'ネズミざん', count: 10 },
  { name: 'ふくろだたき', count: 0 },
]

// 与ダメージ依存反動技
const dependentRecoilMoveList = [
  { name: 'アフロブレイク', rate: 0.25 },
  { name: 'ウェーブタックル', rate: 0.33 },
  { name: 'ウッドハンマー', rate: 0.33 },
  { name: 'じごくぐるま', rate: 0.25 },
  { name: 'すてみタックル', rate: 0.33 },
  { name: 'とっしん', rate: 0.25 },
  { name: 'はめつのひかり', rate: 0.50 },
  { name: 'フレアドライブ', rate: 0.33 },
  { name: 'ブレイブバード', rate: 0.33 },
  { name: 'ボルテッカー', rate: 0.33 },
  { name: 'もろはのずつき', rate: 0.50 },
  { name: 'ワイルドボルト', rate: 0.25 },
]

// 与ダメージ非依存反動技
const independentRecoilMoveList = [
  { name: 'クロロブラスト', rate: 0.50 },
  { name: 'わるあがき', rate: 0.25 }
]

const formChangeTable = [
  { name: 'ミミッキュ(化けた姿)', next: 'ミミッキュ(ばれた姿)' },
  { name: 'コオリッポ(アイス)', next: 'コオリッポ(ナイス)' },
  { name: 'コオリッポ(ナイス)', next: 'コオリッポ(アイス)' },
  { name: 'ウッウ(鵜呑み)', next: 'ウッウ' },
  { name: 'ウッウ(丸呑み)', next: 'ウッウ' },
  { name: 'メロエッタ(ボイス)', next: 'メロエッタ(ステップ)' },
  { name: 'メロエッタ(ステップ)', next: 'メロエッタ(ボイス)' },
  { name: 'ギルガルド(盾)', next: 'ギルガルド(剣)' },
  { name: 'ギルガルド(剣)', next: 'ギルガルド(盾)' },
  { name: 'モルペコ(満腹)', next: 'モルペコ(空腹)' },
  { name: 'モルペコ(空腹)', next: 'モルペコ(満腹)' },
]
/*
ポワルン (通常の姿⇔たいようのすがた⇔あまみずのすがた⇔ゆきぐものすがた | てんき)
チェリム (ネガフォルム⇔ポジフォルム | ひざしがつよい・特性フラワーギフト[1])
シェイミ (スカイフォルム⇒ランドフォルム | こおり状態)
ヒヒダルマ (ノーマルモード⇔ダルマモード | 特性ダルマモード)
メロエッタ (ボイスフォルム⇔ステップフォルム | 技いにしえのうたの成功)
ゲッコウガ (通常の姿⇒サトシゲッコウガ | 特性きずなへんげ)
ギルガルド (シールドフォルム⇔ブレードフォルム | 特性バトルスイッチ)
ジガルデ (10%フォルム/50%フォルム⇒パーフェクトフォルム | 特性スワームチェンジ)[2]
ヨワシ (たんどくのすがた⇔むれたすがた | 特性ぎょぐん)
メテノ (コアのすがた⇔りゅうせいのすがた | 特性リミットシールド)
ミミッキュ (ばけたすがた⇒ばれたすがた | 特性ばけのかわ)
モルペコ (まんぷくもよう⇔はらぺこもよう | 特性はらぺこスイッチ)
ウッウ (通常の姿⇔うのみのすがた | 技なみのり・ダイビング)
コオリッポ (アイスフェイス⇔ナイスフェイス | 特性アイスフェイス)
イルカマン (ナイーブフォルム⇔マイティフォルム | 特性マイティチェンジ)
*/

const paradoxPokemonList = [
  'イダイナキバ',
  'サケブシッポ',
  'アラブルタケ',
  'ハバタクカミ',
  'チヲハウハネ',
  'スナノケガワ',
  'トドロクツキ',
  'コライドン',
  'ウネルミナモ',
  'テツノワダチ',
  'テツノツツミ',
  'テツノカイナ',
  'テツノドクガ',
  'テツノイバラ',
  'テツノブジン',
  'ミライドン',
  'テツノイサハ'
]

const protectMoveList = [
  'まもる',
  'こらえる',
  'みきり',
  'ニードルガード',
  'キングシールド',
  'トーチカ',
  'ブロッキング',
  'ダイウォール'
]

const storeMoveList: string[] = [
  'かまいたち',
  'コールドフレア',
  'ゴッドバード',
  'ジオコントロール',
  'ソーラービーム',
  'ソーラブレード',
  'フリーズボルト',
  'メテオビーム',
  'ロケットずつき',
  'あなをほる',
  'そらをとぶ',
  'とびはねる',
  'フリーフォール',
  'ダイビング',
  'ゴーストダイブ',
  'シャドーダイブ'
]

const notMaxGuardMoveList: string[] = [
  'アシストギア',
  'おちゃかい',
  'じこあんじ',
  'じばそうさ',
  'テクスチャー2',
  'とおせんぼう',
  'フラワーガード',
  'へんしん',
  'ゴーストダイブ',
  'シャドーダイブ'
]
