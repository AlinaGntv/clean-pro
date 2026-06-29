import { Router, Request, Response } from "express";
import { chatMessageSchema } from "../schema.js";

const router = Router();

const SYSTEM_PROMPT = `Ты — виртуальный помощник клининговой компании CleanPro.
Отвечай кратко, тепло и по делу. Помоги рассчитать стоимость уборки, выбрать услугу и оставить заявку.
Работай на русском языке.

Типы уборок и ориентировочные цены (за м²):
- Поддерживающая уборка — от 80 руб./м²
- Генеральная уборка — от 150 руб./м²
- Уборка после ремонта — от 220 руб./м²
- Уборка после переезда — от 180 руб./м²

Дополнительные услуги:
- Мытьё окон — 500 руб./шт
- Чистка духовки — 1500 руб.
- Чистка холодильника — 1200 руб.
- Балкон — 800 руб.
- Глажка — 600 руб./час
- Химчистка мебели — от 2000 руб.

Работаем ежедневно 8:00–22:00.
Рассчитать точную стоимость и записаться: http://localhost:5173`;

const MAX_CONTEXT = 6;
const SUSPICIOUS = /(<script|javascript:|onerror=|onclick=|DROP\s+TABLE)/i;

let rateHits: Record<string, number[]> = {};
let rateLast: Record<string, number> = {};

function checkRate(ip: string): string | null {
  const now = Date.now();
  if (rateLast[ip] && now - rateLast[ip] < 2000) {
    return "Слишком быстро! Подождите пару секунд.";
  }
  rateHits[ip] = (rateHits[ip] || []).filter((t) => now - t < 60000);
  if (rateHits[ip].length >= 10) {
    return "Превышен лимит сообщений. Попробуйте через минуту.";
  }
  rateHits[ip].push(now);
  rateLast[ip] = now;
  return null;
}

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const rateErr = checkRate(ip);
  if (rateErr) {
    res.status(429).json({ reply: rateErr, rate_limited: true });
    return;
  }

  const parsed = chatMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ reply: "Некорректный запрос." });
    return;
  }

  const { message, context } = parsed.data;

  if (SUSPICIOUS.test(message)) {
    res.json({ reply: "Сообщение не прошло фильтр." });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://polza.ai/api/v1";
  const model = process.env.OPENAI_MODEL || "deepseek/deepseek-v4-flash";

  const ctx = (context || []).slice(-MAX_CONTEXT);
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...ctx,
    { role: "user", content: message },
  ];

  try {
    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, messages, max_tokens: 500, temperature: 0.7 }),
    });

    if (!resp.ok) {
      res.json({ reply: "Извините, временно недоступно. Попробуйте позже." });
      return;
    }

    const data = (await resp.json()) as { choices: { message: { content: string } }[] };
    const reply = data.choices?.[0]?.message?.content || "Не удалось получить ответ.";
    res.json({ reply });
  } catch {
    res.json({ reply: "Извините, временно недоступно. Попробуйте позже." });
  }
});

export default router;
