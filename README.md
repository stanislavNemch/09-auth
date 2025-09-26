# NoteHub (Next.js з повноцінною автентифікацією)

## (UK) 🇺🇦

Просунутий застосунок для керування особистими нотатками з надійною системою автентифікації. Проєкт демонструє захист маршрутів, роботу з `cookie`, оптимізацію SEO та сучасні підходи до керування станом за допомогою Next.js App Router.

### 🎯 Основні можливості

- **Автентифікація:** Повна система реєстрації, входу та виходу користувача.
- **Захищені маршрути:** Приватні сторінки (нотатки, профіль) доступні лише авторизованим користувачам.
- **Керування профілем:** Можливість перегляду та редагування даних користувача.
- **CRUD для нотаток:** Створення, перегляд та видалення особистих нотаток.
- **Фільтрація та пошук:** Фільтрація нотаток за тегами та повнотекстовий пошук.
- **Збереження чернетки:** Автоматичне збереження тексту нотатки в `localStorage` під час створення.

### ✅ Що було реалізовано та вивчено

В рамках цього проєкту були реалізовані наступні завдання, з акцентом на безпеку та автентифікацію:

1.  **Автентифікація та Безпека (Нове):**
    - **Повний цикл автентифікації:** Реалізовано сторінки реєстрації, логіну та функціонал виходу з системи.
    - **Робота з Cookie:** Налаштовано взаємодію з бекендом через `http-only cookie` для безпечного зберігання токенів.
    - **Захист маршрутів:** Створено `middleware.ts` для захисту приватних сторінок від неавторизованого доступу та для перенаправлення залогінених користувачів з публічних сторінок/page.tsx].
    - **Клієнтська валідація сесії:** Реалізовано `AuthProvider` для перевірки актуальності сесії на клієнті, що запобігає доступу до даних при застарілому токені.
    - **Структурування маршрутів:** Проєкт розділено на публічні `(auth routes)` та приватні `(private routes)` групи.

2.  **Керування станом та оптимізація:**
    - **Глобальний стан автентифікації:** Створено `Zustand` стор для керування станом користувача (`user`, `isAuthenticated`) у всьому додатку.
    - **Серверний стан:** Запити до API керуються через **TanStack Query (React Query)**, включаючи кешування та інвалідацію даних.
    - **SEO Оптимізація:** Налаштована динамічна генерація метаданих для сторінок за допомогою `generateMetadata`.
    - **Рефакторинг API:** Логіка роботи з API розділена на клієнтську (`clientApi.ts`) та серверну (`serverApi.ts`) для чіткого розмежування.

### 🛠️ Технології

| Технологія         | Опис                                                        |
| :----------------- | :---------------------------------------------------------- |
| **Next.js**        | React-фреймворк з App Router, Middleware та Route Handlers. |
| **React**          | Бібліотека для створення користувацьких інтерфейсів.        |
| **TypeScript**     | Типізація для надійності та масштабованості коду.           |
| **Zustand**        | Бібліотека для керування глобальним станом на клієнті.      |
| **TanStack Query** | Керування асинхронними операціями та кешування даних.       |
| **Axios**          | HTTP-клієнт для взаємодії з API.                            |
| **CSS Modules**    | Локалізація стилів для уникнення конфліктів класів.         |

### 📂 Структура проєкту

```
/
├── app/
│   ├── (auth routes)/      # Публічні маршрути для входу/реєстрації
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (private routes)/   # Приватні маршрути для авторизованих
│   │   ├── notes/
│   │   └── profile/
│   ├── api/                # Route Handlers (проксі до бекенду)
│   ├── @modal/             # Паралельний маршрут для модальних вікон
│   ├── layout.tsx          # Головний макет
│   └── page.tsx            # Головна сторінка
├── components/             # Перевикористовувані React-компоненти
├── lib/                    # Допоміжні функції та логіка
│   ├── api/                # Функції для роботи з API (клієнт/сервер)
│   └── store/              # Zustand-стори
├── middleware.ts           # Middleware для захисту маршрутів
└── types/                  # Глобальні типи TypeScript
```

### 🚀 Встановлення та запуск

1.  **Клонуйте репозиторій:**

    ```bash
    git clone <URL_РЕПОЗИТОРІЮ>
    cd <НАЗВА_ПАПКИ>
    ```

2.  **Встановіть залежності:**

    ```bash
    npm install
    ```

3.  **Створіть файл оточення:**
    Створіть файл `.env.local` в корені проєкту та додайте адресу вашого локального сервера:

    ```
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```

4.  **Запустіть проєкт:**

    ```bash
    npm run dev
    ```

    Застосунок буде доступний за адресою `http://localhost:3000`.

---

---

## (EN) 🇬🇧

# NoteHub (Next.js with Full Authentication)

An advanced application for managing personal notes, featuring a robust authentication system. This project demonstrates route protection, cookie-based authentication, SEO optimization, and modern state management techniques using Next.js App Router.

### 🎯 Key Features

- **Authentication:** A complete system for user registration, login, and logout.
- **Protected Routes:** Private pages (notes, profile) are accessible only to authenticated users.
- **Profile Management:** View and edit user profile data.
- **Note CRUD:** Create, read, and delete personal notes.
- **Filtering and Search:** Filter notes by tags and perform full-text search.
- **Draft Saving:** Automatically save note drafts to `localStorage` during creation.

### ✅ What Was Implemented & Learned

This project focused heavily on security and authentication features:

1.  **Authentication & Security (New Focus):**
    - **Full Auth Flow:** Implemented registration, login, and logout pages and functionality.
    - **Cookie-Based Auth:** Set up interaction with the backend via `http-only cookies` for secure token storage.
    - **Route Protection:** Created `middleware.ts` to protect private routes from unauthorized access and to redirect logged-in users from public auth pages/page.tsx].
    - **Client-Side Session Validation:** Implemented an `AuthProvider` to verify session validity on the client, preventing access to data with an expired token.
    - **Route Structuring:** The project is organized into public `(auth routes)` and private `(private routes)` groups.

2.  **State Management & Optimization:**
    - **Global Auth State:** A `Zustand` store was created to manage the user's state (`user`, `isAuthenticated`) throughout the application.
    - **Server State:** API requests are managed with **TanStack Query (React Query)**, including data caching and invalidation.
    - **SEO Optimization:** Configured dynamic metadata generation for pages using `generateMetadata`.
    - **API Layer Refactoring:** The API logic was split into client-side (`clientApi.ts`) and server-side (`serverApi.ts`) functions for clear separation of concerns.

### 🛠️ Technologies

| Technology         | Description                                                      |
| :----------------- | :--------------------------------------------------------------- |
| **Next.js**        | React framework with App Router, Middleware, and Route Handlers. |
| **React**          | A library for building user interfaces.                          |
| **TypeScript**     | Type safety for code reliability and scalability.                |
| **Zustand**        | A minimalistic library for global client-side state management.  |
| **TanStack Query** | For managing asynchronous operations and caching data.           |
| **Axios**          | An HTTP client for interacting with the API.                     |
| **CSS Modules**    | For locally scoped styles to prevent class name conflicts.       |

### 📂 Project Structure

```
/
├── app/
│   ├── (auth routes)/      # Public routes for sign-in/sign-up
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (private routes)/   # Private routes for authenticated users
│   │   ├── notes/
│   │   └── profile/
│   ├── api/                # Route Handlers (proxy to the backend)
│   ├── @modal/             # Parallel route for modals
│   ├── layout.tsx          # Main layout
│   └── page.tsx            # Home page
├── components/             # Reusable React components
├── lib/                    # Helper functions and logic
│   ├── api/                # API functions (client/server)
│   └── store/              # Zustand stores
├── middleware.ts           # Middleware for route protection
└── types/                  # Global TypeScript types
```

### 🚀 Installation and Launch

1.  **Clone the repository:**

    ```bash
    git clone <REPOSITORY_URL>
    cd <FOLDER_NAME>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a `.env.local` file in the project root and add your local server address:

    ```
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```

4.  **Run the project:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.
