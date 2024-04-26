"use strict";
class StatusAilment {
    constructor() {
        this.name = null;
        this.turn = 0;
        this.rest = false; // 技「ねむる」により眠った場合
        this.pokeName = '';
    }
    reset() {
        this.name = null;
        this.turn = 0;
        this.rest = false;
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
    getHealth(item) {
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
}
