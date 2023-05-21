"use strict";
class ActionOrderInfo {
    constructor() {
        this._trainer = 'me';
        this._battleNumber = 0;
        this._raise = 0;
        this._lower = 0;
        this._priority = 0;
        this._ahead = 0;
        this._later = 0;
        this._speed = 0;
        this._random = 0;
    }
    set trainer(trainer) {
        this._trainer = trainer;
    }
    set battleNumber(battleNumber) {
        this._battleNumber = battleNumber;
    }
    set raise(raise) {
        this._raise = raise;
    }
    set lower(lower) {
        this._lower = lower;
    }
    set priority(priority) {
        this._priority = priority;
    }
    set ahead(ahead) {
        this._ahead = ahead;
    }
    set later(later) {
        this._later = later;
    }
    set speed(speed) {
        this._speed = speed;
    }
    set random(random) {
        this._random = random;
    }
    get trainer() {
        return this._trainer;
    }
    get battleNumber() {
        return this._battleNumber;
    }
    get raise() {
        return this._raise;
    }
    get lower() {
        return this._lower;
    }
    get priority() {
        return this._priority;
    }
    get ahead() {
        return this._priority;
    }
    get later() {
        return this._later;
    }
    get speed() {
        return this._speed;
    }
    get random() {
        return this._random;
    }
}
