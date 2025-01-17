import { Router } from "express";
import {prisma} from "../db.js"
const router = Router();

router.post("/messages", async (req,res) => {
  try {
    const {body, fromId, chatId} = req.body
    const newMessage = prisma.message.create({
      data : {
        body,
        chatId,
        fromId
      }
    })
    newMessage 
      ? res.status(200).json(newMessage)
      : res.status(400).json({message : "Could not create message"})
  } catch (error) {
    console.log(error)
  }
})

router.get("/messages/chat/:chatId", async (req, res)=> {
  try {
    const {chatId} = req.params
    const messagesChat = prisma.message.findMany({
      where : {
        chatId,
      }
    })
    messagesChat
    ? res.status(200).json(messagesChat)
    : res.status(404).json({message : "Could not fin messages"})
  } catch (error) {
    console.log(error)
  }
})

export default router