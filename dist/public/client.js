"use strict";

const socket = (0, io)();
// パスワード送信
function sendPassword() {
    const inputPassword = getHTMLInputElement('inputPassword').value;
    socket.emit('sendPassword', inputPassword);
}
// 正しいパスワードの時
socket.on('correctPassword', () => {
    const headLine = getHTMLInputElement('headLine');
    const passwordField = getHTMLInputElement('passwordField');
    const registrationField = getHTMLInputElement('registrationField');
    headLine.textContent = 'チームを登録してください';
    passwordField.style.display = 'none';
    registrationField.style.display = 'block';
});
// 間違ったパスワードの時
socket.on('incorrectPassword', () => {
    alert('パスワードが違います');
});
// 対戦相手を探す
function findOpponent() {
    // パーティ登録ボタン
    getHTMLInputElement('registrationField').style.display = 'none';
    // ポケモン登録欄
    getHTMLInputElement('registerPokemonField').style.display = 'none';
    for (let i = 0; i < 6; i++) {
        // 登録・編集ボタン
        getHTMLInputElement('registerParty' + i).style.display = 'none';
        getHTMLInputElement('editParty' + i).style.display = 'none';
    }
    // パーティ送信
    socket.emit('findOpponent', myAllParty, fieldStatus.battleStyle);
}
// 対戦相手が見つかり、戦うポケモンを選ぶ
socket.on('selectPokemon', (party) => {
    for (let i = 0; i < 6; i++) {
        // 並び順
        opponentAllParty[i].order.party = party[i]._order._party;
        opponentAllParty[i].order.hand = party[i]._order._hand;
        // 基本ステータス
        opponentAllParty[i].status.number = party[i]._status._number;
        opponentAllParty[i].status.name = party[i]._status._name;
        opponentAllParty[i].status.type1 = party[i]._status._type1;
        opponentAllParty[i].status.type2 = party[i]._status._type2;
        opponentAllParty[i].status.gender = party[i]._status._gender;
        opponentAllParty[i].status.ability = party[i]._status._ability;
        opponentAllParty[i].status.level = party[i]._status._level;
        opponentAllParty[i].status.item = party[i]._status._item;
        opponentAllParty[i].status.nature = party[i]._status._nature;
        opponentAllParty[i].status.height = party[i]._status._height;
        opponentAllParty[i].status.weight = party[i]._status._weight;
        opponentAllParty[i].status.remainingHP = party[i]._status._remainingHP;
        // 実数値・種族値・個体値・努力値
        for (const parameter of Object.keys(party[i]._actualValue)) {
            opponentAllParty[i].actualValue[parameter] = party[i]._actualValue[parameter];
            opponentAllParty[i].baseStatus[parameter] = party[i]._baseStatus[parameter];
            opponentAllParty[i].individualValue[parameter] = party[i]._individualValue[parameter];
            opponentAllParty[i].effortValue[parameter] = party[i]._effortValue[parameter];
        }
        // 技
        for (let j = 0; j < 4; j++) {
            opponentAllParty[i].move[j].name = party[i]._move[j]._name;
            opponentAllParty[i].move[j].type = party[i]._move[j]._type;
            opponentAllParty[i].move[j].category = party[i]._move[j]._category;
            opponentAllParty[i].move[j].power = party[i]._move[j]._power;
            opponentAllParty[i].move[j].accuracy = party[i]._move[j]._accuracy;
            opponentAllParty[i].move[j].remainingPP = party[i]._move[j]._remainingPP;
            opponentAllParty[i].move[j].powerPoint = party[i]._move[j]._remainingPP;
            opponentAllParty[i].move[j].isDirect = party[i]._move[j]._isDirect;
            opponentAllParty[i].move[j].isProtect = party[i]._move[j]._isProtect;
            opponentAllParty[i].move[j].target = party[i]._move[j]._target;
        }
        // パーティ画像
        const imageHTML = getHTMLInputElement('opponentParty_image' + i);
        imageHTML.src = './pokemonImage/' + opponentAllParty[i].status.number + '.png';
    }
    // 選出完了ボタン
    getHTMLInputElement('decideOrderField').style.display = 'block';
    // 選出・取消ボタン
    for (let i = 0; i < 6; i++) {
        getHTMLInputElement('electPokemon' + i).style.display = 'block';
        getHTMLInputElement('quitElection' + i).style.display = 'block';
    }
});
// 選出決定
function decideOrder() {
    var _a;
    const myOrder = [];
    for (let i = 0; i < fieldStatus.numberOfPokemon; i++) {
        myOrder.push(0);
    }
    for (let i = 0; i < fieldStatus.numberOfPokemon; i++) {
        for (let j = 0; j < 6; j++) {
            const targetText = getHTMLInputElement('electedOrder' + j);
            const targetOrder = Number((_a = targetText.textContent) === null || _a === void 0 ? void 0 : _a.charAt(0));
            if (targetOrder === i + 1) {
                myOrder[i] = j;
            }
        }
    }
    // 選出送信
    socket.emit('decideOrder', myOrder);
    // 選出完了ボタン
    getHTMLInputElement('decideOrderField').style.display = 'none';
    // 選出・取消ボタン
    for (let i = 0; i < 6; i++) {
        getHTMLInputElement('electPokemon' + i).style.display = 'none';
        getHTMLInputElement('quitElection' + i).style.display = 'none';
    }
}
// 選出受信
socket.on('sendOrder', (myOrder, opponentOrder) => {
    for (let i = 0; i < fieldStatus.numberOfPokemon; i++) {
        myAllParty[myOrder[i]].order.hand = i;
        myParty.push(myAllParty[myOrder[i]]);
        opponentAllParty[opponentOrder[i]].order.hand = i;
        opponentParty.push(opponentAllParty[opponentOrder[i]]);
    }
    for (const pokemon of myParty) {
        showPartyPokemon(pokemon);
    }
    for (let i = 5; i >= fieldStatus.numberOfPokemon; i--) {
        getHTMLInputElement('myParty' + i).style.display = 'none';
    }
    for (let i = 0; i < 6; i++) {
        getHTMLInputElement('electedOrder' + i).textContent = '';
    }
});
