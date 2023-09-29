import express from "express";
import prisma from "./lib/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "secretkey12345";

const router = express.Router();

// signup owner - name , email and password
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingOwner = await prisma.owner.findUnique({
      where: {
        email: email,
      },
    });

    if (existingOwner) {
      return res
        .status(409)
        .json({ status: 409, message: "Owner already exists" });
    }

    const hashePassword = await bcrypt.hash(password, 10);

    const newOwner = await prisma.owner.create({
      data: {
        name: name,
        email: email,
        password: hashePassword
      },
    });

    res
      .status(201)
      .json({ status: 201, message: "Owner created successFully", owners: newOwner});
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong",
      error: error.message,
    });
  }
});



router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the owner
      const existingOwner = await prisma.owner.findUnique({
        where: {
          email: email,
        },
      });
  
      if (!existingOwner) {
        return res.status(404).json({ status: 404, message: "Owner not found" });
      }
  
      // Check if the password is correct
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingOwner.password
      );
  
      if (!isPasswordCorrect) {
        return res.status(401).json({ status: 401, message: "Invalid password" });
      }
  
      // Create token
      const token = jwt.sign(
        { id: existingOwner.id, email: existingOwner.email },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
  
      // Send token in response
      res.status(200).json({ message: "Owner logged in successfully", token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  });
  
  export default router;
