import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.post('/chats', async (req, res) => {
  try {
    if (req.body === undefined) {
      console.log("No estan llegando los datos");
      return res.status(400).json({ error: 'Request body is missing' });
    }
    
    const { user1, user2 } = req.body;

    const existingChat = await prisma.chat.findUnique({
      where: {
        users: {
          hasEvery: [user1, user2]
        }
      }
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await prisma.chat.create({
      data: {
        users: [user1, user2],
        messages: []
      },
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating chat' });
  }
});


router.get('/chats', async (req, res) => {
  try {
    const chats = await prisma.chat.findMany();
    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving chats' });
  }
});


router.get('/chats/user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userChats = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        chats : {
          include : {
            users : true
          }
        }
      }
    });

    if (userChats && userChats.chats.length > 0) {
      res.status(200).json(userChats.chats);
    } else {
      res.status(404).json({ error: 'No chats found for this user' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving user chats' });
  }
});
router.get("/chat/:firstId/:secondId", async (req, res) => {
  try {
    const { firstId, secondId } = req.params; 

    const existingChat = await prisma.chat.findFirst({
      where: {
        users: {
          hasEvery: [firstId, secondId]
        }
      }
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    } else {
      return res.status(404).json({ error: 'Chat not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error finding chat' });
  }
});


export default router;