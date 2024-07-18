"use strict";
class Main {
    constructor() {
        this.me = new Player(true);
        this.opp = new Player(false);
        this.field = new Field();
        this.status = 3;
    }
    getHostPlayer(host) {
        if (this.me.host === host) {
            return this.me;
        }
        else {
            return this.opp;
        }
    }
    setHost(host) {
        this.me.setHost(host);
        this.opp.setHost(!host);
        this.field.setHost(host);
    }
    getPlayer(isMe) {
        return (isMe) ? this.me : this.opp;
    }
    getParty(isMe) {
        return (isMe) ? this.me.pokemon : this.opp.pokemon;
    }
    getPokemonByParty(isMe, party) {
        const pokemon = this.getParty(isMe);
        return pokemon.filter(p => p.order.party === party)[0];
    }
    getPokemonByBattle(attack) {
        const pokemon = this.getParty(attack.isMe);
        return pokemon.filter(p => p.order.battle === attack.battle)[0];
    }
    getPokemonByOrder(order) {
        const pokemon = this.getParty(order.isMe);
        return pokemon.filter(p => p.order.battle === order.battle)[0];
    }
    isExistByBattle(isMe, battle) {
        const pokemon = this.getParty(isMe);
        return pokemon.filter(p => p.order.battle === battle).length === 1;
    }
    isExistAbility(name) {
        return getPokemonInBattlefield('host-party').filter(p => p.ability.isName(name)).length > 0;
    }
    getExistAbility(name) {
        return getPokemonInBattlefield('host-party').filter(p => p.ability.isName(name))[0];
    }
    isExistAbilityInSide(isMe, name) {
        return getPokemonInSide(isMe).filter(p => p.ability.isName(name)).length > 0;
    }
    getExistAbilityInSide(isMe, name) {
        return getPokemonInSide(isMe).filter(p => p.ability.isName(name))[0];
    }
    calcRankCorrectionValue() {
        for (const pokemon of getPokemonInBattlefield('host-party')) {
            pokemon.status.calcRankCorrectionValue(pokemon);
        }
    }
    isUproar() {
        for (const pokemon of getPokemonInBattlefield('host-party')) {
            if (pokemon.stateChange.uproar.isTrue)
                return true;
        }
        return false;
    }
}
class Player {
    constructor(isMe) {
        this.host = false;
        this.pokemon = [];
        this.extraCommand = [];
        this.party = [
            new Pokemon(isMe, 0),
            new Pokemon(isMe, 1),
            new Pokemon(isMe, 2),
            new Pokemon(isMe, 3),
            new Pokemon(isMe, 4),
            new Pokemon(isMe, 5)
        ];
    }
    setHost(host) {
        this.host = host;
        for (const pokemon of this.pokemon) {
            pokemon.order.host = host;
        }
    }
    setExtraCommand(order) {
        if (order.battle === null)
            return;
        this.extraCommand.push({ party: order.party, battle: order.battle });
    }
    deleteExtraCommand(battle) {
        this.extraCommand = this.extraCommand.filter(e => e.battle !== battle);
    }
    showHandInfo() {
        for (const pokemon of this.pokemon) {
            pokemon.showHandInfo();
        }
    }
    showCommand1stField() {
        // 送信ボタンの非活性化
        getHTMLInputElement('sendCommandButton').disabled = false;
        for (let i = 0; i < this.pokemon.length; i++) {
            if (this.pokemon.filter(poke => poke.order.battle === i).length === 0)
                continue;
            const pokemon = this.pokemon.filter(poke => poke.order.battle === i)[0];
            // 技・控え
            getHTMLInputElement('command1st_' + i).style.visibility = 'visible';
            if (pokemon.order.battle === null)
                return;
            pokemon.move.showCommand1st(pokemon.order.battle);
            // 控え
            const reserve = this.pokemon.filter(poke => poke.order.battle === null && !poke.status.hp.value.isZero());
            for (let j = 0; j < reserve.length; j++) {
                if (reserve[j].name === null)
                    continue;
                getHTMLInputElement('reserveRadio_' + i + '_' + j).disabled = false;
                getHTMLInputElement('reserveText_' + i + '_' + j).textContent = reserve[j].translateName(String(reserve[j].name));
                getHTMLInputElement('reserveText_' + i + '_' + j).value = String(reserve[j].order.party);
            }
        }
    }
    showCommandOnlyMe() {
        // 途中コマンド
        getHTMLInputElement('sendExtraCommandButton').disabled = false;
        // 控え
        const reserve = this.pokemon.filter(poke => poke.order.battle === null && !poke.status.hp.value.isZero());
        for (let i = 0; i < this.extraCommand.length; i++) {
            // 技・控え
            getHTMLInputElement('command1st_' + i).style.visibility = 'visible';
            for (let j = 0; j < reserve.length; j++) {
                if (reserve[j].name === null)
                    continue;
                if (reserve[j].order.party === this.extraCommand[0].party)
                    continue;
                getHTMLInputElement('reserveRadio_' + i + '_' + j).disabled = false;
                getHTMLInputElement('reserveText_' + i + '_' + j).textContent = reserve[j].translateName(String(reserve[j].name));
                getHTMLInputElement('reserveText_' + i + '_' + j).value = String(reserve[j].order.party);
            }
        }
    }
    showCommandOnlyOpp() {
    }
    isExcangable() {
        return this.pokemon.filter(p => p.order.battle === null && !p.status.hp.value.isZero()).length > 0;
    }
    cycleHand(hand) {
        for (const pokemon of this.pokemon) {
            if (pokemon.order.hand > hand) {
                pokemon.order.hand -= 1;
            }
        }
    }
}
class ElectOrder {
    constructor() {
        this._order = [];
    }
    isElected(number) {
        return this._order.some(o => o === number);
    }
    isAllElected() {
        return this._order.length === fieldStatus.numberOfPokemon;
    }
    elsect(number) {
        this._order.push(number);
    }
    quit(number) {
        this._order = this._order.filter(o => o !== number);
    }
    show() {
        for (let i = 0; i < 6; i++) {
            const targetText = getHTMLInputElement('electedOrder' + i);
            // 選出が0匹の時
            if (this._order.length === 0) {
                targetText.textContent = '';
                continue;
            }
            // 選出が1匹以上の時
            for (let j = 0; j < this._order.length; j++) {
                if (this._order[j] === i) {
                    targetText.textContent = String(j + 1) + '番目';
                    break;
                }
                else {
                    targetText.textContent = '';
                }
            }
        }
    }
}
const main = new Main();
const electedOrder = new ElectOrder();
class BattleLog {
    constructor() {
        this.log = [];
        // 非同期関数としてタイマーを実装
        this.sleep = (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };
        // 上記の関数をasync/awaitと組み合わせて使用
        this.output = async () => {
            const output = document.getElementById('battle_log');
            for (const log of this.log) {
                output.value += log + "\n";
                output.scrollTop = output.scrollHeight;
                await this.sleep(1000); // 2秒待機
            }
            output.value += "終了" + "\n\n";
            this.log = [];
        };
    }
    write(msg) {
        this.log.push(msg);
    }
}
const battleLog = new BattleLog();
