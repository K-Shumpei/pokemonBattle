"use strict";
function getActionOrder() {
    const actionOrder = [];
    for (const pokemon of allPokemonInBattlefield()) {
        if (pokemon.command.move === null) {
            continue;
        }
        const info = new ActionOrderInfo;
        info.trainer = pokemon.trainer;
        info.battleNumber = pokemon.order.battle;
        info.raise = getActionOrderRaise(pokemon);
        info.lower = getActionOrderLower(pokemon);
        info.priority = getActionOrderPriority(pokemon);
        info.ahead = getActionOrderAhead(pokemon);
        info.later = getActionOrderLater(pokemon);
        info.speed = getSpeedValue(pokemon, 'e');
        info.random = getRandom();
        actionOrder.push(info);
    }
    actionOrder.sort((a, b) => {
        // 技の効果
        if (a.raise > b.raise)
            return -1;
        if (a.raise < b.raise)
            return 1;
        if (a.lower > b.lower)
            return -1;
        if (a.lower < b.later)
            return 1;
        // 優先度
        if (a.priority > b.priority)
            return -1;
        if (a.priority < b.priority)
            return 1;
        // 先攻
        if (a.ahead > b.ahead)
            return -1;
        if (a.ahead < b.ahead)
            return 1;
        // 後攻
        if (a.later > b.later)
            return -1;
        if (a.later < b.later)
            return 1;
        // 素早さ
        if (a.speed > b.speed)
            return -1;
        if (a.speed < b.speed)
            return 1;
        // 乱数
        if (a.random > b.random)
            return -1;
        else
            return 1;
    });
    return actionOrder;
}
// 場のポケモンをすばやさ実数値順に並べる
function getSpeedOrder() {
    const speedOrder = [];
    for (const pokemon of allPokemonInBattlefield()) {
        const info = new ActionOrderInfo;
        info.trainer = pokemon.trainer;
        info.battleNumber = pokemon.order.battle;
        info.speed = getSpeedValue(pokemon, 'a');
        info.random = getRandom();
        speedOrder.push(info);
    }
    speedOrder.sort((a, b) => {
        // 素早さ
        if (a.speed > b.speed)
            return -1;
        if (a.speed < b.speed)
            return 1;
        // 乱数
        if (a.random > b.random)
            return -1;
        else
            return 1;
    });
    return speedOrder;
}
// 特定のポケモンを素早さ順に並べる
function getSpeedOrderForSome(pokemonList) {
    const speedOrder = [];
    for (const pokemon of pokemonList) {
        const info = new ActionOrderInfo;
        info.trainer = pokemon.trainer;
        info.battleNumber = pokemon.order.battle;
        info.party = pokemon.order.party;
        info.speed = getSpeedValue(pokemon, 'e');
        info.random = getRandom();
        speedOrder.push(info);
    }
    speedOrder.sort((a, b) => {
        // 素早さ
        if (a.speed > b.speed)
            return -1;
        if (a.speed < b.speed)
            return 1;
        // 乱数
        if (a.random > b.random)
            return -1;
        else
            return 1;
    });
    return speedOrder;
}
function getActionOrderRaise(pokemon) {
    if (pokemon.stateChange.orderRaise.isTrue === true) {
        return 1;
    }
    return 0;
}
function getActionOrderLower(pokemon) {
    return 0;
}
function getActionOrderPriority(pokemon) {
    return 0;
}
function getActionOrderAhead(pokemon) {
    return 0;
}
function getActionOrderLater(pokemon) {
    return 0;
}
function getSpeedValue(pokemon, type) {
    // a. すばやさ実数値
    const speedTypeA = pokemon.actualValue.speed;
    if (type === 'a') {
        return speedTypeA;
    }
    // b. 各種補正
    let speedTypeB = getValueWithRankCorrection(pokemon.actualValue.speed, pokemon.rank.speed, false);
    let correction = 4096;
    speedTypeB = fiveRoundEntry(speedTypeB * correction / 4096);
    // まひ補正
    if (pokemon.status.statusAilment.name === 'まひ') {
        speedTypeB = Math.floor(speedTypeB * 2048 / 4096);
    }
    // c. 上限は10000
    const speedTypeC = Math.min(speedTypeB, 10000);
    if (type === 'c') {
        return speedTypeC;
    }
    // d. トリックルーム
    let speedTypeD = speedTypeC;
    // e. 8192で割った時の余り
    const speedTypeE = speedTypeD % 8192;
    return speedTypeE;
}
