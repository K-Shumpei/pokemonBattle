"use strict";
function onActivateLandingEffect() {
    const event1a = (pokemon) => {
    };
    const event1b = (pokemon) => {
        const field = main.field.getSide(pokemon.isMine());
        field.spikes.onEffective(pokemon);
        field.toxicSpikes.onEffective(pokemon);
        field.stealthRock.onEffective(pokemon);
        field.stickyWeb.onEffective(pokemon);
        field.steelsurge.onEffective(pokemon);
    };
    const event2a = (pokemon) => {
        const schooling = () => {
            if (!pokemon.ability.isName('Schooling'))
                return; // 特性「ぎょぐん」
            if (pokemon.level < 20)
                return;
            if (pokemon.status.hp.value.isLessEqual(4))
                return;
            pokemon.msgDeclareAbility();
            pokemon.formChange();
        };
        const ShieldsDown = () => {
            if (!pokemon.ability.isName('Shields Down'))
                return; // 特性「リミットシールド」
            if (pokemon.status.hp.value.isLessEqual(2))
                return;
            pokemon.msgDeclareAbility();
            pokemon.formChange();
        };
        main.field.terrain.onActivateMimicry(pokemon);
        schooling();
        ShieldsDown();
    };
    const event2b = (pokemon) => {
        main.field.terrain.onActivateSeed(pokemon);
        main.field.whole.trickRoom.onActivateRoomService(pokemon);
    };
    const event2c = (pokemon) => {
        if (pokemon.name === 'Kyogre' && pokemon.item.isName('あいいろのたま')) {
            pokemon.formChange();
        }
        if (pokemon.name === 'Groudon' && pokemon.item.isName('べにいろのたま')) {
            pokemon.formChange();
        }
    };
    const event3a = (pokemon) => {
        const hospitality = () => {
            if (!pokemon.ability.isName('Hospitality'))
                return;
            const allies = getPokemonInSide(pokemon.isMine()).filter(poke => !isSame(poke, pokemon) && !poke.status.hp.value.isMax());
            if (allies.length === 0)
                return;
            pokemon.msgDeclareAbility();
            for (const poke of allies) {
                const value = Math.floor(poke.getOrgHP() / 4);
                poke.status.hp.value.add(value);
                battleLog.write(`${pokemon.getArticle()}が たてた お茶を ${poke.getArticle()}は 飲みほした!`);
            }
        };
        main.field.weather.onActivateIceFace(pokemon);
        main.field.terrain.onActivateQuarkDrive(pokemon);
        main.field.weather.onActivateProtosynthesis(pokemon);
        hospitality();
        main.field.weather.onActivateForecast(pokemon);
    };
    for (const pokemon of getPokemonOnLanding('speed')) {
        // テラスシェルの発動
    }
    for (const pokemon of getPokemonOnLanding('speed')) {
        // かがくへんかガスの発動
    }
    for (const pokemon of getPokemonOnLanding('actionOrder')) {
        // きんちょうかん/じんばいったいの発動
    }
    for (const pokemon of getPokemonOnLanding('speed')) {
        // イベントブロック (その1) - 回復効果/設置技/特性/持ち物の発動
        event1a(pokemon); // a. いやしのねがい/みかづきのまい/Zおきみやげ/Zすてゼリフによる回復
        event1b(pokemon); // b. 設置技: 技が使用された順に発動
        pokemon.onActivateAbilityWhenLanding(); // c. 特性の効果
        // d. きのみ/きのみジュース/ふうせん/メンタルハーブ
    }
    for (const pokemon of getPokemonOnLanding('speed')) {
        // イベントブロック (その2) - 一部の特性/場の状態による持ち物/ゲンシカイキの発動
        event2a(pokemon); // a. ぎたい/ぎょぐん/リミットシールド
        event2b(pokemon); // b. エレキシード/グラスシード/サイコシード/ミストシード/ルームサービス
        event2c(pokemon); // c. ゲンシカイキ[4]
    }
    for (const pokemon of getPokemonOnLanding('originalSpeed')) {
        // イベントブロック (その3) - 一部の特性/場の状態による持ち物
        event3a(pokemon); // a. アイスフェイス/きょうえん/クォークチャージ/こだいかっせい/しれいとう/おもてなし/てんきや/フラワーギフト
        // b. ブーストエナジー
    }
    main.me.pokemon.map(p => p.extraParameter.onLanded());
    main.opp.pokemon.map(p => p.extraParameter.onLanded());
}
