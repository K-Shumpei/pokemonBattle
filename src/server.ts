import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

interface ServerToClientEvents {
  correctPassword: () => void;
  incorrectPassword: () => void;
  selectPokemon: ( party: Pokemon[] ) => void;
  sendOrder: ( myOrder: number[], opponentOrder: number[] ) => void;
}

interface ClientToServerEvents {
  sendPassword: ( inputPassword: string ) => void;
  findOpponent: ( myParty: Pokemon[], battleStyle: number ) => void;
  decideOrder: ( order: number[] ) => void;
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
  _order: number[];

  constructor() {
    this._socketID = '';
    this._party = [];
    this._order = [];
  }

  set socketID( socketID: string ) {
    this._socketID = socketID;
  }
  set party( party: Pokemon[] ) {
    this._party = party;
  }
  set order( order: number[] ) {
    this._order = order;
  }

  get socketID(): string {
    return this._socketID;
  }
  get party(): Pokemon[] {
    return this._party;
  }
  get order(): number[] {
    return this._order;
  }
}

type RoomType = {
  battleStyle: number;
  player1: PlayerInfo;
  player2: PlayerInfo;
}

const waitingRoom: RoomType[] = [
  { battleStyle: 1, player1: new PlayerInfo, player2: new PlayerInfo },
  { battleStyle: 2, player1: new PlayerInfo, player2: new PlayerInfo },
  { battleStyle: 3, player1: new PlayerInfo, player2: new PlayerInfo }
];

const battleRoom: RoomType[] = [];



// 定数
const password: string = '11111';


io.on("connection", (socket) => {

  // パスワード受信
  socket.on( 'sendPassword', ( inputPassword: string ) => {
    if ( inputPassword === password ) {
      io.emit( 'correctPassword' );
    } else {
      io.emit( 'incorrectPassword' );
    }
  });

  // 対戦相手を探す
  socket.on( 'findOpponent', ( party: Pokemon[], battleStyle: number ) => {

    for ( const room of waitingRoom ) {
      if ( room.battleStyle !== battleStyle ) {
        continue;
      }

      // 待機部屋の情報更新
      if ( room.player1.socketID === '' ) {
        room.player1.socketID = socket.id;
        room.player1.party = party;
      } else {
        room.player2.socketID = socket.id;
        room.player2.party = party;

        io.to( room.player1.socketID ).emit( 'selectPokemon', room.player2.party );
        io.to( room.player2.socketID ).emit( 'selectPokemon', room.player1.party );

        // バトル部屋へ移動
        battleRoom.push( room );
        room.player1 = new PlayerInfo;
        room.player2 = new PlayerInfo;
      }
    }
  });

  // 選出受信
  socket.on( 'decideOrder', ( order: number[] ) => {

    for ( const room of battleRoom ) {
      if ( room.player1.socketID === socket.id ) {
        room.player1.order = order;
      }
      if ( room.player2.socketID === socket.id ) {
        room.player2.order = order;
      }
      if ( room.player1.order.length !== 0 && room.player2.order.length !== 0 ) {
        io.to( room.player1.socketID ).emit( 'sendOrder', room.player1.order, room.player2.order );
        io.to( room.player2.socketID ).emit( 'sendOrder', room.player2.order, room.player1.order );
      }
    }
  });
});

