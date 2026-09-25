# Backend — командний Fullstack проєкт

REST API для застосунку-каталогу природних локацій України: авторизація, профілі, локації, категорії, відгуки.

## Технології
Node.js · Express · helmet · MongoDB (Mongoose) · celebrate/Joi · bcrypt · cookie-based sessions · multer + Cloudinary · pino

## Запуск локально
```bash
npm install
cp .env.template .env  # заповнити MONGO_URL та інші змінні
npm run dev            # http://localhost:4000/api/health
```

## Скрипти
| Команда | Що робить |
|---|---|
| `npm run dev` | запуск з nodemon |
| `npm start` | продакшн-запуск |
| `npm run lint` | перевірка ESLint |
| `npm run format` | форматування Prettier |
| `npm run seed` | наповнення БД початковими даними з ТЗ |
| `npm run seed:user` | тестовий користувач test@greenway.dev / Test12345 |

## Структура
```
src/
  server.js          # точка входу: middleware, роутери, запуск
  routes/            # index.js підключає всі роутери під /api
  controllers/       # логіка: окремий файл на кожен ендпоінт (папка на групу)
  services/          # робота з БД / сесіями (папка на групу)
  models/            # Mongoose-моделі
  validations/       # celebrate/Joi-схеми: окремий файл на ендпоінт
  middleware/        # authenticate, isValidId, upload, errorHandler, notFoundHandler, logger
  utils/             # pagination та інші хелпери
  db/                # підключення до БД, seed
```

## API
Повний контракт: [docs/API_CONTRACT.md](docs/API_CONTRACT.md) · Задачі: [docs/BACKEND_TASKS.md](docs/BACKEND_TASKS.md) · Модулі фронту: [docs/FRONTEND_MODULES.md](docs/FRONTEND_MODULES.md)

## Seed
Завантаж 5 файлів `relax_map_db.*.json` з папки ТЗ у `src/db/seeds/`, перейменуй на `regions.json`, `location_types.json`, `users.json`, `feedbacks.json`, `locations.json` і виконай `npm run seed` (`-- --force` — перезалити).

## Git workflow
- `main` захищена: тільки через Pull Request + 1 approve від тімліда.
- Одна задача = одна гілка: `backend/<task-name>` (наприклад `backend/auth-register`).
- Перед PR: `git checkout main` → `git pull` → `git checkout <твоя-гілка>` → `git merge main` → вирішити конфлікти → `npm run lint` → перевірка в Postman → `git push`.
- Наприкінці проєкту всі гілки, крім `main`, видаляються (TECH-критерій №18).

## Команда
_Заповнити наприкінці проєкту: учасник — роль — задачі._

## Деплой
_Посилання на Render — додати після першого деплою._
