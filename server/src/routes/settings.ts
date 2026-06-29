import { Router, Response } from "express";
import prisma from "../prisma.js";
import { settingSchema } from "../schema.js";
import { authMiddleware, AuthRequest } from "../auth.js";

const router = Router();

router.get("/", async (_req: AuthRequest, res: Response): Promise<void> => {
  const settings = await prisma.setting.findMany();
  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  res.json(result);
});

router.get("/group/:group", async (_req: AuthRequest, res: Response): Promise<void> => {
  const settings = await prisma.setting.findMany({ where: { group: _req.params.group } });
  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  res.json(result);
});

router.put("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const entries = Object.entries(req.body) as [string, string][];
  for (const [key, value] of entries) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value), group: "general" },
    });
  }
  res.json({ ok: true });
});

router.put("/batch", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = req.body;
  if (!Array.isArray(parsed)) {
    res.status(400).json({ error: "Expected array" });
    return;
  }
  for (const item of parsed) {
    const p = settingSchema.safeParse(item);
    if (p.success) {
      await prisma.setting.upsert({
        where: { key: p.data.key },
        update: { value: p.data.value },
        create: { key: p.data.key, value: p.data.value, group: "general" },
      });
    }
  }
  res.json({ ok: true });
});

export default router;
