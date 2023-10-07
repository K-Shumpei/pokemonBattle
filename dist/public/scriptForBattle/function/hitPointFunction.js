"use strict";
// 技の追加効果によるHP変化
function changeHPByMove(pokemon, target, change) {
    let value = change;
    if (pokemon.item.isName('おおきなねっこ') === true) {
        value = fiveRoundEntry(value * 5324 / 4096);
    }
    if (target.ability.isName('ヘドロえき')) {
        if (pokemon.ability.isName('マジックガード'))
            return;
        // HP減少
        pokemon.status.hp.value.add(-1 * value);
        // メッセージ
        target.declareAbility();
        writeLog(`${getArticle(pokemon)}は ヘドロえきを 吸い取った!`);
    }
    else {
        if (pokemon.status.hp.value.isMax())
            return;
        if (pokemon.stateChange.healBlock.isTrue === true)
            return;
        // HP回復
        pokemon.status.hp.value.add(value);
        // メッセージ
        writeLog(`${getArticle(target)}から 体力を 吸い取った!`);
    }
}
// きのみを食べることによるHP回復
function changeHPByBerry(pokemon, item) {
    if (pokemon.status.hp.value.isMax())
        return;
    if (pokemon.stateChange.healBlock.isTrue === true)
        return;
    const ripen = (pokemon.ability.isName('じゅくせい')) ? 2 : 1;
    const dynamax = (pokemon.stateChange.dynamax.isTrue) ? 0.5 : 1;
    let value = 0;
    if (item === 'オレンのみ') {
        value = 10 * ripen;
    }
    if (item === 'オボンのみ') {
        value = Math.floor((pokemon.status.hp.av * dynamax) / 4) * ripen;
    }
    if (item === 'フィラのみ' || item === 'ウイのみ' || item === 'マゴのみ' || item === 'バンジのみ' || item === 'イアのみ') {
        value = Math.floor((pokemon.status.hp.av * dynamax) / 3) * ripen;
    }
    if (item === 'ナゾのみ') {
        value = Math.floor((pokemon.status.hp.av * dynamax) / 4) * ripen;
    }
    // HP回復
    pokemon.status.hp.value.add(value);
    // メッセージ
    writeLog(`${getArticle(pokemon)}は ${item}で 体力を 回復した!`);
    // なげつける・むしくい・ついばむ
    if (pokemon.stateChange.memo.isTrue === true) {
        pokemon.stateChange.memo.count += 1;
    }
}
// アイテムによるHP変化
function changeHPByItem(pokemon, item, damage) {
    if (item === 'いのちのたま') {
        // ダメージ
        pokemon.status.hp.value.add(-1 * damage);
        // メッセージ
        writeLog(`${getArticle(pokemon)}は 命が 少し削られた!`);
    }
    if (item === 'かいがらのすず') {
        // HP回復
        pokemon.status.hp.value.add(damage);
        // メッセージ
        writeLog(`${getArticle(pokemon)}は かいがらのすずで 少し 回復`);
    }
    if (item === 'きのみジュース') {
        // HP回復
        pokemon.status.hp.value.add(damage);
        // メッセージ
        writeLog(`${getArticle(pokemon)}は ${item}で 体力を 回復した!`);
    }
}
// HP変化
function changeHPByAbility(pokemon, value, sign) {
    if (sign === '-') {
        // ダメージ
        pokemon.status.hp.value.add(-1 * value);
    }
    if (sign === '+') {
        if (pokemon.status.hp.value.isMax())
            return;
        if (pokemon.stateChange.healBlock.isTrue === true)
            return;
        pokemon.declareAbility();
        // HP回復
        pokemon.status.hp.value.add(value);
        // メッセージ
        writeLog(`${getArticle(pokemon)}の 体力が 回復した!`);
    }
}
// ほおぶくろ
function activateCheekPouch(pokemon) {
    if (!pokemon.ability.isName('ほおぶくろ'))
        return;
    const dynamax = (pokemon.stateChange.dynamax.isTrue) ? 0.5 : 1;
    const value = Math.floor(pokemon.status.hp.av * dynamax / 3);
    changeHPByAbility(pokemon, value, '+');
}
