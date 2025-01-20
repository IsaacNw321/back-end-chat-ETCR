import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { Server as SocketServer } from 'socket.io';
import chatRoutes from './routes/chat.routes.js'
import userRoutes from './routes/user.routes.js'
import http from 'http'
import { SERVER_PORT, FRONTEND_URL } from './config.js';
const app = express();
const server = http.createServer(app)
const io  = new SocketServer(server, {
  cors : {
    origin : FRONTEND_URL
  }
})
const PORT = SERVER_PORT || 3000; 
app.use(cors())
app.use(morgan("dev"))
app.use(express.json());
app.get("/", (req,res) => {
  res.send("Esta es la api del Chat")
})
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