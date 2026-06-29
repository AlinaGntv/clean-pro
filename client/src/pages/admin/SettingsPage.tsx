import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { Save, CheckCircle } from "lucide-react";

interface PriceField {
  key: string;
  label: string;
  unit?: string;
}

const PRICING_FIELDS: PriceField[] = [
  { key: "price_maintain_per_m2", label: "Поддерживающая уборка", unit: "₽/м²" },
  { key: "price_general_per_m2", label: "Генеральная уборка", unit: "₽/м²" },
  { key: "price_post_repair_per_m2", label: "Уборка после ремонта", unit: "₽/м²" },
  { key: "price_post_move_per_m2", label: "Уборка после переезда", unit: "₽/м²" },
];

const ADDITIONAL_FIELDS: PriceField[] = [
  { key: "price_windows", label: "Мытьё окон", unit: "₽/шт" },
  { key: "price_oven", label: "Чистка духовки", unit: "₽" },
  { key: "price_fridge", label: "Чистка холодильника", unit: "₽" },
  { key: "price_balcony", label: "Балкон", unit: "₽" },
  { key: "price_ironing", label: "Глажка", unit: "₽/час" },
  { key: "price_furniture_cleaning", label: "Химчистка мебели", unit: "₽" },
];

const COMPANY_FIELDS: PriceField[] = [
  { key: "company_name", label: "Название компании" },
  { key: "company_phone", label: "Телефон" },
  { key: "company_email", label: "Email" },
  { key: "company_address", label: "Адрес" },
];

const SURCHARGE_FIELDS: PriceField[] = [
  { key: "surcharge_urgent", label: "Наценка за срочность", unit: "%" },
  { key: "surcharge_weekend", label: "Наценка за выходные", unit: "%" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const items = Object.entries(settings).map(([key, value]) => ({ key, value }));
    await api.updateSettingsBatch(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Настройки</h1>
          <p className="text-sm text-muted-foreground mt-1">Управление ценами и информацией компании</p>
        </div>
        <Button onClick={handleSave} disabled={saved}>
          {saved ? <CheckCircle className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
          {saved ? "Сохранено!" : "Сохранить"}
        </Button>
      </div>

      <Tabs defaultValue="pricing">
        <TabsList>
          <TabsTrigger value="pricing">Цены за м²</TabsTrigger>
          <TabsTrigger value="additional">Доп. услуги</TabsTrigger>
          <TabsTrigger value="surcharge">Наценки</TabsTrigger>
          <TabsTrigger value="company">Компания</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Стоимость уборки за м²</CardTitle>
              <CardDescription>Базовые цены для каждого типа уборки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {PRICING_FIELDS.map((f) => (
                <div key={f.key} className="flex items-center gap-4">
                  <Label className="w-64">{f.label}</Label>
                  <div className="flex items-center gap-2 flex-1 max-w-xs">
                    <Input
                      type="number"
                      value={settings[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                    />
                    {f.unit && <span className="text-sm text-muted-foreground whitespace-nowrap">{f.unit}</span>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additional">
          <Card>
            <CardHeader>
              <CardTitle>Дополнительные услуги</CardTitle>
              <CardDescription>Фиксированные цены за каждую услугу</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ADDITIONAL_FIELDS.map((f) => (
                <div key={f.key} className="flex items-center gap-4">
                  <Label className="w-64">{f.label}</Label>
                  <div className="flex items-center gap-2 flex-1 max-w-xs">
                    <Input
                      type="number"
                      value={settings[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                    />
                    {f.unit && <span className="text-sm text-muted-foreground whitespace-nowrap">{f.unit}</span>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surcharge">
          <Card>
            <CardHeader>
              <CardTitle>Наценки</CardTitle>
              <CardDescription>Процентные наценки за особые условия</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {SURCHARGE_FIELDS.map((f) => (
                <div key={f.key} className="flex items-center gap-4">
                  <Label className="w-64">{f.label}</Label>
                  <div className="flex items-center gap-2 flex-1 max-w-xs">
                    <Input
                      type="number"
                      value={settings[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                    />
                    {f.unit && <span className="text-sm text-muted-foreground whitespace-nowrap">{f.unit}</span>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Информация о компании</CardTitle>
              <CardDescription>Контактные данные и название</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {COMPANY_FIELDS.map((f) => (
                <div key={f.key} className="flex items-center gap-4">
                  <Label className="w-64">{f.label}</Label>
                  <Input
                    className="flex-1 max-w-md"
                    value={settings[f.key] || ""}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
