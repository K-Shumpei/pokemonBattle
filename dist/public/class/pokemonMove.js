"use strict";
class Move {
    constructor() {
        this.selected = new SelectedMove();
        this.learned = [
            new LearnedMove(0),
            new LearnedMove(1),
            new LearnedMove(2),
            new LearnedMove(3),
        ];
    }
    register(move) {
        this.learned[0].register(move.slot[0]);
        this.learned[1].register(move.slot[1]);
        this.learned[2].register(move.slot[2]);
        this.learned[3].register(move.slot[3]);
    }
    copyFromOpp(move) {
        this.learned[0].copyFromOpp(move[0]);
        this.learned[1].copyFromOpp(move[1]);
        this.learned[2].copyFromOpp(move[2]);
        this.learned[3].copyFromOpp(move[3]);
    }
    show(handOrder) {
        this.learned[0].show(handOrder);
        this.learned[1].show(handOrder);
        this.learned[2].show(handOrder);
        this.learned[3].show(handOrder);
    }
    setSelcted(slot) {
        if (slot === null)
            return;
        this.selected.setSelected(this.learned[slot], slot);
    }
    showCommand1st(battleOrder) {
        this.learned[0].showCommand1st(battleOrder);
        this.learned[1].showCommand1st(battleOrder);
        this.learned[2].showCommand1st(battleOrder);
        this.learned[3].showCommand1st(battleOrder);
    }
    isNoPPLeft() {
        if (!this.learned[this.selected.slot].powerPoint.isZero())
            return false;
        //battleLog.write( `${this.pokeName}の ${this.selected.translate()}!` );
        battleLog.write(`しかし 技の 残りポイントが なかった!`);
        return true;
    }
    onSpendPP(pokemon) {
        const slot = this.selected.slot;
        this.learned[slot].powerPoint.onSpend(pokemon);
    }
}
// -------------------------
// 覚えている技
// -------------------------
class LearnedMove {
    constructor(slot) {
        this.name = null;
        this.powerPoint = new PowerPoint();
        this.slot = slot;
    }
    register(move) {
        this.name = move._name;
        this.powerPoint.setInitial(move.powerPoint);
    }
    show(handOrder) {
        getHTMLInputElement('party' + handOrder + '_move' + this.slot).textContent = (this.name === null) ? '技' : this.translate();
        getHTMLInputElement('party' + handOrder + '_remainingPP' + this.slot).textContent = (this.name === null) ? '' : String(this.powerPoint.value);
        getHTMLInputElement('party' + handOrder + '_powerPoint' + this.slot).textContent = (this.name === null) ? 'PP' : String(this.powerPoint.max);
    }
    translate() {
        return moveMaster.filter(m => m.nameEN === this.name)[0].nameJA;
    }
    copyFromOpp(move) {
        this.name = move.name;
        this.powerPoint.setInitial(move.powerPoint.value);
    }
    showCommand1st(battleOrder) {
        if (this.name === null)
            return;
        getHTMLInputElement('moveText_' + battleOrder + '_' + this.slot).textContent = this.translate();
        getHTMLInputElement('moveRadio_' + battleOrder + '_' + this.slot).disabled = false;
    }
    getMaster() {
        return moveMaster.filter(m => m.nameEN === this.name)[0];
    }
}
class PowerPoint extends ValueWithRange {
    onSpend(pokemon) {
        const NumOfTarget = pokemon.attack.getTargetToPokemon().reduce((acc, val) => {
            const target = main.getPokemonByBattle(val);
            if (target.isAbility('Pressure') && target.isMine() !== pokemon.isMine()) {
                return acc + 1;
            }
            else {
                return acc;
            }
        }, 1);
        const NumOfside = getPokemonInSide(!pokemon.isMine()).reduce((acc, val) => {
            if (val.isAbility('Pressure')) {
                return acc + 1;
            }
            else {
                return acc;
            }
        }, 1);
        const value = (pokemon) => {
            switch (pokemon.move.selected.target) {
                case 'users-field':
                    return 1;
                case 'opponents-field':
                    if (pokemon.move.selected.name === 'Sticky Web') { // 技「ねばねばネット」
                        return 1;
                    }
                    else {
                        return NumOfside;
                    }
                case 'entire-field':
                    return NumOfside;
                default:
                    if (pokemon.move.selected.name === 'Imprison' || pokemon.move.selected.name === 'Tera Blast') { // 技「ふういん」「テラバースト」
                        return NumOfside;
                    }
                    else {
                        return NumOfTarget;
                    }
            }
        };
        this.sub(Math.max(1, value(pokemon)));
    }
}
// -------------------------
// 使用する技
// -------------------------
class SelectedMove {
    constructor() {
        this.slot = 0;
        this.name = null;
        this.type = null;
        this.class = 'physical';
        this.target = 'user';
        this.power = null;
        this.accuracy = null;
        this.priority = 0;
        this.critical = 0;
        this.skin = new StateChange();
        this.store = null;
    }
    translate() {
        return moveMaster.filter(m => m.nameEN === this.name)[0].nameJA;
    }
    getMaster() {
        return moveMaster.filter(m => m.nameEN === this.name)[0];
    }
    getAddOn() {
        return moveAddOnMaster.filter(add => add.nameEN === this.name)[0];
    }
    setSelected(move, slot) {
        const master = moveMaster.find((m) => {
            return m.nameEN === move.name;
        });
        if (!master)
            return;
        this.name = move.name;
        this.type = master.type;
        this.class = master.class;
        this.target = master.target;
        this.power = master.power;
        this.accuracy = master.accuracy;
        this.priority = master.priority;
        this.critical = master.priority;
        this.slot = slot;
    }
    isType(type) {
        return this.type === type;
    }
    isPhysical() {
        return this.class === 'physical';
    }
    isSpecial() {
        return this.class === 'special';
    }
    isStatus() {
        return this.class === 'status';
    }
    //---------------------
    // スキン系特性が発動するか
    //---------------------
    isActivateSkin(type) {
        if (this.getAddOn().changeType)
            return false;
        if (this.name === 'Struggle')
            return false; // 技「わるあがき」
        if (type === 'Normal' && this.type === 'Normal')
            return false;
        if (type !== 'Normal' && this.type !== 'Normal')
            return false;
        return true;
    }
    activateSkin(type) {
        if (!this.isActivateSkin(type))
            return;
        this.type = type;
        this.skin.isTrue = true;
        this.skin.text = String(this.type);
    }
    //-------
    // ため技
    //-------
    setStore() {
        this.store = this.name;
    }
    isStore() {
        return this.store !== null;
    }
    //-------------
    // マグニチュード
    //-------------
    fixMagnitudePower() {
        if (this.name !== 'Magnitude')
            return; // 技「マグニチュード」
        const random = getRandom();
        if (random >= 95) {
            this.power = 150;
            battleLog.write(`マグニチュード10!`);
            return;
        }
        if (random >= 85) {
            this.power = 110;
            battleLog.write(`マグニチュード9!`);
            return;
        }
        if (random >= 65) {
            this.power = 90;
            battleLog.write(`マグニチュード8!`);
            return;
        }
        if (random >= 35) {
            this.power = 70;
            battleLog.write(`マグニチュード7!`);
            return;
        }
        if (random >= 15) {
            this.power = 50;
            battleLog.write(`マグニチュード6!`);
            return;
        }
        if (random >= 5) {
            this.power = 30;
            battleLog.write(`マグニチュード5!`);
            return;
        }
        if (random >= 0) {
            this.power = 10;
            battleLog.write(`マグニチュード4!`);
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
