import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, MapPin, Sparkles, Clock, Shield, Star, CheckCircle } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";

const ADVANTAGES = [
  { icon: Clock, title: "Быстро", desc: "Расчёт стоимости за 30 секунд" },
  { icon: Shield, title: "Надёжно", desc: "Гартия на все виды работ" },
  { icon: Sparkles, title: "Чистота", desc: "Экологичные средства премиум-класса" },
  { icon: Star, title: "Опыт", desc: "Более 500 довольных клиентов" },
];

const SERVICES = [
  { title: "Поддерживающая", desc: "Регулярная уборка для поддержания чистоты", price: "от 80 ₽/м²" },
  { title: "Генеральная", desc: "Глубокая уборка всех помещений", price: "от 150 ₽/м²" },
  { title: "После ремонта", desc: "Удаление пыли, следов краски и клея", price: "от 220 ₽/м²" },
  { title: "После переезда", desc: "Полная подготовка квартиры к новоселью", price: "от 180 ₽/м²" },
];

const STEPS = [
  { num: "01", title: "Рассчитайте стоимость", desc: "Используйте наш калькулятор — это займёт 30 секунд" },
  { num: "02", title: "Оставьте заявку", desc: "Укажите контактные данные и удобное время" },
  { num: "03", title: "Подтверждение", desc: "Менеджер свяжется с вами для уточнения деталей" },
  { num: "04", title: "Уборка", desc: "Наши специалисты выполнят работу в согласованный срок" },
];

const REVIEWS = [
  { name: "Елена М.", text: "Заказывала генеральную уборку после ремонта. Ребята справились отлично! Всё блестит, рекомендую.", rating: 5 },
  { name: "Андрей К.", text: "Пользуюсь поддерживающей уборкой каждую неделю. Всегда вовремя и качественно.", rating: 5 },
  { name: "Ольга С.", text: "Заказывала уборку после переезда — квартира как новая. Очень довольна результатом!", rating: 5 },
];

const FAQ = [
  { q: "Как рассчитывается стоимость?", a: "Стоимость зависит от типа уборки, площади помещения и дополнительных услуг. Используйте наш калькулятор для быстрого расчёта." },
  { q: "Какие средства вы используете?", a: "Мы работаем с экологичными средствами премиум-класса, безопасными для детей и животных." },
  { q: "Можно ли отменить заказ?", a: "Да, вы можете отменить или перенести уборку не менее чем за 24 часа до назначенного времени." },
  { q: "Есть ли гарантия?", a: "Да, мы предоставляем гарантию на все виды работ. Если качество вас не устроит — проведём уборку повторно бесплатно." },
  { q: "Как быстро можно заказать уборку?", a: "Мы можем выполнить уборку уже в день обращения при наличии свободных специалистов." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-xl font-bold text-primary">CleanPro</div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition-colors">Услуги</a>
            <a href="#how" className="hover:text-foreground transition-colors">Как мы работаем</a>
            <a href="#reviews" className="hover:text-foreground transition-colors">Отзывы</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <a href="#contacts" className="hover:text-foreground transition-colors">Контакты</a>
          </nav>
          <Link to="/calculator">
            <Button size="lg">Рассчитать стоимость</Button>
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Идеальная чистота <br />
            <span className="text-primary">без усилий</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Профессиональная уборка квартир, домов и офисов в Москве.
            Рассчитайте стоимость онлайн за 30 секунд.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/calculator">
              <Button size="lg" className="text-lg px-8 py-6">
                Рассчитать стоимость за 30 секунд
              </Button>
            </Link>
            <a href="tel:+74951234567">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Phone className="mr-2 h-5 w-5" /> +7 (495) 123-45-67
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {ADVANTAGES.map((a) => (
              <div key={a.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <a.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-center">Виды уборок</h2>
          <p className="mt-3 text-center text-muted-foreground">Выберите подходящий вариант</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Card key={s.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                  <p className="mt-4 text-lg font-bold text-primary">{s.price}</p>
                  <Link to="/calculator" className="mt-4 block">
                    <Button variant="outline" className="w-full">Рассчитать</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-center">Как мы работаем</h2>
          <p className="mt-3 text-center text-muted-foreground">4 простых шага до идеальной чистоты</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.num} className="relative">
                <span className="text-5xl font-bold text-primary/10">{s.num}</span>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-center">Отзывы</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <Card key={r.name}>
                <CardContent className="p-6">
                  <div className="flex gap-1 text-yellow-500">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{r.text}</p>
                  <p className="mt-4 font-semibold">{r.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-center">Частые вопросы</h2>
          <Accordion type="single" collapsible className="mt-12">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="contacts" className="py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold">Контакты</h2>
          <div className="mt-8 flex flex-col md:flex-row gap-8 justify-center">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <span>+7 (495) 123-45-67</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span>info@cleanpro.ru</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>г. Москва, ул. Чистая, 42</span>
            </div>
          </div>
          <Link to="/calculator" className="mt-10 inline-block">
            <Button size="lg" className="text-lg px-8 py-6">
              Рассчитать стоимость за 30 секунд
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2024 CleanPro. Все права защищены.</p>
      </footer>

      <ChatWidget />
    </div>
  );
}
