"use strict";
// 状態異常変化
function giveAilment(pokemon, target, ailment, isOtherMsg) {
    if (ailment === null)
        return false;
    // すでに状態異常
    if (target.status.statusAilment.name !== null)
        return false;
    // しんぴのまもり
    if (fieldStatus.getSide(target.trainer).safeguard.isTrue === true) {
        if (isAbility(pokemon, 'すりぬけ') === false || pokemon.trainer === target.trainer)
            return false;
    }
    // ミストフィールド
    if (fieldStatus.terrain.name === 'ミストフィールド') {
        if (isGrounded(target) === true)
            return false;
    }
    // 特性
    if (isAbility(target, 'りんぷん') === true)
        return false;
    if (isAbility(target, 'きよめのしお') === true)
        return false;
    if (isAbility(target, 'ぜったいねむり') === true)
        return false;
    if (isAbility(target, 'リーフガード') === true && isWeather(target, 'にほんばれ'))
        return false;
    if (isAbility(target, 'リミットシールド') === true && target.status.name === 'メテノ(流星)')
        return false;
    if (isExistAbilityOneSide(target.trainer, 'フラワーベール') && getPokemonType(target).includes('くさ'))
        return false;
    // 個別の無効化
    if (ailment === 'まひ') {
        if (getPokemonType(target).includes('でんき'))
            return false;
    }
    if (ailment === 'こおり') {
        if (getPokemonType(target).includes('こおり'))
            return false;
        if (isWeather(target, 'にほんばれ'))
            return false;
        if (isAbility(target, 'マグマのよろい'))
            return false;
    }
    if (ailment === 'やけど') {
        if (getPokemonType(target).includes('ほのお'))
            return false;
        if (isAbility(target, 'みずのベール'))
            return false;
        if (isAbility(target, 'すいほう'))
            return false;
    }
    if (ailment === 'どく' || ailment === 'もうどく') {
        if (isAbility(target, 'めんえき'))
            return false;
        if (isExistAbilityOneSide(target.trainer, 'パステルベール'))
            return false;
        if (getPokemonType(target).includes('どく'))
            return false;
        if (getPokemonType(target).includes('はがね'))
            return false;
    }
    if (ailment === 'ねむり') {
        if (isAbility(target, 'やるき'))
            return false;
        if (isAbility(target, 'ふみん'))
            return false;
        if (isExistAbilityOneSide(target.trainer, 'スイートベール'))
            return false;
        if (fieldStatus.terrain.name === 'エレキフィールド' && isGrounded(target))
            return false;
        for (const _pokemon of allPokemonInBattlefield()) {
            if (_pokemon.stateChange.uproar.isTrue === true)
                return false;
        }
    }
    // 状態異常になる
    target.status.statusAilment.name = ailment;
    // シンクロ用
    if (isAbility(target, 'シンクロ') === true) {
        target.stateChange.synchronize.isTrue = true;
        target.stateChange.synchronize.text = ailment;
    }
    // 特殊メッセージ
    if (isOtherMsg === true) {
        return true;
    }
    // メッセージ
    if (ailment === 'まひ') {
        writeLog(`${getArticle(target)}は まひして 技が でにくくなった!`);
    }
    if (ailment === 'こおり') {
        writeLog(`${getArticle(target)}は 凍りついた!`);
    }
    if (ailment === 'やけど') {
        writeLog(`${getArticle(target)}は やけどを 負った!`);
    }
    if (ailment === 'どく') {
        writeLog(`${getArticle(target)}は 毒を あびた!`);
    }
    if (ailment === 'もうどく') {
        writeLog(`${getArticle(target)}は 猛毒を あびた!`);
    }
    if (ailment === 'ねむり') {
        writeLog(`${getArticle(target)}は 眠ってしまった!`);
    }
    return false;
}
// くちばしキャノンによるやけど
function giveAilmentByBeakBlast(pokemon, target) {
    // すでに状態異常
    if (target.status.statusAilment.name !== null)
        return;
    // しんぴのまもり
    if (fieldStatus.getSide(target.trainer).safeguard.isTrue === true) {
        if (isAbility(pokemon, 'すりぬけ') === false || pokemon.trainer === target.trainer)
            return;
    }
    // ミストフィールド
    if (fieldStatus.terrain.name === 'ミストフィールド') {
        if (isGrounded(target) === true)
            return;
    }
    // 特性
    if (isAbility(target, 'りんぷん') === true)
        return;
    if (isAbility(target, 'きよめのしお') === true)
        return;
    if (isAbility(target, 'ぜったいねむり') === true)
        return;
    if (isAbility(target, 'リーフガード') === true && isWeather(target, 'にほんばれ'))
        return;
    if (isAbility(target, 'リミットシールド') === true && target.status.name === 'メテノ(流星)')
        return;
    if (isExistAbilityOneSide(target.trainer, 'フラワーベール') && getPokemonType(target).includes('くさ'))
        return;
    if (getPokemonType(target).includes('ほのお'))
        return;
    if (isAbility(target, 'みずのベール'))
        return;
    if (isAbility(target, 'すいほう'))
        return;
    // 状態異常になる
    target.status.statusAilment.name = 'やけど';
    // メッセージ
    writeLog(`${getArticle(target)}は やけどを 負った!`);
}
// こんらん
function giveConfuse(pokemon, target, type) {
    if (pokemon.stateChange.confuse.isTrue === true)
        return;
    // 追加効果で状態異常になる場合
    if (type === 'additional') {
        // しんぴのまもり
        if (fieldStatus.getSide(target.trainer).safeguard.isTrue === true) {
            if (isAbility(pokemon, 'すりぬけ') === false || pokemon.trainer === target.trainer)
                return;
        }
        // ミストフィールド
        if (fieldStatus.terrain.name === 'ミストフィールド') {
            if (isGrounded(target) === true)
                return;
        }
        // 特性
        if (isAbility(target, 'マイペース'))
            return;
    }
    // アイテムによる
    if (type === 'item') {
        // ミストフィールド
        if (fieldStatus.terrain.name === 'ミストフィールド') {
            if (isGrounded(target) === true)
                return;
        }
        // 特性
        if (isAbility(target, 'マイペース'))
            return;
    }
    // こんらん状態になる
    const turn = Math.floor(getRandom() * 0.04) + 2; // 2,3,4,5のいずれか
    target.stateChange.confuse.isTrue = true;
    target.stateChange.confuse.turn = turn;
    // メッセージ
    writeLog(`${getArticle(target)}は 混乱した!`);
}
function giveConfuseByItem(pokemon, item) {
    if (item === 'フィラのみ') {
        for (const nature of natureData) {
            if (nature.name === pokemon.status.nature && nature.minus === 'attack') {
                giveConfuse(pokemon, pokemon, 'item');
            }
        }
    }
    if (item === 'ウイのみ') {
        for (const nature of natureData) {
            if (nature.name === pokemon.status.nature && nature.minus === 'specialAttack') {
                giveConfuse(pokemon, pokemon, 'item');
            }
        }
    }
    if (item === 'マゴのみ') {
        for (const nature of natureData) {
            if (nature.name === pokemon.status.nature && nature.minus === 'speed') {
                giveConfuse(pokemon, pokemon, 'item');
            }
        }
    }
    if (item === 'バンジのみ') {
        for (const nature of natureData) {
            if (nature.name === pokemon.status.nature && nature.minus === 'specialDefense') {
                giveConfuse(pokemon, pokemon, 'item');
            }
        }
    }
    if (item === 'イアのみ') {
        for (const nature of natureData) {
            if (nature.name === pokemon.status.nature && nature.minus === 'defense') {
                giveConfuse(pokemon, pokemon, 'item');
            }
        }
    }
}
// こんらんの回復
function cureConfuseByItem(pokemon, item) {
    if (pokemon.stateChange.confuse.isTrue === false)
        return;
    pokemon.stateChange.confuse.reset();
    writeLog(`${getArticle(pokemon)}は ${item}で 混乱が 治った!`);
    // なげつける
    pokemon.stateChange.memo.isTrue = true;
}
// きのみによる回復
function cureAilmentByItem(pokemon, ailment, item) {
    if (item === 'ラムのみ') {
        if (pokemon.status.statusAilment.name === null) {
            return;
        }
    }
    else {
        if (ailment !== pokemon.status.statusAilment.name) {
            return;
        }
    }
    // 状態異常回復
    pokemon.status.statusAilment.name = null;
    pokemon.status.statusAilment.turn = 0;
    // メッセージ
    if (ailment === 'まひ') {
        writeLog(`${getArticle(pokemon)}は ${item}で まひが 治った!`);
    }
    if (ailment === 'ねむり') {
        writeLog(`${getArticle(pokemon)}は ${item}で 目を 覚ました!`);
    }
    if (ailment === 'どく' || ailment === 'もうどく') {
        writeLog(`${getArticle(pokemon)}は ${item}で 毒が 治った!`);
    }
    if (ailment === 'やけど') {
        writeLog(`${getArticle(pokemon)}は ${item}で やけどが 治った!`);
    }
    if (ailment === 'こおり') {
        writeLog(`${getArticle(pokemon)}は ${item}で こおり状態が 治った!`);
    }
    // なげつける・むしくい・ついばむ
    if (pokemon.stateChange.memo.isTrue === true) {
        pokemon.stateChange.memo.count += 1;
    }
}
function cureAilment(pokemon, ailment) {
    if (pokemon.status.statusAilment.name !== ailment)
        return;
    // 状態異常回復
    pokemon.status.statusAilment.name = null;
    pokemon.status.statusAilment.turn = 0;
    // メッセージ
    if (ailment === 'まひ') {
        writeLog(`${getArticle(pokemon)}は まひが 治った!`);
    }
    if (ailment === 'ねむり') {
        writeLog(`${getArticle(pokemon)}は 目を 覚ました!`);
    }
    if (ailment === 'どく' || ailment === 'もうどく') {
        writeLog(`${getArticle(pokemon)}は 毒が 治った!`);
    }
    if (ailment === 'やけど') {
        writeLog(`${getArticle(pokemon)}は やけどが 治った!`);
    }
    if (ailment === 'こおり') {
        writeLog(`${getArticle(pokemon)}は こおり状態が 治った!`);
    }
}
