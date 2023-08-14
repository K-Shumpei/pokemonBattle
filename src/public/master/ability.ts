const abilityData: AbilityDataType[] = [
  { id: 1, nameJA: 'あくしゅう', nameEN: 'Stench' },
  { id: 2, nameJA: 'あめふらし', nameEN: 'Drizzle' },
  { id: 3, nameJA: 'かそく', nameEN: 'Speed Boost' },
  { id: 4, nameJA: 'カブトアーマー', nameEN: 'Battle Armor' },
  { id: 5, nameJA: 'がんじょう', nameEN: 'Sturdy' },
  { id: 6, nameJA: 'しめりけ', nameEN: 'Damp' },
  { id: 7, nameJA: 'じゅうなん', nameEN: 'Limber' },
  { id: 8, nameJA: 'すながくれ', nameEN: 'Sand Veil' },
  { id: 9, nameJA: 'せいでんき', nameEN: 'Static' },
  { id: 10, nameJA: 'ちくでん', nameEN: 'Volt Absorb' },
  { id: 11, nameJA: 'ちょすい', nameEN: 'Water Absorb' },
  { id: 12, nameJA: 'どんかん', nameEN: 'Oblivious' },
  { id: 13, nameJA: 'ノーてんき', nameEN: 'Cloud Nine' },
  { id: 14, nameJA: 'ふくがん', nameEN: 'Compound Eyes' },
  { id: 15, nameJA: 'ふみん', nameEN: 'Insomnia' },
  { id: 16, nameJA: 'へんしょく', nameEN: 'Color Change' },
  { id: 17, nameJA: 'めんえき', nameEN: 'Immunity' },
  { id: 18, nameJA: 'もらいび', nameEN: 'Flash Fire' },
  { id: 19, nameJA: 'りんぷん', nameEN: 'Shield Dust' },
  { id: 20, nameJA: 'マイペース', nameEN: 'Own Tempo' },
  { id: 21, nameJA: 'きゅうばん', nameEN: 'Suction Cups' },
  { id: 22, nameJA: 'いかく', nameEN: 'Intimidate' },
  { id: 23, nameJA: 'かげふみ', nameEN: 'Shadow Tag' },
  { id: 24, nameJA: 'さめはだ', nameEN: 'Rough Skin' },
  { id: 25, nameJA: 'ふしぎなまもり', nameEN: 'Wonder Guard' },
  { id: 26, nameJA: 'ふゆう', nameEN: 'Levitate' },
  { id: 27, nameJA: 'ほうし', nameEN: 'Effect Spore' },
  { id: 28, nameJA: 'シンクロ', nameEN: 'Synchronize' },
  { id: 29, nameJA: 'クリアボディ', nameEN: 'Clear Body' },
  { id: 30, nameJA: 'しぜんかいふく', nameEN: 'Natural Cure' },
  { id: 31, nameJA: 'ひらいしん', nameEN: 'Lightning Rod' },
  { id: 32, nameJA: 'てんのめぐみ', nameEN: 'Serene Grace' },
  { id: 33, nameJA: 'すいすい', nameEN: 'Swift Swim' },
  { id: 34, nameJA: 'ようりょくそ', nameEN: 'Chlorophyll' },
  { id: 35, nameJA: 'はっこう', nameEN: 'Illuminate' },
  { id: 36, nameJA: 'トレース', nameEN: 'Trace' },
  { id: 37, nameJA: 'ちからもち', nameEN: 'Huge Power' },
  { id: 38, nameJA: 'どくのトゲ', nameEN: 'Poison Point' },
  { id: 39, nameJA: 'せいしんりょく', nameEN: 'Inner Focus' },
  { id: 40, nameJA: 'マグマのよろい', nameEN: 'Magma Armor' },
  { id: 41, nameJA: 'みずのベール', nameEN: 'Water Veil' },
  { id: 42, nameJA: 'じりょく', nameEN: 'Magnet Pull' },
  { id: 43, nameJA: 'ぼうおん', nameEN: 'Soundproof' },
  { id: 44, nameJA: 'あめうけざら', nameEN: 'Rain Dish' },
  { id: 45, nameJA: 'すなおこし', nameEN: 'Sand Stream' },
  { id: 46, nameJA: 'プレッシャー', nameEN: 'Pressure' },
  { id: 47, nameJA: 'あついしぼう', nameEN: 'Thick Fat' },
  { id: 48, nameJA: 'はやおき', nameEN: 'Early Bird' },
  { id: 49, nameJA: 'ほのおのからだ', nameEN: 'Flame Body' },
  { id: 51, nameJA: 'するどいめ', nameEN: 'Keen Eye' },
  { id: 52, nameJA: 'かいりきバサミ', nameEN: 'Hyper Cutter' },
  { id: 53, nameJA: 'ものひろい', nameEN: 'Pickup' },
  { id: 54, nameJA: 'なまけ', nameEN: 'Truant' },
  { id: 55, nameJA: 'はりきり', nameEN: 'Hustle' },
  { id: 56, nameJA: 'メロメロボディ', nameEN: 'Cute Charm' },
  { id: 57, nameJA: 'プラス', nameEN: 'Plus' },
  { id: 58, nameJA: 'マイナス', nameEN: 'Minus' },
  { id: 59, nameJA: 'てんきや', nameEN: 'Forecast' },
  { id: 60, nameJA: 'ねんちゃく', nameEN: 'Sticky Hold' },
  { id: 61, nameJA: 'だっぴ', nameEN: 'Shed Skin' },
  { id: 62, nameJA: 'こんじょう', nameEN: 'Guts' },
  { id: 63, nameJA: 'ふしぎなうろこ', nameEN: 'Marvel Scale' },
  { id: 64, nameJA: 'ヘドロえき', nameEN: 'Liquid Ooze' },
  { id: 65, nameJA: 'しんりょく', nameEN: 'Overgrow' },
  { id: 66, nameJA: 'もうか', nameEN: 'Blaze' },
  { id: 67, nameJA: 'げきりゅう', nameEN: 'Torrent' },
  { id: 68, nameJA: 'むしのしらせ', nameEN: 'Swarm' },
  { id: 69, nameJA: 'いしあたま', nameEN: 'Rock Head' },
  { id: 70, nameJA: 'ひでり', nameEN: 'Drought' },
  { id: 71, nameJA: 'ありじごく', nameEN: 'Arena Trap' },
  { id: 72, nameJA: 'やるき', nameEN: 'Vital Spirit' },
  { id: 73, nameJA: 'しろいけむり', nameEN: 'White Smoke' },
  { id: 74, nameJA: 'ヨガパワー', nameEN: 'Pure Power' },
  { id: 75, nameJA: 'シェルアーマー', nameEN: 'Shell Armor' },
  { id: 76, nameJA: 'エアロック', nameEN: 'Air Lock' },
  { id: 77, nameJA: 'ちどりあし', nameEN: 'Tangled Feet' },
  { id: 78, nameJA: 'でんきエンジン', nameEN: 'Motor Drive' },
  { id: 79, nameJA: 'とうそうしん', nameEN: 'Rivalry' },
  { id: 80, nameJA: 'ふくつのこころ', nameEN: 'Steadfast' },
  { id: 81, nameJA: 'ゆきがくれ', nameEN: 'Snow Cloak' },
  { id: 82, nameJA: 'くいしんぼう', nameEN: 'Gluttony' },
  { id: 83, nameJA: 'いかりのつぼ', nameEN: 'Anger Point' },
  { id: 84, nameJA: 'かるわざ', nameEN: 'Unburden' },
  { id: 85, nameJA: 'たいねつ', nameEN: 'Heatproof' },
  { id: 86, nameJA: 'たんじゅん', nameEN: 'Simple' },
  { id: 87, nameJA: 'かんそうはだ', nameEN: 'Dry Skin' },
  { id: 88, nameJA: 'ダウンロード', nameEN: 'Download' },
  { id: 89, nameJA: 'てつのこぶし', nameEN: 'Iron Fist' },
  { id: 90, nameJA: 'ポイズンヒール', nameEN: 'Poison Heal' },
  { id: 91, nameJA: 'てきおうりょく', nameEN: 'Adaptability' },
  { id: 92, nameJA: 'スキルリンク', nameEN: 'Skill Link' },
  { id: 93, nameJA: 'うるおいボディ', nameEN: 'Hydration' },
  { id: 94, nameJA: 'サンパワー', nameEN: 'Solar Power' },
  { id: 95, nameJA: 'はやあし', nameEN: 'Quick Feet' },
  { id: 96, nameJA: 'ノーマルスキン', nameEN: 'Normalize' },
  { id: 97, nameJA: 'スナイパー', nameEN: 'Sniper' },
  { id: 98, nameJA: 'マジックガード', nameEN: 'Magic Guard' },
  { id: 99, nameJA: 'ノーガード', nameEN: 'No Guard' },
  { id: 101, nameJA: 'テクニシャン', nameEN: 'Technician' },
  { id: 102, nameJA: 'リーフガード', nameEN: 'Leaf Guard' },
  { id: 103, nameJA: 'ぶきよう', nameEN: 'Klutz' },
  { id: 104, nameJA: 'かたやぶり', nameEN: 'Mold Breaker' },
  { id: 105, nameJA: 'きょううん', nameEN: 'Super Luck' },
  { id: 106, nameJA: 'ゆうばく', nameEN: 'Aftermath' },
  { id: 107, nameJA: 'きけんよち', nameEN: 'Anticipation' },
  { id: 108, nameJA: 'よちむ', nameEN: 'Forewarn' },
  { id: 109, nameJA: 'てんねん', nameEN: 'Unaware' },
  { id: 110, nameJA: 'いろめがね', nameEN: 'Tinted Lens' },
  { id: 111, nameJA: 'フィルター', nameEN: 'Filter' },
  { id: 112, nameJA: 'スロースタート', nameEN: 'Slow Start' },
  { id: 113, nameJA: 'きもったま', nameEN: 'Scrappy' },
  { id: 114, nameJA: 'よびみず', nameEN: 'Storm Drain' },
  { id: 115, nameJA: 'アイスボディ', nameEN: 'Ice Body' },
  { id: 116, nameJA: 'ハードロック', nameEN: 'Solid Rock' },
  { id: 117, nameJA: 'ゆきふらし', nameEN: 'Snow Warning' },
  { id: 118, nameJA: 'みつあつめ', nameEN: 'Honey Gather' },
  { id: 119, nameJA: 'おみとおし', nameEN: 'Frisk' },
  { id: 120, nameJA: 'すてみ', nameEN: 'Reckless' },
  { id: 121, nameJA: 'マルチタイプ', nameEN: 'Multitype' },
  { id: 122, nameJA: 'フラワーギフト', nameEN: 'Flower Gift' },
  { id: 123, nameJA: 'ナイトメア', nameEN: 'Bad Dreams' },
  { id: 124, nameJA: 'わるいてぐせ', nameEN: 'Pickpocket' },
  { id: 125, nameJA: 'ちからずく', nameEN: 'Sheer Force' },
  { id: 126, nameJA: 'あまのじゃく', nameEN: 'Contrary' },
  { id: 127, nameJA: 'きんちょうかん', nameEN: 'Unnerve' },
  { id: 128, nameJA: 'まけんき', nameEN: 'Defiant' },
  { id: 129, nameJA: 'よわき', nameEN: 'Defeatist' },
  { id: 130, nameJA: 'のろわれボディ', nameEN: 'Cursed Body' },
  { id: 131, nameJA: 'いやしのこころ', nameEN: 'Healer' },
  { id: 132, nameJA: 'フレンドガード', nameEN: 'Friend Guard' },
  { id: 133, nameJA: 'くだけるよろい', nameEN: 'Weak Armor' },
  { id: 134, nameJA: 'ヘヴィメタル', nameEN: 'Heavy Metal' },
  { id: 135, nameJA: 'ライトメタル', nameEN: 'Light Metal' },
  { id: 136, nameJA: 'マルチスケイル', nameEN: 'Multiscale' },
  { id: 137, nameJA: 'どくぼうそう', nameEN: 'Toxic Boost' },
  { id: 138, nameJA: 'ねつぼうそう', nameEN: 'Flare Boost' },
  { id: 139, nameJA: 'しゅうかく', nameEN: 'Harvest' },
  { id: 140, nameJA: 'テレパシー', nameEN: 'Telepathy' },
  { id: 141, nameJA: 'ムラっけ', nameEN: 'Moody' },
  { id: 142, nameJA: 'ぼうじん', nameEN: 'Overcoat' },
  { id: 143, nameJA: 'どくしゅ', nameEN: 'Poison Touch' },
  { id: 144, nameJA: 'さいせいりょく', nameEN: 'Regenerator' },
  { id: 145, nameJA: 'はとむね', nameEN: 'Big Pecks' },
  { id: 146, nameJA: 'すなかき', nameEN: 'Sand Rush' },
  { id: 147, nameJA: 'ミラクルスキン', nameEN: 'Wonder Skin' },
  { id: 148, nameJA: 'アナライズ', nameEN: 'Analytic' },
  { id: 149, nameJA: 'イリュージョン', nameEN: 'Illusion' },
  { id: 150, nameJA: 'かわりもの', nameEN: 'Imposter' },
  { id: 151, nameJA: 'すりぬけ', nameEN: 'Infiltrator' },
  { id: 152, nameJA: 'ミイラ', nameEN: 'Mummy' },
  { id: 153, nameJA: 'じしんかじょう', nameEN: 'Moxie' },
  { id: 154, nameJA: 'せいぎのこころ', nameEN: 'Justified' },
  { id: 155, nameJA: 'びびり', nameEN: 'Rattled' },
  { id: 156, nameJA: 'マジックミラー', nameEN: 'Magic Bounce' },
  { id: 157, nameJA: 'そうしょく', nameEN: 'Sap Sipper' },
  { id: 158, nameJA: 'いたずらごころ', nameEN: 'Prankster' },
  { id: 159, nameJA: 'すなのちから', nameEN: 'Sand Force' },
  { id: 160, nameJA: 'てつのトゲ', nameEN: 'Iron Barbs' },
  { id: 161, nameJA: 'ダルマモード', nameEN: 'Zen Mode' },
  { id: 162, nameJA: 'しょうりのほし', nameEN: 'Victory Star' },
  { id: 163, nameJA: 'ターボブレイズ', nameEN: 'Turboblaze' },
  { id: 164, nameJA: 'テラボルテージ', nameEN: 'Teravolt' },
  { id: 165, nameJA: 'アロマベール', nameEN: 'Aroma Veil' },
  { id: 166, nameJA: 'フラワーベール', nameEN: 'Flower Veil' },
  { id: 167, nameJA: 'ほおぶくろ', nameEN: 'Cheek Pouch' },
  { id: 168, nameJA: 'へんげんじざい', nameEN: 'Protean' },
  { id: 169, nameJA: 'ファーコート', nameEN: 'Fur Coat' },
  { id: 170, nameJA: 'マジシャン', nameEN: 'Magician' },
  { id: 171, nameJA: 'ぼうだん', nameEN: 'Bulletproof' },
  { id: 172, nameJA: 'かちき', nameEN: 'Competitive' },
  { id: 173, nameJA: 'がんじょうあご', nameEN: 'Strong Jaw' },
  { id: 174, nameJA: 'フリーズスキン', nameEN: 'Refrigerate' },
  { id: 175, nameJA: 'スイートベール', nameEN: 'Sweet Veil' },
  { id: 176, nameJA: 'バトルスイッチ', nameEN: 'Stance Change' },
  { id: 177, nameJA: 'はやてのつばさ', nameEN: 'Gale Wings' },
  { id: 178, nameJA: 'メガランチャー', nameEN: 'Mega Launcher' },
  { id: 179, nameJA: 'くさのけがわ', nameEN: 'Grass Pelt' },
  { id: 180, nameJA: 'きょうせい', nameEN: 'Symbiosis' },
  { id: 181, nameJA: 'かたいツメ', nameEN: 'Tough Claws' },
  { id: 182, nameJA: 'フェアリースキン', nameEN: 'Pixilate' },
  { id: 183, nameJA: 'ぬめぬめ', nameEN: 'Gooey' },
  { id: 184, nameJA: 'スカイスキン', nameEN: 'Aerilate' },
  { id: 185, nameJA: 'おやこあい', nameEN: 'Parental Bond' },
  { id: 186, nameJA: 'ダークオーラ', nameEN: 'Dark Aura' },
  { id: 187, nameJA: 'フェアリーオーラ', nameEN: 'Fairy Aura' },
  { id: 188, nameJA: 'オーラブレイク', nameEN: 'Aura Break' },
  { id: 189, nameJA: 'はじまりのうみ', nameEN: 'Primordial Sea' },
  { id: 190, nameJA: 'おわりのだいち', nameEN: 'Desolate Land' },
  { id: 191, nameJA: 'デルタストリーム', nameEN: 'Delta Stream' },
  { id: 192, nameJA: 'じきゅうりょく', nameEN: 'Stamina' },
  { id: 193, nameJA: 'にげごし', nameEN: 'Wimp Out' },
  { id: 194, nameJA: 'ききかいひ', nameEN: 'Emergency Exit' },
  { id: 195, nameJA: 'みずがため', nameEN: 'Water Compaction' },
  { id: 196, nameJA: 'ひとでなし', nameEN: 'Merciless' },
  { id: 197, nameJA: 'リミットシールド', nameEN: 'Shields Down' },
  { id: 198, nameJA: 'はりこみ', nameEN: 'Stakeout' },
  { id: 199, nameJA: 'すいほう', nameEN: 'Water Bubble' },
  { id: 200, nameJA: 'はがねつかい', nameEN: 'Steelworker' },
  { id: 201, nameJA: 'ぎゃくじょう', nameEN: 'Berserk' },
  { id: 202, nameJA: 'ゆきかき', nameEN: 'Slush Rush' },
  { id: 203, nameJA: 'えんかく', nameEN: 'Long Reach' },
  { id: 204, nameJA: 'うるおいボイス', nameEN: 'Liquid Voice' },
  { id: 205, nameJA: 'ヒーリングシフト', nameEN: 'Triage' },
  { id: 206, nameJA: 'エレキスキン', nameEN: 'Galvanize' },
  { id: 207, nameJA: 'サーフテール', nameEN: 'Surge Surfer' },
  { id: 208, nameJA: 'ぎょぐん', nameEN: 'Schooling' },
  { id: 209, nameJA: 'ばけのかわ', nameEN: 'Disguise' },
  { id: 210, nameJA: 'きずなへんげ', nameEN: 'Battle Bond' },
  { id: 211, nameJA: 'スワームチェンジ', nameEN: 'Power Construct' },
  { id: 212, nameJA: 'ふしょく', nameEN: 'Corrosion' },
  { id: 213, nameJA: 'ぜったいねむり', nameEN: 'Comatose' },
  { id: 214, nameJA: 'じょおうのいげん', nameEN: 'Queenly Majesty' },
  { id: 215, nameJA: 'とびだすなかみ', nameEN: 'Innards Out' },
  { id: 216, nameJA: 'おどりこ', nameEN: 'Dancer' },
  { id: 217, nameJA: 'バッテリー', nameEN: 'Battery' },
  { id: 218, nameJA: 'もふもふ', nameEN: 'Fluffy' },
  { id: 219, nameJA: 'ビビッドボディ', nameEN: 'Dazzling' },
  { id: 220, nameJA: 'ソウルハート', nameEN: 'Soul-Heart' },
  { id: 221, nameJA: 'カーリーヘアー', nameEN: 'Tangling Hair' },
  { id: 222, nameJA: 'レシーバー', nameEN: 'Receiver' },
  { id: 223, nameJA: 'かがくのちから', nameEN: 'Power of Alchemy' },
  { id: 224, nameJA: 'ビーストブースト', nameEN: 'Beast Boost' },
  { id: 225, nameJA: 'ＡＲシステム', nameEN: 'RKS System' },
  { id: 226, nameJA: 'エレキメイカー', nameEN: 'Electric Surge' },
  { id: 227, nameJA: 'サイコメイカー', nameEN: 'Psychic Surge' },
  { id: 228, nameJA: 'ミストメイカー', nameEN: 'Misty Surge' },
  { id: 229, nameJA: 'グラスメイカー', nameEN: 'Grassy Surge' },
  { id: 230, nameJA: 'メタルプロテクト', nameEN: 'Full Metal Body' },
  { id: 231, nameJA: 'ファントムガード', nameEN: 'Shadow Shield' },
  { id: 232, nameJA: 'プリズムアーマー', nameEN: 'Prism Armor' },
  { id: 233, nameJA: 'ブレインフォース', nameEN: 'Neuroforce' },
  { id: 234, nameJA: 'ふとうのけん', nameEN: 'Intrepid Sword' },
  { id: 235, nameJA: 'ふくつのたて', nameEN: 'Dauntless Shield' },
  { id: 236, nameJA: 'リベロ', nameEN: 'Libero' },
  { id: 237, nameJA: 'たまひろい', nameEN: 'Ball Fetch' },
  { id: 238, nameJA: 'わたげ', nameEN: 'Cotton Down' },
  { id: 239, nameJA: 'スクリューおびれ', nameEN: 'Propeller Tail' },
  { id: 240, nameJA: 'ミラーアーマー', nameEN: 'Mirror Armor' },
  { id: 241, nameJA: 'うのミサイル', nameEN: 'Gulp Missile' },
  { id: 242, nameJA: 'すじがねいり', nameEN: 'Stalwart' },
  { id: 243, nameJA: 'じょうききかん', nameEN: 'Steam Engine' },
  { id: 244, nameJA: 'パンクロック', nameEN: 'Punk Rock' },
  { id: 245, nameJA: 'すなはき', nameEN: 'Sand Spit' },
  { id: 246, nameJA: 'こおりのりんぷん', nameEN: 'Ice Scales' },
  { id: 247, nameJA: 'じゅくせい', nameEN: 'Ripen' },
  { id: 248, nameJA: 'アイスフェイス', nameEN: 'Ice Face' },
  { id: 249, nameJA: 'パワースポット', nameEN: 'Power Spot' },
  { id: 250, nameJA: 'ぎたい', nameEN: 'Mimicry' },
  { id: 251, nameJA: 'バリアフリー', nameEN: 'Screen Cleaner' },
  { id: 252, nameJA: 'はがねのせいしん', nameEN: 'Steely Spirit' },
  { id: 253, nameJA: 'ほろびのボディ', nameEN: 'Perish Body' },
  { id: 254, nameJA: 'さまようたましい', nameEN: 'Wandering Spirit' },
  { id: 255, nameJA: 'ごりむちゅう', nameEN: 'Gorilla Tactics' },
  { id: 256, nameJA: 'かがくへんかガス', nameEN: 'Neutralizing Gas' },
  { id: 257, nameJA: 'パステルベール', nameEN: 'Pastel Veil' },
  { id: 258, nameJA: 'はらぺこスイッチ', nameEN: 'Hunger Switch' },
  { id: 259, nameJA: 'クイックドロウ', nameEN: 'Quick Draw' },
  { id: 260, nameJA: 'ふかしのこぶし', nameEN: 'Unseen Fist' },
  { id: 261, nameJA: 'きみょうなくすり', nameEN: 'Curious Medicine' },
  { id: 262, nameJA: 'トランジスタ', nameEN: 'Transistor' },
  { id: 263, nameJA: 'りゅうのあぎと', nameEN: 'Dragons Maw' }, // 正しくは Dragon’s Maw
  { id: 264, nameJA: 'しろのいななき', nameEN: 'Chilling Neigh' },
  { id: 265, nameJA: 'くろのいななき', nameEN: 'Grim Neigh' },
  { id: 266, nameJA: 'じんばいったい', nameEN: 'As One' },
  { id: 267, nameJA: 'じんばいったい', nameEN: 'As One' },
  { id: 268, nameJA: 'とれないにおい', nameEN: 'Lingering Aroma' },
  { id: 269, nameJA: 'こぼれダネ', nameEN: 'Seed Sower' },
  { id: 270, nameJA: 'ねつこうかん', nameEN: 'Thermal Exchange' },
  { id: 271, nameJA: 'いかりのこうら', nameEN: 'Anger Shell' },
  { id: 272, nameJA: 'きよめのしお', nameEN: 'Purifying Salt' },
  { id: 273, nameJA: 'こんがりボディ', nameEN: 'Well-Baked Body' },
  { id: 274, nameJA: 'かぜのり', nameEN: 'Wind Rider' },
  { id: 275, nameJA: 'ばんけん', nameEN: 'Guard Dog' },
  { id: 276, nameJA: 'いわはこび', nameEN: 'Rocky Payload' },
  { id: 277, nameJA: 'ふうりょくでんき', nameEN: 'Wind Power' },
  { id: 278, nameJA: 'マイティチェンジ', nameEN: 'Zero to Hero' },
  { id: 279, nameJA: 'しれいとう', nameEN: 'Commander' },
  { id: 280, nameJA: 'でんきにかえる', nameEN: 'Electromorphosis' },
  { id: 281, nameJA: 'こだいかっせい', nameEN: 'Protosynthesis' },
  { id: 282, nameJA: 'クォークチャージ', nameEN: 'Quark Drive' },
  { id: 283, nameJA: 'おうごんのからだ', nameEN: 'Good as Gold' },
  { id: 284, nameJA: 'わざわいのうつわ', nameEN: 'Vessel of Ruin' },
  { id: 285, nameJA: 'わざわいのつるぎ', nameEN: 'Sword of Ruin' },
  { id: 286, nameJA: 'わざわいのおふだ', nameEN: 'Tablets of Ruin' },
  { id: 287, nameJA: 'わざわいのたま', nameEN: 'Beads of Ruin' },
  { id: 288, nameJA: 'ひひいろのこどう', nameEN: 'Orichalcum Pulse' },
  { id: 289, nameJA: 'ハドロンエンジン', nameEN: 'Hadron Engine' },
  { id: 290, nameJA: 'びんじょう', nameEN: 'Opportunist' },
  { id: 291, nameJA: 'はんすう', nameEN: 'Cud Chew' },
  { id: 292, nameJA: 'きれあじ', nameEN: 'Sharpness' },
  { id: 293, nameJA: 'そうだいしょう', nameEN: 'Supreme Overlord' },
  { id: 294, nameJA: 'きょうえん', nameEN: 'Costar' },
  { id: 295, nameJA: 'どくげしょう', nameEN: 'Toxic Debris' },
  { id: 296, nameJA: 'テイルアーマー', nameEN: 'Armor Tail' },
  { id: 297, nameJA: 'どしょく', nameEN: 'Earth Eater' },
  { id: 298, nameJA: 'きんしのちから', nameEN: 'Mycelium Might' },
]
