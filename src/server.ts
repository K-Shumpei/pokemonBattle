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
    return this._party;
  }
}

class BattlePlayerInfo {
  _socketID: string;
  _battleOrder: number[]

  constructor() {
    this._socketID = '';
    this._battleOrder = []
  }

  set socketID( socketID: string ) {
    this._socketID = socketID;
  }
  set battleOrder( battleOrder: number[] ) {
    this._battleOrder = battleOrder;
  }

  get socketID(): string {
    return this._socketID;
  }
  get battleOrder(): number[] {
    return this._battleOrder;
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

type BattleRoomType = {
  player1: BattlePlayerInfo;
  player2: BattlePlayerInfo;
}

const battleRoom: BattleRoomType[] = [];



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
        const player1 = new BattlePlayerInfo;
        const player2 = new BattlePlayerInfo;
        player1.socketID = room.player1.socketID;
        player2.socketID = room.player2.socketID;

        battleRoom.push( { player1: player1, player2: player2 } );
      }
    }
  });

  // 選出受信
  socket.on( 'decideOrder', ( order: number[] ) => {

    // バトル部屋の情報を更新
    for ( const room of battleRoom ) {
      if ( room.player1.socketID === socket.id ) {
        room.player1.battleOrder = order;
      }
      if ( room.player2.socketID === socket.id ) {
        room.player2.battleOrder = order;
      }

      // 選出送信
      if ( room.player1.battleOrder.length !== 0 && room.player2.battleOrder.length !== 0 ) {
        io.to( room.player1.socketID ).emit( 'sendOrder', room.player1.battleOrder, room.player2.battleOrder );
        io.to( room.player2.socketID ).emit( 'sendOrder', room.player2.battleOrder, room.player1.battleOrder );
      }
    }
  });
});

