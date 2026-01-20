/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to add bun to constructor
       * @example cy.addBunToConstructor()
       */
      addBunToConstructor(): Chainable<void>;
      
      /**
       * Custom command to add main ingredient to constructor
       * @example cy.addMainIngredientToConstructor()
       */
      addMainIngredientToConstructor(): Chainable<void>;
      
      /**
       * Custom command to create order
       * @example cy.createOrder()
       */
      createOrder(): Chainable<void>;
      
      /**
       * Custom command to wait for ingredients to load
       * @example cy.waitForIngredients()
       */
      waitForIngredients(): Chainable<void>;
    }
  }
}

// Селекторы
const SELECTORS = {
  ingredient: '[data-id]',
  constructor: 'section > div[class*="BurgerConstructor"]', // Первый div с классом BurgerConstructor внутри section (это элемент с dropRef)
  orderButton: 'button:contains("Оформить заказ")',
  modal: '[class*="modal"]',
  modalCloseIcon: '[class*="modalCloseIcon"]',
  modalOverlay: '[class*="modalOverlay"]',
  constructorElement: '[class*="constructor-element"]', // Библиотека создает класс constructor-element (с дефисом)
  burgerCredit: '[class*="burgerCredit"]', // CSS модуль создает класс burger-credit_burgerCredit__xxx
  emptyConstructor: ':contains("Перетащите ингредиенты сюда")',
} as const;

// Вспомогательная функция для drag and drop с react-dnd
// Использует реальные события через dispatchEvent для работы с HTML5Backend
const performDragDrop = (sourceSelector: string, targetSelector: string) => {
  cy.get(sourceSelector).first().then(($source) => {
    cy.get(targetSelector).first().then(($target) => {
      const sourceEl = $source[0];
      const targetEl = $target[0];
      
      cy.window().then((win) => {
        const dataTransfer = new win.DataTransfer();
        
        // Создаем события через createEvent с типом Event
        // dragstart
        const dragStartEvent = win.document.createEvent('Event');
        dragStartEvent.initEvent('dragstart', true, true);
        Object.defineProperty(dragStartEvent, 'dataTransfer', {
          value: dataTransfer,
          writable: false,
          configurable: true,
        });
        sourceEl.dispatchEvent(dragStartEvent);
        
        // dragenter
        const dragEnterEvent = win.document.createEvent('Event');
        dragEnterEvent.initEvent('dragenter', true, true);
        Object.defineProperty(dragEnterEvent, 'dataTransfer', {
          value: dataTransfer,
          writable: false,
          configurable: true,
        });
        targetEl.dispatchEvent(dragEnterEvent);
        
        // dragover
        const dragOverEvent = win.document.createEvent('Event');
        dragOverEvent.initEvent('dragover', true, true);
        Object.defineProperty(dragOverEvent, 'dataTransfer', {
          value: dataTransfer,
          writable: false,
          configurable: true,
        });
        targetEl.dispatchEvent(dragOverEvent);
        
        // drop
        const dropEvent = win.document.createEvent('Event');
        dropEvent.initEvent('drop', true, true);
        Object.defineProperty(dropEvent, 'dataTransfer', {
          value: dataTransfer,
          writable: false,
          configurable: true,
        });
        targetEl.dispatchEvent(dropEvent);
        
        // dragend
        const dragEndEvent = win.document.createEvent('Event');
        dragEndEvent.initEvent('dragend', true, true);
        sourceEl.dispatchEvent(dragEndEvent);
      });
    });
  });
  
  // Даем время для обновления UI
  cy.wait(500);
};

// Добавление булки
Cypress.Commands.add('addBunToConstructor', () => {
  performDragDrop(SELECTORS.ingredient, SELECTORS.constructor);
});

// Добавление начинки
Cypress.Commands.add('addMainIngredientToConstructor', () => {
  performDragDrop(SELECTORS.ingredient, SELECTORS.constructor);
});

// Создание заказа
Cypress.Commands.add('createOrder', () => {
  cy.get(SELECTORS.orderButton).click();
  cy.wait('@createOrder', { timeout: 20000 }); // Увеличиваем таймаут до 20 секунд для запроса, который может занимать до 15 секунд
});

// Ожидание загрузки ингредиентов
Cypress.Commands.add('waitForIngredients', () => {
  cy.wait('@getIngredients');
});

export { SELECTORS };
