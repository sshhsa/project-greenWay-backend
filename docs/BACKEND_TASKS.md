# Розподіл бекенду — команда 11 людей

## Головне правило: кожен редагує ТІЛЬКИ свої файли
Тімлід уже підключив **усі** маршрути в `src/routes/*` і створив для кожного ендпоінта окремий файл-заглушку
контролера (відповідає 501) та файл валідації. Твоє завдання — замінити вміст **своїх** файлів.
`src/routes/*`, `server.js`, `middleware/*`, `utils/*`, `package.json`, чужі моделі — **не чіпаєш**.
Потрібен хелпер → створюй **новий** файл у `src/services/<група>/`. Потрібен пакет або зміна спільного файлу → пиши тімліду.

| Хто | Ендпоінт | Твої файли | Скл. |
|---|---|---|---|
| **Олександр (TL)** | Каркас · register · login · logout · refresh · authenticate · isValidId · seed | спільні файли, `models/user.js`, `models/session.js`, `controllers/auth/*` | ✅ готово |
| **Валерій** (ValeriySolod) | POST /feedbacks + **схема Feedback** + push у location + перерахунок rate | `models/feedback.js`, `controllers/feedbacks/createFeedback.js`, `validations/feedbacks/createFeedbackSchema.js` | 🔴 |
| **Анастасія** (Scrum) | GET /users/:userId | `controllers/users/getUserById.js` | 🟢 |
| **Назарій** | GET /users/:userId/locations | `controllers/users/getUserLocations.js`, `validations/users/getUserLocationsSchema.js` | 🟡 |
| **Катерина** | GET /locations (пагінація, region, type, search, sort) | `controllers/locations/getLocations.js`, `validations/locations/getLocationsSchema.js` | 🔴 |
| **Мирослава** | GET /locations/popular | `controllers/locations/getPopularLocations.js`, `validations/locations/getPopularLocationsSchema.js` | 🟢 |
| **Крістіна** | GET /locations/:locationId (+ populate ownerId, feedbacksId) | `controllers/locations/getLocationById.js` | 🟡 |
| **Вікторія** | POST /locations + **схема Location** + Cloudinary + articlesAmount +1 | `models/location.js`, `controllers/locations/createLocation.js`, `validations/locations/createLocationSchema.js` | 🔴 |
| **Артем** | PATCH /locations/:locationId (лише автор → 403) | `controllers/locations/updateLocation.js`, `validations/locations/updateLocationSchema.js` | 🔴 |
| **Геннадій** | GET /categories + **схеми Region, LocationType** | `models/region.js`, `models/locationType.js`, `controllers/categories/getCategories.js` | 🟡 |
| **Анна** | GET /users/me · GET /feedbacks (останні) | `controllers/users/getCurrentUser.js`, `controllers/feedbacks/getLatestFeedbacks.js`, `validations/feedbacks/getLatestFeedbacksSchema.js` | 🟢🟢 |

## Порядок
- Дані вже в БД → усі GET-и стартують одразу.
- Схеми Вікторії, Геннадія й Валерія — змерджити **першими** (день 1), інші їх лише імпортують.
- Артем стартує після мерджу схеми Location.
- Приватні ендпоінти тестуємо так: Postman → `POST /api/auth/login` з `test@greenway.dev` / `Test12345` → cookies зберігаються → твій запит.

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
