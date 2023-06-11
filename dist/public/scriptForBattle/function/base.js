"use strict";
// 持ち物
function isItem(pokemon, item) {
    if (pokemon.status.item !== item) {
        return false;
    }
    return true;
}
// 特性
function isAbility(pokemon, ability) {
    if (pokemon.status.ability !== ability) {
        return false;
    }
    return true;
}
// 状態異常
function isStatusAilment(pokemon, statusAilment) {
    if (pokemon.status.statusAilment.name === statusAilment) {
        return true;
    }
    if (statusAilment === 'どく') {
        if (pokemon.status.statusAilment.name === 'もうどく') {
            return true;
        }
    }
    return false;
}
// ランク補正
function getValueWithRankCorrection(actualValue, rank, critical) {
    let thisRank = rank;
    let rankCorr = 1;
    if (critical === true) {
        thisRank = Math.max(thisRank, 0);
    }
    if (thisRank > 0) {
        rankCorr = (2 + thisRank) / 2;
    }
    else {
        rankCorr = 2 / (2 - thisRank);
    }
    return Math.floor(actualValue * rankCorr);
}
// 天気
function isWeather(pokemon, weather) {
    for (const pokemon of allPokemonInBattlefield()) {
        if (isAbility(pokemon, 'エアロック') === true) {
            return false;
        }
        if (isAbility(pokemon, 'ノーてんき') === true) {
            return false;
        }
    }
    if (weather === 'あめ' || weather === 'おおあめ' || weather === 'にほんばれ' || weather === 'おおひでり') {
        if (isItem(pokemon, 'ばんのうがさ') === true) {
            return false;
        }
    }
    if (fieldStatus.weather.name === weather) {
        return true;
    }
    if (weather === 'あめ') {
        if (fieldStatus.weather.name === 'おおあめ') {
            return true;
        }
    }
    if (weather === 'にほんばれ') {
        if (fieldStatus.weather.name === 'おおひでり') {
            return true;
        }
    }
    return false;
}
// 接地判定
function isGrounded(pokemon) {
    return true;
    /*
    // 姿を隠しているポケモンは、地面にいない
    if ( poke.myCondition.myHide ) return false
  
    // 以下の状態のポケモンは、地面にいる
    if ( poke.myCondition.myIngrain ) return true
    if ( poke.myCondition.mySmack_down ) return true
    if ( fieldStatus.myGravity > 0 ) return true
    if ( poke.myItem == "くろいてっきゅう" && isItem(poke) ) return true
  
    // 以下の状態のポケモンは、地面にいない
    if ( poke.myType.includes("ひこう") ) return false
    if ( poke.myAbility == "ふゆう" && isAbility(poke) ) return false
    if ( poke.myItem == "ふうせん" && isItem(poke) ) return false
    if ( poke.myCondition.myMagnet_rise > 0 ) return false
    if ( poke.myCondition.myTelekinesis > 0 ) return false
  
    // それ以外のポケモンは、地面にいる
    return true
    */
}
// ポケモンのタイプ
function getPokemonType(pokemon) {
    let result = [];
    if (pokemon.status.type1 !== null) {
        result.push(pokemon.status.type1);
    }
    if (pokemon.status.type2 !== null) {
        result.push(pokemon.status.type2);
    }
    if (result.length === 0) {
        result.push(null);
    }
    return result;
}
// バトル場の特性存在判定
function isExistAbility(ability) {
    for (const pokemon of allPokemonInBattlefield()) {
        if (isAbility(pokemon, ability) === true) {
            return true;
        }
    }
    return false;
}
// 片側の場の特性存在判定
function isExistAbilityOneSide(trainer, ability) {
    for (const pokemon of allPokemonInSide(trainer)) {
        if (isAbility(pokemon, ability) === true) {
            return true;
        }
    }
    return false;
}
// みがわり
function isSubstitute(pokemon, target) {
    if (target.stateChange.substitute.isTrue === false)
        return false;
    if (pokemon.moveUsed.name === 'いじげんホール')
        return false;
    if (pokemon.moveUsed.name === 'いじげんラッシュ')
        return false;
    if (pokemon.moveUsed.name === 'シャドースチール')
        return false;
    if (pokemon.moveUsed.category === '変化') {
        if (pokemon.moveUsed.target === '全体の場')
            return false;
        if (pokemon.moveUsed.target === '相手の場')
            return false;
        if (pokemon.moveUsed.target === '味方の場')
            return false;
    }
    if (isSame(pokemon, target))
        return false;
    if (isAbility(pokemon, 'すりぬけ') === true) {
        if (pokemon.moveUsed.name === 'へんしん' || pokemon.moveUsed.name === 'フリーフォール') {
            ;
        }
        else {
            return false;
        }
    }
    if (soundMoveList.includes(pokemon.moveUsed.name) === true) {
        if (pokemon.moveUsed.name === 'とおぼえ' && isFriend(pokemon, target)) {
            ;
        }
        else {
            return false;
        }
    }
    return true;
}
// 姿を隠す
function isHide(pokemon) {
    if (pokemon.stateChange.fly.isTrue === true)
        return true;
    if (pokemon.stateChange.dig.isTrue === true)
        return true;
    if (pokemon.stateChange.dive.isTrue === true)
        return true;
    if (pokemon.stateChange.shadowForce.isTrue === true)
        return true;
    return false;
}
// 直接攻撃
function isDirect(pokemon) {
    if (pokemon.moveUsed.isDirect === false) {
        return false;
    }
    if (isAbility(pokemon, 'えんかく') === true) {
        return false;
    }
    return true;
}
// リサイクル
function recycleAvailable(pokemon) {
    if (pokemon.status.item === null)
        return;
    const item = pokemon.status.item;
    pokemon.status.item = null;
    if (pokemon.stateChange.recycle.isTrue === true)
        return;
    pokemon.stateChange.recycle.isTrue = true;
    pokemon.stateChange.recycle.text = item;
}
// ランク変化
function changeTargetRank(pokemon, target, parameter, change) {
    let value = getRankVariation(target, parameter, change);
    const parameterJP = translateENintoJP(parameter);
    if (value === 0)
        return;
    if (value < 0) {
        // しろいきり
        mist: if (fieldStatus.getSide(target.trainer).mist.isTrue === true) {
            if (pokemon.stateChange.memo.text === 'わたげ') {
                const infiltrator = getPokemonByBattle(pokemon.stateChange.memo.target.trainer, pokemon.stateChange.memo.target.battle);
                if (infiltrator === false)
                    break mist;
                if (isAbility(infiltrator, 'すりぬけ') === true && infiltrator.trainer !== target.trainer) {
                    return;
                }
            }
            else {
                if (isAbility(pokemon, 'すりぬけ') === true && pokemon.trainer !== target.trainer) {
                    return;
                }
            }
        }
        // 特性
        if (isAbility(target, 'しろいけむり') === true)
            return;
        if (isAbility(target, 'クリアボディ') === true)
            return;
        if (isAbility(target, 'メタルプロテクト') === true)
            return;
        if (isExistAbilityOneSide(target.trainer, 'フラワーベール') && getPokemonType(target).includes('くさ'))
            return;
        if (isAbility(target, 'ミラーアーマー')) {
            changeTargetRank(target, pokemon, parameter, change);
            return;
        }
        // 個別のパラメーター
        if (parameter === 'attack') {
            if (isAbility(target, 'かいりきバサミ'))
                return;
        }
        if (parameter === 'defense') {
            if (isAbility(target, 'はとむね'))
                return;
        }
        if (parameter === 'accuracy') {
            if (isAbility(target, 'するどいめ'))
                return;
        }
    }
    // ランク変化
    target.rank[parameter] += value;
    // メッセージ
    if (value >= 3)
        writeLog(`${getArticle(target)}の ${parameterJP}が ぐぐーんと上がった!`);
    if (value === 2)
        writeLog(`${getArticle(target)}の ${parameterJP}が ぐーんと上がった!`);
    if (value === 1)
        writeLog(`${getArticle(target)}の ${parameterJP}が 上がった!`);
    if (value === -1)
        writeLog(`${getArticle(target)}の ${parameterJP}が 下がった!`);
    if (value === -2)
        writeLog(`${getArticle(target)}の ${parameterJP}が がくっと下がった!`);
    if (value <= -3)
        writeLog(`${getArticle(target)}の ${parameterJP}が がくーんと下がった!`);
    // まけんき・かちき
    if (value < 0) {
        if (isAbility(target, 'まけんき') === true) {
            changeMyRank(target, 'attack', 2);
        }
        if (isAbility(target, 'かちき') === true) {
            changeMyRank(target, 'specialAttack', 2);
        }
    }
}
function changeMyRank(pokemon, parameter, change) {
    let value = getRankVariation(pokemon, parameter, change);
    const parameterJP = translateENintoJP(parameter);
    if (value === 0)
        return;
    // ランク変化
    pokemon.rank[parameter] += value;
    // メッセージ
    if (value >= 3)
        writeLog(`${getArticle(pokemon)}の ${parameterJP}が ぐぐーんと上がった!`);
    if (value === 2)
        writeLog(`${getArticle(pokemon)}の ${parameterJP}が ぐーんと上がった!`);
    if (value === 1)
        writeLog(`${getArticle(pokemon)}の ${parameterJP}が 上がった!`);
    if (value === -1)
        writeLog(`${getArticle(pokemon)}の ${parameterJP}が 下がった!`);
    if (value === -2)
        writeLog(`${getArticle(pokemon)}の ${parameterJP}が がくっと下がった!`);
    if (value <= -3)
        writeLog(`${getArticle(pokemon)}の ${parameterJP}が がくーんと下がった!`);
}
function changeMyRankByItem(pokemon, parameter, change, item) {
    let value = getRankVariation(pokemon, parameter, change);
    const parameterJP = translateENintoJP(parameter);
    if (value === 0)
        return;
    // ランク変化
    pokemon.rank[parameter] += value;
    // メッセージ
    if (value >= 3)
        writeLog(`${getArticle(pokemon)}は ${item}で ${parameterJP}が ぐぐーんと上がった!`);
    if (value === 2)
        writeLog(`${getArticle(pokemon)}は ${item}で ${parameterJP}が ぐーんと上がった!`);
    if (value === 1)
        writeLog(`${getArticle(pokemon)}は ${item}で ${parameterJP}が 上がった!`);
    if (value === -1)
        writeLog(`${getArticle(pokemon)}は ${item}で ${parameterJP}が 下がった!`);
    if (value === -2)
        writeLog(`${getArticle(pokemon)}は ${item}で ${parameterJP}が がくっと下がった!`);
    if (value <= -3)
        writeLog(`${getArticle(pokemon)}は ${item}で ${parameterJP}が がくーんと下がった!`);
}
function changeMyRankByRage(pokemon, parameter, change) {
    let value = getRankVariation(pokemon, parameter, change);
    if (value === 0)
        return;
    // ランク変化
    pokemon.rank[parameter] += value;
    // メッセージ
    writeLog(`${pokemon}の いかりのボルテージが 上がっていく!`);
}
function getRankVariation(pokemon, parameter, value) {
    let result = 0;
    if (isAbility(pokemon, 'たんじゅん') === true) {
        result = value * 2;
    }
    if (isAbility(pokemon, 'あまのじゃく') === true) {
        result = 0 - value;
    }
    if (result > 0) {
        result = Math.min(result, 6 - pokemon.rank[parameter]);
    }
    if (result < 0) {
        result = -1 * Math.min(Math.abs(result), 6 + pokemon.rank[parameter]);
    }
    return result;
}
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
}
// HP変化
function changeHPByMove(pokemon, target, change) {
    let value = change;
    if (isItem(pokemon, 'おおきなねっこ') === true) {
        value = fiveRoundEntry(value * 5324 / 4096);
    }
    if (isAbility(target, 'ヘドロえき') === true) {
        if (isAbility(pokemon, 'マジックガード') === true)
            return;
        // HP減少
        pokemon.status.remainingHP = Math.max(pokemon.status.remainingHP - value, 0);
        // メッセージ
        target.status.declareAbility();
        writeLog(`${getArticle(pokemon)}は ヘドロえきを 吸い取った!`);
    }
    else {
        if (pokemon.status.remainingHP === pokemon.actualValue.hitPoint)
            return;
        if (pokemon.stateChange.healBlock.isTrue === true)
            return;
        // HP回復
        pokemon.status.remainingHP = Math.min(pokemon.status.remainingHP + value, pokemon.actualValue.hitPoint);
        // メッセージ
        writeLog(`${getArticle(target)}から 体力を 吸い取った!`);
    }
}
// HP変化
function changeHPByItem(pokemon, item) {
    if (pokemon.status.remainingHP === pokemon.actualValue.hitPoint)
        return;
    if (pokemon.stateChange.healBlock.isTrue === true)
        return;
    const ripen = (isAbility(pokemon, 'じゅくせい')) ? 2 : 1;
    const dynamax = (pokemon.stateChange.dynamax.isTrue) ? 0.5 : 1;
    let value = 0;
    if (item === 'オレンのみ') {
        value = 10 * ripen;
    }
    if (item === 'オボンのみ') {
        value = Math.floor((pokemon.actualValue.hitPoint * dynamax) / 4) * ripen;
    }
    if (item === 'フィラのみ' || item === 'ウイのみ' || item === 'マゴのみ' || item === 'バンジのみ' || item === 'イアのみ') {
        value = Math.floor((pokemon.actualValue.hitPoint * dynamax) / 3) * ripen;
    }
    // HP回復
    pokemon.status.remainingHP = Math.min(pokemon.status.remainingHP + value, pokemon.actualValue.hitPoint);
    // メッセージ
    writeLog(`${getArticle(pokemon)}は ${item}で 体力を 回復した!`);
}
// HP変化
function changeHPByAbility(pokemon, value, sign) {
    if (sign === '-') {
        // ダメージ
        pokemon.status.remainingHP = Math.max(pokemon.status.remainingHP - value, 0);
    }
}
// きのみを食べる
function eatBerry(pokemon, berry) {
    const ripen = (isAbility(pokemon, 'じゅくせい')) ? 2 : 1;
    if (berry === 'クラボのみ') {
        pokemon.status.statusAilment.cureByItem(pokemon, 'まひ', berry);
    }
    if (berry === 'カゴのみ') {
        pokemon.status.statusAilment.cureByItem(pokemon, 'ねむり', berry);
    }
    if (berry === 'モモンのみ') {
        pokemon.status.statusAilment.cureByItem(pokemon, 'どく', berry);
        pokemon.status.statusAilment.cureByItem(pokemon, 'もうどく', berry);
    }
    if (berry === 'チーゴのみ') {
        pokemon.status.statusAilment.cureByItem(pokemon, 'やけど', berry);
    }
    if (berry === 'ナナシのみ') {
        pokemon.status.statusAilment.cureByItem(pokemon, 'こおり', berry);
    }
    if (berry === 'ヒメリのみ') {
        for (let i = 0; i < 4; i++) {
            if (pokemon.move[i].remainingPP < pokemon.move[i].powerPoint) {
                pokemon.move[i].curePPByLeppaBerry(pokemon, 10 * ripen);
                break;
            }
        }
    }
    if (berry === 'オレンのみ') {
        changeHPByItem(pokemon, berry);
    }
    if (berry === 'キーのみ') {
        cureConfuseByItem(pokemon, berry);
    }
    if (berry === 'ラムのみ') {
        pokemon.status.statusAilment.cureByItem(pokemon, null, berry);
        cureConfuseByItem(pokemon, berry);
    }
    if (berry === 'オボンのみ') {
        changeHPByItem(pokemon, berry);
    }
    if (berry === 'フィラのみ') {
        changeHPByItem(pokemon, berry);
        giveConfuseByItem(pokemon, berry);
    }
    if (berry === 'ウイのみ') {
        changeHPByItem(pokemon, berry);
        giveConfuseByItem(pokemon, berry);
    }
    if (berry === 'マゴのみ') {
        changeHPByItem(pokemon, berry);
        giveConfuseByItem(pokemon, berry);
    }
    if (berry === 'バンジのみ') {
        changeHPByItem(pokemon, berry);
        giveConfuseByItem(pokemon, berry);
    }
    if (berry === 'イアのみ') {
        changeHPByItem(pokemon, berry);
        giveConfuseByItem(pokemon, berry);
    }
    if (berry === 'チイラのみ') {
        changeMyRankByItem(pokemon, 'attack', 1 * ripen, berry);
    }
    if (berry === 'リュガのみ') {
        changeMyRankByItem(pokemon, 'defense', 1 * ripen, berry);
    }
    if (berry === 'カムラのみ') {
        changeMyRankByItem(pokemon, 'speed', 1 * ripen, berry);
    }
    if (berry === 'ヤタピのみ') {
        changeMyRankByItem(pokemon, 'specialAttack', 1 * ripen, berry);
    }
    if (berry === 'ズアのみ') {
        changeMyRankByItem(pokemon, 'specialDefense', 1 * ripen, berry);
    }
    if (berry === 'サンのみ') {
        if (pokemon.stateChange.focusEnergy.isTrue === false) {
            pokemon.stateChange.focusEnergy.isTrue = true;
            writeLog(`${getArticle(pokemon)}は サンのみを 使って 張り切り出した!`);
        }
    }
    if (berry === 'スターのみ') {
        const targetParameter = [];
        for (const parameter of Object.keys(pokemon.rank)) {
            if (parameter === 'accuracy')
                continue;
            if (parameter === 'evasion')
                continue;
            if (pokemon.rank[parameter] < 6) {
                targetParameter.push(parameter);
            }
        }
        if (targetParameter.length > 0) {
            const index = Math.floor(getRandom() * targetParameter.length / 100);
            changeMyRankByItem(pokemon, targetParameter[index], 2 * ripen, berry);
        }
    }
    if (berry === 'ミクルのみ') {
        if (pokemon.stateChange.micleBerry.isTrue === false) {
            pokemon.stateChange.micleBerry.isTrue = true;
            writeLog(`${getArticle(pokemon)}は ミクルのみで 次にくりだす 技が 当たりやすくなった!`);
        }
    }
    if (berry === 'アッキのみ') {
        changeMyRankByItem(pokemon, 'defense', 1 * ripen, berry);
    }
    if (berry === 'タラプのみ') {
        changeMyRankByItem(pokemon, 'specialDefense', 1 * ripen, berry);
    }
}
// メロメロ
function attractTarget(pokemon, target, type) {
    if (pokemon.status.gender === '-')
        return;
    if (target.status.gender === '-')
        return;
    if (pokemon.status.gender === target.status.gender)
        return;
    if (pokemon.trainer === target.trainer)
        return;
    if (target.stateChange.attract.isTrue === true)
        return;
    if (isAbility(target, 'どんかん') === true)
        return;
    if (isExistAbilityOneSide(target.trainer, 'アロマベール') === true)
        return;
    // メロメロ状態にする
    target.stateChange.attract.isTrue = true;
    if (pokemon.order.battle !== null) {
        target.stateChange.attract.target = setTargetInfo(pokemon.trainer, pokemon.order.battle);
    }
    // メッセージ
    // if ( type === 'メロメロ' )
    if (type === 'メロメロボディ')
        pokemon.status.declareAbility();
    // if ( type === 'あかいいと' )
    // if ( type === 'キョダイホーヨー' )
    writeLog(`${getArticle(target)}は メロメロに なった!`);
    if (isItem(target, 'あかいいと') === true) {
        attractTarget(target, pokemon, 'あかいいと');
    }
}
// 天気変化
function changeWeather(pokemon, weather) {
    if (isChangableWeather(weather) === false)
        return;
    fieldStatus.weather.reset();
    fieldStatus.weather.name = weather;
    if (weather === 'おおあめ')
        writeLog(`強い雨が 降り始めた!`);
    if (weather === 'おおひでり')
        writeLog(`日差しが とても強くなった!`);
    if (weather === 'らんきりゅう')
        writeLog(`謎の乱気流が ひこうポケモンを 護る!`);
    if (weather === 'あめ') {
        if (isItem(pokemon, 'しめったいわ') === true) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        else {
            fieldStatus.weather.turn = 5;
            fieldStatus.weather.extend = false;
        }
        writeLog(`雨が 降り始めた!`);
    }
    if (weather === 'にほんばれ') {
        if (isItem(pokemon, 'あついいわ') === true) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        else {
            fieldStatus.weather.turn = 5;
            fieldStatus.weather.extend = false;
        }
        writeLog(`日差しが 強くなった!`);
    }
    if (weather === 'すなあらし') {
        if (isItem(pokemon, 'さらさらいわ') === true) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        else {
            fieldStatus.weather.turn = 5;
            fieldStatus.weather.extend = false;
        }
        writeLog(`砂あらしが 吹き始めた!`);
    }
    if (weather === 'あられ') {
        if (isItem(pokemon, 'つめたいいわ') === true) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        else {
            fieldStatus.weather.turn = 5;
            fieldStatus.weather.extend = false;
        }
        writeLog(`あられが 降り始めた!`);
    }
    if (weather === 'ゆき') {
        if (isItem(pokemon, 'つめたいいわ') === true) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        else {
            fieldStatus.weather.turn = 5;
            fieldStatus.weather.extend = false;
        }
        writeLog(`雪が 降り始めた!`);
    }
}
function isChangableWeather(weather) {
    if (fieldStatus.weather.name === weather)
        return false;
    if (fieldStatus.weather.name === 'おおあめ' || fieldStatus.weather.name === 'おおひでり' || fieldStatus.weather.name === 'らんきりゅう') {
        if (weather === 'あめ')
            return false;
        if (weather === 'にほんばれ')
            return false;
        if (weather === 'すなあらし')
            return false;
        if (weather === 'あられ')
            return false;
        if (weather === 'ゆき')
            return false;
    }
    return true;
}
// フィールド変化
function changeTerrain(pokemon, terrain) {
    if (isChangableTerrain(terrain) === false)
        return;
    fieldStatus.weather.reset();
    fieldStatus.terrain.name = terrain;
    if (isItem(pokemon, 'グランドコート') === true) {
        fieldStatus.terrain.turn = 8;
        fieldStatus.terrain.extend = true;
    }
    else {
        fieldStatus.terrain.turn = 5;
        fieldStatus.terrain.extend = false;
    }
    if (terrain === 'エレキフィールド')
        writeLog(`足元に 電気が かけめぐる!`);
    if (terrain === 'グラスフィールド')
        writeLog(`足元に 草がおいしげった!`);
    if (terrain === 'サイコフィールド')
        writeLog(`足元が 不思議な感じに なった!`);
    if (terrain === 'ミストフィールド')
        writeLog(`足元に 霧が立ち込めた!`);
}
function isChangableTerrain(terrain) {
    if (fieldStatus.terrain.name === terrain)
        return false;
    return true;
}
// フォルムチェンジ
function formChange(pokemon) {
    let nextFrom = '';
    if (pokemon.status.name === 'ウッウ(鵜呑み)')
        nextFrom = 'ウッウ';
    if (pokemon.status.name === 'ウッウ(丸呑み)')
        nextFrom = 'ウッウ';
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
    const nextPokemon = getPokemonDataByName(nextFrom);
    const nature = getNatureDataByName(pokemon.status.nature);
    if (nextPokemon === false) {
        return;
    }
    // 基本ステータスの更新
    pokemon.status.number = nextPokemon.number;
    pokemon.status.name = nextPokemon.name;
    pokemon.status.type1 = nextPokemon.type1;
    pokemon.status.type2 = nextPokemon.type2;
    pokemon.status.ability = nextPokemon.ability1;
    pokemon.status.height = nextPokemon.height;
    pokemon.status.weight = nextPokemon.weight;
    pokemon.statusOrg = pokemon.status;
    // 実数値の更新
    for (const parameter of Object.keys(parameterFive)) {
        const nextBaseStatus = getBaseStatusList(nextPokemon);
        const baseStatus = pokemon.baseStatus[parameter];
        const individualValue = pokemon.individualValue[parameter];
        const effortValue = pokemon.effortValue[parameter];
        // 実数値計算
        const step1 = baseStatus * 2 + individualValue + Math.floor(effortValue / 4);
        const step2 = step1 * pokemon.status.level;
        const step3 = Math.floor(step2 / 100);
        // 性格補正
        let natureRate = 1.0;
        if (nature.plus === nature.minus) {
            natureRate = 1.0;
        }
        else if (nature.plus === parameter) {
            natureRate = 1.1;
        }
        else if (nature.minus === parameter) {
            natureRate = 0.9;
        }
        // 種族値・実数値の更新
        pokemon.baseStatus[parameter] = nextBaseStatus[parameter];
        pokemon.actualValue[parameter] = Math.floor((step3 + 5) * natureRate);
    }
}
