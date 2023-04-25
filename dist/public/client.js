"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
// please note that the types are reversed
const socket = (0, socket_io_client_1.io)();
// const socket = (0, io)();
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
    getHTMLInputElement('register_allRandom').disabled = true;
    getHTMLInputElement('find_opponent').disabled = true;
    for (let i = 0; i < 6; i++) {
        getHTMLInputElement('registerParty' + i).disabled = true;
        getHTMLInputElement('editParty' + i).disabled = true;
    }
    // パーティ送信
    socket.emit('findOpponent', myParty);
}
// 対戦相手が見つかり、戦うポケモンを選ぶ
socket.on('selectPokemon', (party) => {
    for (let i = 0; i < 6; i++) {
        opponentParty[i] = party[i];
    }
});
