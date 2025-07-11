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


app.use("/auth", authRoutes);
app.use("/partner", partnerRoutes);
app.use(itemRoutes); // Mount at root for /partners-with-items
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);


export default app;


