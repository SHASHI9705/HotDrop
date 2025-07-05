import express, { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
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

// GET /partner/items?partnerId=... - get all items for a partner
//@ts-ignore
app.get("/partner/items", async (req, res) => {
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

// GET /partners-with-items - get all partners with their items

app.get("/partners-with-items", async (req, res) => {
  try {
    const partners = await prismaClient.partner.findMany({
      include: {
        items: true,
      },
    });
    // Map to frontend format
    const result = partners.map((partner) => ({
      name: partner.shopname,
      image: "/logo.png", // You can update this if you have a real image field
      rating: 4.5, // Placeholder, update if you have ratings
      ratingsCount: partner.items.length, // Example: number of items as ratings
      items: partner.items.map((item) => ({ name: item.name })),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch partners with items" });
  }
});

// GET /partner/burger-items?shopname=... - get all burger items for a partner
//@ts-ignore
app.get("/partner/burger-items", async (req, res) => {
  const { shopname } = req.query;
  if (!shopname || typeof shopname !== "string") {
    return res.status(400).json({ error: "shopname is required" });
  }
  try {
    const partner = await prismaClient.partner.findUnique({
      where: { shopname },
      include: { items: true },
    });
    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }
    // Filter items containing 'burger' (case-insensitive)
    const burgerItems = partner.items.filter((item) =>
      item.name.toLowerCase().includes("burger")
    ).map((item) => ({
      name: item.name,
      price: item.price,
      image: item.image, // Only the filename, not the path
      available: item.available,
    }));
    res.json({
      shop: {
        name: partner.shopname,
        image: "/logo.png", // Update if you have a real image field
        rating: 4.5, // Placeholder
        ratingsCount: partner.items.length,
      },
      items: burgerItems,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch burger items" });
  }
});

// PATCH /partner/item/:itemId/availability - toggle item availability
//@ts-ignore
app.patch("/partner/item/:itemId/availability", async (req, res) => {
  const { itemId } = req.params;
  if (!itemId) {
    return res.status(400).json({ error: "itemId is required" });
  }
  try {
    // Find current availability
    const item = await prismaClient.item.findUnique({ where: { id: itemId } });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    const updated = await prismaClient.item.update({
      where: { id: itemId },
      data: { available: !item.available },
    });
    res.status(200).json({ item: updated });
  } catch (e) {
    res.status(500).json({ error: "Failed to toggle availability" });
  }
});

// DELETE /partner/item/:itemId - delete an item
//@ts-ignore
app.delete("/partner/item/:itemId", async (req, res) => {
  const { itemId } = req.params;
  if (!itemId) {
    return res.status(400).json({ error: "itemId is required" });
  }
  try {
    const deleted = await prismaClient.item.delete({ where: { id: itemId } });
    res.status(200).json({ success: true, deleted });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete item", details: String(e) });
  }
});

app.listen(3001);

