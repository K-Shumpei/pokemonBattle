"use strict";
class StateChangeStatus {
    constructor() {
        this.isTrue = false;
        this.turn = new ValueWithRange();
        this.count = 0;
    }
    reset() {
        this.isTrue = false;
        this.turn.value = this.turn.max;
        this.count = 0;
    }
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
class PerishSong extends StateChangeStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(3, 0);
    }
    onActivate() {
        this.isTrue = true;
    }
}
class StateChangeSummary {
    constructor() {
        this.healBlock = new HealBlock(); // かいふくふうじ
        this.helpingHand = new HelpingHand(); // てだすけ
        this.perishSong = new PerishSong(); // ほろびのうた
        this._flinch = new StateChange();
        this._bind = new StateChange();
        this._curse = new StateChange();
        this._attract = new Attract();
        this._leechSeed = new StateChange();
        this._yawn = new StateChange();
        this._noAbility = new StateChange();
        this._embargo = new StateChange();
        this._encore = new StateChange();
        this._torment = new StateChange();
        this._taunt = new StateChange();
        this._disable = new StateChange();
        this._foresight = new StateChange();
        this._miracleEye = new StateChange();
        this._smackDown = new StateChange();
        this._telekinesis = new StateChange();
        this._cannotEscape = new CannotEscape();
        this._electrify = new StateChange();
        this._powder = new StateChange();
        this._throatChop = new StateChange();
        this._tarShot = new StateChange();
        this._saltCure = new StateChange();
        this._focusEnergy = new StateChange();
        this._substitute = new StateChange();
        this._protect = new StateChange();
        this._lockOn = new StateChange();
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
    set curse(curse) {
        this._curse = curse;
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
    set encore(encore) {
        this._encore = encore;
    }
    set torment(torment) {
        this._torment = torment;
    }
    set taunt(taunt) {
        this._taunt = taunt;
    }
    set disable(disable) {
        this._disable = disable;
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
    set cannotEscape(cannotEscape) {
        this._cannotEscape = cannotEscape;
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
    set tarShot(tarShot) {
        this._tarShot = tarShot;
    }
    set saltCure(saltCure) {
        this._saltCure = saltCure;
    }
    set focusEnergy(focusEnergy) {
        this._focusEnergy = focusEnergy;
    }
    set substitute(substitute) {
        this._substitute = substitute;
    }
    set protect(protect) {
        this._protect = protect;
    }
    set lockOn(lockOn) {
        this._lockOn = lockOn;
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
    get curse() {
        return this._curse;
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
    get encore() {
        return this._encore;
    }
    get torment() {
        return this._torment;
    }
    get taunt() {
        return this._taunt;
    }
    get disable() {
        return this._disable;
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
    get cannotEscape() {
        return this._cannotEscape;
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
    get tarShot() {
        return this._tarShot;
    }
    get saltCure() {
        return this._saltCure;
    }
    get focusEnergy() {
        return this._focusEnergy;
    }
    get substitute() {
        return this._substitute;
    }
    get protect() {
        return this._protect;
    }
    get lockOn() {
        return this._lockOn;
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
