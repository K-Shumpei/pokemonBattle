"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 3000;
const io = new socket_io_1.Server(httpServer);
// 公開フォルダの指定
app.use(express_1.default.static(__dirname + '/public'));
// サーバーを3000番ポートで起動
httpServer.listen(PORT, () => {
    console.log(`Server start on port ${PORT}.`);
});
class PlayerInfo {
    constructor() {
        this._socketID = '';
        this._party = [];
    }
    set socketID(socketID) {
        this._socketID = socketID;
    }
    set party(party) {
        this._party = party;
    }
    get socketID() {
        return this._socketID;
    }
    get party() {
        return this._party;
    }
}
class BattlePlayerInfo {
    constructor() {
        this._socketID = '';
        this._battleOrder = [];
    }
    set socketID(socketID) {
        this._socketID = socketID;
    }
    set battleOrder(battleOrder) {
        this._battleOrder = battleOrder;
    }
    get socketID() {
        return this._socketID;
    }
    get battleOrder() {
        return this._battleOrder;
    }
}
const waitingRoom = [
    { battleStyle: 1, player1: new PlayerInfo, player2: new PlayerInfo },
    { battleStyle: 2, player1: new PlayerInfo, player2: new PlayerInfo },
    { battleStyle: 3, player1: new PlayerInfo, player2: new PlayerInfo }
];
const battleRoom = [];
// 定数
const password = '11111';
io.on("connection", (socket) => {
    // パスワード受信
    socket.on('sendPassword', (inputPassword) => {
        if (inputPassword === password) {
            io.emit('correctPassword');
        }
        else {
            io.emit('incorrectPassword');
        }
    });
    // 対戦相手を探す
    socket.on('findOpponent', (party, battleStyle) => {
        for (const room of waitingRoom) {
            if (room.battleStyle !== battleStyle) {
                continue;
            }
            // 待機部屋の情報更新
            if (room.player1.socketID === '') {
                room.player1.socketID = socket.id;
                room.player1.party = party;
            }
            else {
                room.player2.socketID = socket.id;
                room.player2.party = party;
                io.to(room.player1.socketID).emit('selectPokemon', room.player2.party);
                io.to(room.player2.socketID).emit('selectPokemon', room.player1.party);
                // バトル部屋へ移動
                const player1 = new BattlePlayerInfo;
                const player2 = new BattlePlayerInfo;
                player1.socketID = room.player1.socketID;
                player2.socketID = room.player2.socketID;
                battleRoom.push({ player1: player1, player2: player2 });
            }
        }
    });
    // 選出受信
    socket.on('decideOrder', (order) => {
        // バトル部屋の情報を更新
        for (const room of battleRoom) {
            if (room.player1.socketID === socket.id) {
                room.player1.battleOrder = order;
            }
            if (room.player2.socketID === socket.id) {
                room.player2.battleOrder = order;
            }
            // 選出送信
            if (room.player1.battleOrder.length !== 0 && room.player2.battleOrder.length !== 0) {
                io.to(room.player1.socketID).emit('sendOrder', room.player1.battleOrder, room.player2.battleOrder);
                io.to(room.player2.socketID).emit('sendOrder', room.player2.battleOrder, room.player1.battleOrder);
            }
        }
    });
});
