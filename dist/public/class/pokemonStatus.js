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
        value = Math.min(6, this._value + value);
        value = Math.max(-6, this._value + value);
        this._value = value;
    }
    sub(value) {
        value = Math.min(6, this._value - value);
        value = Math.max(-6, this._value - value);
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
        this._actual = 0;
        this._base = 0;
        this._individual = 0;
        this._effort = 0;
    }
    get actual() {
        return this._actual;
    }
    get base() {
        return this._base;
    }
    get individual() {
        return this._individual;
    }
    get effort() {
        return this._effort;
    }
    register(parameter) {
        this.setActual(Number(getHTMLInputElement('register_' + parameter + 'ActualValue').value));
        this.setBase(Number(getHTMLInputElement('register_' + parameter + 'BaseStatus').value));
        this.setIndividual(Number(getHTMLInputElement('register_' + parameter + 'IndividualValue').value));
        this.setEffort(Number(getHTMLInputElement('register_' + parameter + 'EffortValue').value));
    }
    edit(parameter) {
        getHTMLInputElement('register_' + parameter + 'IndividualValue').value = String(this._individual);
        getHTMLInputElement('register_' + parameter + 'EffortValue').value = String(this._effort);
    }
    showAcrual(parameter, handOrder) {
        getHTMLInputElement('party' + handOrder + '_' + parameter).textContent = String(this._actual);
    }
    copy(status) {
        this.setActual(status._actual);
        this.setBase(status._base);
        this.setIndividual(status._individual);
        this.setEffort(status._effort);
    }
    setActual(value) {
        this._actual = value;
    }
    setBase(value) {
        this._base = value;
    }
    setIndividual(value) {
        this._individual = value;
    }
    setEffort(value) {
        this._effort = value;
    }
}
// -------------------------
// 各ステータス
// -------------------------
class Status {
    constructor() {
        this._hitPoint = new HitPoint();
        this._attack = new MainStatus();
        this._defense = new MainStatus();
        this._specialAttack = new MainStatus();
        this._specialDefense = new MainStatus();
        this._speed = new MainStatus();
        this._accuracy = new Rank();
        this._evasion = new Rank();
    }
    get hitPoint() {
        return this._hitPoint;
    }
    get attack() {
        return this._attack;
    }
    get defense() {
        return this._defense;
    }
    get specialAttack() {
        return this._specialAttack;
    }
    get specialDefense() {
        return this._specialDefense;
    }
    get speed() {
        return this._speed;
    }
    get accuracy() {
        return this._accuracy;
    }
    get evasion() {
        return this._evasion;
    }
    register() {
        this._hitPoint.register('hitPoint');
        this._attack.register('attack');
        this._defense.register('defense');
        this._specialAttack.register('specialAttack');
        this._specialDefense.register('specialDefense');
        this._speed.register('speed');
    }
    edit() {
        this._hitPoint.edit('hitPoint');
        this._attack.edit('attack');
        this._defense.edit('defense');
        this._specialAttack.edit('specialAttack');
        this._specialDefense.edit('specialDefense');
        this._speed.edit('speed');
    }
    getAllEffort() {
        let allEffort = 0;
        allEffort += this._hitPoint.effort;
        allEffort += this._attack.effort;
        allEffort += this._defense.effort;
        allEffort += this._specialAttack.effort;
        allEffort += this._specialDefense.effort;
        allEffort += this._speed.effort;
        return allEffort;
    }
    showActual(handOrder) {
        this._hitPoint.showAcrual('hitPoint', handOrder);
        this._attack.showAcrual('attack', handOrder);
        this._defense.showAcrual('defense', handOrder);
        this._specialAttack.showAcrual('specialAttack', handOrder);
        this._specialDefense.showAcrual('specialDefense', handOrder);
        this._speed.showAcrual('speed', handOrder);
    }
    resetRank() {
        this._attack.rank.toZero();
        this._defense.rank.toZero();
        this._specialAttack.rank.toZero();
        this._specialDefense.rank.toZero();
        this._speed.rank.toZero();
        this._accuracy.toZero();
        this._evasion.toZero();
    }
    copy(status) {
        this._hitPoint.copy(status._hitPoint);
        this._attack.copy(status._attack);
        this._defense.copy(status._defense);
        this._specialAttack.copy(status._specialAttack);
        this._specialDefense.copy(status._specialDefense);
        this._speed.copy(status._speed);
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
