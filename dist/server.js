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
const roomInfo = [new PlayerInfo, new PlayerInfo];
// 定数
const password = '11111';
io.on("connection", (socket) => {
    // パスワード受信
    socket.on('sendPassword', (inputPassword) => {
        if (inputPassword === password) {
            socket.emit('correctPassword');
        }
        else {
            socket.emit('incorrectPassword');
        }
    });
    // 対戦相手を探す
    socket.on('findOpponent', (party) => {
        for (const player of roomInfo) {
            if (player.socketID === '') {
                player.socketID = socket.id;
                player.party = party;
                break;
            }
        }
        if (roomInfo[0].socketID !== '' && roomInfo[1].socketID !== '') {
            socket.to(roomInfo[0].socketID).emit('selectPokemon', roomInfo[1].party);
            socket.to(roomInfo[1].socketID).emit('selectPokemon', roomInfo[0].party);
        }
    });
});
