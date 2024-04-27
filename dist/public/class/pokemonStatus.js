"use strict";
// -------------------------
// 範囲のある値
// -------------------------
class ValueWithRange {
    constructor(max = 0, min = 0) {
        this.max = max;
        this.min = min;
        this.value = 0;
    }
    add(value) {
        this.value = Math.max(this.min, Math.min(this.max, this.value + value));
    }
    sub(value) {
        this.value = Math.min(this.max, Math.max(this.min, this.value - value));
    }
    toZero() {
        this.value = 0;
    }
    toMax() {
        this.value = this.max;
    }
    isMax() {
        return this.value === this.max;
    }
    isMin() {
        return this.value === this.min;
    }
    isZero() {
        return this.value === 0;
    }
    isPlus() {
        return this.value > 0;
    }
    isMinus() {
        return this.value < 0;
    }
    setInitial(value) {
        this.value = value;
        this.max = value;
    }
}
// -------------------------
// 実数値・種族値・個体値・努力値
// -------------------------
class ActualWithThreeValue {
    constructor() {
        this.av = 0;
        this.bs = 0;
        this.iv = 0;
        this.ev = 0;
    }
    register(stat) {
        this.av = stat.av;
        this.bs = stat.bs;
        this.iv = stat.iv;
        this.ev = stat.ev;
    }
    edit(parameter) {
        getHTMLInputElement('register_' + parameter + 'IndividualValue').value = String(this.iv);
        getHTMLInputElement('register_' + parameter + 'EffortValue').value = String(this.ev);
    }
    showAcrual(name, parameter, handOrder) {
        getHTMLInputElement('party' + handOrder + '_' + parameter).textContent = (name === null) ? '' : String(this.av);
    }
    copy(status) {
        this.av = status.av;
        this.bs = status.bs;
        this.iv = status.iv;
        this.ev = status.ev;
    }
}
// -------------------------
// 各ステータス
// -------------------------
class Status {
    constructor() {
        this.hp = new HitPoint();
        this.atk = new MainStatus('攻撃');
        this.def = new MainStatus('防御');
        this.spA = new MainStatus('特攻');
        this.spD = new MainStatus('特防');
        this.spe = new Speed('素早さ');
        this.acc = new Rank('命中率');
        this.eva = new Rank('回避率');
    }
    register(stat) {
        this.hp.register(stat.hp);
        this.atk.register(stat.atk);
        this.def.register(stat.def);
        this.spA.register(stat.spA);
        this.spD.register(stat.spD);
        this.spe.register(stat.spe);
        this.hp.value.setInitial(stat.hp.av);
    }
    edit() {
        this.hp.edit('hitPoint');
        this.atk.edit('attack');
        this.def.edit('defense');
        this.spA.edit('specialAttack');
        this.spD.edit('specialDefense');
        this.spe.edit('speed');
    }
    getAllEffort() {
        let allEffort = 0;
        allEffort += this.hp.ev;
        allEffort += this.atk.ev;
        allEffort += this.def.ev;
        allEffort += this.spA.ev;
        allEffort += this.spD.ev;
        allEffort += this.spe.ev;
        return allEffort;
    }
    show(name, handOrder) {
        this.hp.showAcrual(name, 'hitPoint', handOrder);
        this.atk.showAcrual(name, 'attack', handOrder);
        this.def.showAcrual(name, 'defense', handOrder);
        this.spA.showAcrual(name, 'specialAttack', handOrder);
        this.spD.showAcrual(name, 'specialDefense', handOrder);
        this.spe.showAcrual(name, 'speed', handOrder);
    }
    resetRank() {
        this.atk.rank.toZero();
        this.def.rank.toZero();
        this.spA.rank.toZero();
        this.spD.rank.toZero();
        this.spe.rank.toZero();
        this.acc.toZero();
        this.eva.toZero();
    }
    copyFromOpp(status) {
        this.hp.copy(status.hp);
        this.atk.copy(status.atk);
        this.def.copy(status.def);
        this.spA.copy(status.spA);
        this.spD.copy(status.spD);
        this.spe.copy(status.spe);
        this.hp.value.setInitial(status.hp.av);
    }
    calcRankCorrValue(critical) {
        this.atk.calcRankCorrValue(critical);
        this.def.calcRankCorrValue(critical);
        this.spA.calcRankCorrValue(critical);
        this.spD.calcRankCorrValue(critical);
    }
    formChange(bs, level, nature) {
        this.hp.bs = bs.hp;
        this.atk.bs = bs.atk;
        this.def.bs = bs.def;
        this.spA.bs = bs.spA;
        this.spD.bs = bs.spD;
        this.spe.bs = bs.spe;
        this.hp.calcAct(level);
        this.atk.calcAct(level, nature.atk);
        this.def.calcAct(level, nature.def);
        this.spA.calcAct(level, nature.spA);
        this.spD.calcAct(level, nature.spD);
        this.spe.calcAct(level, nature.spe);
    }
    changeRank(para, real, setting, name, item) {
        switch (para) {
            case 'atk':
                this.atk.rank.change(name, real, setting, item);
                break;
            case 'def':
                this.def.rank.change(name, real, setting, item);
                break;
            case 'spA':
                this.spA.rank.change(name, real, setting, item);
                break;
            case 'spD':
                this.spD.rank.change(name, real, setting, item);
                break;
            case 'spe':
                this.spe.rank.change(name, real, setting, item);
                break;
            case 'acc':
                this.acc.change(name, real, setting, item);
                break;
            case 'eva':
                this.eva.change(name, real, setting, item);
                break;
            default:
                break;
        }
    }
    countRank() {
        let count = 0;
        count += this.atk.rank.value;
        count += this.def.rank.value;
        count += this.spA.rank.value;
        count += this.spD.rank.value;
        count += this.spe.rank.value;
        count += this.acc.value;
        count += this.eva.value;
        return count;
    }
    useWhiteHerb() {
        let result = false;
        result = this.atk.rank.useWhiteHerb();
        result = this.def.rank.useWhiteHerb();
        result = this.spA.rank.useWhiteHerb();
        result = this.spD.rank.useWhiteHerb();
        result = this.spe.rank.useWhiteHerb();
        result = this.acc.useWhiteHerb();
        result = this.eva.useWhiteHerb();
        return result;
    }
    toZeroAllRank() {
        this.atk.rank.toZero();
        this.def.rank.toZero();
        this.spA.rank.toZero();
        this.spD.rank.toZero();
        this.spe.rank.toZero();
        this.acc.toZero();
        this.eva.toZero();
    }
    copyRank(status) {
        this.atk.rank.value = status.atk.rank.value;
        this.def.rank.value = status.def.rank.value;
        this.spA.rank.value = status.spA.rank.value;
        this.spD.rank.value = status.spD.rank.value;
        this.spe.rank.value = status.spe.rank.value;
        this.acc.value = status.acc.value;
        this.eva.value = status.eva.value;
    }
    swapRank(pokemon) {
        [this.atk.rank.value, pokemon.status.atk.rank.value] = [pokemon.status.atk.rank.value, this.atk.rank.value];
        [this.def.rank.value, pokemon.status.def.rank.value] = [pokemon.status.def.rank.value, this.def.rank.value];
        [this.spA.rank.value, pokemon.status.spA.rank.value] = [pokemon.status.spA.rank.value, this.spA.rank.value];
        [this.spD.rank.value, pokemon.status.spD.rank.value] = [pokemon.status.spD.rank.value, this.spD.rank.value];
        [this.spe.rank.value, pokemon.status.spe.rank.value] = [pokemon.status.spe.rank.value, this.spe.rank.value];
        [this.acc.value, pokemon.status.acc.value] = [pokemon.status.acc.value, this.acc.value];
        [this.eva.value, pokemon.status.eva.value] = [pokemon.status.eva.value, this.eva.value];
    }
    reverseRank() {
        this.atk.rank.value *= -1;
        this.def.rank.value *= -1;
        this.spA.rank.value *= -1;
        this.spD.rank.value *= -1;
        this.spe.rank.value *= -1;
        this.acc.value *= -1;
        this.eva.value *= -1;
    }
    getNotMaxRank() {
        const result = [];
        if (!this.atk.rank.isMax())
            result.push('atk');
        if (!this.def.rank.isMax())
            result.push('def');
        if (!this.spA.rank.isMax())
            result.push('spA');
        if (!this.spD.rank.isMax())
            result.push('spD');
        if (!this.spe.rank.isMax())
            result.push('spe');
        if (!this.acc.isMax())
            result.push('acc');
        if (!this.eva.isMax())
            result.push('eva');
        return result;
    }
    getNotMinRank() {
        const result = [];
        if (!this.atk.rank.isMin())
            result.push('atk');
        if (!this.def.rank.isMin())
            result.push('def');
        if (!this.spA.rank.isMin())
            result.push('spA');
        if (!this.spD.rank.isMin())
            result.push('spD');
        if (!this.spe.rank.isMin())
            result.push('spe');
        if (!this.acc.isMin())
            result.push('acc');
        if (!this.eva.isMin())
            result.push('eva');
        return result;
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
    calcAct(level) {
        const step1 = this.bs * 2 + this.iv + Math.floor(this.ev / 4);
        const step2 = step1 * level;
        this.av = Math.floor(step2 / 100) + level + 10;
    }
}
class HitPointValue extends ValueWithRange {
    constructor() {
        super(175, 0);
    }
    rate() {
        return this.value / this.max;
    }
    isGreaterThan(denominator) {
        return this.value > this.max / denominator;
    }
    isGreaterEqual(denominator) {
        return this.value >= this.max / denominator;
    }
    isLessThan(denominator) {
        return this.value < this.max / denominator;
    }
    isLessEqual(denominator) {
        return this.value <= this.max / denominator;
    }
}
// -------------------------
// 攻撃・防御・特攻・特防・素早さ
// -------------------------
class MainStatus extends ActualWithThreeValue {
    constructor(text) {
        super();
        this.rankCorrVal = 0;
        this.rank = new Rank(text);
    }
    calcRankCorrValue(critical) {
        const rank = (critical) ? Math.max(this.rank.value, 0) : this.rank.value;
        const corr = (rank > 0) ? (2 + rank) / 2 : 2 / (2 - rank);
        this.rankCorrVal = Math.floor(this.av * corr);
    }
    calcAct(level, corr) {
        const step1 = this.bs * 2 + this.iv + Math.floor(this.ev / 4);
        const step2 = step1 * level;
        const step3 = Math.floor(step2 / 100);
        this.av = Math.floor((step3 + 5) * corr);
    }
}
class Speed extends MainStatus {
    constructor(text) {
        super(text);
        this.actionOrder = 0; // 行動順に影響のある値
        this.forPowerCalc = 0; // ジャイロボール・エレキボールの威力計算に関わる値
        this.random = 0; // 乱数
    }
    calcSpeed(corr, paralysis, trickRoom) {
        // ランク補正値の計算
        const rank = this.rank.value;
        const rankCorr = (rank > 0) ? (2 + rank) / 2 : 2 / (2 - rank);
        this.rankCorrVal = Math.floor(this.av * rankCorr);
        // 各種補正
        const corr1 = fiveRoundEntry(this.rankCorrVal * corr / 4096);
        const corr2 = Math.floor(corr1 * paralysis);
        this.forPowerCalc = Math.min(10000, corr2);
        // トリックルーム
        const corr3 = (trickRoom) ? 10000 - this.forPowerCalc : this.forPowerCalc;
        this.actionOrder = corr3 % 8192;
        // 乱数
        this.random = getRandom();
    }
}
// -------------------------
// 命中率・回避率
// -------------------------
class Rank extends ValueWithRange {
    constructor(text) {
        super(6, -6);
        this._text = text;
    }
    getVariable(value) {
        if (value > 0)
            return Math.min(value, this.max - this.value);
        if (value < 0)
            return Math.max(value, this.min + this.value);
        return value;
    }
    change(name, real, setting, item) {
        this.add(real);
        if (real === 0 && setting > 0)
            this.msgNoUp(name);
        if (real === 0 && setting < 0)
            this.msgNoDown(name);
        if (real === 1)
            this.msgUp(name, item);
        if (real === -1)
            this.msgDown(name, item);
        if (real === 2)
            this.msgSuperUp(name, item);
        if (real === -2)
            this.msgSuperDown(name, item);
        if (real >= 3)
            this.msgHyperUp(name, item);
        if (real <= -3)
            this.msgHyperDown(name, item);
    }
    msgNoUp(name) {
        battleLog.write(`${name}の ${this._text}は もう上がらない!`);
    }
    msgNoDown(name) {
        battleLog.write(`${name}の ${this._text}は もう下がらない!`);
    }
    msgUp(name, item) {
        if (item)
            battleLog.write(`${name}は ${item}で ${this._text}が 上がった!`);
        else
            battleLog.write(`${name}の ${this._text}が 上がった!`);
    }
    msgDown(name, item) {
        if (item)
            battleLog.write(`${name}は ${item}で ${this._text}が 下がった!`);
        else
            battleLog.write(`${name}の ${this._text}が 下がった!`);
    }
    msgSuperUp(name, item) {
        if (item)
            battleLog.write(`${name}は ${item}で ${this._text}が ぐーんと上がった!`);
        else
            battleLog.write(`${name}の ${this._text}が ぐーんと上がった!`);
    }
    msgSuperDown(name, item) {
        if (item)
            battleLog.write(`${name}は ${item}で ${this._text}が がくっと下がった!`);
        else
            battleLog.write(`${name}の ${this._text}が がくっと下がった!`);
    }
    msgHyperUp(name, item) {
        if (item)
            battleLog.write(`${name}は ${item}で ${this._text}が ぐぐーんと上がった!`);
        else
            battleLog.write(`${name}の ${this._text}が ぐぐーんと上がった!`);
    }
    msgHyperDown(name, item) {
        if (item)
            battleLog.write(`${name}は ${item}で ${this._text}が がくーんと下がった!`);
        else
            battleLog.write(`${name}の ${this._text}が がくーんと下がった!`);
    }
    useWhiteHerb() {
        if (this.value < 0) {
            this.toZero();
            return true;
        }
        return false;
    }
}
