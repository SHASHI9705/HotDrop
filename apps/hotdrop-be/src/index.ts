import express, { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: ["http://localhost:3000","https://www.hotdrop.tech"], credentials: true }));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "../../../packages/db/images")));

// S3 setup
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});
// Multer config for S3 upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
        shopimage: true, // include shopimage relation
      },
    });
    // Map to frontend format
    const result = partners.map((partner: any) => ({
      id: partner.id,
      name: partner.shopname,
      image: partner.shopimage && partner.shopimage.url ? partner.shopimage.url : "/logo.png", // use real shop image if exists
      rating: 4.5, // Placeholder, update if you have ratings
      ratingsCount: partner.items.length, // Example: number of items as ratings
      items: partner.items.map((item :any ) => ({
        name: item.name,
        price: item.price,
        image: item.image,
        available: item.available
      })),
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
    const burgerItems = partner.items.filter((item :any) =>
      item.name.toLowerCase().includes("burger")
    ).map((item :any) => ({
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

// POST /partner/items - add a new item for a partner (with image upload)
//@ts-ignore
app.post("/partner/items", upload.single("image"), async (req, res) => {
  const { name, price, partnerId } = req.body;
  if (!name || !price || !partnerId || !req.file) {
    return res.status(400).json({ error: "Name, price, partnerId, and image are required" });
  }
  try {
    if (!process.env.AWS_S3_BUCKET) {
      throw new Error("AWS_S3_BUCKET is not set in environment variables");
    }
    const key = `items/${Date.now()}-${req.file.originalname}`;
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
      // Removed ACL: "public-read" as bucket policy handles public access
    }));
    const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    const item = await prismaClient.item.create({
      data: {
        name,
        price: parseFloat(price),
        image: imageUrl,
        partnerId,
        available: true,
      },
    });
    res.status(201).json({ item });
  } catch (e) {
    res.status(500).json({ error: "Failed to add item", details: String(e) });
  }
});

// PUT /partner/update - update shop name and category for a partner
//@ts-ignore
app.put("/partner/update", async (req, res) => {
  const { id, shopname, shopcategory } = req.body;
  if (!id || !shopname || !shopcategory) {
    return res.status(400).json({ error: "id, shopname, and shopcategory are required" });
  }
  try {
    // Check if shopname is being changed and is unique
    const existing = await prismaClient.partner.findFirst({
      where: { shopname, NOT: { id } }
    });
    if (existing) {
      return res.status(409).json({ error: "Shop name already exists" });
    }
    const updated = await prismaClient.partner.update({
      where: { id },
      data: { shopname, shopcategory },
    });
    res.status(200).json({ partner: updated });
  } catch (e) {
    res.status(500).json({ error: "Failed to update partner", details: String(e) });
  }
});

// POST /partner/shopimage - upload or update shop image for a partner
//@ts-ignore
app.post("/partner/shopimage", upload.single("image"), async (req, res) => {
  const { partnerId } = req.body;
  if (!partnerId || !req.file) {
    return res.status(400).json({ error: "partnerId and image are required" });
  }
  try {
    if (!process.env.AWS_S3_BUCKET) {
      throw new Error("AWS_S3_BUCKET is not set in environment variables");
    }
    // Sanitize filename: replace spaces with dashes
    const sanitizedFilename = req.file.originalname.replace(/\s+/g, '-');
    const key = `shopimages/${Date.now()}-${sanitizedFilename}`;
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
      // No ACL needed, bucket policy handles public access
    }));
    const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    // Check if shopimage already exists for this partner
    const existing = await prismaClient.shopimage.findUnique({ where: { partnerId } });
    let shopimage;
    if (existing) {
      shopimage = await prismaClient.shopimage.update({
        where: { partnerId },
        data: { url: imageUrl }
      });
    } else {
      shopimage = await prismaClient.shopimage.create({
        data: { url: imageUrl, partner: { connect: { id: partnerId } } }
      });
    }
    res.status(200).json({ url: shopimage.url });
  } catch (e) {
    res.status(500).json({ error: "Failed to upload shop image", details: String(e) });
  }
});

// GET /partner?id=... - get a single partner by id
//@ts-ignore
app.get("/partner", async (req, res) => {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "id is required" });
  }
  try {
    const partner = await prismaClient.partner.findUnique({
      where: { id },
      include: { shopimage: true }
    });
    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }
    res.status(200).json({ partner });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch partner", details: String(e) });
  }
});

// POST /order - create a new order when user checks out
//@ts-ignore
app.post("/order", async (req, res) => {
  console.log("[POST /order] Raw req.body:", req.body);
  const { userId, partnerId, items, shopName, price } = req.body;
  console.log("[POST /order] Incoming data:", { userId, partnerId, items, shopName, price });
  if (!userId || !partnerId || !items || !shopName || !price) {
    console.error("[POST /order] Missing required fields", { userId, partnerId, items, shopName, price });
    return res.status(400).json({ error: "Missing required fields", rawBody: req.body });
  }
  try {
    // Check if user exists
    const user = await prismaClient.signup.findUnique({ where: { id: userId } });
    if (!user) {
      console.error(`[POST /order] User not found: ${userId}`);
      return res.status(404).json({ error: "User not found" });
    }
    // Check if partner exists
    const partner = await prismaClient.partner.findUnique({ where: { id: partnerId } });
    if (!partner) {
      console.error(`[POST /order] Partner not found: ${partnerId}`);
      return res.status(404).json({ error: "Partner not found" });
    }
    const order = await prismaClient.order.create({
      data: {
        userId,
        partnerId,
        items: typeof items === "string" ? items : JSON.stringify(items),
        shopName,
        price: parseFloat(price),
        dateTime: new Date(),
        status: false // order not yet taken by default
      }
    });
    console.log("[POST /order] Order created successfully", order);
    res.status(201).json({ order });
  } catch (e) {
    console.error("[POST /order] Failed to create order", e);
    res.status(500).json({ error: "Failed to create order", details: String(e) });
  }
});

// PATCH /order/:orderId/delivered - mark order as delivered
//@ts-ignore
app.patch("/order/:orderId/delivered", async (req, res) => {
  const { orderId } = req.params;
  try {
    const updated = await prismaClient.order.update({
      where: { id: orderId },
      data: { status: true },
    });
    res.status(200).json({ order: updated });
  } catch (e) {
    res.status(500).json({ error: "Failed to update order status", details: String(e) });
  }
});

// GET /orders?userId=...&partnerId=... - get all orders for a user or partner
//@ts-ignore
app.get("/orders", async (req, res) => {
  const { userId, partnerId } = req.query;
  if (!userId && !partnerId) {
    return res.status(400).json({ error: "userId or partnerId is required" });
  }
  try {
    let where = {};
    if (userId) where = { ...where, userId };
    if (partnerId) where = { ...where, partnerId };
    const orders = await prismaClient.order.findMany({
      where,
      orderBy: { dateTime: "desc" }
    });
    res.status(200).json({ orders });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch orders", details: String(e) });
  }
});

// GET /user?email=... - fetch user by email
//@ts-ignore
app.get("/user", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    const user = await prismaClient.signup.findUnique({ where: { email: String(email) } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Do not return password
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//@ts-ignore
app.post("/partner/verification", async (req, res) => {
  const { name, aadhaarNumber, shopAddress, fssaiNumber, partnerId } = req.body;
  if (!name || !aadhaarNumber || !shopAddress || !fssaiNumber || !partnerId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const verification = await prismaClient.verification.create({
      data: {
        name,
        aadhaarNumber,
        shopAddress,
        fssaiNumber,
        partner: { connect: { id: partnerId } },
        verified: false,
      },
    });
    return res.status(201).json({ verification });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create verification", details: String(error) });
  }
});

// GET /partner/verification/status?partnerId=... - get verification status for a partner
//@ts-ignore
app.get("/partner/verification/status", async (req, res) => {
  const { partnerId } = req.query;
  if (!partnerId || typeof partnerId !== "string") {
    return res.status(400).json({ verified: false });
  }
  try {
    const verification = await prismaClient.verification.findFirst({
      where: { partnerId },
      orderBy: { id: "desc" }, // get latest if multiple
    });
    if (!verification) return res.json({ verified: false });
    return res.json({ verified: verification.verified });
  } catch (e) {
    return res.status(500).json({ verified: false });
  }
});

app.listen(3001, "0.0.0.0");

