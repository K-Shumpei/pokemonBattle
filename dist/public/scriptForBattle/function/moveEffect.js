"use strict";
function moveEffect(pokemon) {
    // 範囲攻撃技
    const isRange = (pokemon) => {
        return pokemon.attack.list.length > 1;
    };
    // 対象全員へのダメージ計算
    calculateDamageForAll(pokemon);
    if (isRange(pokemon)) {
        // みがわり状態に攻撃技が防がれたときの効果: 本体がダメージを受けたとき(4)~(10)などより優先して処理される
    }
    // じばく/だいばくはつ/ミストバースト/ビックリヘッド/てっていこうせん使用時のダメージ: ひんしになるときは使用者のひんし判定
    if (isRange(pokemon)) {
        // ダメージを本体に与える
        damageToBody(pokemon, pokemon.isMine());
        // バツグンの相性判定のメッセージ
        goodCompatibilityMessage(pokemon, pokemon.isMine());
        // 今ひとつの相性判定のメッセージ
        badCompatibilityMessage(pokemon, pokemon.isMine());
        // ダメージの判定に関するメッセージ
        damageDeterminationMessage(pokemon, pokemon.isMine());
        // ダメージをHP1で耐える効果のメッセージなど
        enduringEffectsMessage(pokemon, pokemon.isMine());
        // 追加効果などの発動
        activateAdditionalEffects(pokemon, pokemon.isMine(), isRange(pokemon));
        // ダメージが発生したときの効果
        effectsWhenDamageOccurs(pokemon, pokemon.isMine());
        // ひんし判定
        faintingJudgment(pokemon, pokemon.isMine(), isRange(pokemon));
        // ひんしできんちょうかん/かがくへんかガスが解除されたことによる封じられていた効果の発動
        activateSealedEffects(pokemon, pokemon.isMine(), isRange(pokemon));
    }
    // ダメージを本体に与える
    damageToBody(pokemon, !pokemon.isMine());
    // バツグンの相性判定のメッセージ
    goodCompatibilityMessage(pokemon, !pokemon.isMine());
    // 今ひとつの相性判定のメッセージ
    badCompatibilityMessage(pokemon, !pokemon.isMine());
    // ダメージの判定に関するメッセージ
    damageDeterminationMessage(pokemon, !pokemon.isMine());
    // ダメージをHP1で耐える効果のメッセージなど
    enduringEffectsMessage(pokemon, !pokemon.isMine());
    // 追加効果などの発動
    activateAdditionalEffects(pokemon, !pokemon.isMine(), isRange(pokemon));
    // ダメージが発生したときの効果
    effectsWhenDamageOccurs(pokemon, !pokemon.isMine());
    // ひんし判定
    faintingJudgment(pokemon, !pokemon.isMine(), isRange(pokemon));
    // ひんしできんちょうかん/かがくへんかガスが解除されたことによる封じられていた効果の発動
    activateSealedEffects(pokemon, !pokemon.isMine(), isRange(pokemon));
    // 技の効果
    activateMoveEffect(pokemon);
    // 特性の効果（その1）
    activateAbilityEffectPart1(pokemon);
    // 防御側の持ち物の効果 (その3)
    targetItemEffectPart3(pokemon);
    // いにしえのうた/きずなへんげによるフォルムチェンジ
    formChangeByMove(pokemon);
    // いのちのたまの反動/かいがらのすずの回復
    lifeOrbShellBell(pokemon);
    // 防御側の持ち物の効果 (その4)
    targetItemEffectPart4(pokemon);
    // とんぼがえり/ボルトチェンジ/クイックターンによって手持ちに戻る
    toHandByAttack(pokemon);
    // わるいてぐせ
    activatePickpocket(pokemon);
    // 技の効果
    otherEffect(pokemon);
    // 攻撃側の持ち物の効果
    myItemEffect(pokemon);
    // とんぼがえり/ボルトチェンジ/クイックターン/ききかいひ/にげごし/だっしゅつボタン/だっしゅつパックによる交代先の選択・繰り出し
}
// 対象全員へのダメージ計算
function calculateDamageForAll(pokemon) {
    const getFinalDamage = (pokemon, target, attack, calcDamage) => {
        let result = calcDamage;
        result = Math.max(result, 1);
        result = result % 65536;
        result = Math.min(result, target.status.hp.value.value);
        if (attack.substitute) {
            return Math.min(result, target.stateChange.substitute.hp.value);
        }
        if (result !== target.status.hp.value.value) {
            return result;
        }
        if (target.stateChange.endure.isTrue) {
            target.stateChange.endureMsg.isTrue === true;
            target.stateChange.endureMsg.text === 'こらえる';
            return result - 1;
        }
        if (pokemon.move.selected.name === 'False Swipe' // 技「みねうち」
            || pokemon.move.selected.name === 'Hold Back') { // 技「てかげん」
            target.stateChange.endureMsg.isTrue === true;
            target.stateChange.endureMsg.text === pokemon.move.selected.name;
            return result - 1;
        }
        if (pokemon.ability.isName('Sturdy')) { // 特性「がんじょう」
            if (target.status.hp.value.isMax()) {
                target.stateChange.endureMsg.isTrue === true;
                target.stateChange.endureMsg.text === 'がんじょう';
                return result - 1;
            }
        }
        if (target.isItem('きあいのタスキ')) {
            if (target.status.hp.value.isMax()) {
                target.stateChange.endureMsg.isTrue === true;
                target.stateChange.endureMsg.text === 'きあいのタスキ';
                return result - 1;
            }
        }
        if (target.isItem('きあいのタスキ')) {
            if (getRandom() < 10) {
                target.stateChange.endureMsg.isTrue === true;
                target.stateChange.endureMsg.text === 'きあいのハチマキ';
                return result - 1;
            }
        }
        return result;
    };
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        // ばけのかわ/アイスフェイス
        if (!attack.substitute) {
            if (target.name === 'Mimikyu Disguised' && target.ability.isName('Disguise')) { // ミミッキュ(化けた姿)、特性「ばけのかわ」
                target.stateChange.disguise.isTrue = true;
                continue;
            }
            if (target.name === 'Eiscue Ice' && target.ability.isName('Ice Face') && pokemon.move.selected.isPhysical()) { // コオリッポ(アイス)、特性「アイスフェイス」
                target.stateChange.iceFace.isTrue = true;
                continue;
            }
        }
        // ダメージ計算
        const calcDamage = calculateDamage(pokemon, target, attack);
        // ダメージ計算後の処理
        attack.damage = getFinalDamage(pokemon, target, attack, calcDamage);
    }
}
// ダメージを本体に与える
function damageToBody(pokemon, isMe) {
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        if (target.isMine() !== isMe)
            continue;
        target.status.hp.value.sub(attack.damage);
        target.msgDamage(attack.damage);
    }
}
// バツグンの相性判定のメッセージ
function goodCompatibilityMessage(pokemon, isMe) {
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        if (target.isMine() !== isMe)
            continue;
        if (attack.effective <= 1)
            continue;
        pokemon.msgSuperEffective(target.getArticle());
    }
}
// 今ひとつの相性判定のメッセージ
function badCompatibilityMessage(pokemon, isMe) {
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        if (target.isMine() !== isMe)
            continue;
        if (attack.effective >= 1)
            return;
        pokemon.msgNotEffective(target.getArticle());
    }
}
// ダメージの判定に関するメッセージ
function damageDeterminationMessage(pokemon, isMe) {
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        if (target.isMine() !== isMe)
            continue;
        if (attack.critical) {
            pokemon.msgCritical(target.getArticle());
        }
    }
}
// ダメージをHP1で耐える効果のメッセージなど
function enduringEffectsMessage(pokemon, isMe) {
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        if (target.isMine() !== isMe)
            continue;
        if (!target.stateChange.endureMsg.isTrue)
            return;
        if (target.stateChange.endureMsg.text === 'こらえる') {
            target.msgEndure();
        }
        if (target.stateChange.endureMsg.text === 'がんじょう') {
            target.msgDeclareAbility();
            target.msgEndure();
        }
        if (target.stateChange.endureMsg.text === 'きあいのタスキ') {
            target.consumeItem();
            target.msgFocusSash();
        }
        if (target.stateChange.endureMsg.text === 'きあいのハチマキ') {
            target.msgFocusBand();
        }
        target.stateChange.endureMsg.reset();
    }
}
// 追加効果などの発動
function activateAdditionalEffects(pokemon, isMe, isRange) {
    const master = pokemon.move.selected.getMaster();
    const addOn = pokemon.move.selected.getAddOn();
    const lower = (pokemon, target, attack) => {
        if (master.category !== 'damage+lower')
            return;
        if (!pokemon.isAdditionalEffect(target, attack))
            return;
        if (!pokemon.isAdditionalRate(master.stat.chance))
            return;
        for (const changes of master.stat.changes) {
            const stat = changes.stat;
            const change = changes.change;
            if (!target.isChangeRankByOther(stat, change, pokemon))
                continue;
            target.changeRankByOther(stat, change, pokemon);
        }
    };
    const raiseByAdditional = (pokemon) => {
        if (master.category !== 'damage+raise')
            return;
        if (pokemon.stateChange.sheerForce.isTrue)
            return;
        if (!pokemon.isAdditionalRate(master.stat.chance))
            return;
        for (const changes of master.stat.changes) {
            const stat = changes.stat;
            const change = changes.change;
            if (!pokemon.isChangeRank(stat, change))
                continue;
            pokemon.changeRank(stat, change);
        }
    };
    const raiseNotAdditional = (pokemon) => {
        if (master.category !== 'damage+raise')
            return;
        for (const changes of master.stat.changes) {
            const stat = changes.stat;
            const change = changes.change;
            if (!pokemon.isChangeRank(stat, change))
                continue;
            pokemon.changeRank(stat, change);
        }
    };
    const ailment = (pokemon, target, attack) => {
        if (master.category !== 'damage+ailment')
            return;
        if (!pokemon.isAdditionalEffect(target, attack))
            return;
        if (!pokemon.isAdditionalRate(master.ailment.chance))
            return;
        target.getAilmentByAdditionalEffect(master.ailment.name, pokemon);
    };
    const confuse = (pokemon, target, attack) => {
        if (master.category !== 'damage+ailment')
            return;
        if (master.ailment.name !== 'confusion')
            return;
        if (!pokemon.isAdditionalEffect(target, attack))
            return;
        if (!pokemon.isAdditionalRate(master.ailment.chance))
            return;
        if (!target.isGetConfusionByAdditionalEffect(pokemon))
            return;
        target.stateChange.confuse.onActivate(target);
    };
    const flinch = (pokemon, target, attack) => {
        if (master.flinch === 0)
            return;
        if (!pokemon.isAdditionalEffect(target, attack))
            return;
        if (!pokemon.isAdditionalFlinch(master.flinch))
            return;
        target.stateChange.flinch.isTrue = true;
    };
    const anchorShot = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Anchor Shot' // 技「アンカーショット」
            && pokemon.move.selected.name !== 'Spirit Shackle')
            return; // 技「かげぬい」
        if (!pokemon.isAdditionalEffect(target, attack))
            return;
        if (target.type.has('Ghost'))
            return;
        if (target.stateChange.cannotEscape.isTrue)
            return;
        target.stateChange.cannotEscape.onActivate(pokemon, target);
    };
    const saltCure = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Salt Cure')
            return; // 技「しおづけ」
        if (!pokemon.isAdditionalEffect(target, attack))
            return;
        ;
        if (target.stateChange.saltCure.isTrue)
            return;
        target.stateChange.saltCure.onActivate(target);
    };
    const throatChop = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Throat Chop')
            return; // 技「じごくづき」
        if (!pokemon.isAdditionalEffect(target, attack))
            return;
        if (target.stateChange.throatChop.isTrue)
            return;
        target.stateChange.throatChop.onActivate();
    };
    const triAttack = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Tri Attack')
            return; // 技「トライアタック」
        if (!pokemon.isAdditionalEffect(target, attack))
            return;
        if (!pokemon.isAdditionalRate(master.ailment.chance))
            return;
        const rate = getRandom();
        if (rate < 100 / 3) {
            target.getAilmentByAdditionalEffect('paralysis', pokemon);
        }
        else if (rate < 200 / 3) {
            target.getAilmentByAdditionalEffect('burn', pokemon);
        }
        else {
            target.getAilmentByAdditionalEffect('freeze', pokemon);
        }
    };
    const fling = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Fling')
            return; // 技「なげつける」
        const item = pokemon.stateChange.fling.item;
        pokemon.stateChange.fling.reset();
        if (!pokemon.isAdditionalEffect(target, attack))
            return;
        if (item === 'でんきだま') {
            target.getAilmentByAdditionalEffect('paralysis', pokemon);
        }
        if (item === 'かえんだま') {
            target.getAilmentByAdditionalEffect('burn', pokemon);
        }
        if (item === 'どくバリ') {
            target.getAilmentByAdditionalEffect('poison', pokemon);
        }
        if (item === 'どくどくだま') {
            target.statusAilment.getBadPoisoned(item);
        }
        if (item === 'おうじゃのしるし' || item === 'するどいキバ') {
            target.stateChange.flinch.onActivate();
        }
        if (item === 'しろいハーブ') {
            if (target.status.useWhiteHerb()) {
                target.msgWhiteHerb();
            }
        }
        const master = itemMaster.filter(i => i.nameEN === item)[0];
        const category = categoryList.filter(c => c.name === master.category)[0];
        if (category.pocket === 'berries') {
            target.item.belch = true;
            if (target.isEatBerryInstantly(item)) {
                target.activateCheekPouch();
            }
        }
    };
    const direClaw = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Dire Claw')
            return; // 技「フェイタルクロー」
        if (!pokemon.isAdditionalEffect(target, attack))
            return;
        if (!pokemon.isAdditionalRate(master.ailment.chance))
            return;
        const rate = getRandom();
        if (rate < 100 / 3) {
            target.getAilmentByAdditionalEffect('poison', pokemon);
        }
        else if (rate < 200 / 3) {
            target.getAilmentByAdditionalEffect('paralysis', pokemon);
        }
        else {
            target.getAilmentByAdditionalEffect('sleep', pokemon);
        }
    };
    // 一度だけ発動する
    if (!isRange) {
        if (pokemon.move.selected.name === 'Fling') { // 技「なげつける」
            pokemon.stateChange.fling.onActivate(pokemon);
        }
        if (addOn.additional) { // 自分のランク変化
            raiseByAdditional(pokemon);
        }
        else {
            raiseNotAdditional(pokemon);
        }
    }
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        if (target.isMine() !== isMe)
            continue;
        // HP吸収技
        if (master.category === 'damage+heal') {
            const value = () => {
                const base = Math.round(attack.damage * master.drain / 100);
                if (pokemon.isItem('おおきなねっこ')) {
                    return fiveRoundEntry(base * 5324 / 4096);
                }
                else {
                    return base;
                }
            };
            if (target.ability.isName('Liquid Ooze')) { // 特性「ヘドロえき」
                if (pokemon.isAbility('Magic Guard'))
                    return; // 特性「マジックガード」
                target.msgDeclareAbility();
                pokemon.status.hp.value.sub(value());
                pokemon.msgLiquidOoze();
            }
            else {
                if (pokemon.status.hp.value.isMax())
                    return;
                if (pokemon.stateChange.healBlock.isTrue)
                    return;
                pokemon.status.hp.value.add(value());
                pokemon.msgDrain(target.getArticle());
            }
        }
        // 追加効果
        if (!addOn.additional)
            continue;
        lower(pokemon, target, attack); // 対象のランク変化
        ailment(pokemon, target, attack); // 状態異常付与
        confuse(pokemon, target, attack); // 混乱付与
        flinch(pokemon, target, attack); // ひるみ付与
        // その他の追加効果
        anchorShot(pokemon, target, attack); // アンカーショット・かげぬい
        saltCure(pokemon, target, attack); // しおづけ
        throatChop(pokemon, target, attack); // じごくづき
        triAttack(pokemon, target, attack); // トライアタック
        fling(pokemon, target, attack); // なげつける
        direClaw(pokemon, target, attack); // フェイタルクロー
    }
}
// ダメージが発生したときの効果
function effectsWhenDamageOccurs(pokemon, isMe) {
    const clearSmog = (pokemon, target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (pokemon.move.selected.name !== 'Clear Smog')
            return; // 技「クリアスモッグ」
        target.status.toZeroAllRank();
        target.msgClearSmog();
    };
    const poisonTouch = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!pokemon.isContact())
            return;
        if (!pokemon.ability.isName('Poison Touch'))
            return; // 特性「どくしゅ」
        if (target.ability.isName('Shield Dust'))
            return; // 特性「りんぷん」
        if (getRandom() >= 30)
            return;
        if (!target.isGetAilmentByOther('Poisoned', pokemon))
            return;
        pokemon.msgDeclareAbility();
        target.statusAilment.getPoisoned();
        // battleLog.write( `${getArticle( target )}に 毒を あびせた!` );
    };
    const synchronize = (pokemon, target) => {
        if (!target.ability.isName('Synchronize'))
            return; // 特性「シンクロ」
        if (!target.stateChange.synchronize.isTrue)
            return;
        const ailment = target.stateChange.synchronize.text;
        if (ailment === 'Poisoned' || ailment === 'BadPoisoned' || ailment === 'Burned' || ailment === 'Paralysis') {
            target.msgDeclareAbility();
            pokemon.statusAilment.getBurned();
        }
        target.stateChange.synchronize.reset();
    };
    const roughSkin = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!pokemon.isContact())
            return;
        if (!target.ability.isName('Rough Skin') // 特性「さめはだ」
            && !target.ability.isName('Iron Barbs'))
            return; // 特性「てつのトゲ」
        target.msgDeclareAbility();
        if (pokemon.isItem('ぼうごパット')) {
            pokemon.msgProtectivePads();
            return;
        }
        if (pokemon.ability.isName('Magic Guard')) { // 特性「マジックガード」
            return;
        }
        const value = Math.max(1, Math.floor(pokemon.getOrgHP() / 8));
        pokemon.status.hp.value.sub(value);
        pokemon.msgRoughSkin();
    };
    const effectSpore = (pokemon, target, attack) => {
        const random = Math.floor(getRandom());
        if (attack.substitute)
            return;
        if (!pokemon.isContact())
            return;
        if (!target.ability.isName('Effect Spore'))
            return; // 特性「ほうし」
        if (pokemon.type.has('Grass'))
            return;
        if (pokemon.ability.isName('Overcoat'))
            return; // 特性「ぼうじん」
        if (pokemon.isItem('ぼうじんゴーグル'))
            return;
        if (pokemon.isItem('ぼうごパット'))
            return;
        if (random >= 30)
            return;
        if (random < 9) {
            if (!pokemon.isGetAilmentByOther('Poisoned', target))
                return;
            target.msgDeclareAbility();
            pokemon.statusAilment.getPoisoned();
        }
        else if (random < 19) {
            if (!pokemon.isGetAilmentByOther('Paralysis', target))
                return;
            target.msgDeclareAbility();
            pokemon.statusAilment.getParalysis();
        }
        else {
            if (!pokemon.isGetAilmentByOther('Asleep', target))
                return;
            target.msgDeclareAbility();
            pokemon.statusAilment.getAsleep();
        }
    };
    const poisonPoint = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!pokemon.isContact())
            return;
        if (!target.ability.isName('Poison Point'))
            return; // 特性「どくのトゲ」
        if (pokemon.isItem('ぼうごパット'))
            return;
        if (getRandom() > 30)
            return;
        if (!pokemon.isGetAilmentByOther('Poisoned', target))
            return;
        target.msgDeclareAbility();
        pokemon.statusAilment.getPoisoned();
    };
    const staticElectricity = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!pokemon.isContact())
            return;
        if (!target.ability.isName('Static'))
            return; // 特性「せいでんき」
        if (pokemon.isItem('ぼうごパット'))
            return;
        if (getRandom() > 30)
            return;
        if (!pokemon.isGetAilmentByOther('Paralysis', target))
            return;
        target.msgDeclareAbility();
        pokemon.statusAilment.getParalysis();
    };
    const flameBody = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!pokemon.isContact())
            return;
        if (!target.ability.isName('Flame Body'))
            return; // 特性「ほのおのからだ」
        if (pokemon.isItem('ぼうごパット'))
            return;
        if (getRandom() > 30)
            return;
        if (!pokemon.isGetAilmentByOther('Burned', target))
            return;
        target.msgDeclareAbility();
        pokemon.statusAilment.getBurned();
    };
    const mummy = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!pokemon.isContact())
            return;
        if (!target.ability.isName('Mummy') // 特性「ミイラ」
            && !target.ability.isName('Lingering Aroma'))
            return; // 特性「とれないにおい」
        const master = pokemon.ability.changeMaster();
        if (master.exchange === 0 || master.exchange === 2)
            return;
        if (pokemon.isItem('ぼうごパット')) {
            pokemon.msgProtectivePads();
            return;
        }
        target.msgDeclareAbility();
        pokemon.ability.name = target.ability.name;
        if (target.ability.isName('Mummy')) { // 特性「ミイラ」
            pokemon.msgMummy();
        }
        if (target.ability.isName('Lingering Aroma')) { // 特性「とれないにおい」
            pokemon.msgLingeringAroma();
        }
    };
    const gooey = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!pokemon.isContact())
            return;
        if (!target.ability.isName('Gooey') // 特性「ぬめぬめ」
            && !target.ability.isName('Tangling Hair'))
            return; // 特性「カーリーヘアー」
        target.msgDeclareAbility();
        if (pokemon.isItem('ぼうごパット')) {
            pokemon.msgProtectivePads();
            return;
        }
        pokemon.changeRankByOther('spe', -1, target);
    };
    const wanderingSpirit = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!pokemon.isContact())
            return;
        if (!target.ability.isName('Wandering Spirit'))
            return; // 特性「さまようたましい」
        if (pokemon.isItem('ぼうごパット'))
            return;
        if (pokemon.stateChange.dynamax.isTrue)
            return;
        if (target.stateChange.dynamax.isTrue)
            return;
        const master = pokemon.ability.changeMaster();
        if (master.exchange === 0 || master.exchange === 2)
            return;
        target.msgDeclareAbility();
        target.msgExchangeAbility();
        [pokemon.ability.name, target.ability.name] = [target.ability.name, pokemon.ability.name];
        if (pokemon.isMine() !== target.isMine()) {
            pokemon.msgDeclareAbility();
            target.msgDeclareAbility();
        }
    };
    const cursedBody = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!target.ability.isName('Cursed Body'))
            return; // 特性「のろわれボディ」
        if (pokemon.status.hp.value.isZero())
            return;
        // if ( pokemon.stateChange.disable.isTrue ) return; ダイマックス技に対しては発動しない
        if (pokemon.stateChange.disable.isTrue)
            return;
        if (main.isExistAbilityInSide(pokemon.isMine(), 'Aroma Veil'))
            return; // 特性「アロマベール」
        if (getRandom() >= 30)
            return;
        target.msgDeclareAbility();
        pokemon.stateChange.disable.onActivate(pokemon);
    };
    const stamina = (target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.ability.isName('Stamina'))
            return; // 特性「じきゅうりょく」
        if (!target.isChangeRank('def', 1))
            return;
        target.msgDeclareAbility();
        target.changeRank('def', 1);
    };
    const sandSpit = (target, attack) => {
        if (attack.substitute)
            return;
        if (!target.ability.isName('Sand Spit'))
            return; // 特性「すなはき」
        if (!fieldStatus.weather.isGetSandy())
            return;
        target.msgDeclareAbility();
        fieldStatus.weather.getSandy(target);
    };
    const cottonDown = (target, attack) => {
        if (attack.substitute)
            return;
        if (!target.ability.isName('Cotton Down'))
            return; // 特性「わたげ」
        const valid = [];
        for (const poke of main.getPokemonInBattle()) {
            if (poke.isMine() == target.isMine() && poke.order.party === target.order.party)
                continue;
            if (poke.stateChange.substitute.isTrue)
                continue;
            if (poke.stateChange.isHide())
                continue;
            valid.push(poke);
        }
        if (valid.length === 0)
            return;
        // すりぬけの考慮が未実装
        target.msgDeclareAbility();
        for (const poke of valid) {
            poke.changeRankByOther('spe', -1, target);
        }
    };
    const gulpMissile = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!target.ability.isName('Gulp Missile'))
            return; // 特性「うのミサイル」
        if (target.name === 'Cramorant')
            return; // ウッウ
        if (target.stateChange.isHide())
            return;
        if (pokemon.status.hp.value.isZero())
            return;
        target.msgDeclareAbility();
        if (!pokemon.ability.isName('Magic Guard')) { // 特性「マジックガード」
            const value = Math.max(1, Math.floor(pokemon.getOrgHP() / 4));
            pokemon.status.hp.value.sub(value);
        }
        rank: if (target.name === 'Cramorant Gulping') { // ウッウ(鵜呑み)
            if (!pokemon.isChangeRankByOther('def', -1, target))
                break rank;
            pokemon.changeRankByOther('def', -1, target);
        }
        ailment: if (target.name === 'Cramorant Gorging') { // ウッウ(丸呑み)
            if (!pokemon.isGetAilmentByOther('Paralysis', target))
                break ailment;
            pokemon.statusAilment.getParalysis();
        }
        target.formChange();
    };
    const seedSower = (target, attack) => {
        if (attack.substitute)
            return;
        if (!target.ability.isName('Seed Sower'))
            return; // 特性「こぼれダネ」
        if (main.field.terrain.isGrassy())
            return;
        target.msgDeclareAbility();
        main.field.terrain.getGrassy(target);
    };
    const electromorphosis = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!target.ability.isName('Electromorphosis'))
            return; // 特性「でんきにかえる」
        if (target.status.hp.value.isZero())
            return;
        target.msgDeclareAbility();
        target.stateChange.charge.isTrue = true;
        target.msgElectromorphosis(pokemon.move.selected.translate());
    };
    const weakArmor = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!pokemon.move.selected.isPhysical())
            return;
        if (!target.ability.isName('Weak Armor'))
            return; // 特性「くだけるよろい」
        if (!target.isChangeRank('def', -1) && !target.isChangeRank('spe', -2))
            return;
        target.msgDeclareAbility();
        target.changeRank('def', -1);
        target.changeRank('spe', 2);
    };
    const toxicDebris = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!pokemon.move.selected.isPhysical())
            return;
        if (!target.ability.isName('Toxic Debris'))
            return; // 特性「どくげしょう」
        if (main.field.getSide(!target.isMine()).toxicSpikes.count === 2)
            return;
        target.msgDeclareAbility();
        main.field.getSide(!target.isMine()).toxicSpikes.onActivate();
    };
    const waterCompaction = (pokemon, target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.ability.isName('Water Compaction'))
            return; // 特性「みずがため」
        if (pokemon.move.selected.type !== 'Water')
            return;
        if (!target.isChangeRank('def', 2))
            return;
        target.msgDeclareAbility();
        target.changeRank('def', 2);
    };
    const justified = (pokemon, target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.ability.isName('Justified'))
            return; // 特性「せいぎのこころ」
        if (pokemon.move.selected.type !== 'Dark')
            return;
        if (!target.isChangeRank('atk', 1))
            return;
        target.msgDeclareAbility();
        target.changeRank('atk', 1);
    };
    const rattled = (pokemon, target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.ability.isName('Rattled'))
            return; // 特性「びびり」
        if (pokemon.move.selected.type !== 'Dark'
            && pokemon.move.selected.type !== 'Ghost'
            && pokemon.move.selected.type !== 'Bug')
            return;
        if (!target.isChangeRank('spe', 1))
            return;
        target.msgDeclareAbility();
        target.changeRank('spe', 1);
    };
    const steamEngine = (pokemon, target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.ability.isName('Steam Engine'))
            return; // 特性「じょうききかん」
        if (pokemon.move.selected.type !== 'Water'
            && pokemon.move.selected.type !== 'Fire')
            return;
        if (!target.isChangeRank('spe', 6))
            return;
        target.msgDeclareAbility();
        target.changeRank('spe', 6);
    };
    const windPower = (pokemon, target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.ability.isName('Wind Power'))
            return; // 特性「ふうりょくでんき」
        if (!pokemon.move.selected.getAddOn().wind)
            return;
        target.msgDeclareAbility();
        target.stateChange.charge.isTrue = true;
        target.msgElectromorphosis(pokemon.move.selected.translate());
    };
    const angerPoint = (target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.ability.isName('Anger Point'))
            return; // 特性「いかりのつぼ」
        if (!attack.critical)
            return;
        target.msgDeclareAbility();
        target.status.atk.rank.add(12);
        target.msgAngerPoint();
    };
    const halfBerry = (target) => {
        if (!target.stateChange.halfBerry.isTrue)
            return;
        target.msgHalfBerry();
        target.stateChange.halfBerry.reset();
        target.activateCheekPouch();
    };
    const enigmaBerry = (target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.isItem('ナゾのみ'))
            return;
        if (attack.effective <= 1)
            return;
        if (attack.damage === 0)
            return;
        target.eatEnigmaBerry();
        target.consumeItem();
    };
    const weaknessPolicy = (target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.isItem('じゃくてんほけん'))
            return;
        if (attack.effective <= 1)
            return;
        if (!target.isChangeRank('atk', 2) && !target.isChangeRank('spA', 2))
            return;
        target.changeRank('atk', 2, 'じゃくてんほけん');
        target.changeRank('spA', 2, 'じゃくてんほけん');
        target.consumeItem();
    };
    const cellBattery = (pokemon, target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.isItem('じゅうでんち'))
            return;
        if (pokemon.move.selected.type !== 'Electric')
            return;
        if (!target.isChangeRank('atk', 1))
            return;
        target.changeRank('atk', 1, 'じゅうでんち');
        target.consumeItem();
    };
    const snowball = (pokemon, target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.isItem('ゆきだま'))
            return;
        if (pokemon.move.selected.type !== 'Ice')
            return;
        if (!target.isChangeRank('atk', 1))
            return;
        target.changeRank('atk', 1, 'ゆきだま');
        target.consumeItem();
    };
    const absorbBulb = (pokemon, target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.isItem('きゅうこん'))
            return;
        if (pokemon.move.selected.type !== 'Water')
            return;
        if (!target.isChangeRank('spA', 1))
            return;
        target.changeRank('spA', 1, 'きゅうこん');
        target.consumeItem();
    };
    const luminousMoss = (pokemon, target, attack) => {
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!target.isItem('ひかりごけ'))
            return;
        if (pokemon.move.selected.type !== 'Water')
            return;
        if (!target.isChangeRank('spD', 1))
            return;
        target.changeRank('spD', 1, 'ひかりごけ');
        target.consumeItem();
    };
    const rockyHelmet = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!target.isItem('ゴツゴツメット'))
            return;
        if (!pokemon.isContact())
            return;
        if (pokemon.isItem('ぼうごパット'))
            return;
        if (pokemon.ability.isName('Magic Guard'))
            return; // 特性「マジックガード」
        if (pokemon.status.hp.value.isZero())
            return;
        const value = Math.floor(pokemon.getOrgHP() / 8);
        pokemon.status.hp.value.sub(value);
        target.msgRockyHelmet();
    };
    const stickyBarb = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!target.isItem('くっつきバリ'))
            return;
        if (!pokemon.isContact())
            return;
        if (!pokemon.item.isNull())
            return;
        [pokemon.item.name, target.item.name] = [target.item.name, pokemon.item.name];
    };
    const airBalloon = (target, attack) => {
        if (attack.substitute)
            return;
        if (!target.isItem('ふうせん'))
            return;
        target.item.name = null;
        target.msgAirBalloon();
    };
    const incinerate = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (pokemon.move.selected.name !== 'Incinerate')
            return; // 技「やきつくす」
        if (target.ability.isName('Sticky Hold'))
            return; // 特性「ねんちゃく」
        if (target.item.getMaster().category !== 'jeweles'
            && target.item.getCategory().pocket !== 'berries')
            return;
        target.msgIncinerate();
        target.item.name = null;
    };
    const jabocaBerry = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!target.isItem('ジャポのみ'))
            return;
        if (!pokemon.move.selected.isPhysical())
            return;
        if (pokemon.ability.isName('Magic Guard'))
            return; // 特性「マジックガード」
        if (pokemon.status.hp.value.isZero())
            return;
        const value = Math.floor(pokemon.getOrgHP() / 8);
        pokemon.status.hp.value.sub(value);
        pokemon.msgJabocaBerry(target.getArticle());
        target.consumeItem();
    };
    const rowapBerry = (pokemon, target, attack) => {
        if (attack.substitute)
            return;
        if (!target.isItem('レンブのみ'))
            return;
        if (!pokemon.move.selected.isSpecial())
            return;
        if (pokemon.ability.isName('Magic Guard'))
            return; // 特性「マジックガード」
        if (pokemon.status.hp.value.isZero())
            return;
        const value = Math.floor(pokemon.getOrgHP() / 8);
        pokemon.status.hp.value.sub(value);
        pokemon.msgRowapBerry(target.getArticle());
        target.consumeItem();
    };
    const disguise = (target) => {
        if (!target.stateChange.disguise.isTrue)
            return;
        target.stateChange.disguise.reset();
        target.msgDeclareAbility();
        target.formChange();
        target.msgDisguise();
        const value = Math.floor(target.getOrgHP() / 8);
        target.status.hp.value.sub(value);
    };
    const iceFace = (target) => {
        if (!target.stateChange.iceFace.isTrue)
            return;
        target.stateChange.iceFace.reset();
        target.msgDeclareAbility();
        target.formChange();
        target.msgIceFace();
    };
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        if (target.isMine() !== isMe)
            continue;
        // コアパニッシャー
        target.stateChange.rage.onEffective(target, attack); // いかり
        clearSmog(pokemon, target, attack); // クリアスモッグ
        target.stateChange.grudge.onEffective(target, pokemon); // おんねん
        target.stateChange.beakBlast.onEffective(target, pokemon, attack); // くちばしキャノン
        poisonTouch(pokemon, target, attack); // どくしゅ
        // 防御側の特性
        // ゆうばく
        // とびだすなかみ
        // synchronize( pokemon, target );            // シンクロ
        roughSkin(pokemon, target, attack); // さめはだ、てつのトゲ
        effectSpore(pokemon, target, attack); // ほうし
        poisonPoint(pokemon, target, attack); // どくのトゲ
        staticElectricity(pokemon, target, attack); // せいでんき
        flameBody(pokemon, target, attack); // ほのおのからだ
        target.stateChange.attract.onActivateByCuteCharm(target, pokemon, attack); // メロメロボディ
        mummy(pokemon, target, attack); // ミイラ、とれないにおい
        gooey(pokemon, target, attack); // ぬめぬめ、カーリーヘアー
        wanderingSpirit(pokemon, target, attack); // さまようたましい
        target.stateChange.perishSong.onActivateByPerishBody(target, pokemon, attack); // ほろびのボディ
        cursedBody(pokemon, target, attack); // のろわれボディ
        stamina(target, attack); // じきゅうりょく
        sandSpit(target, attack); // すなはき
        cottonDown(target, attack); // わたげ
        gulpMissile(pokemon, target, attack); // うのミサイル
        seedSower(target, attack); // こぼれダネ
        electromorphosis(pokemon, target, attack); // でんきにかえる
        weakArmor(pokemon, target, attack); // くだけるよろい
        toxicDebris(pokemon, target, attack); // どくげしょう
        waterCompaction(pokemon, target, attack); // みずがため
        justified(pokemon, target, attack); // せいぎのこころ
        rattled(pokemon, target, attack); // びびり
        steamEngine(pokemon, target, attack); // じょうききかん
        windPower(pokemon, target, attack); // ふうりょくでんき
        angerPoint(target, attack); // いかりのつぼ
        // 防御側の持ち物の効果（その１）
        halfBerry(target); // 半減きのみ
        enigmaBerry(target, attack); // ナゾのみ
        weaknessPolicy(target, attack); // じゃくtねんほけん
        cellBattery(pokemon, target, attack); // じゅうでんち
        snowball(pokemon, target, attack); // ゆきだま
        absorbBulb(pokemon, target, attack); // きゅうこん
        luminousMoss(pokemon, target, attack); // ひかりごけ
        rockyHelmet(pokemon, target, attack); // ゴツゴツメット
        stickyBarb(pokemon, target, attack); // くっつきバリ
        airBalloon(target, attack); // ふうせん
        // やきつくすによるきのみ/6-ジュエルの消失
        incinerate(pokemon, target, attack);
        // 防御側の持ち物の効果（その２）
        jabocaBerry(pokemon, target, attack); // ジャポのみ
        rowapBerry(pokemon, target, attack); // レンブのみ
        // 防御側のばけのかわ/アイスフェイス
        disguise(target); // ばけのかわ
        iceFace(target); // アイスフェイス
    }
}
// ひんし判定
function faintingJudgment(pokemon, isMe, isRange) {
    // いのちがけ使用者のひんし: 防御側にダメージを与え、特性や持ち物の効果が発動した後にひんしになる
    // 防御側のひんし
    // 味方の特性や持ち物の効果による攻撃側のひんし
    // みちづれによる攻撃側のひんし: 防御側にダメージを与え、特性や持ち物の効果が発動した後にひんしになる
    if (isRange) {
        // 防御側のひんし
        for (const attack of pokemon.attack.getTargetToPokemon()) {
            const target = main.getPokemonByBattle(attack);
            if (target.isMine() !== isMe)
                continue;
            if (!target.isFainted())
                continue;
            attack.fainted = true;
            target.toHand();
        }
        // 味方の特性や持ち物の効果による攻撃側のひんし
        if (pokemon.isFainted()) {
            pokemon.toHand();
        }
    }
    if (!isRange) {
        // いのちがけ使用者のひんし: 防御側にダメージを与え、特性や持ち物の効果が発動した後にひんしになる
        if (pokemon.move.selected.name === 'Final Gambit') { // 技「いのちがけ」
            pokemon.status.hp.value.toZero();
            pokemon.isFainted();
            pokemon.toHand();
        }
        // 防御側のひんし
        for (const attack of pokemon.attack.getTargetToPokemon()) {
            const target = main.getPokemonByBattle(attack);
            if (!target.isFainted())
                continue;
            if (target.isMine() !== isMe)
                continue;
            attack.fainted = true;
            target.toHand();
        }
        // みちづれによる攻撃側のひんし: 防御側にダメージを与え、特性や持ち物の効果が発動した後にひんしになる
        for (const attack of pokemon.attack.getTargetToPokemonFainted()) {
            const target = main.getPokemonByParty(attack.isMe, attack.party);
            if (target.isMine() !== isMe)
                continue;
            if (!target.stateChange.destinyBond.isTrue)
                continue;
            if (pokemon.stateChange.dynamax.isTrue)
                return;
            target.msgDestinyBond();
            pokemon.status.hp.value.toZero();
            pokemon.isFainted();
            pokemon.toHand();
        }
    }
}
// ひんしできんちょうかん/かがくへんかガスが解除されたことによる封じられていた効果の発動
function activateSealedEffects(pokemon, isMe, isRange) {
    if (pokemon.status.hp.value.isZero() === false)
        return;
    if (pokemon.ability.isName('Unnerve')) { // 特性「きんちょうかん」
        /*
        for ( const order of getSpeedOrder() ) {
          const target: Pokemon | false = getPokemonByBattle( order.isMe, order.battleNumber );
          if ( target === false ) continue;
          if ( isEnableEatBerry( target ) === true ) {
            eatBerry( target, target.item.name );
          }
        }
        */
    }
    if (pokemon.ability.isName('Neutralizing Gas')) { // 特性「かがくへんかガス」
    }
}
// 技の効果
function activateMoveEffect(pokemon) {
    const master = pokemon.move.selected.getMaster();
    const addOn = pokemon.move.selected.getAddOn();
    const recoil = (pokemon, attack) => {
        // わるあがきの反動ダメージは無視されない
        if (pokemon.move.selected.name !== 'Struggle') { // 技「わるあがき」
            if (pokemon.ability.isName('Magic Guard'))
                return; // 特性「マジックガード」
            if (pokemon.ability.isName('Rock Head'))
                return; // 特性「いしあたま」
        }
        // 与ダメージ依存の反動技
        if (master.drain < 0 && attack.damage > 0) {
            const value = Math.max(1, Math.round(attack.damage * master.drain / 100));
            pokemon.status.hp.value.add(value);
            pokemon.msgRecoil();
        }
        // 与ダメージ非依存の反動技
        if (master.healing < 0) {
            const value = Math.max(1, Math.round(pokemon.getOrgHP() * master.healing / 100));
            pokemon.status.hp.value.add(value);
            pokemon.msgRecoil();
        }
        // ひんし判定
        if (pokemon.isFainted()) {
            pokemon.toHand();
        }
    };
    const bind = (pokemon, target, attack) => {
        if (master.ailment.name !== 'trap')
            return;
        if (target.status.hp.value.isZero())
            return;
        if (target.stateChange.bind.isTrue)
            return;
        if (attack.substitute) {
            // if ( pokemon.move.selected.name === 'キョダイサジン) ) return;
            // if ( pokemon.move.selected.name === 'キョダイヒャッカ) ) return;
        }
        target.stateChange.bind.onActivate(pokemon, target);
    };
    const secretPower = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Secret Power')
            return; // 技「ひみつのちから」
        if (target.status.hp.value.isZero())
            return;
        if (!pokemon.isAdditionalEffect(target, attack))
            return;
        if (!pokemon.isAdditionalRate(30))
            return;
        if (fieldStatus.terrain.isElectric()) {
            target.getAilmentByAdditionalEffect('paralysis', pokemon);
        }
        if (fieldStatus.terrain.isGrassy()) {
            target.getAilmentByAdditionalEffect('sleep', pokemon);
        }
        if (fieldStatus.terrain.isPsychic()) {
            if (target.isChangeRankByOther('spe', -1, pokemon)) {
                target.changeRankByOther('spe', -1, pokemon);
            }
        }
        if (fieldStatus.terrain.isMisty()) {
            if (target.isChangeRankByOther('spA', -1, pokemon)) {
                target.changeRankByOther('spA', -1, pokemon);
            }
        }
        if (fieldStatus.terrain.isPlain()) {
            target.getAilmentByAdditionalEffect('paralysis', pokemon);
        }
    };
    const fellStinger = (pokemon, target) => {
        if (pokemon.move.selected.name !== 'Fell Stinger')
            return; // 技「とどめばり」
        if (!target.status.hp.value.isZero())
            return;
        if (!pokemon.isChangeRank('atk', 3))
            return;
        pokemon.msgDeclareAbility();
        pokemon.changeRank('atk', 3);
    };
    const knockOff = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Knock Off')
            return; // 技「はたきおとす」
        if (target.item.name === null)
            return;
        if (target.ability.isName('Sticky Hold'))
            return; // 特性「ねんちゃく」
        if (attack.substitute)
            return;
        pokemon.msgKnockOff(target.getArticle(), target.item.name);
        target.item.name = null;
    };
    const thief = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Thief' // 技「どろぼう」
            && pokemon.move.selected.name !== 'Covet')
            return; // 技「ほしがる」
        if (pokemon.item.name !== null)
            return;
        if (target.item.name === null)
            return;
        if (attack.substitute)
            return;
        if (target.ability.isName('Sticky Hold')) { // 特性「ねんちゃく」
            target.msgDeclareAbility();
            pokemon.msgNotThief(target.getArticle());
            return;
        }
        pokemon.msgThief(target.getArticle(), target.item.name);
        [pokemon.item.name, target.item.name] = [target.item.name, pokemon.item.name];
        /*
        if ( isEnableEatBerry( pokemon ) === true ) {
          eatBerry( pokemon, pokemon.item.name );
        }
        */
    };
    const bugBite = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Bug Bite' // 技「むしくい」
            && pokemon.move.selected.name !== 'Pluck')
            return; // 技「ついばむ」
        if (pokemon.item.name !== null)
            return;
        if (target.item.name === null)
            return;
        if (attack.substitute)
            return;
        if (target.ability.isName('Sticky Hold'))
            return; // 特性「ねんちゃく」
        if (target.item.getCategory().pocket !== 'berries')
            return;
        const berry = target.item.name;
        target.item.name = null;
        pokemon.msgBugBote(berry);
        // きのみを食べたら発動
        pokemon.item.belch = true;
        // 効果があれば発動
        if (pokemon.isEatBerryInstantly(berry)) {
            pokemon.activateCheekPouch();
        }
    };
    const smackDown = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Smack Down' // 技「うちおとす」
            && pokemon.move.selected.name !== 'Thousand Arrows')
            return; // 技「サウザンアロー」
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (target.isGround())
            return;
        target.stateChange.magnetRise.reset();
        target.stateChange.telekinesis.reset();
        target.stateChange.smackDown.isTrue = true;
        target.msgSmackDown();
    };
    const thousandWaves = (pokemon, target) => {
        if (pokemon.move.selected.name !== 'Thousand Waves')
            return; // 技「サウザンウェーブ」
        if (target.status.hp.value.isZero())
            return;
        if (target.type.has('Ghost'))
            return;
        if (target.stateChange.cannotEscape.isTrue)
            return;
        target.stateChange.cannotEscape.onActivate(pokemon, target);
    };
    const jawLock = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Jaw Lock')
            return; // 技「くらいつく」
        if (target.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (pokemon.stateChange.cannotEscape.isTrue)
            return;
        if (target.stateChange.cannotEscape.isTrue)
            return;
        if (pokemon.type.has('Ghost'))
            return;
        if (target.type.has('Ghost'))
            return;
        target.stateChange.cannotEscape.onActivateJawLock(pokemon, target);
    };
    const plasmaFists = (pokemon) => {
        if (pokemon.move.selected.name !== 'Plasma Fists')
            return; // 技「プラズマフィスト」
        if (pokemon.status.hp.value.isZero())
            return;
        fieldStatus.whole.ionDeluge.isTrue = true;
        battleLog.write(`電子のシャワーが 降りそそいだ!`);
    };
    const genesisSupernova = (pokemon) => {
        if (pokemon.move.selected.name !== 'Genesis Supernova')
            return; // 技「オリジンズスーパーノヴァ」
        if (pokemon.stateChange.sheerForce.isTrue)
            return;
        if (fieldStatus.terrain.isPsychic())
            return;
        fieldStatus.terrain.getPsychic(pokemon);
    };
    const rapidSpin = (pokemon) => {
        if (pokemon.move.selected.name !== 'Rapid Spin' // 技「こうそくスピン」
            && pokemon.move.selected.name !== 'Mortal Spin')
            return; // 技「キラースピン」
        if (pokemon.stateChange.sheerForce.isTrue)
            return;
        if (pokemon.stateChange.ingrain.isTrue) {
            pokemon.stateChange.ingrain.reset();
            battleLog.write(``);
        }
        main.field.getSide(pokemon.isMine()).spikes.onRemove();
        main.field.getSide(pokemon.isMine()).toxicSpikes.onRemove();
        main.field.getSide(pokemon.isMine()).stealthRock.onRemove();
        main.field.getSide(pokemon.isMine()).stickyWeb.onRemove();
    };
    const splinteredStormshards = (pokemon) => {
        if (pokemon.move.selected.name !== 'Splintered Stormshards')
            return; // 技「ラジアルエッジストーム」
        main.field.terrain.resetWithMessage();
    };
    const scald = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Scald' // 技「ねっとう」
            && pokemon.move.selected.name !== 'Steam Eruption')
            return; // 技「スチームバースト」
        if (attack.substitute)
            return;
        if (pokemon.stateChange.sheerForce.isTrue)
            return;
        target.statusAilment.getHealth();
    };
    const hydroSteam = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Hydro Steam')
            return; // 技「ハイドロスチーム」
        if (attack.substitute)
            return;
        target.statusAilment.getHealth();
    };
    const smellingSalts = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Smelling Salts')
            return; // 技「きつけ」
        if (attack.substitute)
            return;
        if (!target.statusAilment.isParalysis())
            return;
        target.statusAilment.getHealth();
    };
    const wakeUpSlap = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Wake-Up Slap')
            return; // 技「めざましビンタ」
        if (attack.substitute)
            return;
        if (!target.statusAilment.isAsleep())
            return;
        target.statusAilment.getHealth();
    };
    const sparklingAria = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Sparkling Aria')
            return; // 技「うたかたのアリア」
        if (pokemon.stateChange.sheerForce.isTrue)
            return;
        if (!target.statusAilment.isBurned())
            return;
        /*
        for ( const data of targetList ) {
          if ( data.target.isItem( 'おんみつマント' ) === true ) continue;
          if ( data.target.ability.isName( 'りんぷん' ) && targetList.length === 1 ) continue;
    
          cureAilment( data.target, 'ASLEEP' );
        }
        */
        target.statusAilment.getHealth();
    };
    const eerieSpell = (pokemon, target, attack) => {
        if (pokemon.move.selected.name !== 'Eerie Spell')
            return; // 技「ぶきみなじゅもん」
        if (!pokemon.isAdditionalEffect(target, attack))
            return;
        // battleLog.write( `${getArticle( one.target)}の ${}を ${}削った!` );
    };
    // 炎技を受けたポケモンの氷を溶かす
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        if (!pokemon.move.selected.isType('Fire'))
            return;
        if (pokemon.move.selected.isStatus())
            return;
        if (target.status.hp.value.isZero())
            return;
        if (!target.statusAilment.isFrozen())
            return;
        target.statusAilment.getHealth();
    }
    // 以下の効果は攻撃側が瀕死なら発動しない
    if (pokemon.order.battle === null)
        return;
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        recoil(pokemon, attack); // 反動技による反動ダメージ
        bind(pokemon, target, attack); // バインド状態
        secretPower(pokemon, target, attack); // ひみつのちからの追加効果
        fellStinger(pokemon, target); // とどめばり
        knockOff(pokemon, target, attack); // はたきおとす
        thief(pokemon, target, attack); // どろぼう、ほしがる
        bugBite(pokemon, target, attack); // むしくい、ついばむ
        smackDown(pokemon, target, attack); // うちおとす、サウザンアロー
        thousandWaves(pokemon, target); // サウザンウェーブ
        jawLock(pokemon, target, attack); // くらいつく
        plasmaFists(pokemon); // プラズマフィスト
        genesisSupernova(pokemon); // オリジンズスーパーノヴァ
        rapidSpin(pokemon); // こうそくスピン、キラースピン
        splinteredStormshards(pokemon); // ラジアルエッジストーム
        scald(pokemon, target, attack); // ねっとう、スチームバースト
        hydroSteam(pokemon, target, attack); // ハイドロスチーム
        smellingSalts(pokemon, target, attack); // きつけ
        wakeUpSlap(pokemon, target, attack); // めざましビンタ
        sparklingAria(pokemon, target, attack); // うたかたのアリア
        eerieSpell(pokemon, target, attack); // ぶきみなじゅもん
    }
    // 変化技の効果
    if (pokemon.move.selected.getMaster().class === 'status') {
        statusMoveEffect(pokemon);
    }
}
// 特性の効果（その1）
function activateAbilityEffectPart1(pokemon) {
    const magician = (pokemon) => {
        if (!pokemon.ability.isName('Magician'))
            return; // 特性「マジシャン」
        if (pokemon.item.isNull())
            return;
        if (pokemon.move.selected.isStatus())
            return;
        if (pokemon.move.selected.name === 'Fling')
            return; // 技「なげつける」
        if (pokemon.move.selected.name === 'Natural Gift')
            return; // 技「しぜんのめぐみ」
        if (pokemon.move.selected.name === 'Future Sight')
            return; // 技「みらいよち」
        if (pokemon.move.selected.name === 'Doom Desire')
            return; // 技「はめつのねがい」
        for (const attack of pokemon.attack.getTargetToPokemon()) {
            const target = main.getPokemonByBattle(attack);
            if (attack.substitute)
                return;
            if (!pokemon.item.isReleasable(pokemon.name, pokemon.ability.name))
                return;
            if (!target.item.isReleasable(target.name, target.ability.name))
                return;
            if (target.ability.isName('Sticky Hold') && target.order.battle !== null)
                return; // 特性「ねんちゃく」
        }
    };
    const moxie = (pokemon) => {
        if (!pokemon.ability.isName('Moxie'))
            return; // 特性「じしんかじょう」
        const number = pokemon.attack.getTargetToPokemonFainted().length;
        if (!pokemon.isChangeRank('atk', number))
            return;
        pokemon.msgDeclareAbility();
        pokemon.changeRank('atk', number);
    };
    const beastBoost = (pokemon) => {
        if (!pokemon.ability.isName('Beast Boost'))
            return; // 特性「ビーストブースト」
        // 倒したポケモンの数
        const number = pokemon.attack.getTargetToPokemonFainted().length;
        const statusValue = [
            { status: 'atk', value: pokemon.status.atk.rankCorrVal },
            { status: 'def', value: pokemon.status.def.rankCorrVal },
            { status: 'spA', value: pokemon.status.spA.rankCorrVal },
            { status: 'spD', value: pokemon.status.spD.rankCorrVal },
            { status: 'spe', value: pokemon.status.spe.rankCorrVal },
        ];
        statusValue.sort((a, b) => {
            if (a.value > b.value)
                return 1;
            if (a.value < b.value)
                return -1;
            if (getRandom() > 50)
                return 1;
            else
                return -1;
        });
        const status = statusValue[0].status;
        if (!pokemon.isChangeRank(status, number))
            return;
        pokemon.msgDeclareAbility();
        pokemon.changeRank(status, number);
    };
    const grimNeigh = (pokemon) => {
        if (!pokemon.ability.isName('Grim Neigh'))
            return; // 特性「くろのいななき」
        const number = pokemon.attack.getTargetToPokemonFainted().length;
        if (!pokemon.isChangeRank('spA', number))
            return;
        pokemon.msgDeclareAbility();
        pokemon.changeRank('spA', number);
    };
    const chillingNeigh = (pokemon) => {
        if (!pokemon.ability.isName('Chilling Neigh'))
            return; // 特性「しろのいななき」
        const number = pokemon.attack.getTargetToPokemonFainted().length;
        if (!pokemon.isChangeRank('atk', number))
            return;
        pokemon.msgDeclareAbility();
        pokemon.changeRank('atk', number);
    };
    const colorChange = (pokemon, target) => {
        if (!target.ability.isName('Color Change'))
            return; // 特性「へんしょく」
        if (pokemon.move.selected.isStatus())
            return;
        if (target.type.has(pokemon.move.selected.type))
            return;
        if (pokemon.move.selected.name === 'Struggle')
            return; // 技「わるあがき」
        if (pokemon.move.selected.type === null)
            return;
        if (pokemon.stateChange.sheerForce.isTrue)
            return;
        const type = pokemon.move.selected.type;
        target.msgDeclareAbility();
        target.type.toType(type);
    };
    const berserk = (pokemon, target) => {
        if (!target.ability.isName('Berserk'))
            return; // 特性「ぎゃくじょう」
    };
    const angerShell = (pokemon, target) => {
        if (!target.ability.isName('Anger Shell'))
            return; // 特性「いかりのこうら」
    };
    if (pokemon.order.battle === null)
        return;
    const targetPokemon = [pokemon];
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        targetPokemon.push(target);
    }
    targetPokemon.sort((a, b) => {
        // 素早さ
        if (a.status.spe.actionOrder > b.status.spe.actionOrder)
            return 1;
        if (a.status.spe.actionOrder < b.status.spe.actionOrder)
            return -1;
        // 乱数
        if (getRandom() > 50)
            return 1;
        else
            return -1;
    });
    for (const target of targetPokemon) {
        // 攻撃側
        if (isSame(pokemon, target)) {
            magician(target); // マジシャン
            moxie(target); // じしんかじょう
            beastBoost(target); // ビーストブースト
            grimNeigh(target); // くろのいななき
            chillingNeigh(target); // しろのいななき
        }
        // 防御側
        if (!isSame(pokemon, target)) {
            colorChange(pokemon, target); // へんしょく
            berserk(pokemon, target); // ぎゃくじょう
            angerShell(pokemon, target); // いかりのこうら
        }
    }
}
// 防御側の持ち物の効果 (その4)
function targetItemEffectPart3(pokemon) {
    const keeBerry = (pokemon, target, attack) => {
        if (!target.isItem('アッキのみ'))
            return;
        if (!pokemon.move.selected.isPhysical())
            return;
        if (attack.substitute)
            return;
        if (!target.isChangeRank('def', 1))
            return;
        if (pokemon.stateChange.sheerForce.isTrue)
            return;
        target.eatKeeBerry();
    };
    const marangaBerry = (pokemon, target, attack) => {
        if (!target.isItem('タラプのみ'))
            return;
        if (!pokemon.move.selected.isSpecial())
            return;
        if (attack.substitute)
            return;
        if (!target.isChangeRank('spD', 1))
            return;
        if (pokemon.stateChange.sheerForce.isTrue)
            return;
        target.eatMarangaBerry();
    };
    const ejectButton = (pokemon, target, attack) => {
        if (!target.isItem('だっしゅつボタン'))
            return;
    };
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        keeBerry(pokemon, target, attack); // アッキのみ
        marangaBerry(pokemon, target, attack); // タラプのみ
        ejectButton(pokemon, target, attack); // だっしゅつボタン
    }
}
// いにしえのうた/きずなへんげによるフォルムチェンジ
function formChangeByMove(pokemon) {
    const relicSong = (pokemon) => {
        if (pokemon.move.selected.name !== 'Relic Song')
            return; // 技「いにしえのうた」
        if (pokemon.name !== 'Meloetta Aria' // メロエッタ(ボイス)
            && pokemon.name !== 'Meloetta Pirouette') { // メロエッタ(ステップ)
            return;
        }
        if (pokemon.stateChange.sheerForce.isTrue)
            return;
        if (pokemon.status.hp.value.isZero())
            return;
        pokemon.formChange();
        pokemon.msgRelicSong();
    };
    const battleBond = (pokemon) => {
        if (!pokemon.ability.isName('Battle Bond'))
            return; // 特性「きずなへんげ」
        if (pokemon.name !== 'Greninja Ash')
            return; // サトシゲッコウガ
        if (!pokemon.isChangeRank('atk', 1)
            && !pokemon.isChangeRank('spA', 1)
            && !pokemon.isChangeRank('spe', 1))
            return;
        const number = pokemon.attack.getTargetToPokemonFainted().length;
        if (number === 0)
            return;
        pokemon.changeRank('atk', 1);
        pokemon.changeRank('spA', 1);
        pokemon.changeRank('spe', 1);
        pokemon.msgDeclareAbility();
        pokemon.msgBattleBond();
    };
    relicSong(pokemon); // いにしえのうた
    battleBond(pokemon); // きずなへんげ
}
// いのちのたまの反動/かいがらのすずの回復
function lifeOrbShellBell(pokemon) {
    const lifeOrb = (pokemon) => {
        if (!pokemon.isItem('いのちのたま'))
            return;
        if (pokemon.status.hp.value.isZero())
            return;
        if (pokemon.move.selected.isStatus())
            return;
        if (pokemon.order.battle === null)
            return;
        if (pokemon.ability.isName('Magic Guard'))
            return; // 特性「マジックガード」
        if (pokemon.stateChange.sheerForce.isTrue)
            return;
        const damage = Math.max(1, Math.floor(pokemon.getOrgHP() / 10));
        pokemon.status.hp.value.sub(damage);
        pokemon.msgLifeOrb();
    };
    const shellBell = (pokemon) => {
        if (!pokemon.isItem('かいがらのすず'))
            return;
        if (pokemon.status.hp.value.isZero())
            return;
        if (pokemon.order.battle === null)
            return;
        if (pokemon.stateChange.sheerForce.isTrue)
            return;
        let value = 0;
        for (const attack of pokemon.attack.getTargetToPokemon()) {
            value += attack.damage;
        }
        if (value === 0)
            return;
        const damage = Math.max(1, Math.floor(value / 8));
        pokemon.status.hp.value.add(damage);
        pokemon.msgShellBell();
    };
    lifeOrb(pokemon); // いのちのたま
    shellBell(pokemon); // かいがらのずず
}
// 防御側の持ち物の効果 (その4)
function targetItemEffectPart4(pokemon) {
    const oranBerry = (target) => {
        if (!target.isItem('オボンのみ'))
            return;
        if (!target.isActivateBerryByHP(2))
            return;
        if (target.stateChange.healBlock.isTrue)
            return;
        target.eatOranBerry();
        target.consumeItem();
    };
    const sitrusBerry = (target) => {
        if (!target.isItem('オボンのみ'))
            return;
        if (!target.isActivateBerryByHP(2))
            return;
        if (target.stateChange.healBlock.isTrue)
            return;
        target.eatSitrusBerry();
        target.consumeItem();
    };
    const figyBerry = (target) => {
        if (!target.isItem('フィラのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        if (target.stateChange.healBlock.isTrue)
            return;
        target.eatFigyBerry();
        target.consumeItem();
    };
    const wikiBerry = (target) => {
        if (!target.isItem('ウイのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        if (target.stateChange.healBlock.isTrue)
            return;
        target.eatWikiBerry();
        target.consumeItem();
    };
    const magoBerry = (target) => {
        if (!target.isItem('マゴのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        if (target.stateChange.healBlock.isTrue)
            return;
        target.eatMagoBerry();
        target.consumeItem();
    };
    const aguavBerry = (target) => {
        if (!target.isItem('バンジのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        if (target.stateChange.healBlock.isTrue)
            return;
        target.eatAguavBerry();
        target.consumeItem();
    };
    const iapapaBerry = (target) => {
        if (!target.isItem('イアのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        if (target.stateChange.healBlock.isTrue)
            return;
        target.eatIapapaBerry();
        target.consumeItem();
    };
    const liechiBerry = (target) => {
        if (!target.isItem('チイラのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        if (!target.isChangeRank('atk', 1))
            return;
        target.eatLiechiBerry();
        target.consumeItem();
    };
    const ganlonBerry = (target) => {
        if (!target.isItem('リュガのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        if (!target.isChangeRank('def', 1))
            return;
        target.eatGanlonBerry();
        target.consumeItem();
    };
    const salacBerry = (target) => {
        if (!target.isItem('カムラのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        if (!target.isChangeRank('spe', 1))
            return;
        target.eatSalacBerry();
        target.consumeItem();
    };
    const petayaBerry = (target) => {
        if (!target.isItem('ヤタピのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        if (!target.isChangeRank('spA', 1))
            return;
        target.eatPetayaBerry();
        target.consumeItem();
    };
    const apicotBerry = (target) => {
        if (!target.isItem('ズアのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        if (!target.isChangeRank('spD', 1))
            return;
        target.eatApicotBerry();
        target.consumeItem();
    };
    const lansatBerry = (target) => {
        if (!target.isItem('サンのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        if (target.stateChange.focusEnergy.isTrue)
            return;
        target.eatLansatBerry();
        target.consumeItem();
    };
    const starfBerry = (target) => {
        if (!target.isItem('スターのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        if (!target.isChangeRank('atk', 2)
            && !target.isChangeRank('def', 2)
            && !target.isChangeRank('spA', 2)
            && !target.isChangeRank('spD', 2)
            && !target.isChangeRank('spe', 2))
            return;
        target.eatStarfBerry();
        target.consumeItem();
    };
    const micleBerry = (target) => {
        if (!target.isItem('ミクルのみ'))
            return;
        if (!target.isActivateBerryByHP(4))
            return;
        target.eatMicleBerry();
        target.consumeItem();
    };
    const berryJuice = (target) => {
        if (!target.isItem('きのみジュース'))
            return;
        if (!target.isActivateBerryByHP(2))
            return;
        if (pokemon.stateChange.healBlock.isTrue)
            return;
        target.eatBerryJuice();
        target.consumeItem();
    };
    const electricSeed = (target) => {
        if (!target.isItem('エレキシード'))
            return;
        if (!main.field.terrain.isElectric())
            return;
        if (!target.isChangeRank('def', 1))
            return;
        target.changeRank('def', 1, 'エレキシード');
        target.consumeItem();
    };
    const grassySeed = (target) => {
        if (!target.isItem('グラスシード'))
            return;
        if (!main.field.terrain.isGrassy())
            return;
        if (!target.isChangeRank('def', 1))
            return;
        target.changeRank('def', 1, 'グラスシード');
        target.consumeItem();
    };
    const psychicSeed = (target) => {
        if (!target.isItem('サイコシード'))
            return;
        if (!main.field.terrain.isPsychic())
            return;
        if (!target.isChangeRank('spD', 1))
            return;
        target.changeRank('spD', 1, 'サイコシード');
        target.consumeItem();
    };
    const mistySeed = (target) => {
        if (!target.isItem('ミストシード'))
            return;
        if (!main.field.terrain.isMisty())
            return;
        if (!target.isChangeRank('spD', 1))
            return;
        target.changeRank('spD', 1, 'ミストシード');
        target.consumeItem();
    };
    const roomService = (target) => {
        if (!target.isItem('ルームサービス'))
            return;
        if (main.field.whole.trickRoom.isTrue)
            return;
        if (!target.isChangeRank('spe', -1))
            return;
        target.changeRank('spe', -1, 'ルームサービス');
        target.consumeItem();
    };
    const targetList = [];
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        targetList.push({ target: target, attack: attack });
    }
    targetList.sort((a, b) => {
        if (a.target.status.spe.actionOrder > b.target.status.spe.actionOrder)
            return 1;
        if (a.target.status.spe.actionOrder < b.target.status.spe.actionOrder)
            return -1;
        if (getRandom() > 50)
            return 1;
        else
            return -1;
    });
    for (const row of targetList) {
        const target = row.target;
        const attack = row.attack;
        if (target.status.hp.value.isZero())
            continue;
        oranBerry(target); // オレンのみ
        sitrusBerry(target); // オボンのみ
        figyBerry(target); // フィラのみ
        wikiBerry(target); // ウイのみ
        magoBerry(target); // マゴのみ
        aguavBerry(target); // バンジのみ
        iapapaBerry(target); // イアのみ
        liechiBerry(target); // チイラのみ
        ganlonBerry(target); // リュガのみ
        salacBerry(target); // カムラのみ
        petayaBerry(target); // ヤタピのみ
        apicotBerry(target); // ズアのみ
        lansatBerry(target); // サンのみ
        micleBerry(target); // ミクルのみ
        berryJuice(target); // きのみジュース
        if (attack.damage === 0)
            continue;
        electricSeed(target); // エレキシード
        grassySeed(target); // グラスシード
        psychicSeed(target); // サイコシード
        mistySeed(target); // ミストシード
        roomService(target); // ルームサービス
    }
}
// とんぼがえり/ボルトチェンジ/クイックターンによって手持ちに戻る
function toHandByAttack(pokemon) {
    if (pokemon.status.hp.value.isZero())
        return;
    if (!main.getPlayer(pokemon.isMine()).isExcangable())
        return;
    switch (pokemon.move.selected.name) {
        case 'U-turn': // 技「とんぼがえり」
        case 'Volt Switch': // 技「ボルトチェンジ」
        case 'Flip Turn': // 技「クイックターン」
            pokemon.toHand();
            break;
        default:
            break;
    }
}
// わるいてぐせ
function activatePickpocket(pokemon) {
    const targetList = [];
    for (const attack of pokemon.attack.getTargetToPokemon()) {
        const target = main.getPokemonByBattle(attack);
        targetList.push({ target: target, attack: attack });
    }
    targetList.sort((a, b) => {
        if (a.target.status.spe.actionOrder > b.target.status.spe.actionOrder)
            return 1;
        if (a.target.status.spe.actionOrder < b.target.status.spe.actionOrder)
            return -1;
        if (getRandom() > 50)
            return 1;
        else
            return -1;
    });
    for (const row of targetList) {
        const target = row.target;
        const attack = row.attack;
        if (!target.ability.isName('Pickpocket'))
            continue; // 特性「わるいてぐせ」
        if (!pokemon.isContact())
            continue;
        if (target.item.isNull())
            continue;
        if (!pokemon.item.isNull())
            continue;
        if (!target.item.isReleasable(target.name, target.ability.name))
            continue;
        if (pokemon.stateChange.sheerForce.isTrue)
            continue;
        if (pokemon.ability.isName('Sticky Hold'))
            continue; // 特性「ねんちゃく」
        if (attack.substitute)
            continue;
        [pokemon.item, target.item] = [target.item, pokemon.item];
        target.msgDeclareAbility();
        target.msgPickpocket();
    }
}
// 技の効果
function otherEffect(pokemon) {
    if (pokemon.move.selected.name === 'Burn Up') { // 技「もえつきる」
        // if ( pokemon.type1 === 'FIRE' ) pokemon.type1 = null;
        // if ( pokemon.type2 === 'FIRE' ) pokemon.type2 = null;
        battleLog.write(`${pokemon.getArticle()}の 炎は 燃え尽きた!`);
    }
    naturalGift: if (pokemon.move.selected.name === 'Natural Gift') { // 技「しぜんのめぐみ」
        if (pokemon.order.battle === null)
            break naturalGift;
        pokemon.consumeItem();
    }
    if (pokemon.move.selected.name === 'Steel Roller') { // 技「アイアンローラー」
        fieldStatus.terrain.resetWithMessage();
    }
    iceSpinner: if (pokemon.move.selected.name === 'Ice Spinner') { // 技「アイススピナー」
        if (pokemon.order.battle === null)
            break iceSpinner;
        main.field.terrain.resetWithMessage();
    }
}
// 攻撃側の持ち物の効果
function myItemEffect(pokemon) {
    const leppaBerry = (pokemon) => {
        if (!pokemon.isItem('ヒメリのみ'))
            return;
        if (pokemon.move.learned[pokemon.move.selected.slot].powerPoint.isPlus())
            return;
        pokemon.eatLeppaBerry();
        pokemon.consumeItem();
    };
    const throatSpray = (pokemon) => {
        if (!pokemon.isItem('のどスプレー'))
            return;
        if (!pokemon.isChangeRank('spA', 1))
            return;
        if (pokemon.attack.getTargetToPokemon().length === 0)
            return;
        if (pokemon.order.battle === null)
            return;
        pokemon.changeRank('spA', 1, 'のどスプレー');
        pokemon.consumeItem();
    };
    leppaBerry(pokemon); // ヒメリのみ
    throatSpray(pokemon); // のどスプレー
}
