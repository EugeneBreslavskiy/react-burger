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
       * Custom command to drag ingredient to constructor
       * @example cy.dragIngredientToConstructor('[data-id="bun-1"]')
       */
      dragIngredientToConstructor(ingredientSelector: string): Chainable<void>;
      
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
  constructor: '[class*="BurgerConstructor"]',
  orderButton: 'button:contains("Оформить заказ")',
  modal: '[class*="modal"]',
  modalCloseIcon: '[class*="modalCloseIcon"]',
  modalOverlay: '[class*="modalOverlay"]',
  constructorElement: '[class*="ConstructorElement"]',
  emptyConstructor: ':contains("Перетащите ингредиенты сюда")',
} as const;

// Функция для перетаскивания ингредиента
Cypress.Commands.add('dragIngredientToConstructor', (ingredientSelector: string) => {
  cy.get(ingredientSelector).first().as('ingredient');
  cy.get(SELECTORS.constructor).as('constructor');
  
  const dataTransfer = new DataTransfer();
  cy.get('@ingredient')
    .trigger('dragstart', { dataTransfer });
  cy.get('@constructor')
    .trigger('dragover', { dataTransfer })
    .trigger('drop', { dataTransfer });
});

// Добавление булки
Cypress.Commands.add('addBunToConstructor', () => {
  cy.get(SELECTORS.ingredient).first().as('bun');
  cy.get(SELECTORS.constructor).as('constructor');
  
  const dataTransfer = new DataTransfer();
  cy.get('@bun')
    .trigger('dragstart', { dataTransfer });
  cy.get('@constructor')
    .trigger('dragover', { dataTransfer })
    .trigger('drop', { dataTransfer });
});

// Добавление начинки
Cypress.Commands.add('addMainIngredientToConstructor', () => {
  cy.get(SELECTORS.ingredient).eq(1).as('mainIngredient');
  cy.get(SELECTORS.constructor).as('constructor');
  
  const dataTransfer = new DataTransfer();
  cy.get('@mainIngredient')
    .trigger('dragstart', { dataTransfer });
  cy.get('@constructor')
    .trigger('dragover', { dataTransfer })
    .trigger('drop', { dataTransfer });
});

// Создание заказа
Cypress.Commands.add('createOrder', () => {
  cy.get(SELECTORS.orderButton).click();
  cy.wait('@createOrder');
});

// Ожидание загрузки ингредиентов
Cypress.Commands.add('waitForIngredients', () => {
  cy.wait('@getIngredients');
});

export { SELECTORS };
