"use strict";
function calculateDamage(pokemon, target, attack) {
    // 固定ダメージ
    if (pokemon.move.selected.getAddOn().fixedDamage) {
        return getFixedDamage(pokemon, target);
    }
    // 最終威力
    const power = getPower(pokemon, target);
    // 攻撃と防御の実数値取得　A/D
    const status = getStatus(pokemon, target, attack);
    // 最終ダメージ
    const finalDamage = getDamage(pokemon, target, power, status, attack);
    return finalDamage;
}
function getFixedDamage(pokemon, target) {
    switch (pokemon.move.selected.name) {
        case 'Sonic Boom': // 技「ソニックブーム」
            return 20;
        case 'Dragon Rage': // 技「りゅうのいかり」
            return 40;
        case 'Seismic Toss': // 技「ちきゅうなげ」
        case 'Night Shade': // 技「ナイトヘッド」
            return pokemon.level;
        case 'Psywave': // 技「サイコウェーブ」
            const rate = Math.floor(getRandom() * 101) * 0.01 + 0.5;
            return Math.max(Math.floor(pokemon.level * rate), 1);
        case 'Super Fang': // 技「いかりのまえば」
        case 'Nature’s Madness': // 技「しぜんのいかり」
        case 'Ruination': // 技「カタストロフィ」
            return Math.floor(target.getOrgHP() / 2);
        case 'Endeavor': // 技「がむしゃら」
            return target.getOrgHP() - pokemon.getOrgHP();
        case 'Counter': // 技「カウンター」
        case 'Mirror Coat': // 技「ミラーコート」
            return 0;
        case 'Bide': // 技「がまん」
            return 0;
        case 'Metal Burst': // 技「メタルバースト」
        case 'Comeuppance': // 技「ほうふく」
            return 0;
        case 'Final Gambit': // 技「いのちがけ」
            return pokemon.getOrgHP();
        case 'Guillotine': // 技「ハサミギロチン」
        case 'Horn Drill': // 技「つのドリル」
        case 'Fissure': // 技「じわれ」
        case 'Sheer Cold': // 技「ぜったいれいど」
            return target.getOrgHP();
        case 'Guardian of Alola': // 技「ガーディアン・デ・アローラ」
            return Math.floor(target.getOrgHP() * 3 / 4);
        default:
            return 1;
    }
}
// 威力計算
function getPower(pokemon, target) {
    const getBasicPawer = (pokemon, target) => {
        const move = pokemon.move.selected;
        if (move.name === 'Reversal' // 技「きしかいせい」
            || move.name === 'Flail') { // 技「じたばた」
            if (pokemon.status.hp.value.rate() >= 33 / 48)
                return 20;
            if (pokemon.status.hp.value.rate() >= 17 / 48)
                return 40;
            if (pokemon.status.hp.value.rate() >= 10 / 48)
                return 80;
            if (pokemon.status.hp.value.rate() >= 5 / 48)
                return 100;
            if (pokemon.status.hp.value.rate() >= 2 / 48)
                return 150;
            if (pokemon.status.hp.value.rate() >= 0)
                return 200;
        }
        if (move.name === 'Water Spout' // 技「しおふき」
            || move.name === 'Eruption' // 技「ふんか」
            || move.name === 'Dragon Energy') { // 技「ドラゴンエナジー」
            const base = Math.floor(150 * pokemon.status.hp.value.rate());
            return Math.max(base, 1);
        }
        if (move.name === 'Wring Out' // 技「しぼりとる」
            || move.name === 'Crush Grip') { // 技「にぎりつぶす」
            const base = Math.floor(150 * target.status.hp.value.rate());
            return Math.max(base, 1);
        }
        if (move.name === 'Stored Power' // 技「アシストパワー」
            || move.name === 'Power Trip') { // 技「つけあがる」
            return 20 * (pokemon.status.countRank() + 1);
        }
        if (move.name === 'Punishment') { // 技「おしおき」
            const base = 20 * (pokemon.status.countRank() + 3);
            return Math.min(base, 200);
        }
        if (move.name === 'Electro Ball') { // 技「エレキボール」
            if (target.status.spe.forPowerCalc === 0)
                return 1; // 相手の値が0なら威力は40
            const parameter = pokemon.status.spe.forPowerCalc / target.status.spe.forPowerCalc;
            if (parameter >= 4)
                return 150;
            if (parameter >= 3)
                return 120;
            if (parameter >= 2)
                return 80;
            if (parameter >= 1)
                return 60;
            if (parameter >= 0)
                return 40;
        }
        if (move.name === 'Gyro Ball') { // 技「ジャイロボール」
            if (pokemon.status.spe.forPowerCalc === 0)
                return 1; // 自分の値が0なら威力は1
            return Math.floor(25 * target.status.spe.forPowerCalc / pokemon.status.spe.forPowerCalc) + 1;
        }
        if (move.name === 'Return') { // 技「おんがえし」
            const base = Math.floor(pokemon.happiness * 10 / 25);
            return Math.max(base, 1);
        }
        if (move.name === 'Frustration') { // 技「やつあたり」
            const base = Math.floor((255 - pokemon.happiness) * 10 / 25);
            return Math.max(base, 1);
        }
        if (move.name === 'Trump Card') { // 技「きりふだ」
            const parameter = pokemon.move.learned[pokemon.move.selected.slot].powerPoint.value;
            if (parameter === 0)
                return 200;
            if (parameter === 1)
                return 80;
            if (parameter === 2)
                return 60;
            if (parameter === 3)
                return 50;
            if (parameter >= 4)
                return 40;
        }
        if (move.name === 'Grass Knot' // 技「くさむすび」
            || move.name === 'Low Kick') { // 技「けたぐり」
            const parameter = target.getWeight();
            if (parameter >= 120)
                return 120;
            if (parameter >= 100)
                return 100;
            if (parameter >= 50)
                return 80;
            if (parameter >= 25)
                return 60;
            if (parameter >= 10)
                return 40;
            return 20;
        }
        if (move.name === 'Heat Crash' // 技「ヒートスタンプ」
            || move.name === 'Heavy Slam') { // 技「ヘビーボンバー」
            const parameter = target.getWeight() / pokemon.getWeight();
            if (parameter <= 1 / 5)
                return 120;
            if (parameter <= 1 / 4)
                return 100;
            if (parameter <= 1 / 3)
                return 80;
            if (parameter <= 1 / 2)
                return 60;
            return 40;
        }
        if (move.name === 'Smelling Salts') { // 技「きつけ」
            if (target.statusAilment.isParalysis()) {
                return 140;
            }
        }
        if (move.name === 'Wake-Up Slap') { // 技「めさましビンタ」
            if (target.statusAilment.isAsleep()) {
                return 140;
            }
        }
        if (move.name === 'Hex') { // 技「たたりめ」
            if (!target.statusAilment.isHealth()) {
                return 130;
            }
        }
        if (move.name === 'Weather Ball') { // 技「ウェザーボール」
            if (fieldStatus.weather.isSunny(pokemon))
                return 100;
            if (fieldStatus.weather.isRainy(pokemon))
                return 100;
            if (fieldStatus.weather.isSandy())
                return 100;
            if (fieldStatus.weather.isSnowy())
                return 100;
        }
        if (move.name === 'Terrain Pulse') { // 技「だいちのはどう」
            if (pokemon.isGround()) {
                if (!fieldStatus.terrain.isPlain())
                    return 100;
            }
        }
        if (move.name === 'Rising Voltage') { // 技「ライジングボルト」
            if (target.isGround() && fieldStatus.terrain.isElectric()) {
                return 140;
            }
        }
        if (move.name === 'Gust' // 技「かぜおこし」
            || move.name === 'Twister') { // 技「たつまき」
            ;
        }
        if (move.name === 'Acrobatics') { // 技「アクロバット」
            if (pokemon.item === null) {
                return 110;
            }
        }
        if (move.name === 'Natural Gift') { // 技「しぜんのめぐみ」
            for (const berry of berryTable) {
                if (pokemon.isItem(berry.name) === true) {
                    return berry.naturalGift.power;
                }
            }
        }
        if (move.name === 'Fling') { // 技「なげつける」
            ;
        }
        if (move.name === 'Ice Ball' // 技「アイスボール」
            || move.name === 'Rollout') { // 技「ころがる」
            ;
        }
        if (move.name === 'Echoed Voice') { // 技「エコーボイス」
            ;
        }
        if (move.name === 'Stomping Tantrum') { // 技「じだんだ」
            ;
        }
        if (move.name === 'Triple Kick') { // 技「トリプルキック」
            ;
        }
        if (move.name === 'Triple Axel') { // 技「トリプルアクセル」
            ;
        }
        if (move.name === 'Spit Up') { // 技「はきだす」
            ;
        }
        if (move.name === 'Round') { // 技「りんしょう」
        }
        if (move.name === 'Fury Cutter') { // 技「れんぞくぎり」
            ;
        }
        if (move.name === 'Grass Pledge' // 技「くさのちかい」
            || move.name === 'Fire Pledge' // 技「ほのおのちかい」
            || move.name === 'Water Pledge') { // 技「みずのちかい」
            ;
        }
        if (move.name === 'Fishious Rend' // 技「エラがみ」
            || move.name === 'Bolt Beak') { // 技「でんげきくちばし」
            ;
        }
        if (move.name === 'Pursuit') { // 技「おいうち」
            ;
        }
        if (move.name === 'Payback') { // 技「しっぺがえし」
            ;
        }
        if (move.name === 'Assurance') { // 技「ダメおし」
            ;
        }
        if (move.name === 'Avalanche' // 技「ゆきなだれ」
            || move.name === 'Revenge') { // 技「リベンジ」
            ;
        }
        if (move.name === 'Present') { // 技「プレゼント」
            const random = getRandom();
            if (random >= 0)
                return 40;
            if (random >= 40)
                return 80;
            if (random >= 70)
                return 120;
            if (random >= 88)
                return 0;
        }
        if (move.name === 'Magnitude') { // 技「マグニチュード」
            ;
        }
        if (move.name === 'Water Shuriken') { // 技「みずしゅりけん」
            ;
        }
        // 基礎威力が定義されていない場合、1を返す
        if (move.power === null)
            return 1;
        else
            return move.power;
    };
    const getCorrection = (pokemon, target, basicPower) => {
        const move = pokemon.move.selected;
        let correction = 4096;
        if (main.isExistAbility('Aura Break')) { // 特性「オーラブレイク」
            if (main.isExistAbility('Fairy Aura') && move.type === 'Fairy') { // 特性「フェアリーオーラ」
                correction = Math.round(correction * 3072 / 4096);
            }
            if (main.isExistAbility('Dark Aura') && move.type === 'Dark') { // 特性「ダークオーラ」
                correction = Math.round(correction * 3072 / 4096);
            }
        }
        if (pokemon.ability.isName('Rivalry')) { // 特性「とうそうしん」
            if (pokemon.gender !== target.gender && pokemon.gender !== 'genderless' && target.gender !== 'genderless') {
                correction = Math.round(correction * 3072 / 4096);
            }
        }
        if (pokemon.ability.isName('Galvanize') // 特性「エレキスキン」
            || pokemon.ability.isName('Aerilate') // 特性「スカイスキン」
            || pokemon.ability.isName('Normalize') // 特性「ノーマルスキン」
            || pokemon.ability.isName('Pixilate') // 特性「フェアリースキン」
            || pokemon.ability.isName('Refrigerate')) { // 特性「フリーズスキン」
            if (pokemon.move.selected.skin.text === move.type) {
                correction = Math.round(correction * 4915 / 4096);
                pokemon.move.selected.skin.reset();
            }
        }
        if (pokemon.ability.isName('Reckless')) { // 特性「すてみ」
            if (move.getAddOn().reckLess) {
                correction = Math.round(correction * 4915 / 4096);
            }
        }
        if (pokemon.ability.isName('Iron Fist')) { // 特性「てつのこぶし」
            if (move.getMaster().punch) {
                correction = Math.round(correction * 4915 / 4096);
            }
        }
        if (pokemon.ability.isName('Rivalry')) { // 特性「とうそうしん」
            if (pokemon.gender === target.gender && pokemon.gender !== 'genderless' && target.gender !== 'genderless') {
                correction = Math.round(correction * 5120 / 4096);
            }
        }
        for (const poke of getPokemonInSide(pokemon.isMine())) {
            if (!move.isPhysical())
                continue;
            if (poke.isMine() !== pokemon.isMine())
                continue;
            if (poke.order.battle === pokemon.order.battle)
                continue;
            if (poke.ability.isName('Battery')) { // 特性「バッテリー」
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        for (const poke of getPokemonInSide(pokemon.isMine())) {
            if (poke.isMine() !== pokemon.isMine())
                continue;
            if (poke.order.battle === pokemon.order.battle)
                continue;
            if (poke.ability.isName('Power Spot')) { // 特性「パワースポット」
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        if (pokemon.ability.isName('Tough Claws')) { // 特性「かたいツメ」
            if (pokemon.isContact()) {
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        if (pokemon.ability.isName('Sand Force')) { // 特性「すなのちから」
            if (fieldStatus.weather.isSandy() && (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel')) {
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        if (pokemon.ability.isName('Sheer Force')) { // 特性「ちからずく」
            let isTrue = false;
            for (const move of additionalEffectTargetRank) {
                if (move.name === pokemon.move.selected.name) {
                    isTrue = true;
                }
            }
            for (const move of additionalEffectMyRank) {
                if (move.name === pokemon.move.selected.name) {
                    isTrue = true;
                }
            }
            for (const move of additionalEffectAilment) {
                if (move.name === pokemon.move.selected.name) {
                    isTrue = true;
                }
            }
            for (const move of additionalEffectConfuse) {
                if (move.name === pokemon.move.selected.name) {
                    isTrue = true;
                }
            }
            for (const move of additionalEffectFlinch) {
                if (move.name === pokemon.move.selected.name) {
                    isTrue = true;
                }
            }
            // if ( additionalEffectOthers.includes( pokemon.move.selected.name ) ) {
            // isTrue = true;
            // }
            if (isTrue === true) {
                pokemon.stateChange.sheerForce.isTrue = true;
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        if (pokemon.ability.isName('Punk Rock')) { // 特性「パンクロック」
            if (move.getMaster().sound) {
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        if (main.isExistAbility('Dark Aura')) { // 特性「ダークオーラ」
            if (move.type === 'Dark' && !main.isExistAbility('Aura Break')) { // 特性「オーラブレイク」
                correction = Math.round(correction * 5448 / 4096);
            }
        }
        if (main.isExistAbility('Fairy Aura')) { // 特性「フェアリーオーラ」
            if (move.type === 'Fairy' && !main.isExistAbility('Aura Break')) { // 特性「オーラブレイク」
                correction = Math.round(correction * 5448 / 4096);
            }
        }
        if (pokemon.ability.isName('Strong Jaw')) { // 特性「がんじょうあご」
            if (move.getMaster().bite) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Technician')) { // 特性「テクニシャン」
            if (basicPower !== null && basicPower <= 60) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Toxic Boost')) { // 特性「どくぼうそう」
            if (pokemon.statusAilment.isPoisoned() && move.isPhysical()) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Flare Boost')) { // 特性「ねつぼうそう」
            if (pokemon.statusAilment.isBurned() && move.isSpecial()) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        for (const poke of getPokemonInSide(pokemon.isMine())) {
            if (poke.isMine() !== pokemon.isMine())
                continue;
            if (poke.ability.isName('Steely Spirit')) { // 特性「はがねのせいしん」
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Mega Launcher')) { // 特性「メガランチャー」
            if (move.getMaster().pulse) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (target.ability.isName('Heatproof')) { // 特性「たいねつ」
            if (move.type === 'Fire') {
                correction = Math.round(correction * 2048 / 4096);
            }
        }
        if (target.ability.isName('Dry Skin')) { // 特性「かんそうはだ」
            if (move.type === 'Fire') {
                correction = Math.round(correction * 5120 / 4096);
            }
        }
        if (pokemon.isItem('ちからのハチマキ')) {
            if (move.isPhysical()) {
                correction = Math.round(correction * 4505 / 4096);
            }
        }
        if (pokemon.isItem('ものしりメガネ')) {
            if (move.isSpecial()) {
                correction = Math.round(correction * 4505 / 4096);
            }
        }
        for (const plate of plateTable) {
            if (pokemon.isItem(plate.name) && move.type === plate.type) {
                correction = Math.round(correction * 4915 / 4096);
            }
        }
        for (const incense of incenseTable) {
            if (pokemon.isItem(incense.name) && move.type === incense.type) {
                correction = Math.round(correction * 4915 / 4096);
            }
        }
        if (pokemon.isItem('こころのしずく')) {
            if ((pokemon.name === 'Latias' || pokemon.name === 'Latios') && (move.type === 'Dragon' || move.type === 'Psychic') && !pokemon.stateChange.transform.isTrue) {
                correction = Math.round(correction * 4915 / 4096);
            }
        }
        if (pokemon.isItem('こんごうだま')) {
            if (pokemon.name === 'Dialga' && (move.type === 'Steel' || move.type === 'Dragon') && !pokemon.stateChange.transform.isTrue) {
                correction = Math.round(correction * 4915 / 4096);
            }
        }
        if (pokemon.isItem('しらたま')) {
            if (pokemon.name === 'Palkia' && (move.type === 'Water' || move.type === 'Dragon') && !pokemon.stateChange.transform.isTrue) {
                correction = Math.round(correction * 4915 / 4096);
            }
        }
        if (pokemon.isItem('はっきんだま')) {
            if ((pokemon.name === 'Giratina Altered' || pokemon.name === 'Giratina Origin') && (move.type === 'Steel' || move.type === 'Dragon') && !pokemon.stateChange.transform.isTrue) {
                correction = Math.round(correction * 4915 / 4096);
            }
        }
        if (pokemon.stateChange.gem.text === move.type) {
            correction = Math.round(correction * 5325 / 4096);
            pokemon.stateChange.gem.reset();
        }
        if (move.name === 'Solar Beam' // 技「ソーラービーム」
            || move.name === 'Solar Blade') { // 技「ソーラーブレード」
            if (fieldStatus.weather.isRainy(pokemon) || fieldStatus.weather.isSandy() || fieldStatus.weather.isSnowy()) {
                correction = Math.round(correction * 2048 / 4096);
            }
        }
        if (move.name === 'Grav Apple') { // 技「Ｇのちから」
            if (fieldStatus.whole.gravity.isTrue) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (move.name === 'Knock Off') { // 技「はたきおとす」
            if (target.item.isReleasable(target.name, target.ability.name)) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (move.name === 'Misty Explosion') { // 技「ミストバースト」
            if (fieldStatus.terrain.isMisty() && pokemon.isGround()) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (move.name === 'Expanding Force') { // 技「ワイドフォース」
            if (fieldStatus.terrain.isPsychic() && pokemon.isGround()) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.stateChange.helpingHand.isTrue) {
            for (let i = 0; i < pokemon.stateChange.helpingHand.count; i++) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.stateChange.charge.isTrue) {
            if (move.type === 'Electric') {
                correction = Math.round(correction * 8192 / 4096);
                pokemon.stateChange.charge.reset();
            }
        }
        if (move.name === 'Facade') { // 技「からげんき」
            if (pokemon.statusAilment.isPoisoned() || pokemon.statusAilment.isBurned() || pokemon.statusAilment.isParalysis()) {
                correction = Math.round(correction * 8192 / 4096);
            }
        }
        if (move.name === 'Brine') { // 技「しおみず」
            if (target.status.hp.value.isLessEqual(2)) {
                correction = Math.round(correction * 8192 / 4096);
            }
        }
        if (move.name === 'Venoshock') { // 技「ベノムショック」
            if (pokemon.statusAilment.isPoisoned()) {
                correction = Math.round(correction * 8192 / 4096);
            }
        }
        if (fieldStatus.terrain.isGrassy() && target.isGround()) {
            if (move.name === 'Earthquake' // 技「じしん」
                || move.name === 'Bulldoze' // 技「じならし」
                || move.name === 'Magnitude') { // 技「マグニチュード」
                correction = Math.round(correction * 2048 / 4096);
            }
        }
        if (fieldStatus.terrain.isMisty() && target.isGround()) {
            if (move.type === 'Dragon') {
                correction = Math.round(correction * 2048 / 4096);
            }
        }
        if (fieldStatus.terrain.isElectric()) {
            if (pokemon.isGround() && move.type === 'Electric') {
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        if (fieldStatus.terrain.isGrassy()) {
            if (pokemon.isGround() && move.type === 'Grass') {
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        if (fieldStatus.terrain.isPsychic()) {
            if (pokemon.isGround() && move.type === 'Psychic') {
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        if (fieldStatus.whole.mudSport.isTrue === true) {
            if (move.type === 'Electric') {
                correction = Math.round(correction * 1352 / 4096);
            }
        }
        if (fieldStatus.whole.waterSport.isTrue === true) {
            if (move.type === 'Fire') {
                correction = Math.round(correction * 1352 / 4096);
            }
        }
        return correction;
    };
    // 威力 = 基礎威力 * 威力補正 / 4096
    const basicPower = getBasicPawer(pokemon, target);
    const correction = getCorrection(pokemon, target, basicPower);
    const result = fiveRoundEntry(basicPower * correction / 4096);
    return Math.max(result, 1);
}
// 急所判定
function getStatus(pokemon, target, attack) {
    const getCritical = (pokemon) => {
        return false;
    };
    const getFinalAttack = (pokemon, target) => {
        const getAttack = () => {
            if (pokemon.move.selected.isPhysical()) {
                if (critical)
                    return pokemon.status.atk.rankCorrectionValueAsCritical;
                else
                    return pokemon.status.atk.rankCorrectionValue;
            }
            else {
                if (critical)
                    return pokemon.status.spA.rankCorrectionValueAsCritical;
                else
                    return pokemon.status.spA.rankCorrectionValue;
            }
        };
        let attack = getAttack();
        // はりきり
        if (pokemon.ability.isName('Hustle')) { // 特性「はりきり」
            if (pokemon.move.selected.isPhysical()) {
                attack = Math.floor(attack * 6144 / 4096);
            }
        }
        // 攻撃補正
        let correction = 4096;
        if (pokemon.ability.isName('Slow Start')) { // 特性「スロースタート」
            if (pokemon.stateChange.slowStart.isTrue && pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 2048 / 4096);
            }
        }
        if (pokemon.ability.isName('Defeatist')) { // 特性「よわき」
            if (pokemon.status.hp.value.isLessEqual(2)) {
                correction = Math.round(correction * 2048 / 4096);
            }
        }
        if (main.isExistAbility('Vessel of Ruin') && !pokemon.ability.isName('Vessel of Ruin')) { // 特性「わざわいのうつわ」
            if (pokemon.move.selected.isSpecial()) {
                correction = Math.round(correction * 3072 / 4096);
            }
        }
        if (main.isExistAbility('Tablets of Ruin') && !pokemon.ability.isName('Tablets of Ruin')) { // 特性「わざわいのおふだ」
            if (pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 3072 / 4096);
            }
        }
        if (pokemon.ability.isName('Quark Drive')) { // 特性「クォークチャージ」
            const parameter = pokemon.stateChange.quarkDrive.rank;
            if (parameter === 'atk' && pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 5325 / 4096);
            }
            if (parameter === 'spD' && pokemon.move.selected.isSpecial()) {
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        if (pokemon.ability.isName('Protosynthesis')) { // 特性「こだいかっせい」
            const parameter = pokemon.stateChange.protosynthesis.rank;
            if (parameter === 'atk' && pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 5325 / 4096);
            }
            if (parameter === 'spA' && pokemon.move.selected.isSpecial()) {
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        if (pokemon.ability.isName('Hadron Engine')) { // 特性「ハドロンエンジン」
            if (fieldStatus.terrain.isElectric() && pokemon.move.selected.isSpecial()) {
                correction = Math.round(correction * 5461 / 4096);
            }
        }
        if (pokemon.ability.isName('Orichalcum Pulse')) { // 特性「ひひいろのこどう」
            if (fieldStatus.weather.isSunny(pokemon) && pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 5461 / 4096);
            }
        }
        for (const _pokemon of getPokemonInSide(pokemon.isMine())) {
            if (_pokemon.name !== 'Cherrim')
                continue;
            if (!fieldStatus.weather.isSunny(_pokemon))
                continue;
            if (!_pokemon.ability.isName('Flower Gift'))
                continue; // 特性「フラワーギフト」
            if (!pokemon.move.selected.isPhysical())
                continue;
            correction = Math.round(correction * 6144 / 4096);
        }
        if (pokemon.ability.isName('Guts')) { // 特性「こんじょう」
            if (!pokemon.statusAilment.isHealth() && pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Overgrow')) { // 特性「しんりょく」
            if (pokemon.status.hp.value.isLessThan(3) && pokemon.move.selected.type === 'Grass') {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Blaze')) { // 特性「もうか」
            if (pokemon.status.hp.value.isLessThan(3) && pokemon.move.selected.type === 'Fire') {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Torrent')) { // 特性「げきりゅう」
            if (pokemon.status.hp.value.isLessThan(3) && pokemon.move.selected.type === 'Water') {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Swarm')) { // 特性「むしのしらせ」
            if (pokemon.status.hp.value.isLessThan(3) && pokemon.move.selected.type === 'Bug') {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Flash Fire')) { // 特性「もらいび」
            if (pokemon.stateChange.flashFire.isTrue === true && pokemon.move.selected.type === 'Fire') {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Solar Power')) { // 特性「サンパワー」
            if (fieldStatus.weather.isSunny(pokemon) && pokemon.move.selected.isSpecial()) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Plus') || pokemon.ability.isName('Minus')) { // 特性「プラス」、特性「マイナス」
            for (const _pokemon of getPokemonInSide(pokemon.isMine())) {
                if (isSame(pokemon, _pokemon))
                    continue;
                if (!_pokemon.ability.isName('Plus') && !_pokemon.ability.isName('Minus'))
                    continue;
                if (!pokemon.move.selected.isSpecial())
                    continue;
                correction = Math.round(correction * 6144 / 4096);
                break;
            }
        }
        if (pokemon.ability.isName('Rocky Payload')) { // 特性「いわはこび」
            if (pokemon.move.selected.type === 'Rock') {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Steelworker')) { // 特性「はがねつかい」
            if (pokemon.move.selected.type === 'Steel') {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Gorilla Tactics')) { // 特性「ごりむちゅう」
            if (pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Transistor')) { // 特性「トランジスタ」
            if (pokemon.move.selected.type === 'Electric') {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Dragon’s Maw')) { // 徳しえ「りゅうのあぎと」
            if (pokemon.move.selected.type === 'Dragon') {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.ability.isName('Huge Power') // 特性「ちからもち」
            || pokemon.ability.isName('Pure Power')) { // 特性「ヨガパワー」
            if (pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 8192 / 4096);
            }
        }
        if (pokemon.ability.isName('Water Bubble')) { // 特性「すいほう」
            if (pokemon.move.selected.type === 'Water') {
                correction = Math.round(correction * 8192 / 4096);
            }
        }
        if (target.ability.isName('Thick Fat')) { // 特性「あついしぼう」
            if (pokemon.move.selected.type === 'Fire' || pokemon.move.selected.type === 'Ice') {
                correction = Math.round(correction * 2048 / 4096);
            }
        }
        if (target.ability.isName('Water Bubble')) { // 特性「すいほう」
            if (pokemon.move.selected.type === 'Fire') {
                correction = Math.round(correction * 2048 / 4096);
            }
        }
        if (target.ability.isName('Purifying Salt')) { // 特性「きよめのしお」
            if (pokemon.move.selected.type === 'Ghost') {
                correction = Math.round(correction * 2048 / 4096);
            }
        }
        if (pokemon.isItem('こだわりハチマキ')) {
            if (pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.isItem('こだわりメガネ')) {
            if (pokemon.move.selected.isSpecial()) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (pokemon.isItem('ふといホネ')) {
            if ((pokemon.name === 'Cubone' || pokemon.name === 'Marowak' || pokemon.name === 'Marowak Alola') && pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 8192 / 4096);
            }
        }
        if (pokemon.isItem('しんかいのキバ')) {
            if (pokemon.name === 'Clamperl' && pokemon.move.selected.isSpecial()) {
                correction = Math.round(correction * 8192 / 4096);
            }
        }
        if (pokemon.isItem('でんきだま')) {
            if (pokemon.name === 'Pikachu') {
                correction = Math.round(correction * 8192 / 4096);
            }
        }
        // 最終攻撃
        attack = fiveRoundEntry(attack * correction / 4096);
        return Math.max(attack, 1);
    };
    const getFinalDefense = (pokemon, target) => {
        const getDefense = () => {
            if (pokemon.move.selected.isPhysical()) {
                if (critical)
                    return pokemon.status.def.rankCorrectionValueAsCritical;
                else
                    return pokemon.status.def.rankCorrectionValue;
            }
            else {
                if (critical)
                    return pokemon.status.spD.rankCorrectionValueAsCritical;
                else
                    return pokemon.status.spD.rankCorrectionValue;
            }
        };
        let defense = getDefense();
        // すなあらし
        if (fieldStatus.weather.isSandy()) {
            if (target.type.has('Rock') && pokemon.move.selected.isSpecial()) {
                defense = Math.floor(defense * 6144 / 4096);
            }
        }
        // ゆき
        if (fieldStatus.weather.isSnowy()) {
            if (target.type.has('Ice') && pokemon.move.selected.isPhysical()) {
                defense = Math.floor(defense * 6144 / 4096);
            }
        }
        // 防御補正
        let correction = 4096;
        if (main.isExistAbility('Beads of Ruin') && !target.ability.isName('Beads of Ruin')) { // 特性「わざわいのたま」
            if (pokemon.move.selected.isSpecial()) {
                correction = Math.round(correction * 3072 / 4096);
            }
        }
        if (main.isExistAbility('Sword of Ruin') && !target.ability.isName('Sword of Ruin')) { // 特性「わざわいのつるぎ」
            if (pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 3072 / 4096);
            }
        }
        if (target.ability.isName('Quark Drive')) { // 特性「クォークチャージ」
            const parameter = target.stateChange.quarkDrive.rank;
            if (parameter === 'def' && pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 5325 / 4096);
            }
            if (parameter === 'spD' && pokemon.move.selected.isSpecial()) {
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        if (target.ability.isName('Protosynthesis')) { // 特性「こだいかっせい」
            const parameter = target.stateChange.protosynthesis.rank;
            if (parameter === 'def' && pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 5325 / 4096);
            }
            if (parameter === 'spD' && pokemon.move.selected.isSpecial()) {
                correction = Math.round(correction * 5325 / 4096);
            }
        }
        for (const _pokemon of getPokemonInSide(target.isMine())) {
            // if ( !_pokemon.isName( 'チェリム(ポジ)' ) ) continue;
            if (!fieldStatus.weather.isSunny(_pokemon))
                continue;
            if (!_pokemon.ability.isName('Flower Gift'))
                continue; // 特性「フラワーギフト」
            if (!pokemon.move.selected.isSpecial())
                continue;
            correction = Math.round(correction * 6144 / 4096);
        }
        if (target.ability.isName('Marvel Scale')) { // 特性「ふしぎなうろこ」
            if (!target.statusAilment.isHealth() && pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (target.ability.isName('Grass Pelt')) { // 特性「くさのけがわ」
            if (fieldStatus.terrain.isGrassy() && pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (target.ability.isName('Fur Coat')) { // 特性「ファーコート」
            if (pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 8192 / 4096);
            }
        }
        if (target.isItem('とつげきチョッキ')) {
            if (pokemon.move.selected.isSpecial()) {
                correction = Math.round(correction * 6144 / 4096);
            }
        }
        if (target.isItem('しんかいのウロコ')) {
            if (target.name === 'Clamperl' && pokemon.move.selected.isSpecial()) {
                correction = Math.round(correction * 8192 / 4096);
            }
        }
        if (target.isItem('メタルパウダー')) {
            if (target.name === 'Ditto' && pokemon.move.selected.isPhysical()) {
                correction = Math.round(correction * 8192 / 4096);
            }
        }
        // 最終防御
        defense = fiveRoundEntry(defense * correction / 4096);
        return Math.max(defense, 1);
    };
    // 急所判定
    const critical = getCritical(pokemon);
    attack.critical = critical;
    const finalAttack = getFinalAttack(pokemon, target);
    const finalDefense = getFinalDefense(pokemon, target);
    return finalAttack / finalDefense;
}
function getDamage(pokemon, target, power, status, attack) {
    // 最終ダメージ
    let damage = Math.floor(Math.floor(Math.floor(pokemon.level * 2 / 5 + 2) * power * status) / 50 + 2);
    // 範囲補正
    if (pokemon.stateChange.rangeCorr.isTrue) {
        damage = fiveRoundEntry(damage * 3072 / 4096);
    }
    // 天気補正
    if (fieldStatus.weather.isRainy(target)) {
        if (pokemon.move.selected.type === 'Water') {
            damage = fiveRoundEntry(damage * 1.5);
        }
        if (pokemon.move.selected.type === 'Fire') {
            damage = fiveRoundEntry(damage * 0.5);
        }
    }
    if (fieldStatus.weather.isSunny(target)) {
        if (pokemon.move.selected.type === 'Water') {
            damage = fiveRoundEntry(damage * 0.5);
        }
        if (pokemon.move.selected.type === 'Fire') {
            damage = fiveRoundEntry(damage * 1.5);
        }
    }
    // 急所補正
    if (attack.critical) {
        damage = fiveRoundEntry(damage * 1.5);
    }
    // 乱数補正
    const randomCorrection = Math.floor(getRandom() * 16) + 8500;
    damage = Math.floor(damage * randomCorrection / 10000);
    // タイプ一致補正
    if (pokemon.type.has(pokemon.move.selected.type)) {
        if (pokemon.ability.isName('Adaptability')) { // 特性「てきおうりょく」
            damage = fiveRoundEntry(damage * 2.0);
        }
        else {
            damage = fiveRoundEntry(damage * 1.5);
        }
    }
    // 相性補正
    damage = Math.floor(damage * attack.effective);
    // やけど補正
    if (pokemon.statusAilment.isBurned()) {
        if (pokemon.move.selected.name !== 'Facade' && pokemon.move.selected.isPhysical()) { // 技「からげんき」
            damage = fiveRoundEntry(damage * 0.5);
        }
    }
    // M補正
    let corrM = 1.0;
    // 壁補正
    if (pokemon.ability.isName('Infiltrator') && pokemon.isMine() !== target.isMine()) { // 特性「すりぬけ」
        ;
    }
    else {
        let rate = 0.5;
        if (fieldStatus.battleStyle === 2 || fieldStatus.battleStyle === 3) {
            rate = 2732 / 4096;
        }
        if (fieldStatus.getSide(target.isMine()).auroraVeil.isTrue) {
            corrM = Math.round(corrM * rate);
        }
        else if (fieldStatus.getSide(target.isMine()).reflect.isTrue && pokemon.move.selected.isPhysical()) {
            corrM = Math.round(corrM * rate);
        }
        else if (fieldStatus.getSide(target.isMine()).lightScreen.isTrue && pokemon.move.selected.isSpecial()) {
            corrM = Math.round(corrM * rate);
        }
    }
    // ブレインフォース補正
    if (pokemon.ability.isName('Neuroforce')) { // 特性「ブレインフォース」
        if (attack.effective > 1) {
            corrM = Math.round(corrM * 1.25);
        }
    }
    // スナイパー補正
    if (pokemon.ability.isName('Sniper')) { // 特性「スナイパー」
        if (attack.critical) {
            corrM = Math.round(corrM * 1.5);
        }
    }
    // いろめがね補正
    if (pokemon.ability.isName('Tinted Lens')) { // 特性「いろめがね」
        if (attack.effective < 1) {
            corrM = Math.round(corrM * 2);
        }
    }
    // もふもふほのお補正
    if (target.ability.isName('Fluffy')) { // 特性「もふもふ」
        if (pokemon.move.selected.type === 'Fire') {
            corrM = Math.round(corrM * 2);
        }
    }
    // Mhalf
    if (target.ability.isName('Ice Scales')) { // 特性「こおりのりんぷん」
        if (pokemon.move.selected.isSpecial()) {
            corrM = Math.round(corrM * 0.5);
        }
    }
    if (target.ability.isName('Punk Rock')) { // 特性「パンクロック」
        if (pokemon.move.selected.getMaster().sound) {
            corrM = Math.round(corrM * 0.5);
        }
    }
    if (target.ability.isName('Shadow Shield') // 特性「ファントムガード」
        || target.ability.isName('Multiscale')) { // 特性「マルチスケイル」
        if (target.status.hp.value.isMax()) {
            corrM = Math.round(corrM * 0.5);
        }
    }
    if (target.ability.isName('Fluffy')) { // 特性「もふもふ」
        if (pokemon.isContact()) {
            corrM = Math.round(corrM * 0.5);
        }
    }
    // Mfikter
    if (target.ability.isName('Solid Rock') // 特性「ハードロック」
        || target.ability.isName('Filter') // 特性「フィルター」
        || target.ability.isName('Prism Armor')) { // 特性「プリズムアーマー」
        if (attack.effective > 1) {
            corrM = Math.round(corrM * 0.75);
        }
    }
    // フレンドガード補正
    for (const _pokemon of getPokemonInSide(target.isMine())) {
        if (isSame(target, _pokemon))
            continue;
        if (_pokemon.ability.isName('Friend Guard')) { // 特性「フレンドガード」
            corrM = Math.round(corrM * 0.75);
        }
    }
    // たつじんのおび補正
    if (pokemon.isItem('たつじんのおび')) {
        if (attack.effective > 1) {
            corrM = Math.round(corrM * 4915 / 4096);
        }
    }
    // いのちのたま補正
    if (pokemon.isItem('いのちのたま')) {
        corrM = Math.round(corrM * 5324 / 4096);
    }
    // 半減の実補正
    let isHalfBerry = false;
    if (target.isItem('ホズのみ') && pokemon.move.selected.type === 'Normal') {
        isHalfBerry = true;
    }
    for (const berry of berryTable) {
        if (target.isItem(berry.name) && berry.half === pokemon.move.selected.type && attack.effective > 1) {
            isHalfBerry = true;
        }
    }
    if (isHalfBerry) {
        const ripen = (target.ability.isName('Ripen')) ? 1 / 2 : 1; // 特性「じゅくせい」
        corrM = Math.round(corrM * 2048 * ripen / 4096);
        //eatBerry( target, target.name );
    }
    // Mtwice
    if (target.stateChange.dig.isTrue) {
        if (pokemon.move.selected.name === 'Earthquake' // 技「じしん」
            || pokemon.move.selected.name === 'Magnitude') { // 技「マグニチュード」
            corrM = Math.round(corrM * 2);
        }
    }
    if (target.stateChange.dive.isTrue) {
        if (pokemon.move.selected.name === 'Surf') { // 技「なみのり」
            corrM = Math.round(corrM * 2);
        }
    }
    if (target.stateChange.minimize.isTrue) {
        if (pokemon.move.selected.getAddOn().stomp) {
            corrM = Math.round(corrM * 2);
        }
    }
    if (target.stateChange.dynamax.isTrue) {
        if (pokemon.move.selected.name === 'Behemoth Blade' // 技「きょじゅうざん」
            || pokemon.move.selected.name === 'Behemoth Bash' // 技「きょじゅうだん」
            || pokemon.move.selected.name === 'Dynamax Cannon') { // 技「ダイマックスほう」
            corrM = Math.round(corrM * 2);
        }
    }
    damage = fiveRoundEntry(damage * corrM);
    // 最終ダメージ
    return damage;
}
