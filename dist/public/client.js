"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)();
//const socket = (0, io)();
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
        // トレーナーネーム
        opponentAllParty[i].trainer = 'opp';
        // 並び順
        opponentAllParty[i].order.party = party[i]._order._party;
        opponentAllParty[i].order.hand = party[i]._order._hand;
        // 基本ステータス
        opponentAllParty[i].id.id = party[i]._id._id;
        opponentAllParty[i].id.order = party[i]._id._order;
        opponentAllParty[i].id.index = party[i]._id._index;
        opponentAllParty[i].name = party[i]._name;
        opponentAllParty[i].type1 = party[i]._type1;
        opponentAllParty[i].type2 = party[i]._type2;
        opponentAllParty[i].gender = party[i]._gender;
        opponentAllParty[i].ability.setOrg(party[i]._ability.name);
        opponentAllParty[i].level = party[i]._level;
        opponentAllParty[i].item = party[i]._item;
        opponentAllParty[i].nature = party[i]._nature;
        opponentAllParty[i].hitPoint = party[i]._hitPoint;
        // 実数値・種族値・個体値・努力値
        opponentAllParty[i].status.copy(party[i]._status);
        // 技
        for (let j = 0; j < 4; j++) {
            opponentAllParty[i].move.learned[j].copy(party[i]._move._learned[j]);
        }
        // パーティ画像
        const imageHTML = getHTMLInputElement('opponentParty_image' + i);
        imageHTML.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + opponentAllParty[i].id.id + '.png';
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
    if (myOrder.length < fieldStatus.battleStyle) {
        return;
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
    // お互いの選出に反映させる
    for (let i = 0; i < fieldStatus.numberOfPokemon; i++) {
        // 手持ちの順番
        myAllParty[myOrder[i]].order.hand = i;
        opponentAllParty[opponentOrder[i]].order.hand = i;
        // バトル場の順番
        if (i < fieldStatus.battleStyle) {
            myAllParty[myOrder[i]].order.battle = i;
            opponentAllParty[opponentOrder[i]].order.battle = fieldStatus.battleStyle - i - 1;
        }
        else {
            myAllParty[myOrder[i]].order.battle = null;
            opponentAllParty[opponentOrder[i]].order.battle = null;
        }
        // 手持ちにセット
        myParty.push(myAllParty[myOrder[i]]);
        opponentParty.push(opponentAllParty[opponentOrder[i]]);
    }
    // 選出されたポケモンの情報・表示
    for (const pokemon of myParty) {
        showPartyPokemon(pokemon);
    }
    // 選出されなかったポケモンの情報・表示を削除
    for (let i = 5; i >= fieldStatus.numberOfPokemon; i--) {
        getHTMLInputElement('myParty' + i).style.display = 'none';
    }
    // 選出・取消ボタンの非表示化
    for (let i = 0; i < 6; i++) {
        getHTMLInputElement('electedOrder' + i).textContent = '';
    }
    // バトル形式に応じてバトルフィールドを表示
    for (let i = 0; i < fieldStatus.battleStyle; i++) {
        getHTMLInputElement('battleRow_' + i).style.visibility = 'visible';
        getHTMLInputElement('command1st_' + i).style.visibility = 'visible';
    }
    // 最初のポケモンを出す
    for (let i = 0; i < fieldStatus.battleStyle; i++) {
        for (const pokemon of opponentParty) {
            if (pokemon.order.battle === i) {
                toBattleField(pokemon, i);
            }
        }
    }
    for (let i = 0; i < fieldStatus.battleStyle; i++) {
        for (const pokemon of myParty) {
            if (pokemon.order.battle === i) {
                toBattleField(pokemon, i);
            }
        }
    }
    // コマンド欄の表示
    showCommand1stField();
});
// コマンド送信
function sendCommand() {
    const myCommand = [];
    for (let i = 0; i < fieldStatus.battleStyle; i++) {
        const command = new Command;
        // 技
        for (let j = 0; j < 4; j++) {
            const moveRadio = getHTMLInputElement('moveRadio_' + i + '_' + j);
            if (moveRadio.checked === true) {
                command.move = j;
            }
        }
        // 控え
        for (let j = 0; j < 3; j++) {
            const reserveRadio = getHTMLInputElement('reserveRadio_' + i + '_' + j);
            if (reserveRadio.checked === true) {
                command.reserve = Number(getHTMLInputElement('reserveText_' + i + '_' + j).value);
            }
        }
        // 攻撃対象：相手の場
        for (let j = 0; j < 3; j++) {
            const opponentTargetRadio = getHTMLInputElement('opponentTargetRadio_' + i + '_' + j);
            if (opponentTargetRadio.checked === true) {
                command.opponentTarget = j;
            }
        }
        // 攻撃対象：自分の場
        for (let j = 0; j < 2; j++) {
            const myTargetRadio = getHTMLInputElement('myTargetRadio_' + i + '_' + j);
            if (myTargetRadio.checked === true) {
                command.myTarget = j;
            }
        }
        myCommand.push(command);
    }
    // 送信
    socket.emit('sendCommand', myCommand);
    // 送信ボタンの非活性化
    getHTMLInputElement('sendCommandButton').disabled = true;
    // コマンドボタンの非活性化
    for (let i = 0; i < fieldStatus.battleStyle; i++) {
        // 技
        for (let j = 0; j < 4; j++) {
            getHTMLInputElement('moveRadio_' + i + '_' + j).checked = false;
            getHTMLInputElement('moveRadio_' + i + '_' + j).disabled = true;
            getHTMLInputElement('moveText_' + i + '_' + j).textContent = null;
        }
        // 控え
        for (let j = 0; j < 3; j++) {
            getHTMLInputElement('reserveRadio_' + i + '_' + j).checked = false;
            getHTMLInputElement('reserveRadio_' + i + '_' + j).disabled = true;
            getHTMLInputElement('reserveText_' + i + '_' + j).textContent = null;
            getHTMLInputElement('reserveText_' + i + '_' + j).value = "";
        }
        // 攻撃対象：相手の場
        for (let j = 0; j < 3; j++) {
            getHTMLInputElement('opponentTargetRadio_' + i + '_' + j).checked = false;
            getHTMLInputElement('opponentTargetRadio_' + i + '_' + j).disabled = true;
            getHTMLInputElement('opponentTargetText_' + i + '_' + j).textContent = null;
        }
        // 攻撃対象：自分の場
        for (let j = 0; j < 2; j++) {
            getHTMLInputElement('myTargetRadio_' + i + '_' + j).checked = false;
            getHTMLInputElement('myTargetRadio_' + i + '_' + j).disabled = true;
            getHTMLInputElement('myTargetText_' + i + '_' + j).textContent = null;
        }
        // 技・控え
        getHTMLInputElement('command1st_' + i).style.visibility = 'collapse';
        // 攻撃対象
        getHTMLInputElement('command2nd_' + i).style.visibility = 'collapse';
    }
}
// コマンド返還
socket.on('returnCommand', (myCommand, opponentCommand, random) => {
    for (let i = 0; i < fieldStatus.battleStyle; i++) {
        for (const pokemon of myParty) {
            if (pokemon.order.battle !== i) {
                continue;
            }
            pokemon.command.move = myCommand[i]._move;
            pokemon.command.reserve = myCommand[i]._reserve;
            pokemon.command.myTarget = myCommand[i]._myTarget;
            pokemon.command.opponentTarget = myCommand[i]._opponentTarget;
            // 使用する技
            pokemon.move.setSelcted(pokemon.command.move);
        }
        for (const pokemon of opponentParty) {
            if (pokemon.order.battle !== i) {
                continue;
            }
            pokemon.command.move = opponentCommand[i]._move;
            pokemon.command.reserve = opponentCommand[i]._reserve;
            pokemon.command.myTarget = opponentCommand[i]._myTarget;
            pokemon.command.opponentTarget = opponentCommand[i]._opponentTarget;
            // 使用する技
            pokemon.move.setSelcted(pokemon.command.move);
        }
    }
    // 乱数リセット
    randomList = [];
    for (const number of random) {
        randomList.push(number);
    }
    // ターンの流れ
    // 3. トレーナーの行動、ポケモンの行動順に関する行動
    actionBeforeTurn();
    // 4. ポケモンの行動
    pokemonAction();
    // 5. ターン終了時の効果
    endProcess();
    // 画面表示
    // 選出されたポケモンの情報・表示
    for (const pokemon of myParty) {
        showPartyPokemon(pokemon);
    }
    // コマンド欄の表示
    showCommand1stField();
});
