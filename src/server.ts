import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

interface ServerToClientEvents {
  correctPassword: () => void;
  incorrectPassword: () => void;
  selectPokemon: ( party: Pokemon[], host: boolean ) => void;
  sendOrder: ( myOrder: number[], opponentOrder: number[] ) => void;
  returnCommand: ( myCommand: Command[], opponentCommand: Command[], randomList: number[] ) => void;
  returnExtraCommand: ( myCommand: ExtraCommand, opponentCommand: ExtraCommand, randomList: number[] ) => void;
}

interface ClientToServerEvents {
  sendPassword: ( inputPassword: string ) => void;
  findOpponent: ( myParty: Pokemon[], battleStyle: number ) => void;
  decideOrder: ( order: number[] ) => void;
  sendCommand: ( myCommand: Command[] ) => void;
  sendExtraCommand: ( myCommand: ExtraCommand ) => void;
}


const app = express();
const httpServer = createServer( app );
const PORT = process.env.PORT || 2000;
const io = new Server<ClientToServerEvents, ServerToClientEvents>( httpServer );

// 公開フォルダの指定
app.use( express.static( __dirname + '/public') );

// サーバーを3000番ポートで起動
httpServer.listen( PORT, () => {
  console.log( `Server start on port ${PORT}.` );
});



class PlayerInfo {
  socketID: string = '';
  party: Pokemon[] = [];
}

class ExtraCommand {
  command: { party: number, battle: number }[] = [];
  isCommand: { host: boolean, guest: boolean } = { host: false, guest: false };
}

class BattlePlayerInfo {
  socketID: string = '';
  battleOrder: number[] = [];
  command: Command[] = [];
  extraCommand = new ExtraCommand();
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
  battleStyle: number;
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

        io.to( room.player1.socketID ).emit( 'selectPokemon', room.player2.party, true );
        io.to( room.player2.socketID ).emit( 'selectPokemon', room.player1.party, false );

        // バトル部屋へ移動
        const player1 = new BattlePlayerInfo;
        const player2 = new BattlePlayerInfo;
        player1.socketID = room.player1.socketID;
        player2.socketID = room.player2.socketID;

        battleRoom.push( { battleStyle: room.battleStyle, player1: player1, player2: player2 } );

        // 待機部屋の情報の削除
        room.player1 = new PlayerInfo;
        room.player2 = new PlayerInfo;
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

  // コマンド受信
  socket.on( 'sendCommand', ( command: Command[] ) => {

    for ( const room of battleRoom ) {
      if ( room.player1.socketID === socket.id ) {
        room.player1.command = command;
      }
      if ( room.player2.socketID === socket.id ) {
        room.player2.command = command;
      }

      // コマンド送信
      if ( room.player1.command.length !== 0 && room.player2.command.length !== 0 ) {
        const randomList: number[] = []
        for ( let i = 0; i < 1000; i++ ) {
          randomList.push( Math.floor( Math.random() * 100 ) )
        }
        io.to( room.player1.socketID ).emit( 'returnCommand', room.player1.command, room.player2.command, randomList );
        io.to( room.player2.socketID ).emit( 'returnCommand', room.player2.command, room.player1.command, randomList );

        // コマンドリセット
        room.player1.command = [];
        room.player2.command = [];
      }


    }
  });

  // 途中交代コマンド受信
  socket.on( 'sendExtraCommand', ( command: ExtraCommand ) => {

    const generateRandom = (): number[] => {
      const randomList: number[] = [];
      for ( let i = 0; i < 1000; i++ ) {
        randomList.push( Math.floor( Math.random() * 100 ) )
      }
      return randomList;
    }

    for ( const room of battleRoom ) {
      if ( room.player1.socketID === socket.id ) {
        room.player1.extraCommand = command;

        if ( !command.isCommand.guest ) {
          io.to( room.player1.socketID ).emit( 'returnExtraCommand', room.player1.extraCommand, room.player2.extraCommand, generateRandom() );
          io.to( room.player2.socketID ).emit( 'returnExtraCommand', room.player2.extraCommand, room.player1.extraCommand, generateRandom() );
          room.player1.extraCommand = new ExtraCommand();
          room.player2.extraCommand = new ExtraCommand();
          return;
        }
      }

      if ( room.player2.socketID === socket.id ) {
        room.player2.extraCommand = command;

        if ( !command.isCommand.host ) {
          io.to( room.player1.socketID ).emit( 'returnExtraCommand', room.player1.extraCommand, room.player2.extraCommand, generateRandom() );
          io.to( room.player2.socketID ).emit( 'returnExtraCommand', room.player2.extraCommand, room.player1.extraCommand, generateRandom() );
          room.player1.extraCommand = new ExtraCommand();
          room.player2.extraCommand = new ExtraCommand();
          return;
        }
      }

      // コマンド送信
      if ( room.player1.extraCommand.command.length > 0 && room.player2.extraCommand.command.length > 0 ) {

        io.to( room.player1.socketID ).emit( 'returnExtraCommand', room.player1.extraCommand, room.player2.extraCommand, generateRandom() );
        io.to( room.player2.socketID ).emit( 'returnExtraCommand', room.player2.extraCommand, room.player1.extraCommand, generateRandom() );

        // コマンドリセット
        room.player1.extraCommand = new ExtraCommand();
        room.player2.extraCommand = new ExtraCommand();
      }
    }
  });
});

