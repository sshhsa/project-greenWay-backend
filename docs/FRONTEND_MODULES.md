# Модулі фронтенду і відповідальні

Модуль = `components/<Name>/<Name>.tsx` + `<Name>.module.css`, у 3 брейкпоінтах (320/375 · 768 · 1440). Мінімум 2 на людину.
Кожен також робить Route Handler у `app/api` для свого бекенд-ендпоінта.

| Хто | Модулі | До 30.09? |
|---|---|---|
| **Олександр (TL)** | AuthNav, LoginForm, RegisterForm, ConfirmLogoutModal + структура `app/`, API-шар, приватні роути, шрифти, favicon, CSS-змінні | ✅ |
| **Валерій** | Header (гість / авторизований), UserBar, MobileMenu (бургер) | ✅ |
| **Анастасія** | Advantages «Ключові переваги», ProfileInfo | ✅ / — |
| **Назарій** | Footer, UserLocations (сітка профілю + «Показати ще» + placeholder) | ✅ / — |
| **Катерина** | FiltersPanel, LocationsGrid «Усі місця відпочинку» | — |
| **Мирослава** | PopularLocations (Swiper), LatestFeedbacks (Swiper), FeedbackCard | ✅ |
| **Крістіна** | LocationDetails (сторінка локації), LocationFeedbacks | — |
| **Вікторія** | Hero (пошук), LocationForm (одна для створення і редагування) | ✅ / — |
| **Артем** | **LocationCard** (першою!), EditLocationPage | ✅ |
| **Геннадій** | **UI kit**: Button, Input, Textarea, Select (першим!), Loader | ✅ |
| **Анна** | **Modal**, **StarRating** (першими!), AddFeedbackModal, AuthPromptModal | ✅ |

Спільні компоненти (LocationCard, UI kit, Modal, StarRating) мерджимо в перші 1–2 дні фронту — на них спираються інші.
