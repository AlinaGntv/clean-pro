# CleanWeb — Шаблон веб-приложения для клининговой компании

## Быстрый старт

```bash
# Установить зависимости
cd server && npm install
cd ../client && npm install

# Настроить .env файл в корне проекта

# Запустить в dev-режиме
cd server && npm run dev
cd client && npm run dev
```

## Docker Compose

```bash
docker compose up --build
```

- Фронтенд: http://localhost
- Бэкенд: http://localhost:3001

## Кастомизация

Замените в `.env`:
- `COMPANY_NAME` — название
- `COMPANY_PHONE` — телефон
- `COMPANY_EMAIL` — email
- `COMPANY_ADDRESS` — адрес

Цены редактируются через админку: http://localhost/admin/settings

## Логин по умолчанию

- Email: `admin@cleanpro.ru`
- Пароль: `admin123`

## Структура проекта

```
clean-web/
├── server/           # Express + Prisma + SQLite
│   ├── prisma/       # Схема БД и seed
│   └── src/          # API, middleware, routes
├── client/           # React + Vite + TailwindCSS
│   └── src/
│       ├── components/  # UI-компоненты (shadcn/ui)
│       ├── pages/       # Страницы
│       └── lib/         # Утилиты, API
└── docker-compose.yml
```
