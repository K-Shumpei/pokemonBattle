"use strict";
// -------------------------
// 範囲のある値
// -------------------------
class ValueWithRange {
    constructor(max, min) {
        this._value = 0;
        this._max = max;
        this._min = min;
    }
    get value() {
        return this._value;
    }
    get max() {
        return this._max;
    }
    add(value) {
        value = Math.min(this._max, this._value + value);
        value = Math.max(this._min, this._value + value);
        this._value = value;
    }
    sub(value) {
        value = Math.min(this._max, this._value - value);
        value = Math.max(this._min, this._value - value);
        this._value = value;
    }
    toZero() {
        this._value = 0;
    }
    isMax() {
        return this._value === this._max;
    }
    isMin() {
        return this._value === this._min;
    }
    isZero() {
        return this._value === 0;
    }
    isPlus() {
        return this._value > 0;
    }
    isMinus() {
        return this._value < 0;
    }
}
// -------------------------
// 実数値・種族値・個体値・努力値
// -------------------------
class ActualWithThreeValue {
    constructor() {
        this._av = 0;
        this._bs = 0;
        this._iv = 0;
        this._ev = 0;
    }
    get av() {
        return this._av;
    }
    get bs() {
        return this._bs;
    }
    get iv() {
        return this._iv;
    }
    get ev() {
        return this._ev;
    }
    register(stat) {
        this._av = stat.av;
        this._bs = stat.bs;
        this._iv = stat.iv;
        this._ev = stat.ev;
    }
    edit(parameter) {
        getHTMLInputElement('register_' + parameter + 'IndividualValue').value = String(this._iv);
        getHTMLInputElement('register_' + parameter + 'EffortValue').value = String(this._ev);
    }
    showAcrual(parameter, handOrder) {
        getHTMLInputElement('party' + handOrder + '_' + parameter).textContent = String(this._av);
    }
    copy(status) {
        this._av = status._av;
        this._bs = status._bs;
        this._iv = status._iv;
        this._ev = status._ev;
    }
}
// -------------------------
// 各ステータス
// -------------------------
class Status {
    constructor() {
        this._hp = new HitPoint();
        this._atk = new MainStatus();
        this._def = new MainStatus();
        this._spA = new MainStatus();
        this._spD = new MainStatus();
        this._spe = new MainStatus();
        this._acc = new Rank();
        this._eva = new Rank();
    }
    get hp() {
        return this._hp;
    }
    get atk() {
        return this._atk;
    }
    get def() {
        return this._def;
    }
    get spA() {
        return this._spA;
    }
    get spD() {
        return this._spD;
    }
    get spe() {
        return this._spe;
    }
    get acc() {
        return this._acc;
    }
    get eva() {
        return this._eva;
    }
    register(stat) {
        this._hp.register(stat.hp);
        this._atk.register(stat.atk);
        this._def.register(stat.def);
        this._spA.register(stat.spA);
        this._spD.register(stat.spD);
        this._spe.register(stat.spe);
        this._hp.value.setActualValue(stat.hp.av);
    }
    edit() {
        this._hp.edit('hitPoint');
        this._atk.edit('attack');
        this._def.edit('defense');
        this._spA.edit('specialAttack');
        this._spD.edit('specialDefense');
        this._spe.edit('speed');
    }
    getAllEffort() {
        let allEffort = 0;
        allEffort += this._hp.ev;
        allEffort += this._atk.ev;
        allEffort += this._def.ev;
        allEffort += this._spA.ev;
        allEffort += this._spD.ev;
        allEffort += this._spe.ev;
        return allEffort;
    }
    show(handOrder) {
        this._hp.showAcrual('hitPoint', handOrder);
        this._atk.showAcrual('attack', handOrder);
        this._def.showAcrual('defense', handOrder);
        this._spA.showAcrual('specialAttack', handOrder);
        this._spD.showAcrual('specialDefense', handOrder);
        this._spe.showAcrual('speed', handOrder);
    }
    resetRank() {
        this._atk.rank.toZero();
        this._def.rank.toZero();
        this._spA.rank.toZero();
        this._spD.rank.toZero();
        this._spe.rank.toZero();
        this._acc.toZero();
        this._eva.toZero();
    }
    copy(status) {
        this._hp.copy(status._hp);
        this._atk.copy(status._atk);
        this._def.copy(status._def);
        this._spA.copy(status._spA);
        this._spD.copy(status._spD);
        this._spe.copy(status._spe);
    }
}
// -------------------------
// HP
// -------------------------
class HitPoint extends ActualWithThreeValue {
    constructor() {
        super();
        this._value = new HitPointValue();
    }
    get value() {
        return this._value;
    }
}
class HitPointValue extends ValueWithRange {
    constructor() {
        super(175, 0);
    }
    setActualValue(value) {
        this._value = value;
        this._max = value;
    }
    rate() {
        return this._value / this._max;
    }
    isGreaterThan(denominator) {
        return this._value > this._max / denominator;
    }
    isGreaterEqual(denominator) {
        return this._value >= this._max / denominator;
    }
    isLessThan(denominator) {
        return this._value < this._max / denominator;
    }
    isLessEqual(denominator) {
        return this._value <= this._max / denominator;
    }
}
// -------------------------
// 攻撃・防御・特攻・特防・素早さ
// -------------------------
class MainStatus extends ActualWithThreeValue {
    constructor() {
        super();
        this._rank = new Rank();
    }
    get rank() {
        return this._rank;
    }
}
// -------------------------
// 命中率・回避率
// -------------------------
class Rank extends ValueWithRange {
    constructor() {
        super(6, -6);
    }
}
