
import express from 'express'
import prisma from './lib/index.js';
import bcrypt from 'bcrypt'


const router = express.Router();

router.post('/signup', async (req, res) => {
    const {name, email, password} = req.body

    try {
        
        const existingOwner = await prisma.owner.findUnique({
            where: {
                email: email,
            }
        })

        if(existingOwner) {
            return res.status(409).json({status: 409, message: "Owner already exists"})
        }

        const hashePassword = await bcrypt.hash(password, 10)

        const newOwner = await prisma.owner.create({
            data: {
                name: name,
                email: email,
                password: hashePassword
            }
        })

        res.status(201).json({status: 201, message: "Owner created successFully", newOwner})

    } catch (error) {
        res.status(500).json({status: 500, message: "Something went wrong", error: error.message})
    }
});

export default router