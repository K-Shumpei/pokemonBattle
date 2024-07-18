"use strict";
class StateChangeStatus {
    constructor() {
        this.isTrue = false;
        this.turn = new ValueWithRange();
        this.count = 0;
        this.move = null;
        this.order = new Order(true, 0);
        this.hp = new ValueWithRange();
        this.protect = null; // まもる系統
        this.strong = false; // しめつけバンド
        this.flag = false; // なまけ、きあいパンチ
        this.item = null;
        this.rank = 'acc'; // クォークチャージ、こだいかっせい
    }
    reset() {
        this.isTrue = false;
        this.turn.value = this.turn.max;
        this.count = 0;
        this.move = null;
        this.order = new Order(true, 0);
        this.hp = new ValueWithRange();
        this.protect = null;
        this.strong = false;
        this.flag = false;
        this.item = null;
        this.rank = 'acc';
    }
}
class Attract extends StateChangeStatus {
    // pokemon → メロメロになる方
    // target → メロメロにする方
    isActivate(pokemon, target) {
        if (this.isTrue)
            return false;
        if (pokemon.gender === 'genderless')
            return false;
        if (target.gender === 'genderless')
            return false;
        if (pokemon.gender === target.gender)
            return false;
        if (pokemon.isMine() === target.isMine())
            return false;
        if (pokemon.isAbility('Oblivious'))
            return false; // 特性「どんかん」
        if (!main.isExistAbilityInSide(pokemon.isMine(), 'Aroma Veil'))
            return false; // 特性「アロマベール」
        return true;
    }
    onActivate(pokemon, target) {
        if (!this.isActivate(pokemon, target))
            return;
        this.isTrue = true;
        this.order.setInfo(target.order);
        battleLog.write(`${pokemon.getArticle()}は メロメロに なった!`);
        if (pokemon.isItem('あかいいと')) {
            target.stateChange.attract.onActivate(target, pokemon);
        }
    }
    // pokemon → メロメロボディ
    // target → 攻撃側
    onActivateByCuteCharm(pokemon, target, attack) {
        if (attack.substitute)
            return;
        if (!target.isContact())
            return;
        if (!pokemon.isAbility('Cute Charm'))
            return; // 特性「メロメロボディ」
        if (target.isItem('ぼうごパット'))
            return;
        if (getRandom() >= 30)
            return;
        if (!this.isActivate(pokemon, target))
            return;
        pokemon.msgDeclareAbility();
        this.onActivate(target, pokemon);
    }
    isEffective(pokemon) {
        if (!this.isTrue)
            return false;
        const target = main.getPokemonByOrder(this.order);
        battleLog.write(`${pokemon.getArticle()}は ${target.getArticle()}に メロメロだ!`);
        if (getRandom() < 50)
            return false;
        battleLog.write(`${pokemon.getArticle()}は メロメロで 技が だせなかった!`);
        return true;
    }
}
class AquaRing extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 水のリングを まとった!`);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        if (pokemon.status.hp.value.isMax())
            return;
        const heal = Math.floor(pokemon.getOrgHP() / 16);
        pokemon.status.hp.value.add(Math.max(1, heal));
        battleLog.write(`${pokemon.getArticle()}は 水のリングで 体力を回復!`);
    }
}
class Autotomize extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 身軽になった!`);
    }
}
class BeakBlast extends StateChangeStatus {
    onEffective(pokemon, target, attack) {
        if (attack.substitute)
            return;
        if (!target.isContact())
            return;
        if (!this.isTrue)
            return;
        if (target.move.selected.name === 'Sky Drop')
            return; // 技「フリーフォール」
        if (!target.isGetAilmentByOther('Burned', pokemon))
            return;
        target.statusAilment.getBurned();
    }
}
class Bind extends StateChangeStatus {
    onActivate(pokemon, target) {
        const getTurn = () => {
            if (pokemon.isItem('ねばりのかぎづめ'))
                return 7;
            if (getRandom() < 50)
                return 5;
            return 4;
        };
        this.isTrue = true;
        this.turn.setInitial(getTurn());
        this.move = pokemon.move.selected.name;
        if (pokemon.isItem('しめつけバンド')) {
            this.strong = true;
        }
        switch (pokemon.move.selected.name) {
            case 'Whirlpool': // 技「うずしお」
                battleLog.write(`${target.getArticle()}は 渦の中に 閉じこめられた!`);
                break;
            case 'Clamp': // 技「からではさむ」
                battleLog.write(`${target.getArticle()}は ${pokemon.getArticle()}の からに はさまれた!`);
                break;
            case 'Thunder Cage': // 技「サンダープリズン」
                battleLog.write(`${target.getArticle()}は ${pokemon.getArticle()}に 閉じこめられた!`);
                break;
            case 'Bind': // 技「しめつける」
                battleLog.write(`${target.getArticle()}は ${pokemon.getArticle()}に しめつけられた!`);
                break;
            case 'Sand Tomb': // 技「すなじごく」
                battleLog.write(`${target.getArticle()}は 砂じごくに 捕らわれた!`);
                break;
            case 'Snap Trap': // 技「トラバサミ」
                battleLog.write(`${target.getArticle()}は トラバサミに 捕らわれた!`);
                break;
            case 'Fire Spin': // 技「ほのおのうず」
                battleLog.write(`${target.getArticle()}は 炎の渦に 閉じこめられた!`);
                break;
            case 'Wrap': // 技「まきつく」
                battleLog.write(`${target.getArticle()}は ${pokemon.getArticle()}に 巻きつかれた!`);
                break;
            case 'Magma Storm': // 技「マグマストーム」
                battleLog.write(`${target.getArticle()}は マグマの渦に 閉じこめられた!`);
                break;
            case 'Infestation': // 技「まとわりつく」
                battleLog.write(`${target.getArticle()}は ${pokemon.getArticle()}に まとわりつかれた!`);
                break;
            default:
                break;
        }
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        const getDamage = () => {
            if (this.strong) {
                return Math.floor(pokemon.getOrgHP() / 6);
            }
            else {
                return Math.floor(pokemon.getOrgHP() / 8);
            }
        };
        this.turn.sub(1);
        if (this.turn.isZero()) {
            battleLog.write(`${pokemon.getArticle()}は ${this.move}から 解放された!`);
            this.reset();
            return;
        }
        pokemon.status.hp.value.sub(Math.max(1, getDamage()));
        battleLog.write(`${pokemon.getArticle()}は ${this.move}の ダメージを 受けている`);
    }
}
class CannotEscape extends StateChangeStatus {
    constructor() {
        super(...arguments);
        this.octolock = false;
        this.noRetreat = false;
    }
    onActivateNoMessage(serve) {
        if (this.isTrue)
            return;
        this.isTrue = true;
        this.order.setInfo(serve.order);
    }
    onActivate(serve, receive) {
        this.onActivateNoMessage(serve);
        battleLog.write(`${receive.getArticle()}は もう 逃げられない!`);
    }
    onActivateNoRetreat(serve, receive) {
        this.onActivateNoMessage(serve);
        this.noRetreat = true;
        battleLog.write(`${receive.getArticle()}は はいすいのじんで 逃げることが できなくなった!`);
    }
    onActivateJawLock(serve, receive) {
        this.onActivateNoMessage(serve);
        serve.stateChange.cannotEscape.onActivateNoMessage(receive);
        battleLog.write(`おたがいの ポケモンは 逃げることが できなくなった!`);
    }
}
class CannotMove extends StateChangeStatus {
    isEffective(pokemon) {
        if (!this.isTrue)
            return false;
        battleLog.write(`${pokemon.getArticle()}は 攻撃の 反動で 動けない!`);
        this.reset();
        pokemon.stateChange.truant.onElapse();
        return true;
    }
}
class Charge extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 充電を 始めた!`);
    }
}
class Confuse extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        const turn = Math.floor(getRandom() * 0.04) + 2; // 2,3,4,5のいずれか
        this.turn.setInitial(turn);
        battleLog.write(`${pokemon.getArticle()}は 混乱した!`);
    }
    isEffective(pokemon) {
        if (!this.isTrue)
            return false;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            battleLog.write(`${pokemon.getArticle()}の 混乱が 解けた!`);
            this.reset();
            return false;
        }
        battleLog.write(`${pokemon.getArticle()}は 混乱している!`);
        if (getRandom() < 2 / 3 * 100)
            return false;
        battleLog.write(`わけも わからず 自分を 攻撃した!`);
        const power = 40;
        const attack = pokemon.status.atk.rankCorrectionValue;
        const defense = pokemon.status.def.rankCorrectionValue;
        // 最終ダメージ
        const damage = Math.floor(Math.floor(Math.floor(pokemon.level * 2 / 5 + 2) * power * attack / defense) / 50 + 2);
        // 乱数補正
        const randomCorrection = Math.floor(getRandom() * 16) + 8500;
        const finalDamage = Math.floor(damage * randomCorrection / 10000);
        // 本体にダメージを与える
        /*
        const damageType = new Attack;
        damageType.damage = processAfterCalculation( pokemon, pokemon, finalDamage, damageType );
        damageToBody( pokemon, damageType );
        // ダメージをHP1で耐える効果のメッセージなど
        enduringEffectsMessage( pokemon );
        */
        return true;
    }
}
class Curse extends StateChangeStatus {
    onActivate(pokemon, target) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 自分の体力を 削って ${target.getArticle()}に のろいを かけた!`);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        const damage = Math.floor(pokemon.getOrgHP() / 4);
        pokemon.status.hp.value.sub(Math.max(1, damage));
        battleLog.write(`${pokemon.getArticle()}は のろわれている! `);
    }
}
class DestinyBond extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 相手を 道連れに しようとしている!`);
    }
}
class Disable extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        this.turn.setInitial(4);
        // this.move = pokemon.move.selected.name;
        // battleLog.write( `${pokemon.getArticle()}の ${pokemon.move.selected.translate()}を 封じこめた! ` );
    }
    onElapse(pokemon) {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${pokemon.getArticle()}の かなしばりが 解けた! `);
        }
    }
    isEffective(pokemon) {
        if (!this.isTrue)
            return false;
        // if ( !pokemon.move.selected.isName( pokemon.stateChange.disable.text ) ) return false;
        battleLog.write(`${pokemon.getArticle()}は かなしばりで 技が 出せない!`);
        return true;
    }
}
class Electrify extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は そうでんで 技が でんきタイプになった! `);
    }
}
class Embargo extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        this.turn.setInitial(5);
        battleLog.write(`${pokemon.getArticle()}は 道具が 使えなくなった! `);
    }
    onElapse(pokemon) {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${pokemon.getArticle()}は 道具が 使えるようになった! `);
        }
    }
}
class Encore extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        this.turn.setInitial(3);
        // this.move = pokemon.move.selected.name;
        battleLog.write(`${pokemon.getArticle()}は アンコールを受けた! `);
    }
    onElapse(pokemon) {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${pokemon.getArticle()}の アンコール状態が 解けた! `);
        }
    }
}
class Endure extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は こらえる 体勢に 入った!`);
    }
}
class Flinch extends StateChangeStatus {
    onActivate() {
        this.isTrue = true;
    }
    isEffective(pokemon) {
        if (!this.isTrue)
            return false;
        battleLog.write(`${pokemon.getArticle()}は ひるんで 技が 出せない!`);
        if (pokemon.isAbility('Steadfast') && pokemon.isChangeRank('spe', 1)) { // 特性「ふくつのこころ」
            pokemon.msgDeclareAbility();
            pokemon.changeRank('spe', 1);
        }
        return true;
    }
}
class Fling extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        this.item = pokemon.item.name;
        pokemon.item.recyclable();
    }
}
class FocusEnergy extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 張り切っている!`);
    }
}
class FocusPunch extends StateChangeStatus {
    isEffective(pokemon) {
        if (!this.isTrue)
            return false;
        if (this.flag) {
            this.reset();
            return false;
        }
        else {
            battleLog.write(`${pokemon.getArticle()}は 集中が 途切れて 技が 出せない!`);
            this.reset();
            return true;
        }
    }
}
class Grudge extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 相手に おんねんを かけようとしている!`);
    }
    onEffective(pokemon, target) {
        if (!this.isTrue)
            return;
        if (!pokemon.status.hp.value.isZero())
            return;
        if (target.move.learned[target.move.selected.slot].powerPoint.isZero())
            return;
        target.move.learned[target.move.selected.slot].powerPoint.toZero();
        battleLog.write(`${target.getArticle()}の ${target.move.learned[target.move.selected.slot].translate()}は おんねんで PPが0になった!`);
    }
}
class HealBlock extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        this.turn.setInitial(5);
        battleLog.write(`${pokemon.getArticle()}は 回復動作を 封じられた!`);
    }
    onElapse(pokemon) {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${pokemon.getArticle()}の かいふくふうじの 効果が切れた! `);
        }
    }
    isEffective(pokemon) {
        if (!this.isTrue)
            return false;
        if (!pokemon.move.selected.getMaster().heal)
            return false;
        if (pokemon.move.selected.name === 'Pollen Puff' // 技「かふんだんご」
            && pokemon.attack.getValidTarget()[0].isMe !== pokemon.isMine()) {
            return false;
        }
        battleLog.write(`${pokemon.getArticle()}は かいふくふうじで 技が 出せない!`);
        return true;
    }
}
class HelpingHand extends StateChangeStatus {
    onActivate(pokemon, target) {
        this.isTrue = true;
        this.count += 1;
        battleLog.write(`${pokemon.getArticle()}は ${target.getArticle()}を 手助けする 体勢に入った!`);
    }
}
class Imprison extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 相手の技を 封印した!`);
    }
    isEffective(pokemon, atkPokemon) {
        if (!this.isTrue)
            return false;
        for (const move of pokemon.move.learned) {
            if (move.name === atkPokemon.move.selected.name) {
                battleLog.write(`${atkPokemon.getArticle()}は ふういんで 技が 出せない!`);
                return true;
            }
        }
        return false;
    }
}
class Ingrain extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 根を はった!`);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        if (pokemon.status.hp.value.isMax())
            return;
        const heal = Math.floor(pokemon.getOrgHP() / 16);
        pokemon.status.hp.value.add(Math.max(1, heal));
        battleLog.write(`${pokemon.getArticle()}は 根から 養分を 吸い取った!`);
    }
}
class LaserFocus extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 精神を 研ぎ澄ました!`);
    }
}
class LeechSeed extends StateChangeStatus {
    onActivate(pokemon, target) {
        this.isTrue = true;
        this.order.setInfo(pokemon.order);
        battleLog.write(`${target.getArticle()}に 種を 植えつけた!`);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        const calcDamage = () => {
            let base = Math.floor(pokemon.getOrgHP() / 16);
            let rest = pokemon.status.hp.value.value;
            if (rest < base) {
                return rest;
            }
            else {
                return Math.max(1, base);
            }
        };
        const damage = calcDamage();
        const target = main.getPokemonByOrder(this.order);
        if (!target)
            return;
        pokemon.status.hp.value.sub(damage);
        target.status.hp.value.add(damage);
        battleLog.write(`やどりぎが ${pokemon.getArticle()}の 体力を奪う!`);
    }
}
class LockOn extends StateChangeStatus {
    onActivate(pokemon, target) {
        this.isTrue = true;
        this.order.setInfo(target.order);
        battleLog.write(`${pokemon.getArticle()}は ${target.getArticle()}に ねらいを さだめた!`);
    }
}
class MagicCoat extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は マジックコートに つつまれた!`);
    }
}
class MagnetRise extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        this.turn.setInitial(5);
        battleLog.write(`${pokemon.getArticle()}は 電磁力で 浮かびあがった!`);
    }
    onElapse(pokemon) {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${pokemon.getArticle()}の 電磁力が なくなった! `);
        }
    }
}
class Nightmare extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は あくむを 見始めた!`);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        const damage = Math.floor(pokemon.getOrgHP() / 4);
        pokemon.status.hp.value.sub(Math.max(1, damage));
        battleLog.write(`${pokemon.getArticle()}は あくむに うなされている!`);
    }
}
class NoAbility extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 特性が 効かなくなった!`);
    }
}
class Octolock extends StateChangeStatus {
    onActivate(pokemon, target) {
        this.isTrue = true;
        this.order = new Order(pokemon.order.isMe, pokemon.order.hand);
        battleLog.write(`${target.getArticle()}は たこがためで 逃げられなくなった!`);
        target.stateChange.cannotEscape.onActivateNoMessage(pokemon);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        const target = main.getPokemonByOrder(this.order);
        pokemon.changeRankByOther('def', -1, target);
        pokemon.changeRankByOther('spD', -1, target);
    }
}
class PerishSong extends StateChangeStatus {
    onActivate() {
        this.isTrue = true;
        this.turn.setInitial(3);
    }
    // pokemon → ほろびのボディ
    // target → 攻撃側
    onActivateByPerishBody(pokemon, target, attack) {
        if (attack.substitute)
            return;
        if (target.isContact())
            return;
        if (!pokemon.ability.isName('Perish Body'))
            return; // 特性「ほろびのボディ」
        if (target.status.hp.value.isZero())
            return;
        if (target.isItem('ぼうごパット'))
            return;
        if (this.isTrue && target.stateChange.perishSong.isTrue)
            return;
        pokemon.msgDeclareAbility();
        if (!this.isTrue && !target.stateChange.perishSong.isTrue) {
            battleLog.write(`おたがいは 3ターン後に 滅びてしまう!`);
        }
        else {
            if (!this.isTrue) {
                battleLog.write(`${pokemon.getArticle()}は 3ターン後に 滅びてしまう!`);
            }
            else {
                battleLog.write(`${target.getArticle()}は 3ターン後に 滅びてしまう!`);
            }
        }
        this.onActivate();
        target.stateChange.perishSong.onActivate();
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        battleLog.write(`${pokemon.getArticle()}の 滅びのカウントが ${this.turn.value}になった!`);
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            pokemon.status.hp.value.toZero();
        }
    }
}
class Powder extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}に ふんじんを あびせた!`);
    }
    isEffective(pokemon) {
        if (!this.isTrue)
            return false;
        if (pokemon.move.selected.type !== 'Fire')
            return false;
        pokemon.attack.reset();
        battleLog.write(`${pokemon.move.selected.translate()}に 反応して ふんじんが 爆発した!`);
        if (pokemon.ability.isName('Magic Guard'))
            return true; // 特性「マジックガード」
        const damage = Math.floor(pokemon.getOrgHP() / 4);
        pokemon.status.hp.value.sub(damage);
        return true;
    }
}
class Protect extends StateChangeStatus {
    onActivate(pokemon, move) {
        this.isTrue = true;
        this.protect = move;
        battleLog.write(`${pokemon.getArticle()}は 守りの 体勢に 入った!`);
    }
}
class Protosynthesis extends StateChangeStatus {
    onActivate(pokemon, item) {
        this.isTrue = true;
        if (item) {
            this.item = 'ブーストエナジー';
            battleLog.write(`${pokemon.getArticle()}は ブーストエナジーで こだいかっせいを 発動した!`);
        }
        else {
            battleLog.write(`${pokemon.getArticle()}は にほんばれで こだいかっせいを 発動した!`);
        }
        const statusList = [
            { text: '攻撃', en: 'atk', value: pokemon.status.atk.rankCorrectionValue },
            { text: '防御', en: 'def', value: pokemon.status.def.rankCorrectionValue },
            { text: '特攻', en: 'spA', value: pokemon.status.spA.rankCorrectionValue },
            { text: '特防', en: 'spD', value: pokemon.status.spD.rankCorrectionValue },
            { text: '素早さ', en: 'spe', value: pokemon.status.spe.rankCorrectionValue },
        ];
        const status = statusList.sort((a, b) => {
            if (a.value >= b.value)
                return -1;
            else
                return 1;
        })[0];
        this.rank = status.en;
        battleLog.write(`${pokemon.getArticle()}の ${status.text}が 高まった!`);
    }
    onRemove(pokemon) {
        if (!this.isTrue)
            return;
        if (main.field.weather.name === 'HarshSunlight')
            return;
        if (this.item === 'ブーストエナジー')
            return;
        battleLog.write(`${pokemon.getArticle()}は こだいかっせいの 効果が 切れた!`);
        this.reset();
    }
}
class QuarkDrive extends StateChangeStatus {
    onActivate(pokemon, item) {
        this.isTrue = true;
        if (item) {
            this.item = 'ブーストエナジー';
            battleLog.write(`${pokemon.getArticle()}は ブーストエナジーで クォークチャージを 発動した!`);
        }
        else {
            battleLog.write(`${pokemon.getArticle()}は エレキフィールドで クォークチャージを 発動した!`);
        }
        const statusList = [
            { text: '攻撃', en: 'atk', value: pokemon.status.atk.rankCorrectionValue },
            { text: '防御', en: 'def', value: pokemon.status.def.rankCorrectionValue },
            { text: '特攻', en: 'spA', value: pokemon.status.spA.rankCorrectionValue },
            { text: '特防', en: 'spD', value: pokemon.status.spD.rankCorrectionValue },
            { text: '素早さ', en: 'spe', value: pokemon.status.spe.rankCorrectionValue },
        ];
        const status = statusList.sort((a, b) => {
            if (a.value >= b.value)
                return -1;
            else
                return 1;
        })[0];
        this.rank = status.en;
        battleLog.write(`${pokemon.getArticle()}の ${status.text}が 高まった!`);
    }
    onRemove(pokemon) {
        if (!this.isTrue)
            return;
        if (main.field.terrain.isElectric())
            return;
        if (this.item === 'ブーストエナジー')
            return;
        battleLog.write(`${pokemon.getArticle()}は クォークチャージの 効果が 切れた!`);
        this.reset();
    }
}
class Rage extends StateChangeStatus {
    onEffective(pokemon, attack) {
        if (pokemon.status.hp.value.isZero())
            return;
        if (attack.substitute)
            return;
        if (!this.isTrue)
            return;
        if (!pokemon.isChangeRank('atk', 1))
            return;
        const setting = pokemon.getRankVariableOrg(1);
        const real = pokemon.getRankVariable('atk', setting);
        pokemon.status.atk.rank.add(real);
        battleLog.write(`${pokemon.getArticle()}の いかりのボルテージが 上がっていく!`);
    }
}
class SaltCure extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は しおづけに なった!`);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        const damage = () => {
            if (pokemon.type.has('Water') || pokemon.type.has('Steel')) {
                return Math.floor(pokemon.getOrgHP() / 4);
            }
            else {
                return Math.floor(pokemon.getOrgHP() / 8);
            }
        };
        pokemon.status.hp.value.sub(Math.max(1, damage()));
        battleLog.write(`${pokemon.getArticle()}は しおづけの ダメージを 受けている`);
    }
}
class SlowStart extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        this.turn.setInitial(5);
        battleLog.write(`${pokemon.getArticle()}は 調子が 上がらない!`);
    }
    onElapse(pokemon) {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${pokemon.getArticle()}は 調子を 取り戻した! `);
        }
    }
}
class Spotlight extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 注目の的に なった!`);
    }
}
class Stockpile extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        this.count += 1;
        battleLog.write(`${pokemon.getArticle()}は ${this.count}つ たくわえた!`);
        pokemon.changeRank('def', 1);
        pokemon.changeRank('spD', 1);
    }
}
class Substitute extends StateChangeStatus {
    onActivate(pokemon, hp) {
        this.isTrue = true;
        this.hp = new ValueWithRange(hp, 0);
        battleLog.write(`${pokemon.getArticle()}の 身代わりが 現れた!`);
    }
}
class TarShot extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は ほのおに 弱くなった!`);
    }
}
class Taunt extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        this.turn.setInitial(3);
        battleLog.write(`${pokemon.getArticle()}は 挑発に 乗ってしまった!`);
    }
    onElapse(pokemon) {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${pokemon.getArticle()}は 挑発の効果が 解けた! `);
        }
    }
    isEffective(pokemon) {
        if (!this.isTrue)
            return false;
        if (pokemon.move.selected.name === 'Me First')
            return false; // 技「さきどり」
        if (!pokemon.move.selected.isStatus())
            return false;
        battleLog.write(`${pokemon.getArticle()}は ちょうはつされて 技が 出せない!`);
        return true;
    }
}
class Telekinesis extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        this.turn.setInitial(3);
        battleLog.write(`${pokemon.getArticle()}を 宙に 浮かせた!`);
    }
    onElapse(pokemon) {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${pokemon.getArticle()}は テレキネシスから 解放された! `);
        }
    }
}
class ThroatChop extends StateChangeStatus {
    onActivate() {
        this.isTrue = true;
        this.turn.setInitial(2);
    }
    isEffective(pokemon) {
        if (!this.isTrue)
            return false;
        if (!pokemon.move.selected.getMaster().sound)
            return false;
        battleLog.write(`${pokemon.getArticle()}は じごくづきの効果で 技が 出せない!`);
        return true;
    }
}
class Torment extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        this.turn.setInitial(3);
        this.move = pokemon.move.selected.name;
        battleLog.write(`${pokemon.getArticle()}は いちゃもんを つけられた!`);
    }
    onElapse(pokemon) {
        if (!this.isTrue)
            return;
        // if ( pokemon.move.selected.name !== 'G-Max Meltdown' ) return; // 技「キョダイユウゲキ」
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${pokemon.getArticle()}の いちゃもんの 効果が切れた! `);
        }
    }
}
class Truant extends StateChangeStatus {
    onElapse() {
        if (!this.isTrue)
            return;
        this.flag = !this.flag;
    }
    isEffective(pokemon) {
        if (!this.isTrue)
            return false;
        if (this.flag) {
            pokemon.msgDeclareAbility();
            battleLog.write(`${pokemon.getArticle()}は なまけている`);
            this.onElapse();
            return true;
        }
        else {
            this.onElapse();
            return false;
        }
    }
}
class StateChangeSummary {
    constructor() {
        this.attract = new Attract(); // メロメロ
        this.aquaRing = new AquaRing(); // アクアリング
        this.autotomize = new Autotomize(); // ボディパージ
        this.beakBlast = new BeakBlast(); // くちばしキャノン
        this.bind = new Bind(); // バインド
        this.cannotEscape = new CannotEscape(); // にげられない
        this.cannotMove = new CannotMove(); // 反動で動けない
        this.charge = new Charge(); // じゅうでん
        this.confuse = new Confuse(); // こんらん
        this.curse = new Curse(); // のろい
        this.destinyBond = new DestinyBond(); // みちづれ
        this.disable = new Disable(); // かなしばり
        this.electrify = new Electrify(); // そうでん
        this.embargo = new Embargo(); // さしおさえ
        this.encore = new Encore(); // アンコール
        this.endure = new Endure(); // こらえる
        this.flinch = new Flinch(); // ひるみ
        this.fling = new Fling(); // なげつける
        this.focusEnergy = new FocusEnergy(); // きゅうしょアップ
        this.focusPunch = new FocusPunch(); // きあいパンチ
        this.grudge = new Grudge(); // おんねん
        this.healBlock = new HealBlock(); // かいふくふうじ
        this.helpingHand = new HelpingHand(); // てだすけ
        this.imprison = new Imprison(); // ふういん
        this.ingrain = new Ingrain(); // ねをはる
        this.laserFocus = new LaserFocus(); // とぎすます
        this.leechSeed = new LeechSeed(); // やどりぎのタネ
        this.lockOn = new LockOn(); // ロックオン
        this.magicCoat = new MagicCoat(); // マジックコート
        this.magnetRise = new MagnetRise(); // でんじふゆう
        this.nightmare = new Nightmare(); // あくむ
        this.noAbility = new NoAbility(); // とくせいなし
        this.octolock = new Octolock(); // たこがため
        this.perishSong = new PerishSong(); // ほろびのうた
        this.powder = new Powder(); // ふんじん
        this.protect = new Protect(); // まもる
        this.protosynthesis = new Protosynthesis(); // こだいかっせい
        this.quarkDrive = new QuarkDrive(); // クォークチャージ
        this.rage = new Rage(); // いかり
        this.saltCure = new SaltCure(); // しおづけ
        this.slowStart = new SlowStart(); // スロースタート
        this.spotlight = new Spotlight(); // ちゅうもくのまと
        this.stockpile = new Stockpile(); // たくわえる
        this.substitute = new Substitute(); // みがわり
        this.tarShot = new TarShot(); // タールショット
        this.taunt = new Taunt(); // ちょうはつ
        this.telekinesis = new Telekinesis(); // テレキネシス
        this.throatChop = new ThroatChop(); // じごくづき
        this.torment = new Torment(); // いちゃもん
        this.truant = new Truant(); // なまけ
        this._yawn = new StateChange();
        this._foresight = new StateChange();
        this._miracleEye = new StateChange();
        this._smackDown = new StateChange();
        this._saltCure = new StateChange();
        this._minimize = new StateChange();
        this._uproar = new StateChange();
        this._transform = new Transform();
        this._fly = new StateChange();
        this._dig = new StateChange();
        this._dive = new StateChange();
        this._shadowForce = new StateChange();
        this._disguise = new StateChange();
        this._iceFace = new StateChange();
        this._protean = new StateChange();
        this._flashFire = new StateChange();
        this._sheerForce = new StateChange();
        this._synchronize = new StateChange();
        this._gulpMissile = new StateChange();
        this._gem = new StateChange();
        this._micleBerry = new StateChange();
        this._halfBerry = new StateChange();
        this._someProtect = new StateChange();
        this._endureMsg = new StateChange();
        this._dynamax = new StateChange();
        this._rangeCorr = new StateChange();
        this._memo = new StateChange();
    }
    set yawn(yawn) {
        this._yawn = yawn;
    }
    set foresight(foresight) {
        this._foresight = foresight;
    }
    set miracleEye(miracleEye) {
        this._miracleEye = miracleEye;
    }
    set smackDown(smackDown) {
        this._smackDown = smackDown;
    }
    set minimize(minimize) {
        this._minimize = minimize;
    }
    set uproar(uproar) {
        this._uproar = uproar;
    }
    set transform(transform) {
        this._transform = transform;
    }
    set fly(fly) {
        this._fly = fly;
    }
    set dig(dig) {
        this._dig = dig;
    }
    set dive(dive) {
        this._dive = dive;
    }
    set shadowForce(shadowForce) {
        this._shadowForce = shadowForce;
    }
    set disguise(disguise) {
        this._disguise = disguise;
    }
    set iceFace(iceFace) {
        this._iceFace = iceFace;
    }
    set protean(protean) {
        this._protean = protean;
    }
    set flashFire(flashFire) {
        this._flashFire = flashFire;
    }
    set sheerForce(sheerForce) {
        this._sheerForce = sheerForce;
    }
    set synchronize(synchronize) {
        this._synchronize = synchronize;
    }
    set gulpMissile(gulpMissile) {
        this._gulpMissile = gulpMissile;
    }
    set gem(gem) {
        this._gem = gem;
    }
    set micleBerry(micleBerry) {
        this._micleBerry = micleBerry;
    }
    set halfBerry(halfBerry) {
        this._halfBerry = halfBerry;
    }
    set someProtect(someProtect) {
        this._someProtect = someProtect;
    }
    set endureMsg(endureMsg) {
        this._endureMsg = endureMsg;
    }
    set dynamax(dynamax) {
        this._dynamax = dynamax;
    }
    set rangeCorr(rangeCorr) {
        this._rangeCorr = rangeCorr;
    }
    set memo(memo) {
        this._memo = memo;
    }
    get yawn() {
        return this._yawn;
    }
    get foresight() {
        return this._foresight;
    }
    get miracleEye() {
        return this._miracleEye;
    }
    get smackDown() {
        return this._smackDown;
    }
    get minimize() {
        return this._minimize;
    }
    get uproar() {
        return this._uproar;
    }
    get transform() {
        return this._transform;
    }
    get fly() {
        return this._fly;
    }
    get dig() {
        return this._dig;
    }
    get dive() {
        return this._dive;
    }
    get shadowForce() {
        return this._shadowForce;
    }
    get disguise() {
        return this._disguise;
    }
    get iceFace() {
        return this._iceFace;
    }
    get protean() {
        return this._protean;
    }
    get flashFire() {
        return this._flashFire;
    }
    get sheerForce() {
        return this._sheerForce;
    }
    get synchronize() {
        return this._synchronize;
    }
    get gulpMissile() {
        return this._gulpMissile;
    }
    get gem() {
        return this._gem;
    }
    get micleBerry() {
        return this._micleBerry;
    }
    get halfBerry() {
        return this._halfBerry;
    }
    get someProtect() {
        return this._someProtect;
    }
    get endureMsg() {
        return this._endureMsg;
    }
    get dynamax() {
        return this._dynamax;
    }
    get rangeCorr() {
        return this._rangeCorr;
    }
    get memo() {
        return this._memo;
    }
    isHide() {
        return this._fly.isTrue || this._dig.isTrue || this._dive.isTrue || this._shadowForce.isTrue;
    }
}
