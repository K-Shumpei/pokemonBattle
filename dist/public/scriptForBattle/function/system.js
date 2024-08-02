"use strict";
// システム的に一意な順番
function sortByHostParty(pokeList) {
    const result = pokeList.sort((a, b) => {
        // トレーナー
        if (a.order.host)
            return -1;
        if (b.order.host)
            return 1;
        // パーティの並び順
        if (a.order.party < b.order.party)
            return -1;
        return 1;
    });
    return result;
}
// お互いの手持ちの先頭にいるポケモン (左端のポケモン) から順番に地面に降りる。
// すばやさ・浮いてる手段・じゅうりょく使用者の所属などは関係しない。
// ホストトレーナー側のポケモンを(A,B)、もう片方のポケモンを(a,b)とした場合、A→a→B→bの順になる。
function sortByEachLeft(pokeList) {
    const result = pokeList.sort((a, b) => {
        // バトル場の並び順（左側が先頭になるように）
        if (a.order.battle === null)
            return -1;
        if (b.order.battle === null)
            return -1;
        if (a.order.host && a.order.battle < b.order.battle)
            return -1;
        if (!a.order.host && a.order.battle < b.order.battle)
            return 1;
        if (a.order.battle < b.order.battle)
            return -1;
        if (a.order.battle > b.order.battle)
            return 1;
        // トレーナー
        if (a.order.host)
            return -1;
        else
            return 1;
    });
    return result;
}
function sortByBattle(pokeList) {
    const result = pokeList.sort((a, b) => {
        // バトル場の並び順（左側が先頭になるように）
        if (a.order.battle === null)
            return -1;
        if (b.order.battle === null)
            return -1;
        if (a.order.battle < b.order.battle)
            return -1;
        if (a.order.battle > b.order.battle)
            return 1;
        // トレーナー
        if (a.order.host)
            return -1;
        else
            return 1;
    });
    return result;
}
// すばやさによらず、技の使用者の味方→トレーナーから見て左側の敵→右側の敵の順にわたげが発動する。
function sortByCottonDown(pokeList) {
    const result = pokeList.sort((a, b) => {
        // 自分、相手の順番
        if (a.isMine())
            return -1;
        if (b.isMine())
            return 1;
        // バトル場の並び順（左側が先頭になるように）
        if (a.order.battle === null)
            return -1;
        if (b.order.battle === null)
            return -1;
        if (a.order.battle < b.order.battle)
            return -1;
        else
            return 1;
    });
    return result;
}
// 特性・持ち物の補正、ランク補正、まひ補正、トリックルーム補正を考慮した順番
function sortByActionOrder(pokeList) {
    const result = pokeList.sort((a, b) => {
        // 技の効果
        if (a.actionOrder.moveEffect > b.actionOrder.moveEffect)
            return -1;
        if (a.actionOrder.moveEffect < b.actionOrder.moveEffect)
            return 1;
        // 優先度
        if (a.move.selected.priority > b.move.selected.priority)
            return -1;
        if (a.move.selected.priority < b.move.selected.priority)
            return 1;
        // 先攻
        if (a.actionOrder.itemAbilityEffect > b.actionOrder.itemAbilityEffect)
            return -1;
        if (a.actionOrder.itemAbilityEffect < b.actionOrder.itemAbilityEffect)
            return 1;
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
// すばやさ実数値順（トリックルーム補正あり）
function sortBySpeed(pokeList) {
    const result = pokeList.sort((a, b) => {
        // 素早さ
        if (a.status.spe.av > b.status.spe.av)
            return -1;
        if (a.status.spe.av < b.status.spe.av)
            return 1;
        // 乱数
        if (a.status.spe.random > b.status.spe.random)
            return -1;
        else
            return 1;
    });
    if (main.field.whole.trickRoom.isTrue) {
        return result.reverse();
    }
    else {
        return result;
    }
}
// へんしん状態やスピードスワップによる実数値変動を含め、あらゆるすばやさ補正を考慮しない順番
function sortByOriginalSpeed(pokeList) {
    const result = pokeList.sort((a, b) => {
        // 素早さ
        if (a.status.spe.avOrg > b.status.spe.avOrg)
            return -1;
        if (a.status.spe.avOrg < b.status.spe.avOrg)
            return 1;
        // 乱数
        if (a.status.spe.random > b.status.spe.random)
            return -1;
        else
            return 1;
    });
    return result;
}
function sortPokemonList(pokeList, sort) {
    switch (sort) {
        case 'host-party':
            return sortByHostParty(pokeList);
        case 'eachLeft':
            return sortByEachLeft(pokeList);
        case 'cottonDown':
            return sortByCottonDown(pokeList);
        case 'originalSpeed':
            return sortByOriginalSpeed(pokeList);
        case 'speed':
            return sortBySpeed(pokeList);
        case 'actionOrder':
            return sortByActionOrder(pokeList);
    }
}
function getPokemonInBattlefield(sort) {
    const me = main.me.pokemon.filter(p => p.order.battle !== null);
    const opp = main.opp.pokemon.filter(p => p.order.battle !== null);
    const result = me.concat(opp);
    return sortPokemonList(result, sort);
}
function getPokemonInSide(isMe) {
    const pokemon = main.getParty(isMe);
    return pokemon.filter(p => p.order.battle !== null);
    //return sortPokemonList( result, sort );
}
function getPokemonScheduledToAttack() {
    const pokeList = getPokemonInBattlefield('actionOrder');
    return pokeList.filter(p => p.command.isAttack());
}
function getPokemonScheduledToExchange() {
    const pokeList = getPokemonInBattlefield('actionOrder');
    return pokeList.filter(p => p.command.isExchange());
}
function getPokemonOnLanding(sort) {
    const pokeList = getPokemonInBattlefield(sort);
    return pokeList.filter(p => p.extraParameter.landing);
}
function isSame(pokemon, target) {
    return pokemon.isMine() === target.isMine() && pokemon.order.party === target.order.party;
}
// 乱数 0以上100未満の整数
function getRandom() {
    const first = randomList[0];
    randomList.shift();
    return first;
}
// 5捨6入
function fiveRoundEntry(number) {
    return Math.ceil(number - 0.5);
}
// ランダムで要素を取り出す
function getOneAtRandom(array) {
    const index = Math.floor(getRandom() * array.length);
    return array[index];
}
// 画面出力
function outputScreen(me, opp) {
    // ログ表示
    battleLog.output();
    // 選出されたポケモンの情報・表示
    for (const pokemon of main.me.pokemon) {
        pokemon.showHandInfo();
    }
    // コマンド欄の表示
    if (me && !opp) {
        main.me.showCommandOnlyMe();
        return;
    }
    if (!me && opp) {
        main.me.showCommandOnlyOpp();
        return;
    }
    main.me.showCommand1stField();
}
