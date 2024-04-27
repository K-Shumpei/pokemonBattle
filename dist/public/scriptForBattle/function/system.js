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
function outputScreen() {
    // ログ表示
    battleLog.output();
    // 選出されたポケモンの情報・表示
    for (const pokemon of main.me.pokemon) {
        pokemon.showHandInfo();
    }
    // コマンド欄の表示
    main.me.showCommand1stField();
}
