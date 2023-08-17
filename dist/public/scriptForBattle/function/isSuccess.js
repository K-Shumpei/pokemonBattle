"use strict";
function isSuccess(pokemon) {
    // フリーフォールで行動順を飛ばされる
    skipBySkyDrop();
    // 自身のおんねん/いかり状態の解除
    liftingMyStatus();
    // 行動の失敗
    if (isActionFailure(pokemon) === true)
        return false;
    // ねごと/いびき使用時「ぐうぐう 眠っている」メッセージ
    sleepyMessage(pokemon);
    // 自分のこおりを回復するわざにより自身のこおり状態が治る
    meltMeByMove(pokemon);
    // 特性バトルスイッチによるフォルムチェンジ
    stanceChange(pokemon);
    // 「<ポケモン>の <技>!」のメッセージ。PPが減少することが確約される
    moveDeclareMessage(pokemon);
    // 技のタイプが変わる。
    changeMoveType(pokemon);
    // 技の対象が決まる。若い番号の対象が優先される。
    decideTarget(pokemon);
    // PPが適切な量引かれる
    deductPowerPoint(pokemon);
    // ほのおタイプではないことによるもえつきるの失敗
    if (burnUpFailure(pokemon) === true)
        return false;
    // おおあめ/おおひでりによるほのお/みず技の失敗
    if (failureByWeather(pokemon) === true)
        return false;
    // ふんじんによるほのお技の失敗とダメージ
    if (failureByPowder(pokemon) === true)
        return false;
    // ミクルのみによる命中補正効果が消費される
    hitCorrConsumance(pokemon);
    // 技の仕様による失敗
    if (failureByMoveSpec(pokemon) === true)
        return false;
    // マックスレイドバトルでの失敗
    // 特性による失敗
    if (failureByAbility(pokemon) === true)
        return false;
    // 中断されても効果が発動する技
    if (effectAlwaysActivate(pokemon) === true)
        return false;
    // へんげんじざい/リベロの発動
    abilityChangeType(pokemon);
    // 溜め技の溜めターンでの動作
    preliminaryAction(pokemon);
    // マグニチュードの大きさ(威力)が決定
    dicideMagnitudePower(pokemon);
    // 待機中のよこどりで技が盗まれる。技を奪ったポケモンは3-9~11の行程を繰り返す
    // だいばくはつ/じばく/ミストバースト使用によるHP消費が確約される
    // 対象のポケモンが全員すでにひんしになっていて場にいないことによる失敗
    // ビックリヘッド/てっていこうせん使用によるHP消費が確約される
    // 姿を隠していることによる無効化
    if (disableByConcealment(pokemon) === true)
        return false;
    // サイコフィールドによる無効化
    if (disableByPsychofield(pokemon) === true)
        return false;
    // ファストガード/ワイドガード/トリックガードによる無効化
    if (disableByOtherProtect(pokemon) === true)
        return false;
    // まもる/キングシールド/ブロッキング/ニードルガード/トーチカによる無効化
    if (disableByProtect(pokemon) === true)
        return false;
    // たたみがえしによる無効化
    if (disableByMatBlock(pokemon) === true)
        return false;
    // ダイウォールによる無効化
    if (disableByMaxGuard(pokemon) === true)
        return false;
    // テレキネシスの、対象がディグダ/ダグトリオ/スナバァ/シロデスナ/メガゲンガー/うちおとす状態/ねをはる状態であることによる失敗
    if (failureByTelekinesis(pokemon) === true)
        return false;
    // 特性による無効化(その1)
    if (disableByAbility1st(pokemon) === true)
        return false;
    // 相性による無効化
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        if (isItem(target, 'ねらいのまと') === true)
            continue;
        if (pokemon.selectedMove.category === '変化' && pokemon.selectedMove.name === 'でんじは')
            continue;
        damage.effective = getCompatibility(pokemon, target);
        if (damage.effective === 0) {
            target.status.declareInvalid(damage);
        }
    }
    if (isInvalid(pokemon.damage) === true) {
        return false;
    }
    // ふゆうによるじめん技の無効化
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        if (isAbility(target, 'ふゆう') === false)
            continue;
        if (pokemon.selectedMove.type === 'ground') {
            target.status.declareAbility();
            target.status.declareInvalid(damage);
        }
    }
    if (isInvalid(pokemon.damage) === true) {
        return false;
    }
    // でんじふゆう/テレキネシス/ふうせんによるじめん技の無効化
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        if (pokemon.selectedMove.type !== 'ground')
            continue;
        if (target.stateChange.magnetRise.isTrue === true) {
            target.status.declareInvalid(damage);
            continue;
        }
        if (target.stateChange.telekinesis.isTrue === true) {
            target.status.declareInvalid(damage);
            continue;
        }
        if (isItem(target, 'ふうせん') === true) {
            target.status.declareInvalid(damage);
            continue;
        }
    }
    if (isInvalid(pokemon.damage) === true) {
        return false;
    }
    // ぼうじんゴーグルによる粉技の無効化
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        if (pokemon.selectedMove.flag.powder === false)
            continue;
        if (isItem(target, 'ぼうじんゴーグル') === true) {
            target.status.declareInvalid(damage);
        }
    }
    if (isInvalid(pokemon.damage) === true) {
        return false;
    }
    // 特性による無効化(その2)
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        // ぼうだん: 弾の技
        if (isAbility(target, 'ぼうだん') === true) {
            if (pokemon.selectedMove.flag.ballistics === true) {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        // ねんちゃく: トリック/すりかえ/ふしょくガス
        if (isAbility(target, 'ぼうだん') === true) {
            if (pokemon.selectedMove.name === 'トリック' || pokemon.selectedMove.name === 'すりかえ' || pokemon.selectedMove.name === 'ふしょくガス') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
    }
    if (isInvalid(pokemon.damage) === true) {
        return false;
    }
    // タイプによる技の無効化(その1)
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        // くさタイプ: 粉技の無効化
        if (getPokemonType(target).includes('grass')) {
            if (pokemon.selectedMove.flag.powder === true) {
                target.status.declareInvalid(damage);
            }
        }
        // ゴーストタイプ: にげられない状態にする変化技/たこがための無効化
        // あくタイプ: いたずらごころの効果が発動した技の無効化
        // こおりタイプ: ぜったいれいどの無効化
        if (getPokemonType(target).includes('ice')) {
            if (pokemon.selectedMove.name === 'ぜったいれいど') {
                target.status.declareInvalid(damage);
            }
        }
        // ひこうタイプ: フリーフォールの無効化
        if (getPokemonType(target).includes('flying')) {
            if (pokemon.selectedMove.name === 'フリーフォール') {
                target.status.declareInvalid(damage);
            }
        }
    }
    if (isInvalid(pokemon.damage) === true) {
        return false;
    }
    // 技の仕様による無効化(その1)
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        // メロメロ: 対象と性別が同じ/対象が性別不明
        if (pokemon.selectedMove.name === 'メロメロ') {
            if (pokemon.status.gender === target.status.gender) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.gender === '-') {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // いちゃもん: 対象がダイマックスしている
        // ベノムトラップ: 対象がどく/もうどく状態でない
        if (pokemon.selectedMove.name === 'ベノムトラップ') {
            if (isStatusAilment(target, 'どく') === false) {
                target.status.declareInvalid(damage);
            }
        }
    }
    if (isInvalid(pokemon.damage) === true) {
        return false;
    }
    // 技の仕様による無効化(その2
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        // 重複による無効化
        // あくび: 対象がすでにねむけ状態/状態異常である
        if (pokemon.selectedMove.name === 'あくび') {
            if (target.stateChange.yawn.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.statusAilment.name !== null) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // いちゃもん: 対象がすでにいちゃもん状態である
        if (pokemon.selectedMove.name === 'いちゃもん') {
            if (target.stateChange.torment.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // さしおさえ: 対象がすでにさしおさえ状態である
        if (pokemon.selectedMove.name === 'さしおさえ') {
            if (target.stateChange.embargo.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // テレキネシス: 対象がすでにテレキネシス状態である
        if (pokemon.selectedMove.name === 'テレキネシス') {
            if (target.stateChange.telekinesis.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // なやみのタネ: 対象の特性がふみん/なまけである
        if (pokemon.selectedMove.name === 'なやみのタネ') {
            if (isAbility(target, 'ふみん') === true) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (isAbility(target, 'なまけ') === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // ねをはる: 自身がすでにねをはる状態である
        if (pokemon.selectedMove.name === 'ねをはる') {
            if (pokemon.stateChange.ingrain.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // ほろびのうた: 対象がすでにほろびのうた状態である
        if (pokemon.selectedMove.name === 'ほろびのうた') {
            if (target.stateChange.perishSong.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // みやぶる/かぎわける/ミラクルアイ: 対象がすでにみやぶられている/ミラクルアイ状態である
        if (pokemon.selectedMove.name === 'みやぶる' || pokemon.selectedMove.name === 'かぎわける' || pokemon.selectedMove.name === 'ミラクルアイ') {
            if (target.stateChange.foresight.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.stateChange.miracleEye.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // メロメロ: 対象がすでにメロメロ状態である
        if (pokemon.selectedMove.name === 'メロメロ') {
            if (target.stateChange.attract.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // やどりぎのタネ: 対象がすでにやどりぎのタネ状態である
        if (pokemon.selectedMove.name === 'やどりぎのタネ') {
            if (target.stateChange.leechSeed.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // 状態異常にする変化技: 対象がすでに同じ状態異常になっている
        // 状態異常にする変化技: 対象が別の状態異常になっている
        // ランク補正に関する無効化
        // ランク補正を上げる変化技: ランクがすでに最大である
        // ランク補正を下げる変化技: ランクがすでに最低である
        // コーチング: シングルバトルである/対象となる味方がいない
        if (pokemon.selectedMove.name === 'コーチング') {
            if (fieldStatus.battleStyle === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // ソウルビート/はいすいのじん: 全能力が最大まで上がっている
        if (pokemon.selectedMove.name === 'ソウルビート' || pokemon.selectedMove.name === 'はいすいのじん') {
            if (pokemon.rank.attack === 6 &&
                pokemon.rank.defense === 6 &&
                pokemon.rank.specialAttack === 6 &&
                pokemon.rank.specialDefense === 6 &&
                pokemon.rank.speed === 6) {
                target.status.declareInvalid(damage);
            }
        }
        // ほおばる: ぼうぎょランクがすでに最大である
        if (pokemon.selectedMove.name === 'ほおばる') {
            if (pokemon.rank.defense === 6) {
                target.status.declareInvalid(damage);
            }
        }
        // その他
        // がむしゃら: 対象のHPが使用者以下
        if (pokemon.selectedMove.name === 'がむしゃら') {
            if (pokemon.status.remainingHP >= target.status.remainingHP) {
                target.status.declareInvalid(damage);
            }
        }
        // シンクロノイズ: タイプが合致していない
        if (pokemon.selectedMove.name === 'シンクロノイズ') {
            const atkType = getPokemonType(pokemon);
            const defType = getPokemonType(target);
            const compare = atkType.concat(defType);
            const set = new Set(compare);
            if (atkType.length === 1 && atkType[0] === null) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (set.size === compare.length) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // ゆめくい/あくむ: 対象がねむり状態でない
        if (pokemon.selectedMove.name === 'ゆめくい' || pokemon.selectedMove.name === 'あくむ') {
            if (isStatusAilment(target, 'ねむり') === false) {
                target.status.declareInvalid(damage);
            }
        }
        // 一撃必殺技: 対象が使用者よりレベルが高い/対象がダイマックスしている
        if (oneShotMoveList.includes(pokemon.selectedMove.name)) {
            if (pokemon.status.level < target.status.level) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
    }
    if (isInvalid(pokemon.damage) === true) {
        return false;
    }
    // みがわり状態によるランク補正を下げる技/デコレーションの無効化
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        if (isSubstitute(pokemon, target) === true) {
        }
    }
    // 命中判定による技の無効化
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        // 必中技は命中判定を行わない
        if (pokemon.selectedMove.accuracy === null)
            continue;
        if (isWeather(target, 'あめ') === true) {
            if (pokemon.selectedMove.name === 'かみなり')
                continue;
            if (pokemon.selectedMove.name === 'ぼうふう')
                continue;
        }
        if (isWeather(target, 'あられ') === true) {
            if (pokemon.selectedMove.name === 'あられ')
                continue;
        }
        if (stompMoveList.includes(pokemon.selectedMove.name)) {
            if (target.stateChange.minimize.isTrue === true)
                continue;
        }
        if (target.stateChange.telekinesis.isTrue === true) {
            if (pokemon.selectedMove.category === 'ohko')
                continue;
        }
        if (pokemon.stateChange.lockOn.isTrue === true)
            continue;
        if (isAbility(pokemon, 'ノーガード') === true)
            continue;
        if (isAbility(target, 'ノーガード') === true)
            continue;
        if (pokemon.selectedMove.name === 'どくどく') {
            if (getPokemonType(pokemon).includes('poison'))
                continue;
        }
        // A = 技の命中率 × 命中補正値M × ランク補正 × ミクルのみ - なかよし度効果
        // 乱数0~99がA未満なら命中
        const random = getRandom();
        let accuracy = pokemon.selectedMove.accuracy;
        let corrM = 4096;
        let corrRank = 1;
        let diffRank = 0;
        let atkRank = pokemon.rank.accuracy;
        let defRank = target.rank.evasion;
        // 技の命中率
        if (isWeather(pokemon, 'にほんばれ') === true) {
            if (pokemon.selectedMove.name === 'かみなり')
                accuracy = 50;
            if (pokemon.selectedMove.name === 'ぼうふう')
                accuracy = 50;
        }
        if (isAbility(target, 'ミラクルスキン') === true) {
            if (pokemon.selectedMove.category === '変化') {
                accuracy = Math.min(accuracy, 50);
            }
        }
        if (pokemon.selectedMove.category === 'ohko') {
            accuracy = accuracy + pokemon.status.level - target.status.level;
        }
        if (pokemon.selectedMove.name === 'ぜったいれいど' && getPokemonType(pokemon).includes('ice') === false) {
            accuracy = 20 + pokemon.status.level - target.status.level;
        }
        // 一撃必殺技の場合、命中判定
        if (pokemon.selectedMove.category === 'ohko') {
            if (random >= accuracy) {
                target.status.declareNotHit(damage);
                continue;
            }
        }
        // 命中補正値M
        if (fieldStatus.whole.gravity.isTrue === true) {
            corrM = Math.round(corrM * 6840 / 4096);
        }
        for (const order of getSpeedOrder()) {
            if (order.trainer === target.trainer && order.battleNumber === target.order.battle) {
                if (isAbility(target, 'ちどりあし') && target.stateChange.confuse.isTrue) {
                    corrM = Math.round(corrM * 2048 / 4096);
                }
                if (isAbility(target, 'すながくれ') && isWeather(target, 'すなあらし')) {
                    corrM = Math.round(corrM * 3277 / 4096);
                }
                if (isAbility(target, 'ゆきがくれ') && isWeather(target, 'あられ')) {
                    corrM = Math.round(corrM * 3277 / 4096);
                }
            }
            if (order.trainer === pokemon.trainer && order.battleNumber === pokemon.order.battle) {
                if (isAbility(pokemon, 'はりきり') && pokemon.selectedMove.category === '物理') {
                    corrM = Math.round(corrM * 3277 / 4096);
                }
                if (isAbility(pokemon, 'ふくがん')) {
                    corrM = Math.round(corrM * 5325 / 4096);
                }
            }
            if (order.trainer === pokemon.trainer) {
                const one = getPokemonByBattle(order.trainer, order.battleNumber);
                if (one !== false && isAbility(one, 'しょうりのほし')) {
                    corrM = Math.round(corrM * 4506 / 4096);
                }
            }
        }
        for (const order of getSpeedOrder()) {
            if (order.trainer === target.trainer && order.battleNumber === target.order.battle) {
                if (isItem(target, 'ひかりのこな')) {
                    corrM = Math.round(corrM * 3686 / 4096);
                }
                if (isItem(target, 'のんきのおこう')) {
                    corrM = Math.round(corrM * 3686 / 4096);
                }
            }
            if (order.trainer === pokemon.trainer && order.battleNumber === pokemon.order.battle) {
                if (isItem(pokemon, 'こうかくレンズ')) {
                    corrM = Math.round(corrM * 4505 / 4096);
                }
                if (isItem(pokemon, 'フォーカスレンズ')) {
                    ;
                }
            }
        }
        accuracy = fiveRoundEntry(accuracy * corrM / 4096);
        // ランク補正
        if (target.stateChange.foresight.isTrue || target.stateChange.miracleEye.isTrue) {
            defRank = Math.max(defRank, 0);
        }
        if (isAbility(pokemon, 'てんねん') || isAbility(pokemon, 'するどいめ')) {
            defRank = 0;
        }
        if (isAbility(target, 'てんねん')) {
            atkRank = 0;
        }
        diffRank = atkRank - defRank;
        if (diffRank < -6)
            diffRank = -6;
        if (diffRank > 6)
            diffRank = 6;
        if (diffRank < 0) {
            corrRank = 3 / (3 + Math.abs(diffRank));
        }
        if (diffRank > 0) {
            corrRank = (3 + Math.abs(diffRank)) / 3;
        }
        accuracy = Math.floor(accuracy * corrRank);
        accuracy = Math.min(accuracy, 100);
        // ミクルのみ
        if (pokemon.stateChange.micleBerry.isTrue === true) {
            accuracy = fiveRoundEntry(accuracy * 4915 / 4096);
            accuracy = Math.min(accuracy, 100);
        }
        // 命中判定
        if (random >= accuracy) {
            target.status.declareNotHit(damage);
        }
    }
    if (isInvalid(pokemon.damage) === true) {
        return false;
    }
    // 技の仕様による無効化(その3)
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        // 特性に関する無効化
        if (pokemon.selectedMove.name === 'なかまづくり') {
            if (pokemon.status.ability === target.status.ability) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (pokemon.status.abilityInfo().copy === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.abilityInfo().copied === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'いえき') {
            if (target.stateChange.noAbility.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.abilityInfo().noAbility === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'なりきり') {
            if (pokemon.status.ability === target.status.ability) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (pokemon.status.abilityInfo().noAbility === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.abilityInfo().copied === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'シンプルビーム') {
            if (target.status.ability === 'たんじゅん') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.abilityInfo().overwrite === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'なやみのタネ') {
            if (target.status.abilityInfo().overwrite === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'スキルスワップ') {
            if (pokemon.status.abilityInfo().exchange === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.abilityInfo().exchange === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // 持ち物による無効化
        if (pokemon.selectedMove.name === 'トリック' || pokemon.selectedMove.name === 'すりかえ') {
            if (pokemon.status.item === null && target.status.item === null) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'ふしょくガス') {
            if (target.status.name === 'ギラティナ(オリジン)' && target.status.item === 'はっきんだま') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.name === 'ギラティナ(アナザー)' && target.status.item === 'はっきんだま') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.name === 'ゲノセクト') {
                for (const drive of driveTable) {
                    if (drive.name === target.status.item) {
                        target.status.declareInvalid(damage);
                        continue;
                    }
                }
            }
            if (target.status.name === 'シルヴァディ') {
                for (const memory of memoryTable) {
                    if (memory.name === target.status.item) {
                        target.status.declareInvalid(damage);
                        continue;
                    }
                }
            }
            if (target.status.name === 'ザシアン' && target.status.item === 'くちたけん') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.name === 'ザシアン(王)' && target.status.item === 'くちたけん') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.name === 'ザマゼンタ' && target.status.item === 'くちたたて') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.name === 'ザマゼンタ(王)' && target.status.item === 'くちたたて') {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'リサイクル') {
            if (pokemon.status.item !== null) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'ギフトパス') {
            if (pokemon.status.item === null) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.item !== null) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // HPが満タンだったことによる無効化
        if (pokemon.selectedMove.name === 'いやしのはどう' || pokemon.selectedMove.name === 'フラワーヒール') {
            if (target.status.remainingHP === target.actualValue.hitPoint) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'いのちのしずく') {
            if (target.status.remainingHP === target.actualValue.hitPoint) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'ジャングルヒール') {
            if (target.status.remainingHP === target.actualValue.hitPoint && target.status.statusAilment === null) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'かふんだんご') {
            if (target.status.remainingHP === target.actualValue.hitPoint && pokemon.trainer === target.trainer) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'あさのひざし'
            || pokemon.selectedMove.name === 'かいふくしれい'
            || pokemon.selectedMove.name === 'こうごうせい'
            || pokemon.selectedMove.name === 'じこさいせい'
            || pokemon.selectedMove.name === 'すなあつめ'
            || pokemon.selectedMove.name === 'タマゴうみ'
            || pokemon.selectedMove.name === 'つきのひかり'
            || pokemon.selectedMove.name === 'なまける'
            || pokemon.selectedMove.name === 'はねやすめ'
            || pokemon.selectedMove.name === 'ミルクのみ') {
            if (pokemon.status.remainingHP === pokemon.actualValue.hitPoint) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // ステータスに関する無効化
        if (pokemon.selectedMove.name === 'はらだいこ') {
            if (pokemon.status.remainingHP <= pokemon.actualValue.hitPoint / 2) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (pokemon.rank.attack === 6) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'フラワーガード' || pokemon.selectedMove.name === 'たがやす') {
            if (getPokemonType(target).includes('grass') === false) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'じばそうさ' || pokemon.selectedMove.name === 'アシストギア') {
            if (target.status.ability !== 'プラス' && target.status.ability !== 'マイナス') {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'ちからをすいとる') {
            if (target.rank.attack === -6) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'いばる') {
            if (target.rank.attack === 6 && target.stateChange.confuse.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'おだてる') {
            if (target.rank.specialAttack === 6 && target.stateChange.confuse.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'ひっくりかえす') {
            if (target.rank.attack === 0
                && target.rank.defense === 0
                && target.rank.specialAttack === 0
                && target.rank.specialDefense === 0
                && target.rank.speed === 6
                && target.rank.evasion === 0
                && target.rank.accuracy === 0) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'タールショット') {
            if (target.rank.speed === -6 && target.stateChange.tarShot.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // タイプによる無効化
        if (pokemon.selectedMove.name === 'テクスチャー') {
            if (getPokemonType(pokemon).includes(pokemon.selectedMove.type) === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'ほごしょく') {
            if (fieldStatus.terrain.name === 'エレキフィールド' && getPokemonType(pokemon).includes('grass')) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (fieldStatus.terrain.name === 'グラスフィールド' && getPokemonType(pokemon).includes('grass')) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (fieldStatus.terrain.name === 'サイコフィールド' && getPokemonType(pokemon).includes('grass')) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (fieldStatus.terrain.name === 'ミストフィールド' && getPokemonType(pokemon).includes('grass')) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (fieldStatus.terrain.name === null && getPokemonType(pokemon).includes('normal')) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'みずびたし') {
            const type = getPokemonType(target);
            if (type.length === 1 && type[0] === 'water') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.name === 'アルセウス') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.name === 'シルヴァディ') {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'まほうのこな') {
            const type = getPokemonType(target);
            if (type.length === 1 && type[0] === 'psychic') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.name === 'アルセウス') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.name === 'シルヴァディ') {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'ハロウィン') {
            if (getPokemonType(target).includes('ghost') === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'もりののろい') {
            if (getPokemonType(target).includes('grass') === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
    }
    // 重複による無効化
    // 全体の場
    if (pokemon.selectedMove.name === 'にほんばれ') {
        if (fieldStatus.weather.name === 'にほんばれ') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'あまごい') {
        if (fieldStatus.weather.name === 'あめ') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'すなあらし') {
        if (fieldStatus.weather.name === 'すなあらし') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'あられ') {
        if (fieldStatus.weather.name === 'あられ') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'ゆきげしき') {
        if (fieldStatus.weather.name === 'ゆき') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'エレキフィールド') {
        if (fieldStatus.terrain.name === 'エレキフィールド') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'グラスフィールド') {
        if (fieldStatus.terrain.name === 'グラスフィールド') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'サイコフィールド') {
        if (fieldStatus.terrain.name === 'サイコフィールド') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'ミストフィールド') {
        if (fieldStatus.terrain.name === 'ミストフィールド') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'じゅうりょく') {
        if (fieldStatus.whole.gravity.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'どろあそび') {
        if (fieldStatus.whole.mudSport.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'フェアリーロック') {
        if (fieldStatus.whole.fairyLock.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'プラズマシャワー') {
        if (fieldStatus.whole.ionDeluge.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'みずあそび') {
        if (fieldStatus.whole.waterSport.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    // 片側の場
    if (pokemon.selectedMove.name === 'オーロラベール') {
        if (fieldStatus.getSide(pokemon.trainer).auroraVeil.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'ひかりのかべ') {
        if (fieldStatus.getSide(pokemon.trainer).lightScreen.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'リフレクター') {
        if (fieldStatus.getSide(pokemon.trainer).reflect.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'たたみがえし') {
        if (fieldStatus.getSide(pokemon.trainer).matBlock.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'トリックガード') {
        if (fieldStatus.getSide(pokemon.trainer).craftyShield.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'ファストガード') {
        if (fieldStatus.getSide(pokemon.trainer).quickGuard.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'ワイドガード') {
        if (fieldStatus.getSide(pokemon.trainer).wideGuard.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'おいかぜ') {
        if (fieldStatus.getSide(pokemon.trainer).tailwind.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'おまじない') {
        if (fieldStatus.getSide(pokemon.trainer).luckyChant.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'しろいきり') {
        if (fieldStatus.getSide(pokemon.trainer).mist.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'しんぴのまもり') {
        if (fieldStatus.getSide(pokemon.trainer).safeguard.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'ステルスロック') {
        if (fieldStatus.getSide(getOpponentTrainer(pokemon.trainer)).stealthRock.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'どくびし') {
        if (fieldStatus.getSide(getOpponentTrainer(pokemon.trainer)).toxicSpikes.count === 2) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'ねばねばネット') {
        if (fieldStatus.getSide(getOpponentTrainer(pokemon.trainer)).stickyWeb.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.selectedMove.name === 'まきびし') {
        if (fieldStatus.getSide(getOpponentTrainer(pokemon.trainer)).spikes.count === 3) {
            pokemon.damage[0].failure();
        }
    }
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        if (pokemon.selectedMove.name === 'アクアリング') {
            if (pokemon.stateChange.aquaRing.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'きあいだめ') {
            if (pokemon.stateChange.focusEnergy.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'ちょうはつ') {
            if (target.stateChange.taunt.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'でんじふゆう') {
            if (pokemon.stateChange.magnetRise.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'のろい' && getPokemonType(pokemon).includes('ghost')) {
            if (target.stateChange.curse.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'ロックオン' || pokemon.selectedMove.name === 'こころのめ') {
            if (pokemon.stateChange.lockOn.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'みがわり') {
            if (pokemon.stateChange.substitute.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (pokemon.status.remainingHP <= pokemon.actualValue.hitPoint / 4) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'へんしん') {
            if (pokemon.stateChange.transform.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.stateChange.transform.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // 行動に関する無効化
        if (pokemon.selectedMove.name === 'アンコール') {
            if (target.stateChange.dynamax.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.stateChange.encore.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'かなしばり') {
            if (target.stateChange.disable.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // 状態に関する無効化
        if (pokemon.selectedMove.name === 'にほんばれ'
            || pokemon.selectedMove.name === 'あまごい'
            || pokemon.selectedMove.name === 'すなあらし'
            || pokemon.selectedMove.name === 'あられ'
            || pokemon.selectedMove.name === 'ゆきげしき') {
            if (fieldStatus.weather.name === 'おおひでり') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (fieldStatus.weather.name === 'おおあめ') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (fieldStatus.weather.name === 'らんきりゅう') {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'サイコシフト') {
            if (pokemon.status.statusAilment.name === null) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.statusAilment !== null) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'じょうか') {
            if (target.status.statusAilment === null) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.selectedMove.name === 'リフレッシュ') {
            if (pokemon.status.statusAilment.name === null) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
    }
    return true;
}
// 技の対象が決まる。若い番号の対象が優先される。
function decideTarget(pokemon) {
    // フリーフォールによる対象
    // ちゅうもくのまと状態の敵
    // ひらいしん/よびみずのポケモン
    // カウンター/ミラーコート/メタルバーストの反射対象
    // ランダム1体が対象の技の対象
    if (pokemon.selectedMove.target === 'ランダム1体') {
        // シングルバトルの時
        if (fieldStatus.battleStyle === 1) {
            const target = new Damage;
            target.trainer = getOpponentTrainer(pokemon.trainer);
            target.battle = 0;
            pokemon.damage.push(target);
        }
    }
    if (pokemon.damage.length !== 0)
        return;
    // 技を選択した対象
    if (fieldStatus.battleStyle === 1) {
        switch (pokemon.selectedMove.target) {
            case '全体の場':
            case '味方の場':
            case '相手の場':
                const damage1 = new Damage;
                pokemon.damage.push(damage1);
                break;
            case '自分':
            case '味方1体':
            case '自分か味方':
            case '味方全体':
                const damage2 = setTargetInfo(pokemon.trainer, 0);
                pokemon.damage.push(damage2);
                break;
            case '1体選択':
            case 'ランダム1体':
            case '相手全体':
            case '自分以外':
                const damage3 = setTargetInfo(getOpponentTrainer(pokemon.trainer), 0);
                pokemon.damage.push(damage3);
                break;
            case '全体':
                const damage4 = setTargetInfo(pokemon.trainer, 0);
                pokemon.damage.push(damage4);
                const damage5 = setTargetInfo(getOpponentTrainer(pokemon.trainer), 0);
                pokemon.damage.push(damage5);
                break;
            case '不定':
                break;
            default:
                break;
        }
    }
    if (pokemon.damage.length >= 2) {
        pokemon.stateChange.rangeCorr.isTrue = true;
    }
}
function setTargetInfo(trainer, battle) {
    const damage = new Damage;
    damage.trainer = trainer;
    damage.battle = battle;
    const pokemon = getPokemonByBattle(trainer, battle);
    if (pokemon !== false) {
        damage.party = pokemon.order.party;
    }
    return damage;
}
// 相性計算
function getCompatibility(pokemon, target) {
    const atkType = pokemon.selectedMove.type;
    const defType = getPokemonType(target);
    let result = 1.0;
    for (const record of typeCompatibility) {
        if (record.attackType === atkType) {
            for (const type of defType) {
                if (type === null)
                    continue;
                let rate = record.rate[type];
                if (rate === 0.0 && isItem(target, 'ねらいのまと') === true) {
                    rate = 1.0;
                }
                if (pokemon.selectedMove.name === 'フリーズドライ' && type === 'water') {
                    rate = 2.0;
                }
                result = result * rate;
            }
        }
    }
    if (pokemon.selectedMove.name === 'フライングプレス') {
        for (const record of typeCompatibility) {
            if (record.attackType === 'flying') {
                for (const type of defType) {
                    if (type === null)
                        continue;
                    let rate = record.rate[type];
                    if (rate === 0.0 && isItem(target, 'ねらいのまと') === true) {
                        rate = 1.0;
                    }
                    result = result * rate;
                }
            }
        }
    }
    if (target.stateChange.tarShot.isTrue === true && atkType === 'fire') {
        result = result * 2.0;
    }
    return result;
}
// 無効化判定
function isInvalid(damage) {
    for (const info of damage) {
        if (info.success === true) {
            return false;
        }
    }
    return true;
}
// フリーフォールで行動順を飛ばされる
function skipBySkyDrop() {
}
// 自身のおんねん/いかり状態の解除
function liftingMyStatus() {
}
// 行動の失敗
function isActionFailure(pokemon) {
    cannotMove: if (pokemon.stateChange.cannotMove.isTrue === true) {
        writeLog(`${getArticle(pokemon)}は 攻撃の 反動で 動けない!`);
        pokemon.stateChange.cannotMove.reset();
        if (isAbility(pokemon, 'なまけ') === true) {
            pokemon.stateChange.truant.count += 1;
        }
        return true;
    }
    sleep: if (pokemon.status.statusAilment.name === 'ねむり') {
        const turn = (isAbility(pokemon, 'はやおき') === true) ? 2 : 1;
        pokemon.status.statusAilment.turn -= turn;
        if (pokemon.status.statusAilment.turn > 0) {
            writeLog(`${getArticle(pokemon)}は ぐうぐう 眠っている`);
            if (sleepingMoveList.includes(pokemon.selectedMove.name) === true)
                break sleep;
            return true;
        }
        else {
            cureAilment(pokemon, 'ねむり');
        }
    }
    frozen: if (pokemon.status.statusAilment.name === 'こおり') {
        if (getRandom() < 20) {
            cureAilment(pokemon, 'こおり');
        }
        else {
            if (pokemon.selectedMove.flag.defrost === true) {
                if (pokemon.selectedMove.name !== 'もえつきる')
                    break frozen;
                if (getPokemonType(pokemon).includes('fire') === true)
                    break frozen;
            }
            writeLog(`${getArticle(pokemon)}は 凍ってしまって 動けない!`);
            return true;
        }
    }
    remainingPP: if (pokemon.learnedMove[pokemon.selectedMove.slot].remainingPP === 0) {
        writeLog(`${getArticle(pokemon)}の ${pokemon.selectedMove.name}!`);
        writeLog(`しかし 技の 残りポイントが なかった!`);
        return true;
    }
    truant: if (isAbility(pokemon, 'なまけ') === true) {
        pokemon.stateChange.truant.count += 1;
        if (pokemon.stateChange.truant.count % 2 === 1)
            break truant;
        pokemon.status.declareAbility();
        writeLog(`${getArticle(pokemon)}は なまけている`);
        return true;
    }
    focusPunch: if (pokemon.selectedMove.name === 'きあいパンチ') {
        if (pokemon.stateChange.focusPunch.isTrue === false)
            break focusPunch;
        const judge = (pokemon.stateChange.focusPunch.text === '集中') ? true : false;
        pokemon.stateChange.focusPunch.reset();
        if (judge === false) {
            writeLog(`${getArticle(pokemon)}は 集中が 途切れて 技が 出せない!`);
            return true;
        }
    }
    flinch: if (pokemon.stateChange.flinch.isTrue === true) {
        writeLog(`${getArticle(pokemon)}は ひるんで 技が 出せない!`);
        steadfast: if (isAbility(pokemon, 'ふくつのこころ') === true) {
            if (getRankVariation(pokemon, 'speed', 1) === 0)
                break steadfast;
            pokemon.status.declareAbility();
            changeMyRank(pokemon, 'speed', 1);
        }
        return true;
    }
    disable: if (pokemon.stateChange.disable.isTrue === true) {
        if (pokemon.stateChange.disable.text !== pokemon.selectedMove.name)
            break disable;
        writeLog(`${getArticle(pokemon)}は かなしばりで 技が 出せない!`);
        return true;
    }
    gravity: if (fieldStatus.whole.gravity.isTrue === true) {
        if (pokemon.selectedMove.flag.gravity === false)
            break gravity;
        writeLog(`${getArticle(pokemon)}は じゅうりょくが 強くて ${pokemon.selectedMove.name}が 出せない!`);
        return true;
    }
    healBlock: if (pokemon.stateChange.healBlock.isTrue === true) {
        if (pokemon.selectedMove.flag.heal === false)
            break healBlock;
        if (pokemon.selectedMove.name === 'かふんだんご' && pokemon.damage[0].trainer !== pokemon.trainer)
            break healBlock;
        writeLog(`${getArticle(pokemon)}は かいふくふうじで 技が 出せない!`);
        return true;
    }
    throatChop: if (pokemon.stateChange.throatChop.isTrue === true) {
        if (pokemon.selectedMove.flag.sound === false)
            break throatChop;
        writeLog(`${getArticle(pokemon)}は じごくづきの効果で 技が 出せない!`);
        return true;
    }
    taunt: if (pokemon.stateChange.taunt.isTrue === true) {
        if (pokemon.selectedMove.name === 'さきどり')
            break taunt;
        if (pokemon.selectedMove.category !== '変化')
            break taunt;
        writeLog(`${getArticle(pokemon)}は ちょうはつされて 技が 出せない!`);
        return true;
    }
    imprison: for (const target of allPokemonInSide(getOpponentTrainer(pokemon.trainer))) {
        if (target.stateChange.imprison.isTrue === false)
            continue;
        for (const move of target.learnedMove) {
            if (move.name === pokemon.selectedMove.name) {
                writeLog(`${getArticle(pokemon)}は ふういんで 技が 出せない!`);
                return true;
            }
        }
    }
    confuse: if (pokemon.stateChange.confuse.isTrue === true) {
        pokemon.stateChange.confuse.count -= 1;
        if (pokemon.stateChange.confuse.count === 0) {
            writeLog(`${getArticle(pokemon)}の 混乱が 解けた!`);
            pokemon.stateChange.confuse.reset();
            break confuse;
        }
        writeLog(`${getArticle(pokemon)}は 混乱している!`);
        if (getRandom() < 1 / 3 * 100) {
            writeLog(`わけも わからず 自分を 攻撃した!`);
            const power = 40;
            const attack = getValueWithRankCorrection(pokemon.actualValue.attack, pokemon.rank.attack, false);
            const defense = getValueWithRankCorrection(pokemon.actualValue.defense, pokemon.rank.defense, false);
            // 最終ダメージ
            const damage = Math.floor(Math.floor(Math.floor(pokemon.status.level * 2 / 5 + 2) * power * attack / defense) / 50 + 2);
            // 乱数補正
            const randomCorrection = Math.floor(getRandom() * 16) + 8500;
            const finalDamage = Math.floor(damage * randomCorrection / 10000);
            // 本体にダメージを与える
            const damageType = new Damage;
            damageType.damage = processAfterCalculation(pokemon, pokemon, finalDamage, damageType);
            damageToBody(pokemon, damageType);
            // ダメージをHP1で耐える効果のメッセージなど
            enduringEffectsMessage(pokemon);
            return true;
        }
    }
    paralusis: if (pokemon.status.statusAilment.name === 'まひ') {
        if (getRandom() < 1 / 4 * 100) {
            writeLog(`${getArticle(pokemon)}は 体がしびれて 動かない!`);
            return true;
        }
    }
    attract: if (pokemon.stateChange.attract.isTrue === true) {
        const target = pokemon.stateChange.attract.target;
        const attractTarget = getPokemonByBattle(target.trainer, target.battle);
        if (attractTarget === false)
            break attract;
        writeLog(`${getArticle(pokemon)}は ${getArticle(attractTarget)}に メロメロだ!`);
        if (getRandom() < 50)
            break attract;
        writeLog(`${getArticle(pokemon)}は メロメロで 技が だせなかった!`);
        return true;
    }
    return false;
}
// ねごと/いびき使用時「ぐうぐう 眠っている」メッセージ
function sleepyMessage(pokemon) {
    if (sleepingMoveList.includes(pokemon.selectedMove.name)) {
        writeLog(`${getArticle(pokemon)}は ぐうぐう 眠っている`);
    }
}
// 自分のこおりを回復するわざにより自身のこおり状態が治る
function meltMeByMove(pokemon) {
    if (pokemon.status.statusAilment.name === 'こおり') {
        pokemon.status.statusAilment.name = null;
        pokemon.status.statusAilment.turn = 0;
        writeLog(`${getArticle(pokemon)}の ${pokemon.selectedMove.name}で こおりがとけた!`);
    }
}
// 特性バトルスイッチによるフォルムチェンジ
function stanceChange(pokemon) {
    if (pokemon.status.name === 'ギルガルド(盾)') {
        if (pokemon.selectedMove.category !== '変化') {
            pokemon.status.declareAbility();
            formChange(pokemon);
            writeLog(`ブレードフォルム チェンジ!`);
            return;
        }
    }
    if (pokemon.status.name === 'ギルガルド(剣)') {
        if (pokemon.selectedMove.name === 'キングシールド') {
            pokemon.status.declareAbility();
            formChange(pokemon);
            writeLog(`シールドフォルム チェンジ!`);
            return;
        }
    }
}
// 「<ポケモン>の <技>!」のメッセージ。PPが減少することが確約される
function moveDeclareMessage(pokemon) {
    writeLog(`${getArticle(pokemon)}の ${pokemon.selectedMove.name}!`);
}
// 技のタイプが変わる。
function changeMoveType(pokemon) {
    if (isAbility(pokemon, 'うるおいボイス') === true) {
        if (pokemon.selectedMove.flag.sound === true) {
            pokemon.selectedMove.type = 'water';
        }
    }
    galvanize: if (isAbility(pokemon, 'エレキスキン') === true) {
        if (isActivateSkinAbikity(pokemon, 'electric') === false)
            break galvanize;
        if (pokemon.selectedMove.type !== 'normal')
            break galvanize;
        activateSkin(pokemon, 'electric');
    }
    aerilate: if (isAbility(pokemon, 'スカイスキン') === true) {
        if (isActivateSkinAbikity(pokemon, 'flying') === false)
            break aerilate;
        if (pokemon.selectedMove.type !== 'normal')
            break aerilate;
        activateSkin(pokemon, 'flying');
    }
    normalize: if (isAbility(pokemon, 'ノーマルスキン') === true) {
        if (isActivateSkinAbikity(pokemon, 'normal') === false)
            break normalize;
        activateSkin(pokemon, 'normal');
    }
    pixilate: if (isAbility(pokemon, 'フェアリースキン') === true) {
        if (isActivateSkinAbikity(pokemon, 'fairy') === false)
            break pixilate;
        if (pokemon.selectedMove.type !== 'normal')
            break pixilate;
        activateSkin(pokemon, 'fairy');
    }
    refrigerate: if (isAbility(pokemon, 'フリーズスキン') === true) {
        if (isActivateSkinAbikity(pokemon, 'ice') === false)
            break refrigerate;
        if (pokemon.selectedMove.type !== 'normal')
            break refrigerate;
        activateSkin(pokemon, 'ice');
    }
    if (pokemon.selectedMove.name === 'ウェザーボール') {
        if (isWeather(pokemon, 'にほんばれ') === true)
            pokemon.selectedMove.type = 'fire';
        if (isWeather(pokemon, 'あめ') === true)
            pokemon.selectedMove.type = 'water';
        if (isWeather(pokemon, 'すなあらし') === true)
            pokemon.selectedMove.type = 'rock';
        if (isWeather(pokemon, 'あられ') === true)
            pokemon.selectedMove.type = 'ice';
    }
    if (pokemon.selectedMove.name === 'オーラぐるま') {
        if (pokemon.status.name === 'モルペコ(空腹)') {
            pokemon.selectedMove.type = 'dark';
        }
    }
    if (pokemon.selectedMove.name === 'さばきのつぶて') {
        for (const plate of plateTable) {
            if (isItem(pokemon, plate.name) === true) {
                //pokemon.selectedMove.type = plate.type;
            }
        }
    }
    if (pokemon.selectedMove.name === 'しぜんのめぐみ') {
        for (const berry of berryTable) {
            if (isItem(pokemon, berry.name) === true) {
                //pokemon.selectedMove.type = berry.naturalGift.type;
            }
        }
    }
    if (pokemon.selectedMove.name === 'だいちのはどう') {
        if (isGrounded(pokemon) === true && fieldStatus.terrain.name === 'エレキフィールド')
            pokemon.selectedMove.type = 'electric';
        if (isGrounded(pokemon) === true && fieldStatus.terrain.name === 'グラスフィールド')
            pokemon.selectedMove.type = 'grass';
        if (isGrounded(pokemon) === true && fieldStatus.terrain.name === 'サイコフィールド')
            pokemon.selectedMove.type = 'psychic';
        if (isGrounded(pokemon) === true && fieldStatus.terrain.name === 'ミストフィールド')
            pokemon.selectedMove.type = 'fairy';
    }
    if (pokemon.selectedMove.name === 'テクノバスター') {
        for (const drive of driveTable) {
            if (isItem(pokemon, drive.name) === true) {
                //pokemon.selectedMove.type = drive.type;
            }
        }
    }
    if (pokemon.selectedMove.name === 'マルチアタック') {
        for (const memory of memoryTable) {
            if (isItem(pokemon, memory.name) === true) {
                //pokemon.selectedMove.type = memory.type;
            }
        }
    }
    if (pokemon.selectedMove.name === 'めざめるダンス') {
        pokemon.selectedMove.type = getPokemonType(pokemon)[0];
    }
    electrify: if (pokemon.stateChange.electrify.isTrue === true) {
        if (pokemon.selectedMove.name === 'わるあがき')
            break electrify;
        pokemon.selectedMove.type = 'electric';
    }
    ionDeluge: if (fieldStatus.whole.ionDeluge.isTrue === true) {
        if (pokemon.selectedMove.name === 'わるあがき')
            break ionDeluge;
        if (pokemon.selectedMove.type !== 'normal')
            break ionDeluge;
        pokemon.selectedMove.type = 'electric';
    }
}
// PPが適切な量引かれる
function deductPowerPoint(pokemon) {
    let value = 1;
    if (pokemon.selectedMove.name === 'テラバースト' || pokemon.selectedMove.name === 'ふういん') {
        for (const target of allPokemonInSide(getOpponentTrainer(pokemon.trainer))) {
            if (isAbility(target, 'プレッシャー') === true) {
                value += 1;
            }
        }
    }
    else {
        for (const data of pokemon.damage) {
            const target = getPokemonByBattle(data.trainer, data.battle);
            if (target === false)
                continue;
            if (target.trainer === pokemon.trainer)
                continue;
            if (isAbility(target, 'プレッシャー') === true) {
                value += 1;
            }
        }
    }
    pokemon.learnedMove[pokemon.selectedMove.slot].remainingPP = Math.max(0, pokemon.learnedMove[pokemon.selectedMove.slot].remainingPP - value);
}
// ほのおタイプではないことによるもえつきるの失敗
function burnUpFailure(pokemon) {
    if (pokemon.selectedMove.name !== 'もえつきる')
        return false;
    if (getPokemonType(pokemon).includes('fire') === true)
        return false;
    pokemon.damage = [];
    pokemon.status.declareFailure();
    return true;
}
// おおあめ/おおひでりによるほのお/みず技の失敗
function failureByWeather(pokemon) {
    if (pokemon.selectedMove.category === '変化')
        return false;
    if (isWeather(pokemon, 'おおあめ') === true) {
        if (pokemon.selectedMove.type === 'fire') {
            pokemon.damage = [];
            writeLog(`強い雨の 影響で ほのおタイプの 攻撃が 消失した!`);
            return true;
        }
    }
    if (isWeather(pokemon, 'おおひでり') === true) {
        if (pokemon.selectedMove.type === 'water') {
            pokemon.damage = [];
            writeLog(`強い日差しの 影響で みずタイプの 攻撃が 蒸発した!`);
            return true;
        }
    }
    return false;
}
// ふんじんによるほのお技の失敗とダメージ
function failureByPowder(pokemon) {
    if (pokemon.stateChange.powder.isTrue === true) {
        if (pokemon.selectedMove.type === 'fire') {
            pokemon.damage = [];
            writeLog(`${pokemon.selectedMove.name}に 反応して ふんじんが 爆発した!`);
            if (isAbility(pokemon, 'マジックガード') === true) {
                return true;
            }
            const dynamax = (pokemon.stateChange.dynamax.isTrue === true) ? 1 / 2 : 1;
            const damage = Math.floor(pokemon.actualValue.hitPoint * dynamax / 4);
            pokemon.status.remainingHP = Math.max(0, pokemon.status.remainingHP - damage);
            return true;
        }
    }
    return false;
}
// ミクルのみによる命中補正効果が消費される
function hitCorrConsumance(pokemon) {
}
// 技の仕様による失敗
function failureByMoveSpec(pokemon) {
    const targetList = getTargetList(pokemon);
    const one = targetList[0];
    steelRoller: if (pokemon.selectedMove.name === 'アイアンローラー') {
        if (fieldStatus.terrain.name !== null)
            break steelRoller;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    hyperspaceFury: if (pokemon.selectedMove.name === 'いじげんラッシュ') {
        if (pokemon.status.name === 'フーパ(解放)')
            break hyperspaceFury;
        if (pokemon.stateChange.transform.isTrue === true && pokemon.stateChange.transform.name === 'フーパ(解放)')
            break hyperspaceFury;
        pokemon.damage = [];
        writeLog(`しかし ${getArticle(pokemon)}には 使うことが できなかった!`);
        return true;
    }
    darkVoid: if (pokemon.selectedMove.name === 'ダークホール') {
        if (pokemon.status.name === 'ダークライ')
            break darkVoid;
        if (pokemon.stateChange.transform.isTrue === true && pokemon.stateChange.transform.name === 'ダークライ')
            break darkVoid;
        pokemon.damage = [];
        writeLog(`しかし ${getArticle(pokemon)}には 使うことが できなかった!`);
        return true;
    }
    auraWheel: if (pokemon.selectedMove.name === 'オーラぐるま') {
        if (pokemon.status.name === 'モルペコ(満腹)')
            break auraWheel;
        if (pokemon.status.name === 'モルペコ(空腹)')
            break auraWheel;
        if (pokemon.stateChange.transform.isTrue === true && pokemon.stateChange.transform.name === 'モルペコ(満腹)')
            break auraWheel;
        if (pokemon.stateChange.transform.isTrue === true && pokemon.stateChange.transform.name === 'モルペコ(満腹)')
            break auraWheel;
        pokemon.damage = [];
        writeLog(`しかし ${getArticle(pokemon)}には 使うことが できなかった!`);
        return true;
    }
    auroraVeil: if (pokemon.selectedMove.name === 'オーロラベール') {
        if (isWeather(pokemon, 'あられ') === true)
            break auroraVeil;
        if (isWeather(pokemon, 'ゆき') === true)
            break auroraVeil;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    clangorousSoul: if (pokemon.selectedMove.name === 'ソウルビート') {
        if (pokemon.status.remainingHP > Math.floor(pokemon.actualValue.hitPoint / 3))
            break clangorousSoul;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    stockpile: if (pokemon.selectedMove.name === 'たくわえる') {
        if (pokemon.stateChange.stockpile.count !== 3)
            break stockpile;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    teleport: if (pokemon.selectedMove.name === 'テレポート') {
        const bench = getParty(pokemon.trainer).filter(poke => poke.order.battle === null && poke.status.remainingHP > 0);
        if (bench.length > 0)
            break teleport;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    lastResort: if (pokemon.selectedMove.name === 'とっておき') {
        let isFailure = false;
        // 「とっておき」を覚えていない
        if (pokemon.learnedMove.filter(move => move.name === 'とっておき').length === 0)
            isFailure = true;
        // 「とっておき以外の技」を覚えていない
        if (pokemon.learnedMove.filter(move => move.name !== 'とっておき' && move.name !== null).length === 0)
            isFailure = true;
        // 使用していない「とっておき以外の技」がある
        //if ( pokemon.learnedMove.filter( move => move.name !== 'とっておき' && move.name !== null && move.isUsed === false ).length > 0 ) isFailure = true;
        if (isFailure === false)
            break lastResort;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    spitUp: if (pokemon.selectedMove.name === 'はきだす' || pokemon.selectedMove.name === 'のみこむ') {
        if (pokemon.stateChange.stockpile.count > 0)
            break spitUp;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    stuffCheeks: if (pokemon.selectedMove.name === 'ほおばる') {
        for (const berry of berryTable) {
            if (berry.name === pokemon.status.item)
                break stuffCheeks;
        }
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    fling: if (pokemon.selectedMove.name === 'なげつける') {
        // 持ち物がない
        if (pokemon.status.item === null)
            break fling;
        if (isItem(pokemon, pokemon.status.item) === false)
            break fling;
        // 不適格な持ち物である
        if (pokemon.status.item === 'べにいろのたま')
            break fling;
        if (pokemon.status.item === 'あいいろのたま')
            break fling;
        if (pokemon.status.item === 'くちたけん')
            break fling;
        if (pokemon.status.item === 'くちたたて')
            break fling;
        if (pokemon.status.item === 'だいこんごうだま')
            break fling;
        if (pokemon.status.item === 'だいしらたま')
            break fling;
        if (pokemon.status.item === 'だいはっきんだま')
            break fling;
        if (pokemon.status.name === 'ギラティナ(アナザー)' && pokemon.status.item === 'はっきんだま')
            break fling;
        if (pokemon.status.name === 'ギラティナ(オリジン)' && pokemon.status.item === 'はっきんだま')
            break fling;
        if (pokemon.status.name === 'アルセウス' && plateTable.filter(plate => plate.name === pokemon.status.name).length === 1)
            break fling;
        if (pokemon.status.name === 'ゲノセクト' && driveTable.filter(drive => drive.name === pokemon.status.item).length === 1)
            break fling;
        if (gemTable.filter(gem => gem.name === pokemon.status.item).length === 1)
            break fling;
        if (zCrystalTable.filter(zCrystal => zCrystal.name === pokemon.status.item).length === 1)
            break fling;
        if (megaStoneTable.filter(mega => mega.name === pokemon.status.item && mega.name === pokemon.status.name).length === 1)
            break fling;
        if (paradoxPokemonList.includes(pokemon.status.name) && pokemon.status.item === 'ブーストエナジー')
            break fling;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    naturalGift: if (pokemon.selectedMove.name === 'しぜんのめぐみ') {
        // 持ち物がない
        if (pokemon.status.item === null)
            break naturalGift;
        if (isItem(pokemon, pokemon.status.item) === false)
            break naturalGift;
        // 不適格な持ち物である
        if (berryTable.filter(berry => berry.name === pokemon.status.item).length !== 1)
            break naturalGift;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    fakeOut: if (pokemon.selectedMove.name === 'ねこだまし' || pokemon.selectedMove.name === 'であいがしら' || pokemon.selectedMove.name === 'たたみがえし') {
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    noRetreat: if (pokemon.selectedMove.name === 'はいすいのじん') {
        if (pokemon.stateChange.noRetreat.isTrue === false)
            break noRetreat;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    suckerPunch: if (pokemon.selectedMove.name === 'ふいうち') {
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    poltergeist: if (pokemon.selectedMove.name === 'ポルターガイスト') {
        if (one.target.status.item !== null)
            break poltergeist;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    protect: if (protectMoveList.includes(pokemon.selectedMove.name)) {
        if (pokemon.stateChange.someProtect.isTrue === false)
            break protect;
        if (getRandom() < Math.pow(1 / 3, pokemon.stateChange.someProtect.count))
            break protect;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    snore: if (pokemon.selectedMove.name === 'いびき' || pokemon.selectedMove.name === 'ねごと') {
        if (pokemon.status.statusAilment.name === 'ねむり')
            break snore;
        if (isAbility(pokemon, 'ぜったいねむり') === true)
            break snore;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    rest: if (pokemon.selectedMove.name === 'ねむる') {
        if (pokemon.status.remainingHP === pokemon.actualValue.hitPoint)
            break rest;
        if (pokemon.status.statusAilment.name === 'ねむり')
            break rest;
        if (isAbility(pokemon, 'ふみん') === true)
            break rest;
        if (isAbility(pokemon, 'やるき') === true)
            break rest;
        if (isAbility(pokemon, 'ぜったいねむり') === true)
            break rest;
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    lowKick: if (pokemon.selectedMove.name === 'けたぐり' || pokemon.selectedMove.name === 'くさむすび' || pokemon.selectedMove.name === 'ヘビーボンバー' || pokemon.selectedMove.name === 'ヒートスタンプ') {
        if (one.target.stateChange.dynamax.isTrue === false)
            break lowKick;
        pokemon.damage = [];
        writeLog(`${getArticle(pokemon)}は 首を 横に振った`);
        writeLog(`この技を しかけることが できないようだ......`);
        return true;
    }
    return false;
}
// 特性による失敗
function failureByAbility(pokemon) {
    const targetList = getTargetList(pokemon);
    const one = targetList[0];
    damp: if (explosionMoveList.includes(pokemon.selectedMove.name) === true) {
        const dampPokemon = isExistAbility('しめりけ');
        if (dampPokemon === false)
            break damp;
        dampPokemon.status.declareAbility();
        writeLog(`${getArticle(pokemon)}は ${pokemon.selectedMove.name}が 使えない!`);
        pokemon.damage = [];
        return true;
    }
    queenlyMajesty: if (pokemon.selectedMove.priority > 0) {
        const queenlyMajestyPokemon = isExistAbilityOneSide(getOpponentTrainer(pokemon.trainer), 'じょおうのいげん');
        const dazzlingPokemon = isExistAbilityOneSide(getOpponentTrainer(pokemon.trainer), 'ビビッドボディ');
        if (targetList.filter(target => target.target.trainer !== pokemon.trainer).length === 0)
            break queenlyMajesty;
        if (queenlyMajestyPokemon !== false) {
            queenlyMajestyPokemon.status.declareAbility();
            writeLog(`${getArticle(pokemon)}は ${pokemon.selectedMove.name}を 使えない!`);
            pokemon.damage = [];
            return true;
        }
        if (dazzlingPokemon !== false) {
            dazzlingPokemon.status.declareAbility();
            writeLog(`${getArticle(pokemon)}は ${pokemon.selectedMove.name}を 使えない!`);
            pokemon.damage = [];
            return true;
        }
    }
    return false;
}
// 中断されても効果が発動する技
function effectAlwaysActivate(pokemon) {
    const targetList = getTargetList(pokemon);
    const one = targetList[0];
    if (pokemon.selectedMove.name === 'みらいよち' || pokemon.selectedMove.name === 'はめつのねがい') {
        const futureSight = new StateChange('みらいにこうげき');
        futureSight.isTrue = true;
        futureSight.target.trainer = one.target.trainer;
        futureSight.target.battle = one.target.order.battle;
        fieldStatus.whole.futureSight.push(futureSight);
        if (pokemon.selectedMove.name === 'みらいよち') {
            writeLog(`${getArticle(pokemon)}は 未来に 攻撃を予知した!`);
        }
        if (pokemon.selectedMove.name === 'はめつのねがい') {
            writeLog(`${getArticle(pokemon)}は はめつのねがいを 未来に託した!`);
        }
        return true;
    }
    rage: if (pokemon.selectedMove.name === 'いかり') {
        if (pokemon.stateChange.rage.isTrue === true)
            break rage;
        pokemon.stateChange.rage.isTrue = true;
    }
    return false;
}
// へんげんじざい/リベロの発動
function abilityChangeType(pokemon) {
    const myType = getPokemonType(pokemon);
    protean: if (isAbility(pokemon, 'へんげんじざい') === true || isAbility(pokemon, 'リベロ') === true) {
        if (myType.length === 1 && myType[0] === pokemon.selectedMove.type)
            break protean;
        if (pokemon.stateChange.protean.isTrue === true)
            break protean;
        if (pokemon.selectedMove.name === 'わるあがき')
            break protean;
        if (pokemon.selectedMove.name === 'みらいよち')
            break protean;
        if (pokemon.selectedMove.name === 'はめつのねがい')
            break protean;
        pokemon.status.declareAbility();
        pokemon.status.type1 = pokemon.selectedMove.type;
        pokemon.status.type2 = null;
        pokemon.stateChange.protean.isTrue = true;
        writeLog(`${getArticle(pokemon)}は ${pokemon.status.type1}タイプに なった!`);
    }
}
// 溜め技の溜めターンでの動作
function preliminaryAction(pokemon) {
    const targetList = getTargetList(pokemon);
    const one = targetList[0];
    if (pokemon.selectedMove.flag.charge === false)
        return false;
    if (pokemon.stateChange.store.isTrue === true)
        return false;
    if (pokemon.selectedMove.name === 'かまいたち') {
        writeLog(`${getArticle(pokemon)}の 周りで 空気が 渦を巻く!`);
    }
    if (pokemon.selectedMove.name === 'コールドフレア') {
        writeLog(`${getArticle(pokemon)}は 凍える空気に 包まれた!`);
    }
    if (pokemon.selectedMove.name === 'ゴッドバード') {
        writeLog(`${getArticle(pokemon)}を 激しい光が 包む!`);
    }
    if (pokemon.selectedMove.name === 'ジオコントロール') {
        writeLog(`${getArticle(pokemon)}は パワーを ためこんでいる!`);
    }
    if (pokemon.selectedMove.name === 'ソーラービーム' || pokemon.selectedMove.name === 'ソーラーブレード') {
        writeLog(`${getArticle(pokemon)}は 光を 吸収した!`);
        if (isWeather(pokemon, 'にほんばれ') === true) {
            moveDeclareMessage(pokemon);
            return false;
        }
    }
    if (pokemon.selectedMove.name === 'フリーズボルト') {
        writeLog(`${getArticle(pokemon)}は 冷たい光に 包まれた!`);
    }
    if (pokemon.selectedMove.name === 'メテオビーム') {
        writeLog(`${getArticle(pokemon)}に 宇宙の 力が あふれだす!`);
        changeMyRank(pokemon, 'specialAttack', 1);
    }
    if (pokemon.selectedMove.name === 'ロケットずつき') {
        writeLog(`${getArticle(pokemon)}は 首を 引っ込めた!`);
        changeMyRank(pokemon, 'defense', 1);
    }
    if (pokemon.selectedMove.name === 'あなをほる') {
        writeLog(`${getArticle(pokemon)}は 地面に 潜った!`);
        pokemon.stateChange.dig.isTrue = true;
    }
    if (pokemon.selectedMove.name === 'そらをとぶ') {
        writeLog(`${getArticle(pokemon)}は 空高く 飛び上がった!`);
        pokemon.stateChange.fly.isTrue = true;
    }
    if (pokemon.selectedMove.name === 'とびはねる') {
        writeLog(`${getArticle(pokemon)}は 高く 飛び跳ねた!`);
        pokemon.stateChange.fly.isTrue = true;
    }
    if (pokemon.selectedMove.name === 'フリーフォール') {
        let isFailure = false;
        if (one.target.trainer === pokemon.trainer)
            isFailure = true;
        if (one.target.stateChange.substitute.isTrue === true)
            isFailure = true;
        if (isHide(one.target) === true)
            isFailure = true;
        if (isFailure === true) {
            pokemon.damage = [];
            pokemon.status.declareFailure();
            return true;
        }
        if (isWeight(one.target) >= 200) {
            pokemon.damage = [];
            writeLog(`${getArticle(one.target)}は 重すぎて 持ち上げられない!`);
            return true;
        }
        writeLog(`${getArticle(pokemon)}は ${getArticle(one.target)}を 上空に 連れ去った!`);
        pokemon.stateChange.fly.isTrue = true;
        one.target.stateChange.fly.isTrue = true;
        return true;
    }
    if (pokemon.selectedMove.name === 'ダイビング') {
        writeLog(`${getArticle(pokemon)}は 水中に 身を潜めた!`);
        pokemon.stateChange.dive.isTrue = true;
        if (pokemon.status.name === 'ウッウ') {
            formChange(pokemon);
        }
    }
    if (pokemon.selectedMove.name === 'ゴーストダイブ') {
        writeLog(`${getArticle(pokemon)}の姿が 一瞬にして 消えた!`);
        pokemon.stateChange.shadowForce.isTrue = true;
    }
    if (pokemon.selectedMove.name === 'シャドーダイブ') {
        writeLog(`${getArticle(pokemon)}の姿が 一瞬にして 消えた!`);
        pokemon.stateChange.shadowForce.isTrue = true;
    }
    if (isItem(pokemon, 'パワフルハーブ') === false) {
        pokemon.stateChange.store.isTrue = true;
        pokemon.stateChange.store.name = pokemon.selectedMove.name;
        return true;
    }
    writeLog(`${getArticle(pokemon)}は パワフルハーブで 力が みなぎった!`);
    recycleAvailable(pokemon);
    moveDeclareMessage(pokemon);
    return false;
}
// マグニチュードの大きさ(威力)が決定
function dicideMagnitudePower(pokemon) {
    if (pokemon.selectedMove.name !== 'マグニチュード')
        return;
    const random = getRandom();
    if (random >= 95) {
        pokemon.selectedMove.power = 150;
        writeLog(`マグニチュード10!`);
        return;
    }
    if (random >= 85) {
        pokemon.selectedMove.power = 110;
        writeLog(`マグニチュード9!`);
        return;
    }
    if (random >= 65) {
        pokemon.selectedMove.power = 90;
        writeLog(`マグニチュード8!`);
        return;
    }
    if (random >= 35) {
        pokemon.selectedMove.power = 70;
        writeLog(`マグニチュード7!`);
        return;
    }
    if (random >= 15) {
        pokemon.selectedMove.power = 50;
        writeLog(`マグニチュード6!`);
        return;
    }
    if (random >= 5) {
        pokemon.selectedMove.power = 30;
        writeLog(`マグニチュード5!`);
        return;
    }
    if (random >= 0) {
        pokemon.selectedMove.power = 10;
        writeLog(`マグニチュード4!`);
        return;
    }
}
// 姿を隠していることによる無効化
function disableByConcealment(pokemon) {
    const targetList = getTargetList(pokemon);
    for (const target of targetList) {
        if (isHide(target.target) === false)
            continue;
        if (pokemon.stateChange.lockOn.isTrue === true)
            continue;
        if (isAbility(pokemon, 'ノーガード') === true)
            continue;
        if (isAbility(target.target, 'ノーガード') === true)
            continue;
        if (pokemon.selectedMove.name === 'どくどく' && getPokemonType(pokemon).includes('poison'))
            continue;
        if (pokemon.selectedMove.name === 'アロマセラピー')
            continue;
        if (pokemon.selectedMove.name === 'いやしのすず')
            continue;
        if (pokemon.selectedMove.name === 'てだすけ')
            continue;
        let isValid = true;
        if (target.target.stateChange.dig.isTrue === true) {
            if (pokemon.selectedMove.name === 'じしん')
                isValid = true;
            if (pokemon.selectedMove.name === 'マグニチュード')
                isValid = true;
        }
        if (target.target.stateChange.fly.isTrue === true) {
            if (pokemon.selectedMove.name === 'かぜおこし')
                isValid = true;
            if (pokemon.selectedMove.name === 'たつまき')
                isValid = true;
            if (pokemon.selectedMove.name === 'かみなり')
                isValid = true;
            if (pokemon.selectedMove.name === 'スカイアッパー')
                isValid = true;
            if (pokemon.selectedMove.name === 'うちおとす')
                isValid = true;
            if (pokemon.selectedMove.name === 'ぼうふう')
                isValid = true;
            if (pokemon.selectedMove.name === 'サウザンアロー')
                isValid = true;
        }
        if (target.target.stateChange.dive.isTrue === true) {
            if (pokemon.selectedMove.name === 'なみのり')
                isValid = true;
            if (pokemon.selectedMove.name === 'うずしお')
                isValid = true;
        }
        if (isValid === true)
            continue;
        target.damage.success = false;
        writeLog(`${getArticle(target.target)}には 当たらなかった!`);
    }
    return isMoveFailure(pokemon);
}
// サイコフィールドによる無効化
function disableByPsychofield(pokemon) {
    if (fieldStatus.terrain.name !== 'サイコフィールド')
        return false;
    if (pokemon.selectedMove.priority <= 0)
        return false;
    const targetList = getTargetList(pokemon);
    for (const target of targetList) {
        if (target.target.trainer === pokemon.trainer)
            continue;
        if (isGrounded(target.target) === false)
            continue;
        if (isHide(target.target) === true)
            continue;
        target.damage.success = false;
        writeLog(`${getArticle(target.target)}は サイコフィールドに 守られている!`);
    }
    return isMoveFailure(pokemon);
}
// ファストガード/ワイドガード/トリックガードによる無効化
function disableByOtherProtect(pokemon) {
    const targetList = getTargetList(pokemon);
    for (const target of targetList) {
        quickGuard: if (fieldStatus.getSide(target.target.trainer).quickGuard.isTrue === true) {
            if (pokemon.selectedMove.priority <= 0)
                break quickGuard;
            if (isAbility(pokemon, 'ふかしのこぶし') === true && pokemon.selectedMove.flag.contact === true)
                break quickGuard;
            target.damage.success = false;
            writeLog(`${getArticle(target.target)}は ファストガードで 守られた!`);
            continue;
        }
        wideGuard: if (fieldStatus.getSide(target.target.trainer).wideGuard.isTrue === true) {
            if (pokemon.selectedMove.target !== '相手全体' && pokemon.selectedMove.target !== '自分以外')
                break wideGuard;
            if (isAbility(pokemon, 'ふかしのこぶし') === true && pokemon.selectedMove.flag.contact === true)
                break wideGuard;
            target.damage.success = false;
            writeLog(`${getArticle(target.target)}は ワイドガードで 守られた!`);
            continue;
        }
        craftyShield: if (fieldStatus.getSide(target.target.trainer).craftyShield.isTrue === true) {
            if (target.target.trainer === pokemon.trainer)
                break craftyShield;
            if (pokemon.selectedMove.category !== '変化')
                break craftyShield;
            if (pokemon.selectedMove.target === '全体')
                break craftyShield;
            if (pokemon.selectedMove.target === '味方全体')
                break craftyShield;
            if (pokemon.selectedMove.name === 'コーチング')
                break craftyShield;
            if (pokemon.selectedMove.name === 'オウムがえし')
                break craftyShield;
            if (pokemon.selectedMove.name === 'さきどり')
                break craftyShield;
            target.damage.success = false;
            writeLog(`${getArticle(target.target)}は トリックガードで 守られた!`);
            continue;
        }
    }
    return isMoveFailure(pokemon);
}
// まもる/キングシールド/ブロッキング/ニードルガード/トーチカによる無効化
function disableByProtect(pokemon) {
    const targetList = getTargetList(pokemon);
    for (const target of targetList) {
        if (target.target.stateChange.protect.isTrue === false)
            continue;
        if (pokemon.selectedMove.flag.protect === false)
            continue;
        if (isAbility(pokemon, 'ふかしのこぶし') === true && pokemon.selectedMove.flag.contact === true)
            continue;
        if (target.target.stateChange.protect.text === 'キングシールド' && pokemon.selectedMove.category === '変化')
            continue;
        if (target.target.stateChange.protect.text === 'ブロッキング' && pokemon.selectedMove.category === '変化')
            continue;
        target.damage.success = false;
        writeLog(`${getArticle(target.target)}は 攻撃から 身を守った!`);
        spikyShield: if (target.target.stateChange.protect.text === 'ニードルガード') {
            if (pokemon.selectedMove.flag.contact === false)
                break spikyShield;
            if (pokemon.selectedMove.name === 'フリーフォール')
                break spikyShield;
            if (isAbility(target.target, 'マジックガード') === true)
                break spikyShield;
            if (isItem(target.target, 'ぼうごパット') === true)
                break spikyShield;
            const dynamax = (pokemon.stateChange.dynamax.isTrue === true) ? 0.5 : 1;
            const damage = Math.max(1, Math.floor(pokemon.actualValue.hitPoint * dynamax / 8));
            changeHPByAbility(pokemon, damage, '-');
            writeLog(`${getArticle(pokemon)}は 傷ついた!`);
        }
        banefulBunker: if (target.target.stateChange.protect.text === 'トーチカ') {
            if (pokemon.selectedMove.flag.contact === false)
                break banefulBunker;
            if (pokemon.selectedMove.name === 'フリーフォール')
                break banefulBunker;
            giveAilment(target.target, pokemon, 'どく');
        }
        kingsShield: if (target.target.stateChange.protect.text === 'キングシールド') {
            if (pokemon.selectedMove.flag.contact === false)
                break kingsShield;
            if (getRankVariation(pokemon, 'attack', -1) === 0)
                break kingsShield;
            changeTargetRank(target.target, pokemon, 'attack', -1);
        }
        obstruct: if (target.target.stateChange.protect.text === 'ブロッキング') {
            if (pokemon.selectedMove.flag.contact === false)
                break obstruct;
            if (getRankVariation(pokemon, 'defense', -2) === 0)
                break obstruct;
            changeTargetRank(target.target, pokemon, 'defense', -2);
        }
    }
    return isMoveFailure(pokemon);
}
// たたみがえしによる無効化
function disableByMatBlock(pokemon) {
    const targetList = getTargetList(pokemon);
    for (const target of targetList) {
        if (fieldStatus.getSide(target.target.trainer).matBlock.isTrue === false)
            continue;
        if (pokemon.selectedMove.category === '変化')
            continue;
        if (isAbility(pokemon, 'ふかしのこぶし') === true && pokemon.selectedMove.flag.contact === true)
            continue;
        target.damage.success = false;
        writeLog(`${pokemon.selectedMove.name}は たたみがえしで 防がれた!`);
    }
    return isMoveFailure(pokemon);
}
// ダイウォールによる無効化
function disableByMaxGuard(pokemon) {
    const targetList = getTargetList(pokemon);
    for (const target of targetList) {
        if (target.target.stateChange.protect.text !== 'ダイウォール')
            continue;
        if (notMaxGuardMoveList.includes(pokemon.selectedMove.name) === false && pokemon.selectedMove.flag.protect === false)
            continue;
        target.damage.success = false;
        writeLog(`${getArticle(target.target)}は 攻撃から 身を守った!`);
    }
    return isMoveFailure(pokemon);
}
// テレキネシスの、対象がディグダ/ダグトリオ/スナバァ/シロデスナ/メガゲンガー/うちおとす状態/ねをはる状態であることによる失敗
function failureByTelekinesis(pokemon) {
    const targetList = getTargetList(pokemon);
    const one = targetList[0];
    let isFailure = false;
    if (pokemon.selectedMove.name !== 'テレキネシス')
        return false;
    if (one.target.status.name === 'ディグダ')
        isFailure = true;
    if (one.target.status.name === 'ダグトリオ')
        isFailure = true;
    if (one.target.status.name === 'スナバァ')
        isFailure = true;
    if (one.target.status.name === 'シロデスナ')
        isFailure = true;
    if (one.target.status.name === 'メガゲンガー')
        isFailure = true;
    if (one.target.stateChange.smackDown.isTrue === true)
        isFailure = true;
    if (one.target.stateChange.ingrain.isTrue === true)
        isFailure = true;
    if (isFailure === true) {
        pokemon.damage = [];
        pokemon.status.declareFailure();
        return true;
    }
    return false;
}
// 特性による無効化(その1)
function disableByAbility1st(pokemon) {
    const targetList = getTargetList(pokemon);
    const one = targetList[0];
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        // そうしょく: くさタイプ
        if (isAbility(target, 'そうしょく') === true) {
            if (pokemon.selectedMove.type === 'grass') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        // もらいび: ほのおタイプ
        if (isAbility(target, 'もらいび') === true) {
            if (pokemon.selectedMove.type === 'fire') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        // かんそうはだ/よびみず/ちょすい: みずタイプ
        if (isAbility(target, 'かんそうはだ') === true) {
            if (pokemon.selectedMove.type === 'water') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        if (isAbility(target, 'よびみず') === true) {
            if (pokemon.selectedMove.type === 'water') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        if (isAbility(target, 'ちょすい') === true) {
            if (pokemon.selectedMove.type === 'water') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        // ひらいしん/でんきエンジン/ちくでん: でんきタイプ
        if (isAbility(target, 'ひらいしん') === true) {
            if (pokemon.selectedMove.type === 'electric') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        if (isAbility(target, 'でんきエンジン') === true) {
            if (pokemon.selectedMove.type === 'electric') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        if (isAbility(target, 'ちくでん') === true) {
            if (pokemon.selectedMove.type === 'electric') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        // ぼうおん: 音技
        if (isAbility(target, 'ぼうおん') === true) {
            if (pokemon.selectedMove.flag.sound === true) {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        // テレパシー:　味方による攻撃技
        // ふしぎなまもり: 効果抜群でない技
        // ぼうじん: 粉技
        if (isAbility(target, 'ぼうじん') === true) {
            if (pokemon.selectedMove.flag.powder === true) {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
    }
    if (isInvalid(pokemon.damage) === true) {
        return false;
    }
    return isMoveFailure(pokemon);
}
