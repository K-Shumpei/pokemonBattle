import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import { arch } from "os";

interface ServerToClientEvents {
  correctPassword: () => void;
  incorrectPassword: () => void;
  selectPokemon: ( party: Pokemon[] ) => void;
}

interface ClientToServerEvents {
  sendPassword: ( inputPassword: string ) => void;
  findOpponent: ( myParty: Pokemon[] ) => void;
}


const app = express();
const httpServer = createServer( app );
const PORT = process.env.PORT || 3000;
const io = new Server<ClientToServerEvents, ServerToClientEvents>( httpServer );

// 公開フォルダの指定
app.use( express.static( __dirname + '/public') );

// サーバーを3000番ポートで起動
httpServer.listen( PORT, () => {
  console.log( `Server start on port ${PORT}.` );
});





class PlayerInfo {
  _socketID: string;
  _party: Pokemon[];

  constructor() {
    this._socketID = '';
    this._party = [];
  }

  set socketID( socketID: string ) {
    this._socketID = socketID;
  }
  set party( party: Pokemon[] ) {
    this._party = party;
  }

  get socketID(): string {
    return this._socketID;
  }
  get party(): Pokemon[] {
    return this._party
  }
}

const roomInfo: PlayerInfo[] = [ new PlayerInfo, new PlayerInfo ];



// 定数
const password: string = '11111';


io.on("connection", (socket) => {

  // パスワード受信
  socket.on( 'sendPassword', ( inputPassword: string ) => {
    if ( inputPassword === password ) {
      socket.emit( 'correctPassword' );
    } else {
      socket.emit( 'incorrectPassword' );
    }
  });

  // 対戦相手を探す
  socket.on( 'findOpponent', ( party: Pokemon[] ) => {
    for ( const player of roomInfo ) {
      if ( player.socketID === '' ) {
        player.socketID = socket.id;
        player.party = party;
        break;
      }
    }

    if ( roomInfo[0].socketID !== '' && roomInfo[1].socketID !== '' ) {
      socket.to( roomInfo[0].socketID ).emit( 'selectPokemon', roomInfo[1].party );
      socket.to( roomInfo[1].socketID ).emit( 'selectPokemon', roomInfo[0].party );
    }
  });
});

