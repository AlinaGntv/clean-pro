import { Router, Request, Response } from "express";
import prisma from "../prisma.js";
import { leadSchema, leadStatusSchema } from "../schema.js";
import { authMiddleware, AuthRequest } from "../auth.js";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const lead = await prisma.lead.create({ data: parsed.data });
  res.status(201).json(lead);
});

router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { search, status, sort, order } = req.query;

  const where: Record<string, unknown> = {};
  if (status && status !== "all") {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { name: { contains: String(search) } },
      { phone: { contains: String(search) } },
      { telegram: { contains: String(search) } },
      { whatsapp: { contains: String(search) } },
    ];
  }

  const orderBy: Record<string, string> = {};
  const sortField = String(sort || "createdAt");
  const sortOrder = order === "asc" ? "asc" : "desc";
  orderBy[sortField] = sortOrder;

  const leads = await prisma.lead.findMany({ where, orderBy });
  res.json(leads);
});

router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await prisma.lead.findUnique({ where: { id: Number(req.params.id) } });
  if (!lead) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(lead);
});

router.patch("/:id/status", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = leadStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  const lead = await prisma.lead.update({
    where: { id: Number(req.params.id) },
    data: { status: parsed.data.status },
  });
  res.json(lead);
});

router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  await prisma.lead.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default router;
