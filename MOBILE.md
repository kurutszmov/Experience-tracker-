# FinTrack — мобильное приложение (Android / iOS)

Веб-фронтенд (React + Vite) упакован в нативное приложение с помощью **[Capacitor 8](https://capacitorjs.com/)**.
Один и тот же код из `frontend/src` работает и в браузере, и на Android, и на iOS.

```
frontend/
├── capacitor.config.json   # appId kg.muratbekov.fintrack, имя FinTrack
├── android/                # нативный проект Android (Android Studio)
└── ios/                    # нативный проект iOS (Xcode)
```

## ⚠️ Главное: бэкенд должен быть доступен с телефона

На телефоне `localhost` — это сам телефон, а не ваш компьютер. Поэтому перед сборкой укажите адрес API
в `frontend/.env` (см. `frontend/.env.example`):

| Где запускаете               | VITE_API_URL                                   |
|------------------------------|------------------------------------------------|
| Эмулятор Android             | `http://10.0.2.2:5000/api`                     |
| Телефон в той же Wi-Fi сети  | `http://192.168.x.x:5000/api` (IP компьютера)  |
| Продакшн (рекомендуется)     | `https://<ваш-бэкенд>.onrender.com/api`        |

### Деплой бэкенда (бесплатно, пример)
1. База PostgreSQL: [Neon](https://neon.tech) или [Supabase](https://supabase.com) → получите `DATABASE_URL`.
2. Бэкенд: [Render](https://render.com) → New Web Service → папка `backend`, команда `npm install`, старт `npm start`.
3. Переменные окружения на Render: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`.
4. Один раз выполните миграции: `DATABASE_URL=... npm run migrate` (локально из папки `backend`).

Бэкенд уже настроен: CORS пропускает запросы из приложения (`https://localhost`, `capacitor://localhost`),
а `db.js` понимает `DATABASE_URL`. Доп. домены для CORS: переменная `CORS_ORIGINS`.

## Android

### Вариант 1 — готовый APK из GitHub Actions (без Android Studio)
1. В репозитории: **Settings → Secrets and variables → Actions → Variables** → добавьте `VITE_API_URL`
   (адрес задеплоенного бэкенда).
2. **Actions → Android APK → Run workflow** (или просто запушьте изменения во `frontend/`).
3. Скачайте артефакт `FinTrack-debug-apk`, распакуйте, перекиньте `app-debug.apk` на телефон и установите
   (разрешите установку из неизвестных источников).

### Вариант 2 — локально
Нужны Node.js 20+, JDK 21 и Android Studio.
```bash
cd frontend
npm install
npm run android      # сборка + синхронизация + открыть Android Studio → ▶ Run
# или без Android Studio:
npm run apk          # → android/app/build/outputs/apk/debug/app-debug.apk
```

### Публикация в Google Play
Android Studio → Build → Generate Signed Bundle (AAB) → загрузить в Google Play Console
(аккаунт разработчика — разовый взнос $25).

## iOS

Для iOS **обязательно нужен Mac с Xcode** (или CI на macOS).
```bash
cd frontend
npm install
npm run ios          # откроет Xcode → выберите симулятор или свой iPhone → ▶ Run
```
- На свой iPhone можно поставить бесплатно с обычным Apple ID (Signing & Capabilities → Team), приложение живёт 7 дней.
- TestFlight / App Store — нужен Apple Developer Program ($99/год).
- Workflow **iOS (simulator build)** в GitHub Actions проверяет, что проект собирается, и выкладывает сборку для симулятора.

## Что изменено в коде для мобильной версии
- `frontend/` — добавлен Capacitor, проекты `android/` и `ios/`, скрипты `cap:sync`, `android`, `ios`, `apk`.
- `index.html` — `viewport-fit=cover`; `Layout.css` + `styles/index.css` — отступы под вырез/статус-бар (safe area).
- `main.jsx` — тёмные иконки статус-бара на белой шапке.
- `backend/src/app.js` — CORS для мобильного приложения + `CORS_ORIGINS`.
- `backend/src/config/db.js` — поддержка `DATABASE_URL` для облачной БД.

## После изменений во фронтенде
```bash
cd frontend
npm run cap:sync     # пересобрать веб и скопировать в android/ и ios/
```
