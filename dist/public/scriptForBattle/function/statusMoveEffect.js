"use strict";
function statusMoveEffect(pokemon) {
    switch (pokemon.move.selected.getMaster().target) {
        case 'users-field': // 味方の場
            statusMoveToUsersField(pokemon);
            break;
        case "opponents-field": // 相手の場
            statusMoveToOpponentsField(pokemon);
            break;
        case "entire-field": // 全体の場
            statusMoveToEntireField(pokemon);
            break;
        case "user-and-allies": // 味方全体
            statusMoveToUserAndAllies(pokemon);
            break;
        case "all-opponents": // 相手全体
            statusMoveToAllOpponents(pokemon);
            break;
        case "ally": // 味方1体
            statusMoveToAlly(pokemon);
            break;
        case "all-pokemon": // 全体
            statusMoveToAllPokemon(pokemon);
            break;
        case "specific-move":
        case "selected-pokemon-me-first":
        case "user-or-ally":
        case "user":
        case "random-opponent":
        case "all-other-pokemon":
        case "selected-pokemon":
        case "all-allies":
        case "fainting-pokemon":
    }
}
function statusMoveToUsersField(pokemon) {
    const usersField = main.field.getSide(pokemon.isMine());
    const isLightClay = pokemon.item.isName('ひかりのねんど');
    switch (pokemon.move.selected.name) {
        case 'Aurora Veil': // 技「オーロラベール」
            usersField.auroraVeil.onActivate(isLightClay);
            break;
        case 'Light Screen': // 技「ひかりのかべ」
            usersField.lightScreen.onActivate(isLightClay);
            break;
        case 'Reflect': // 技「リフレクター」
            usersField.reflect.onActivate(isLightClay);
            break;
        case 'Tailwind': // 技「おいかぜ」
            usersField.tailwind.onActivate();
            break;
        case 'Lucky Chant': // 技「おまじない」
            usersField.luckyChant.onActivate();
            break;
        case 'Mist': // 技「しろいきり」
            usersField.mist.onActivate();
            break;
        case 'Safeguard': // 技「しんぴのまもり」
            usersField.safeguard.onActivate();
            break;
        case 'Mat Block': // 技「たたみがえし」
            usersField.matBlock.onActivate(pokemon);
            break;
        case 'Crafty Shield': // 技「トリックガード」
            usersField.craftyShield.onActivate();
            break;
        case 'Quick Guard': // 技「ファストガード」
            usersField.quickGuard.onActivate();
            break;
        case 'Wide Guard': // 技「ワイドガード」
            usersField.wideGuard.onActivate();
            break;
        default:
            break;
    }
}
function statusMoveToOpponentsField(pokemon) {
    const opponentsField = main.field.getSide(!pokemon.isMine());
    switch (pokemon.move.selected.name) {
        case 'Stealth Rock': // 技「ステルスロック」
            opponentsField.stealthRock.onActivate();
            break;
        case 'Toxic Spikes': // 技「どくびし」
            opponentsField.toxicSpikes.onActivate();
            break;
        case 'Sticky Web': // 技「ねばねばネット」
            opponentsField.stickyWeb.onActivate();
            break;
        case 'Spikes': // 技「まきびし」
            opponentsField.spikes.onActivate();
            break;
        default:
            break;
    }
}
function statusMoveToEntireField(pokemon) {
    switch (pokemon.move.selected.name) {
        case 'Sunny Day': // 技「にほんばれ」
            main.field.weather.getSunny(pokemon);
            break;
        case 'Rain Dance': // 技「あまごい」
            main.field.weather.getRainy(pokemon);
            break;
        case 'Sandstorm': // 技「すなあらし」
            main.field.weather.getSunny(pokemon);
            break;
        case 'Hail': // 技「あられ」
            main.field.weather.getSnowy(pokemon);
            break;
        case 'Snowscape': // 技「ゆきふらし」
            main.field.weather.getSnowy(pokemon);
            break;
        case 'Electric Terrain': // 技「エレキフィールド」
            main.field.terrain.getElectric(pokemon);
            break;
        case 'Grassy Terrain': // 技「グラスフィールド」
            main.field.terrain.getGrassy(pokemon);
            break;
        case 'Misty Terrain': // 技「ミストフィールド」
            main.field.terrain.getMisty(pokemon);
            break;
        case 'Psychic Terrain': // 技「サイコフィールド」
            main.field.terrain.getPsychic(pokemon);
            break;
        case 'Trick Room': // 技「トリックルーム」
            main.field.whole.trickRoom.onActivate(pokemon);
            break;
        case 'Magic Room': // 技「マジックルーム」
            main.field.whole.magicRoom.onActivate();
            break;
        case 'Wonder Room': // 技「ワンダールーム」
            main.field.whole.wonderRoom.onActivate();
            break;
        case 'Mud Sport': // 技「どろあそび」
            main.field.whole.mudSport.onActivate();
            break;
        case 'Water Sport': // 技「みずあそび」
            main.field.whole.waterSport.onActivate();
            break;
        case 'Fairy Lock': // 技「フェアリーロック」
            main.field.whole.fairyLock.onActivate();
            break;
        case 'Ion Deluge': // 技「プラズマシャワー」
            main.field.whole.ionDeluge.onActivate();
            break;
        case 'Haze': // 技「くろいきり」
            main.getPokemonInBattle().map(poke => poke.status.resetRank());
            writeLog(`全ての ステータスが 元に 戻った!`);
            break;
        case 'Court Change': // 技「コートチェンジ」
            break;
        case 'Gravity': // 技「じゅうりょく」
            main.field.whole.gravity.onActivate();
            break;
        default:
            break;
    }
}
function statusMoveToUserAndAllies(pokemon) {
    const master = pokemon.move.selected.getMaster();
    switch (pokemon.move.selected.name) {
        case 'Heal Bell': // 技「いやしのすず」
            break;
        case 'Aromatherapy': // 技「アロマセラピー」
            break;
        case 'Howl': // 技「とおぼえ」
            break;
        case 'Magnetic Flux': // 技「じばそうさ」
            break;
        case 'Gear Up': // 技「アシストギア」
            pokemon.attack.getTargetToPokemon().map(p => {
                const poke = main.getPokemonByBattle(p);
                master.stat.changes.map(stat => poke.changeRank(stat.stat, stat.change));
            });
            break;
        case 'Life Dew': // 技「いのちのしずく」
            break;
        case 'Coaching': // 技「コーチング」
            break;
        case 'Jungle Healing': // 技「ジャングルヒール」
            break;
        default:
            break;
    }
}
function statusMoveToAllOpponents(pokemon) {
    const master = pokemon.move.selected.getMaster();
    if (master.category === 'net-good-stats') { // ランク変化
        pokemon.attack.getTargetToPokemon().map(tgt => {
            const target = main.getPokemonByBattle(tgt);
            master.stat.changes.map(stat => target.changeRank(stat.stat, stat.change));
        });
    }
    if (master.category === 'ailment') { // 状態異常付与
        pokemon.attack.getTargetToPokemon().map(tgt => {
            const target = main.getPokemonByBattle(tgt);
            target.getAilmentByStatusMove(master.ailment.name);
        });
    }
    if (pokemon.move.selected.name === 'Heal Block') { // 技「かいふくふうじ」
        pokemon.attack.getTargetToPokemon().map(tgt => {
            const target = main.getPokemonByBattle(tgt);
            target.stateChange.healBlock.onActivate(target);
        });
    }
}
function statusMoveToAlly(pokemon) {
    const master = pokemon.move.selected.getMaster();
    const attack = pokemon.attack.getTargetToPokemon()[0];
    const target = main.getPokemonByBattle(attack);
    switch (pokemon.move.selected.name) {
        case 'Helping Hand': // 技「てだすけ」
            target.stateChange.helpingHand.onActivate(pokemon, target);
            break;
        case 'Aromatic Mist': // 技「アロマミスト」
            master.stat.changes.map(stat => target.changeRank(stat.stat, stat.change));
            break;
        case 'Hold Hands': // 技「てをつなぐ」
            break;
        default:
            break;
    }
}
function statusMoveToAllPokemon(pokemon) {
    const master = pokemon.move.selected.getMaster();
    switch (pokemon.move.selected.name) {
        case 'Perish Song': // 技「ほろびのうた」
            pokemon.attack.getTargetToPokemon().map(tgt => {
                const target = main.getPokemonByBattle(tgt);
                target.stateChange.perishSong.onActivate();
            });
            writeLog(`ほろびのうたを 聴いたポケモンは 3ターン後に 滅びてしまう!`);
            break;
        case 'Rototiller': // 技「たがやす」
            pokemon.attack.getTargetToPokemon().map(tgt => {
                const target = main.getPokemonByBattle(tgt);
                master.stat.changes.map(stat => target.changeRank(stat.stat, stat.change));
            });
            break;
        case 'Flower Shield': // 技「フラワーガード」
            break;
        case 'Teatime': // 技「おちゃかい」
            break;
        default:
            break;
    }
}
