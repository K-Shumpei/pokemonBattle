"use strict";
const abilityMaster = [
    { id: 1, nameEN: 'Stench', nameJA: 'あくしゅう', text: '臭い においを 放つことによって 攻撃した ときに 相手を ひるませることが ある。' },
    { id: 2, nameEN: 'Drizzle', nameJA: 'あめふらし', text: '登場 したときに 天気を 雨に する。' },
    { id: 3, nameEN: 'Speed Boost', nameJA: 'かそく', text: '毎ターン 素早さが 上がる。' },
    { id: 4, nameEN: 'Battle Armor', nameJA: 'カブトアーマー', text: '硬い 甲羅に 守られて 相手の 攻撃が 急所に 当たらない。' },
    { id: 5, nameEN: 'Sturdy', nameJA: 'がんじょう', text: '相手の 技を 受けても 一撃で 倒されることが ない。 一撃必殺技も 効かない。' },
    { id: 6, nameEN: 'Damp', nameJA: 'しめりけ', text: 'あたりを 湿らせることに よって じばく などの 爆発する 技を だれも 使えなくなる。' },
    { id: 7, nameEN: 'Limber', nameJA: 'じゅうなん', text: '柔軟な 体によって まひ状態に ならない。' },
    { id: 8, nameEN: 'Sand Veil', nameJA: 'すながくれ', text: '砂あらしの とき 回避率が 上がる。' },
    { id: 9, nameEN: 'Static', nameJA: 'せいでんき', text: '静電気を 体に まとい 触った 相手を まひさせる ことがある。' },
    { id: 10, nameEN: 'Volt Absorb', nameJA: 'ちくでん', text: 'でんきタイプの 技を 受けると ダメージを 受けずに 回復する。' },
    { id: 11, nameEN: 'Water Absorb', nameJA: 'ちょすい', text: 'みずタイプの 技を 受けると ダメージを 受けずに 回復する。' },
    { id: 12, nameEN: 'Oblivious', nameJA: 'どんかん', text: '鈍感なので メロメロや ちょうはつ状態に ならない。' },
    { id: 13, nameEN: 'Cloud Nine', nameJA: 'ノーてんき', text: 'あらゆる 天気の 影響が なくなって しまう。' },
    { id: 14, nameEN: 'Compound Eyes', nameJA: 'ふくがん', text: '複眼を 持っているため 技の 命中率が 上がる。' },
    { id: 15, nameEN: 'Insomnia', nameJA: 'ふみん', text: '眠れない 体質 なので ねむり状態に ならない。' },
    { id: 16, nameEN: 'Color Change', nameJA: 'へんしょく', text: '相手から 受けた 技の タイプに 自分の タイプが 変化 する。' },
    { id: 17, nameEN: 'Immunity', nameJA: 'めんえき', text: '体内に 免疫を 持っているため どく状態に ならない。' },
    { id: 18, nameEN: 'Flash Fire', nameJA: 'もらいび', text: 'ほのおタイプの 技を 受けると 炎を もらい 自分が 出す ほのおタイプの 技が 強くなる。' },
    { id: 19, nameEN: 'Shield Dust', nameJA: 'りんぷん', text: 'りんぷんに 守られて 技の 追加効果を 受けなくなる。' },
    { id: 20, nameEN: 'Own Tempo', nameJA: 'マイペース', text: 'マイペースなので こんらん状態に ならない。' },
    { id: 21, nameEN: 'Suction Cups', nameJA: 'きゅうばん', text: '吸盤で 地面に 張り付き ポケモンを 入れ替えさせる 技や 道具が 効かなくなる。' },
    { id: 22, nameEN: 'Intimidate', nameJA: 'いかく', text: '登場 したとき 威嚇して 相手を 萎縮させ 相手の 攻撃を 下げて しまう。' },
    { id: 23, nameEN: 'Shadow Tag', nameJA: 'かげふみ', text: '相手の 影を 踏み 逃げたり 交代 できなくする。' },
    { id: 24, nameEN: 'Rough Skin', nameJA: 'さめはだ', text: '攻撃を 受けたとき 自分に 触れた 相手を ざらざらの 肌で キズつける。' },
    { id: 25, nameEN: 'Wonder Guard', nameJA: 'ふしぎなまもり', text: '効果バツグンの 技しか 当たらない 不思議な 力。' },
    { id: 26, nameEN: 'Levitate', nameJA: 'ふゆう', text: '地面から 浮くことによって じめんタイプの 技を 受けない。' },
    { id: 27, nameEN: 'Effect Spore', nameJA: 'ほうし', text: '攻撃で 自分に 触れた 相手を どくや まひや ねむり状態に する ことがある。' },
    { id: 28, nameEN: 'Synchronize', nameJA: 'シンクロ', text: '自分が なってしまった どくや まひや やけどを 相手に うつす。' },
    { id: 29, nameEN: 'Clear Body', nameJA: 'クリアボディ', text: '相手の 技や 特性で 能力を 下げられない。' },
    { id: 30, nameEN: 'Natural Cure', nameJA: 'しぜんかいふく', text: '手持ちに ひっこむと 状態異常が 治る。' },
    { id: 31, nameEN: 'Lightning Rod', nameJA: 'ひらいしん', text: 'でんきタイプの 技を 自分に 寄せつけ ダメージを 受けずに 特攻が 上がる。' },
    { id: 32, nameEN: 'Serene Grace', nameJA: 'てんのめぐみ', text: '天の恵みの おかげで 技の 追加効果が でやすい。' },
    { id: 33, nameEN: 'Swift Swim', nameJA: 'すいすい', text: '天気が 雨のとき 素早さが 上がる。' },
    { id: 34, nameEN: 'Chlorophyll', nameJA: 'ようりょくそ', text: '天気が 晴れのとき 素早さが 上がる。' },
    { id: 35, nameEN: 'Illuminate', nameJA: 'はっこう', text: 'あたりを 明るくする ことで 野生の ポケモンに 遭遇 しやすくなる。' },
    { id: 36, nameEN: 'Trace', nameJA: 'トレース', text: '登場 したとき 相手の 特性を トレースして 同じ 特性に なる。' },
    { id: 37, nameEN: 'Huge Power', nameJA: 'ちからもち', text: '物理攻撃の 威力が ２倍になる。' },
    { id: 38, nameEN: 'Poison Point', nameJA: 'どくのトゲ', text: '自分に 触った 相手を どく状態に することがある。' },
    { id: 39, nameEN: 'Inner Focus', nameJA: 'せいしんりょく', text: '鍛えられた 精神に よって 相手の 攻撃に ひるまない。' },
    { id: 40, nameEN: 'Magma Armor', nameJA: 'マグマのよろい', text: '熱い マグマを 身にまとい こおり状態に ならない。' },
    { id: 41, nameEN: 'Water Veil', nameJA: 'みずのベール', text: '水のベールを 身にまとい やけど状態に ならない。' },
    { id: 42, nameEN: 'Magnet Pull', nameJA: 'じりょく', text: 'はがねタイプの ポケモンを 磁力で 引きつけて 逃げられなくする。' },
    { id: 43, nameEN: 'Soundproof', nameJA: 'ぼうおん', text: '音を 遮断 することに よって 音の 攻撃を 受けない。' },
    { id: 44, nameEN: 'Rain Dish', nameJA: 'あめうけざら', text: '天気が 雨のとき 少しずつ ＨＰを 回復する。' },
    { id: 45, nameEN: 'Sand Stream', nameJA: 'すなおこし', text: '登場 したとき 天気を 砂あらしにする。' },
    { id: 46, nameEN: 'Pressure', nameJA: 'プレッシャー', text: 'プレッシャーを あたえて 相手の 使う 技の ＰＰを 多く 減らす。' },
    { id: 47, nameEN: 'Thick Fat', nameJA: 'あついしぼう', text: '厚い 脂肪で 守られているので ほのおタイプと こおりタイプの 技の ダメージを 半減させる。' },
    { id: 48, nameEN: 'Early Bird', nameJA: 'はやおき', text: 'ねむり状態に なっても ２倍の 早さで 目覚める ことが できる。' },
    { id: 49, nameEN: 'Flame Body', nameJA: 'ほのおのからだ', text: '自分に 触った 相手を やけど状態に する ことがある。' },
    { id: 50, nameEN: 'Run Away', nameJA: 'にげあし', text: '野生の ポケモンから 必ず 逃げられる。' },
    { id: 51, nameEN: 'Keen Eye', nameJA: 'するどいめ', text: '鋭い 目の おかげで 命中率を 下げられない。' },
    { id: 52, nameEN: 'Hyper Cutter', nameJA: 'かいりきバサミ', text: '力自慢の ハサミを 持っているので 相手に 攻撃を 下げられない。' },
    { id: 53, nameEN: 'Pickup', nameJA: 'ものひろい', text: '相手の 使った 道具を 拾ってくることが ある。 冒険中も 拾ってくる。' },
    { id: 54, nameEN: 'Truant', nameJA: 'なまけ', text: '技を 出すと 次の ターンは 休んでしまう。' },
    { id: 55, nameEN: 'Hustle', nameJA: 'はりきり', text: '自分の 攻撃が 高くなるが 命中率が 下がる。' },
    { id: 56, nameEN: 'Cute Charm', nameJA: 'メロメロボディ', text: '自分に 触った 相手を メロメロに することが ある。' },
    { id: 57, nameEN: 'Plus', nameJA: 'プラス', text: 'プラスか マイナスの 特性を 持つ ポケモンが 仲間に いると 自分の 特攻が 上がる。' },
    { id: 58, nameEN: 'Minus', nameJA: 'マイナス', text: 'プラスか マイナスの 特性を 持つ ポケモンが 仲間に いると 自分の 特攻が 上がる。' },
    { id: 59, nameEN: 'Forecast', nameJA: 'てんきや', text: '天気の 影響を 受けて みずタイプ ほのおタイプ こおりタイプの どれかに 変化する。' },
    { id: 60, nameEN: 'Sticky Hold', nameJA: 'ねんちゃく', text: '粘着質の 体に 道具が くっついているため 相手に 道具を 奪われない。' },
    { id: 61, nameEN: 'Shed Skin', nameJA: 'だっぴ', text: '体の 皮を 脱ぎ捨てることで 状態異常を 治すことが ある。' },
    { id: 62, nameEN: 'Guts', nameJA: 'こんじょう', text: '状態異常に なると 根性を だして 攻撃が 上がる。' },
    { id: 63, nameEN: 'Marvel Scale', nameJA: 'ふしぎなうろこ', text: '状態異常に なると 不思議なウロコが 反応して 防御が 上がる。' },
    { id: 64, nameEN: 'Liquid Ooze', nameJA: 'ヘドロえき', text: 'ヘドロ液を 吸い取った 相手は 強烈な 悪臭で ダメージを 受けて ＨＰを 減らす。' },
    { id: 65, nameEN: 'Overgrow', nameJA: 'しんりょく', text: 'ＨＰが 減ったとき くさタイプの 技の 威力が 上がる。' },
    { id: 66, nameEN: 'Blaze', nameJA: 'もうか', text: 'ＨＰが 減ったとき ほのおタイプの 技の 威力が 上がる。' },
    { id: 67, nameEN: 'Torrent', nameJA: 'げきりゅう', text: 'ＨＰが 減ったとき みずタイプの 技の 威力が 上がる。' },
    { id: 68, nameEN: 'Swarm', nameJA: 'むしのしらせ', text: 'ＨＰが 減ったとき むしタイプの 技の 威力が 上がる。' },
    { id: 69, nameEN: 'Rock Head', nameJA: 'いしあたま', text: '反動を 受ける 技を 出しても ＨＰが 減らない。' },
    { id: 70, nameEN: 'Drought', nameJA: 'ひでり', text: '登場 したときに 天気を 晴れに する。' },
    { id: 71, nameEN: 'Arena Trap', nameJA: 'ありじごく', text: '戦闘で 相手を 逃げられなくする。' },
    { id: 72, nameEN: 'Vital Spirit', nameJA: 'やるき', text: 'やる気を だすことに よって ねむり状態に ならない。' },
    { id: 73, nameEN: 'White Smoke', nameJA: 'しろいけむり', text: '白い煙に 守られて 相手に 能力を 下げられない。' },
    { id: 74, nameEN: 'Pure Power', nameJA: 'ヨガパワー', text: 'ヨガの 力で 物理攻撃の 威力が ２倍に なる。' },
    { id: 75, nameEN: 'Shell Armor', nameJA: 'シェルアーマー', text: '硬い 殻に 守られ 相手の 攻撃が 急所に 当たらない。' },
    { id: 76, nameEN: 'Air Lock', nameJA: 'エアロック', text: 'あらゆる 天気の 影響が 消えて しまう。' },
    { id: 77, nameEN: 'Tangled Feet', nameJA: 'ちどりあし', text: 'こんらん状態の ときは 回避率が アップする。' },
    { id: 78, nameEN: 'Motor Drive', nameJA: 'でんきエンジン', text: 'でんきタイプの 技を 受けると ダメージを 受けずに 素早さが 上がる。' },
    { id: 79, nameEN: 'Rivalry', nameJA: 'とうそうしん', text: '性別が 同じだと 闘争心を 燃やして 強くなる。 性別が 違うと 弱くなる。' },
    { id: 80, nameEN: 'Steadfast', nameJA: 'ふくつのこころ', text: 'ひるむ たびに 不屈の心を 燃やして 素早さが 上がる。' },
    { id: 81, nameEN: 'Snow Cloak', nameJA: 'ゆきがくれ', text: '天気が あられのとき 回避率が 上がる。' },
    { id: 82, nameEN: 'Gluttony', nameJA: 'くいしんぼう', text: 'ＨＰが 少なくなったら 食べる きのみを ＨＰ 半分の 時に 食べてしまう。' },
    { id: 83, nameEN: 'Anger Point', nameJA: 'いかりのつぼ', text: '急所に 攻撃が 当たると 怒りくるって 攻撃力が 最大に なる。' },
    { id: 84, nameEN: 'Unburden', nameJA: 'かるわざ', text: '持っていた 道具が なくなると 素早さが 上がる。' },
    { id: 85, nameEN: 'Heatproof', nameJA: 'たいねつ', text: '耐熱の 体に よって ほのおタイプの 技の 威力を 半減させる。' },
    { id: 86, nameEN: 'Simple', nameJA: 'たんじゅん', text: '能力 変化が いつもの ２倍に なる。' },
    { id: 87, nameEN: 'Dry Skin', nameJA: 'かんそうはだ', text: '天気が 雨の時や みずタイプの 技で ＨＰが 回復し はれの時や ほのおタイプの 技で 減ってしまう。' },
    { id: 88, nameEN: 'Download', nameJA: 'ダウンロード', text: '相手の 防御と 特防を くらべて 低い ほうの 能力に あわせて 自分の 攻撃か 特攻を 上げる。' },
    { id: 89, nameEN: 'Iron Fist', nameJA: 'てつのこぶし', text: 'パンチを 使う 技の 威力が 上がる。' },
    { id: 90, nameEN: 'Poison Heal', nameJA: 'ポイズンヒール', text: 'どく状態に なると ＨＰが 減らずに 増えていく。' },
    { id: 91, nameEN: 'Adaptability', nameJA: 'てきおうりょく', text: '自分と おなじ タイプの 技の 威力が 上がる。' },
    { id: 92, nameEN: 'Skill Link', nameJA: 'スキルリンク', text: '連続技を 使うと いつも 最高回数 出すことが できる。' },
    { id: 93, nameEN: 'Hydration', nameJA: 'うるおいボディ', text: '天気が 雨のとき 状態異常が 治る。' },
    { id: 94, nameEN: 'Solar Power', nameJA: 'サンパワー', text: '天気が 晴れると 特攻が 上がるが 毎ターン ＨＰが 減る。' },
    { id: 95, nameEN: 'Quick Feet', nameJA: 'はやあし', text: '状態異常に なると 素早さが 上がる。' },
    { id: 96, nameEN: 'Normalize', nameJA: 'ノーマルスキン', text: 'どんな タイプの 技でも すべて ノーマルタイプに なる。 威力が 少し 上がる。' },
    { id: 97, nameEN: 'Sniper', nameJA: 'スナイパー', text: '攻撃を 急所に 当てると 威力が さらに 上がる。' },
    { id: 98, nameEN: 'Magic Guard', nameJA: 'マジックガード', text: '攻撃 以外では ダメージを 受けない。' },
    { id: 99, nameEN: 'No Guard', nameJA: 'ノーガード', text: 'ノーガード戦法に よって お互いの 出す 技が かならず 当たる ようになる。' },
    { id: 100, nameEN: 'Stall', nameJA: 'あとだし', text: '技を 出す 順番が かならず 最後に なる。' },
    { id: 101, nameEN: 'Technician', nameJA: 'テクニシャン', text: '威力が 低い 技の 威力を 高くして 攻撃できる。' },
    { id: 102, nameEN: 'Leaf Guard', nameJA: 'リーフガード', text: '天気が 晴れのときは 状態異常に ならない。' },
    { id: 103, nameEN: 'Klutz', nameJA: 'ぶきよう', text: '持っている 道具を 使うことが できない。' },
    { id: 104, nameEN: 'Mold Breaker', nameJA: 'かたやぶり', text: '相手の 特性に ジャマされる ことなく 相手に 技を 出すことが できる。' },
    { id: 105, nameEN: 'Super Luck', nameJA: 'きょううん', text: '強運を 持っているため 相手の 急所に 攻撃が 当たりやすい。' },
    { id: 106, nameEN: 'Aftermath', nameJA: 'ゆうばく', text: 'ひんしに なったとき 触った 相手に ダメージを あたえる。' },
    { id: 107, nameEN: 'Anticipation', nameJA: 'きけんよち', text: '相手の 持つ 危険な 技を 察知する ことができる。' },
    { id: 108, nameEN: 'Forewarn', nameJA: 'よちむ', text: '登場 したとき 相手の 持つ 技を ひとつだけ 読み取る。' },
    { id: 109, nameEN: 'Unaware', nameJA: 'てんねん', text: '相手の 能力の 変化を 無視して 攻撃が できる。' },
    { id: 110, nameEN: 'Tinted Lens', nameJA: 'いろめがね', text: '効果が いまひとつの 技を 通常の 威力で 出すことが できる。' },
    { id: 111, nameEN: 'Filter', nameJA: 'フィルター', text: '効果バツグンに なってしまう 攻撃の 威力を 弱める ことが できる。' },
    { id: 112, nameEN: 'Slow Start', nameJA: 'スロースタート', text: '５ターンの あいだ 攻撃と 素早さが 半分に なる。' },
    { id: 113, nameEN: 'Scrappy', nameJA: 'きもったま', text: 'ゴーストタイプの ポケモンに ノーマルタイプと かくとうタイプの 技を 当てることが できる。' },
    { id: 114, nameEN: 'Storm Drain', nameJA: 'よびみず', text: 'みずタイプの 技を 自分に よせつけ ダメージは 受けずに 特攻が 上がる。' },
    { id: 115, nameEN: 'Ice Body', nameJA: 'アイスボディ', text: '天気が あられのとき ＨＰを 少しずつ 回復 する。' },
    { id: 116, nameEN: 'Solid Rock', nameJA: 'ハードロック', text: '効果バツグンに なってしまう 攻撃の 威力を 弱める ことが できる。' },
    { id: 117, nameEN: 'Snow Warning', nameJA: 'ゆきふらし', text: '登場 したときに 天気を あられに する。' },
    { id: 118, nameEN: 'Honey Gather', nameJA: 'みつあつめ', text: '戦闘が 終わったとき あまいミツを 拾うことが ある。' },
    { id: 119, nameEN: 'Frisk', nameJA: 'おみとおし', text: '登場 したとき 相手の 持ち物を 見通すことが できる。' },
    { id: 120, nameEN: 'Reckless', nameJA: 'すてみ', text: '反動で ダメージを 受ける 技の 威力が 上がる。' },
    { id: 121, nameEN: 'Multitype', nameJA: 'マルチタイプ', text: '持っている プレートや Ｚクリスタルの タイプによって 自分の タイプが 変わる。' },
    { id: 122, nameEN: 'Flower Gift', nameJA: 'フラワーギフト', text: '天気が 晴れのとき 自分と 味方の 攻撃と 特防の 能力が 上がる。' },
    { id: 123, nameEN: 'Bad Dreams', nameJA: 'ナイトメア', text: 'ねむり状態の 相手に ダメージを あたえる。' },
    { id: 124, nameEN: 'Pickpocket', nameJA: 'わるいてぐせ', text: '触られた 相手の 道具を 盗んで しまう。' },
    { id: 125, nameEN: 'Sheer Force', nameJA: 'ちからずく', text: '技の 追加効果は なくなるが そのぶん 高い 威力で 技を 出すことが できる。' },
    { id: 126, nameEN: 'Contrary', nameJA: 'あまのじゃく', text: '能力の 変化が 逆転して 上がるときに 下がり 下がるときに 上がる。' },
    { id: 127, nameEN: 'Unnerve', nameJA: 'きんちょうかん', text: '相手を 緊張させて きのみを 食べられなく させる。' },
    { id: 128, nameEN: 'Defiant', nameJA: 'まけんき', text: '能力を 下げられると 攻撃が ぐーんと 上がる。' },
    { id: 129, nameEN: 'Defeatist', nameJA: 'よわき', text: 'ＨＰが 半分に なると 弱気に なって 攻撃と 特攻が 半減する。' },
    { id: 130, nameEN: 'Cursed Body', nameJA: 'のろわれボディ', text: '攻撃を 受けると 相手の 技を かなしばり状態に することが ある。' },
    { id: 131, nameEN: 'Healer', nameJA: 'いやしのこころ', text: '状態異常の 味方を たまに 治してあげる。' },
    { id: 132, nameEN: 'Friend Guard', nameJA: 'フレンドガード', text: '味方の ダメージを 減らすことが できる。' },
    { id: 133, nameEN: 'Weak Armor', nameJA: 'くだけるよろい', text: '物理技で ダメージを 受けると 防御が 下がり 素早さが ぐーんと 上がる。' },
    { id: 134, nameEN: 'Heavy Metal', nameJA: 'ヘヴィメタル', text: '自分の 重さが ２倍に なる。' },
    { id: 135, nameEN: 'Light Metal', nameJA: 'ライトメタル', text: '自分の 重さが 半分に なる。' },
    { id: 136, nameEN: 'Multiscale', nameJA: 'マルチスケイル', text: 'ＨＰが 満タンの ときに 受ける ダメージが 少なくなる。' },
    { id: 137, nameEN: 'Toxic Boost', nameJA: 'どくぼうそう', text: 'どく状態に なったとき 物理技の 威力が 上がる。' },
    { id: 138, nameEN: 'Flare Boost', nameJA: 'ねつぼうそう', text: 'やけど状態に なったとき 特殊技の 威力が 上がる。' },
    { id: 139, nameEN: 'Harvest', nameJA: 'しゅうかく', text: '使った きのみを 何回も 作りだす。' },
    { id: 140, nameEN: 'Telepathy', nameJA: 'テレパシー', text: '味方の 攻撃を 読み取って 技を 回避する。' },
    { id: 141, nameEN: 'Moody', nameJA: 'ムラっけ', text: '毎ターン 能力の どれかが ぐーんと 上がって どれかが 下がる。' },
    { id: 142, nameEN: 'Overcoat', nameJA: 'ぼうじん', text: 'すなあらしや あられなどの ダメージを 受けない。 粉の 技を 受けない。' },
    { id: 143, nameEN: 'Poison Touch', nameJA: 'どくしゅ', text: '触る だけで 相手を どく 状態に することがある。' },
    { id: 144, nameEN: 'Regenerator', nameJA: 'さいせいりょく', text: '手持ちに 引っ込むと ＨＰが 少し 回復する。' },
    { id: 145, nameEN: 'Big Pecks', nameJA: 'はとむね', text: '防御を 下げる 効果を 受けない。' },
    { id: 146, nameEN: 'Sand Rush', nameJA: 'すなかき', text: '天気が すなあらし のとき 素早さが 上がる。' },
    { id: 147, nameEN: 'Wonder Skin', nameJA: 'ミラクルスキン', text: '変化技を 受けにくい 体に なっている。' },
    { id: 148, nameEN: 'Analytic', nameJA: 'アナライズ', text: 'いちばん 最後に 技を 出すと 技の 威力が 上がる。' },
    { id: 149, nameEN: 'Illusion', nameJA: 'イリュージョン', text: '手持ちの いちばん うしろに いる ポケモンに なりきって 登場して 相手を 化かす。' },
    { id: 150, nameEN: 'Imposter', nameJA: 'かわりもの', text: '目の前の ポケモンに 変身 してしまう。' },
    { id: 151, nameEN: 'Infiltrator', nameJA: 'すりぬけ', text: '相手の 壁や 身代わりを すりぬけて 攻撃 できる' },
    { id: 152, nameEN: 'Mummy', nameJA: 'ミイラ', text: '相手に 触られると 相手を ミイラに してしまう。' },
    { id: 153, nameEN: 'Moxie', nameJA: 'じしんかじょう', text: '相手を 倒すと 自信が ついて 攻撃が 上がる。' },
    { id: 154, nameEN: 'Justified', nameJA: 'せいぎのこころ', text: 'あくタイプの 攻撃を 受けると 正義感で 攻撃が 上がる。' },
    { id: 155, nameEN: 'Rattled', nameJA: 'びびり', text: 'あくタイプと ゴーストタイプと むしタイプの 技を 受けると びびって 素早さが 上がる。' },
    { id: 156, nameEN: 'Magic Bounce', nameJA: 'マジックミラー', text: '相手に だされた 変化技を 受けずに そのまま 返す ことが できる。' },
    { id: 157, nameEN: 'Sap Sipper', nameJA: 'そうしょく', text: 'くさタイプの 技を 受けると ダメージを 受けずに 攻撃が 上がる。' },
    { id: 158, nameEN: 'Prankster', nameJA: 'いたずらごころ', text: '変化技を 先制で 出すことが できる。' },
    { id: 159, nameEN: 'Sand Force', nameJA: 'すなのちから', text: '天気が すなあらしの とき いわタイプと じめんタイプと はがねタイプの 威力が 上がる。' },
    { id: 160, nameEN: 'Iron Barbs', nameJA: 'てつのトゲ', text: '自分に 触った 相手に 鉄のトゲで ダメージを あたえる。' },
    { id: 161, nameEN: 'Zen Mode', nameJA: 'ダルマモード', text: 'ＨＰが 半分 以下に なると 姿が 変化する。' },
    { id: 162, nameEN: 'Victory Star', nameJA: 'しょうりのほし', text: '自分や 味方の 命中率が 上がる。' },
    { id: 163, nameEN: 'Turboblaze', nameJA: 'ターボブレイズ', text: '相手の 特性に ジャマされず 相手に 技を 出すことが できる。' },
    { id: 164, nameEN: 'Teravolt', nameJA: 'テラボルテージ', text: '相手の 特性に ジャマされず 相手に 技を 出すことが できる。' },
    { id: 165, nameEN: 'Aroma Veil', nameJA: 'アロマベール', text: '自分と 味方への メンタル 攻撃を 防ぐことが できる。' },
    { id: 166, nameEN: 'Flower Veil', nameJA: 'フラワーベール', text: '味方の 草ポケモンは 能力が 下がらず 状態異常にも ならない。' },
    { id: 167, nameEN: 'Cheek Pouch', nameJA: 'ほおぶくろ', text: 'どんな きのみでも 食べると ＨＰも 回復する。' },
    { id: 168, nameEN: 'Protean', nameJA: 'へんげんじざい', text: '自分が 出す 技と 同じ タイプに 変化する。' },
    { id: 169, nameEN: 'Fur Coat', nameJA: 'ファーコート', text: '相手から 受ける 物理技の ダメージが 半分に なる。' },
    { id: 170, nameEN: 'Magician', nameJA: 'マジシャン', text: '技を 当てた 相手の 道具を 奪ってしまう。' },
    { id: 171, nameEN: 'Bulletproof', nameJA: 'ぼうだん', text: '相手の 弾や 爆弾などの 技を 防ぐことが できる。' },
    { id: 172, nameEN: 'Competitive', nameJA: 'かちき', text: '能力を 下げられると 特攻が ぐーんと 上がる。' },
    { id: 173, nameEN: 'Strong Jaw', nameJA: 'がんじょうあご', text: 'あごが 頑丈で 噛む 技の 威力が 高くなる。' },
    { id: 174, nameEN: 'Refrigerate', nameJA: 'フリーズスキン', text: 'ノーマルタイプの 技が こおりタイプに なる。 威力が 少し 上がる。' },
    { id: 175, nameEN: 'Sweet Veil', nameJA: 'スイートベール', text: '味方の ポケモンは 眠らなくなる。' },
    { id: 176, nameEN: 'Stance Change', nameJA: 'バトルスイッチ', text: '攻撃技を 出すと ブレードフォルムに 技 キングシールドを 出すと シールドフォルムに 変化する。' },
    { id: 177, nameEN: 'Gale Wings', nameJA: 'はやてのつばさ', text: 'ＨＰが 満タン だと ひこうタイプの 技を 先制で 出すことが できる。' },
    { id: 178, nameEN: 'Mega Launcher', nameJA: 'メガランチャー', text: '波動の 技の 威力が 高くなる。' },
    { id: 179, nameEN: 'Grass Pelt', nameJA: 'くさのけがわ', text: 'グラスフィールドのとき 防御が 上がる。' },
    { id: 180, nameEN: 'Symbiosis', nameJA: 'きょうせい', text: '味方が 道具を 使うと 自分の 持っている 道具を 味方に 渡す。' },
    { id: 181, nameEN: 'Tough Claws', nameJA: 'かたいツメ', text: '相手に 接触する 技の 威力が 高くなる。' },
    { id: 182, nameEN: 'Pixilate', nameJA: 'フェアリースキン', text: 'ノーマルタイプの 技が フェアリータイプになる。 威力が 少し 上がる。' },
    { id: 183, nameEN: 'Gooey', nameJA: 'ぬめぬめ', text: '攻撃で 自分に 触れた 相手の 素早さを 下げる。' },
    { id: 184, nameEN: 'Aerilate', nameJA: 'スカイスキン', text: 'ノーマルタイプの 技が ひこうタイプになる。 威力が 少し 上がる。' },
    { id: 185, nameEN: 'Parental Bond', nameJA: 'おやこあい', text: '親子 ２匹で ２回 攻撃することが できる。' },
    { id: 186, nameEN: 'Dark Aura', nameJA: 'ダークオーラ', text: '全員の あくタイプの 技が 強くなる。' },
    { id: 187, nameEN: 'Fairy Aura', nameJA: 'フェアリーオーラ', text: '全員の フェアリータイプの 技が 強くなる。' },
    { id: 188, nameEN: 'Aura Break', nameJA: 'オーラブレイク', text: 'オーラの 効果を 逆転させて 威力を 下げる。' },
    { id: 189, nameEN: 'Primordial Sea', nameJA: 'はじまりのうみ', text: 'ほのおタイプの 攻撃を 受けない 天気にする。' },
    { id: 190, nameEN: 'Desolate Land', nameJA: 'おわりのだいち', text: 'みずタイプの 攻撃を 受けない 天気にする。' },
    { id: 191, nameEN: 'Delta Stream', nameJA: 'デルタストリーム', text: 'ひこうタイプの 弱点が なくなる 天気にする。' },
    { id: 192, nameEN: 'Stamina', nameJA: 'じきゅうりょく', text: '攻撃を 受けると 防御が 上がる。' },
    { id: 193, nameEN: 'Wimp Out', nameJA: 'にげごし', text: 'ＨＰが 半分に なると あわてて 逃げ出して 手持ちに 引っ込んで しまう。' },
    { id: 194, nameEN: 'Emergency Exit', nameJA: 'ききかいひ', text: 'ＨＰが 半分に なると 危険を 回避するため 手持ちに 引っ込んで しまう。' },
    { id: 195, nameEN: 'Water Compaction', nameJA: 'みずがため', text: 'みずタイプの 技を 受けると 防御が ぐーんと 上がる。' },
    { id: 196, nameEN: 'Merciless', nameJA: 'ひとでなし', text: 'どく状態の 相手を 攻撃すると かならず 急所に 当たる。' },
    { id: 197, nameEN: 'Shields Down', nameJA: 'リミットシールド', text: 'ＨＰが 半分に なると 殻が 壊れて 攻撃的に なる。' },
    { id: 198, nameEN: 'Stakeout', nameJA: 'はりこみ', text: '交代で 出てきた 相手に ２倍の ダメージで 攻撃 できる。' },
    { id: 199, nameEN: 'Water Bubble', nameJA: 'すいほう', text: '自分に 対する ほのおタイプの 技の 威力を 下げる。 やけど しない。' },
    { id: 200, nameEN: 'Steelworker', nameJA: 'はがねつかい', text: 'はがねタイプの 技の 威力が 上がる。' },
    { id: 201, nameEN: 'Berserk', nameJA: 'ぎゃくじょう', text: '相手の 攻撃で ＨＰが 半分に なると 特攻が 上がる。' },
    { id: 202, nameEN: 'Slush Rush', nameJA: 'ゆきかき', text: '天気が あられ のとき 素早さが 上がる。' },
    { id: 203, nameEN: 'Long Reach', nameJA: 'えんかく', text: 'すべての 技を 相手に 接触 しないで 出すことが できる。' },
    { id: 204, nameEN: 'Liquid Voice', nameJA: 'うるおいボイス', text: 'すべての 音技が みずタイプに なる。' },
    { id: 205, nameEN: 'Triage', nameJA: 'ヒーリングシフト', text: '回復技を 先制で 出すことが できる。' },
    { id: 206, nameEN: 'Galvanize', nameJA: 'エレキスキン', text: 'ノーマルタイプの 技が でんきタイプになる。 威力が 少し 上がる。' },
    { id: 207, nameEN: 'Surge Surfer', nameJA: 'サーフテール', text: 'エレキフィールド のとき 素早さが ２倍に なる。' },
    { id: 208, nameEN: 'Schooling', nameJA: 'ぎょぐん', text: 'ＨＰが 多いときは 群れて 強くなる。 ＨＰの 残りが 少なくなると 群れは 散り散りに なってしまう。' },
    { id: 209, nameEN: 'Disguise', nameJA: 'ばけのかわ', text: '体を 被う 化けの皮で １回 攻撃を 防ぐことが できる。' },
    { id: 210, nameEN: 'Battle Bond', nameJA: 'きずなへんげ', text: '相手を 倒すと トレーナーとの キズナが 深まり サトシゲッコウガに 変化する。みずしゅりけんが 強くなる。' },
    { id: 211, nameEN: 'Power Construct', nameJA: 'スワームチェンジ', text: 'ＨＰが 半分に なると セルたちが 応援に 駆けつけ パーフェクトフォルムに 姿を 変える。' },
    { id: 212, nameEN: 'Corrosion', nameJA: 'ふしょく', text: 'はがねタイプや どくタイプも どく状態に することが できる。' },
    { id: 213, nameEN: 'Comatose', nameJA: 'ぜったいねむり', text: 'つねに 夢うつつの 状態で 絶対に 目覚めない。 眠ったまま 攻撃が できる。' },
    { id: 214, nameEN: 'Queenly Majesty', nameJA: 'じょおうのいげん', text: '相手に 威圧感を あたえ こちらに むかって 先制技を 出せない ようにする。' },
    { id: 215, nameEN: 'Innards Out', nameJA: 'とびだすなかみ', text: '相手に 倒されたとき ＨＰの 残りの ぶんだけ 相手に ダメージを あたえる。' },
    { id: 216, nameEN: 'Dancer', nameJA: 'おどりこ', text: 'だれかが 踊り技を 使うと 自分も それに 続いて 踊り技を 出すことが できる。' },
    { id: 217, nameEN: 'Battery', nameJA: 'バッテリー', text: '味方の 特殊技の 威力を 上げる。' },
    { id: 218, nameEN: 'Fluffy', nameJA: 'もふもふ', text: '相手から 受けた 接触する 技の ダメージを 半減するが ほのおタイプの 技の ダメージは ２倍になる。' },
    { id: 219, nameEN: 'Dazzling', nameJA: 'ビビッドボディ', text: '相手を びっくり させて こちらに むかって 先制技を 出せない ようにする。' },
    { id: 220, nameEN: 'Soul-Heart', nameJA: 'ソウルハート', text: 'ポケモンが ひんしに なるたびに 特攻が 上がる。' },
    { id: 221, nameEN: 'Tangling Hair', nameJA: 'カーリーヘアー', text: '攻撃で 自分に 触れた 相手の 素早さを 下げる。' },
    { id: 222, nameEN: 'Receiver', nameJA: 'レシーバー', text: '倒された 味方の 特性を 受け継いで 同じ 特性に なる。' },
    { id: 223, nameEN: 'Power of Alchemy', nameJA: 'かがくのちから', text: '倒された 味方の 特性を 受け継ぎ 同じ 特性に 変わる。' },
    { id: 224, nameEN: 'Beast Boost', nameJA: 'ビーストブースト', text: '相手を 倒したとき 自分の いちばん 高い 能力が 上がる。' },
    { id: 225, nameEN: 'RKS System', nameJA: 'ＡＲシステム', text: '持っている メモリで 自分の タイプが 変わる。' },
    { id: 226, nameEN: 'Electric Surge', nameJA: 'エレキメイカー', text: '登場 したときに エレキフィールドを はりめぐらせる。' },
    { id: 227, nameEN: 'Psychic Surge', nameJA: 'サイコメイカー', text: '登場 したときに サイコフィールドを はりめぐらせる。' },
    { id: 228, nameEN: 'Misty Surge', nameJA: 'ミストメイカー', text: '登場 したときに ミストフィールドを はりめぐらせる。' },
    { id: 229, nameEN: 'Grassy Surge', nameJA: 'グラスメイカー', text: '登場 したときに グラスフィールドを はりめぐらせる。' },
    { id: 230, nameEN: 'Full Metal Body', nameJA: 'メタルプロテクト', text: '相手の 技や 特性で 能力を 下げられない。' },
    { id: 231, nameEN: 'Shadow Shield', nameJA: 'ファントムガード', text: 'ＨＰが 満タンの ときに 受ける ダメージが 少なくなる。' },
    { id: 232, nameEN: 'Prism Armor', nameJA: 'プリズムアーマー', text: '効果バツグンに なってしまう 攻撃の 威力を 弱める ことが できる。' },
    { id: 233, nameEN: 'Neuroforce', nameJA: 'ブレインフォース', text: '効果バツグンの 攻撃で 威力が さらに 上がる。' },
    { id: 234, nameEN: 'Intrepid Sword', nameJA: 'ふとうのけん', text: '登場 したときに 攻撃が 上がる。' },
    { id: 235, nameEN: 'Dauntless Shield', nameJA: 'ふくつのたて', text: '登場 したときに 防御が 上がる。' },
    { id: 236, nameEN: 'Libero', nameJA: 'リベロ', text: '自分が 出す 技と 同じ タイプに 変化する。' },
    { id: 237, nameEN: 'Ball Fetch', nameJA: 'たまひろい', text: '道具を 持っていない 場合 １回目に 投げて 失敗 した モンスターボールを 拾ってくる。' },
    { id: 238, nameEN: 'Cotton Down', nameJA: 'わたげ', text: '攻撃を 受けると わたげを ばらまいて 自分以外の ポケモン すべての 素早さを 下げる。' },
    { id: 239, nameEN: 'Propeller Tail', nameJA: 'スクリューおびれ', text: '相手の 技を 引き受ける 特性や 技の 影響を 無視 できる。' },
    { id: 240, nameEN: 'Mirror Armor', nameJA: 'ミラーアーマー', text: '自分が 受けた 能力 ダウンの 効果 だけを 跳ね返す。' },
    { id: 241, nameEN: 'Gulp Missile', nameJA: 'うのミサイル', text: 'なみのりか ダイビングを すると 獲物を くわえてくる。 ダメージを 受けると 獲物を 吐きだして 攻撃。' },
    { id: 242, nameEN: 'Stalwart', nameJA: 'すじがねいり', text: '相手の 技を 引き受ける 特性や 技の 影響を 無視 できる。' },
    { id: 243, nameEN: 'Steam Engine', nameJA: 'じょうききかん', text: 'みずタイプ ほのおタイプの 技を 受けると 素早さが ぐぐーんと 上がる。' },
    { id: 244, nameEN: 'Punk Rock', nameJA: 'パンクロック', text: '音技の 威力が 上がる。 受けた 音技の ダメージは 半分に なる。' },
    { id: 245, nameEN: 'Sand Spit', nameJA: 'すなはき', text: '攻撃を 受けると 砂あらしを 起こす。' },
    { id: 246, nameEN: 'Ice Scales', nameJA: 'こおりのりんぷん', text: 'こおりのりんぷんに 守られて 特殊攻撃で 受ける ダメージが 半減 する。' },
    { id: 247, nameEN: 'Ripen', nameJA: 'じゅくせい', text: '熟成 させることで きのみの 効果が 倍に なる。' },
    { id: 248, nameEN: 'Ice Face', nameJA: 'アイスフェイス', text: '物理攻撃は 頭の 氷が みがわりに なるが 姿も 変わる。 氷は あられが 降ると 元に戻る。' },
    { id: 249, nameEN: 'Power Spot', nameJA: 'パワースポット', text: '隣に いるだけで 技の 威力が 上がる。' },
    { id: 250, nameEN: 'Mimicry', nameJA: 'ぎたい', text: 'フィールドの 状態に あわせて ポケモンの タイプが 変わる。' },
    { id: 251, nameEN: 'Screen Cleaner', nameJA: 'バリアフリー', text: '登場 したときに 敵と 味方の ひかりのかべ リフレクター オーロラベールの 効果が 消える。' },
    { id: 252, nameEN: 'Steely Spirit', nameJA: 'はがねのせいしん', text: '味方の はがねタイプの 攻撃の 威力が 上がる。' },
    { id: 253, nameEN: 'Perish Body', nameJA: 'ほろびのボディ', text: '接触する 技を 受けると お互い ３ターン たつと ひんしになる。 交代すると 効果は なくなる。' },
    { id: 254, nameEN: 'Wandering Spirit', nameJA: 'さまようたましい', text: '接触する 技で 攻撃 してきた ポケモンと 特性を 入れ替える。' },
    { id: 255, nameEN: 'Gorilla Tactics', nameJA: 'ごりむちゅう', text: '攻撃は 上がるが 最初に 選んだ 技しか 出せなくなる。' },
    { id: 256, nameEN: 'Neutralizing Gas', nameJA: 'かがくへんかガス', text: 'かがくへんかガスの ポケモンが 場にいると すべての ポケモンの 特性の 効果が 消えたり 発動 しなくなる。' },
    { id: 257, nameEN: 'Pastel Veil', nameJA: 'パステルベール', text: '自分も 味方も どくの 状態異常を 受けなくなる。' },
    { id: 258, nameEN: 'Hunger Switch', nameJA: 'はらぺこスイッチ', text: 'ターンの 終わりに まんぷくもよう はらぺこもよう まんぷくもよう……と 交互に 姿を 変える。' },
    { id: 259, nameEN: 'Quick Draw', nameJA: 'クイックドロウ', text: '相手より 先に 行動できることが ある。' },
    { id: 260, nameEN: 'Unseen Fist', nameJA: 'ふかしのこぶし', text: '相手に 接触する 技なら 守りの 効果を 無視して 攻撃することが できる。' },
    { id: 261, nameEN: 'Curious Medicine', nameJA: 'きみょうなくすり', text: '登場 したときに 貝がらから 薬を 振りまいて 味方の 能力変化を 元に戻す。' },
    { id: 262, nameEN: 'Transistor', nameJA: 'トランジスタ', text: 'でんきタイプの 技の 威力が 上がる。' },
    { id: 263, nameEN: 'Dragon’s Maw', nameJA: 'りゅうのあぎと', text: 'ドラゴンタイプの 技の 威力が 上がる。' },
    { id: 264, nameEN: 'Chilling Neigh', nameJA: 'しろのいななき', text: '相手を 倒すと 冷たい 声で いなないて 攻撃が 上がる。' },
    { id: 265, nameEN: 'Grim Neigh', nameJA: 'くろのいななき', text: '相手を 倒すと 恐ろしい 声で いなないて 特攻が 上がる。' },
    { id: 266, nameEN: 'As One', nameJA: 'じんばいったい', text: 'バドレックスの きんちょうかんと ブリザポスの しろのいななきの 二つの 特性を あわせ持つ。' },
    { id: 267, nameEN: 'As One', nameJA: 'じんばいったい', text: 'バドレックスの きんちょうかんと レイスポスの くろのいななきの 二つの 特性を あわせ持つ。' },
    { id: 268, nameEN: 'Lingering Aroma', nameJA: 'とれないにおい', text: '' },
    { id: 269, nameEN: 'Seed Sower', nameJA: 'こぼれダネ', text: '' },
    { id: 270, nameEN: 'Thermal Exchange', nameJA: 'ねつこうかん', text: '' },
    { id: 271, nameEN: 'Anger Shell', nameJA: 'いかりのこうら', text: '' },
    { id: 272, nameEN: 'Purifying Salt', nameJA: 'きよめのしお', text: '' },
    { id: 273, nameEN: 'Well-Baked Body', nameJA: 'こんがりボディ', text: '' },
    { id: 274, nameEN: 'Wind Rider', nameJA: 'かぜのり', text: '' },
    { id: 275, nameEN: 'Guard Dog', nameJA: 'ばんけん', text: '' },
    { id: 276, nameEN: 'Rocky Payload', nameJA: 'いわはこび', text: '' },
    { id: 277, nameEN: 'Wind Power', nameJA: 'ふうりょくでんき', text: '' },
    { id: 278, nameEN: 'Zero to Hero', nameJA: 'マイティチェンジ', text: '' },
    { id: 279, nameEN: 'Commander', nameJA: 'しれいとう', text: '' },
    { id: 280, nameEN: 'Electromorphosis', nameJA: 'でんきにかえる', text: '' },
    { id: 281, nameEN: 'Protosynthesis', nameJA: 'こだいかっせい', text: '' },
    { id: 282, nameEN: 'Quark Drive', nameJA: 'クォークチャージ', text: '' },
    { id: 283, nameEN: 'Good as Gold', nameJA: 'おうごんのからだ', text: '' },
    { id: 284, nameEN: 'Vessel of Ruin', nameJA: 'わざわいのうつわ', text: '' },
    { id: 285, nameEN: 'Sword of Ruin', nameJA: 'わざわいのつるぎ', text: '' },
    { id: 286, nameEN: 'Tablets of Ruin', nameJA: 'わざわいのおふだ', text: '' },
    { id: 287, nameEN: 'Beads of Ruin', nameJA: 'わざわいのたま', text: '' },
    { id: 288, nameEN: 'Orichalcum Pulse', nameJA: 'ひひいろのこどう', text: '' },
    { id: 289, nameEN: 'Hadron Engine', nameJA: 'ハドロンエンジン', text: '' },
    { id: 290, nameEN: 'Opportunist', nameJA: 'びんじょう', text: '' },
    { id: 291, nameEN: 'Cud Chew', nameJA: 'はんすう', text: '' },
    { id: 292, nameEN: 'Sharpness', nameJA: 'きれあじ', text: '' },
    { id: 293, nameEN: 'Supreme Overlord', nameJA: 'そうだいしょう', text: '' },
    { id: 294, nameEN: 'Costar', nameJA: 'きょうえん', text: '' },
    { id: 295, nameEN: 'Toxic Debris', nameJA: 'どくげしょう', text: '' },
    { id: 296, nameEN: 'Armor Tail', nameJA: 'テイルアーマー', text: '' },
    { id: 297, nameEN: 'Earth Eater', nameJA: 'どしょく', text: '' },
    { id: 298, nameEN: 'Mycelium Might', nameJA: 'きんしのちから', text: '' },
    { id: 299, nameEN: 'Mind’s Eye', nameJA: 'しんがん', text: '' },
    { id: 300, nameEN: 'Supersweet Syrup', nameJA: '', text: '' },
    { id: 301, nameEN: 'Hospitality', nameJA: 'おもてなし', text: '' },
    { id: 302, nameEN: 'Toxic Chain', nameJA: 'どくのくさり', text: '' },
    { id: 303, nameEN: 'Embody Aspect', nameJA: 'おもかげやどし', text: '' },
    { id: 304, nameEN: 'Tera Shift', nameJA: 'テラスチェンジ', text: '' },
    { id: 305, nameEN: 'Tera Shell', nameJA: 'テラスシェル', text: '' },
    { id: 306, nameEN: 'Teraform Zero', nameJA: 'ゼロフォーミング', text: '' },
    { id: 307, nameEN: 'Poison Puppeteer', nameJA: 'どくくぐつ', text: '' },
];
