import { Router } from "express";
import { prisma } from "../db.js";
import bcrypt from "bcrypt";

const router = Router();

router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

router.post('/users', async (req, res) => {
  try {
    if (req.body === undefined) {
      console.log("No data received");
      return res.status(400).json({ error: 'No data received' });
    }

    const { alias, email, password, age } = req.body;

    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        userName: alias,
        email,
        password: hashedPassword, 
        age,
        role: 'USER',
      },
    });

    res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

router.get(`/users/:id`, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(req.params.id, 10), 
    },
  });
  user
    ? res.status(200).json(user)
    : res.status(404).json({ message: "Could not find user" });
});

router.get(`/users`, async (req, res) => {
  const { email, alias } = req.body;
  console.log(email, alias);
  const user = await prisma.user.findUnique({
    where: {
      email: email,
      userName: alias,
    },
  });
  user
    ? res.status(200).json(user)
    : res.status(404).json({ message: "Could not find user" });
});

export default router;