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
    onActivate(pokemon, target) {
        this.isTrue = true;
        this.order = new Order(pokemon.order.isMe, pokemon.order.hand);
        battleLog.write(`${target.getArticle()}は もう 逃げられない!`);
    }
    onActivateNoMessage(pokemon) {
        this.isTrue = true;
        this.order = new Order(pokemon.order.isMe, pokemon.order.hand);
    }
    onActivateNoRetreat(pokemon, target) {
        this.isTrue = true;
        this.order = new Order(pokemon.order.isMe, pokemon.order.hand);
        this.noRetreat = true;
        battleLog.write(`${target.getArticle()}は はいすいのじんで 逃げることが できなくなった!`);
    }
}
class Charge extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 充電を 始めた!`);
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
    constructor() {
        super();
        this.turn = new ValueWithRange(4, 0);
    }
    onActivate(pokemon) {
        this.isTrue = true;
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
}
class Electrify extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は そうでんで 技が でんきタイプになった! `);
    }
}
class Embargo extends StateChangeStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(pokemon) {
        this.isTrue = true;
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
    constructor() {
        super();
        this.turn = new ValueWithRange(3, 0);
    }
    onActivate(pokemon) {
        this.isTrue = true;
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
class FocusEnergy extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 張り切っている!`);
    }
}
class Grudge extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 相手に おんねんを かけようとしている!`);
    }
}
class HealBlock extends StateChangeStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(pokemon) {
        this.isTrue = true;
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
    constructor() {
        super();
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(pokemon) {
        this.isTrue = true;
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
    constructor() {
        super();
        this.turn = new ValueWithRange(3, 0);
    }
    onActivate() {
        this.isTrue = true;
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
}
class Protect extends StateChangeStatus {
    onActivate(pokemon, move) {
        this.isTrue = true;
        this.protect = move;
        battleLog.write(`${pokemon.getArticle()}は 守りの 体勢に 入った!`);
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
    constructor() {
        super();
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(pokemon) {
        this.isTrue = true;
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
    constructor() {
        super();
        this.turn = new ValueWithRange(3, 0);
    }
    onActivate(pokemon) {
        this.isTrue = true;
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
}
class Telekinesis extends StateChangeStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(3, 0);
    }
    onActivate(pokemon) {
        this.isTrue = true;
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
class Torment extends StateChangeStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(3, 0);
    }
    onActivate(pokemon) {
        this.isTrue = true;
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
class StateChangeSummary {
    constructor() {
        this.aquaRing = new AquaRing(); // アクアリング
        this.autotomize = new Autotomize(); // ボディパージ
        this.bind = new Bind(); // バインド
        this.cannotEscape = new CannotEscape(); // にげられない
        this.charge = new Charge(); // じゅうでん
        this.curse = new Curse(); // のろい
        this.destinyBond = new DestinyBond(); // みちづれ
        this.disable = new Disable(); // かなしばり
        this.electrify = new Electrify(); // そうでん
        this.embargo = new Embargo(); // さしおさえ
        this.encore = new Encore(); // アンコール
        this.endure = new Endure(); // こらえる
        this.focusEnergy = new FocusEnergy(); // きゅうしょアップ
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
        this.saltCure = new SaltCure(); // しおづけ
        this.slowStart = new SlowStart(); // スロースタート
        this.spotlight = new Spotlight(); // ちゅうもくのまと
        this.stockpile = new Stockpile(); // たくわえる
        this.substitute = new Substitute(); // みがわり
        this.tarShot = new TarShot(); // タールショット
        this.taunt = new Taunt(); // ちょうはつ
        this.telekinesis = new Telekinesis(); // テレキネシス
        this.torment = new Torment(); // いちゃもん
        this._flinch = new StateChange();
        this._attract = new Attract();
        this._yawn = new StateChange();
        this._foresight = new StateChange();
        this._miracleEye = new StateChange();
        this._smackDown = new StateChange();
        this._throatChop = new StateChange();
        this._saltCure = new StateChange();
        this._minimize = new StateChange();
        this._uproar = new StateChange();
        this._rage = new StateChange();
        this._transform = new Transform();
        this._fly = new StateChange();
        this._dig = new StateChange();
        this._dive = new StateChange();
        this._shadowForce = new StateChange();
        this._confuse = new StateChange();
        this._truant = new StateChange();
        this._disguise = new StateChange();
        this._iceFace = new StateChange();
        this._protean = new StateChange();
        this._quarkDrive = new StateChange();
        this._protosynthesis = new StateChange();
        this._flashFire = new StateChange();
        this._sheerForce = new StateChange();
        this._synchronize = new StateChange();
        this._gulpMissile = new StateChange();
        this._gem = new StateChange();
        this._micleBerry = new StateChange();
        this._halfBerry = new StateChange();
        this._cannotMove = new StateChange();
        this._beakBlast = new StateChange();
        this._focusPunch = new StateChange();
        this._someProtect = new StateChange();
        this._endureMsg = new StateChange();
        this._fling = new StateChange();
        this._dynamax = new StateChange();
        this._rangeCorr = new StateChange();
        this._memo = new StateChange();
    }
    set flinch(flinch) {
        this._flinch = flinch;
    }
    set attract(attract) {
        this._attract = attract;
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
    set throatChop(throatChop) {
        this._throatChop = throatChop;
    }
    set minimize(minimize) {
        this._minimize = minimize;
    }
    set uproar(uproar) {
        this._uproar = uproar;
    }
    set rage(rage) {
        this._rage = rage;
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
    set confuse(confuse) {
        this._confuse = confuse;
    }
    set truant(truant) {
        this._truant = truant;
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
    set quarkDrive(quarkDrive) {
        this._quarkDrive = quarkDrive;
    }
    set protosynthesis(protosynthesis) {
        this._protosynthesis = protosynthesis;
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
    set cannotMove(cannotMove) {
        this._cannotMove = cannotMove;
    }
    set beakBlast(beakBlast) {
        this._beakBlast = beakBlast;
    }
    set focusPunch(focusPunch) {
        this._focusPunch = focusPunch;
    }
    set someProtect(someProtect) {
        this._someProtect = someProtect;
    }
    set endureMsg(endureMsg) {
        this._endureMsg = endureMsg;
    }
    set fling(fling) {
        this._fling = fling;
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
    get flinch() {
        return this._flinch;
    }
    get attract() {
        return this._attract;
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
    get throatChop() {
        return this._throatChop;
    }
    get minimize() {
        return this._minimize;
    }
    get uproar() {
        return this._uproar;
    }
    get rage() {
        return this._rage;
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
    get confuse() {
        return this._confuse;
    }
    get truant() {
        return this._truant;
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
    get quarkDrive() {
        return this._quarkDrive;
    }
    get protosynthesis() {
        return this._protosynthesis;
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
    get cannotMove() {
        return this._cannotMove;
    }
    get beakBlast() {
        return this._beakBlast;
    }
    get focusPunch() {
        return this._focusPunch;
    }
    get someProtect() {
        return this._someProtect;
    }
    get endureMsg() {
        return this._endureMsg;
    }
    get fling() {
        return this._fling;
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
    getConfusion(name) {
        const turn = Math.floor(getRandom() * 0.04) + 2; // 2,3,4,5のいずれか
        this._confuse.isTrue = true;
        this._confuse.turn = turn;
        battleLog.write(`${name}は 混乱した!`);
    }
}
