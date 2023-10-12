"use strict";
function allPokemonInBattlefield() {
    const result = [];
    for (const pokemon of bothParty.myParty.pokemon) {
        if (pokemon.order.battle !== null) {
            result.push(pokemon);
        }
    }
    for (const pokemon of bothParty.oppParty.pokemon) {
        if (pokemon.order.battle !== null) {
            result.push(pokemon);
        }
    }
    return result;
}
function allPokemonInSide(trainer) {
    const result = [];
    if (trainer === 'me') {
        for (const pokemon of bothParty.myParty.pokemon) {
            if (pokemon.order.battle !== null) {
                result.push(pokemon);
            }
        }
        return result;
    }
    else {
        for (const pokemon of bothParty.oppParty.pokemon) {
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
        const target = getPokemonByBattle(getOpponentTrainer(pokemon.trainer), i);
        if (target === false)
            continue;
        result.push(target);
    }
    for (let i = 0; i < fieldStatus.battleStyle; i++) {
        const target = getPokemonByBattle(pokemon.trainer, i);
        if (target === false)
            continue;
        if (isSame(target, pokemon) === true)
            continue;
        result.push(target);
    }
    return result;
}
function getPokemonByParty(trainer, party) {
    if (trainer === 'me') {
        for (const pokemon of bothParty.myParty.pokemon) {
            if (pokemon.order.party === party) {
                return pokemon;
            }
        }
    }
    else {
        for (const pokemon of bothParty.oppParty.pokemon) {
            if (pokemon.order.party === party) {
                return pokemon;
            }
        }
    }
    return bothParty.myParty.pokemon[0];
}
function getPokemonByBattle(trainer, battle) {
    if (trainer === 'me') {
        for (const pokemon of bothParty.myParty.pokemon) {
            if (pokemon.order.battle === battle) {
                return pokemon;
            }
        }
    }
    if (trainer === 'opp') {
        for (const pokemon of bothParty.oppParty.pokemon) {
            if (pokemon.order.battle === battle) {
                return pokemon;
            }
        }
    }
    return false;
}
function getOpponentTrainer(trainer) {
    if (trainer === 'me') {
        return 'opp';
    }
    else {
        return 'me';
    }
}
function getParty(trainer) {
    if (trainer === 'me')
        return bothParty.myParty.pokemon;
    else
        return bothParty.oppParty.pokemon;
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
    if (pokemon.trainer === 'me') {
        return pokemon.translateName(pokemon.name);
    }
    else {
        return '相手の ' + pokemon.translateName(pokemon.name);
    }
}
function isSame(pokemon, target) {
    if (pokemon.trainer === target.trainer && pokemon.order.party === target.order.party) {
        return true;
    }
    else {
        return false;
    }
}
function isFriend(pokemon, target) {
    if (pokemon.trainer === target.trainer && pokemon.order.party !== target.order.party) {
        return true;
    }
    else {
        return false;
    }
}
function getTargetList(pokemon) {
    const result = [];
    for (const damage of pokemon.damage) {
        if (damage.success === false) {
            continue;
        }
        const target = getPokemonByParty(damage.trainer, damage.party);
        result.push({ target: target, damage: damage });
    }
    return result;
}
