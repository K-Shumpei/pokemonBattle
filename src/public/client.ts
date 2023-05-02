import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  correctPassword: () => void;
  incorrectPassword: () => void;
  selectPokemon: ( party: Pokemon[] ) => void;
  sendOrder: ( myOrder: number[], opponentOrder: number[] ) => void;
  returnCommand: ( myCommand: Command[], opponentCommand: Command[] ) => void;
}

interface ClientToServerEvents {
  sendPassword: ( inputPassword: string ) => void;
  findOpponent: ( myParty: Pokemon[], battleStyle: number ) => void;
  decideOrder: ( order: number[] ) => void;
  sendCommand: ( myCommand: Command[] ) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

//const socket = (0, io)();

// パスワード送信
function sendPassword(): void {
  const inputPassword: string = getHTMLInputElement( 'inputPassword' ).value;
  socket.emit( 'sendPassword', inputPassword );
}

// 正しいパスワードの時
socket.on( 'correctPassword', () => {
  const headLine = getHTMLInputElement( 'headLine');
  const passwordField = getHTMLInputElement( 'passwordField');
  const registrationField = getHTMLInputElement( 'registrationField' );

  headLine.textContent = 'チームを登録してください';
  passwordField.style.display = 'none';
  registrationField.style.display = 'block';
});

// 間違ったパスワードの時
socket.on( 'incorrectPassword', () => {
  alert( 'パスワードが違います' );
});

// 対戦相手を探す
function findOpponent(): void {

  // パーティ登録ボタン
  getHTMLInputElement( 'registrationField' ).style.display = 'none';
  // ポケモン登録欄
  getHTMLInputElement( 'registerPokemonField' ).style.display = 'none';

  for ( let i = 0; i < 6; i ++ ) {
    // 登録・編集ボタン
    getHTMLInputElement( 'registerParty' + i ).style.display = 'none';
    getHTMLInputElement( 'editParty' + i ).style.display = 'none';
  }
  // パーティ送信
  socket.emit( 'findOpponent', myAllParty, fieldStatus.battleStyle );
}

// 対戦相手が見つかり、戦うポケモンを選ぶ
socket.on( 'selectPokemon', ( party: Pokemon[] ) => {
  for ( let i = 0; i < 6; i++ ) {
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
    for ( const parameter of Object.keys( party[i]._actualValue ) ) {
      opponentAllParty[i].actualValue[parameter] = party[i]._actualValue[parameter];
      opponentAllParty[i].baseStatus[parameter] = party[i]._baseStatus[parameter];
      opponentAllParty[i].individualValue[parameter] = party[i]._individualValue[parameter];
      opponentAllParty[i].effortValue[parameter] = party[i]._effortValue[parameter];
    }

    // 技
    for ( let j = 0; j < 4; j++ ) {
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
    const imageHTML = getHTMLInputElement( 'opponentParty_image' + i );
    imageHTML.src = './pokemonImage/' + opponentAllParty[i].status.number + '.png';
  }

  // 選出完了ボタン
  getHTMLInputElement( 'decideOrderField' ).style.display = 'block';
  // 選出・取消ボタン
  for ( let i = 0; i < 6; i++ ) {
    getHTMLInputElement( 'electPokemon' + i ).style.display = 'block';
    getHTMLInputElement( 'quitElection' + i ).style.display = 'block';
  }
});

// 選出決定
function decideOrder(): void {

  const myOrder: number[] = [];

  for ( let i = 0; i < fieldStatus.numberOfPokemon; i++ ) {
    myOrder.push( 0 );
  }

  for ( let i = 0; i < fieldStatus.numberOfPokemon; i++ ) {
    for ( let j = 0; j < 6; j++ ) {
      const targetText = getHTMLInputElement( 'electedOrder' + j );
      const targetOrder = Number( targetText.textContent?.charAt(0) );
      if ( targetOrder === i + 1 ) {
        myOrder[i] = j;
      }
    }
  }

  if ( myOrder.length < fieldStatus.battleStyle ) {
    return;
  }

  // 選出送信
  socket.emit( 'decideOrder', myOrder );

  // 選出完了ボタン
  getHTMLInputElement( 'decideOrderField' ).style.display = 'none';
  // 選出・取消ボタン
  for ( let i = 0; i < 6; i++ ) {
    getHTMLInputElement( 'electPokemon' + i ).style.display = 'none';
    getHTMLInputElement( 'quitElection' + i ).style.display = 'none';
  }
}

// 選出受信
socket.on( 'sendOrder', ( myOrder: number[], opponentOrder: number[] ) => {

  // お互いの選出に反映させる
  for ( let i = 0; i < fieldStatus.numberOfPokemon; i++ ) {
    myAllParty[myOrder[i]].order.hand = i;
    myAllParty[myOrder[i]].order.battle = i;
    myParty.push( myAllParty[myOrder[i]] );

    opponentAllParty[opponentOrder[i]].order.hand = i;
    opponentAllParty[opponentOrder[i]].order.battle = fieldStatus.battleStyle - i - 1;
    opponentParty.push( opponentAllParty[opponentOrder[i]] );
  }

  // 選出されたポケモンの情報・表示
  for ( const pokemon of myParty ) {
    showPartyPokemon( pokemon );
  }

  // 選出されなかったポケモンの情報・表示を削除
  for ( let i = 5; i >= fieldStatus.numberOfPokemon; i-- ) {
    getHTMLInputElement( 'myParty' + i ).style.display = 'none';
  }

  // 選出・取消ボタンの非表示化
  for ( let i = 0; i < 6; i++ ) {
    getHTMLInputElement( 'electedOrder' + i ).textContent = '';
  }

  // バトル形式に応じてバトルフィールドを表示
  for ( let i = 0; i < fieldStatus.battleStyle; i++ ) {
    getHTMLInputElement( 'battleRow_' + i ).style.visibility = 'visible';
    getHTMLInputElement( 'command1st_' + i ).style.visibility = 'visible';
    getHTMLInputElement( 'battleMyImage_' + i ).src = './pokemonImage/' + myParty[i].status.number + '.png';
    getHTMLInputElement( 'battleOpponentImage_' + i ).src = './pokemonImage/' + opponentParty[fieldStatus.battleStyle - i -1].status.number + '.png';
  }

  // コマンド欄の表示
  showCommand1stField();
});


// コマンド送信
function sendCommand(): void {

  const myCommand: Command[] = [];

  for ( let i = 0; i < fieldStatus.battleStyle; i++ ) {
    const command = new Command;

    // 技
    for ( let j = 0; j < 4; j++ ) {
      const moveRadio = getHTMLInputElement( 'moveRadio_' + i + '_' + j );
      if ( moveRadio.checked === true ) {
        command.move = j;
      }
    }
    // 控え
    for ( let j = 0; j < 3; j++ ) {
      const reserveRadio = getHTMLInputElement( 'reserveRadio_' + i + '_' + j );
      if ( reserveRadio.checked === true ) {
        command.reserve = j;
      }
    }
    // 攻撃対象：相手の場
    for ( let j = 0; j < 3; j++ ) {
      const opponentTargetRadio = getHTMLInputElement( 'opponentTargetRadio_' + i + '_' + j );
      if ( opponentTargetRadio.checked === true ) {
        command.opponentTarget = j;
      }
    }
    // 攻撃対象：自分の場
    for ( let j = 0; j < 2; j++ ) {
      const myTargetRadio = getHTMLInputElement( 'myTargetRadio_' + i + '_' + j );
      if ( myTargetRadio.checked === true ) {
        command.myTarget = j;
      }
    }

    myCommand.push( command );
  }

  socket.emit( 'sendCommand', myCommand );
}


// コマンド返還
socket.on( 'returnCommand', ( myCommand: Command[], opponentCommand: Command[] ) => {

  for ( let i = 0; i < fieldStatus.battleStyle; i++ ) {
    for ( const pokemon of myParty ) {
      if ( pokemon.order.battle !== i ) {
        continue;
      }
      pokemon.command.move = myCommand[i]._move;
      pokemon.command.reserve = myCommand[i]._reserve;
      pokemon.command.myTarget = myCommand[i]._myTarget;
      pokemon.command.opponentTarget = myCommand[i]._opponentTarget;
    }
    for ( const pokemon of opponentParty ) {
      if ( pokemon.order.battle !== i ) {
        continue;
      }
      pokemon.command.move = opponentCommand[i]._move;
      pokemon.command.reserve = opponentCommand[i]._reserve;
      pokemon.command.myTarget = opponentCommand[i]._myTarget;
      pokemon.command.opponentTarget = opponentCommand[i]._opponentTarget;
    }
  }

  // ターンの流れ　3.トレーナーの行動、ポケモンの行動順に関する行動

});
