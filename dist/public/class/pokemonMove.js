"use strict";
class Move {
    constructor() {
        this._selected = new SelectedMove();
        this._learned = [
            new LearnedMove(0),
            new LearnedMove(1),
            new LearnedMove(2),
            new LearnedMove(3),
        ];
    }
    get selected() {
        return this._selected;
    }
    get learned() {
        return this._learned;
    }
    register(move) {
        this._learned[0].register(move.slot[0]);
        this._learned[1].register(move.slot[1]);
        this._learned[2].register(move.slot[2]);
        this._learned[3].register(move.slot[3]);
    }
    copyFromOpp(move) {
        this._learned[0].copyFromOpp(move[0]);
        this._learned[1].copyFromOpp(move[1]);
        this._learned[2].copyFromOpp(move[2]);
        this._learned[3].copyFromOpp(move[3]);
    }
    show(handOrder) {
        this._learned[0].show(handOrder);
        this._learned[1].show(handOrder);
        this._learned[2].show(handOrder);
        this._learned[3].show(handOrder);
    }
    setSelcted(slot) {
        if (slot === null)
            return;
        this._selected.setSelected(this._learned[slot]);
    }
    showCommand1st(battleOrder) {
        this._learned[0].showCommand1st(battleOrder);
        this._learned[1].showCommand1st(battleOrder);
        this._learned[2].showCommand1st(battleOrder);
        this._learned[3].showCommand1st(battleOrder);
    }
}
// -------------------------
// 覚えている技
// -------------------------
class LearnedMove {
    constructor(slot) {
        this._slot = slot;
        this._name = null;
        this._powerPoint = new PowerPoint();
    }
    set name(name) {
        this._name = name;
    }
    get slot() {
        return this._slot;
    }
    get name() {
        return this._name;
    }
    get powerPoint() {
        return this._powerPoint;
    }
    register(move) {
        this._name = (move._name === '') ? null : move._name;
        this._powerPoint.setMaxPP(move.powerPoint);
    }
    show(handOrder) {
        getHTMLInputElement('party' + handOrder + '_move' + this._slot).textContent = (this._name === null) ? '技' : this.translate();
        getHTMLInputElement('party' + handOrder + '_remainingPP' + this._slot).textContent = (this._name === null) ? '' : String(this._powerPoint.value);
        getHTMLInputElement('party' + handOrder + '_powerPoint' + this._slot).textContent = (this._name === null) ? 'PP' : String(this._powerPoint.max);
    }
    translate() {
        return moveMaster.filter(m => m.nameEN === this._name)[0].nameJA;
    }
    copyFromOpp(move) {
        this._name = move._name;
        this._powerPoint.setMaxPP(move._powerPoint._value);
    }
    showCommand1st(battleOrder) {
        if (this._name === null)
            return;
        getHTMLInputElement('moveText_' + battleOrder + '_' + this._slot).textContent = this.translate();
        getHTMLInputElement('moveRadio_' + battleOrder + '_' + this._slot).disabled = false;
    }
}
class PowerPoint extends ValueWithRange {
    constructor() {
        super(0, 0);
    }
    setMaxPP(PP) {
        this._max = PP;
        this._value = PP;
    }
}
// -------------------------
// 使用する技
// -------------------------
class SelectedMove {
    constructor() {
        this._slot = 0;
        this._name = '';
        this._type = null;
        this._class = 'physical';
        this._target = 'user';
        this._power = 0;
        this._accuracy = 0;
        this._priority = 0;
        this._critical = 0;
        this._skin = new StateChange('スキン');
        this._store = '';
    }
    set type(type) {
        this._type = type;
    }
    set power(power) {
        this._power = power;
    }
    set priority(priority) {
        this._priority = priority;
    }
    get name() {
        return this._name;
    }
    get slot() {
        return this._slot;
    }
    get type() {
        return this._type;
    }
    get class() {
        return this._class;
    }
    get target() {
        return this._target;
    }
    get power() {
        return this._power;
    }
    get accuracy() {
        return this._accuracy;
    }
    get priority() {
        return this._priority;
    }
    get critical() {
        return this._critical;
    }
    get skin() {
        return this._skin;
    }
    translate() {
        return moveMaster.filter(m => m.nameEN === this._name)[0].nameJA;
    }
    getMaster() {
        return moveMaster.filter(m => m.nameEN === this._name)[0];
    }
    getFlag() {
        return moveFlagMaster.filter(flag => flag.nameEN === this._name)[0];
    }
    getAddOn() {
        return moveAddOnMaster.filter(add => add.nameEN === this._name)[0];
    }
    setSelected(move) {
        const master = moveMaster.find((m) => {
            return m.nameEN === move.name;
        });
        if (!master)
            return;
        this._name = master.nameEN;
        this._type = master.type;
        this._class = master.class;
        this._target = master.target;
        this._power = master.power;
        this._accuracy = master.accuracy;
        this._priority = master.priority;
        this._critical = master.priority;
    }
    isType(type) {
        return this._type === type;
    }
    isPhysical() {
        return this._class === 'physical';
    }
    isSpecial() {
        return this._class === 'special';
    }
    isStatus() {
        return this._class === 'status';
    }
    isName(name) {
        return this._name === name;
    }
    isExplosion() {
        return explosionMoveList.includes(this._name);
    }
    //---------------------
    // スキン系特性が発動するか
    //---------------------
    isActivateSkin(type) {
        if (changeTypeMoveList.includes(this._name))
            return false;
        if (this._name === 'わるあがき')
            return false;
        if (type === 'Normal' && this._type === 'Normal')
            return false;
        if (type !== 'Normal' && this._type !== 'Normal')
            return false;
        return true;
    }
    activateSkin(type) {
        if (!this.isActivateSkin(type))
            return;
        this._type = type;
        this._skin.isTrue = true;
        this._skin.text = String(this._type);
    }
    //-------
    // ため技
    //-------
    setStore() {
        this._store = this._name;
    }
    isStore() {
        return this._store !== '';
    }
    //-------------
    // マグニチュード
    //-------------
    fixMagnitudePower() {
        if (!this.isName('マグニチュード'))
            return;
        const random = getRandom();
        if (random >= 95) {
            this._power = 150;
            writeLog(`マグニチュード10!`);
            return;
        }
        if (random >= 85) {
            this._power = 110;
            writeLog(`マグニチュード9!`);
            return;
        }
        if (random >= 65) {
            this._power = 90;
            writeLog(`マグニチュード8!`);
            return;
        }
        if (random >= 35) {
            this._power = 70;
            writeLog(`マグニチュード7!`);
            return;
        }
        if (random >= 15) {
            this._power = 50;
            writeLog(`マグニチュード6!`);
            return;
        }
        if (random >= 5) {
            this._power = 30;
            writeLog(`マグニチュード5!`);
            return;
        }
        if (random >= 0) {
            this._power = 10;
            writeLog(`マグニチュード4!`);
            return;
        }
    }
}
class MoveFlag {
    constructor() {
        this._contact = false;
        this._charge = false;
        this._recharge = false;
        this._protect = false;
        this._reflectable = false;
        this._snatch = false;
        this._mirror = false;
        this._punch = false;
        this._sound = false;
        this._gravity = false;
        this._defrost = false;
        this._distance = false;
        this._heal = false;
        this._authentic = false;
        this._powder = false;
        this._bite = false;
        this._pulse = false;
        this._ballistics = false;
        this._mental = false;
        this._nonSkyBattle = false;
        this._dance = false;
    }
    set contact(contact) {
        this._contact = contact;
    }
    set charge(charge) {
        this._charge = charge;
    }
    set recharge(recharge) {
        this._recharge = recharge;
    }
    set protect(protect) {
        this._protect = protect;
    }
    set reflectable(reflectable) {
        this._reflectable = reflectable;
    }
    set snatch(snatch) {
        this._snatch = snatch;
    }
    set mirror(mirror) {
        this._mirror = mirror;
    }
    set punch(punch) {
        this._punch = punch;
    }
    set sound(sound) {
        this._sound = sound;
    }
    set gravity(gravity) {
        this._gravity = gravity;
    }
    set defrost(defrost) {
        this._defrost = defrost;
    }
    set distance(distance) {
        this._distance = distance;
    }
    set heal(heal) {
        this._heal = heal;
    }
    set authentic(authentic) {
        this._authentic = authentic;
    }
    set powder(powder) {
        this._powder = powder;
    }
    set bite(bite) {
        this._bite = bite;
    }
    set pulse(pulse) {
        this._pulse = pulse;
    }
    set ballistics(ballistics) {
        this._ballistics = ballistics;
    }
    set mental(mental) {
        this._mental = mental;
    }
    set nonSkyBattle(nonSkyBattle) {
        this._nonSkyBattle = nonSkyBattle;
    }
    set dance(dance) {
        this._dance = dance;
    }
    get contact() {
        return this._contact;
    }
    get charge() {
        return this._charge;
    }
    get recharge() {
        return this._recharge;
    }
    get protect() {
        return this._protect;
    }
    get reflectable() {
        return this._reflectable;
    }
    get snatch() {
        return this._snatch;
    }
    get mirror() {
        return this._mirror;
    }
    get punch() {
        return this._punch;
    }
    get sound() {
        return this._sound;
    }
    get gravity() {
        return this._gravity;
    }
    get defrost() {
        return this._defrost;
    }
    get distance() {
        return this._distance;
    }
    get heal() {
        return this._heal;
    }
    get authentic() {
        return this._authentic;
    }
    get powder() {
        return this._powder;
    }
    get bite() {
        return this._bite;
    }
    get pulse() {
        return this._pulse;
    }
    get ballistics() {
        return this._ballistics;
    }
    get mental() {
        return this._mental;
    }
    get nonSkyBattle() {
        return this._nonSkyBattle;
    }
    get dance() {
        return this._dance;
    }
}
