"use strict";
class StateChangeStatus {
    constructor() {
        this.isTrue = false;
        this.turn = new ValueWithRange();
        this.count = 0;
        this.move = null;
        this.order = new Order(true, 0);
    }
    reset() {
        this.isTrue = false;
        this.turn.value = this.turn.max;
        this.count = 0;
        this.move = null;
        this.order = new Order(true, 0);
    }
}
class CannotEscape extends StateChangeStatus {
    onActivate(pokemon, target) {
        this.isTrue = true;
        this.order = new Order(pokemon.order.isMe, pokemon.order.hand);
        writeLog(`${target.getArticle()}は もう 逃げられない!`);
    }
}
class Curse extends StateChangeStatus {
    onActivate(pokemon, target) {
        this.isTrue = true;
        writeLog(`${pokemon.getArticle()}は 自分の体力を 削って ${target.getArticle()}に のろいを かけた!`);
    }
    onElapse(pokemon) {
        writeLog(`${pokemon.getArticle()}は のろわれている! `);
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
        // writeLog( `${pokemon.getArticle()}の ${pokemon.move.selected.translate()}を 封じこめた! ` );
    }
    onElapse(pokemon) {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            writeLog(`${pokemon.getArticle()}の かなしばりが 解けた! `);
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
        writeLog(`${pokemon.getArticle()}は アンコールを受けた! `);
    }
    onElapse(pokemon) {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            // writeLog( `${pokemon.getArticle()}の アンコールが 解けた! ` );
        }
    }
}
class FocusEnergy extends StateChangeStatus {
}
class HealBlock extends StateChangeStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(pokemon) {
        this.isTrue = true;
        writeLog(`${pokemon.getArticle()}は 回復動作を 封じられた!`);
    }
    onElapse(pokemon) {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            writeLog(`${pokemon.getArticle()}の かいふくふうじの 効果が切れた! `);
        }
    }
}
class HelpingHand extends StateChangeStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(pokemon, target) {
        this.isTrue = true;
        this.count += 1;
        writeLog(`${pokemon.getArticle()}は ${target.getArticle()}を 手助けする 体勢に入った!`);
    }
}
class LockOn extends StateChangeStatus {
    onActivate(pokemon, target) {
        this.isTrue = true;
        this.order.setInfo(target.order);
        writeLog(`${pokemon.getArticle()}は ${target.getArticle()}に ねらいを さだめた!`);
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
}
class TarShot extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        writeLog(`${pokemon.getArticle()}は ほのおに 弱くなった!`);
    }
}
class Taunt extends StateChangeStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(3, 0);
    }
    onActivate(pokemon) {
        this.isTrue = true;
        writeLog(`${pokemon.getArticle()}は 挑発に 乗ってしまった!`);
    }
    onElapse(pokemon) {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            writeLog(`${pokemon.getArticle()}は 挑発の効果が 解けた! `);
        }
    }
}
class StateChangeSummary {
    constructor() {
        this.cannotEscape = new CannotEscape(); // にげられない
        this.curse = new Curse(); // のろい
        this.disable = new Disable(); // かなしばり
        this.encore = new Encore(); // アンコール
        this.focusEnergy = new FocusEnergy(); // きゅうしょアップ
        this.healBlock = new HealBlock(); // かいふくふうじ
        this.helpingHand = new HelpingHand(); // てだすけ
        this.lockOn = new LockOn(); // ロックオン
        this.perishSong = new PerishSong(); // ほろびのうた
        this.tarShot = new TarShot(); // タールショット
        this.taunt = new Taunt(); // ちょうはつ
        this._flinch = new StateChange();
        this._bind = new StateChange();
        this._attract = new Attract();
        this._leechSeed = new StateChange();
        this._yawn = new StateChange();
        this._noAbility = new StateChange();
        this._embargo = new StateChange();
        this._torment = new StateChange();
        this._foresight = new StateChange();
        this._miracleEye = new StateChange();
        this._smackDown = new StateChange();
        this._telekinesis = new StateChange();
        this._electrify = new StateChange();
        this._powder = new StateChange();
        this._throatChop = new StateChange();
        this._saltCure = new StateChange();
        this._substitute = new StateChange();
        this._protect = new StateChange();
        this._minimize = new StateChange();
        this._destinyBond = new StateChange();
        this._grudge = new StateChange();
        this._uproar = new StateChange();
        this._imprison = new StateChange();
        this._rage = new StateChange();
        this._ingrain = new StateChange();
        this._aquaRing = new StateChange();
        this._charge = new StateChange();
        this._stockpile = new StateChange();
        this._magnetRise = new StateChange();
        this._transform = new Transform();
        this._fly = new StateChange();
        this._dig = new StateChange();
        this._dive = new StateChange();
        this._shadowForce = new StateChange();
        this._confuse = new StateChange();
        this._truant = new StateChange();
        this._slowStart = new StateChange();
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
        this._endure = new StateChange();
        this._beakBlast = new StateChange();
        this._focusPunch = new StateChange();
        this._noRetreat = new StateChange();
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
    set bind(bind) {
        this._bind = bind;
    }
    set attract(attract) {
        this._attract = attract;
    }
    set leechSeed(leechSeed) {
        this._leechSeed = leechSeed;
    }
    set yawn(yawn) {
        this._yawn = yawn;
    }
    set noAbility(noAbility) {
        this._noAbility = noAbility;
    }
    set embargo(embargo) {
        this._embargo = embargo;
    }
    set torment(torment) {
        this._torment = torment;
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
    set telekinesis(telekinesis) {
        this._telekinesis = telekinesis;
    }
    set electrify(electrify) {
        this._electrify = electrify;
    }
    set powder(powder) {
        this._powder = powder;
    }
    set throatChop(throatChop) {
        this._throatChop = throatChop;
    }
    set saltCure(saltCure) {
        this._saltCure = saltCure;
    }
    set substitute(substitute) {
        this._substitute = substitute;
    }
    set protect(protect) {
        this._protect = protect;
    }
    set minimize(minimize) {
        this._minimize = minimize;
    }
    set destinyBond(destinyBond) {
        this._destinyBond = destinyBond;
    }
    set grudge(grudge) {
        this._grudge = grudge;
    }
    set uproar(uproar) {
        this._uproar = uproar;
    }
    set imprison(imprison) {
        this._imprison = imprison;
    }
    set rage(rage) {
        this._rage = rage;
    }
    set ingrain(ingrain) {
        this._ingrain = ingrain;
    }
    set aquaRing(aquaRing) {
        this._aquaRing = aquaRing;
    }
    set charge(charge) {
        this._charge = charge;
    }
    set stockpile(stockpile) {
        this._stockpile = stockpile;
    }
    set magnetRise(magnetRise) {
        this._magnetRise = magnetRise;
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
    set slowStart(slowStart) {
        this._slowStart = slowStart;
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
    set endure(endure) {
        this._endure = endure;
    }
    set beakBlast(beakBlast) {
        this._beakBlast = beakBlast;
    }
    set focusPunch(focusPunch) {
        this._focusPunch = focusPunch;
    }
    set noRetreat(noRetreat) {
        this._noRetreat = noRetreat;
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
    get bind() {
        return this._bind;
    }
    get attract() {
        return this._attract;
    }
    get leechSeed() {
        return this._leechSeed;
    }
    get yawn() {
        return this._yawn;
    }
    get noAbility() {
        return this._noAbility;
    }
    get embargo() {
        return this._embargo;
    }
    get torment() {
        return this._torment;
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
    get telekinesis() {
        return this._telekinesis;
    }
    get electrify() {
        return this._electrify;
    }
    get powder() {
        return this._powder;
    }
    get throatChop() {
        return this._throatChop;
    }
    get saltCure() {
        return this._saltCure;
    }
    get substitute() {
        return this._substitute;
    }
    get protect() {
        return this._protect;
    }
    get minimize() {
        return this._minimize;
    }
    get destinyBond() {
        return this._destinyBond;
    }
    get grudge() {
        return this._grudge;
    }
    get uproar() {
        return this._uproar;
    }
    get imprison() {
        return this._imprison;
    }
    get rage() {
        return this._rage;
    }
    get ingrain() {
        return this._ingrain;
    }
    get aquaRing() {
        return this._aquaRing;
    }
    get charge() {
        return this._charge;
    }
    get stockpile() {
        return this._stockpile;
    }
    get magnetRise() {
        return this._magnetRise;
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
    get slowStart() {
        return this._slowStart;
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
    get endure() {
        return this._endure;
    }
    get beakBlast() {
        return this._beakBlast;
    }
    get focusPunch() {
        return this._focusPunch;
    }
    get noRetreat() {
        return this._noRetreat;
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
        writeLog(`${name}は 混乱した!`);
    }
}
