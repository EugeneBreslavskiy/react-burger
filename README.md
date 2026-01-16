# React Burger

Проект конструктора бургеров на React с TypeScript.

## Запуск проекта

```bash
npm install
npm start
```

## Тестирование

### Тесты редьюсеров

Все редьюсеры покрыты unit-тестами. Для запуска тестов:

```bash
npm test
```

Тесты находятся рядом с каждым редьюсером в файлах `*.test.ts`:
- `src/services/ingredientsSlice.test.ts`
- `src/services/constructorSlice.test.ts`
- `src/services/orderSlice.test.ts`
- `src/services/authSlice.test.ts`
- `src/services/orderIdSlice.test.ts`
- `src/services/ingredientIdSlice.test.ts`
- `src/services/ordersWebSocketSlice.test.ts`
- `src/services/ingredientSlice.test.ts`

### Функциональные тесты (Cypress)

Для запуска Cypress тестов:

```bash
# Открыть Cypress в интерактивном режиме
npm run cypress:open

# Запустить тесты в headless режиме
npm run cypress:run
```

**Важно:** Перед запуском Cypress тестов убедитесь, что приложение запущено на `http://localhost:3000`:

```bash
npm start
```

Функциональные тесты находятся в `cypress/e2e/constructor.cy.ts` и покрывают:
- Перетаскивание ингредиентов в конструктор
- Создание заказа
- Работу модальных окон
- Удаление ингредиентов из конструктора

## Деплой

Для деплоя на GitHub Pages:

```bash
npm run deploy
```
