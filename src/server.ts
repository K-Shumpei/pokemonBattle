import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

interface ServerToClientEvents {
  correctPassword: () => void;
  incorrectPassword: () => void;
}

interface ClientToServerEvents {
  sendPassword: ( inputPassword: string ) => void;
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



// 定数
const password: string = '11111';


io.on("connection", (socket) => {

  // パスワード受信
  socket.on( 'sendPassword', ( inputPassword ) => {
    if ( inputPassword === password ) {
      socket.emit( 'correctPassword' );
    } else {
      socket.emit( 'incorrectPassword' );
    }
  });

});

