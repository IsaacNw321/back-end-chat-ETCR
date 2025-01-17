import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { Server as SocketServer } from 'socket.io';
import chatRoutes from './routes/chat.routes.js'
import userRoutes from './routes/user.routes.js'
import messageRoutes from './routes/messages.routes.js'
import http from 'http'
const app = express();
const server = http.createServer(app)
const io  = new SocketServer(server, {
  cors : {
    origin : 'http://localhost:5173'
  }
})
const PORT = 4000;
app.use(cors())
app.use(morgan("dev"))
app.use(express.json());
app.use("/api", userRoutes)
app.use("/api", chatRoutes)
io.on('connection', (socket) => {
  console.log(socket.id)
  console.log(`A user is connected`)
  socket.on('message', (message) => {
    socket.broadcast.emit('message', {
      body : message,
      from : socket.id
    })
  })
})

server.listen(PORT, () => {
  console.log(`Connected to ${PORT}`)
})