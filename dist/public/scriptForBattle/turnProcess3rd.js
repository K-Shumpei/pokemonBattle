"use strict";
// 3.トレーナーの行動、ポケモンの行動順に関する行動
function actionBeforeTurn() {
    for (const pokemon of allPokemonInBattlefield()) {
        quickDraw: if (pokemon.ability.isName('クイックドロウ')) {
            if (pokemon.move.selected.isStatus())
                break quickDraw;
            if (getRandom() >= 30)
                break quickDraw;
            pokemon.stateChange.orderRaise.isTrue = true;
            pokemon.declareAbility();
            writeLog(`${getArticle(pokemon)}は クイックドロウで 行動が はやくなった!`);
            continue;
        }
        quickClaw: if (pokemon.item.isName('せんせいのツメ') === true) {
            if (getRandom() >= 30)
                break quickClaw;
            pokemon.stateChange.orderRaise.isTrue = true;
            writeLog(`${getArticle(pokemon)}は せんせいのツメで 行動が はやくなった!`);
            continue;
        }
        custapBerry: if (pokemon.item.isName('イバンのみ') === true) {
            const gluttony = (pokemon.ability.isName('くいしんぼう')) ? 2 : 1;
            if (pokemon.status.hp.value.isGreaterThan(4 / gluttony))
                break custapBerry;
            pokemon.stateChange.orderRaise.isTrue = true;
            writeLog(`${getArticle(pokemon)}は イバンのみで 行動が はやくなった!`);
            // リサイクル
            recycleAvailable(pokemon);
            // ゲップ
            pokemon.stateChange.belch.isTrue = true;
            // ほおぶくろ
            activateCheekPouch(pokemon);
        }
    }
    // 交代・よびかける
    const changePokemon = allPokemonInBattlefield().filter(pokemon => pokemon.command.reserve !== null).sort((a, b) => {
        // 素早さ
        if (getSpeedValue(b, 'e') > getSpeedValue(a, 'e'))
            return 1;
        if (getSpeedValue(b, 'e') < getSpeedValue(a, 'e'))
            return -1;
        // 乱数
        if (getRandom() > 50)
            return 1;
        else
            return -1;
    });
    for (const pokemon of changePokemon) {
        const battle = pokemon.order.battle;
        const reserve = pokemon.command.reserve;
        if (battle === null)
            continue;
        if (reserve === null)
            continue;
        writeLog(`${translateENintoJP(pokemon.trainer)}は ${pokemon.name}を 引っこめた!`);
        toReserve(pokemon);
        const next = getPokemonByParty(pokemon.trainer, reserve);
        toBattleField(next, battle);
    }
}
