"use strict";
class Status {
    constructor() {
        this._number = '';
        this._name = '';
        this._type1 = '';
        this._type2 = '';
        this._gender = '';
        this._ability = '';
        this._level = 50;
        this._item = '';
        this._nature = '';
        this._height = 1.0;
        this._weight = 1.0;
        this._remainingHP = 0;
        this._statusAilment = '';
    }
    set number(number) {
        this._number = number;
    }
    set name(name) {
        this._name = name;
    }
    set type1(type) {
        this._type1 = type;
    }
    set type2(type) {
        this._type2 = type;
    }
    set gender(gender) {
        this._gender = gender;
    }
    set ability(ability) {
        this._ability = ability;
    }
    set level(level) {
        this._level = level;
    }
    set item(item) {
        this._item = item;
    }
    set nature(nature) {
        this._nature = nature;
    }
    set height(height) {
        this._height = height;
    }
    set weight(weight) {
        this._weight = weight;
    }
    set remainingHP(remainingHP) {
        this._remainingHP = remainingHP;
    }
    set statusAilment(statusAilment) {
        this._statusAilment = statusAilment;
    }
    get number() {
        return this._number;
    }
    get name() {
        return this._name;
    }
    get type1() {
        return this._type1;
    }
    get type2() {
        return this._type2;
    }
    get gender() {
        return this._gender;
    }
    get ability() {
        return this._ability;
    }
    get level() {
        return this._level;
    }
    get item() {
        return this._item;
    }
    get nature() {
        return this._nature;
    }
    get height() {
        return this._height;
    }
    get weight() {
        return this._weight;
    }
    get remainingHP() {
        return this._remainingHP;
    }
    get statusAilment() {
        return this._statusAilment;
    }
}
class ParameterSix {
    constructor() {
        this._hitPoint = 0;
        this._attack = 0;
        this._defense = 0;
        this._specialAttack = 0;
        this._specialDefense = 0;
        this._speed = 0;
    }
    set hitPoint(hitPoint) {
        this._hitPoint = hitPoint;
    }
    set attack(attack) {
        this._attack = attack;
    }
    set defense(defense) {
        this._defense = defense;
    }
    set specialAttack(specialAttack) {
        this._specialAttack = specialAttack;
    }
    set specialDefense(specialDefense) {
        this._specialDefense = specialDefense;
    }
    set speed(speed) {
        this._speed = speed;
    }
}
class AvailableMove {
    constructor() {
        this._name = '';
        this._type = '';
        this._category = '';
        this._power = 0;
        this._accuracy = 0;
        this._remainingPP = 0;
        this._powerPoint = 0;
        this._isDirect = true;
        this._isProtect = true;
        this._target = '';
    }
    set name(name) {
        this._name = name;
    }
    set type(type) {
        this._type = type;
    }
    set category(category) {
        this._category = category;
    }
    set power(power) {
        this._power = power;
    }
    set accuracy(accuracy) {
        this._accuracy = accuracy;
    }
    set remainingPP(remainingPP) {
        this._remainingPP = remainingPP;
    }
    set powerPoint(powerPoint) {
        this._powerPoint = powerPoint;
    }
    set isDirect(isDirect) {
        this._isDirect = isDirect;
    }
    set isProtect(isProtect) {
        this._isProtect = isProtect;
    }
    set target(target) {
        this._target = target;
    }
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
    get category() {
        return this._category;
    }
    get power() {
        return this._power;
    }
    get accuracy() {
        return this._accuracy;
    }
    get remainingPP() {
        return this._remainingPP;
    }
    get powerPoint() {
        return this._powerPoint;
    }
    get isDirect() {
        return this._isDirect;
    }
    get isProtect() {
        return this._isProtect;
    }
    get target() {
        return this._target;
    }
}
class Pokemon {
    constructor() {
        this._partyNumber = 0;
        this.status = new Status;
        this.actualValue = new ParameterSix;
        this.baseStatus = new ParameterSix;
        this.individualValue = new ParameterSix;
        this.effortValue = new ParameterSix;
        this.move = [
            new AvailableMove,
            new AvailableMove,
            new AvailableMove,
            new AvailableMove
        ];
    }
    get partyNumber() {
        return this._partyNumber;
    }
    set partyNumber(number) {
        this._partyNumber = number;
    }
}
class Field {
    constructor() {
        this._battleStyle = 1;
        this._numberOfPokemon = 3;
    }
    get battleStyle() {
        return this._battleStyle;
    }
    get numberOfPokemon() {
        return this._numberOfPokemon;
    }
    setNumberOfPokemon(battleStyle) {
        this._battleStyle = battleStyle;
        if (battleStyle === 1) {
            this._numberOfPokemon = 3;
        }
        else if (battleStyle === 2) {
            this._numberOfPokemon = 4;
        }
        else if (battleStyle === 3) {
            this._numberOfPokemon = 6;
        }
    }
}
