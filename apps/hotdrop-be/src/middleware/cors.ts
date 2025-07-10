import cors from "cors";

export const corsMiddleware = cors({
  origin: ["http://localhost:3000", "https://www.hotdrop.tech"],
  credentials: true,
});
