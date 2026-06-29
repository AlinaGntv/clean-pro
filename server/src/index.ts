import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./prisma.js";
import authRoutes from "./routes/auth.js";
import leadsRoutes from "./routes/leads.js";
import settingsRoutes from "./routes/settings.js";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.VITE_API_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/chat", chatRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

async function main() {
  await prisma.$connect();
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
