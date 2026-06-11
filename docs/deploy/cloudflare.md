# Промпт: налаштувати деплой на Cloudflare Workers

**Коли потрібно:** твій проєкт уже на GitHub, але зібраний зі старого шаблону — у `frontend/` ще **немає** `wrangler.jsonc`. Шаблон удруге не підвантажується, тож потрібні файли згенеруємо прямо в проєкті через Claude Code.

**Що це дасть:** фронт публікується на Cloudflare Workers (Static Assets) за адресою `*.workers.dev`, з безкоштовним HTTPS і авто-деплоєм на кожен `git push`.

## Як користуватись

1. Відкрий Claude Code у корені проєкту.
2. Встав промпт нижче (блок цілком).
3. Далі піди в дашборд Cloudflare і заповни 5 полів (таблиця в кінці).

---

## Промпт для Claude Code

```text
Налаштуй деплой фронтенду цього проєкту на Cloudflare Workers (Static Assets).
Це монорепо: фронт лежить у frontend/ і збирається Vite у frontend/dist/.
Зроби рівно це й нічого більше (бекенд, дизайн, існуючі компоненти не чіпай):

1. Створи файл frontend/wrangler.jsonc (якщо вже існує — онови до цього вигляду):
   {
     "name": "my-school",
     "compatibility_date": "<постав сьогоднішню дату YYYY-MM-DD>",
     "assets": {
       "directory": "./dist",
       "not_found_handling": "single-page-application"
     }
   }
   Спитай у мене бажане значення name (за замовчуванням my-school).
   ВАЖЛИВО: це ім'я мусить точно збігатися з "Project name", який я введу
   в дашборді Cloudflare — інакше білд впаде. Нагадай мені про це.
   not_found_handling: single-page-application потрібен, щоб під-маршрути
   react-router не давали 404.

2. У frontend/.gitignore додай рядок .wrangler/ (якщо його там ще немає).

3. Якщо існує frontend/public/_redirects зі SPA-фолбеком (/* /index.html 200) —
   видали його: цю роль тепер виконує not_found_handling у wrangler.jsonc,
   тримати два механізми не треба.

4. Додай wrangler (остання стабільна версія) у devDependencies у
   frontend/package.json і встанови залежності (pnpm install у frontend/).
   Так білд на Cloudflare використовуватиме закріплену версію wrangler —
   деплой буде швидшим і без сюрпризів від npx.

5. Наприкінці виведи:
   а) підсумок змінених файлів;
   б) нагадування закомітити й Sync (push) — Cloudflare деплоїть лише залите
      на GitHub. Переконайся, що в коміт потрапили frontend/wrangler.jsonc,
      оновлений frontend/package.json і frontend/pnpm-lock.yaml (без нього
      білд у Cloudflare впаде — він ставить залежності в режимі frozen-lockfile);
   в) пам'ятку для дашборда Cloudflare
      (Workers & Pages -> Create application -> Continue with GitHub), де я маю
      ввести саме такі значення:
        - Project name  = <name з wrangler.jsonc>  (мусять точно збігатися!)
        - Build command = pnpm install && pnpm build
        - Deploy command = npx wrangler deploy
        - Builds for non production branches = вимкнено
        - Path (блок advanced) = frontend
          (без цього білд не знайде проєкт у монорепо й впаде)
```

---

## Далі — у дашборді Cloudflare (руками)

`dash.cloudflare.com` → **Workers & Pages → Create application → Continue with GitHub** → вибери свій репозиторій. Потім заповни форму:

| Поле                               | Значення                                          |
| ---------------------------------- | ------------------------------------------------- |
| Project name                       | `my-school` (**те саме**, що `name` у wrangler.jsonc) |
| Build command                      | `pnpm install && pnpm build`                      |
| Deploy command                     | `npx wrangler deploy`                             |
| Builds for non production branches | лишити **вимкненим**                              |
| Path (у блоці advanced)            | `frontend`                                         |

Натисни **Save and Deploy**. Перший Worker — Cloudflare один раз попросить обрати твій `*.workers.dev` піддомен. За 1–2 хвилини отримаєш живу адресу.

## Часті помилки

- **Build впав через ім'я (name mismatch):** «Project name» ≠ `name` у `wrangler.jsonc`. Зроби однаковими.
- **Не знайдено `wrangler.jsonc` / `package.json`:** не виставлений **Path = `frontend`**, або файли ще не запушені на GitHub.
- **Сайт не оновлюється:** забув `Sync` (push). Деплоїться лише залите на GitHub.
- **404 на під-сторінках:** зник рядок `not_found_handling` у `wrangler.jsonc`.
