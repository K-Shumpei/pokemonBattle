"use strict";
class StatusAilment {
    constructor() {
        this.name = null;
        this.turn = 0;
        this.rest = false; // 技「ねむる」により眠った場合
        this.defrost = false; // 氷を解かす技
        this.pokeName = '';
    }
    reset() {
        this.name = null;
        this.turn = 0;
        this.rest = false;
        this.defrost = false;
    }
    isHealth() {
        return this.name === null;
    }
    isParalysis() {
        return this.name === 'Paralysis';
    }
    isFrozen() {
        return this.name === 'Frozen';
    }
    isBurned() {
        return this.name === 'Burned';
    }
    isPoisoned() {
        return this.name === 'Poisoned';
    }
    isBadPoisoned() {
        return this.name === 'Poisoned' && this.turn > 0;
    }
    isAsleep() {
        return this.name === 'Asleep';
    }
    getHealth(item, move) {
        switch (this.name) {
            case 'Paralysis':
                if (item)
                    battleLog.write(`${this.pokeName}は ${item}で まひが 治った!`);
                else
                    battleLog.write(`${this.pokeName}は まひが 治った!`);
                break;
            case 'Frozen':
                if (item)
                    battleLog.write(`${this.pokeName}は ${item}で こおり状態が 治った!`);
                else if (move)
                    battleLog.write(`${this.pokeName}の ${item}で こおりが 解けた!`);
                else
                    battleLog.write(`${this.pokeName}は こおり状態が 治った!`);
                break;
            case 'Burned':
                if (item)
                    battleLog.write(`${this.pokeName}は ${item}で やけどが 治った!`);
                else
                    battleLog.write(`${this.pokeName}は やけどが 治った!`);
                break;
            case 'Poisoned':
                if (item)
                    battleLog.write(`${this.pokeName}は ${item}で 毒が 治った!`);
                else
                    battleLog.write(`${this.pokeName}は 毒が 治った!`);
                break;
            case 'Asleep':
                if (item)
                    battleLog.write(`${this.pokeName}は 目を 覚ました!`);
                break;
            default:
                break;
        }
        this.reset();
    }
    getParalysis() {
        this.name = 'Paralysis';
        battleLog.write(`${this.pokeName}は まひして 技が でにくくなった!`);
    }
    getFrozen() {
        this.name = 'Frozen';
        battleLog.write(`${this.pokeName}は 凍りついた!`);
    }
    getBurned(item) {
        this.name = 'Burned';
        if (item) {
            battleLog.write(`${this.pokeName}は ${item}で やけどを 負った!`);
        }
        else {
            battleLog.write(`${this.pokeName}は やけどを 負った!`);
        }
    }
    getPoisoned() {
        this.name = 'Poisoned';
        battleLog.write(`${this.pokeName}は 毒を あびた!`);
    }
    getBadPoisoned(item) {
        this.name = 'Poisoned';
        this.turn = 1;
        if (item) {
            battleLog.write(`${this.pokeName}は ${item}で 猛毒を あびた!`);
        }
        else {
            battleLog.write(`${this.pokeName}は 猛毒を あびた!`);
        }
    }
    getAsleep() {
        this.name = 'Asleep';
        battleLog.write(`${this.pokeName}は 眠ってしまった!`);
    }
    countPoisoned() {
        this.turn += 1;
    }
    copyAilment(ailment) {
        if (ailment.isAsleep())
            this.getAsleep();
        if (ailment.isBurned())
            this.getBurned();
        if (ailment.isFrozen())
            this.getFrozen();
        if (ailment.isParalysis())
            this.getParalysis();
        if (ailment.isPoisoned())
            this.getPoisoned();
        if (ailment.isBadPoisoned())
            this.getBadPoisoned();
        this.turn = ailment.turn;
    }
    onRest() {
        this.name = 'Asleep';
        this.rest = true;
        battleLog.write(`${this.pokeName}は 眠って 元気に なった!`);
    }
    onEffectivePoisoned(pokemon) {
        if (!this.isPoisoned())
            return;
        const damage = () => {
            if (pokemon.ability.isName('Poison Heal')) { // 特性「ポイズンヒール」
                return Math.floor(pokemon.getOrgHP() / 8);
            }
            if (this.isBadPoisoned()) {
                return Math.floor(pokemon.getOrgHP() * Math.min(this.turn, 15) / 16);
            }
            else {
                return Math.floor(pokemon.getOrgHP() / 8);
            }
        };
        if (pokemon.ability.isName('Poison Heal')) { // 特性「ポイズンヒール」
            pokemon.msgDeclareAbility();
            pokemon.status.hp.value.add(Math.max(1, damage()));
        }
        else {
            pokemon.status.hp.value.sub(Math.max(1, damage()));
            battleLog.write(`${pokemon.getArticle()}は 毒の ダメージを受けた!`);
        }
        if (this.isBadPoisoned()) {
            this.turn += 1;
        }
    }
    onEffectiveBurned(pokemon) {
        if (!this.isBurned())
            return;
        const damage = () => {
            if (pokemon.ability.isName('Heatproof')) { // 特性「たいねつ」
                return Math.floor(pokemon.getOrgHP() / 32);
            }
            else {
                return Math.floor(pokemon.getOrgHP() / 16);
            }
        };
        pokemon.status.hp.value.sub(Math.max(1, damage()));
        battleLog.write(`${pokemon.getArticle()}は やけどの ダメージを 受けた!`);
    }
    isEffectiveAsleep(pokemon) {
        if (!this.isAsleep())
            return false;
        const turn = () => {
            if (pokemon.ability.isName('Early Bird')) { // 特性「はやおき」
                return 2;
            }
            else {
                return 1;
            }
        };
        this.turn -= turn();
        if (this.turn <= 0) {
            this.getHealth();
            return false;
        }
        if (pokemon.move.selected.getAddOn().sleepingMove) {
            return false;
        }
        else {
            battleLog.write(`${pokemon.getArticle()}は ぐうぐう 眠っている`);
            return true;
        }
    }
    onSleepingMoveMsg(pokemon) {
        if (pokemon.move.selected.getAddOn().sleepingMove) {
            battleLog.write(`${pokemon.getArticle()}は ぐうぐう 眠っている`);
        }
    }
    isEffectiveFrozen(pokemon) {
        if (!this.isFrozen())
            return false;
        const isBurnUp = () => {
            if (pokemon.move.selected.name === 'Burn Up' && !pokemon.type.has('Fire')) {
                return false;
            }
            else {
                return true;
            }
        };
        // 確率で回復
        if (getRandom() < 20) {
            pokemon.statusAilment.getHealth();
            return false;
        }
        // 氷を解かす技
        if (pokemon.move.selected.getMaster().defrost && isBurnUp()) {
            this.defrost = true;
            return false;
        }
        // 解けない
        battleLog.write(`${pokemon.getArticle()}は 凍ってしまって 動けない!`);
        return true;
    }
    onDefrost(pokemon) {
        if (!this.defrost)
            return;
        this.getHealth(undefined, pokemon.move.selected.translate());
    }
    isEffectiveParalysis(pokemon) {
        if (!this.isParalysis())
            return false;
        if (getRandom() < 3 / 4 * 100)
            return false;
        battleLog.write(`${pokemon.getArticle()}は 体がしびれて 動かない!`);
        return true;
    }
}
