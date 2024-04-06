"use strict";
function endProcess() {
    main.calcSpeed();
    weatherEffect(); // てんきの効果
    // ききかいひ/にげごしによる交代先の選択・繰り出し (1)
    // なかよし度による状態異常の回復
    //
}
function weatherEffect() {
    const weatherDamage = (pokemon) => {
        if (!main.field.weather.isSandy())
            return;
        if (pokemon.ability.isName('Overcoat'))
            return; // 特性「ぼうじん」
        if (pokemon.item.isName('ぼうじんゴーグル'))
            return;
        if (pokemon.stateChange.dig.isTrue)
            return;
        if (pokemon.stateChange.dive.isTrue)
            return;
        if (pokemon.type.has('Rock'))
            return;
        if (pokemon.type.has('Ground'))
            return;
        if (pokemon.type.has('Steel'))
            return;
        if (pokemon.ability.isName('Sand Veil'))
            return; // 特性「すながくれ」
        if (pokemon.ability.isName('Sand Rush'))
            return; // 特性「すなかき」
        if (pokemon.ability.isName('Sand Force'))
            return; // 特性「すなのちから」
        pokemon.msgSandstorm();
        pokemon.status.hp.value.sub(Math.max(Math.floor(pokemon.getOrgHP() / 16), 1));
    };
    const activateAbility = (pokemon) => {
        if (pokemon.stateChange.dig.isTrue)
            return;
        if (pokemon.stateChange.dive.isTrue)
            return;
        const HP_8 = Math.floor(pokemon.getOrgHP() / 8);
        const HP_16 = Math.floor(pokemon.getOrgHP() / 16);
        if (pokemon.ability.isName('Dry Skin')) { // 特性「かんそうはだ」
            if (main.field.weather.isSunny(pokemon)) {
                pokemon.msgDeclareAbility();
                pokemon.status.hp.value.sub(Math.max(HP_8, 1));
            }
            if (main.field.weather.isRainy(pokemon)) {
                pokemon.msgDeclareAbility();
                pokemon.status.hp.value.add(Math.max(HP_8, 1));
            }
        }
        if (pokemon.ability.isName('Solar Power')) { // 特性「サンパワー」
            if (main.field.weather.isSunny(pokemon)) {
                pokemon.msgDeclareAbility();
                pokemon.status.hp.value.sub(Math.max(HP_8, 1));
            }
        }
        if (pokemon.ability.isName('Rain Dish')) { // 特性「あめうけざら」
            if (main.field.weather.isRainy(pokemon)) {
                pokemon.msgDeclareAbility();
                pokemon.status.hp.value.add(Math.max(HP_16, 1));
            }
        }
        if (pokemon.ability.isName('Ice Body')) { // 特性「アイスボディ」
            if (main.field.weather.isSnowy()) {
                pokemon.msgDeclareAbility();
                pokemon.status.hp.value.add(Math.max(HP_16, 1));
            }
        }
    };
    main.field.weather.advance(); // a. にほんばれ/あめ/すなあらし/あられ/ゆきの終了
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        weatherDamage(pokemon); // b. すなあらし/あられのダメージ
        activateAbility(pokemon); // c. かんそうはだ/サンパワー/あめうけざら/アイスボディ
    }
}
