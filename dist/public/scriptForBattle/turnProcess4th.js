"use strict";
// 4. ポケモンの行動
function pokemonAction() {
    while (main.getPokemonToAttack().length > 0) {
        main.calcSpeed();
        const pokemon = main.getPokemonToAttack()[0];
        // 技の成功判定
        const judge = isSuccess(pokemon);
        // コマンドの削除
        pokemon.command = new Command();
        if (judge === false) {
            continue;
        }
        // 技の効果
        moveEffect(pokemon);
        if (main.me.extraCommand.length > 0 || main.opp.extraCommand.length > 0) {
            break;
        }
    }
}
