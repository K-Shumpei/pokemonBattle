"use strict";
// ポケモン
const myAllParty = [
    new Pokemon,
    new Pokemon,
    new Pokemon,
    new Pokemon,
    new Pokemon,
    new Pokemon
];
const opponentAllParty = [
    new Pokemon,
    new Pokemon,
    new Pokemon,
    new Pokemon,
    new Pokemon,
    new Pokemon
];
const myParty = [];
const opponentParty = [];
// フィールド
const fieldStatus = new Field;
// 乱数
let randomList = [];
const parameterSix = [
    'hitPoint',
    'attack',
    'defense',
    'specialAttack',
    'specialDefense',
    'speed'
];
const parameterFive = [
    'attack',
    'defense',
    'specialAttack',
    'specialDefense',
    'speed'
];
const natureData = [
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
];
// タイプのカラーコード
// https://wiki.xn--rckteqa2e.com/wiki/%E3%82%AB%E3%83%86%E3%82%B4%E3%83%AA:%E8%89%B2%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88_%E3%82%BF%E3%82%A4%E3%83%97%E5%88%A5
const typeColor = [
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
];
// タイプ相性
const typeCompatibility = [
    { attackType: 'normal', rate: { normal: 1.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 1.0, fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0, bug: 1.0, rock: 0.5, ghost: 0.0, dragon: 1.0, dark: 1.0, steel: 0.5, fairy: 1.0 } },
    { attackType: 'fire', rate: { normal: 1.0, fire: 0.5, water: 0.5, electric: 1.0, grass: 2.0, ice: 2.0, fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0, bug: 2.0, rock: 0.5, ghost: 1.0, dragon: 0.5, dark: 1.0, steel: 2.0, fairy: 1.0 } },
    { attackType: 'water', rate: { normal: 1.0, fire: 2.0, water: 0.5, electric: 1.0, grass: 0.5, ice: 1.0, fighting: 1.0, poison: 1.0, ground: 2.0, flying: 1.0, psychic: 1.0, bug: 1.0, rock: 2.0, ghost: 1.0, dragon: 0.5, dark: 1.0, steel: 1.0, fairy: 1.0 } },
    { attackType: 'electric', rate: { normal: 1.0, fire: 1.0, water: 2.0, electric: 0.5, grass: 0.5, ice: 1.0, fighting: 1.0, poison: 1.0, ground: 0.0, flying: 2.0, psychic: 1.0, bug: 1.0, rock: 1.0, ghost: 1.0, dragon: 0.5, dark: 1.0, steel: 1.0, fairy: 1.0 } },
    { attackType: 'grass', rate: { normal: 1.0, fire: 0.5, water: 2.0, electric: 1.0, grass: 0.5, ice: 1.0, fighting: 1.0, poison: 0.5, ground: 2.0, flying: 0.5, psychic: 1.0, bug: 0.5, rock: 2.0, ghost: 1.0, dragon: 0.5, dark: 1.0, steel: 0.5, fairy: 1.0 } },
    { attackType: 'ice', rate: { normal: 1.0, fire: 0.5, water: 0.5, electric: 1.0, grass: 2.0, ice: 0.5, fighting: 1.0, poison: 1.0, ground: 2.0, flying: 2.0, psychic: 1.0, bug: 1.0, rock: 1.0, ghost: 1.0, dragon: 2.0, dark: 1.0, steel: 0.5, fairy: 1.0 } },
    { attackType: 'fighting', rate: { normal: 2.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 2.0, fighting: 1.0, poison: 0.5, ground: 1.0, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2.0, ghost: 0.0, dragon: 1.0, dark: 2.0, steel: 2.0, fairy: 0.5 } },
    { attackType: 'poison', rate: { normal: 1.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 2.0, ice: 1.0, fighting: 1.0, poison: 0.5, ground: 0.5, flying: 1.0, psychic: 1.0, bug: 1.0, rock: 0.5, ghost: 0.5, dragon: 1.0, dark: 1.0, steel: 0.0, fairy: 2.0 } },
    { attackType: 'ground', rate: { normal: 1.0, fire: 2.0, water: 1.0, electric: 2.0, grass: 0.5, ice: 1.0, fighting: 1.0, poison: 2.0, ground: 1.0, flying: 0.0, psychic: 1.0, bug: 0.5, rock: 2.0, ghost: 1.0, dragon: 1.0, dark: 1.0, steel: 2.0, fairy: 1.0 } },
    { attackType: 'flying', rate: { normal: 1.0, fire: 1.0, water: 1.0, electric: 0.5, grass: 2.0, ice: 1.0, fighting: 2.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0, bug: 2.0, rock: 0.5, ghost: 1.0, dragon: 1.0, dark: 1.0, steel: 0.5, fairy: 1.0 } },
    { attackType: 'psychic', rate: { normal: 1.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 1.0, fighting: 2.0, poison: 2.0, ground: 1.0, flying: 1.0, psychic: 0.5, bug: 1.0, rock: 1.0, ghost: 1.0, dragon: 1.0, dark: 0.0, steel: 0.5, fairy: 1.0 } },
    { attackType: 'bug', rate: { normal: 1.0, fire: 0.5, water: 1.0, electric: 1.0, grass: 2.0, ice: 1.0, fighting: 0.5, poison: 0.5, ground: 1.0, flying: 0.5, psychic: 2.0, bug: 1.0, rock: 1.0, ghost: 0.5, dragon: 1.0, dark: 2.0, steel: 0.5, fairy: 0.5 } },
    { attackType: 'rock', rate: { normal: 1.0, fire: 2.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 2.0, fighting: 0.5, poison: 1.0, ground: 0.5, flying: 2.0, psychic: 1.0, bug: 2.0, rock: 1.0, ghost: 1.0, dragon: 1.0, dark: 1.0, steel: 0.5, fairy: 1.0 } },
    { attackType: 'ghost', rate: { normal: 0.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 1.0, fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 2.0, bug: 1.0, rock: 1.0, ghost: 2.0, dragon: 1.0, dark: 0.5, steel: 1.0, fairy: 1.0 } },
    { attackType: 'dragon', rate: { normal: 1.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 1.0, fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0, bug: 1.0, rock: 1.0, ghost: 1.0, dragon: 2.0, dark: 1.0, steel: 0.5, fairy: 0.0 } },
    { attackType: 'dark', rate: { normal: 1.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 1.0, fighting: 0.5, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 2.0, bug: 1.0, rock: 1.0, ghost: 2.0, dragon: 1.0, dark: 0.5, steel: 1.0, fairy: 0.5 } },
    { attackType: 'steel', rate: { normal: 1.0, fire: 0.5, water: 0.5, electric: 0.5, grass: 1.0, ice: 2.0, fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0, bug: 1.0, rock: 2.0, ghost: 1.0, dragon: 1.0, dark: 1.0, steel: 0.5, fairy: 2.0 } },
    { attackType: 'fairy', rate: { normal: 1.0, fire: 0.5, water: 1.0, electric: 1.0, grass: 1.0, ice: 1.0, fighting: 2.0, poison: 0.5, ground: 1.0, flying: 1.0, psychic: 1.0, bug: 1.0, rock: 1.0, ghost: 1.0, dragon: 2.0, dark: 2.0, steel: 0.5, fairy: 1.0 } },
];
// 音技
const soundMoveList = [
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
];
// 爆発技
const explosionMoveList = [
    'じばく',
    'だいばくはつ',
    'ビックリヘッド',
    'ミストバースト'
];
// 粉技
const powderMoveList = [
    'いかりのこな',
    'キノコのほうし',
    'しびれごな',
    'どくのこな',
    'ねむりごな',
    'ふんじん',
    'まほうのこな',
    'わたほうし'
];
// 弾技
const ballMoveList = [
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
];
// 一撃必殺技
const oneShotMoveList = [
    'じわれ',
    'ぜったいれいど',
    'つのドリル',
    'ハサミギロチン'
];
// 踏付技(ちいさくなる状態に対して筆誅となる技)
const stompMoveList = [
    'ドラゴンダイブ',
    'のしかかり',
    'ハードローラー',
    'ハイパーダーククラッシャー',
    'ヒートスタンプ',
    'ふみつけ',
    'フライングプレス',
    'ヘビーボンバー'
];
// 解氷技
const meltMoveList = [
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
];
// ねむり状態でも使用可能な技
const sleepingMoveList = [
    'いびき',
    'ねごと'
];
// 重力で使えなくなるわざ
const flyingMoveList = [
    'はねる',
    'とびげり',
    'とびひざげり',
    'でんじふゆう',
    'そらをとぶ',
    'とびはねる',
    'フリーフォール',
    'テレキネシス',
    'フライングプレス'
];
// かいふくふうじで使えなくなる技
const healMoveList = [
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
    'ちからをすいとる'
];
// 捨身技　すてみ
const recklessMoveList = [
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
];
// 拳技　てつのこぶし
const ironFistMoveList = [
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
];
// 特性の変更可否
const changeAbilityTable = [
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
];
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
];
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
    { name: 'フェアリージュエル', type: 'フェアリー' },
    { name: 'ほのおのジュエル', type: 'ほのお' },
    { name: 'みずのジュエル', type: 'みず' },
    { name: 'むしのジュエル', type: 'むし' }
];
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
];
// カセット
const driveTable = [
    { name: 'アクアカセット', type: 'みず' },
    { name: 'イナズマカセット', type: 'でんき' },
    { name: 'フリーズカセット', type: 'こおり' },
    { name: 'ブレイズカセット', type: 'ほのお' }
];
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
];
