"use strict";
function moveEffect(pokemon) {
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
        // ばけのかわ/アイスフェイス
        if (isAbility(target, 'ばけのかわ') === true) {
            if (target.stateChange.disguise.isTrue === true) {
                continue;
            }
        }
        if (isAbility(target, 'アイスフェイス') === true) {
            if (target.stateChange.iceFace.isTrue === true && pokemon.moveUsed.category === '物理') {
                continue;
            }
        }
        // ダメージ計算
        calculateDamage(pokemon, target);
        console.log(`${target.damage.damage} のダメージ！`);
    }
}
