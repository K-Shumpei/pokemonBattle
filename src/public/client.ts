import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  correctPassword: () => void;
  incorrectPassword: () => void;
  selectPokemon: ( party: Pokemon[] ) => void;
}

interface ClientToServerEvents {
  sendPassword: ( inputPassword: string ) => void;
  findOpponent: ( myParty: Pokemon[] ) => void;
}

// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

// const socket = (0, io)();

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
  getHTMLInputElement( 'register_allRandom' ).disabled = true;
  getHTMLInputElement( 'find_opponent' ).disabled = true;
  for ( let i = 0; i < 6; i ++ ) {
    getHTMLInputElement( 'registerParty' + i ).disabled = true;
    getHTMLInputElement( 'editParty' + i ).disabled = true;
  }
  // パーティ送信
  socket.emit( 'findOpponent', myParty );
}

// 対戦相手が見つかり、戦うポケモンを選ぶ
socket.on( 'selectPokemon', ( party: Pokemon[] ) => {
  for ( let i = 0; i < 6; i++ ) {
    opponentParty[i] = party[i];
  }
})

