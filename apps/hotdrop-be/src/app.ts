import { exec } from "child_process";
import express, {Express} from "express";
import dotenv from "dotenv";
import path from "path";
import { corsMiddleware } from "./middleware/cors.js";
import { __dirname } from "./utils/__dirname.js";
import authRoutes from "./routes/authRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import cron from "node-cron";
import fetch from "node-fetch";
dotenv.config();



const app: Express = express();

app.use(corsMiddleware);
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "../../../packages/db/images")));

//@ts-ignore
app.get("/", (req, res) => res.send("hello"));





// ...after app.use and other middlewares...
//@ts-ignore
app.post("/deploy", (req, res) => {
  const secret = req.query.secret;

  if (secret !== process.env.DEPLOY_SECRET) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  // Respond to GitHub immediately to prevent webhook timeout
  res.status(200).send("✅ Deployment started.");

  // Run the deploy script in the background
  exec("sh /home/ubuntu/scripts/deploy.sh", (error, stdout, stderr) => {
    if (error) {
      console.error("🚨 Deploy error:", error);
    } else {
      console.log("✅ Deploy output:\n", stdout);
    }
  });
});




// --- Scheduled Promo Push Notification (every 12 hours) ---
cron.schedule("0 6,9,12,15,18,21 * * *", async () => {
  try {
    const backendUrl = process.env.BACKEND_API_URL;
    const res = await fetch(`${backendUrl}/user/send-promo-push`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      console.log("[CRON] Promo push sent to eligible users.");
    } else {
      const text = await res.text();
      console.error("[CRON] Failed to send promo push:", text);
    }
  } catch (err) {
    console.error("[CRON] Error sending promo push:", err);
  }
});

app.use("/auth", authRoutes);
app.use("/partner", partnerRoutes);
app.use(itemRoutes); // Mount at root for /partners-with-items
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.use("/feedbacks", feedbackRoutes);


export default app;


