# Розподіл бекенду — команда 12 людей

## Головне правило: кожен редагує ТІЛЬКИ свої файли
Тімлід уже підключив **усі** маршрути в `src/routes/*` і створив для кожного ендпоінта окремий файл-заглушку
контролера (відповідає 501) та файл валідації. Твоє завдання — замінити вміст **своїх** файлів.
`src/routes/*`, `server.js`, `middleware/*`, `utils/*`, `package.json`, чужі моделі — **не чіпаєш**.
Потрібен хелпер → створюй **новий** файл у `src/services/<група>/`. Потрібен пакет або зміна спільного файлу → пиши тімліду.

| Хто | Ендпоінт | Твої файли | Статус |
|---|---|---|---|
| **Олександр (TL)** | Каркас · register · login · logout · refresh · authenticate · isValidId · seed | спільні файли, `models/user.js`, `models/session.js`, `controllers/auth/*` | ✅ |
| **Валерій** (ValeriySolod) | GET /users/me · GET /feedbacks (останні) | `controllers/users/getCurrentUser.js`, `controllers/feedbacks/getLatestFeedbacks.js`, `validations/feedbacks/getLatestFeedbacksSchema.js` | ✅ #22 |
| **Анастасія** (Scrum) | GET /users/:userId | `controllers/users/getUserById.js` | ⏳ |
| **Назарій** | GET /users/:userId/locations | `controllers/users/getUserLocations.js`, `validations/users/getUserLocationsSchema.js` | ✅ #21 |
| **Катерина** | GET /locations (пагінація, region, type, search, sort) + сервіс `findPopularLocations` | `controllers/locations/getLocations.js`, `validations/locations/getLocationsSchema.js`, `services/locations/*` | ✅ #24, #27 |
| **Мирослава** | GET /locations/popular (через `findPopularLocations`) | `controllers/locations/getPopularLocations.js`, `validations/locations/getPopularLocationsSchema.js` | ⏳ |
| **Крістіна** | GET /locations/:locationId (+ populate ownerId, feedbacksId) | `controllers/locations/getLocationById.js` | ⏳ |
| **Вікторія** | POST /locations + **схема Location** + Cloudinary + articlesAmount +1 | `models/location.js`, `controllers/locations/createLocation.js`, `validations/locations/createLocationSchema.js` | ✅ #23 |
| **Артем** | PATCH /locations/:locationId (лише автор → 403) | `controllers/locations/updateLocation.js`, `validations/locations/updateLocationSchema.js` | ⏳ |
| **Геннадій** | GET /categories + **схеми Region, LocationType** | `models/region.js`, `models/locationType.js`, `controllers/categories/getCategories.js` | 🔍 #30 |
| **Анна** | POST /feedbacks + push у location + перерахунок rate (схема Feedback вже в main) | `controllers/feedbacks/createFeedback.js`, `validations/feedbacks/createFeedbackSchema.js` | ⏳ |

`✅` змерджено · `🔍` на рев'ю · `⏳` в роботі

### Додаткові завдання
| Хто | Що | Статус |
|---|---|---|
| **Маркіян** (eture4ka) | PATCH /api/users/me — ім'я + аватар (редагування профілю) | ✅ #28 |
| **Катерина** | Swagger UI на `/docs/` (поки лише GET /api/locations) | ✅ #29 |

## Порядок
- Дані вже в БД → усі GET-и стартують одразу.
- Схеми Location і Feedback уже в main.
- Приватні ендпоінти тестуємо так: Postman → `POST /api/auth/login` з `test@greenway.dev` / `Test12345` → cookies зберігаються → твій запит.
- Swagger: `http://localhost:4000/docs/` (після pull — `npm install`).

## Git для кожного
```bash
git checkout main && git pull
git checkout -b backend/<твоя-задача>            # напр. backend/locations-list
# ... робота тільки у своїх файлах ...
npm run lint
git add . && git commit -m "feat: GET /api/locations with filters"
git checkout main && git pull && git checkout backend/<твоя-задача> && git merge main
git push -u origin backend/<твоя-задача>          # → Pull Request у main → approve тімліда
```

**30.09 (проміжний дедлайн): увесь бекенд змерджений і задеплоєний.**