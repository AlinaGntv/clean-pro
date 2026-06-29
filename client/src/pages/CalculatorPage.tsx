import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { api, type LeadInput } from "@/lib/api";
import { cn } from "@/lib/utils";
import ChatWidget from "@/components/ChatWidget";

const STEPS = ["Тип объекта", "Тип уборки", "Площадь", "Доп. услуги", "Дата"];

const OBJECT_TYPES = [
  { value: "apartment", label: "Квартира", icon: "🏢" },
  { value: "house", label: "Дом", icon: "🏠" },
  { value: "office", label: "Офис", icon: "🏛️" },
] as const;

const CLEANING_TYPES = [
  { value: "maintain", label: "Поддерживающая", desc: "Регулярная уборка" },
  { value: "general", label: "Генеральная", desc: "Глубокая уборка" },
  { value: "post_repair", label: "После ремонта", desc: "Удаление строительной пыли" },
  { value: "post_move", label: "После переезда", desc: "Полная подготовка" },
] as const;

const ADDITIONAL = [
  { value: "windows", label: "Мытьё окон", price: 500 },
  { value: "oven", label: "Чистка духовки", price: 1500 },
  { value: "fridge", label: "Чистка холодильника", price: 1200 },
  { value: "balcony", label: "Балкон", price: 800 },
  { value: "ironing", label: "Глажка", price: 600 },
  { value: "furniture", label: "Химчистка мебели", price: 2000 },
] as const;

const PRICES: Record<string, Record<string, number>> = {
  apartment: { maintain: 80, general: 150, post_repair: 220, post_move: 180 },
  house: { maintain: 90, general: 160, post_repair: 240, post_move: 190 },
  office: { maintain: 70, general: 130, post_repair: 200, post_move: 160 },
};

const DATE_OPTIONS = [
  { value: "today", label: "Сегодня" },
  { value: "tomorrow", label: "Завтра" },
  { value: "custom", label: "Выбрать дату" },
] as const;

const formSchema = z.object({
  name: z.string().min(1, "Введите имя"),
  phone: z.string().min(1, "Введите телефон"),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CalculatorPage() {
  const [step, setStep] = useState(0);
  const [objectType, setObjectType] = useState<string>("");
  const [cleaningType, setCleaningType] = useState<string>("");
  const [area, setArea] = useState([60]);
  const [additional, setAdditional] = useState<string[]>([]);
  const [dateOption, setDateOption] = useState<string>("");
  const [customDate, setCustomDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const calcPrice = () => {
    if (!objectType || !cleaningType) return { min: 0, max: 0 };
    const base = PRICES[objectType]?.[cleaningType] || 0;
    const areaVal = area[0];
    const min = base * areaVal;
    const max = Math.round(min * 1.3);
    return { min, max };
  };

  const { min, max } = calcPrice();

  const toggleAdditional = (val: string) => {
    setAdditional((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  };

  const onSubmit = async (data: FormData) => {
    const payload: LeadInput = {
      name: data.name,
      phone: data.phone,
      whatsapp: data.whatsapp,
      telegram: data.telegram,
      comment: data.comment,
      objectType,
      cleaningType,
      area: area[0],
      additional: additional.join(","),
      preferredDate: dateOption === "custom" ? customDate : dateOption,
      priceMin: min,
      priceMax: max,
    };
    await api.createLead(payload);
    setSubmitted(true);
  };

  const canNext = () => {
    if (step === 0) return !!objectType;
    if (step === 1) return !!cleaningType;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return !!dateOption;
    return false;
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Заявка отправлена!</h2>
            <p className="mt-3 text-muted-foreground">Менеджер свяжется с вами в ближайшее время для уточнения деталей.</p>
            <Link to="/" className="mt-6 inline-block">
              <Button>Вернуться на главную</Button>
            </Link>
          </CardContent>
        </Card>
        <ChatWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> На главную
        </Link>

        <div className="mb-8">
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={cn("h-1.5 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-muted")} />
                <p className={cn("mt-2 text-xs font-medium", i <= step ? "text-primary" : "text-muted-foreground")}>
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{STEPS[step]}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {step === 0 && (
              <div className="grid grid-cols-3 gap-4">
                {OBJECT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setObjectType(t.value)}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all hover:border-primary/50",
                      objectType === t.value ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <span className="text-3xl">{t.icon}</span>
                    <span className="font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                {CLEANING_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setCleaningType(t.value)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border-2 p-5 text-left transition-all hover:border-primary/50",
                      cleaningType === t.value ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <span className="font-semibold">{t.label}</span>
                    <span className="text-sm text-muted-foreground">{t.desc}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">{area[0]} м²</span>
                </div>
                <Slider value={area} onValueChange={setArea} min={20} max={300} step={5} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>20 м²</span>
                  <span>300 м²</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 gap-4">
                {ADDITIONAL.map((a) => (
                  <label
                    key={a.value}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all hover:border-primary/50",
                      additional.includes(a.value) ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <Checkbox checked={additional.includes(a.value)} onCheckedChange={() => toggleAdditional(a.value)} />
                    <div>
                      <span className="font-medium">{a.label}</span>
                      <span className="block text-xs text-muted-foreground">+{a.price} ₽</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                {DATE_OPTIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDateOption(d.value)}
                    className={cn(
                      "w-full rounded-lg border-2 p-4 text-left font-medium transition-all hover:border-primary/50",
                      dateOption === d.value ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
                {dateOption === "custom" && (
                  <Input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} className="mt-2" />
                )}

                {min > 0 && (
                  <div className="mt-6 rounded-lg bg-primary/5 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Предварительная стоимость:</p>
                    <p className="mt-1 text-3xl font-bold text-primary">
                      от {min.toLocaleString("ru-RU")} до {max.toLocaleString("ru-RU")} ₽
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">Точную стоимость подтвердит менеджер.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="name">Имя *</Label>
                    <Input id="name" {...register("name")} placeholder="Ваше имя" />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input id="phone" {...register("phone")} placeholder="+7 (___) ___-__-__" />
                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input id="whatsapp" {...register("whatsapp")} placeholder="+7 (___) ___-__-__" />
                    </div>
                    <div>
                      <Label htmlFor="telegram">Telegram</Label>
                      <Input id="telegram" {...register("telegram")} placeholder="@username" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment">Комментарий</Label>
                    <Input id="comment" {...register("comment")} placeholder="Особые пожелания..." />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Получить точный расчёт
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        {step < 4 && (
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Назад
            </Button>
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
              Далее <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <ChatWidget />
    </div>
  );
}
