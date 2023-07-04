"use strict";
function moveEffect(pokemon) {
    if (pokemon.moveUsed.category !== '変化') {
        // シングルバトルの場合
        if (fieldStatus.battleStyle === 1) {
            const damage = pokemon.damage[0];
            const target = getPokemonByBattle(damage.trainer, damage.battle);
            if (target === false)
                return;
            // 対象全員へのダメージ計算
            calculateDamageForAll(pokemon, target, damage);
            // みがわり状態に攻撃技が防がれたときの効果: 本体がダメージを受けたとき(4)~(10)などより優先して処理される
            // じばく/だいばくはつ/ミストバースト/ビックリヘッド/てっていこうせん使用時のダメージ: ひんしになるときは使用者のひんし判定
            // ダメージを本体に与える
            damageToBody(target, damage);
            // バツグンの相性判定のメッセージ
            goodCompatibilityMessage(pokemon, target, damage);
            // 今ひとつの相性判定のメッセージ
            badCompatibilityMessage(pokemon, target, damage);
            // ダメージの判定に関するメッセージ
            damageDeterminationMessage(pokemon, target, damage);
            // ダメージをHP1で耐える効果のメッセージなど
            enduringEffectsMessage(target);
            // 追加効果などの発動
            activateAdditionalEffects(pokemon, target, damage);
            // ダメージが発生したときの効果
            effectsWhenDamageOccurs(pokemon, target, damage);
            // ひんし判定
            faintingJudgment(pokemon, target, 1);
            faintingJudgment(pokemon, target, 2);
            faintingJudgment(pokemon, target, 3);
            faintingJudgment(pokemon, target, 4);
            // ひんしできんちょうかん/かがくへんかガスが解除されたことによる封じられていた効果の発動
            activateSealedEffects(target);
            activateSealedEffects(pokemon);
        }
    }
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
}
// 対象全員へのダメージ計算
function calculateDamageForAll(pokemon, target, damage) {
    // ばけのかわ/アイスフェイス
    if (isSubstitute(pokemon, target) === false) {
        if (pokemon.status.name === 'ミミッキュ(化けた姿)' && isAbility(target, 'ばけのかわ') === true) {
            target.stateChange.disguise.isTrue = true;
            return;
        }
        if (pokemon.status.name === 'コオリッポ(アイス)' && isAbility(target, 'アイスフェイス') === true && pokemon.moveUsed.category === '物理') {
            target.stateChange.iceFace.isTrue = true;
            return;
        }
    }
    // ダメージ計算
    calculateDamage(pokemon, target, damage);
    // ダメージ計算後の処理
    damage.damage = Math.max(damage.damage, 1);
    damage.damage = damage.damage % 65536;
    damage.damage = Math.min(damage.damage, target.status.remainingHP);
    if (isSubstitute(pokemon, target) === true) {
        damage.damage = Math.min(damage.damage, target.stateChange.substitute._count);
    }
    if (isSubstitute(pokemon, target) === false && damage.damage === target.status.remainingHP) {
        if (target.stateChange.endure.isTrue === true) {
            damage.damage -= 1;
            target.stateChange.endureMsg.isTrue === true;
            target.stateChange.endureMsg.text === 'こらえる';
            return;
        }
        if (pokemon.moveUsed.name === 'みねうち' || pokemon.moveUsed.name === 'てかげん') {
            damage.damage -= 1;
            target.stateChange.endureMsg.isTrue === true;
            target.stateChange.endureMsg.text === pokemon.moveUsed.name;
            return;
        }
        if (isAbility(target, 'がんじょう') === true) {
            if (target.status.remainingHP === target.actualValue.hitPoint) {
                damage.damage -= 1;
                target.stateChange.endureMsg.isTrue === true;
                target.stateChange.endureMsg.text === 'がんじょう';
                return;
            }
        }
        if (isItem(target, 'きあいのタスキ') === true) {
            if (target.status.remainingHP === target.actualValue.hitPoint) {
                damage.damage -= 1;
                target.stateChange.endureMsg.isTrue === true;
                target.stateChange.endureMsg.text === 'きあいのタスキ';
                return;
            }
        }
        if (isItem(target, 'きあいのタスキ') === true) {
            if (getRandom() < 10) {
                damage.damage -= 1;
                target.stateChange.endureMsg.isTrue === true;
                target.stateChange.endureMsg.text === 'きあいのハチマキ';
                return;
            }
        }
    }
}
// ダメージを本体に与える
function damageToBody(target, damage) {
    target.status.remainingHP -= damage.damage;
    writeLog(`${damage.damage}の ダメージ!`);
}
// バツグンの相性判定のメッセージ
function goodCompatibilityMessage(pokemon, target, damage) {
    if (damage.effective <= 1)
        return;
    if (pokemon.damage.length === 1) {
        writeLog(`効果は バツグンだ!`);
    }
    else {
        writeLog(`${target.status.name}に 効果は バツグンだ!`);
    }
}
// 今ひとつの相性判定のメッセージ
function badCompatibilityMessage(pokemon, target, damage) {
    if (damage.effective >= 1)
        return;
    if (pokemon.damage.length === 1) {
        writeLog(`${target.status.name}に 効果は 今ひとつのようだ......`);
    }
    else {
        writeLog(`${target.status.name}に 効果は いまひとつだ`);
    }
}
// ダメージの判定に関するメッセージ
function damageDeterminationMessage(pokemon, target, damage) {
    if (damage.critical === true) {
        if (pokemon.damage.length === 1) {
            writeLog(`急所に 当たった!`);
        }
        else {
            writeLog(`${target.status.name}の 急所に 当たった!`);
        }
    }
}
// ダメージをHP1で耐える効果のメッセージなど
function enduringEffectsMessage(target) {
    if (target.stateChange.endureMsg.isTrue === false)
        return;
    if (target.stateChange.encore.text === 'こらえる') {
        writeLog(`${target.status.name}は 攻撃を こらえた!`);
    }
    if (target.stateChange.encore.text === 'がんじょう') {
        target.status.declareAbility();
        writeLog(`${target.status.name}は 攻撃を こらえた!`);
    }
    if (target.stateChange.encore.text === 'きあいのタスキ') {
        recycleAvailable(target);
        writeLog(`${target.status.name}は きあいのタスキで 持ちこたえた!`);
    }
    if (target.stateChange.encore.text === 'きあいのハチマキ') {
        writeLog(`${target.status.name}は きあいのハチマキで 持ちこたえた!`);
    }
    target.stateChange.endureMsg.reset();
}
// 追加効果などの発動
function activateAdditionalEffects(pokemon, target, damage) {
    if (pokemon.moveUsed.name === 'なげつける') {
        pokemon.stateChange.fling.isTrue = true;
        const item = pokemon.status.item;
        if (item !== null) {
            pokemon.stateChange.flinch.text = item;
        }
        recycleAvailable(pokemon);
    }
    // 追加効果
    // 対象のランク変化
    for (const move of additionalEffectTargetRank) {
        if (move.name === pokemon.moveUsed.name) {
            if (isValidToTargetAdditionalEffect(pokemon, target, damage) === false)
                break;
            if (isValidProbabilityAdditionalEffect(pokemon, move.rate) === false)
                break;
            let isTrue = false;
            for (const parameter of Object.keys(move.change)) {
                if (getRankVariation(target, parameter, move.change[parameter]) !== 0) {
                    isTrue = true;
                }
            }
            if (isTrue === true) {
                for (const parameter of Object.keys(move.change)) {
                    if (move.change[parameter] === 0)
                        continue;
                    changeTargetRank(pokemon, target, parameter, move.change[parameter]);
                }
            }
        }
    }
    // 自分のランク変化
    for (const move of additionalEffectMyRank) {
        if (move.name === pokemon.moveUsed.name) {
            if (pokemon.stateChange.sheerForce.isTrue === true)
                break;
            if (isValidProbabilityAdditionalEffect(pokemon, move.rate) === false)
                break;
            let isTrue = false;
            for (const parameter of Object.keys(move.change)) {
                if (getRankVariation(pokemon, parameter, move.change[parameter]) !== 0) {
                    isTrue = true;
                }
            }
            if (isTrue === true) {
                for (const parameter of Object.keys(move.change)) {
                    if (move.change[parameter] === 0)
                        continue;
                    changeMyRank(pokemon, parameter, move.change[parameter]);
                }
            }
        }
    }
    for (const move of additionalEffectAilment) {
        if (move.name === pokemon.moveUsed.name) {
            if (isValidToTargetAdditionalEffect(pokemon, target, damage) === false)
                break;
            if (isValidProbabilityAdditionalEffect(pokemon, move.rate) === false)
                break;
            giveAilment(pokemon, target, move.ailment);
        }
    }
    for (const move of additionalEffectConfuse) {
        if (move.name === pokemon.moveUsed.name) {
            if (isValidToTargetAdditionalEffect(pokemon, target, damage) === false)
                break;
            if (isValidProbabilityAdditionalEffect(pokemon, move.rate) === false)
                break;
            giveConfuse(pokemon, target, 'additional');
        }
    }
    for (const move of additionalEffectFlinch) {
        if (move.name === pokemon.moveUsed.name) {
            if (isValidToTargetAdditionalEffect(pokemon, target, damage) === false)
                break;
            if (isValidProbabilityAdditionalEffect(pokemon, move.rate) === false)
                break;
            target.stateChange.flinch.isTrue = true;
        }
    }
    // その他の追加効果
    anchorShot: if (pokemon.moveUsed.name === 'アンカーショット' || pokemon.moveUsed.name === 'かげぬい') {
        if (isValidToTargetAdditionalEffect(pokemon, target, damage) === false)
            break anchorShot;
        if (getPokemonType(target).includes('ゴースト') === true)
            break anchorShot;
        if (target.stateChange.cannotEscape.isTrue === true)
            break anchorShot;
        giveCannotEscape(pokemon, target, pokemon.moveUsed.name);
    }
    saltCure: if (pokemon.moveUsed.name === 'しおづけ') {
        if (isValidToTargetAdditionalEffect(pokemon, target, damage) === false)
            break saltCure;
        if (target.stateChange.saltCure.isTrue === true)
            break saltCure;
        target.stateChange.saltCure.isTrue = true;
        writeLog(`${getArticle(target)}は しおづけに なった!`);
    }
    throatChop: if (pokemon.moveUsed.name === 'じごくづき') {
        if (isValidToTargetAdditionalEffect(pokemon, target, damage) === false)
            break throatChop;
        if (target.stateChange.throatChop.isTrue === true)
            break throatChop;
        target.stateChange.throatChop.isTrue = true;
        target.stateChange.throatChop.turn = 2;
    }
    triAttack: if (pokemon.moveUsed.name === 'トライアタック') {
        if (isValidToTargetAdditionalEffect(pokemon, target, damage) === false)
            break triAttack;
        if (isValidProbabilityAdditionalEffect(pokemon, 20) === false)
            break triAttack;
        const rate = getRandom();
        if (rate < 100 / 3) {
            giveAilment(pokemon, target, 'まひ');
        }
        else if (rate < 200 / 3) {
            giveAilment(pokemon, target, 'やけど');
        }
        else {
            giveAilment(pokemon, target, 'こおり');
        }
    }
    fling: if (pokemon.moveUsed.name === 'なげつける') {
        if (isValidToTargetAdditionalEffect(pokemon, target, damage) === false) {
            pokemon.stateChange.fling.reset();
            break fling;
        }
        if (pokemon.stateChange.fling.text === 'でんきだま') {
            giveAilment(pokemon, target, 'まひ');
        }
        if (pokemon.stateChange.fling.text === 'かえんだま') {
            giveAilment(pokemon, target, 'やけど');
        }
        if (pokemon.stateChange.fling.text === 'どくバリ') {
            giveAilment(pokemon, target, 'どく');
        }
        if (pokemon.stateChange.fling.text === 'どくどくだま') {
            giveAilment(pokemon, target, 'もうどく');
        }
        if (pokemon.stateChange.fling.text === 'おうじゃのしるし' || pokemon.stateChange.fling.text === 'するどいキバ') {
            target.stateChange.flinch.isTrue = true;
        }
        if (pokemon.stateChange.fling.text === 'しろいハーブ') {
            let isTrue = false;
            for (const parameter of Object.keys(target.rank)) {
                if (target.rank[parameter] < 0) {
                    isTrue = true;
                    target.rank[parameter] = 0;
                }
            }
            if (isTrue === true) {
                writeLog(`${getArticle(target)}は しろいハーブで ステータスを 元に戻した!`);
            }
        }
        for (const berry of berryTable) {
            if (berry.name === pokemon.stateChange.fling.text && berry.fling === true) {
                target.stateChange.memo.isTrue = true;
                target.stateChange.memo.text = 'なげつける';
                eatBerry(target, pokemon.stateChange.fling.text);
                // ゲップ
                target.stateChange.belch.isTrue = true;
                // ほおぶくろ
                if (target.stateChange.memo.count > 0) {
                    activateCheekPouch(target);
                }
                target.stateChange.memo.reset();
            }
        }
        // なげつけたアイテムのデータを削除
        pokemon.stateChange.fling.reset();
    }
    direClaw: if (pokemon.moveUsed.name === 'フェイタルクロー') {
        if (isValidToTargetAdditionalEffect(pokemon, target, damage) === false)
            break direClaw;
        if (isValidProbabilityAdditionalEffect(pokemon, 50) === false)
            break direClaw;
        const rate = getRandom();
        if (rate < 100 / 3) {
            giveAilment(pokemon, target, 'どく');
        }
        else if (rate < 200 / 3) {
            giveAilment(pokemon, target, 'まひ');
        }
        else {
            giveAilment(pokemon, target, 'ねむり');
        }
    }
    // 自分のランクが下がる技の効果
    for (const move of moveEffectMyRank) {
        if (move.name === pokemon.moveUsed.name) {
            let isTrue = false;
            for (const parameter of Object.keys(move.change)) {
                if (getRankVariation(pokemon, parameter, move.change[parameter]) !== 0) {
                    isTrue = true;
                }
            }
            if (isTrue === true) {
                for (const parameter of Object.keys(move.change)) {
                    if (move.change[parameter] === 0)
                        continue;
                    changeMyRank(pokemon, parameter, move.change[parameter]);
                }
            }
        }
    }
    // HP吸収技
    for (const move of absorbingMoveList) {
        if (move.name === pokemon.moveUsed.name) {
            const value = Math.round(damage.damage * move.rate);
            changeHPByMove(pokemon, target, value);
        }
    }
}
// ダメージが発生したときの効果
function effectsWhenDamageOccurs(pokemon, target, damage) {
    rage: if (target.stateChange.rage.isTrue === true) {
        if (damage.substitute === true)
            break rage;
        if (getRankVariation(target, 'attack', 1) === 0)
            break rage;
        changeMyRankByRage(target, 'attack', 1);
    }
    clearSmog: if (pokemon.moveUsed.name === 'クリアスモッグ') {
        if (damage.substitute === true)
            break clearSmog;
        for (const parameter of Object.keys(target.rank)) {
            target.rank[parameter] = 0;
        }
        writeLog(`全ての ステータスが 元に 戻った!`);
    }
    grudge: if (target.stateChange.grudge.isTrue === true) {
        if (target.status.remainingHP > 0)
            break grudge;
        if (pokemon.moveUsed.remainingPP === 0)
            break grudge;
        pokemon.moveUsed.remainingPP = 0;
        pokemon.move[pokemon.moveUsed.number].remainingPP = 0;
        writeLog(`${getArticle(pokemon)}の ${pokemon.move[pokemon.moveUsed.number].name}は おんねんで PPが0になった!`);
    }
    beakBlast: if (target.stateChange.beakBlast.isTrue === true) {
        if (isDirect(pokemon) === false)
            break beakBlast;
        if (pokemon.moveUsed.name === 'フリーフォール')
            break beakBlast;
        if (damage.substitute === true)
            break beakBlast;
        giveAilmentByBeakBlast(target, pokemon);
    }
    poisonTouch: if (isAbility(pokemon, 'どくしゅ') === true) {
        if (isDirect(pokemon) === false)
            break poisonTouch;
        if (damage.substitute === true)
            break poisonTouch;
        if (isAbility(target, 'りんぷん') === true)
            break poisonTouch;
        if (getRandom() >= 30)
            break poisonTouch;
        if (giveAilment(pokemon, target, 'どく', true)) {
            pokemon.status.declareAbility();
            writeLog(`${getArticle(target)}に 毒を あびせた!`);
        }
    }
    synchronize: if (isAbility(target, 'シンクロ') === true) {
        if (target.stateChange.synchronize.isTrue === false)
            break synchronize;
        const ailment = target.stateChange.synchronize.name;
        if (ailment === 'どく' || ailment === 'もうどく' || ailment === 'やけど' || ailment === 'まひ') {
            target.status.declareAbility();
            giveAilment(target, pokemon, ailment);
        }
        target.stateChange.synchronize.reset();
    }
    // 直接攻撃を受けた時
    if (isDirect(pokemon) === true && damage.substitute === false) {
        roughSkin: if (isAbility(target, 'さめはだ') === true || isAbility(target, 'てつのトゲ') === true) {
            target.status.declareAbility();
            if (isItem(pokemon, 'ぼうごパット') === true) {
                writeLog(`${getArticle(pokemon)}は ぼうごパットで 防いだ!`);
                break roughSkin;
            }
            if (isAbility(pokemon, 'マジックガード') === true)
                break roughSkin;
            const value = Math.max(1, Math.floor(pokemon.actualValue.hitPoint / 8));
            changeHPByAbility(pokemon, value, '-');
            writeLog(`${getArticle(pokemon)}は 傷ついた!`);
        }
        effectSpore: if (isAbility(target, 'ほうし') === true) {
            if (getPokemonType(pokemon).includes('くさ'))
                break effectSpore;
            if (isAbility(pokemon, 'ぼうじん') === true)
                break effectSpore;
            if (isItem(pokemon, 'ぼうじんゴーグル') === true)
                break effectSpore;
            if (isItem(pokemon, 'ぼうごパット') === true)
                break effectSpore;
            if (getRandom() >= 30)
                break effectSpore;
            target.status.declareAbility();
            const random = Math.floor(getRandom() * 0.3);
            if (random < 9) {
                giveAilment(target, pokemon, 'どく');
            }
            else if (random < 19) {
                giveAilment(target, pokemon, 'まひ');
            }
            else {
                giveAilment(target, pokemon, 'ねむり');
            }
        }
        poisonPoint: if (isAbility(target, 'どくのトゲ') === true) {
            if (isItem(pokemon, 'ぼうごパット') === true)
                break poisonPoint;
            if (getRandom() > 30)
                break poisonPoint;
            target.status.declareAbility();
            giveAilment(target, pokemon, 'どく');
        }
        staticElectricity: if (isAbility(target, 'せいでんき') === true) {
            if (isItem(pokemon, 'ぼうごパット') === true)
                break staticElectricity;
            if (getRandom() > 30)
                break staticElectricity;
            target.status.declareAbility();
            giveAilment(target, pokemon, 'まひ');
        }
        flameBody: if (isAbility(target, 'ほのおのからだ') === true) {
            if (isItem(pokemon, 'ぼうごパット') === true)
                break flameBody;
            if (getRandom() > 30)
                break flameBody;
            target.status.declareAbility();
            giveAilment(target, pokemon, 'やけど');
        }
        atract: if (isAbility(target, 'メロメロボディ') === true) {
            if (isItem(pokemon, 'ぼうごパット') === true)
                break atract;
            if (getRandom() >= 30)
                break atract;
            attractTarget(target, pokemon, 'メロメロボディ');
        }
        mummy: if (isAbility(target, 'ミイラ') === true || isAbility(target, 'とれないにおい') === true) {
            for (const ability of changeAbilityTable) {
                if (ability.name === pokemon.status.ability) {
                    if (ability.noAbility === 0 || ability.noAbility === 2) {
                        break mummy;
                    }
                }
            }
            if (isItem(pokemon, 'ぼうごパット') === true) {
                writeLog(`${getArticle(pokemon)}は ぼうごパットで 防いだ!`);
                break mummy;
            }
            target.status.declareAbility();
            pokemon.status.ability = target.status.ability;
            if (isAbility(target, 'ミイラ') === true) {
                writeLog(`${getArticle(pokemon)}は とくせいが ミイラになっちゃった!`);
            }
            if (isAbility(target, 'とれないにおい') === true) {
                writeLog(`${getArticle(pokemon)}は においが うつって とれなくなっちゃった!`);
            }
        }
        gooey: if (isAbility(target, 'ぬめぬめ') === true || isAbility(target, 'カーリーヘアー') === true) {
            if (getRankVariation(pokemon, 'speed', -1) === 0) {
                writeLog(`${getArticle(pokemon)}の 素早さは もう 下がらない!`);
                break gooey;
            }
            target.status.declareAbility();
            if (isItem(pokemon, 'ぼうごパット') === true) {
                writeLog(`${getArticle(pokemon)}は ぼうごパットで 防いだ!`);
                break gooey;
            }
            changeTargetRank(target, pokemon, 'speed', -1);
        }
        wanderingSpirit: if (isAbility(target, 'さまようたましい') === true) {
            if (isItem(pokemon, 'ぼうごパット') === true)
                break wanderingSpirit;
            if (pokemon.stateChange.dynamax.isTrue === true)
                break wanderingSpirit;
            if (target.stateChange.dynamax.isTrue === true)
                break wanderingSpirit;
            for (const ability of changeAbilityTable) {
                if (ability.name === pokemon.status.ability) {
                    if (ability.exchange === 0 || ability.exchange === 2) {
                        break wanderingSpirit;
                    }
                }
            }
            target.status.declareAbility();
            [pokemon.status.ability, target.status.ability] = [target.status.ability, pokemon.status.ability];
            writeLog(`${getArticle(target)}は おたがいの とくせいを 入れ替えた!`);
            if (pokemon.trainer !== target.trainer) {
                pokemon.status.declareAbility();
                target.status.declareAbility();
            }
        }
        perishBody: if (isAbility(target, 'ほろびのボディ') === true) {
            if (pokemon.status.remainingHP === 0)
                break perishBody;
            if (isItem(pokemon, 'ぼうごパット') === true)
                break perishBody;
            if (pokemon.stateChange.perishSong.isTrue === true && target.stateChange.perishSong.isTrue === true)
                break perishBody;
            target.status.declareAbility();
            if (pokemon.stateChange.perishSong.isTrue === true) {
                writeLog(`${getArticle(target)}は 3ターン後に 滅びてしまう!`);
            }
            else if (target.stateChange.perishSong.isTrue === true) {
                writeLog(`${getArticle(pokemon)}は 3ターン後に 滅びてしまう!`);
            }
            else {
                writeLog(`おたがいは 3ターン後に 滅びてしまう!`);
            }
            if (pokemon.stateChange.perishSong.isTrue === false) {
                pokemon.stateChange.perishSong.isTrue = true;
                pokemon.stateChange.perishSong.count = 3;
            }
            if (target.stateChange.perishSong.isTrue === false) {
                target.stateChange.perishSong.isTrue = true;
                target.stateChange.perishSong.count = 3;
            }
        }
    }
    // 攻撃技を受けた時
    if (damage.substitute === false) {
        cursedBody: if (isAbility(target, 'のろわれボディ') === true) {
            if (pokemon.stateChange.disable.isTrue === true)
                break cursedBody;
            if (pokemon.stateChange.dynamax.isTrue === true)
                break cursedBody;
            if (isExistAbilityOneSide(pokemon.trainer, 'アロマベール') === true)
                break cursedBody;
            if (getRandom() >= 30)
                break cursedBody;
            target.status.declareAbility();
            pokemon.stateChange.disable.isTrue = true;
            pokemon.stateChange.disable.turn = 4;
            pokemon.stateChange.disable.text = pokemon.moveUsed.name;
            writeLog(`${getArticle(pokemon)}の ${pokemon.stateChange.disable.text}を 封じこめた!`);
        }
        stamina: if (isAbility(target, 'じきゅうりょく') === true) {
            if (getRankVariation(target, 'defense', 1) === 0)
                break stamina;
            target.status.declareAbility();
            changeMyRank(target, 'defense', 1);
        }
        sandSpit: if (isAbility(target, 'すなはき') === true) {
            if (isChangableWeather('すなあらし') === false)
                break sandSpit;
            target.status.declareAbility();
            changeWeather(target, 'すなあらし');
        }
        cottonDown: if (isAbility(target, 'わたげ') === true) {
            target.stateChange.memo.isTrue = true;
            target.stateChange.memo.text = 'わたげ';
            target.stateChange.memo.target.trainer = pokemon.trainer;
            target.stateChange.memo.target.battle = pokemon.order.battle;
            const valid = [];
            for (const _pokemon of pokemonForCottonDown(pokemon)) {
                if (_pokemon.stateChange.substitute.isTrue === true)
                    continue;
                if (isHide(_pokemon) === true)
                    continue;
                valid.push(_pokemon);
            }
            if (valid.length > 0) {
                target.status.declareAbility();
                for (const _pokemon of valid) {
                    changeTargetRank(target, _pokemon, 'speed', -1);
                }
            }
            target.stateChange.memo.reset();
        }
        gulpMissile: if (isAbility(target, 'うのミサイル') === true) {
            if (target.status.name === 'ウッウ')
                break gulpMissile;
            if (isHide(target) === true)
                break gulpMissile;
            if (pokemon.status.remainingHP === 0)
                break gulpMissile;
            target.status.declareAbility();
            if (isAbility(pokemon, 'マジックガード') === false) {
                const dynamax = (pokemon.stateChange.dynamax.isTrue) ? 0.5 : 1;
                const value = Math.max(1, Math.floor(pokemon.actualValue.hitPoint * dynamax / 4));
                changeHPByAbility(pokemon, value, '-');
            }
            if (target.status.name === 'ウッウ(鵜呑み)') {
                changeTargetRank(target, pokemon, 'defense', -1);
            }
            if (target.status.name === 'ウッウ(丸呑み)') {
                giveAilment(target, pokemon, 'まひ');
            }
            formChange(pokemon);
        }
        seedSower: if (isAbility(target, 'こぼれダネ') === true) {
            if (isChangableTerrain('グラスフィールド') === false)
                break seedSower;
            target.status.declareAbility();
            changeTerrain(target, 'グラスフィールド');
        }
        electromorphosis: if (isAbility(target, 'でんきにかえる') === true) {
            if (target.status.remainingHP === 0)
                break electromorphosis;
            target.status.declareAbility();
            activateCharge(target, pokemon.moveUsed.name);
        }
    }
    // 物理技を受けた時
    if (pokemon.moveUsed.category === '物理' && damage.substitute === false) {
        weakArmor: if (isAbility(target, 'くだけるよろい') === true) {
            if (getRankVariation(target, 'defense', -1) === 0 && getRankVariation(target, 'speed', 2) === 0)
                break weakArmor;
            target.status.declareAbility();
            changeMyRank(target, 'defense', -1);
            changeMyRank(target, 'speed', 2);
        }
        toxicDebris: if (isAbility(target, 'どくげしょう') === true) {
            if (fieldStatus.getSide(getOpponentTrainer(target.trainer)).toxicSpikes.count === 2)
                break toxicDebris;
            target.status.declareAbility();
            changeOpponentField(getOpponentTrainer(target.trainer), 'どくびし', '+');
        }
    }
    // 特定のタイプの攻撃技を受けた時
    if (damage.substitute === false) {
        waterCompaction: if (isAbility(target, 'みずがため') === true) {
            if (pokemon.moveUsed.type !== 'みず')
                break waterCompaction;
            if (getRankVariation(target, 'defense', 2) === 0)
                break waterCompaction;
            target.status.declareAbility();
            changeMyRank(target, 'defense', 2);
        }
        justified: if (isAbility(target, 'せいぎのこころ') === true) {
            if (pokemon.moveUsed.type !== 'あく')
                break justified;
            if (getRankVariation(target, 'attack', 1) === 0)
                break justified;
            target.status.declareAbility();
            changeMyRank(target, 'attack', 1);
        }
        rattled: if (isAbility(target, 'びびり') === true) {
            if (pokemon.moveUsed.type !== 'あく' && pokemon.moveUsed.type !== 'ゴースト' && pokemon.moveUsed.type !== 'むし')
                break rattled;
            if (getRankVariation(target, 'speed', 1) === 0)
                break rattled;
            target.status.declareAbility();
            changeMyRank(target, 'speed', 1);
        }
        steamEngine: if (isAbility(target, 'じょうききかん') === true) {
            if (pokemon.moveUsed.type !== 'みず' && pokemon.moveUsed.type !== 'ほのお')
                break steamEngine;
            if (getRankVariation(target, 'speed', 6) === 0)
                break steamEngine;
            target.status.declareAbility();
            changeMyRank(target, 'speed', 6);
        }
    }
    // 風技を受けた時
    if (windMoveList.includes(pokemon.moveUsed.name) === true && damage.substitute === false) {
        windPower: if (isAbility(target, 'ふうりょくでんき') === true) {
            target.status.declareAbility();
            activateCharge(target, pokemon.moveUsed.name);
        }
    }
    // 急所に当たった時
    if (damage.critical === true && damage.substitute === false) {
        angerPoint: if (isAbility(target, 'いかりのつぼ') === true) {
            target.status.declareAbility();
            target.rank.attack = 6;
            writeLog(`${getArticle(target)}は 攻撃が 最大まで 上がった!`);
        }
    }
    // 防御側の持ち物の効果（その１）
    if (target.stateChange.halfBerry.isTrue === true) {
        writeLog(`${getArticle(target)}への ダメージを ${target.stateChange.halfBerry.text}が 弱めた!`);
        target.stateChange.halfBerry.reset();
        activateCheekPouch(target);
    }
    // 効果バツグンの技を受けた時
    effective: if (damage.effective > 1) {
        if (target.status.remainingHP === 0)
            break effective;
        if (damage.substitute === true)
            break effective;
        if (damage.damage === 0)
            break effective;
        if (isItem(target, 'ナゾのみ') === true) {
            eatBerry(target, 'ナゾのみ');
        }
        if (isItem(target, 'じゃくてんほけん') === true) {
            let isTrue = false;
            if (getRankVariation(target, 'attack', 2) !== 0)
                isTrue = true;
            if (getRankVariation(target, 'specialAttack', 2) !== 0)
                isTrue = true;
            if (isTrue === true) {
                changeMyRankByItem(target, 'attack', 2, 'じゃくてんほけん');
                changeMyRankByItem(target, 'specialAttack', 2, 'じゃくてんほけん');
                recycleAvailable(target);
            }
        }
    }
    // 特定のタイプの技を受けた時
    cellBattery: if (isItem(target, 'じゅうでんち') === true) {
        if (damage.substitute === true)
            break cellBattery;
        if (pokemon.moveUsed.type !== 'でんき')
            break cellBattery;
        if (getRankVariation(target, 'attack', 1) === 0)
            break cellBattery;
        changeMyRankByItem(target, 'attack', 1, 'じゅうでんち');
        recycleAvailable(target);
    }
    snowball: if (isItem(target, 'ゆきだま') === true) {
        if (damage.substitute === true)
            break snowball;
        if (pokemon.moveUsed.type !== 'こおり')
            break snowball;
        if (getRankVariation(target, 'attack', 1) === 0)
            break snowball;
        changeMyRankByItem(target, 'attack', 1, 'ゆきだま');
        recycleAvailable(target);
    }
    absorbBulb: if (isItem(target, 'きゅうこん') === true) {
        if (damage.substitute === true)
            break absorbBulb;
        if (pokemon.moveUsed.type !== 'みず')
            break absorbBulb;
        if (getRankVariation(target, 'specialAttack', 1) === 0)
            break absorbBulb;
        changeMyRankByItem(target, 'specialAttack', 1, 'きゅうこん');
        recycleAvailable(target);
    }
    luminousMoss: if (isItem(target, 'ひかりごけ') === true) {
        if (damage.substitute === true)
            break luminousMoss;
        if (pokemon.moveUsed.type !== 'みず')
            break luminousMoss;
        if (getRankVariation(target, 'specialDefense', 1) === 0)
            break luminousMoss;
        changeMyRankByItem(target, 'specialDefense', 1, 'ひかりごけ');
        recycleAvailable(target);
    }
    rockyHelmet: if (isItem(target, 'ゴツゴツメット') === true) {
        if (isDirect(pokemon) === false)
            break rockyHelmet;
        if (damage.substitute === true)
            break rockyHelmet;
        if (isItem(pokemon, 'ぼうごパット') === true)
            break rockyHelmet;
        if (isAbility(pokemon, 'マジックガード') === true)
            break rockyHelmet;
        const dynamax = (pokemon.stateChange.dynamax.isTrue) ? 0.5 : 1;
        const value = Math.floor(pokemon.actualValue.hitPoint * dynamax / 8);
        pokemon.status.remainingHP = Math.max(pokemon.status.remainingHP - value, 0);
        writeLog(`${getArticle(pokemon)}は ゴツゴツメットで ダメージを受けた!`);
    }
    stickyBarb: if (isItem(target, 'くっつきバリ') === true) {
        if (isDirect(pokemon) === false)
            break stickyBarb;
        if (damage.substitute === true)
            break stickyBarb;
        if (pokemon.status.item !== null)
            break stickyBarb;
        [pokemon.status.item, target.status.item] = [target.status.item, pokemon.status.item];
    }
    airBalloon: if (isItem(target, 'ふうせん') === true) {
        target.status.item = null;
        writeLog(`${getArticle(target)}の ふうせんが 割れた!`);
    }
    incinerate: if (pokemon.moveUsed.name === 'やきつくす') {
        if (damage.substitute === true)
            break incinerate;
        if (isAbility(target, 'ねんちゃく') === true)
            break incinerate;
        let item = null;
        for (const berry of berryTable) {
            if (berry.name === target.status.item) {
                item = berry.name;
            }
        }
        for (const gem of gemTable) {
            if (gem.name === target.status.item) {
                item = gem.name;
            }
        }
        if (item !== null) {
            target.status.item = null;
            writeLog(`${getArticle(target)}の ${item}は 焼けてなくなった!`);
        }
    }
    // 防御側の持ち物の効果（その２）
    jabocaBerry: if (isItem(target, 'ジャポのみ') === true) {
        if (damage.substitute === true)
            break jabocaBerry;
        if (pokemon.moveUsed.category !== '物理')
            break jabocaBerry;
        if (isAbility(pokemon, 'マジックガード') === true)
            break jabocaBerry;
        if (pokemon.status.remainingHP === 0)
            break jabocaBerry;
        const dynamax = (pokemon.stateChange.dynamax.isTrue) ? 0.5 : 1;
        const value = Math.floor(pokemon.actualValue.hitPoint * dynamax / 8);
        pokemon.status.remainingHP = Math.max(pokemon.status.remainingHP - value, 0);
        writeLog(`${getArticle(target)}は ${getArticle(pokemon)}の ジャポのみで ダメージを 受けた!`);
    }
    rowapBerry: if (isItem(target, 'レンブのみ') === true) {
        if (damage.substitute === true)
            break rowapBerry;
        if (pokemon.moveUsed.category !== '特殊')
            break rowapBerry;
        if (isAbility(pokemon, 'マジックガード') === true)
            break rowapBerry;
        if (pokemon.status.remainingHP === 0)
            break rowapBerry;
        const dynamax = (pokemon.stateChange.dynamax.isTrue) ? 0.5 : 1;
        const value = Math.floor(pokemon.actualValue.hitPoint * dynamax / 8);
        pokemon.status.remainingHP = Math.max(pokemon.status.remainingHP - value, 0);
        writeLog(`${getArticle(target)}は ${getArticle(pokemon)}の レンブのみで ダメージを 受けた!`);
    }
    // 防御側のばけのかわ/アイスフェイス
    if (target.stateChange.disguise.isTrue === true) {
        target.stateChange.disguise.reset();
        target.status.declareAbility();
        formChange(target);
        writeLog(`${getArticle(target)}の ばけのかわが はがれた!`);
        const dynamax = (pokemon.stateChange.dynamax.isTrue) ? 0.5 : 1;
        const value = Math.floor(pokemon.actualValue.hitPoint * dynamax / 8);
        pokemon.status.remainingHP = Math.max(pokemon.status.remainingHP - value, 0);
    }
    if (target.stateChange.iceFace.isTrue === true) {
        target.stateChange.iceFace.reset();
        target.status.declareAbility();
        formChange(target);
        writeLog(`${getArticle(target)}の 姿が 変化した!`);
    }
}
// ひんし判定
function faintingJudgment(pokemon, target, number) {
    if (number === 1) {
        if (pokemon.moveUsed.name === 'いのちがけ') {
            pokemon.status.remainingHP = 0;
            toReserve(pokemon);
        }
    }
    if (number === 2) {
        if (target.status.remainingHP === 0) {
            toReserve(target);
        }
    }
    if (number === 3) {
        if (pokemon.status.remainingHP === 0) {
            toReserve(pokemon);
        }
    }
    if (number === 4) {
        destinyBond: if (target.stateChange.destinyBond.isTrue === true) {
            if (target.status.remainingHP > 0)
                break destinyBond;
            if (isFriend(pokemon, target) === true)
                break destinyBond;
            if (pokemon.stateChange.dynamax.isTrue === true)
                break destinyBond;
            writeLog(`${getArticle(target)}は 相手を 道連れに した!`);
            // writeLog( `${getArticle( target )}は 相手を 道連れに しようとしている!` );
            pokemon.status.remainingHP = 0;
            toReserve(pokemon);
        }
    }
}
// ひんしできんちょうかん/かがくへんかガスが解除されたことによる封じられていた効果の発動
function activateSealedEffects(pokemon) {
    if (pokemon.status.remainingHP > 0)
        return;
    if (pokemon.status.ability === 'きんちょうかん') {
        for (const order of getSpeedOrder()) {
            const target = getPokemonByBattle(order.trainer, order.battleNumber);
            if (target === false)
                continue;
            if (isEnableEatBerry(target) === true) {
                eatBerry(target, target.status.item);
            }
        }
    }
    if (pokemon.status.ability === 'かがくへんかガス') {
    }
}
// 技の効果
function activateMoveEffect(pokemon) {
    const targetList = getTargetList(pokemon);
    const one = targetList[0];
    fire: if (pokemon.moveUsed.type === 'ほのお') {
        if (pokemon.moveUsed.category === '変化')
            break fire;
        for (const data of targetList) {
            if (data.target.status.remainingHP === 0)
                continue;
            cureAilment(data.target, 'こおり');
        }
    }
    if (pokemon.order.battle === null)
        return;
    // 反動技による反動ダメージ
    recoil: if (true) {
        if (pokemon.moveUsed.name !== 'わるあがき') {
            if (isAbility(pokemon, 'マジックガード') === true)
                break recoil;
            if (isAbility(pokemon, 'いしあたま') === true)
                break recoil;
        }
        // 与ダメージ依存の反動技
        for (const move of dependentRecoilMoveList) {
            if (move.name === pokemon.moveUsed.name) {
                if (one.damage.damage === 0)
                    break recoil;
                const value = Math.max(1, Math.round(one.damage.damage * move.rate));
                pokemon.status.remainingHP = Math.max(0, pokemon.status.remainingHP - value);
                writeLog(`${getArticle(pokemon)}は 反動による ダメージを 受けた!`);
            }
        }
        // 与ダメージ非依存の反動技
        for (const move of independentRecoilMoveList) {
            if (move.name === pokemon.moveUsed.name) {
                const damage = Math.max(1, Math.round(pokemon.actualValue.hitPoint * move.rate));
                pokemon.status.remainingHP = Math.max(0, pokemon.status.remainingHP - damage);
                writeLog(`${getArticle(pokemon)}は 反動による ダメージを 受けた!`);
            }
        }
        if (pokemon.status.remainingHP === 0) {
            toReserve(pokemon);
            activateSealedEffects(pokemon);
        }
    }
    // バインド状態
    bind: if (bindMoveList.includes(pokemon.moveUsed.name)) {
        let turn = 4;
        if (getRandom() < 50)
            turn = 5;
        if (isItem(pokemon, 'ねばりのかぎづめ') === true)
            turn = 7;
        for (const data of targetList) {
            if (data.target.status.remainingHP === 0)
                continue;
            substitute: if (data.damage.substitute === true) {
                if (pokemon.moveUsed.name === 'キョダイサジン')
                    break substitute;
                if (pokemon.moveUsed.name === 'キョダイヒャッカ')
                    break substitute;
                continue;
            }
            if (data.target.stateChange.bind.isTrue === true)
                continue;
            data.target.stateChange.bind.isTrue = true;
            data.target.stateChange.bind.turn = turn;
            if (isItem(pokemon, 'しめつけバンド') === true) {
                data.target.stateChange.bind.text = 'しめつけバンド';
            }
            if (pokemon.moveUsed.name === 'うずしお') {
                writeLog(`${getArticle(data.target)}は 渦の中に 閉じこめられた!`);
            }
            if (pokemon.moveUsed.name === 'からではさむ') {
                writeLog(`${getArticle(data.target)}は ${getArticle(pokemon)}の からに はさまれた!`);
            }
            if (pokemon.moveUsed.name === 'サンダープリズン') {
                writeLog(`${getArticle(data.target)}は ${getArticle(pokemon)}に 閉じこめられた!`);
            }
            if (pokemon.moveUsed.name === 'しめつける') {
                writeLog(`${getArticle(data.target)}は ${getArticle(pokemon)}に しめつけられた!`);
            }
            if (pokemon.moveUsed.name === 'すなじごく') {
                writeLog(`${getArticle(data.target)}は 砂じごくに 捕らわれた!`);
            }
            if (pokemon.moveUsed.name === 'トラバサミ') {
                writeLog(`${getArticle(data.target)}は トラバサミに 捕らわれた!`);
            }
            if (pokemon.moveUsed.name === 'ほのおのうず') {
                writeLog(`${getArticle(data.target)}は 炎の渦に 閉じこめられた!`);
            }
            if (pokemon.moveUsed.name === 'まきつく') {
                writeLog(`${getArticle(data.target)}は ${getArticle(pokemon)}に 巻きつかれた!`);
            }
            if (pokemon.moveUsed.name === 'マグマストーム') {
                writeLog(`${getArticle(data.target)}は マグマの渦に 閉じこめられた!`);
            }
            if (pokemon.moveUsed.name === 'まとわりつく') {
                writeLog(`${getArticle(data.target)}は ${getArticle(pokemon)}に まとわりつかれた!`);
            }
            // キョダイサジン・キョダイヒャッカのテキストは表示されない
        }
    }
    // ひみつのちからの追加効果
    secretPower: if (pokemon.moveUsed.name === 'ひみつのちから') {
        if (one.target.status.remainingHP === 0)
            break secretPower;
        if (isValidToTargetAdditionalEffect(pokemon, one.target, one.damage) === false)
            break secretPower;
        if (isValidProbabilityAdditionalEffect(pokemon, 30) === false)
            break secretPower;
        if (fieldStatus.terrain.name === 'エレキフィールド') {
            giveAilment(pokemon, one.target, 'まひ');
        }
        if (fieldStatus.terrain.name === 'グラスフィールド') {
            giveAilment(pokemon, one.target, 'ねむり');
        }
        if (fieldStatus.terrain.name === 'サイコフィールド') {
            if (getRankVariation(one.target, 'speed', -1) !== 0) {
                changeTargetRank(one.target, pokemon, 'speed', -1);
            }
        }
        if (fieldStatus.terrain.name === 'ミストフィールド') {
            if (getRankVariation(one.target, 'specialAttack', -1) !== 0) {
                changeTargetRank(one.target, pokemon, 'specialAttack', -1);
            }
        }
        if (fieldStatus.terrain.name === null) {
            giveAilment(pokemon, one.target, 'まひ');
        }
    }
    fellStinger: if (pokemon.moveUsed.name === 'とどめばり') {
        if (one.target.status.remainingHP > 0)
            break fellStinger;
        if (getRankVariation(pokemon, 'attack', 3) === 0)
            break fellStinger;
        pokemon.status.declareAbility();
        changeMyRank(pokemon, 'attack', 3);
    }
    knockOff: if (pokemon.moveUsed.name === 'はたきおとす') {
        if (one.target.status.item === null)
            break knockOff;
        if (isAbility(one.target, 'ねんちゃく') === true)
            break knockOff;
        if (one.damage.substitute === true)
            break knockOff;
        writeLog(`${getArticle(pokemon)}は ${getArticle(one.target)}の ${one.target.status.item}を はたき落とした!`);
        one.target.status.item = null;
    }
    thief: if (pokemon.moveUsed.name === 'どろぼう' || pokemon.moveUsed.name === 'ほしがる') {
        if (pokemon.status.item !== null)
            break thief;
        if (one.target.status.item === null)
            break thief;
        if (one.damage.substitute === true)
            break thief;
        if (isAbility(one.target, 'ねんちゃく') === true) {
            one.target.status.declareAbility();
            writeLog(`${getArticle(one.target)}の 道具を 奪えない!`);
            break thief;
        }
        [pokemon.status.item, one.target.status.item] = [one.target.status.item, pokemon.status.item];
        writeLog(`${getArticle(pokemon)}は ${getArticle(one.target)}から ${pokemon.status.item}を 奪い取った!`);
        if (isEnableEatBerry(pokemon) === true) {
            eatBerry(pokemon, pokemon.status.item);
        }
    }
    bugBite: if (pokemon.moveUsed.name === 'むしくい' || pokemon.moveUsed.name === 'ついばむ') {
        if (pokemon.status.item !== null)
            break bugBite;
        if (one.target.status.item === null)
            break bugBite;
        if (one.damage.substitute === true)
            break bugBite;
        if (isAbility(one.target, 'ねんちゃく') === true)
            break bugBite;
        for (const berry of berryTable) {
            if (berry.name === one.target.status.item) {
                pokemon.stateChange.memo.isTrue = true;
                pokemon.stateChange.memo.text = 'むしくい';
                one.target.status.item = null;
                writeLog(`${getArticle(pokemon)}は ${berry.name}を 奪って 食べた!`);
                eatBerry(pokemon, berry.name);
                // ゲップ
                pokemon.stateChange.belch.isTrue = true;
                // ほおぶくろ
                if (pokemon.stateChange.memo.count > 0) {
                    activateCheekPouch(pokemon);
                }
                pokemon.stateChange.memo.reset();
            }
        }
    }
    smackDown: if (pokemon.moveUsed.name === 'うちおとす' || pokemon.moveUsed.name === 'サウザンアロー') {
        for (const data of targetList) {
            if (data.target.status.remainingHP === 0)
                continue;
            if (data.damage.substitute === true)
                continue;
            if (isGrounded(data.target) === true)
                continue;
            one.target.stateChange.magnetRise.reset();
            one.target.stateChange.telekinesis.reset();
            writeLog(`${getArticle(one.target)}は 撃ち落とされて 地面に 落ちた!`);
            one.target.stateChange.smackDown.isTrue = true;
        }
    }
    thousandWaves: if (pokemon.moveUsed.name === 'サウザンウェーブ') {
        for (const data of targetList) {
            if (data.target.status.remainingHP === 0)
                continue;
            if (getPokemonType(data.target).includes('ゴースト') === true)
                continue;
            if (data.target.stateChange.cannotEscape.isTrue === true)
                continue;
            giveCannotEscape(pokemon, data.target, pokemon.moveUsed.name);
        }
    }
    jawLock: if (pokemon.moveUsed.name === 'くらいつく') {
        if (one.target.status.remainingHP === 0)
            break jawLock;
        if (one.damage.substitute === true)
            break jawLock;
        if (pokemon.stateChange.cannotEscape.isTrue === true)
            break jawLock;
        if (one.target.stateChange.cannotEscape.isTrue === true)
            break jawLock;
        if (getPokemonType(pokemon).includes('ゴースト') === true)
            break jawLock;
        if (getPokemonType(one.target).includes('ゴースト') === true)
            break jawLock;
        giveCannotEscape(pokemon, one.target, pokemon.moveUsed.name);
    }
    plasmaFists: if (pokemon.moveUsed.name === 'プラズマフィスト') {
        if (pokemon.status.remainingHP === 0)
            break plasmaFists;
        fieldStatus.whole.ionDeluge.isTrue = true;
        writeLog(`電子のシャワーが 降りそそいだ!`);
    }
    genesisSupernova: if (pokemon.moveUsed.name === 'オリジンズスーパーノヴァ') {
        if (pokemon.stateChange.shadowForce.isTrue === true)
            break genesisSupernova;
        if (fieldStatus.terrain.name === 'サイコフィールド')
            break genesisSupernova;
        changeTerrain(pokemon, 'サイコフィールド');
    }
    rapidSpin: if (pokemon.moveUsed.name === 'こうそくスピン' || pokemon.moveUsed.name === 'キラースピン') {
        if (pokemon.stateChange.shadowForce.isTrue === true)
            break rapidSpin;
        if (pokemon.stateChange.ingrain.isTrue === true) {
            pokemon.stateChange.ingrain.reset();
            writeLog(``);
        }
        changeOpponentField(pokemon.trainer, 'まきびし', '-');
        changeOpponentField(pokemon.trainer, 'どくびし', '-');
        changeOpponentField(pokemon.trainer, 'ステルスロック', '-');
        changeOpponentField(pokemon.trainer, 'ねばねばネット', '-');
    }
    splinteredStormshards: if (pokemon.moveUsed.name === 'ラジアルエッジストーム') {
        vanishTerrian();
    }
    scald: if (pokemon.moveUsed.name === 'ねっとう' || pokemon.moveUsed.name === 'スチームバースト') {
        if (one.damage.substitute === true)
            break scald;
        if (pokemon.stateChange.sheerForce.isTrue === true)
            break scald;
        cureAilment(one.target, 'こおり');
    }
    hydroSteam: if (pokemon.moveUsed.name === 'ハイドロスチーム') {
        if (one.damage.substitute === true)
            break hydroSteam;
        cureAilment(one.target, 'こおり');
    }
    smellingSalts: if (pokemon.moveUsed.name === 'きつけ') {
        if (one.damage.substitute === true)
            break smellingSalts;
        cureAilment(one.target, 'まひ');
    }
    wakeUpSlap: if (pokemon.moveUsed.name === 'めざましビンタ') {
        if (one.damage.substitute === true)
            break wakeUpSlap;
        cureAilment(one.target, 'ねむり');
    }
    sparklingAria: if (pokemon.moveUsed.name === 'うたかたのアリア') {
        if (pokemon.stateChange.sheerForce.isTrue === true)
            break sparklingAria;
        for (const data of targetList) {
            if (isItem(data.target, 'おんみつマント') === true)
                continue;
            if (isAbility(data.target, 'りんぷん') === true && targetList.length === 1)
                continue;
            cureAilment(data.target, 'ねむり');
        }
    }
    eerieSpell: if (pokemon.moveUsed.name === 'ぶきみなじゅもん') {
        if (isValidToTargetAdditionalEffect(pokemon, one.target, one.damage) === false)
            break eerieSpell;
        // writeLog( `${getArticle( one.target)}の ${}を ${}削った!` );
    }
}
// 特性の効果（その1）
function activateAbilityEffectPart1(pokemon) {
    const targetList = getTargetList(pokemon);
    const allPokemon = getTargetList(pokemon);
    allPokemon.push({ target: pokemon, damage: new Damage });
    allPokemon.sort((a, b) => {
        // 素早さ
        if (getSpeedValue(b.target, 'e') > getSpeedValue(a.target, 'e'))
            return 1;
        if (getSpeedValue(b.target, 'e') < getSpeedValue(a.target, 'e'))
            return -1;
        // 乱数
        if (getRandom() > 50)
            return 1;
        else
            return -1;
    });
    for (const data of allPokemon) {
        // 攻撃側
        if (isSame(data.target, pokemon) === true) {
            magician: if (isAbility(pokemon, 'マジシャン') === true) {
                if (pokemon.status.item !== null)
                    break magician;
                if (pokemon.moveUsed.category === '変化')
                    break magician;
                if (pokemon.moveUsed.name === 'なげつける')
                    break magician;
                if (pokemon.moveUsed.name === 'しぜんのめぐみ')
                    break magician;
                if (pokemon.moveUsed.name === 'みらいよち')
                    break magician;
                if (pokemon.moveUsed.name === 'はめつのねがい')
                    break magician;
                for (const _data of targetList) {
                    if (_data.damage.substitute === true)
                        continue;
                    if (isReleasableItem(pokemon, _data.target) === false)
                        continue;
                    let isZcrystal = false;
                    for (const zCrystal of zCrystalTable) {
                        if (zCrystal.name === _data.target.status.item) {
                            isZcrystal = true;
                        }
                    }
                    if (isZcrystal === true)
                        continue;
                    if (isAbility(_data.target, 'ねんちゃく') === true && _data.target.order.battle !== null)
                        continue;
                }
            }
            moxie: if (isAbility(pokemon, 'じしんかじょう') === true) {
                const count = targetList.filter(data => data.target.status.remainingHP === 0).length;
                if (getRankVariation(pokemon, 'attack', count) === 0)
                    break moxie;
                pokemon.status.declareAbility();
                changeMyRank(pokemon, 'attack', count);
            }
            beastBoost: if (isAbility(pokemon, 'ビーストブースト') === true) {
                const count = targetList.filter(data => data.target.status.remainingHP === 0).length;
                let record = { parameter: 'attack', value: 0 };
                for (const parameter of Object.keys(pokemon.actualValue)) {
                    if (parameter === 'hitPoint')
                        continue;
                    if (pokemon.actualValue[parameter] > record.value) {
                        record.parameter = parameter;
                        record.value = pokemon.actualValue[parameter];
                    }
                }
                if (getRankVariation(pokemon, record.parameter, count) === 0)
                    break beastBoost;
                pokemon.status.declareAbility();
                changeMyRank(pokemon, record.parameter, count);
            }
            grimNeigh: if (isAbility(pokemon, 'くろのいななき') === true) {
                const count = targetList.filter(data => data.target.status.remainingHP === 0).length;
                if (getRankVariation(pokemon, 'specialAttack', count) === 0)
                    break grimNeigh;
                pokemon.status.declareAbility();
                changeMyRank(pokemon, 'specialAttack', count);
            }
            chillingNeigh: if (isAbility(pokemon, 'しろのいななき') === true) {
                const count = targetList.filter(data => data.target.status.remainingHP === 0).length;
                if (getRankVariation(pokemon, 'attack', count) === 0)
                    break chillingNeigh;
                pokemon.status.declareAbility();
                changeMyRank(pokemon, 'attack', count);
            }
        }
        // 防御側
        if (isSame(data.target, pokemon) === false) {
            colorChange: if (isAbility(data.target, 'へんしょく') === true) {
                if (pokemon.moveUsed.category === '変化')
                    break colorChange;
                if (getPokemonType(data.target).includes(pokemon.moveUsed.type))
                    break colorChange;
                if (pokemon.moveUsed.name === 'わるあがき')
                    break colorChange;
                if (pokemon.moveUsed.type === null)
                    break colorChange;
                if (pokemon.stateChange.sheerForce.isTrue === true)
                    break colorChange;
                data.target.status.declareAbility();
                writeLog(`${getArticle(data.target)}は ${pokemon.moveUsed.type}タイプに なった!`);
            }
            berserk: if (isAbility(data.target, 'ぎゃくじょう') === true) {
            }
            angerShell: if (isAbility(data.target, 'いかりのこうら') === true) {
            }
        }
    }
}
// 防御側の持ち物の効果 (その4)
function targetItemEffectPart3(pokemon) {
    const targetList = getTargetList(pokemon);
    targetList.sort((a, b) => {
        // 素早さ
        if (getSpeedValue(b.target, 'e') > getSpeedValue(a.target, 'e'))
            return 1;
        if (getSpeedValue(b.target, 'e') < getSpeedValue(a.target, 'e'))
            return -1;
        // 乱数
        if (getRandom() > 50)
            return 1;
        else
            return -1;
    });
    for (const data of targetList) {
        keeBerry: if (isItem(data.target, 'アッキのみ') === true) {
            if (pokemon.moveUsed.category !== '物理')
                break keeBerry;
            if (data.damage.substitute === true)
                break keeBerry;
            if (getRankVariation(data.target, 'defense', 1) === 0)
                break keeBerry;
            if (pokemon.stateChange.sheerForce.isTrue === true)
                break keeBerry;
            changeMyRankByItem(data.target, 'defense', 1, 'アッキのみ');
        }
        marangaBerry: if (isItem(data.target, 'タラプのみ') === true) {
            if (pokemon.moveUsed.category !== '特殊')
                break marangaBerry;
            if (data.damage.substitute === true)
                break marangaBerry;
            if (getRankVariation(data.target, 'specialDefense', 1) === 0)
                break marangaBerry;
            if (pokemon.stateChange.sheerForce.isTrue === true)
                break marangaBerry;
            changeMyRankByItem(data.target, 'specialDefense', 1, 'タラプのみ');
        }
        ejectButton: if (isItem(data.target, 'だっしゅつボタン') === true) {
        }
    }
}
// いにしえのうた/きずなへんげによるフォルムチェンジ
function formChangeByMove(pokemon) {
    const targetList = getTargetList(pokemon);
    relicSong: if (pokemon.moveUsed.name === 'いにしえのうた') {
        if (pokemon.status.name !== 'メロエッタ(ボイス)' && pokemon.status.name !== 'メロエッタ(ステップ)')
            break relicSong;
        if (pokemon.stateChange.sheerForce.isTrue === true)
            break relicSong;
        if (pokemon.status.remainingHP === 0)
            break relicSong;
        formChange(pokemon);
        writeLog(`${getArticle(pokemon)}の 姿が 変化した!`);
    }
    battleBond: if (isAbility(pokemon, 'きずなへんげ') === true) {
        if (pokemon.status.name !== 'サトシゲッコウガ')
            break battleBond;
        let isChange = false;
        if (getRankVariation(pokemon, 'attack', 1) !== 0)
            isChange = true;
        if (getRankVariation(pokemon, 'specialAttack', 1) !== 0)
            isChange = true;
        if (getRankVariation(pokemon, 'speed', 1) !== 0)
            isChange = true;
        if (isChange === false)
            break battleBond;
        let isFaint = false;
        for (const data of targetList) {
            if (data.target.status.remainingHP === 0) {
                isFaint = true;
            }
        }
        if (isFaint === false)
            break battleBond;
        changeMyRank(pokemon, 'attack', 1);
        changeMyRank(pokemon, 'specialAttack', 1);
        changeMyRank(pokemon, 'speed', 1);
        pokemon.status.declareAbility();
        writeLog(`${getArticle(pokemon)}に きずなの 力が みなぎった!`);
    }
}
// いのちのたまの反動/かいがらのすずの回復
function lifeOrbShellBell(pokemon) {
    const targetList = getTargetList(pokemon);
    lifeOrb: if (isItem(pokemon, 'いのちのたま')) {
        if (pokemon.status.remainingHP === 0)
            break lifeOrb;
        if (pokemon.moveUsed.category === '変化')
            break lifeOrb;
        if (pokemon.order.battle === null)
            break lifeOrb;
        if (isAbility(pokemon, 'マジックガード') === true)
            break lifeOrb;
        if (pokemon.stateChange.sheerForce.isTrue === true)
            break lifeOrb;
        const dynamax = (pokemon.stateChange.dynamax.isTrue) ? 0.5 : 1;
        const damage = Math.max(1, Math.floor(pokemon.actualValue.hitPoint * dynamax / 10));
        changeHPByItem(pokemon, 'いのちのたま', damage);
    }
    shellBell: if (isItem(pokemon, 'かいがらのすず') === true) {
        if (pokemon.status.remainingHP === 0)
            break shellBell;
        if (pokemon.order.battle === null)
            break shellBell;
        if (pokemon.stateChange.sheerForce.isTrue === true)
            break shellBell;
        let value = 0;
        for (const data of targetList) {
            value += data.damage.damage;
        }
        if (value === 0)
            break shellBell;
        const damage = Math.max(1, Math.floor(value / 8));
        changeHPByItem(pokemon, 'かいがらのすず', damage);
    }
}
// 防御側の持ち物の効果 (その4)
function targetItemEffectPart4(pokemon) {
    const targetList = getTargetList(pokemon);
    targetList.sort((a, b) => {
        // 素早さ
        if (getSpeedValue(b.target, 'e') > getSpeedValue(a.target, 'e'))
            return 1;
        if (getSpeedValue(b.target, 'e') < getSpeedValue(a.target, 'e'))
            return -1;
        // 乱数
        if (getRandom() > 50)
            return 1;
        else
            return -1;
    });
    for (const data of targetList) {
        if (data.target.status.remainingHP === 0)
            continue;
        const gluttony = (isAbility(data.target, 'くいしんぼう') === true) ? 2 : 1;
        sitrusBerry: if (isItem(data.target, 'オボンのみ') === true || isItem(data.target, 'オレンのみ') === true) {
            if (data.target.status.remainingHP > data.target.actualValue.hitPoint / 2)
                break sitrusBerry;
            if (pokemon.stateChange.healBlock.isTrue === true)
                break sitrusBerry;
            eatBerry(data.target, data.target.status.item);
        }
        confuseBerry: if (isItem(data.target, 'フィラのみ') === true
            || isItem(data.target, 'ウイのみ') === true
            || isItem(data.target, 'マゴのみ') === true
            || isItem(data.target, 'バンジのみ') === true
            || isItem(data.target, 'イアのみ') === true) {
            if (data.target.status.remainingHP > data.target.actualValue.hitPoint * gluttony / 4)
                break confuseBerry;
            if (pokemon.stateChange.healBlock.isTrue === true)
                break confuseBerry;
            eatBerry(data.target, data.target.status.item);
        }
        const rankBerryTable = [
            { name: 'チイラのみ', parameter: 'attack' },
            { name: 'リュガのみ', parameter: 'defense' },
            { name: 'ヤタピのみ', parameter: 'specialAttack' },
            { name: 'ズアのみ', parameter: 'specialDefense' },
            { name: 'カムラのみ', parameter: 'speed' },
        ];
        for (const berry of rankBerryTable) {
            if (isItem(data.target, berry.name) === true) {
                if (data.target.status.remainingHP > data.target.actualValue.hitPoint * gluttony / 4)
                    continue;
                if (getRankVariation(data.target, berry.parameter, 1) === 0)
                    continue;
                eatBerry(data.target, data.target.status.item);
            }
        }
        lansatBerry: if (isItem(data.target, 'サンのみ') === true) {
            if (data.target.status.remainingHP > data.target.actualValue.hitPoint * gluttony / 4)
                break lansatBerry;
            if (data.target.stateChange.focusEnergy.isTrue === true)
                break lansatBerry;
            eatBerry(data.target, data.target.status.item);
        }
        starfBerry: if (isItem(data.target, 'スターのみ') === true) {
            if (data.target.status.remainingHP > data.target.actualValue.hitPoint * gluttony / 4)
                break starfBerry;
            let isTrue = false;
            const parameterList = [];
            for (const parameter of parameterFive) {
                if (getRankVariation(data.target, parameter, 2) !== 0) {
                    isTrue = true;
                    parameterList.push(parameter);
                }
            }
            parameterList.sort((a, b) => 50 - getRandom());
            eatBerry(data.target, data.target.status.item);
        }
        micleBerry: if (isItem(data.target, 'ミクルのみ') === true) {
            if (data.target.status.remainingHP > data.target.actualValue.hitPoint * gluttony / 4)
                break micleBerry;
            eatBerry(data.target, data.target.status.item);
        }
        berryJuice: if (isItem(data.target, 'きのみジュース') === true) {
            if (data.target.status.remainingHP > data.target.actualValue.hitPoint / 2)
                break berryJuice;
            if (pokemon.stateChange.healBlock.isTrue === true)
                break berryJuice;
            changeHPByItem(data.target, 'きのみジュース', 10);
        }
        if (data.damage.damage > 0) {
            activateSeed(data.target);
            activateRoomService(data.target);
        }
    }
}
