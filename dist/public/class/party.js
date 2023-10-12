"use strict";
class BothParty {
    constructor() {
        this._myParty = new Party();
        this._oppParty = new Party();
    }
    get myParty() {
        return this._myParty;
    }
    get oppParty() {
        return this._oppParty;
    }
}
class Party {
    constructor() {
        this._pokemon = [];
    }
    get pokemon() {
        return this._pokemon;
    }
    showCommand1stField() {
        // 送信ボタンの非活性化
        getHTMLInputElement('sendCommandButton').disabled = false;
        for (let i = 0; i < this._pokemon.length; i++) {
            if (this._pokemon.filter(poke => poke.order.battle === i).length === 0)
                continue;
            const pokemon = this._pokemon.filter(poke => poke.order.battle === i)[0];
            // 技・控え
            getHTMLInputElement('command1st_' + i).style.visibility = 'visible';
            if (pokemon.order.battle === null)
                return;
            pokemon.move.showCommand1st(pokemon.order.battle);
            // 控え
            const reserve = this._pokemon.filter(poke => poke.order.battle === null && !poke.status.hp.value.isZero());
            for (let j = 0; j < reserve.length; j++) {
                if (reserve[j].name === '')
                    continue;
                getHTMLInputElement('reserveRadio_' + i + '_' + j).disabled = false;
                getHTMLInputElement('reserveText_' + i + '_' + j).textContent = reserve[j].translateName(reserve[j].name);
                getHTMLInputElement('reserveText_' + i + '_' + j).value = String(reserve[j].order.party);
            }
        }
    }
    showHandInfo() {
        for (const pokemon of this._pokemon) {
            pokemon.showHandInfo();
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
const bothParty = new BothParty();
const electedOrder = new ElectOrder();
