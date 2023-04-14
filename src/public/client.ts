import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  correctPassword: () => void;
  incorrectPassword: () => void;
}

interface ClientToServerEvents {
  sendPassword: ( inputPassword: string ) => void;
}

// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

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

