# Розподіл бекенду — 11 людей (TL + M1…M10), без перетину файлів

## Головне правило: кожен редагує ТІЛЬКИ свої файли
Тімлід уже:
- підключив **усі** маршрути в `src/routes/*` (з authenticate, isValidId, upload, celebrate);
- створив для кожного ендпоінта **окремий файл-заглушку** контролера (відповідає 501) і файл валідації.

Тобі лишається заповнити свої файли. `src/routes/*`, `server.js`, `middleware/*`, `utils/*`, чужі моделі — **не чіпаєш**.
Потрібен хелпер? Створюй **новий** файл у `src/services/<група>/` або `src/utils/<твоя-назва>.js`.
Щось треба змінити у спільному файлі → пишеш тімліду, він робить це сам.

## Хто за що

| Хто | Ендпоінт | Твої файли (тільки їх змінюєш / створюєш) | Скл. |
|---|---|---|---|
| **TL** | Каркас · POST /auth/register · /login · /logout · /refresh · authenticate · isValidId · тестовий юзер | усе в `routes/`, `middleware/`, `utils/`, `services/auth/`, `controllers/auth/`, `validations/auth/`, `models/user.js`, `models/session.js`, `db/` | — |
| M1 | GET /users/me · GET /feedbacks (останні) | `controllers/users/getCurrentUser.js`, `controllers/feedbacks/getLatestFeedbacks.js`, `validations/feedbacks/getLatestFeedbacksSchema.js` | 🟢🟢 |
| M2 | GET /users/:userId (+ EXTRA PATCH /users/me після основних) | `controllers/users/getUserById.js` | 🟢 |
| M3 | GET /users/:userId/locations | `controllers/users/getUserLocations.js`, `validations/users/getUserLocationsSchema.js` | 🟡 |
| M4 | GET /locations (пагінація, region, type, search, sort) | `controllers/locations/getLocations.js`, `validations/locations/getLocationsSchema.js` | 🔴 |
| M5 | GET /locations/popular | `controllers/locations/getPopularLocations.js`, `validations/locations/getPopularLocationsSchema.js` | 🟢 |
| M6 | GET /locations/:locationId (+ populate ownerId, feedbacksId) | `controllers/locations/getLocationById.js` | 🟡 |
| M7 | POST /locations + **схема Location** + Cloudinary + articlesAmount +1 | `models/location.js`, `controllers/locations/createLocation.js`, `validations/locations/createLocationSchema.js` | 🔴 |
| M8 | PATCH /locations/:locationId (лише автор → 403, image опц.) | `controllers/locations/updateLocation.js`, `validations/locations/updateLocationSchema.js` | 🔴 |
| M9 | GET /categories + **схеми Region, LocationType** | `models/region.js`, `models/locationType.js`, `controllers/categories/getCategories.js` | 🟡 |
| M10 | POST /feedbacks + **схема Feedback** + push у location + перерахунок rate | `models/feedback.js`, `controllers/feedbacks/createFeedback.js`, `validations/feedbacks/createFeedbackSchema.js` | 🔴 |

M5 і M2 мають легші бекенд-задачі — у них більше модулів на фронті (див. FRONTEND_MODULES.md).

## Залежності (без блокування)
- Дані вже є в БД (seed) → усі GET-и стартують одразу.
- Схеми M7/M9/M10 бажано змерджити **в перший день** — інші лише імпортують моделі й читають поля за контрактом.
- Приватні ендпоінти: `npm run seed:user` → Postman `POST /api/auth/login` (`test@greenway.dev` / `Test12345`) → cookies зберігаються → тестуєш свій запит.

## Git для кожного
```bash
git checkout main && git pull
git checkout -b backend/<твоя-задача>     # напр. backend/locations-list
# ... робота тільки у своїх файлах ...
git add . && git commit -m "feat: GET /api/locations with filters"
git checkout main && git pull && git checkout backend/<твоя-задача> && git merge main
git push -u origin backend/<твоя-задача>  # → PR у main → approve тімліда
```

**30.09: увесь бекенд змерджений і задеплоєний на Render.**
