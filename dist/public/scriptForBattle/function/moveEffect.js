"use strict";
function moveEffect(pokemon) {
    console.log(pokemon.moveUsed);
    if (pokemon.moveUsed.category !== '変化') {
        // 対象全員へのダメージ計算
        calculateDamageForAll(pokemon);
    }
}
function calculateDamageForAll(pokemon) {
    for (const info of pokemon.target) {
        if (info.success === false) {
            continue;
        }
        const target = getPokemonByID(info.trainer, info.battleNumber);
        if (target === false) {
            continue;
        }
        calculateDamage(pokemon, target);
        console.log(`${target.damage.damage} のダメージ！`);
    }
}
