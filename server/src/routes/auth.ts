import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import { loginSchema } from "../schema.js";
import { authMiddleware, AuthRequest, generateToken } from "../auth.js";

const router = Router();

router.post("/login", async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = generateToken(user.id);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

router.post("/logout", (_req: AuthRequest, res: Response): void => {
  res.clearCookie("token");
  res.json({ ok: true });
});

router.get("/me", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! }, select: { id: true, email: true, name: true } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

export default router;
