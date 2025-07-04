import express, { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello");
});

//@ts-ignore
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const signup = await prismaClient.signup.create({
            data: { name, email, password: hashedPassword }
        });
        // Generate JWT token
        const token = jwt.sign(
            { id: signup.id, email: signup.email, name: signup.name },
            process.env.JWT_SECRET || "default_secret"
        );
        res.status(201).json({ signup, token });
    } catch (e: any) {
        if (e.code === 'P2002') {
            return res.status(409).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});

//@ts-ignore
app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const signup = await prismaClient.signup.findUnique({
            where: { email }
        });
        if (!signup) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, signup.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = jwt.sign(
            { id: signup.id, email: signup.email, name: signup.name },
            process.env.JWT_SECRET || "default_secret"
        );
        res.status(200).json({ signup, token });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3001);
