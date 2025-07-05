import express, { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import multer from "multer";
import path from "path";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Set up multer storage for images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../../packages/db/images"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Serve static images
app.use("/images", express.static(path.join(__dirname, "../../../packages/db/images")));

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

//@ts-ignore
app.post("/partner/signup", async (req, res) => {
    const { shopname, shopcategory, password } = req.body;
    if (!shopname || !shopcategory || !password) {
        return res.status(400).json({ error: "Shop name, shop category, and password are required" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const partner = await prismaClient.partner.create({
            data: { shopname, shopcategory, password: hashedPassword }
        });
        res.status(201).json({ partner });
    } catch (e: any) {
        if (e.code === 'P2002') {
            return res.status(409).json({ error: "Shop name already exists" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});

//@ts-ignore
app.post("/partner/signin", async (req, res) => {
    const { shopname, password } = req.body;
    if (!shopname || !password) {
        return res.status(400).json({ error: "Shop name and password are required" });
    }
    try {
        const partner = await prismaClient.partner.findUnique({
            where: { shopname }
        });
        if (!partner) {
            return res.status(401).json({ error: "Invalid shop name or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, partner.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid shop name or password" });
        }
        res.status(200).json({ partner });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
});

//@ts-ignore
app.post("/partner/items", upload.single("image"), async (req: Request, res: Response) => {
    try {
        const { name, price, partnerId } = req.body;
        if (!name || !price || !req.file || !partnerId) {
            return res.status(400).json({ error: "Name, price, image, and partnerId are required" });
        }
        const imagePath = `/images/${req.file.filename}`;
        const item = await prismaClient.item.create({
            data: {
                name,
                price: parseFloat(price),
                image: imagePath,
                available: true,
                partnerId
            }
        });
        res.status(201).json({ item });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
});


// PUT /partner/items/:id/availability - update item availability by id
//@ts-ignore
app.put("/partner/items/:id/availability", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { available } = req.body;
    if (typeof available !== "boolean") {
        return res.status(400).json({ error: "'available' boolean is required" });
    }
    try {
        const item = await prismaClient.item.update({
            where: { id },
            data: { available },
        });
        res.status(200).json({ item });
    } catch (e) {
        res.status(500).json({ error: "Failed to update availability" });
    }
});

// DELETE /partner/items/:id - delete item by id
app.delete("/partner/items/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prismaClient.item.delete({ where: { id } });
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Failed to delete item" });
    }
});

// GET /partner/items?partnerId=... - get all items for a partner
//@ts-ignore
app.get("/partner/items", async (req: Request, res: Response) => {
    const { partnerId } = req.query;
    if (!partnerId || typeof partnerId !== "string") {
        return res.status(400).json({ error: "partnerId is required" });
    }
    try {
        const items = await prismaClient.item.findMany({ where: { partnerId } });
        res.status(200).json({ items });
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch items" });
    }
});

// PUT /user/update - update user name and email
//@ts-ignore
app.put("/user/update", async (req, res) => {
    const { name, email, oldEmail } = req.body;
    if (!name || !email || !oldEmail) {
        return res.status(400).json({ error: "Name, email, and oldEmail are required" });
    }
    try {
        // If email is changed, check for uniqueness
        if (email !== oldEmail) {
            const existing = await prismaClient.signup.findUnique({ where: { email } });
            if (existing) {
                return res.status(409).json({ error: "Email already exists" });
            }
        }
        // Update user name and email using oldEmail as identifier
        const updated = await prismaClient.signup.update({
            where: { email: oldEmail },
            data: { name, email },
        });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ user: updated });
    } catch (e) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: "Failed to update user" });
    }
});

app.listen(3001);

