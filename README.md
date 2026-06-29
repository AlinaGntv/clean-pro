# CleanPro — Шаблон веб-приложения для клининговой компании

## Стек

- **Frontend:** React + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend:** Node.js + Express + Prisma + SQLite
- **ИИ чат-бот:** OpenAI-совместимый API (deepseek-v4-flash)
- **Деплой:** Docker Compose

## Статус проекта

### Работает:
- Лендинг (главная страница)
- Калькулятор стоимости (5-шаговая форма)
- Форма заявки → сохранение в SQLite
- Админка: авторизация, таблица заявок, поиск, сортировка
- Настройки: редактирование цен через интерфейс
- ИИ чат-бот (консультации по услугам)
- Адаптивный дизайн (мобилка + десктоп)
- Docker Compose деплой

### Известные проблемы:
- Порт 80 занят на VPS → используем порт 8080
- Чат-бот работает только при наличии OPENAI_API_KEY в .env

## Запуск локально

### Бэкенд (терминал 1):
```powershell
cd server
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

### Фронтенд (терминал 2):
```powershell
cd client
npm install
npm run dev
```

Открыть: http://localhost:5173

## Деплой на VPS

```bash
cd ~
git clone https://github.com/AlinaGntv/clean-pro.git clean-web
cd ~/clean-web

# Создать .env
cat > .env << 'EOF'
OPENAI_API_KEY=your-key-here
OPENAI_MODEL=deepseek/deepseek-v4-flash
OPENAI_BASE_URL=https://polza.ai/api/v1
JWT_SECRET=clean-web-secret-key-2024
EOF

# Запустить
docker compose up -d --build
```

Сайт: http://IP-ВПС:8080

## Обновление на VPS

```bash
cd ~/clean-web
git pull
docker compose up -d --build
```

## Кастомизация

Для нового клиента заменить:
- **Название:** `COMPANY_NAME` в .env
- **Телефон, адрес:** в .env или через админку
- **Цены:** через админку → Настройки
- **Логотип:** в компонентах (ищите "CleanPro")
- **Цвета:** `client/src/index.css` (CSS-переменные)

## Админка

- URL: http://localhost:5173/admin/login
- Логин: `admin@cleanpro.ru`
- Пароль: `admin123`

## Структура проекта

```
clean-web/
├── server/                # Express + Prisma + SQLite
│   ├── prisma/            # Схема БД и seed
│   │   ├── schema.prisma  # Модели: User, Setting, Lead
│   │   └── seed.ts        # Дефолтный админ + цены
│   └── src/
│       ├── index.ts       # Точка входа
│       ├── auth.ts        # JWT-авторизация
│       ├── prisma.ts      # Клиент Prisma
│       ├── schema.ts      # Zod-схемы валидации
│       └── routes/
│           ├── auth.ts    # POST /api/auth/login
│           ├── leads.ts   # CRUD заявок
│           ├── settings.ts# Настройки цен
│           └── chat.ts    # ИИ чат-бот
├── client/                # React + Vite + TailwindCSS
│   └── src/
│       ├── components/
│       │   ├── ui/        # shadcn/ui компоненты
│       │   └── ChatWidget.tsx  # ИИ чат-бот виджет
│       ├── pages/
│       │   ├── LandingPage.tsx    # Лендинг
│       │   ├── CalculatorPage.tsx # Калькулятор
│       │   └── admin/
│       │       ├── AdminLayout.tsx
│       │       ├── LoginPage.tsx
│       │       ├── DashboardPage.tsx  # Таблица заявок
│       │       └── SettingsPage.tsx   # Редактирование цен
│       └── lib/
│           ├── api.ts     # API-клиент
│           └── utils.ts   # Утилиты
└── docker-compose.yml
```
