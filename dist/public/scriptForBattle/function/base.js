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
// みがわり
function isSubstitute(pokemon, target) {
    if (target.stateChange.substitute.isTrue === false)
        return false;
    if (pokemon.moveUsed.name === 'いじげんホール' || pokemon.moveUsed.name === 'いじげんラッシュ' || pokemon.moveUsed.name === 'シャドースチール')
        return false;
    if (pokemon.moveUsed.target === '全体の場' || pokemon.moveUsed.target === '相手の場' || pokemon.moveUsed.target === '味方の場')
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
        if (pokemon.moveUsed.name === 'とおぼえ' && pokemon.trainer === target.trainer && pokemon.order.battle === target.order.battle) {
            ;
        }
        else {
            return false;
        }
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
function changeRank(pokemon, target, parameter, change) {
    let value = change;
    const parameterJP = translateENintoJP(parameter);
    if (value === 0)
        return;
    if (value < 0) {
        // 自分以外からランクを下げられない
        if (pokemon.trainer !== target.trainer || pokemon.order.battle !== target.order.battle) {
            if (fieldStatus.getSide(target.trainer).mist.isTrue === true) {
                writeLog(`${target.status.name}は 白い霧に 守られている!`);
                return;
            }
            if (isAbility(target, 'しろいけむり') || isAbility(target, 'クリアボディ') || isAbility(target, 'メタルプロテクト')) {
                target.status.declareAbility();
                writeLog(`${target.status.name}の 能力は 下がらない!`);
                return;
            }
            for (const _pokemon of allPokemonInSide(target.trainer)) {
                if (isAbility(_pokemon, 'フラワーベール') && getPokemonType(target).includes('くさ')) {
                    _pokemon.status.declareAbility();
                    writeLog(`${target.status.name}は フラワーベールに 守られている!`);
                    return;
                }
            }
            if (isAbility(target, 'ミラーアーマー')) {
                target.status.declareAbility();
                changeRank(target, pokemon, parameter, change);
            }
            if (parameter === 'attack') {
                if (isAbility(target, 'かいりきバサミ')) {
                    target.status.declareAbility();
                    writeLog(`${target.status.name}の 攻撃は 下がらない!`);
                    return;
                }
            }
            if (parameter === 'defense') {
                if (isAbility(target, 'はとむね')) {
                    target.status.declareAbility();
                    writeLog(`${target.status.name}の 防御は 下がらない!`);
                    return;
                }
            }
            if (parameter === 'accuracy') {
                if (isAbility(target, 'するどいめ')) {
                    target.status.declareAbility();
                    writeLog(`${target.status.name}の 命中は 下がらない!`);
                    return;
                }
            }
        }
    }
    if (isAbility(target, 'たんじゅん') === true) {
        value = value * 2;
    }
    if (isAbility(target, 'あまのじゃく') === true) {
        value = 0 - value;
    }
    // ランク変化
    target.rank[parameter] += value;
    // メッセージ
    if (pokemon.moveUsed.name === 'はらだいこ') {
        writeLog(`体力を削って パワー全開!`);
    }
    if (target.damage.critical === true && isAbility(target, 'いかりのつぼ') === true) {
        writeLog(`${parameterJP}が 最大まで上がった`);
    }
    if (value >= 3)
        writeLog(`${parameterJP}が ぐぐーんと上がった`);
    if (value === 2)
        writeLog(`${parameterJP}が ぐーんと上がった`);
    if (value === 1)
        writeLog(`${parameterJP}が 上がった`);
    if (value === -1)
        writeLog(`${parameterJP}が 下がった`);
    if (value === -2)
        writeLog(`${parameterJP}が がくっと下がった`);
    if (value <= -3)
        writeLog(`${parameterJP}が がくーんと下がった`);
    // まけんき・かちき
    if (value < 0 && pokemon.trainer !== target.trainer) {
        if (isAbility(target, 'まけんき') === true) {
            changeRank(target, target, 'attack', 2);
        }
        if (isAbility(target, 'かちき') === true) {
            changeRank(target, target, 'specialAttack', 2);
        }
    }
}
