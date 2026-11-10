# Инструменты Claude для проекта

Всё в этой папке подхватывается Claude Code автоматически: локально, в облачных сессиях и в desktop-приложении.
Общий контекст проекта (стек, команды, правила кода) лежит в `../CLAUDE.md`.

```
.claude/
├── README.md       этот каталог
├── agents/         16 подагентов (вызываются через Agent / «используй агента X»)
├── skills/         26 скиллов (вызываются через /имя или подхватываются сами по задаче)
└── rules/          правила кода, подгружаются только при работе с файлами нужного типа
```

Источники: всё, кроме `skills/watch`, взято из [affaan-m/ECC](https://github.com/affaan-m/ECC) (MIT, см. `LICENSE-ECC`), отобрано под этот стек и почищено от зависимостей на плагин ECC. `skills/watch` взят из [bradautomates/claude-video](https://github.com/bradautomates/claude-video) (MIT).

## Агенты — `agents/`

| Этап | Агент | Когда звать |
|---|---|---|
| Планирование | `planner` | новая фича или крупный рефакторинг: пошаговый план |
| | `architect` | архитектурные решения, масштабирование |
| | `code-explorer` | разобраться, как работает существующая фича |
| Ревью | `code-reviewer` | после любых заметных изменений |
| | `react-reviewer` | изменения в `frontend/src` (хуки, рендеры) |
| | `typescript-reviewer` | JS/Node-код бэкенда: async, ошибки, безопасность |
| | `database-reviewer` | SQL-запросы, миграции, индексы |
| | `security-reviewer` | авторизация, JWT, ввод пользователя, деньги |
| | `silent-failure-hunter` | проглоченные ошибки и пустые `catch` |
| Починка | `build-error-resolver` | упала сборка или линт |
| | `react-build-resolver` | ошибки Vite/React-сборки |
| Тесты | `tdd-guide` | писать фичу через тесты |
| | `e2e-runner` | сквозные тесты на Playwright |
| Поддержка | `refactor-cleaner` | удалить мёртвый код и дубли |
| | `performance-optimizer` | медленные страницы или запросы |
| | `doc-updater` | обновить README и документацию |

## Скиллы — `skills/`

| Группа | Скиллы |
|---|---|
| Общее | `coding-standards`, `search-first` (сначала поискать готовое), `codebase-onboarding`, `architecture-decision-records` |
| Бэкенд и API | `api-design`, `backend-patterns`, `error-handling` |
| База данных | `postgres-patterns`, `database-migrations` |
| Фронтенд | `react-patterns`, `react-performance`, `frontend-patterns`, `vite-patterns` |
| UI и дизайн | `design-system`, `make-interfaces-feel-better`, `frontend-a11y` |
| Тестирование | `tdd-workflow`, `react-testing`, `e2e-testing`, `browser-qa` |
| Качество | `verification-loop` (сборка, линт, тесты, безопасность перед сдачей), `security-review` |
| Git и деплой | `git-workflow`, `deployment-patterns`, `docker-patterns` |
| Медиа | `watch`: посмотреть видео по ссылке и ответить на вопросы |

## Правила — `rules/`

Правила подключаются по путям (`paths:` во frontmatter), поэтому не забивают контекст, пока Claude не работает с подходящими файлами.

- `typescript/`: стиль, паттерны и безопасность для `.js/.jsx/.ts/.tsx`
- `react/`: компоненты, хуки, безопасность и тесты для `.jsx`
- `web/`: CSS и HTML, качество дизайна, производительность

## Как добавить ещё

- Скилл: папка `skills/<имя>/SKILL.md`. В ECC их больше 300; берите только то, что реально нужно.
- Агент: файл `agents/<имя>.md`.
- Перед добавлением чужого скилла прочитайте его код: скиллы и хуки запускают команды на машине.
