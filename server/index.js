import express  from "express";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3500;
const app = express();
const expressServer = app.listen(PORT, ()=>{
  console.log(`listening in port: ${PORT}`);
});
const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"],
  },
});

io.on("connection", (socket) => {

  socket.emit('message','Welcome to chat');

  socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} connected`)

  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
  });

  socket.on('disconnect', ()=>{
    socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} disconnected`)
  });

  socket.on('activity', (name)=>{
    socket.broadcast.emit('activity', name)
  })
});

