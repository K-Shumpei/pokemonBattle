"use strict";
function sortByActionOrder(pokeList) {
    const result = pokeList.sort((a, b) => {
        // 技の効果
        //if ( a.raise > b.raise ) return -1;
        //if ( a.raise < b.raise ) return 1;
        //if ( a.lower > b.lower ) return -1;
        //if ( a.lower < b.later ) return 1;
        // 優先度
        if (a.move.selected.priority > b.move.selected.priority)
            return -1;
        if (a.move.selected.priority < b.move.selected.priority)
            return 1;
        // 先攻
        //if ( a.ahead > b.ahead ) return -1;
        //if ( a.ahead < b.ahead ) return 1;
        // 後攻
        //if ( a.later > b.later ) return -1;
        //if ( a.later < b.later ) return 1;
        // 素早さ
        if (a.status.spe.actionOrder > b.status.spe.actionOrder)
            return -1;
        if (a.status.spe.actionOrder < b.status.spe.actionOrder)
            return 1;
        // 乱数
        if (a.status.spe.random > b.status.spe.random)
            return -1;
        else
            return 1;
    });
    return result;
}
function isSame(pokemon, target) {
    return pokemon.isMine() === target.isMine() && pokemon.order.party === target.order.party;
}
function allPokemonInBattlefield() {
    const result = [];
    for (const pokemon of main.me.pokemon) {
        if (pokemon.order.battle !== null) {
            result.push(pokemon);
        }
    }
    for (const pokemon of main.opp.pokemon) {
        if (pokemon.order.battle !== null) {
            result.push(pokemon);
        }
    }
    return result;
}
function allPokemonInSide(trainer) {
    const result = [];
    if (trainer === true) {
        for (const pokemon of main.me.pokemon) {
            if (pokemon.order.battle !== null) {
                result.push(pokemon);
            }
        }
        return result;
    }
    else {
        for (const pokemon of main.opp.pokemon) {
            if (pokemon.order.battle !== null) {
                result.push(pokemon);
            }
        }
        return result;
    }
}
// わたげの対象ポケモン
function pokemonForCottonDown(pokemon) {
    const result = [];
    for (let i = fieldStatus.battleStyle - 1; i >= 0; i--) {
        const target = getPokemonByBattle(getOpponentTrainer(pokemon.isMine()), i);
        if (target === false)
            continue;
        result.push(target);
    }
    for (let i = 0; i < fieldStatus.battleStyle; i++) {
        const target = getPokemonByBattle(pokemon.isMine(), i);
        if (target === false)
            continue;
        if (isSame(target, pokemon) === true)
            continue;
        result.push(target);
    }
    return result;
}
function getPokemonByParty(trainer, party) {
    if (trainer === true) {
        for (const pokemon of main.me.pokemon) {
            if (pokemon.order.party === party) {
                return pokemon;
            }
        }
    }
    else {
        for (const pokemon of main.opp.pokemon) {
            if (pokemon.order.party === party) {
                return pokemon;
            }
        }
    }
    return main.me.pokemon[0];
}
function getPokemonByBattle(trainer, battle) {
    if (trainer === true) {
        for (const pokemon of main.me.pokemon) {
            if (pokemon.order.battle === battle) {
                return pokemon;
            }
        }
    }
    if (trainer === false) {
        for (const pokemon of main.opp.pokemon) {
            if (pokemon.order.battle === battle) {
                return pokemon;
            }
        }
    }
    return false;
}
function getOpponentTrainer(trainer) {
    if (trainer === true) {
        return false;
    }
    else {
        return true;
    }
}
function getParty(trainer) {
    if (trainer === true)
        return main.me.pokemon;
    else
        return main.opp.pokemon;
}
function writeLog(text) {
    const battleLog = getHTMLInputElement('battle_log');
    battleLog.value += text + "\n";
}
// 乱数 0以上100未満の整数
function getRandom() {
    const first = randomList[0];
    randomList.shift();
    return first;
}
// 5捨6入
function fiveRoundEntry(number) {
    if (number % 1 > 0.5) {
        return Math.floor(number) + 1;
    }
    else {
        return Math.floor(number);
    }
}
// トレーナー判断
function getArticle(pokemon) {
    if (pokemon.isMine())
        return pokemon.translateName(pokemon.name);
    else
        return '相手の ' + pokemon.translateName(pokemon.name);
}
function isFriend(pokemon, target) {
    if (pokemon.isMine() === target.isMine() && pokemon.order.party !== target.order.party) {
        return true;
    }
    else {
        return false;
    }
}
function getTargetList(pokemon) {
    const result = [];
    for (const damage of pokemon.attack.getTarget()) {
        if (damage.success === false) {
            continue;
        }
        const target = getPokemonByParty(damage.isMe, damage.party);
        result.push({ target: target, damage: damage });
    }
    return result;
}
