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

Якщо на Windows `mongodb+srv` завершується з `querySrv ECONNREFUSED`, а `node -e "console.log(require('node:dns').getServers())"` показує `127.0.0.1`, задай `MONGO_DNS_SERVER=1.1.1.1` у `.env`. Ця змінна перевизначає DNS-сервер лише для процесу Node.js; без неї використовується системне налаштування.

## Скрипти

| Команда             | Що робить                                         |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | запуск з nodemon                                  |
| `npm start`         | продакшн-запуск                                   |
| `npm run lint`      | перевірка ESLint                                  |
| `npm run format`    | форматування Prettier                             |
| `npm run seed`      | наповнення БД початковими даними з ТЗ             |
| `npm run seed:user` | тестовий користувач test@greenway.dev / Test12345 |
| `npm run seed:coords` | координати локацій з seed (`-- --force` — перезаписати) |

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

### Swagger UI

Документація всіх ендпоінтів: http://localhost:4000/docs/ (локально) або https://project-greenway-backend.onrender.com/docs/ — специфікацію обирай у дропдауні справа зверху (Locations, Auth, Users, Feedbacks, Categories, Geocode). Файли: [docs/openapi/](docs/openapi/).

## Seed

Завантаж 5 файлів `relax_map_db.*.json` з папки ТЗ у `src/db/seeds/`, перейменуй на `regions.json`, `location_types.json`, `users.json`, `feedbacks.json`, `locations.json` і виконай `npm run seed` (`-- --force` — перезалити).

### Координати локацій

`node src/db/addCoordinates.js` — додає координати з seed лише коли поле `coordinates` відсутнє.

`node src/db/addCoordinates.js --force` — синхронізує відсутні або відмінні координати з seed за точним збігом `name`.

## Git workflow

- `main` захищена: тільки через Pull Request + 1 approve від тімліда.
- Одна задача = одна гілка: `backend/<task-name>` (наприклад `backend/auth-register`).
- Перед PR: `git checkout main` → `git pull` → `git checkout <твоя-гілка>` → `git merge main` → вирішити конфлікти → `npm run lint` → перевірка в Postman → `git push`.
- Наприкінці проєкту всі гілки, крім `main`, видаляються (TECH-критерій №18).

## Команда

| Учасник | Роль | Бекенд | Фронтенд |
|---|---|---|---|
| Олександр ([@sshhsa](https://github.com/sshhsa)) | Team Lead | каркас, auth (register/login/logout/refresh), сесії, seed, geocode, swagger (auth, users), деплой | каркас, auth-сторінки, middleware, проксі `app/api`, модалка «Редагувати профіль», фікси та рев'ю |
| Анастасія ([@Anastasiia-S100306](https://github.com/Anastasiia-S100306)) | Scrum Master | GET /users/:userId | Advantages, ProfileInfo |
| Валерій ([@ValeriySolod](https://github.com/ValeriySolod)) | Developer | GET /users/me, останні відгуки, координати локацій | AuthPromptModal, MapView (Leaflet), LocationMap |
| Катерина ([@kateryna-motylova](https://github.com/kateryna-motylova)) | Developer | GET /locations (фільтри, пагінація), Swagger UI | каталог локацій |
| Мирослава ([@Myroslava-Morhental](https://github.com/Myroslava-Morhental)) | Developer | GET /locations/popular, swagger locations | PopularLocations, LatestFeedbacks, FeedbackSlider |
| Крістіна ([@krystyna-arsenych](https://github.com/krystyna-arsenych)) | Developer | GET /locations/:locationId | LocationDetails, LocationFeedbacks |
| Вікторія ([@victoriatarasenko1993-max](https://github.com/victoriatarasenko1993-max)) | Developer | POST /locations, Cloudinary, swagger feedbacks/categories | Hero, LocationForm, LocationSearch |
| Артем ([@homichartem03-rgb](https://github.com/homichartem03-rgb)) | Developer | PATCH /locations/:locationId | LocationCard, редагування локації |
| Геннадій ([@GennadiyTsekhmistro](https://github.com/GennadiyTsekhmistro)) | Developer | GET /categories, swagger geocode | UI kit, Modal, Pagination |
| Анна ([@PavelkoAnna](https://github.com/PavelkoAnna)) | Developer | POST /feedbacks | StarRating, AddFeedbackModal, LocationPicker |
| Назарій ([@Nazar-Lysak](https://github.com/Nazar-Lysak)) | Developer | GET /users/:userId/locations | UserLocations, пагінація профілю |
| Маркіян ([@eture4ka](https://github.com/eture4ka)) | Developer | PATCH /users/me | EditProfileModal |

## Деплой

- Фронтенд (Vercel): https://project-greenway-frontend.vercel.app
- Бекенд (Render): https://project-greenway-backend.onrender.com/api
- Swagger: https://project-greenway-backend.onrender.com/docs/
- Репозиторії: [frontend](https://github.com/sshhsa/project-greenWay-frontend) · [backend](https://github.com/sshhsa/project-greenWay-backend)
