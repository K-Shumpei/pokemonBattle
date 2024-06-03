"use strict";
function endProcess() {
    console.log('end');
    main.calcSpeed();
    main.me.pokemon.map(poke => poke.attack.reset());
    main.opp.pokemon.map(poke => poke.attack.reset());
    console.log(main.me.pokemon[0].attack);
    endProcessWeatherEffect(); // てんきの効果
    // ききかいひ/にげごしによる交代先の選択・繰り出し (1)
    // なかよし度による状態異常の回復
    // みらいよち/はめつのねがい: 技が使用された順に発動する。
    // ねがいごと
    endProcessEventBlock1st(); // イベントブロック (その1)
    // ききかいひ/にげごしによる交代先の選択・繰り出し (2)
    endProcessAquaRing(); // アクアリング
    endProcessIngrain(); // ねをはる
    endProcessLeechSeed(); // やどりぎのタネ
    endProcessPoisoned(); // どく/もうどく/ポイズンヒール
    endProcessBurned(); // やけど
    endProcessNightmare(); // あくむ
    endProcessCurse(); // のろい
    endProcessBind(); // バインド
    endProcessOctolock(); // たこがため
    endProcessSaltCure(); // しおづけ
    endProcessTaunt(); // ちょうはつの終了
    endProcessTorment(); // いちゃもんの終了: キョダイユウゲキによるいちゃもん状態のみターン経過で解除される
    endProcessEncore(); // アンコールの終了
    endProcessDisable(); // かなしばりの終了
    endProcessMagnetRise(); // でんじふゆうの終了
    endProcessTelekinesis(); // テレキネシスの終了
    endProcessHealBlock(); // かいふくふうじの終了
    endProcessEmbargo(); // さしおさえの終了
    // ねむけ
    endProcessPerishSong(); // ほろびのうた
    // はねやすめを使用していたひこうタイプは地面から離れる
    // ききかいひ/にげごしによる交代先の選択・繰り出し (3)
    endProcessElapseSideField(); // 片側の場の状態の継続/終了
    endProcessElapseWholeField(); // 全体の場の状態の継続/終了
    endProcessEventBlock2nd(); // イベントブロック (その2）
    // ききかいひ/にげごしによる交代先の選択・繰り出し (4)
    // ダルマモード/リミットシールド/スワームチェンジ/ぎょぐんによるフォルムチェンジ: すばやさ補正を考慮しない。ボールから出た直後のフォルムのすばやさ実数値が発動順に影響する。
    // イベントブロック (その3)
    // だっしゅつパックによる交代先の選択・繰り出し
    // 仲間呼び
    // ひんしになったポケモンの代わりのポケモンを繰り出す
    // ダイマックスの終了判定
    // 2.行動選択に戻る
}
function endProcessWeatherEffect() {
    const weatherDamage = (pokemon) => {
        main.field.weather.onActivateSandstorm(pokemon);
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
function endProcessEventBlock1st() {
    const damage = (pokemon) => {
        main.field.getSide(pokemon.isMine()).seaOfFire.onEffective(pokemon);
        main.field.getSide(pokemon.isMine()).vineLash.onEffective(pokemon);
        main.field.getSide(pokemon.isMine()).wildfire.onEffective(pokemon);
        main.field.getSide(pokemon.isMine()).cannonade.onEffective(pokemon);
        main.field.getSide(pokemon.isMine()).volcalith.onEffective(pokemon);
    };
    const heal = (pokemon) => {
        main.field.terrain.onActivateGrassy(pokemon);
    };
    const ability = (pokemon) => {
        if (pokemon.ability.isName('Hydration')) { // 特性「うるおいボディ」
            if (main.field.weather.isRainy(pokemon) && !pokemon.statusAilment.isHealth()) {
                pokemon.msgDeclareAbility();
                pokemon.statusAilment.getHealth();
            }
        }
        if (pokemon.ability.isName('Shed Skin')) { // 特性「だっぴ」
            if (getRandom() < 30 && !pokemon.statusAilment.isHealth()) {
                pokemon.msgDeclareAbility();
                pokemon.statusAilment.getHealth();
            }
        }
        if (pokemon.ability.isName('Healer')) { // 特性「いやしのこころ」
        }
    };
    const item = (pokemon) => {
        const HP_8 = Math.floor(pokemon.getOrgHP() / 8);
        const HP_16 = Math.floor(pokemon.getOrgHP() / 16);
        if (pokemon.isItem('たべのこし')) {
            pokemon.status.hp.value.add(Math.max(1, HP_16));
            battleLog.write(`${pokemon.getArticle()}は たべのこしで 少し 回復`);
        }
        if (pokemon.isItem('くろいヘドロ')) {
            if (pokemon.type.has('Poison')) {
                pokemon.status.hp.value.add(Math.max(1, HP_8));
            }
            else {
                pokemon.status.hp.value.sub(Math.max(1, HP_16));
            }
        }
    };
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        damage(pokemon); // a. ひのうみ/キョダイベンタツ/キョダイゴクエン/キョダイホウゲキ/キョダイフンセキ(ダメージ): 状態が発生した順にダメージが発動する。
        heal(pokemon); // b. グラスフィールド(回復)
        ability(pokemon); // c. うるおいボディ/だっぴ/いやしのこころ
        item(pokemon); // b. たべのこし/くろいヘドロ
    }
}
function endProcessAquaRing() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.aquaRing.onEffective(pokemon);
    }
}
function endProcessIngrain() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.ingrain.onEffective(pokemon);
    }
}
function endProcessLeechSeed() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.leechSeed.onEffective(pokemon);
    }
}
function endProcessPoisoned() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.statusAilment.onEffectivePoisoned(pokemon);
    }
}
function endProcessBurned() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.statusAilment.onEffectiveBurned(pokemon);
    }
}
function endProcessNightmare() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.nightmare.onEffective(pokemon);
    }
}
function endProcessCurse() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.curse.onEffective(pokemon);
    }
}
function endProcessBind() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.bind.onEffective(pokemon);
    }
}
function endProcessOctolock() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.octolock.onEffective(pokemon);
    }
}
function endProcessSaltCure() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.saltCure.onEffective(pokemon);
    }
}
function endProcessTaunt() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.taunt.onElapse(pokemon);
    }
}
function endProcessTorment() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.torment.onElapse(pokemon);
    }
}
function endProcessEncore() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.encore.onElapse(pokemon);
    }
}
function endProcessDisable() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.disable.onElapse(pokemon);
    }
}
function endProcessMagnetRise() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.magnetRise.onElapse(pokemon);
    }
}
function endProcessTelekinesis() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.telekinesis.onElapse(pokemon);
    }
}
function endProcessHealBlock() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.healBlock.onElapse(pokemon);
    }
}
function endProcessEmbargo() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.embargo.onElapse(pokemon);
    }
}
function endProcessPerishSong() {
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        pokemon.stateChange.perishSong.onEffective(pokemon);
    }
}
function endProcessElapseSideField() {
    // ホスト側の状態が先にすべて解除された後に、ホストでない側の状態が解除される。
    // コートチェンジされていても関係なくホスト側から消える。
    const hostField = main.field.getSideByHost(true);
    const guestField = main.field.getSideByHost(false);
    for (const field of [hostField, guestField]) {
        field.reflect.onElapse(); // a. リフレクター
        field.lightScreen.onElapse(); // b. ひかりのかべ
        field.auroraVeil.onElapse(); // c. しんぴのまもり
        field.mist.onElapse(); // d. しろいきり
        field.tailwind.onElapse(); // e. おいかぜ
        field.luckyChant.onElapse(); // f. おまじない
        field.rainbow.onElapse(); // g. にじ
        field.seaOfFire.onElapse(); // h. ひのうみ
        field.wetlands.onElapse(); // i. しつげん
        field.auroraVeil.onElapse(); // j. オーロラベール
    }
}
function endProcessElapseWholeField() {
    main.field.whole.trickRoom.onElapse(); // a. トリックルーム
    main.field.whole.gravity.onElapse(); // b. じゅうりょく
    main.field.whole.waterSport.onElapse(); // c. みずあそび
    main.field.whole.magicRoom.onElapse(); // d. どろあそび
    main.field.whole.wonderRoom.onElapse(); // e. ワンダールーム
    main.field.whole.magicRoom.onElapse(); // f. マジックルーム
    main.field.terrain.onElapse(); // g. エレキフィールド/グラスフィールド/ミストフィールド/サイコフィールド
}
function endProcessEventBlock2nd() {
    const ability1st = (pokemon) => {
        if (!pokemon.ability.isValid())
            return;
        switch (pokemon.ability.name) {
            case 'Speed Boost': // 特性「かそく」
                if (!pokemon.isChangeRank('spe', 1))
                    break;
                pokemon.msgDeclareAbility();
                pokemon.changeRank('spe', 1);
                break;
            case 'Moody': // 特性「ムラっけ」
                const rankForUp = pokemon.status.getNotMaxRank();
                const rankForDown = pokemon.status.getNotMinRank();
                pokemon.msgDeclareAbility();
                if (rankForUp.length > 0) {
                    pokemon.changeRank(getOneAtRandom(rankForUp), 2);
                }
                if (rankForDown.length > 0) {
                    pokemon.changeRank(getOneAtRandom(rankForDown), -1);
                }
                break;
            case 'Slow Start': // 特性「スロースタート」
                pokemon.stateChange.slowStart.onElapse(pokemon);
                break;
            case 'Bad Dreams': // 特性「ナイトメア」
                const opponent = main.getPokemonInSide(!pokemon.isMine());
                for (const poke of opponent) {
                    if (!poke.statusAilment.isAsleep())
                        continue;
                    const damage = Math.floor(poke.getOrgHP() / 8);
                    poke.status.hp.value.sub(Math.max(1, damage));
                    battleLog.write(`${poke.getArticle()}は うなされている!`);
                }
                break;
            case 'Cud Chew': // 特性「はんすう」
                break;
            default:
                break;
        }
    };
    const item1st = (pokemon) => {
        if (pokemon.isItem('くっつきバリ')) {
            const damage = Math.floor(pokemon.getOrgHP() / 8);
            pokemon.status.hp.value.sub(Math.max(1, damage));
            battleLog.write(`${pokemon.getArticle()}は くっつきバリで dダメージを 受けた!`);
        }
        if (pokemon.isItem('どくどくだま') && pokemon.statusAilment.isHealth()) {
            pokemon.statusAilment.getBadPoisoned('どくどくだま');
        }
        if (pokemon.isItem('かえんだま') && pokemon.statusAilment.isHealth()) {
            pokemon.statusAilment.getBurned('かえんだま');
        }
    };
    const ability2nd = (pokemon) => {
        if (!pokemon.ability.isValid())
            return;
    };
    const item2nd = (pokemon) => {
    };
    for (const pokemon of sortByActionOrder(main.getPokemonInBattle())) {
        // a. さわぐ
        // b. ねむりによるあばれるの中断
        ability1st(pokemon); // c. かそく/ムラっけ/スロースタート/ナイトメア/はんすう
        item1st(pokemon); // d. くっつきバリ/どくどくだま/かえんだま
        ability2nd(pokemon); // e. ものひろい/しゅうかく/たまひろい
        item2nd(pokemon); // f. しろいハーブ
    }
}
