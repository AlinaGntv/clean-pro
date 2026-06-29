import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const leadSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),
  comment: z.string().optional(),
  objectType: z.enum(["apartment", "house", "office"]),
  cleaningType: z.enum(["maintain", "general", "post_repair", "post_move"]),
  area: z.number().min(20).max(300),
  additional: z.string().optional(),
  preferredDate: z.string(),
  priceMin: z.number(),
  priceMax: z.number(),
});

export const leadStatusSchema = z.object({
  status: z.enum(["new", "in_progress", "completed"]),
});

export const settingSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(500),
  context: z.array(z.object({ role: z.string(), content: z.string() })).optional(),
});
