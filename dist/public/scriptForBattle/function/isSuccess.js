"use strict";
function isSuccess(pokemon) {
    // 行動の失敗
    // 反動で動けない
    if (pokemon.stateChange.cannotMove.isTrue === true) {
        pokemon.status.declareCannotMove();
        pokemon.stateChange.cannotMove.reset();
        if (isAbility(pokemon, 'なまけ') === true) {
            pokemon.stateChange.truant.count += 1;
        }
        return false;
    }
    // ねむり状態
    if (pokemon.status.statusAilment.name === 'ねむり') {
        pokemon.status.statusAilment.turn -= 1;
        if (isAbility(pokemon, 'はやおき') === true) {
            pokemon.status.statusAilment.turn -= 1;
        }
        if (pokemon.status.statusAilment.turn > 0) {
            if (sleepingMoveList.includes(pokemon.moveUsed.name) === false) {
                pokemon.status.declareSleeping();
                return false;
            }
        }
        else {
            pokemon.status.cureAilment();
        }
    }
    // こおり状態
    if (pokemon.status.statusAilment.name === 'こおり') {
        const random = getRandom();
        if (random < 20) {
            pokemon.status.cureAilment();
        }
        else {
            if (pokemon.moveUsed.name === 'もえつきる' && getPokemonType(pokemon).includes('ほのお') === false) {
                pokemon.status.declareFleezed();
                return false;
            }
            if (meltMoveList.includes(pokemon.moveUsed.name)) {
                pokemon.status.cureAilment();
            }
            else {
                pokemon.status.declareFleezed();
                return false;
            }
        }
    }
    // PPが残っていない
    if (pokemon.moveUsed.remainingPP === 0) {
        pokemon.moveUsed.runOutPP();
        return false;
    }
    // なまけ
    if (isAbility(pokemon, 'なまけ') === true) {
        pokemon.stateChange.truant.count += 1;
        if (pokemon.stateChange.truant.count % 2 === 0) {
            pokemon.status.declareTruant();
            return false;
        }
    }
    // ひるみ
    if (pokemon.stateChange.flinch.isTrue === true) {
        if (pokemon.stateChange.dynamax.isTrue === false) {
            pokemon.status.declareFlinch();
            return false;
        }
    }
    // かなしばり
    if (pokemon.stateChange.disable.text === pokemon.moveUsed.name) {
        pokemon.status.declareDisable();
        return false;
    }
    // じゅうりょく
    if (fieldStatus.whole.gravity.isTrue === true) {
        if (flyingMoveList.includes(pokemon.moveUsed.name)) {
            pokemon.status.declareGravity(pokemon.moveUsed.name);
            return false;
        }
    }
    // かいふくふうじ
    if (pokemon.stateChange.healBlock.isTrue === true) {
        if (healMoveList.includes(pokemon.moveUsed.name)) {
            pokemon.status.declareHealBlock();
            return false;
        }
    }
    // じごくづき
    if (pokemon.stateChange.throatChop.isTrue === true) {
        if (soundMoveList.includes(pokemon.moveUsed.name)) {
            pokemon.status.declareThroatChop();
            return false;
        }
    }
    // ちょうはつ
    if (pokemon.stateChange.taunt.isTrue === true) {
        if (pokemon.moveUsed.category === '変化') {
            pokemon.status.declareTaunt();
            return false;
        }
    }
    // ふういん
    for (const target of allPokemonInBattlefield()) {
        if (target.trainer === pokemon.trainer)
            continue;
        if (target.stateChange.imprison.isTrue === true) {
            for (const move of target.move) {
                if (move.name === pokemon.moveUsed.name) {
                    pokemon.status.declareImprison(pokemon.moveUsed.name);
                    return false;
                }
            }
        }
    }
    // こんらん
    if (pokemon.stateChange.confuse.isTrue === true) {
        const random = getRandom();
        pokemon.stateChange.confuse.count -= 1;
        pokemon.status.declareConfuse(pokemon.stateChange.confuse, random);
        if (pokemon.stateChange.confuse.count === 0) {
            pokemon.stateChange.confuse.reset();
        }
        else {
            if (random < 1 / 3 * 100) {
                return false;
            }
        }
    }
    // まひ
    if (pokemon.status.statusAilment.name === 'まひ') {
        const random = getRandom();
        if (random < 1 / 4 * 100) {
            pokemon.status.declareParalysis();
            return false;
        }
    }
    // メロメロ
    if (pokemon.stateChange.attract.isTrue === true) {
        const random = getRandom();
        const target = pokemon.stateChange.attract.target;
        const name = getPokemonByBattle(target.trainer, target.battle);
        if (name === false) {
            ;
        }
        else {
            pokemon.status.declareAttract(name.status.name, random);
            if (random < 50)
                return false;
        }
    }
    // ねごと/いびき使用時「ぐうぐう 眠っている」メッセージ
    if (sleepingMoveList.includes(pokemon.moveUsed.name)) {
        pokemon.status.declareSleeping();
    }
    // 「<ポケモン>の <技>!」のメッセージ。PPが減少することが確約される
    console.log(pokemon.moveUsed.name);
    pokemon.declareMove();
    // 技のタイプが変わる。
    // 1. 技のタイプを変える特性
    if (isAbility(pokemon, 'うるおいボイス') === true) {
        if (soundMoveList.includes(pokemon.moveUsed.name) === true) {
            pokemon.moveUsed.type = 'みず';
        }
    }
    if (isAbility(pokemon, 'エレキスキン') === true) {
        if (pokemon.moveUsed.type === 'ノーマル') {
            pokemon.moveUsed.type = 'でんき';
            pokemon.stateChange.skin.isTrue === true;
            pokemon.stateChange.skin.text = pokemon.moveUsed.type;
        }
    }
    if (isAbility(pokemon, 'スカイスキン') === true) {
        if (pokemon.moveUsed.type === 'ノーマル') {
            pokemon.moveUsed.type = 'ひこう';
            pokemon.stateChange.skin.isTrue === true;
            pokemon.stateChange.skin.text = pokemon.moveUsed.type;
        }
    }
    if (isAbility(pokemon, 'ノーマルスキン') === true) {
        pokemon.moveUsed.type = 'ノーマル';
        pokemon.stateChange.skin.isTrue === true;
        pokemon.stateChange.skin.text = pokemon.moveUsed.type;
    }
    if (isAbility(pokemon, 'フェアリースキン') === true) {
        if (pokemon.moveUsed.type === 'ノーマル') {
            pokemon.moveUsed.type = 'フェアリー';
            pokemon.stateChange.skin.isTrue === true;
            pokemon.stateChange.skin.text = pokemon.moveUsed.type;
        }
    }
    if (isAbility(pokemon, 'フリーズスキン') === true) {
        if (pokemon.moveUsed.type === 'ノーマル') {
            pokemon.moveUsed.type = 'こおり';
            pokemon.stateChange.skin.isTrue === true;
            pokemon.stateChange.skin.text = pokemon.moveUsed.type;
        }
    }
    // 2. タイプが変わる技の効果
    if (pokemon.moveUsed.name === 'ウェザーボール') {
        if (isWeather(pokemon, 'にほんばれ') === true)
            pokemon.moveUsed.type = 'ほのお';
        if (isWeather(pokemon, 'あめ') === true)
            pokemon.moveUsed.type = 'みず';
        if (isWeather(pokemon, 'すなあらし') === true)
            pokemon.moveUsed.type = 'いわ';
        if (isWeather(pokemon, 'あられ') === true)
            pokemon.moveUsed.type = 'こおり';
    }
    if (pokemon.moveUsed.name === 'だいちのはどう') {
        if (isGrounded(pokemon) === true && fieldStatus.terrain.name === 'エレキフィールド')
            pokemon.moveUsed.type = 'でんき';
        if (isGrounded(pokemon) === true && fieldStatus.terrain.name === 'グラスフィールド')
            pokemon.moveUsed.type = 'くさ';
        if (isGrounded(pokemon) === true && fieldStatus.terrain.name === 'サイコフィールド')
            pokemon.moveUsed.type = 'エスパー';
        if (isGrounded(pokemon) === true && fieldStatus.terrain.name === 'ミストフィールド')
            pokemon.moveUsed.type = 'フェアリー';
    }
    if (pokemon.moveUsed.name === 'テクノバスター') {
        if (isItem(pokemon, 'アクアカセット') === true)
            pokemon.moveUsed.type = 'みず';
        if (isItem(pokemon, 'イナズマカセット') === true)
            pokemon.moveUsed.type = 'でんき';
        if (isItem(pokemon, 'ブレイズカセット') === true)
            pokemon.moveUsed.type = 'ほのお';
        if (isItem(pokemon, 'フリーズカセット') === true)
            pokemon.moveUsed.type = 'こおり';
    }
    // そうでん/プラズマシャワー状態
    // 技の対象が決まる。若い番号の対象が優先される。
    decideTarget(pokemon);
    // PPが適切な量引かれる
    pokemon.moveUsed.remainingPP -= 1;
    pokemon.move[pokemon.moveUsed.number].remainingPP -= 1;
    // ほのおタイプではないことによるもえつきるの失敗
    if (pokemon.moveUsed.name === 'もえつきる') {
        if (getPokemonType(pokemon).includes('ほのお') === false) {
            pokemon.moveUsed.failure();
        }
    }
    // おおあめ/おおひでりによるほのお/みず技の失敗
    if (isWeather(pokemon, 'おおあめ') === true) {
        if (pokemon.moveUsed.type === 'ほのお') {
            return pokemon.moveUsed.failure();
        }
    }
    if (isWeather(pokemon, 'おおひでり') === true) {
        if (pokemon.moveUsed.type === 'みず') {
            return pokemon.moveUsed.failure();
        }
    }
    // ふんじんによるほのお技の失敗とダメージ
    if (pokemon.stateChange.powder.isTrue === true) {
        if (pokemon.moveUsed.type === 'ほのお') {
            return pokemon.moveUsed.failure();
        }
    }
    // 技の仕様による失敗
    // アイアンローラー: フィールドが無い
    if (pokemon.moveUsed.name === 'アイアンローラー') {
        if (fieldStatus.terrain.name === null) {
            return pokemon.moveUsed.failure();
        }
    }
    // いじげんラッシュ/ダークホール/オーラぐるま: 使用者のポケモンの姿が適格でない
    if (pokemon.moveUsed.name === 'ダークホール') {
        if (pokemon.status.name !== 'ダークライ') {
            return pokemon.moveUsed.failure();
        }
    }
    if (pokemon.moveUsed.name === 'オーラぐるま') {
        if (pokemon.status.name !== 'モルペコ') {
            return pokemon.moveUsed.failure();
        }
    }
    // オーロラベール: あられ状態でない
    if (pokemon.moveUsed.name === 'オーロラベール') {
        if (isWeather(pokemon, 'あられ') === false && isWeather(pokemon, 'ゆき') === false) {
            return pokemon.moveUsed.failure();
        }
    }
    // このゆびとまれ/いかりのこな: シングルバトルである
    if (pokemon.moveUsed.name === 'このゆびとまれ') {
        if (fieldStatus.battleStyle === 1) {
            return pokemon.moveUsed.failure();
        }
    }
    if (pokemon.moveUsed.name === 'いかりのこな') {
        if (fieldStatus.battleStyle === 1) {
            return pokemon.moveUsed.failure();
        }
    }
    // ソウルビート: 使用者のHPが足りない
    if (pokemon.moveUsed.name === 'ソウルビート') {
        if (pokemon.status.remainingHP <= Math.floor(pokemon.actualValue.hitPoint / 3)) {
            return pokemon.moveUsed.failure();
        }
    }
    // たくわえる: たくわえるカウントがすでに3である
    if (pokemon.moveUsed.name === 'たくわえる') {
        if (pokemon.stateChange.stockpile.count === 3) {
            return pokemon.moveUsed.failure();
        }
    }
    // とっておき: 使用されてない技がある/覚えているわざにとっておきがない
    if (pokemon.moveUsed.name === 'とっておき') {
        if (pokemon.move[0].name !== 'とっておき' &&
            pokemon.move[1].name !== 'とっておき' &&
            pokemon.move[2].name !== 'とっておき' &&
            pokemon.move[3].name !== 'とっておき') {
            return pokemon.moveUsed.failure();
        }
    }
    // はきだす/のみこむ: たくわえるカウントが0である
    if (pokemon.moveUsed.name === 'はきだす') {
        if (pokemon.stateChange.stockpile.count === 0) {
            return pokemon.moveUsed.failure();
        }
    }
    if (pokemon.moveUsed.name === 'のみこむ') {
        if (pokemon.stateChange.stockpile.count === 0) {
            return pokemon.moveUsed.failure();
        }
    }
    // なげつける/しぜんのめぐみ: 持ち物が無い/特性ぶきよう/さしおさえ/マジックルーム状態である/不適格な持ち物である
    if (pokemon.moveUsed.name === 'なげつける' || pokemon.moveUsed.name === 'ぶきよう') {
        if (pokemon.status.item === null)
            return pokemon.moveUsed.failure();
        if (isAbility(pokemon, 'ぶきよう'))
            return pokemon.moveUsed.failure();
        if (pokemon.stateChange.embargo.isTrue === true)
            return pokemon.moveUsed.failure();
        if (fieldStatus.whole.magicRoom.isTrue === true)
            return pokemon.moveUsed.failure();
    }
    // いびき/ねごと: 使用者がねむり状態でない
    if (pokemon.moveUsed.name === 'いびき') {
        if (pokemon.status.statusAilment.name !== 'ねむり') {
            return pokemon.moveUsed.failure();
        }
    }
    if (pokemon.moveUsed.name === 'ねごと') {
        if (pokemon.status.statusAilment.name !== 'ねむり') {
            return pokemon.moveUsed.failure();
        }
    }
    // ねむる
    if (pokemon.moveUsed.name === 'ねむる') {
        if (pokemon.status.remainingHP === pokemon.actualValue.hitPoint) {
            return pokemon.moveUsed.failure();
        }
        if (pokemon.status.statusAilment.name === 'ねむり') {
            return pokemon.moveUsed.failure();
        }
        if (isAbility(pokemon, 'ふみん') === true) {
            return pokemon.moveUsed.failure();
        }
        if (isAbility(pokemon, 'やるき') === true) {
            return pokemon.moveUsed.failure();
        }
    }
    // マックスレイドバトルでの失敗
    // 特性による失敗
    // しめりけ: 爆発技
    if (explosionMoveList.includes(pokemon.moveUsed.name)) {
        for (const target of allPokemonInBattlefield()) {
            if (isAbility(target, 'しめりけ') === true) {
                target.status.declareAbility();
                return pokemon.moveUsed.failure();
            }
        }
    }
    // じょおうのいげん/ビビッドボディ: 優先度が高い技
    // へんげんじざい/リベロの発動
    if (isAbility(pokemon, 'へんげんじざい') === true) {
        const myType = getPokemonType(pokemon);
        if (myType.length !== 1 || myType[0] !== pokemon.moveUsed.type) {
            pokemon.status.declareAbility();
            pokemon.status.type1 = pokemon.moveUsed.type;
            pokemon.status.type2 = null;
        }
    }
    if (isAbility(pokemon, 'リベロ') === true) {
        const myType = getPokemonType(pokemon);
        if (myType.length !== 1 || myType[0] !== pokemon.moveUsed.type) {
            pokemon.status.declareAbility();
            pokemon.status.type1 = pokemon.moveUsed.type;
            pokemon.status.type2 = null;
        }
    }
    // マグニチュードの大きさ(威力)が決定
    if (pokemon.moveUsed.name === 'マグニチュード') {
        const random = getRandom();
        let magnitude = 0;
        if (random >= 0) {
            magnitude = 4;
            pokemon.moveUsed.power = 10;
        }
        if (random >= 5) {
            magnitude = 5;
            pokemon.moveUsed.power = 30;
        }
        if (random >= 15) {
            magnitude = 6;
            pokemon.moveUsed.power = 50;
        }
        if (random >= 35) {
            magnitude = 7;
            pokemon.moveUsed.power = 70;
        }
        if (random >= 65) {
            magnitude = 8;
            pokemon.moveUsed.power = 90;
        }
        if (random >= 85) {
            magnitude = 9;
            pokemon.moveUsed.power = 110;
        }
        if (random >= 95) {
            magnitude = 10;
            pokemon.moveUsed.power = 150;
        }
        writeLog(`マグニチュード${magnitude}!`);
    }
    // テレキネシスの、対象がディグダ/ダグトリオ/スナバァ/シロデスナ/メガゲンガー/うちおとす状態/ねをはる状態であることによる失敗
    if (pokemon.moveUsed.name === 'テレキネシス') {
        for (const damage of pokemon.damage) {
            const target = getPokemonByBattle(damage.trainer, damage.battle);
            if (target === false)
                continue;
            if (target.status.name === 'ディグダ')
                return pokemon.moveUsed.failure();
            if (target.status.name === 'ダグトリオ')
                return pokemon.moveUsed.failure();
            if (target.status.name === 'スナバァ')
                return pokemon.moveUsed.failure();
            if (target.status.name === 'シロデスナ')
                return pokemon.moveUsed.failure();
            if (target.status.name === 'メガゲンガー')
                return pokemon.moveUsed.failure();
            if (target.stateChange.smackDown.isTrue === true)
                return pokemon.moveUsed.failure();
            if (target.stateChange.ingrain.isTrue === true)
                return pokemon.moveUsed.failure();
        }
    }
    // 特性による無効化(その1)
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        // そうしょく: くさタイプ
        if (isAbility(target, 'そうしょく') === true) {
            if (pokemon.moveUsed.type === 'くさ') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        // もらいび: ほのおタイプ
        if (isAbility(target, 'もらいび') === true) {
            if (pokemon.moveUsed.type === 'ほのお') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        // かんそうはだ/よびみず/ちょすい: みずタイプ
        if (isAbility(target, 'かんそうはだ') === true) {
            if (pokemon.moveUsed.type === 'みず') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        if (isAbility(target, 'よびみず') === true) {
            if (pokemon.moveUsed.type === 'みず') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        if (isAbility(target, 'ちょすい') === true) {
            if (pokemon.moveUsed.type === 'みず') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        // ひらいしん/でんきエンジン/ちくでん: でんきタイプ
        if (isAbility(target, 'ひらいしん') === true) {
            if (pokemon.moveUsed.type === 'でんき') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        if (isAbility(target, 'でんきエンジン') === true) {
            if (pokemon.moveUsed.type === 'でんき') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        if (isAbility(target, 'ちくでん') === true) {
            if (pokemon.moveUsed.type === 'でんき') {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        // ぼうおん: 音技
        if (isAbility(target, 'ぼうおん') === true) {
            if (soundMoveList.includes(pokemon.moveUsed.name)) {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        // テレパシー:　味方による攻撃技
        // ふしぎなまもり: 効果抜群でない技
        // ぼうじん: 粉技
        if (isAbility(target, 'ぼうじん') === true) {
            if (powderMoveList.includes(pokemon.moveUsed.name)) {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
    }
    if (isInvalid(pokemon.damage) === true) {
        return false;
    }
    // 相性による無効化
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        if (isItem(target, 'ねらいのまと') === true)
            continue;
        if (pokemon.moveUsed.category === '変化' && pokemon.moveUsed.name === 'でんじは')
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
        if (pokemon.moveUsed.type === 'じめん') {
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
        if (pokemon.moveUsed.type !== 'じめん')
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
        if (powderMoveList.includes(pokemon.moveUsed.name) === false)
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
            if (ballMoveList.includes(pokemon.moveUsed.name)) {
                target.status.declareAbility();
                target.status.declareInvalid(damage);
            }
        }
        // ねんちゃく: トリック/すりかえ/ふしょくガス
        if (isAbility(target, 'ぼうだん') === true) {
            if (pokemon.moveUsed.name === 'トリック' || pokemon.moveUsed.name === 'すりかえ' || pokemon.moveUsed.name === 'ふしょくガス') {
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
        if (getPokemonType(target).includes('くさ')) {
            if (powderMoveList.includes(pokemon.moveUsed.name)) {
                target.status.declareInvalid(damage);
            }
        }
        // ゴーストタイプ: にげられない状態にする変化技/たこがための無効化
        // あくタイプ: いたずらごころの効果が発動した技の無効化
        // こおりタイプ: ぜったいれいどの無効化
        if (getPokemonType(target).includes('こおり')) {
            if (pokemon.moveUsed.name === 'ぜったいれいど') {
                target.status.declareInvalid(damage);
            }
        }
        // ひこうタイプ: フリーフォールの無効化
        if (getPokemonType(target).includes('ひこう')) {
            if (pokemon.moveUsed.name === 'フリーフォール') {
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
        if (pokemon.moveUsed.name === 'メロメロ') {
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
        if (pokemon.moveUsed.name === 'ベノムトラップ') {
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
        if (pokemon.moveUsed.name === 'あくび') {
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
        if (pokemon.moveUsed.name === 'いちゃもん') {
            if (target.stateChange.torment.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // さしおさえ: 対象がすでにさしおさえ状態である
        if (pokemon.moveUsed.name === 'さしおさえ') {
            if (target.stateChange.embargo.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // テレキネシス: 対象がすでにテレキネシス状態である
        if (pokemon.moveUsed.name === 'テレキネシス') {
            if (target.stateChange.telekinesis.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // なやみのタネ: 対象の特性がふみん/なまけである
        if (pokemon.moveUsed.name === 'なやみのタネ') {
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
        if (pokemon.moveUsed.name === 'ねをはる') {
            if (pokemon.stateChange.ingrain.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // ほろびのうた: 対象がすでにほろびのうた状態である
        if (pokemon.moveUsed.name === 'ほろびのうた') {
            if (target.stateChange.perishSong.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // みやぶる/かぎわける/ミラクルアイ: 対象がすでにみやぶられている/ミラクルアイ状態である
        if (pokemon.moveUsed.name === 'みやぶる' || pokemon.moveUsed.name === 'かぎわける' || pokemon.moveUsed.name === 'ミラクルアイ') {
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
        if (pokemon.moveUsed.name === 'メロメロ') {
            if (target.stateChange.attract.isTrue === true) {
                target.status.declareInvalid(damage);
            }
        }
        // やどりぎのタネ: 対象がすでにやどりぎのタネ状態である
        if (pokemon.moveUsed.name === 'やどりぎのタネ') {
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
        if (pokemon.moveUsed.name === 'コーチング') {
            if (fieldStatus.battleStyle === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // ソウルビート/はいすいのじん: 全能力が最大まで上がっている
        if (pokemon.moveUsed.name === 'ソウルビート' || pokemon.moveUsed.name === 'はいすいのじん') {
            if (pokemon.rank.attack === 6 &&
                pokemon.rank.defense === 6 &&
                pokemon.rank.specialAttack === 6 &&
                pokemon.rank.specialDefense === 6 &&
                pokemon.rank.speed === 6) {
                target.status.declareInvalid(damage);
            }
        }
        // ほおばる: ぼうぎょランクがすでに最大である
        if (pokemon.moveUsed.name === 'ほおばる') {
            if (pokemon.rank.defense === 6) {
                target.status.declareInvalid(damage);
            }
        }
        // その他
        // がむしゃら: 対象のHPが使用者以下
        if (pokemon.moveUsed.name === 'がむしゃら') {
            if (pokemon.status.remainingHP >= target.status.remainingHP) {
                target.status.declareInvalid(damage);
            }
        }
        // シンクロノイズ: タイプが合致していない
        if (pokemon.moveUsed.name === 'シンクロノイズ') {
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
        if (pokemon.moveUsed.name === 'ゆめくい' || pokemon.moveUsed.name === 'あくむ') {
            if (isStatusAilment(target, 'ねむり') === false) {
                target.status.declareInvalid(damage);
            }
        }
        // 一撃必殺技: 対象が使用者よりレベルが高い/対象がダイマックスしている
        if (oneShotMoveList.includes(pokemon.moveUsed.name)) {
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
        if (pokemon.moveUsed.accuracy === 0)
            continue;
        if (isWeather(target, 'あめ') === true) {
            if (pokemon.moveUsed.name === 'かみなり')
                continue;
            if (pokemon.moveUsed.name === 'ぼうふう')
                continue;
        }
        if (isWeather(target, 'あられ') === true) {
            if (pokemon.moveUsed.name === 'あられ')
                continue;
        }
        if (stompMoveList.includes(pokemon.moveUsed.name)) {
            if (target.stateChange.minimize.isTrue === true)
                continue;
        }
        if (target.stateChange.telekinesis.isTrue === true) {
            if (oneShotMoveList.includes(pokemon.moveUsed.name) === false)
                continue;
        }
        if (pokemon.stateChange.lockOn.isTrue === true)
            continue;
        if (isAbility(pokemon, 'ノーガード') === true)
            continue;
        if (isAbility(target, 'ノーガード') === true)
            continue;
        if (pokemon.moveUsed.name === 'どくどく') {
            if (getPokemonType(pokemon).includes('どく'))
                continue;
        }
        // A = 技の命中率 × 命中補正値M × ランク補正 × ミクルのみ - なかよし度効果
        // 乱数0~99がA未満なら命中
        const random = getRandom();
        let accuracy = pokemon.moveUsed.accuracy;
        let corrM = 4096;
        let corrRank = 1;
        let diffRank = 0;
        let atkRank = pokemon.rank.accuracy;
        let defRank = target.rank.evasion;
        // 技の命中率
        if (isWeather(pokemon, 'にほんばれ') === true) {
            if (pokemon.moveUsed.name === 'かみなり')
                accuracy = 50;
            if (pokemon.moveUsed.name === 'ぼうふう')
                accuracy = 50;
        }
        if (isAbility(target, 'ミラクルスキン') === true) {
            if (pokemon.moveUsed.category === '変化') {
                accuracy = Math.min(accuracy, 50);
            }
        }
        if (oneShotMoveList.includes(pokemon.moveUsed.name)) {
            accuracy = accuracy + pokemon.status.level - target.status.level;
        }
        if (pokemon.moveUsed.name === 'ぜったいれいど' && getPokemonType(pokemon).includes('こおり') === false) {
            accuracy = 20 + pokemon.status.level - target.status.level;
        }
        // 一撃必殺技の場合、命中判定
        if (oneShotMoveList.includes(pokemon.moveUsed.name)) {
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
                if (isAbility(pokemon, 'はりきり') && pokemon.moveUsed.category === '物理') {
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
        if (pokemon.moveUsed.name === 'なかまづくり') {
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
        if (pokemon.moveUsed.name === 'いえき') {
            if (target.stateChange.noAbility.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.abilityInfo().noAbility === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'なりきり') {
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
        if (pokemon.moveUsed.name === 'シンプルビーム') {
            if (target.status.ability === 'たんじゅん') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.abilityInfo().overwrite === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'なやみのタネ') {
            if (target.status.abilityInfo().overwrite === 1) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'スキルスワップ') {
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
        if (pokemon.moveUsed.name === 'トリック' || pokemon.moveUsed.name === 'すりかえ') {
            if (pokemon.status.item === '' && target.status.item === '') {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'ふしょくガス') {
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
        if (pokemon.moveUsed.name === 'リサイクル') {
            if (pokemon.status.item !== '') {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'ギフトパス') {
            if (pokemon.status.item === '') {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.item !== '') {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // HPが満タンだったことによる無効化
        if (pokemon.moveUsed.name === 'いやしのはどう' || pokemon.moveUsed.name === 'フラワーヒール') {
            if (target.status.remainingHP === target.actualValue.hitPoint) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'いのちのしずく') {
            if (target.status.remainingHP === target.actualValue.hitPoint) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'ジャングルヒール') {
            if (target.status.remainingHP === target.actualValue.hitPoint && target.status.statusAilment === null) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'かふんだんご') {
            if (target.status.remainingHP === target.actualValue.hitPoint && pokemon.trainer === target.trainer) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'あさのひざし'
            || pokemon.moveUsed.name === 'かいふくしれい'
            || pokemon.moveUsed.name === 'こうごうせい'
            || pokemon.moveUsed.name === 'じこさいせい'
            || pokemon.moveUsed.name === 'すなあつめ'
            || pokemon.moveUsed.name === 'タマゴうみ'
            || pokemon.moveUsed.name === 'つきのひかり'
            || pokemon.moveUsed.name === 'なまける'
            || pokemon.moveUsed.name === 'はねやすめ'
            || pokemon.moveUsed.name === 'ミルクのみ') {
            if (pokemon.status.remainingHP === pokemon.actualValue.hitPoint) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // ステータスに関する無効化
        if (pokemon.moveUsed.name === 'はらだいこ') {
            if (pokemon.status.remainingHP <= pokemon.actualValue.hitPoint / 2) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (pokemon.rank.attack === 6) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'フラワーガード' || pokemon.moveUsed.name === 'たがやす') {
            if (getPokemonType(target).includes('くさ') === false) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'じばそうさ' || pokemon.moveUsed.name === 'アシストギア') {
            if (target.status.ability !== 'プラス' && target.status.ability !== 'マイナス') {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'ちからをすいとる') {
            if (target.rank.attack === -6) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'いばる') {
            if (target.rank.attack === 6 && target.stateChange.confuse.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'おだてる') {
            if (target.rank.specialAttack === 6 && target.stateChange.confuse.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'ひっくりかえす') {
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
        if (pokemon.moveUsed.name === 'タールショット') {
            if (target.rank.speed === -6 && target.stateChange.tarShot.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // タイプによる無効化
        if (pokemon.moveUsed.name === 'テクスチャー') {
            if (getPokemonType(pokemon).includes(pokemon.moveUsed.type) === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'ほごしょく') {
            if (fieldStatus.terrain.name === 'エレキフィールド' && getPokemonType(pokemon).includes('くさ')) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (fieldStatus.terrain.name === 'グラスフィールド' && getPokemonType(pokemon).includes('くさ')) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (fieldStatus.terrain.name === 'サイコフィールド' && getPokemonType(pokemon).includes('くさ')) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (fieldStatus.terrain.name === 'ミストフィールド' && getPokemonType(pokemon).includes('くさ')) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (fieldStatus.terrain.name === null && getPokemonType(pokemon).includes('ノーマル')) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'みずびたし') {
            const type = getPokemonType(target);
            if (type.length === 1 && type[0] === 'みず') {
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
        if (pokemon.moveUsed.name === 'まほうのこな') {
            const type = getPokemonType(target);
            if (type.length === 1 && type[0] === 'エスパー') {
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
        if (pokemon.moveUsed.name === 'ハロウィン') {
            if (getPokemonType(target).includes('ゴースト') === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'もりののろい') {
            if (getPokemonType(target).includes('くさ') === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
    }
    // 重複による無効化
    // 全体の場
    if (pokemon.moveUsed.name === 'にほんばれ') {
        if (fieldStatus.weather.name === 'にほんばれ') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'あまごい') {
        if (fieldStatus.weather.name === 'あめ') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'すなあらし') {
        if (fieldStatus.weather.name === 'すなあらし') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'あられ') {
        if (fieldStatus.weather.name === 'あられ') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'ゆきげしき') {
        if (fieldStatus.weather.name === 'ゆき') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'エレキフィールド') {
        if (fieldStatus.terrain.name === 'エレキフィールド') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'グラスフィールド') {
        if (fieldStatus.terrain.name === 'グラスフィールド') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'サイコフィールド') {
        if (fieldStatus.terrain.name === 'サイコフィールド') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'ミストフィールド') {
        if (fieldStatus.terrain.name === 'ミストフィールド') {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'じゅうりょく') {
        if (fieldStatus.whole.gravity.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'どろあそび') {
        if (fieldStatus.whole.mudSport.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'フェアリーロック') {
        if (fieldStatus.whole.fairyLock.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'プラズマシャワー') {
        if (fieldStatus.whole.ionDeluge.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'みずあそび') {
        if (fieldStatus.whole.waterSport.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    // 片側の場
    if (pokemon.moveUsed.name === 'オーロラベール') {
        if (fieldStatus.getSide(pokemon.trainer).auroraVeil.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'ひかりのかべ') {
        if (fieldStatus.getSide(pokemon.trainer).lightScreen.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'リフレクター') {
        if (fieldStatus.getSide(pokemon.trainer).reflect.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'たたみがえし') {
        if (fieldStatus.getSide(pokemon.trainer).matBlock.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'トリックガード') {
        if (fieldStatus.getSide(pokemon.trainer).craftyShield.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'ファストガード') {
        if (fieldStatus.getSide(pokemon.trainer).quickGuard.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'ワイドガード') {
        if (fieldStatus.getSide(pokemon.trainer).wideGuard.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'おいかぜ') {
        if (fieldStatus.getSide(pokemon.trainer).tailwind.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'おまじない') {
        if (fieldStatus.getSide(pokemon.trainer).luckyChant.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'しろいきり') {
        if (fieldStatus.getSide(pokemon.trainer).mist.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'しんぴのまもり') {
        if (fieldStatus.getSide(pokemon.trainer).safeguard.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'ステルスロック') {
        if (fieldStatus.getSide(getOpponentTrainer(pokemon.trainer)).stealthRock.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'どくびし') {
        if (fieldStatus.getSide(getOpponentTrainer(pokemon.trainer)).toxicSpikes.count === 2) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'ねばねばネット') {
        if (fieldStatus.getSide(getOpponentTrainer(pokemon.trainer)).stickyWeb.isTrue === true) {
            pokemon.damage[0].failure();
        }
    }
    if (pokemon.moveUsed.name === 'まきびし') {
        if (fieldStatus.getSide(getOpponentTrainer(pokemon.trainer)).spikes.count === 3) {
            pokemon.damage[0].failure();
        }
    }
    for (const damage of pokemon.damage) {
        const target = getPokemonByBattle(damage.trainer, damage.battle);
        if (target === false)
            continue;
        if (pokemon.moveUsed.name === 'アクアリング') {
            if (pokemon.stateChange.aquaRing.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'きあいだめ') {
            if (pokemon.stateChange.focusEnergy.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'ちょうはつ') {
            if (target.stateChange.taunt.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'でんじふゆう') {
            if (pokemon.stateChange.magnetRise.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'のろい' && getPokemonType(pokemon).includes('ゴースト')) {
            if (target.stateChange.curse.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'ロックオン' || pokemon.moveUsed.name === 'こころのめ') {
            if (pokemon.stateChange.lockOn.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'みがわり') {
            if (pokemon.stateChange.substitute.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (pokemon.status.remainingHP <= pokemon.actualValue.hitPoint / 4) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'へんしん') {
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
        if (pokemon.moveUsed.name === 'アンコール') {
            if (target.stateChange.dynamax.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.stateChange.encore.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'かなしばり') {
            if (target.stateChange.disable.isTrue === true) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        // 状態に関する無効化
        if (pokemon.moveUsed.name === 'にほんばれ'
            || pokemon.moveUsed.name === 'あまごい'
            || pokemon.moveUsed.name === 'すなあらし'
            || pokemon.moveUsed.name === 'あられ'
            || pokemon.moveUsed.name === 'ゆきげしき') {
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
        if (pokemon.moveUsed.name === 'サイコシフト') {
            if (pokemon.status.statusAilment.name === null) {
                target.status.declareInvalid(damage);
                continue;
            }
            if (target.status.statusAilment !== null) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'じょうか') {
            if (target.status.statusAilment === null) {
                target.status.declareInvalid(damage);
                continue;
            }
        }
        if (pokemon.moveUsed.name === 'リフレッシュ') {
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
    if (pokemon.moveUsed.target === 'ランダム1体') {
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
        if (pokemon.moveUsed.target === '全体の場' || pokemon.moveUsed.target === '味方の場' || pokemon.moveUsed.target === '相手の場') {
            const damage = new Damage;
            pokemon.damage.push(damage);
        }
        else if (pokemon.moveUsed.target === '自分' || pokemon.moveUsed.target === '味方1体' || pokemon.moveUsed.target === '自分か味方' || pokemon.moveUsed.target === '味方全体') {
            // 自分
            const damage = setTargetInfo(pokemon.trainer, 0);
            pokemon.damage.push(damage);
        }
        else if (pokemon.moveUsed.target === '1体選択' || pokemon.moveUsed.target === 'ランダム1体' || pokemon.moveUsed.target === '相手全体' || pokemon.moveUsed.target === '自分以外') {
            // 相手
            const damage = setTargetInfo(getOpponentTrainer(pokemon.trainer), 0);
            pokemon.damage.push(damage);
        }
        else if (pokemon.moveUsed.target === '全体') {
            // 自分
            const damage1 = setTargetInfo(pokemon.trainer, 0);
            pokemon.damage.push(damage1);
            // 相手
            const damage2 = setTargetInfo(getOpponentTrainer(pokemon.trainer), 0);
            pokemon.damage.push(damage2);
        }
        else if (pokemon.moveUsed.target === '不定') {
        }
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
    const atkType = pokemon.moveUsed.type;
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
                if (pokemon.moveUsed.name === 'フリーズドライ' && type === 'みず') {
                    rate = 2.0;
                }
                result = result * rate;
            }
        }
    }
    if (pokemon.moveUsed.name === 'フライングプレス') {
        for (const record of typeCompatibility) {
            if (record.attackType === 'ひこう') {
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
    if (target.stateChange.tarShot.isTrue === true && atkType === 'ほのお') {
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
