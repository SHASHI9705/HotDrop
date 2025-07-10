import express from "express";
import dotenv from "dotenv";
import path from "path";
import { corsMiddleware } from "./middleware/cors.js";
import { __dirname } from "./utils/__dirname.js";
import authRoutes from "./routes/authRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();


const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "../../../packages/db/images")));

//@ts-ignore
app.get("/", (req, res) => res.send("hello"));

app.use("/auth", authRoutes);
app.use("/partner", partnerRoutes);
app.use(itemRoutes); // Mount at root for /partners-with-items
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

export default app;
