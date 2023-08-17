"use strict";
const itemNameJA = [
    'あいいろのたま',
    'アイスメモリ',
    'あおぞらプレート',
    'あかいいと',
    'アクＺ',
    'アクアカセット',
    'あくのジュエル',
    'アシレーヌＺ',
    'あついいわ',
    'アッキのみ',
    'あつぞこブーツ',
    'アブソルナイト',
    'あやしいおこう',
    'アロライＺ',
    'イアのみ',
    'イーブイＺ',
    'いかさまダイス',
    'いかずちプレート',
    'イトケのみ',
    'イナズマカセット',
    'いのちのたま',
    'イバンのみ',
    'イワＺ',
    'いわのジュエル',
    'ウイのみ',
    'ウオーターメモリ',
    'うしおのおこう',
    'うすもものミツ',
    'ウタンのみ',
    'ウブのみ',
    'エスパーＺ',
    'エスパージュエル',
    'エルレイドナイト',
    'エレキシード',
    'エレクトロメモリ',
    'おうじゃのしるし',
    'おおきなねっこ',
    'オッカのみ',
    'オニゴーリナイト',
    'おはなのおこう',
    'オボンのみ',
    'オレンのみ',
    'おんみつマント',
    'かいがらのすず',
    'カイスのみ',
    'カイロスナイト',
    'かえんだま',
    'ガオガエンＺ',
    'カクトウＺ',
    'かくとうジュエル',
    'カゴのみ',
    'カシブのみ',
    'かたいいし',
    'カビゴンＺ',
    'カプＺ',
    'ガブリアスナイト',
    'カムラのみ',
    'カメックスナイト',
    'からぶりほけん',
    'かるいし',
    'ガルーラナイト',
    'がんせきおこう',
    'がんせきプレート',
    'きあいのタスキ',
    'きあいのハチマキ',
    'キーのみ',
    'きせきのタネ',
    'きのみジュース',
    'ギャラドスナイト',
    'きゅうこん',
    'きょうせいギプス',
    'きれいなぬけがら',
    'ぎんのこな',
    'クサＺ',
    'くさのジュエル',
    'クチートナイト',
    'くちたけん',
    'くちたたて',
    'くっつきバリ',
    'グラウンドメモリ',
    'グラスシード',
    'グラスメモリ',
    'クラボのみ',
    'グランドコート',
    'クリアチャーム',
    'くれないのミツ',
    'くろいてっきゅう',
    'くろいヘドロ',
    'くろいメガネ',
    'くろおび',
    'けむりだま',
    'ゲンガナイト',
    'こうかくレンズ',
    'こうこうのしっぽ',
    'こうてつプレート',
    'ゴーストＺ',
    'ゴーストジュエル',
    'ゴーストメモリ',
    'コオリＺ',
    'こおりのジュエル',
    'こころのしずく',
    'ゴスのみ',
    'こだわりスカーフ',
    'こだわりハチマキ',
    'こだわりメガネ',
    'ゴツゴツメット',
    'こぶしのプレート',
    'こわもてプレート',
    'こんごうだま',
    'サーナイトナイト',
    'サイキックメモリ',
    'サイコシード',
    'さざなみのおこう',
    'サトピカＺ',
    'サメハダナイト',
    'さらさらいわ',
    'ザロクのみ',
    'サンのみ',
    'シーヤのみ',
    'じしゃく',
    'しずくプレート',
    'しめつけバンド',
    'しめったいわ',
    'ジメンＺ',
    'じめんのジュエル',
    'じゃくてんほけん',
    'ジャポのみ',
    'じゅうでんち',
    'ジュカインナイト',
    'シュカのみ',
    'ジュナイパーＺ',
    'ジュペッタナイト',
    'しらたま',
    'シルクのスカーフ',
    'しろいハーブ',
    'しんかいのウロコ',
    'しんかいのキバ',
    'しんかのきせき',
    'しんぴのしずく',
    'ズアのみ',
    'スターのみ',
    'スチールメモリ',
    'スピアナイト',
    'スピードパウダー',
    'ズリのみ',
    'するどいキバ',
    'するどいくちばし',
    'するどいツメ',
    'せいれいプレート',
    'セシナのみ',
    'せんせいのツメ',
    'ソクノのみ',
    'ダークメモリ',
    'だいこんごうだま',
    'だいしらたま',
    'だいちのプレート',
    'だいはっきんだま',
    'だっしゅつパック',
    'だっしゅつボタン',
    'たつじんのおび',
    'タブンネナイト',
    'たべのこし',
    'タポルのみ',
    'たまむしプレート',
    'タラプのみ',
    'タンガのみ',
    'チーゴのみ',
    'チイラのみ',
    'ちからのハチマキ',
    'チャーレムナイト',
    'チルタリスナイト',
    'つめたいいわ',
    'つららのプレート',
    'ディアンシナイト',
    'デルダマ',
    'デンキＺ',
    'でんきだま',
    'でんきのジュエル',
    'デンリュウナイト',
    'ドクＺ',
    'とくせいガード',
    'どくどくだま',
    'どくのジュエル',
    'どくバリ',
    'とけないこおり',
    'とつげきチョッキ',
    'ドラゴンＺ',
    'ドラゴンジュエル',
    'ドラゴンメモリ',
    'ドリのみ',
    'ながねぎ',
    'ナゾのみ',
    'ナナシのみ',
    'ナナのみ',
    'ナモのみ',
    'ネコブのみ',
    'ねばりのかぎづめ',
    'ねらいのまと',
    'ノーマルＺ',
    'ノーマルジュエル',
    'のどスプレー',
    'ノメルのみ',
    'のろいのおふだ',
    'ノワキのみ',
    'のんきのおこう',
    'パイルのみ',
    'ハガネＺ',
    'ハガネールナイト',
    'はがねのジュエル',
    'バクーダナイト',
    'バグメモリ',
    'バコウのみ',
    'バシャーモナイト',
    'はっきんだま',
    'ハッサムナイト',
    'ハバンのみ',
    'パワーアンクル',
    'パワーウエイト',
    'パワーバンド',
    'パワーベルト',
    'パワーリスト',
    'パワーレンズ',
    'パワフルハーブ',
    'バンギラスナイト',
    'バンジのみ',
    'パンチグローブ',
    'ばんのうがさ',
    'ビアーのみ',
    'ピカチュウＺ',
    'ひかりごけ',
    'ひかりのこな',
    'ひかりのねんど',
    'ヒコウＺ',
    'ひこうのジュエル',
    'ピジョットナイト',
    'ひのたまプレート',
    'ビビリだま',
    'ヒメリのみ',
    'ピントレンズ',
    'ファイトメモリ',
    'ファイヤーメモリ',
    'フィラのみ',
    'ブーストエナジー',
    'ふうせん',
    'フーディナイト',
    'フェアリーＺ',
    'フェアリーメモリ',
    'フォーカスレンズ',
    'ふしぎのプレート',
    'フシギバナイト',
    'プテラナイト',
    'ふといホネ',
    'フライングメモリ',
    'フリーズカセット',
    'ブリーのみ',
    'ブレイズカセット',
    'べにいろのたま',
    'ヘラクロスナイト',
    'ベリブのみ',
    'ヘルガナイト',
    'ポイズンメモリ',
    'ぼうごパット',
    'ぼうじんゴーグル',
    'ボーマンダナイト',
    'ボスゴドラナイト',
    'ホズのみ',
    'ホノオＺ',
    'ほのおのジュエル',
    'マーシャドーＺ',
    'まがったスプーン',
    'マゴのみ',
    'まっさらプレート',
    'マトマのみ',
    'まんぷくおこう',
    'ミクルのみ',
    'ミズＺ',
    'ミストシード',
    'みずのジュエル',
    'みどりのプレート',
    'ミミロップナイト',
    'ミュウＺ',
    'ミュウツナイトＸ',
    'ミュウツナイトＹ',
    'ムシＺ',
    'むしのジュエル',
    'むらさきのミツ',
    'メタグロスナイト',
    'メタルコート',
    'メタルパウダー',
    'メトロノーム',
    'メンタルハーブ',
    'もうどくプレート',
    'もくたん',
    'モコシのみ',
    'ものしりメガネ',
    'もののけプレート',
    'ものまねハーブ',
    'モモンのみ',
    'ヤタピのみ',
    'ヤチェのみ',
    'ヤドランナイト',
    'やまぶきのミツ',
    'ヤミラミナイト',
    'やわらかいすな',
    'ゆきだま',
    'ユキノオナイト',
    'ようせいジュエル',
    'ヨプのみ',
    'ヨロギのみ',
    'ライボルトナイト',
    'ラグラージナイト',
    'ラッキーパンチ',
    'ラティアスナイト',
    'ラティオスナイト',
    'ラブタのみ',
    'ラムのみ',
    'リザードナイトＸ',
    'リザードナイトＹ',
    'りゅうのキバ',
    'りゅうのプレート',
    'リュガのみ',
    'リリバのみ',
    'リンドのみ',
    'ルームサービス',
    'ルカリオナイト',
    'レジェンドプレート',
    'レッドカード',
    'レンブのみ',
    'ロゼルのみ',
    'ロックメモリ',
    'ロメのみ',
];
