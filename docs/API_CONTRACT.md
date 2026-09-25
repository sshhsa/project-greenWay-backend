# Backend API Contract — v2 (узгоджено з ТЗ, seed-даними та плануванням з ментором 23.09)

## 1. Ендпоінти
| Хто | Метод | Шлях | Доступ | Успіх |
|---|---|---|---|---|
| TL | POST | /api/auth/register | public | 201 + cookies |
| TL | POST | /api/auth/login | public | 200 + cookies |
| TL | POST | /api/auth/logout | cookie сесії | 204, cookies чистяться завжди |
| TL | POST | /api/auth/refresh | refresh cookie | 200 + нові cookies |
| M1 | GET | /api/users/me | private | 200 |
| M2 | GET | /api/users/:userId | public | 200 |
| M3 | GET | /api/users/:userId/locations | public | 200 (список) |
| M4 | GET | /api/locations | public | 200 (список) |
| M5 | GET | /api/locations/popular | public | 200 |
| M6 | GET | /api/locations/:locationId | public | 200 (з owner і feedbacks) |
| M7 | POST | /api/locations | private | 201 |
| M8 | PATCH | /api/locations/:locationId | private, лише автор | 200 |
| M9 | GET | /api/categories | public | 200 |
| M1 | GET | /api/feedbacks | public | 200 (останні) |
| M10 | POST | /api/feedbacks | private | 201 |
| EXTRA | PATCH | /api/users/me | private | 200 — **додаткове**, лише після основних |

`authenticate` (TL) — для всіх private-ендпоінтів. `isValidId` (TL) — перевірка ObjectId у params, вже підключена в роутерах.

## 2. Моделі (колекції)
| Модель / колекція | Поля |
|---|---|
| User / `users` | name, email (unique **sparse**), password, avatarUrl, articlesAmount |
| Session / `sessions` | userId, accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil |
| Location / `locations` | name, image, locationType (**slug**), region (**slug**), description, rate, ownerId → User, feedbacksId → [Feedback], coordinates (опц.) |
| Feedback / `feedbacks` | rate, description, userName, locationId → Location (у seed відсутній) |
| Region / `regions` | region, slug, level, note — довідник |
| LocationType / `location_types` | type, slug, shortDescription — довідник |

## 3. Формати відповідей
```json
// один об'єкт
{ "data": { "_id": "..." } }
// список
{ "page": 1, "limit": 9, "totalItems": 125, "totalPages": 14, "items": [] }
// помилка
{ "status": 400, "message": "Validation error" }
```

## 4. Query-параметри
- Усі списки: `page` (default 1), `limit` (default 10, max 50). Фронт шле: місця — 9, профіль — 6 (desktop) / 4 (tablet, mobile).
- `GET /api/locations`: `region=<slug>`, `type=<slug>`, `search=<рядок>` (регістронезалежно по `name`), `sort=name | -name` (без sort — порядок як у БД). Кожен параметр працює окремо і в комбінації.
- `GET /api/locations/popular`: `limit` (default 6), сортування `rate` desc.
- `GET /api/feedbacks`: `limit` (default 6), сортування `createdAt` desc, `populate('locationId', 'name')`.

## 5. Валідація (ТЗ → вкладка Validation rules)
| Форма | Поля |
|---|---|
| Register | name 2–32 req · email valid, ≤64, req, unique · password 8–128 req |
| Login | email valid req · password req |
| Location (POST/PATCH) | name 3–96 · type ≤64 · region ≤64 · description 20–6000 · image jpg/png < 1MB (на POST req, на PATCH опц.) |
| Feedback | locationId valid ObjectId req · rate 1–5 req · description 1–200 req · userName 2–32 (з req.user.name) |

`userId` / `locationId` у params перевіряються на валідний ObjectId **до** запиту в БД (400).

## 6. Авторизація
- Cookies: `accessToken`, `refreshToken`, `sessionId` (httpOnly, secure, sameSite none).
- Після `authenticate`: `req.user` — документ User. Контролери токен повторно не декодують.
- Ownership: `location.ownerId.equals(req.user._id)`, інакше **403**.

## 7. HTTP-коди
200 GET/PATCH · 201 створено · 204 logout · 400 валідація · 401 немає/невалідна/прострочена сесія · 403 не автор · 404 не знайдено · 409 email зайнятий · 500 сервер.

## 8. Бізнес-логіка між модулями
- Реєстрація одразу створює сесію (після реєстрації фронт веде в профіль).
- Створення локації: `ownerId = req.user._id`, `User.articlesAmount += 1`.
- Створення відгуку: `Location.feedbacksId.push(feedback._id)` + перерахунок `Location.rate` (середнє, округлення до 0.5).
- Деталі локації: `populate('ownerId', 'name avatarUrl')` + `populate('feedbacksId')` — окремого ендпоінту відгуків локації немає.
- Фільтри регіону/типу працюють по **slug** (так зберігаються дані в seed). Назви для карток фронт бере з `/api/categories`.

## 9. Git
Гілки: `backend/<task>` (напр. `backend/auth-register`). Один розробник — одна гілка — один PR у `main`, 1 approve тімліда.
