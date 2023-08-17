const abilityMaster = [
  {
    id: 1,
    nameJA: 'あくしゅう',
    nameEN: 'stench',
    text: '臭い においを 放つことによって 攻撃した ときに 相手を ひるませることが ある。'
  },
  {
    id: 2,
    nameJA: 'あめふらし',
    nameEN: 'drizzle',
    text: '登場 したときに 天気を 雨に する。'
  },
  { id: 3, nameJA: 'かそく', nameEN: 'speed-boost', text: '毎ターン 素早さが 上がる。' },
  {
    id: 4,
    nameJA: 'カブトアーマー',
    nameEN: 'battle-armor',
    text: '硬い 甲羅に 守られて 相手の 攻撃が 急所に 当たらない。'
  },
  {
    id: 5,
    nameJA: 'がんじょう',
    nameEN: 'sturdy',
    text: '相手の 技を 受けても 一撃で 倒されることが ない。 一撃必殺技も 効かない。'
  },
  {
    id: 6,
    nameJA: 'しめりけ',
    nameEN: 'damp',
    text: 'あたりを 湿らせることに よって じばく などの 爆発する 技を だれも 使えなくなる。'
  },
  {
    id: 7,
    nameJA: 'じゅうなん',
    nameEN: 'limber',
    text: '柔軟な 体によって まひ状態に ならない。'
  },
  {
    id: 8,
    nameJA: 'すながくれ',
    nameEN: 'sand-veil',
    text: '砂あらしの とき 回避率が 上がる。'
  },
  {
    id: 9,
    nameJA: 'せいでんき',
    nameEN: 'static',
    text: '静電気を 体に まとい 触った 相手を まひさせる ことがある。'
  },
  {
    id: 10,
    nameJA: 'ちくでん',
    nameEN: 'volt-absorb',
    text: 'でんきタイプの 技を 受けると ダメージを 受けずに 回復する。'
  },
  {
    id: 11,
    nameJA: 'ちょすい',
    nameEN: 'water-absorb',
    text: 'みずタイプの 技を 受けると ダメージを 受けずに 回復する。'
  },
  {
    id: 12,
    nameJA: 'どんかん',
    nameEN: 'oblivious',
    text: '鈍感なので メロメロや ちょうはつ状態に ならない。'
  },
  {
    id: 13,
    nameJA: 'ノーてんき',
    nameEN: 'cloud-nine',
    text: 'あらゆる 天気の 影響が なくなって しまう。'
  },
  {
    id: 14,
    nameJA: 'ふくがん',
    nameEN: 'compound-eyes',
    text: '複眼を 持っているため 技の 命中率が 上がる。'
  },
  {
    id: 15,
    nameJA: 'ふみん',
    nameEN: 'insomnia',
    text: '眠れない 体質 なので ねむり状態に ならない。'
  },
  {
    id: 16,
    nameJA: 'へんしょく',
    nameEN: 'color-change',
    text: '相手から 受けた 技の タイプに 自分の タイプが 変化 する。'
  },
  {
    id: 17,
    nameJA: 'めんえき',
    nameEN: 'immunity',
    text: '体内に 免疫を 持っているため どく状態に ならない。'
  },
  {
    id: 18,
    nameJA: 'もらいび',
    nameEN: 'flash-fire',
    text: 'ほのおタイプの 技を 受けると 炎を もらい 自分が 出す ほのおタイプの 技が 強くなる。'
  },
  {
    id: 19,
    nameJA: 'りんぷん',
    nameEN: 'shield-dust',
    text: 'りんぷんに 守られて 技の 追加効果を 受けなくなる。'
  },
  {
    id: 20,
    nameJA: 'マイペース',
    nameEN: 'own-tempo',
    text: 'マイペースなので こんらん状態に ならない。'
  },
  {
    id: 21,
    nameJA: 'きゅうばん',
    nameEN: 'suction-cups',
    text: '吸盤で 地面に 張り付き ポケモンを 入れ替えさせる 技や 道具が 効かなくなる。'
  },
  {
    id: 22,
    nameJA: 'いかく',
    nameEN: 'intimidate',
    text: '登場 したとき 威嚇して 相手を 萎縮させ 相手の 攻撃を 下げて しまう。'
  },
  {
    id: 23,
    nameJA: 'かげふみ',
    nameEN: 'shadow-tag',
    text: '相手の 影を 踏み 逃げたり 交代 できなくする。'
  },
  {
    id: 24,
    nameJA: 'さめはだ',
    nameEN: 'rough-skin',
    text: '攻撃を 受けたとき 自分に 触れた 相手を ざらざらの 肌で キズつける。'
  },
  {
    id: 25,
    nameJA: 'ふしぎなまもり',
    nameEN: 'wonder-guard',
    text: '効果バツグンの 技しか 当たらない 不思議な 力。'
  },
  {
    id: 26,
    nameJA: 'ふゆう',
    nameEN: 'levitate',
    text: '地面から 浮くことによって じめんタイプの 技を 受けない。'
  },
  {
    id: 27,
    nameJA: 'ほうし',
    nameEN: 'effect-spore',
    text: '攻撃で 自分に 触れた 相手を どくや まひや ねむり状態に する ことがある。'
  },
  {
    id: 28,
    nameJA: 'シンクロ',
    nameEN: 'synchronize',
    text: '自分が なってしまった どくや まひや やけどを 相手に うつす。'
  },
  {
    id: 29,
    nameJA: 'クリアボディ',
    nameEN: 'clear-body',
    text: '相手の 技や 特性で 能力を 下げられない。'
  },
  {
    id: 30,
    nameJA: 'しぜんかいふく',
    nameEN: 'natural-cure',
    text: '手持ちに ひっこむと 状態異常が 治る。'
  },
  {
    id: 31,
    nameJA: 'ひらいしん',
    nameEN: 'lightning-rod',
    text: 'でんきタイプの 技を 自分に 寄せつけ ダメージを 受けずに 特攻が 上がる。'
  },
  {
    id: 32,
    nameJA: 'てんのめぐみ',
    nameEN: 'serene-grace',
    text: '天の恵みの おかげで 技の 追加効果が でやすい。'
  },
  {
    id: 33,
    nameJA: 'すいすい',
    nameEN: 'swift-swim',
    text: '天気が 雨のとき 素早さが 上がる。'
  },
  {
    id: 34,
    nameJA: 'ようりょくそ',
    nameEN: 'chlorophyll',
    text: '天気が 晴れのとき 素早さが 上がる。'
  },
  {
    id: 35,
    nameJA: 'はっこう',
    nameEN: 'illuminate',
    text: 'あたりを 明るくする ことで 野生の ポケモンに 遭遇 しやすくなる。'
  },
  {
    id: 36,
    nameJA: 'トレース',
    nameEN: 'trace',
    text: '登場 したとき 相手の 特性を トレースして 同じ 特性に なる。'
  },
  {
    id: 37,
    nameJA: 'ちからもち',
    nameEN: 'huge-power',
    text: '物理攻撃の 威力が ２倍になる。'
  },
  {
    id: 38,
    nameJA: 'どくのトゲ',
    nameEN: 'poison-point',
    text: '自分に 触った 相手を どく状態に することがある。'
  },
  {
    id: 39,
    nameJA: 'せいしんりょく',
    nameEN: 'inner-focus',
    text: '鍛えられた 精神に よって 相手の 攻撃に ひるまない。'
  },
  {
    id: 40,
    nameJA: 'マグマのよろい',
    nameEN: 'magma-armor',
    text: '熱い マグマを 身にまとい こおり状態に ならない。'
  },
  {
    id: 41,
    nameJA: 'みずのベール',
    nameEN: 'water-veil',
    text: '水のベールを 身にまとい やけど状態に ならない。'
  },
  {
    id: 42,
    nameJA: 'じりょく',
    nameEN: 'magnet-pull',
    text: 'はがねタイプの ポケモンを 磁力で 引きつけて 逃げられなくする。'
  },
  {
    id: 43,
    nameJA: 'ぼうおん',
    nameEN: 'soundproof',
    text: '音を 遮断 することに よって 音の 攻撃を 受けない。'
  },
  {
    id: 44,
    nameJA: 'あめうけざら',
    nameEN: 'rain-dish',
    text: '天気が 雨のとき 少しずつ ＨＰを 回復する。'
  },
  {
    id: 45,
    nameJA: 'すなおこし',
    nameEN: 'sand-stream',
    text: '登場 したとき 天気を 砂あらしにする。'
  },
  {
    id: 46,
    nameJA: 'プレッシャー',
    nameEN: 'pressure',
    text: 'プレッシャーを あたえて 相手の 使う 技の ＰＰを 多く 減らす。'
  },
  {
    id: 47,
    nameJA: 'あついしぼう',
    nameEN: 'thick-fat',
    text: '厚い 脂肪で 守られているので ほのおタイプと こおりタイプの 技の ダメージを 半減させる。'
  },
  {
    id: 48,
    nameJA: 'はやおき',
    nameEN: 'early-bird',
    text: 'ねむり状態に なっても ２倍の 早さで 目覚める ことが できる。'
  },
  {
    id: 49,
    nameJA: 'ほのおのからだ',
    nameEN: 'flame-body',
    text: '自分に 触った 相手を やけど状態に する ことがある。'
  },
  {
    id: 50,
    nameJA: 'にげあし',
    nameEN: 'run-away',
    text: '野生の ポケモンから 必ず 逃げられる。'
  },
  {
    id: 51,
    nameJA: 'するどいめ',
    nameEN: 'keen-eye',
    text: '鋭い 目の おかげで 命中率を 下げられない。'
  },
  {
    id: 52,
    nameJA: 'かいりきバサミ',
    nameEN: 'hyper-cutter',
    text: '力自慢の ハサミを 持っているので 相手に 攻撃を 下げられない。'
  },
  {
    id: 53,
    nameJA: 'ものひろい',
    nameEN: 'pickup',
    text: '相手の 使った 道具を 拾ってくることが ある。 冒険中も 拾ってくる。'
  },
  {
    id: 54,
    nameJA: 'なまけ',
    nameEN: 'truant',
    text: '技を 出すと 次の ターンは 休んでしまう。'
  },
  {
    id: 55,
    nameJA: 'はりきり',
    nameEN: 'hustle',
    text: '自分の 攻撃が 高くなるが 命中率が 下がる。'
  },
  {
    id: 56,
    nameJA: 'メロメロボディ',
    nameEN: 'cute-charm',
    text: '自分に 触った 相手を メロメロに することが ある。'
  },
  {
    id: 57,
    nameJA: 'プラス',
    nameEN: 'plus',
    text: 'プラスか マイナスの 特性を 持つ ポケモンが 仲間に いると 自分の 特攻が 上がる。'
  },
  {
    id: 58,
    nameJA: 'マイナス',
    nameEN: 'minus',
    text: 'プラスか マイナスの 特性を 持つ ポケモンが 仲間に いると 自分の 特攻が 上がる。'
  },
  {
    id: 59,
    nameJA: 'てんきや',
    nameEN: 'forecast',
    text: '天気の 影響を 受けて みずタイプ ほのおタイプ こおりタイプの どれかに 変化する。'
  },
  {
    id: 60,
    nameJA: 'ねんちゃく',
    nameEN: 'sticky-hold',
    text: '粘着質の 体に 道具が くっついているため 相手に 道具を 奪われない。'
  },
  {
    id: 61,
    nameJA: 'だっぴ',
    nameEN: 'shed-skin',
    text: '体の 皮を 脱ぎ捨てることで 状態異常を 治すことが ある。'
  },
  {
    id: 62,
    nameJA: 'こんじょう',
    nameEN: 'guts',
    text: '状態異常に なると 根性を だして 攻撃が 上がる。'
  },
  {
    id: 63,
    nameJA: 'ふしぎなうろこ',
    nameEN: 'marvel-scale',
    text: '状態異常に なると 不思議なウロコが 反応して 防御が 上がる。'
  },
  {
    id: 64,
    nameJA: 'ヘドロえき',
    nameEN: 'liquid-ooze',
    text: 'ヘドロ液を 吸い取った 相手は 強烈な 悪臭で ダメージを 受けて ＨＰを 減らす。'
  },
  {
    id: 65,
    nameJA: 'しんりょく',
    nameEN: 'overgrow',
    text: 'ＨＰが 減ったとき くさタイプの 技の 威力が 上がる。'
  },
  {
    id: 66,
    nameJA: 'もうか',
    nameEN: 'blaze',
    text: 'ＨＰが 減ったとき ほのおタイプの 技の 威力が 上がる。'
  },
  {
    id: 67,
    nameJA: 'げきりゅう',
    nameEN: 'torrent',
    text: 'ＨＰが 減ったとき みずタイプの 技の 威力が 上がる。'
  },
  {
    id: 68,
    nameJA: 'むしのしらせ',
    nameEN: 'swarm',
    text: 'ＨＰが 減ったとき むしタイプの 技の 威力が 上がる。'
  },
  {
    id: 69,
    nameJA: 'いしあたま',
    nameEN: 'rock-head',
    text: '反動を 受ける 技を 出しても ＨＰが 減らない。'
  },
  {
    id: 70,
    nameJA: 'ひでり',
    nameEN: 'drought',
    text: '登場 したときに 天気を 晴れに する。'
  },
  {
    id: 71,
    nameJA: 'ありじごく',
    nameEN: 'arena-trap',
    text: '戦闘で 相手を 逃げられなくする。'
  },
  {
    id: 72,
    nameJA: 'やるき',
    nameEN: 'vital-spirit',
    text: 'やる気を だすことに よって ねむり状態に ならない。'
  },
  {
    id: 73,
    nameJA: 'しろいけむり',
    nameEN: 'white-smoke',
    text: '白い煙に 守られて 相手に 能力を 下げられない。'
  },
  {
    id: 74,
    nameJA: 'ヨガパワー',
    nameEN: 'pure-power',
    text: 'ヨガの 力で 物理攻撃の 威力が ２倍に なる。'
  },
  {
    id: 75,
    nameJA: 'シェルアーマー',
    nameEN: 'shell-armor',
    text: '硬い 殻に 守られ 相手の 攻撃が 急所に 当たらない。'
  },
  {
    id: 76,
    nameJA: 'エアロック',
    nameEN: 'air-lock',
    text: 'あらゆる 天気の 影響が 消えて しまう。'
  },
  {
    id: 77,
    nameJA: 'ちどりあし',
    nameEN: 'tangled-feet',
    text: 'こんらん状態の ときは 回避率が アップする。'
  },
  {
    id: 78,
    nameJA: 'でんきエンジン',
    nameEN: 'motor-drive',
    text: 'でんきタイプの 技を 受けると ダメージを 受けずに 素早さが 上がる。'
  },
  {
    id: 79,
    nameJA: 'とうそうしん',
    nameEN: 'rivalry',
    text: '性別が 同じだと 闘争心を 燃やして 強くなる。 性別が 違うと 弱くなる。'
  },
  {
    id: 80,
    nameJA: 'ふくつのこころ',
    nameEN: 'steadfast',
    text: 'ひるむ たびに 不屈の心を 燃やして 素早さが 上がる。'
  },
  {
    id: 81,
    nameJA: 'ゆきがくれ',
    nameEN: 'snow-cloak',
    text: '天気が あられのとき 回避率が 上がる。'
  },
  {
    id: 82,
    nameJA: 'くいしんぼう',
    nameEN: 'gluttony',
    text: 'ＨＰが 少なくなったら 食べる きのみを ＨＰ 半分の 時に 食べてしまう。'
  },
  {
    id: 83,
    nameJA: 'いかりのつぼ',
    nameEN: 'anger-point',
    text: '急所に 攻撃が 当たると 怒りくるって 攻撃力が 最大に なる。'
  },
  {
    id: 84,
    nameJA: 'かるわざ',
    nameEN: 'unburden',
    text: '持っていた 道具が なくなると 素早さが 上がる。'
  },
  {
    id: 85,
    nameJA: 'たいねつ',
    nameEN: 'heatproof',
    text: '耐熱の 体に よって ほのおタイプの 技の 威力を 半減させる。'
  },
  {
    id: 86,
    nameJA: 'たんじゅん',
    nameEN: 'simple',
    text: '能力 変化が いつもの ２倍に なる。'
  },
  {
    id: 87,
    nameJA: 'かんそうはだ',
    nameEN: 'dry-skin',
    text: '天気が 雨の時や みずタイプの 技で ＨＰが 回復し はれの時や ほのおタイプの 技で 減ってしまう。'
  },
  {
    id: 88,
    nameJA: 'ダウンロード',
    nameEN: 'download',
    text: '相手の 防御と 特防を くらべて 低い ほうの 能力に あわせて 自分の 攻撃か 特攻を 上げる。'
  },
  {
    id: 89,
    nameJA: 'てつのこぶし',
    nameEN: 'iron-fist',
    text: 'パンチを 使う 技の 威力が 上がる。'
  },
  {
    id: 90,
    nameJA: 'ポイズンヒール',
    nameEN: 'poison-heal',
    text: 'どく状態に なると ＨＰが 減らずに 増えていく。'
  },
  {
    id: 91,
    nameJA: 'てきおうりょく',
    nameEN: 'adaptability',
    text: '自分と おなじ タイプの 技の 威力が 上がる。'
  },
  {
    id: 92,
    nameJA: 'スキルリンク',
    nameEN: 'skill-link',
    text: '連続技を 使うと いつも 最高回数 出すことが できる。'
  },
  {
    id: 93,
    nameJA: 'うるおいボディ',
    nameEN: 'hydration',
    text: '天気が 雨のとき 状態異常が 治る。'
  },
  {
    id: 94,
    nameJA: 'サンパワー',
    nameEN: 'solar-power',
    text: '天気が 晴れると 特攻が 上がるが 毎ターン ＨＰが 減る。'
  },
  {
    id: 95,
    nameJA: 'はやあし',
    nameEN: 'quick-feet',
    text: '状態異常に なると 素早さが 上がる。'
  },
  {
    id: 96,
    nameJA: 'ノーマルスキン',
    nameEN: 'normalize',
    text: 'どんな タイプの 技でも すべて ノーマルタイプに なる。 威力が 少し 上がる。'
  },
  {
    id: 97,
    nameJA: 'スナイパー',
    nameEN: 'sniper',
    text: '攻撃を 急所に 当てると 威力が さらに 上がる。'
  },
  {
    id: 98,
    nameJA: 'マジックガード',
    nameEN: 'magic-guard',
    text: '攻撃 以外では ダメージを 受けない。'
  },
  {
    id: 99,
    nameJA: 'ノーガード',
    nameEN: 'no-guard',
    text: 'ノーガード戦法に よって お互いの 出す 技が かならず 当たる ようになる。'
  },
  {
    id: 100,
    nameJA: 'あとだし',
    nameEN: 'stall',
    text: '技を 出す 順番が かならず 最後に なる。'
  },
  {
    id: 101,
    nameJA: 'テクニシャン',
    nameEN: 'technician',
    text: '威力が 低い 技の 威力を 高くして 攻撃できる。'
  },
  {
    id: 102,
    nameJA: 'リーフガード',
    nameEN: 'leaf-guard',
    text: '天気が 晴れのときは 状態異常に ならない。'
  },
  {
    id: 103,
    nameJA: 'ぶきよう',
    nameEN: 'klutz',
    text: '持っている 道具を 使うことが できない。'
  },
  {
    id: 104,
    nameJA: 'かたやぶり',
    nameEN: 'mold-breaker',
    text: '相手の 特性に ジャマされる ことなく 相手に 技を 出すことが できる。'
  },
  {
    id: 105,
    nameJA: 'きょううん',
    nameEN: 'super-luck',
    text: '強運を 持っているため 相手の 急所に 攻撃が 当たりやすい。'
  },
  {
    id: 106,
    nameJA: 'ゆうばく',
    nameEN: 'aftermath',
    text: 'ひんしに なったとき 触った 相手に ダメージを あたえる。'
  },
  {
    id: 107,
    nameJA: 'きけんよち',
    nameEN: 'anticipation',
    text: '相手の 持つ 危険な 技を 察知する ことができる。'
  },
  {
    id: 108,
    nameJA: 'よちむ',
    nameEN: 'forewarn',
    text: '登場 したとき 相手の 持つ 技を ひとつだけ 読み取る。'
  },
  {
    id: 109,
    nameJA: 'てんねん',
    nameEN: 'unaware',
    text: '相手の 能力の 変化を 無視して 攻撃が できる。'
  },
  {
    id: 110,
    nameJA: 'いろめがね',
    nameEN: 'tinted-lens',
    text: '効果が いまひとつの 技を 通常の 威力で 出すことが できる。'
  },
  {
    id: 111,
    nameJA: 'フィルター',
    nameEN: 'filter',
    text: '効果バツグンに なってしまう 攻撃の 威力を 弱める ことが できる。'
  },
  {
    id: 112,
    nameJA: 'スロースタート',
    nameEN: 'slow-start',
    text: '５ターンの あいだ 攻撃と 素早さが 半分に なる。'
  },
  {
    id: 113,
    nameJA: 'きもったま',
    nameEN: 'scrappy',
    text: 'ゴーストタイプの ポケモンに ノーマルタイプと かくとうタイプの 技を 当てることが できる。'
  },
  {
    id: 114,
    nameJA: 'よびみず',
    nameEN: 'storm-drain',
    text: 'みずタイプの 技を 自分に よせつけ ダメージは 受けずに 特攻が 上がる。'
  },
  {
    id: 115,
    nameJA: 'アイスボディ',
    nameEN: 'ice-body',
    text: '天気が あられのとき ＨＰを 少しずつ 回復 する。'
  },
  {
    id: 116,
    nameJA: 'ハードロック',
    nameEN: 'solid-rock',
    text: '効果バツグンに なってしまう 攻撃の 威力を 弱める ことが できる。'
  },
  {
    id: 117,
    nameJA: 'ゆきふらし',
    nameEN: 'snow-warning',
    text: '登場 したときに 天気を あられに する。'
  },
  {
    id: 118,
    nameJA: 'みつあつめ',
    nameEN: 'honey-gather',
    text: '戦闘が 終わったとき あまいミツを 拾うことが ある。'
  },
  {
    id: 119,
    nameJA: 'おみとおし',
    nameEN: 'frisk',
    text: '登場 したとき 相手の 持ち物を 見通すことが できる。'
  },
  {
    id: 120,
    nameJA: 'すてみ',
    nameEN: 'reckless',
    text: '反動で ダメージを 受ける 技の 威力が 上がる。'
  },
  {
    id: 121,
    nameJA: 'マルチタイプ',
    nameEN: 'multitype',
    text: '持っている プレートや Ｚクリスタルの タイプによって 自分の タイプが 変わる。'
  },
  {
    id: 122,
    nameJA: 'フラワーギフト',
    nameEN: 'flower-gift',
    text: '天気が 晴れのとき 自分と 味方の 攻撃と 特防の 能力が 上がる。'
  },
  {
    id: 123,
    nameJA: 'ナイトメア',
    nameEN: 'bad-dreams',
    text: 'ねむり状態の 相手に ダメージを あたえる。'
  },
  {
    id: 124,
    nameJA: 'わるいてぐせ',
    nameEN: 'pickpocket',
    text: '触られた 相手の 道具を 盗んで しまう。'
  },
  {
    id: 125,
    nameJA: 'ちからずく',
    nameEN: 'sheer-force',
    text: '技の 追加効果は なくなるが そのぶん 高い 威力で 技を 出すことが できる。'
  },
  {
    id: 126,
    nameJA: 'あまのじゃく',
    nameEN: 'contrary',
    text: '能力の 変化が 逆転して 上がるときに 下がり 下がるときに 上がる。'
  },
  {
    id: 127,
    nameJA: 'きんちょうかん',
    nameEN: 'unnerve',
    text: '相手を 緊張させて きのみを 食べられなく させる。'
  },
  {
    id: 128,
    nameJA: 'まけんき',
    nameEN: 'defiant',
    text: '能力を 下げられると 攻撃が ぐーんと 上がる。'
  },
  {
    id: 129,
    nameJA: 'よわき',
    nameEN: 'defeatist',
    text: 'ＨＰが 半分に なると 弱気に なって 攻撃と 特攻が 半減する。'
  },
  {
    id: 130,
    nameJA: 'のろわれボディ',
    nameEN: 'cursed-body',
    text: '攻撃を 受けると 相手の 技を かなしばり状態に することが ある。'
  },
  {
    id: 131,
    nameJA: 'いやしのこころ',
    nameEN: 'healer',
    text: '状態異常の 味方を たまに 治してあげる。'
  },
  {
    id: 132,
    nameJA: 'フレンドガード',
    nameEN: 'friend-guard',
    text: '味方の ダメージを 減らすことが できる。'
  },
  {
    id: 133,
    nameJA: 'くだけるよろい',
    nameEN: 'weak-armor',
    text: '物理技で ダメージを 受けると 防御が 下がり 素早さが ぐーんと 上がる。'
  },
  {
    id: 134,
    nameJA: 'ヘヴィメタル',
    nameEN: 'heavy-metal',
    text: '自分の 重さが ２倍に なる。'
  },
  {
    id: 135,
    nameJA: 'ライトメタル',
    nameEN: 'light-metal',
    text: '自分の 重さが 半分に なる。'
  },
  {
    id: 136,
    nameJA: 'マルチスケイル',
    nameEN: 'multiscale',
    text: 'ＨＰが 満タンの ときに 受ける ダメージが 少なくなる。'
  },
  {
    id: 137,
    nameJA: 'どくぼうそう',
    nameEN: 'toxic-boost',
    text: 'どく状態に なったとき 物理技の 威力が 上がる。'
  },
  {
    id: 138,
    nameJA: 'ねつぼうそう',
    nameEN: 'flare-boost',
    text: 'やけど状態に なったとき 特殊技の 威力が 上がる。'
  },
  {
    id: 139,
    nameJA: 'しゅうかく',
    nameEN: 'harvest',
    text: '使った きのみを 何回も 作りだす。'
  },
  {
    id: 140,
    nameJA: 'テレパシー',
    nameEN: 'telepathy',
    text: '味方の 攻撃を 読み取って 技を 回避する。'
  },
  {
    id: 141,
    nameJA: 'ムラっけ',
    nameEN: 'moody',
    text: '毎ターン 能力の どれかが ぐーんと 上がって どれかが 下がる。'
  },
  {
    id: 142,
    nameJA: 'ぼうじん',
    nameEN: 'overcoat',
    text: 'すなあらしや あられなどの ダメージを 受けない。 粉の 技を 受けない。'
  },
  {
    id: 143,
    nameJA: 'どくしゅ',
    nameEN: 'poison-touch',
    text: '触る だけで 相手を どく 状態に することがある。'
  },
  {
    id: 144,
    nameJA: 'さいせいりょく',
    nameEN: 'regenerator',
    text: '手持ちに 引っ込むと ＨＰが 少し 回復する。'
  },
  {
    id: 145,
    nameJA: 'はとむね',
    nameEN: 'big-pecks',
    text: '防御を 下げる 効果を 受けない。'
  },
  {
    id: 146,
    nameJA: 'すなかき',
    nameEN: 'sand-rush',
    text: '天気が すなあらし のとき 素早さが 上がる。'
  },
  {
    id: 147,
    nameJA: 'ミラクルスキン',
    nameEN: 'wonder-skin',
    text: '変化技を 受けにくい 体に なっている。'
  },
  {
    id: 148,
    nameJA: 'アナライズ',
    nameEN: 'analytic',
    text: 'いちばん 最後に 技を 出すと 技の 威力が 上がる。'
  },
  {
    id: 149,
    nameJA: 'イリュージョン',
    nameEN: 'illusion',
    text: '手持ちの いちばん うしろに いる ポケモンに なりきって 登場して 相手を 化かす。'
  },
  {
    id: 150,
    nameJA: 'かわりもの',
    nameEN: 'imposter',
    text: '目の前の ポケモンに 変身 してしまう。'
  },
  {
    id: 151,
    nameJA: 'すりぬけ',
    nameEN: 'infiltrator',
    text: '相手の 壁や 身代わりを すりぬけて 攻撃 できる'
  },
  {
    id: 152,
    nameJA: 'ミイラ',
    nameEN: 'mummy',
    text: '相手に 触られると 相手を ミイラに してしまう。'
  },
  {
    id: 153,
    nameJA: 'じしんかじょう',
    nameEN: 'moxie',
    text: '相手を 倒すと 自信が ついて 攻撃が 上がる。'
  },
  {
    id: 154,
    nameJA: 'せいぎのこころ',
    nameEN: 'justified',
    text: 'あくタイプの 攻撃を 受けると 正義感で 攻撃が 上がる。'
  },
  {
    id: 155,
    nameJA: 'びびり',
    nameEN: 'rattled',
    text: 'あくタイプと ゴーストタイプと むしタイプの 技を 受けると びびって 素早さが 上がる。'
  },
  {
    id: 156,
    nameJA: 'マジックミラー',
    nameEN: 'magic-bounce',
    text: '相手に だされた 変化技を 受けずに そのまま 返す ことが できる。'
  },
  {
    id: 157,
    nameJA: 'そうしょく',
    nameEN: 'sap-sipper',
    text: 'くさタイプの 技を 受けると ダメージを 受けずに 攻撃が 上がる。'
  },
  {
    id: 158,
    nameJA: 'いたずらごころ',
    nameEN: 'prankster',
    text: '変化技を 先制で 出すことが できる。'
  },
  {
    id: 159,
    nameJA: 'すなのちから',
    nameEN: 'sand-force',
    text: '天気が すなあらしの とき いわタイプと じめんタイプと はがねタイプの 威力が 上がる。'
  },
  {
    id: 160,
    nameJA: 'てつのトゲ',
    nameEN: 'iron-barbs',
    text: '自分に 触った 相手に 鉄のトゲで ダメージを あたえる。'
  },
  {
    id: 161,
    nameJA: 'ダルマモード',
    nameEN: 'zen-mode',
    text: 'ＨＰが 半分 以下に なると 姿が 変化する。'
  },
  {
    id: 162,
    nameJA: 'しょうりのほし',
    nameEN: 'victory-star',
    text: '自分や 味方の 命中率が 上がる。'
  },
  {
    id: 163,
    nameJA: 'ターボブレイズ',
    nameEN: 'turboblaze',
    text: '相手の 特性に ジャマされず 相手に 技を 出すことが できる。'
  },
  {
    id: 164,
    nameJA: 'テラボルテージ',
    nameEN: 'teravolt',
    text: '相手の 特性に ジャマされず 相手に 技を 出すことが できる。'
  },
  {
    id: 165,
    nameJA: 'アロマベール',
    nameEN: 'aroma-veil',
    text: '自分と 味方への メンタル 攻撃を 防ぐことが できる。'
  },
  {
    id: 166,
    nameJA: 'フラワーベール',
    nameEN: 'flower-veil',
    text: '味方の 草ポケモンは 能力が 下がらず 状態異常にも ならない。'
  },
  {
    id: 167,
    nameJA: 'ほおぶくろ',
    nameEN: 'cheek-pouch',
    text: 'どんな きのみでも 食べると ＨＰも 回復する。'
  },
  {
    id: 168,
    nameJA: 'へんげんじざい',
    nameEN: 'protean',
    text: '自分が 出す 技と 同じ タイプに 変化する。'
  },
  {
    id: 169,
    nameJA: 'ファーコート',
    nameEN: 'fur-coat',
    text: '相手から 受ける 物理技の ダメージが 半分に なる。'
  },
  {
    id: 170,
    nameJA: 'マジシャン',
    nameEN: 'magician',
    text: '技を 当てた 相手の 道具を 奪ってしまう。'
  },
  {
    id: 171,
    nameJA: 'ぼうだん',
    nameEN: 'bulletproof',
    text: '相手の 弾や 爆弾などの 技を 防ぐことが できる。'
  },
  {
    id: 172,
    nameJA: 'かちき',
    nameEN: 'competitive',
    text: '能力を 下げられると 特攻が ぐーんと 上がる。'
  },
  {
    id: 173,
    nameJA: 'がんじょうあご',
    nameEN: 'strong-jaw',
    text: 'あごが 頑丈で 噛む 技の 威力が 高くなる。'
  },
  {
    id: 174,
    nameJA: 'フリーズスキン',
    nameEN: 'refrigerate',
    text: 'ノーマルタイプの 技が こおりタイプに なる。 威力が 少し 上がる。'
  },
  {
    id: 175,
    nameJA: 'スイートベール',
    nameEN: 'sweet-veil',
    text: '味方の ポケモンは 眠らなくなる。'
  },
  {
    id: 176,
    nameJA: 'バトルスイッチ',
    nameEN: 'stance-change',
    text: '攻撃技を 出すと ブレードフォルムに 技 キングシールドを 出すと シールドフォルムに 変化する。'
  },
  {
    id: 177,
    nameJA: 'はやてのつばさ',
    nameEN: 'gale-wings',
    text: 'ＨＰが 満タン だと ひこうタイプの 技を 先制で 出すことが できる。'
  },
  {
    id: 178,
    nameJA: 'メガランチャー',
    nameEN: 'mega-launcher',
    text: '波動の 技の 威力が 高くなる。'
  },
  {
    id: 179,
    nameJA: 'くさのけがわ',
    nameEN: 'grass-pelt',
    text: 'グラスフィールドのとき 防御が 上がる。'
  },
  {
    id: 180,
    nameJA: 'きょうせい',
    nameEN: 'symbiosis',
    text: '味方が 道具を 使うと 自分の 持っている 道具を 味方に 渡す。'
  },
  {
    id: 181,
    nameJA: 'かたいツメ',
    nameEN: 'tough-claws',
    text: '相手に 接触する 技の 威力が 高くなる。'
  },
  {
    id: 182,
    nameJA: 'フェアリースキン',
    nameEN: 'pixilate',
    text: 'ノーマルタイプの 技が フェアリータイプになる。 威力が 少し 上がる。'
  },
  {
    id: 183,
    nameJA: 'ぬめぬめ',
    nameEN: 'gooey',
    text: '攻撃で 自分に 触れた 相手の 素早さを 下げる。'
  },
  {
    id: 184,
    nameJA: 'スカイスキン',
    nameEN: 'aerilate',
    text: 'ノーマルタイプの 技が ひこうタイプになる。 威力が 少し 上がる。'
  },
  {
    id: 185,
    nameJA: 'おやこあい',
    nameEN: 'parental-bond',
    text: '親子 ２匹で ２回 攻撃することが できる。'
  },
  {
    id: 186,
    nameJA: 'ダークオーラ',
    nameEN: 'dark-aura',
    text: '全員の あくタイプの 技が 強くなる。'
  },
  {
    id: 187,
    nameJA: 'フェアリーオーラ',
    nameEN: 'fairy-aura',
    text: '全員の フェアリータイプの 技が 強くなる。'
  },
  {
    id: 188,
    nameJA: 'オーラブレイク',
    nameEN: 'aura-break',
    text: 'オーラの 効果を 逆転させて 威力を 下げる。'
  },
  {
    id: 189,
    nameJA: 'はじまりのうみ',
    nameEN: 'primordial-sea',
    text: 'ほのおタイプの 攻撃を 受けない 天気にする。'
  },
  {
    id: 190,
    nameJA: 'おわりのだいち',
    nameEN: 'desolate-land',
    text: 'みずタイプの 攻撃を 受けない 天気にする。'
  },
  {
    id: 191,
    nameJA: 'デルタストリーム',
    nameEN: 'delta-stream',
    text: 'ひこうタイプの 弱点が なくなる 天気にする。'
  },
  {
    id: 192,
    nameJA: 'じきゅうりょく',
    nameEN: 'stamina',
    text: '攻撃を 受けると 防御が 上がる。'
  },
  {
    id: 193,
    nameJA: 'にげごし',
    nameEN: 'wimp-out',
    text: 'ＨＰが 半分に なると あわてて 逃げ出して 手持ちに 引っ込んで しまう。'
  },
  {
    id: 194,
    nameJA: 'ききかいひ',
    nameEN: 'emergency-exit',
    text: 'ＨＰが 半分に なると 危険を 回避するため 手持ちに 引っ込んで しまう。'
  },
  {
    id: 195,
    nameJA: 'みずがため',
    nameEN: 'water-compaction',
    text: 'みずタイプの 技を 受けると 防御が ぐーんと 上がる。'
  },
  {
    id: 196,
    nameJA: 'ひとでなし',
    nameEN: 'merciless',
    text: 'どく状態の 相手を 攻撃すると かならず 急所に 当たる。'
  },
  {
    id: 197,
    nameJA: 'リミットシールド',
    nameEN: 'shields-down',
    text: 'ＨＰが 半分に なると 殻が 壊れて 攻撃的に なる。'
  },
  {
    id: 198,
    nameJA: 'はりこみ',
    nameEN: 'stakeout',
    text: '交代で 出てきた 相手に ２倍の ダメージで 攻撃 できる。'
  },
  {
    id: 199,
    nameJA: 'すいほう',
    nameEN: 'water-bubble',
    text: '自分に 対する ほのおタイプの 技の 威力を 下げる。 やけど しない。'
  },
  {
    id: 200,
    nameJA: 'はがねつかい',
    nameEN: 'steelworker',
    text: 'はがねタイプの 技の 威力が 上がる。'
  },
  {
    id: 201,
    nameJA: 'ぎゃくじょう',
    nameEN: 'berserk',
    text: '相手の 攻撃で ＨＰが 半分に なると 特攻が 上がる。'
  },
  {
    id: 202,
    nameJA: 'ゆきかき',
    nameEN: 'slush-rush',
    text: '天気が あられ のとき 素早さが 上がる。'
  },
  {
    id: 203,
    nameJA: 'えんかく',
    nameEN: 'long-reach',
    text: 'すべての 技を 相手に 接触 しないで 出すことが できる。'
  },
  {
    id: 204,
    nameJA: 'うるおいボイス',
    nameEN: 'liquid-voice',
    text: 'すべての 音技が みずタイプに なる。'
  },
  {
    id: 205,
    nameJA: 'ヒーリングシフト',
    nameEN: 'triage',
    text: '回復技を 先制で 出すことが できる。'
  },
  {
    id: 206,
    nameJA: 'エレキスキン',
    nameEN: 'galvanize',
    text: 'ノーマルタイプの 技が でんきタイプになる。 威力が 少し 上がる。'
  },
  {
    id: 207,
    nameJA: 'サーフテール',
    nameEN: 'surge-surfer',
    text: 'エレキフィールド のとき 素早さが ２倍に なる。'
  },
  {
    id: 208,
    nameJA: 'ぎょぐん',
    nameEN: 'schooling',
    text: 'ＨＰが 多いときは 群れて 強くなる。 ＨＰの 残りが 少なくなると 群れは 散り散りに なってしまう。'
  },
  {
    id: 209,
    nameJA: 'ばけのかわ',
    nameEN: 'disguise',
    text: '体を 被う 化けの皮で １回 攻撃を 防ぐことが できる。'
  },
  {
    id: 210,
    nameJA: 'きずなへんげ',
    nameEN: 'battle-bond',
    text: '相手を 倒すと トレーナーとの キズナが 深まり サトシゲッコウガに 変化する。みずしゅりけんが 強くなる。'
  },
  {
    id: 211,
    nameJA: 'スワームチェンジ',
    nameEN: 'power-construct',
    text: 'ＨＰが 半分に なると セルたちが 応援に 駆けつけ パーフェクトフォルムに 姿を 変える。'
  },
  {
    id: 212,
    nameJA: 'ふしょく',
    nameEN: 'corrosion',
    text: 'はがねタイプや どくタイプも どく状態に することが できる。'
  },
  {
    id: 213,
    nameJA: 'ぜったいねむり',
    nameEN: 'comatose',
    text: 'つねに 夢うつつの 状態で 絶対に 目覚めない。 眠ったまま 攻撃が できる。'
  },
  {
    id: 214,
    nameJA: 'じょおうのいげん',
    nameEN: 'queenly-majesty',
    text: '相手に 威圧感を あたえ こちらに むかって 先制技を 出せない ようにする。'
  },
  {
    id: 215,
    nameJA: 'とびだすなかみ',
    nameEN: 'innards-out',
    text: '相手に 倒されたとき ＨＰの 残りの ぶんだけ 相手に ダメージを あたえる。'
  },
  {
    id: 216,
    nameJA: 'おどりこ',
    nameEN: 'dancer',
    text: 'だれかが 踊り技を 使うと 自分も それに 続いて 踊り技を 出すことが できる。'
  },
  {
    id: 217,
    nameJA: 'バッテリー',
    nameEN: 'battery',
    text: '味方の 特殊技の 威力を 上げる。'
  },
  {
    id: 218,
    nameJA: 'もふもふ',
    nameEN: 'fluffy',
    text: '相手から 受けた 接触する 技の ダメージを 半減するが ほのおタイプの 技の ダメージは ２倍になる。'
  },
  {
    id: 219,
    nameJA: 'ビビッドボディ',
    nameEN: 'dazzling',
    text: '相手を びっくり させて こちらに むかって 先制技を 出せない ようにする。'
  },
  {
    id: 220,
    nameJA: 'ソウルハート',
    nameEN: 'soul-heart',
    text: 'ポケモンが ひんしに なるたびに 特攻が 上がる。'
  },
  {
    id: 221,
    nameJA: 'カーリーヘアー',
    nameEN: 'tangling-hair',
    text: '攻撃で 自分に 触れた 相手の 素早さを 下げる。'
  },
  {
    id: 222,
    nameJA: 'レシーバー',
    nameEN: 'receiver',
    text: '倒された 味方の 特性を 受け継いで 同じ 特性に なる。'
  },
  {
    id: 223,
    nameJA: 'かがくのちから',
    nameEN: 'power-of alchemy',
    text: '倒された 味方の 特性を 受け継ぎ 同じ 特性に 変わる。'
  },
  {
    id: 224,
    nameJA: 'ビーストブースト',
    nameEN: 'beast-boost',
    text: '相手を 倒したとき 自分の いちばん 高い 能力が 上がる。'
  },
  {
    id: 225,
    nameJA: 'ＡＲシステム',
    nameEN: 'rks-system',
    text: '持っている メモリで 自分の タイプが 変わる。'
  },
  {
    id: 226,
    nameJA: 'エレキメイカー',
    nameEN: 'electric-surge',
    text: '登場 したときに エレキフィールドを はりめぐらせる。'
  },
  {
    id: 227,
    nameJA: 'サイコメイカー',
    nameEN: 'psychic-surge',
    text: '登場 したときに サイコフィールドを はりめぐらせる。'
  },
  {
    id: 228,
    nameJA: 'ミストメイカー',
    nameEN: 'misty-surge',
    text: '登場 したときに ミストフィールドを はりめぐらせる。'
  },
  {
    id: 229,
    nameJA: 'グラスメイカー',
    nameEN: 'grassy-surge',
    text: '登場 したときに グラスフィールドを はりめぐらせる。'
  },
  {
    id: 230,
    nameJA: 'メタルプロテクト',
    nameEN: 'full-metal body',
    text: '相手の 技や 特性で 能力を 下げられない。'
  },
  {
    id: 231,
    nameJA: 'ファントムガード',
    nameEN: 'shadow-shield',
    text: 'ＨＰが 満タンの ときに 受ける ダメージが 少なくなる。'
  },
  {
    id: 232,
    nameJA: 'プリズムアーマー',
    nameEN: 'prism-armor',
    text: '効果バツグンに なってしまう 攻撃の 威力を 弱める ことが できる。'
  },
  {
    id: 233,
    nameJA: 'ブレインフォース',
    nameEN: 'neuroforce',
    text: '効果バツグンの 攻撃で 威力が さらに 上がる。'
  },
  {
    id: 234,
    nameJA: 'ふとうのけん',
    nameEN: 'intrepid-sword',
    text: '登場 したときに 攻撃が 上がる。'
  },
  {
    id: 235,
    nameJA: 'ふくつのたて',
    nameEN: 'dauntless-shield',
    text: '登場 したときに 防御が 上がる。'
  },
  {
    id: 236,
    nameJA: 'リベロ',
    nameEN: 'libero',
    text: '自分が 出す 技と 同じ タイプに 変化する。'
  },
  {
    id: 237,
    nameJA: 'たまひろい',
    nameEN: 'ball-fetch',
    text: '道具を 持っていない 場合 １回目に 投げて 失敗 した モンスターボールを 拾ってくる。'
  },
  {
    id: 238,
    nameJA: 'わたげ',
    nameEN: 'cotton-down',
    text: '攻撃を 受けると わたげを ばらまいて 自分以外の ポケモン すべての 素早さを 下げる。'
  },
  {
    id: 239,
    nameJA: 'スクリューおびれ',
    nameEN: 'propeller-tail',
    text: '相手の 技を 引き受ける 特性や 技の 影響を 無視 できる。'
  },
  {
    id: 240,
    nameJA: 'ミラーアーマー',
    nameEN: 'mirror-armor',
    text: '自分が 受けた 能力 ダウンの 効果 だけを 跳ね返す。'
  },
  {
    id: 241,
    nameJA: 'うのミサイル',
    nameEN: 'gulp-missile',
    text: 'なみのりか ダイビングを すると 獲物を くわえてくる。 ダメージを 受けると 獲物を 吐きだして 攻撃。'
  },
  {
    id: 242,
    nameJA: 'すじがねいり',
    nameEN: 'stalwart',
    text: '相手の 技を 引き受ける 特性や 技の 影響を 無視 できる。'
  },
  {
    id: 243,
    nameJA: 'じょうききかん',
    nameEN: 'steam-engine',
    text: 'みずタイプ ほのおタイプの 技を 受けると 素早さが ぐぐーんと 上がる。'
  },
  {
    id: 244,
    nameJA: 'パンクロック',
    nameEN: 'punk-rock',
    text: '音技の 威力が 上がる。 受けた 音技の ダメージは 半分に なる。'
  },
  {
    id: 245,
    nameJA: 'すなはき',
    nameEN: 'sand-spit',
    text: '攻撃を 受けると 砂あらしを 起こす。'
  },
  {
    id: 246,
    nameJA: 'こおりのりんぷん',
    nameEN: 'ice-scales',
    text: 'こおりのりんぷんに 守られて 特殊攻撃で 受ける ダメージが 半減 する。'
  },
  {
    id: 247,
    nameJA: 'じゅくせい',
    nameEN: 'ripen',
    text: '熟成 させることで きのみの 効果が 倍に なる。'
  },
  {
    id: 248,
    nameJA: 'アイスフェイス',
    nameEN: 'ice-face',
    text: '物理攻撃は 頭の 氷が みがわりに なるが 姿も 変わる。 氷は あられが 降ると 元に戻る。'
  },
  {
    id: 249,
    nameJA: 'パワースポット',
    nameEN: 'power-spot',
    text: '隣に いるだけで 技の 威力が 上がる。'
  },
  {
    id: 250,
    nameJA: 'ぎたい',
    nameEN: 'mimicry',
    text: 'フィールドの 状態に あわせて ポケモンの タイプが 変わる。'
  },
  {
    id: 251,
    nameJA: 'バリアフリー',
    nameEN: 'screen-cleaner',
    text: '登場 したときに 敵と 味方の ひかりのかべ リフレクター オーロラベールの 効果が 消える。'
  },
  {
    id: 252,
    nameJA: 'はがねのせいしん',
    nameEN: 'steely-spirit',
    text: '味方の はがねタイプの 攻撃の 威力が 上がる。'
  },
  {
    id: 253,
    nameJA: 'ほろびのボディ',
    nameEN: 'perish-body',
    text: '接触する 技を 受けると お互い ３ターン たつと ひんしになる。 交代すると 効果は なくなる。'
  },
  {
    id: 254,
    nameJA: 'さまようたましい',
    nameEN: 'wandering-spirit',
    text: '接触する 技で 攻撃 してきた ポケモンと 特性を 入れ替える。'
  },
  {
    id: 255,
    nameJA: 'ごりむちゅう',
    nameEN: 'gorilla-tactics',
    text: '攻撃は 上がるが 最初に 選んだ 技しか 出せなくなる。'
  },
  {
    id: 256,
    nameJA: 'かがくへんかガス',
    nameEN: 'neutralizing-gas',
    text: 'かがくへんかガスの ポケモンが 場にいると すべての ポケモンの 特性の 効果が 消えたり 発動 しなくなる。'
  },
  {
    id: 257,
    nameJA: 'パステルベール',
    nameEN: 'pastel-veil',
    text: '自分も 味方も どくの 状態異常を 受けなくなる。'
  },
  {
    id: 258,
    nameJA: 'はらぺこスイッチ',
    nameEN: 'hunger-switch',
    text: 'ターンの 終わりに まんぷくもよう はらぺこもよう まんぷくもよう……と 交互に 姿を 変える。'
  },
  {
    id: 259,
    nameJA: 'クイックドロウ',
    nameEN: 'quick-draw',
    text: '相手より 先に 行動できることが ある。'
  },
  {
    id: 260,
    nameJA: 'ふかしのこぶし',
    nameEN: 'unseen-fist',
    text: '相手に 接触する 技なら 守りの 効果を 無視して 攻撃することが できる。'
  },
  {
    id: 261,
    nameJA: 'きみょうなくすり',
    nameEN: 'curious-medicine',
    text: '登場 したときに 貝がらから 薬を 振りまいて 味方の 能力変化を 元に戻す。'
  },
  {
    id: 262,
    nameJA: 'トランジスタ',
    nameEN: 'transistor',
    text: 'でんきタイプの 技の 威力が 上がる。'
  },
  {
    id: 263,
    nameJA: 'りゅうのあぎと',
    nameEN: 'dragon’s-maw',
    text: 'ドラゴンタイプの 技の 威力が 上がる。'
  },
  {
    id: 264,
    nameJA: 'しろのいななき',
    nameEN: 'chilling-neigh',
    text: '相手を 倒すと 冷たい 声で いなないて 攻撃が 上がる。'
  },
  {
    id: 265,
    nameJA: 'くろのいななき',
    nameEN: 'grim-neigh',
    text: '相手を 倒すと 恐ろしい 声で いなないて 特攻が 上がる。'
  },
  {
    id: 266,
    nameJA: 'じんばいったい',
    nameEN: 'as-one',
    text: 'バドレックスの きんちょうかんと ブリザポスの しろのいななきの 二つの 特性を あわせ持つ。'
  },
  {
    id: 267,
    nameJA: 'じんばいったい',
    nameEN: 'as-one',
    text: 'バドレックスの きんちょうかんと レイスポスの くろのいななきの 二つの 特性を あわせ持つ。'
  },
  { id: 268, nameJA: 'とれないにおい', nameEN: 'lingering-aroma', text: '' },
  { id: 269, nameJA: 'こぼれダネ', nameEN: 'seed-sower', text: '' },
  { id: 270, nameJA: 'ねつこうかん', nameEN: 'thermal-exchange', text: '' },
  { id: 271, nameJA: 'いかりのこうら', nameEN: 'anger-shell', text: '' },
  { id: 272, nameJA: 'きよめのしお', nameEN: 'purifying-salt', text: '' },
  { id: 273, nameJA: 'こんがりボディ', nameEN: 'well-baked-body', text: '' },
  { id: 274, nameJA: 'かぜのり', nameEN: 'wind-rider', text: '' },
  { id: 275, nameJA: 'ばんけん', nameEN: 'guard-dog', text: '' },
  { id: 276, nameJA: 'いわはこび', nameEN: 'rocky-payload', text: '' },
  { id: 277, nameJA: 'ふうりょくでんき', nameEN: 'wind-power', text: '' },
  { id: 278, nameJA: 'マイティチェンジ', nameEN: 'zero-to hero', text: '' },
  { id: 279, nameJA: 'しれいとう', nameEN: 'commander', text: '' },
  { id: 280, nameJA: 'でんきにかえる', nameEN: 'electromorphosis', text: '' },
  { id: 281, nameJA: 'こだいかっせい', nameEN: 'protosynthesis', text: '' },
  { id: 282, nameJA: 'クォークチャージ', nameEN: 'quark-drive', text: '' },
  { id: 283, nameJA: 'おうごんのからだ', nameEN: 'good-as gold', text: '' },
  { id: 284, nameJA: 'わざわいのうつわ', nameEN: 'vessel-of ruin', text: '' },
  { id: 285, nameJA: 'わざわいのつるぎ', nameEN: 'sword-of ruin', text: '' },
  { id: 286, nameJA: 'わざわいのおふだ', nameEN: 'tablets-of ruin', text: '' },
  { id: 287, nameJA: 'わざわいのたま', nameEN: 'beads-of ruin', text: '' },
  { id: 288, nameJA: 'ひひいろのこどう', nameEN: 'orichalcum-pulse', text: '' },
  { id: 289, nameJA: 'ハドロンエンジン', nameEN: 'hadron-engine', text: '' },
  { id: 290, nameJA: 'びんじょう', nameEN: 'opportunist', text: '' },
  { id: 291, nameJA: 'はんすう', nameEN: 'cud-chew', text: '' },
  { id: 292, nameJA: 'きれあじ', nameEN: 'sharpness', text: '' },
  { id: 293, nameJA: 'そうだいしょう', nameEN: 'supreme-overlord', text: '' },
  { id: 294, nameJA: 'きょうえん', nameEN: 'costar', text: '' },
  { id: 295, nameJA: 'どくげしょう', nameEN: 'toxic-debris', text: '' },
  { id: 296, nameJA: 'テイルアーマー', nameEN: 'armor-tail', text: '' },
  { id: 297, nameJA: 'どしょく', nameEN: 'earth-eater', text: '' },
  { id: 298, nameJA: 'きんしのちから', nameEN: 'mycelium-might', text: '' },
]
