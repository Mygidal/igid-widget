# IGID AI Widget

Вградим AI асистент, изграден с Next.js App Router и Tailwind CSS. Компонентът предоставя плаващ бутон, който отваря чат прозорец с поддръжка на прикачени файлове и отговори чрез Gemini Pro.

## Функционалности

- Плаващ бутон за отваряне и затваряне на чата
- Качване на PDF, DOCX, JPG, PNG и DWG файлове (DWG се обработва чрез stub)
- Изписване на избраните файлове преди изпращане
- Изпращане на въпрос и файлове към `/api/ask`
- Отговори чрез Gemini Pro
- Скрипт `public/embed.js` за лесно вграждане на виджета на външен сайт

## Настройка

1. Копирайте `.env.local.example` като `.env.local` и попълнете реален `GEMINI_API_KEY`.
2. Инсталирайте зависимостите и стартирайте проекта:

```bash
npm install
npm run dev
```

Отворете `http://localhost:3000` в браузъра.

## Вграждане

След като приложението е достъпно онлайн, добавете следните редове към външен сайт:

```html
<script
  src="https://your-domain.com/embed.js"
  data-base-url="https://your-domain.com"
></script>
<script>
  window.createIGIDWidget({ baseUrl: "https://your-domain.com" });
</script>
```

Това ще създаде плаващ бутон, който зарежда чата в iframe.

## Билд

```bash
npm run build
npm start
```

Проектът използва TailwindCSS и Next.js App Router.
