"use strict";
function allPokemonInBattlefield() {
    const result = [];
    for (const pokemon of myParty) {
        if (pokemon.order.battle !== null) {
            result.push(pokemon);
        }
    }
    for (const pokemon of opponentParty) {
        if (pokemon.order.battle !== null) {
            result.push(pokemon);
        }
    }
    return result;
}
function getPokemonByID(trainer, battleNumber) {
    if (trainer === 'me') {
        for (const pokemon of myParty) {
            if (pokemon.order.battle === battleNumber) {
                return pokemon;
            }
        }
    }
    if (trainer === 'opp') {
        for (const pokemon of opponentParty) {
            if (pokemon.order.battle === battleNumber) {
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
