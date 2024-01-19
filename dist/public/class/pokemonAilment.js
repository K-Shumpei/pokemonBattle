"use strict";
class StatusAilment {
    constructor() {
        this._name = null;
        this._turn = 0;
        this._pokeName = '';
    }
    get turn() {
        return this._turn;
    }
    set turn(turn) {
        this._turn = turn;
    }
    isHealth() {
        return this._name === null;
    }
    isParalysis() {
        return this._name === 'Paralysis';
    }
    isFrozen() {
        return this._name === 'Frozen';
    }
    isBurned() {
        return this._name === 'Burned';
    }
    isPoisoned() {
        return this._name === 'Poisoned';
    }
    isBadPoisoned() {
        return this._name === 'Poisoned' && this._turn > 0;
    }
    isAsleep() {
        return this._name === 'Asleep';
    }
    getHealth(item) {
        switch (this._name) {
            case 'Paralysis':
                if (item)
                    writeLog(`${this._pokeName}は ${item}で まひが 治った!`);
                else
                    writeLog(`${this._pokeName}は まひが 治った!`);
                break;
            case 'Frozen':
                if (item)
                    writeLog(`${this._pokeName}は ${item}で こおり状態が 治った!`);
                else
                    writeLog(`${this._pokeName}は こおり状態が 治った!`);
                break;
            case 'Burned':
                if (item)
                    writeLog(`${this._pokeName}は ${item}で やけどが 治った!`);
                else
                    writeLog(`${this._pokeName}は やけどが 治った!`);
                break;
            case 'Poisoned':
                if (item)
                    writeLog(`${this._pokeName}は ${item}で 毒が 治った!`);
                else
                    writeLog(`${this._pokeName}は 毒が 治った!`);
                break;
            case 'Asleep':
                if (item)
                    writeLog(`${this._pokeName}は 目を 覚ました!`);
                break;
            default:
                break;
        }
        this._name = null;
        this._turn = 0;
    }
    getParalysis() {
        this._name = 'Paralysis';
        writeLog(`${this._pokeName}は まひして 技が でにくくなった!`);
    }
    getFrozen() {
        this._name = 'Frozen';
        writeLog(`${this._pokeName}は 凍りついた!`);
    }
    getBurned() {
        this._name = 'Burned';
        writeLog(`${this._pokeName}は やけどを 負った!`);
    }
    getPoisoned() {
        this._name = 'Poisoned';
        writeLog(`${this._pokeName}は 毒を あびた!`);
    }
    getBadPoisoned() {
        this._name = 'Poisoned';
        this._turn = 1;
        writeLog(`${this._pokeName}は 猛毒を あびた!`);
    }
    getAsleep() {
        this._name = 'Asleep';
        writeLog(`${this._pokeName}は 眠ってしまった!`);
    }
    countPoisoned() {
        this._turn += 1;
    }
}
