import { SELECTORS } from '../support/commands';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Мокаем API для получения ингредиентов
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    
    // Мокаем API для создания заказа
    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Краторный space бургер',
        order: {
          number: 12345,
        },
      },
    }).as('createOrder');
    
    // Мокаем API для проверки авторизации (для тестов с созданием заказа)
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Test User',
        },
      },
    }).as('getUser');
    
    // Устанавливаем cookie для авторизации (для тестов с созданием заказа)
    cy.setCookie('accessToken', 'test-token');

    cy.visit('/');
    cy.waitForIngredients();
  });

  it('должен перетаскивать ингредиент в конструктор', () => {
    cy.get(SELECTORS.ingredient).first().should('be.visible');
    cy.get(SELECTORS.constructor).first().should('be.visible');
    
    // Используем кастомную команду для drag and drop
    cy.window().then((win) => {
      (win as any).__cypressDataTransfer = new win.DataTransfer();
    });
    
    cy.get(SELECTORS.ingredient).first().then(() => {
      cy.window().then((win) => {
        const dataTransfer = (win as any).__cypressDataTransfer;
        
        cy.get(SELECTORS.ingredient).first()
          .trigger('dragstart', { dataTransfer, force: true });
        
        cy.get(SELECTORS.constructor).first()
          .trigger('dragenter', { dataTransfer, force: true })
          .trigger('dragover', { dataTransfer, force: true })
          .trigger('drop', { dataTransfer, force: true });
        
        cy.get(SELECTORS.ingredient).first()
          .trigger('dragend', { force: true });
      });
    });
    
    // Даем время для обновления UI
    cy.wait(500);
    
    // Проверяем, что ингредиент добавлен в конструктор
    cy.get(SELECTORS.constructorElement).should('exist');
  });

  it('должен открывать модальное окно с описанием ингредиента', () => {
    // Кликаем на первый ингредиент
    cy.get(SELECTORS.ingredient).first().click();
    
    // Проверяем, что модальное окно открылось
    cy.get(SELECTORS.modal).should('be.visible');
    
    // Проверяем, что отображается заголовок "Детали ингредиента"
    cy.contains('Детали ингредиента').should('exist');
  });

  it('должен отображать данные ингредиента в модальном окне', () => {
    // Кликаем на первый ингредиент (Краторная булка N-200i из fixtures)
    cy.get(SELECTORS.ingredient).first().click();
    
    // Проверяем, что модальное окно открылось
    cy.get(SELECTORS.modal).should('be.visible');
    
    // Проверяем, что отображается название ингредиента
    cy.contains('Краторная булка N-200i').should('exist');
    
    // Проверяем, что отображаются данные о питательных веществах
    cy.contains('Калории,ккал').should('exist');
    cy.contains('Белки, г').should('exist');
    cy.contains('Жиры, г').should('exist');
    cy.contains('Углеводы, г').should('exist');
  });

  it('должен создавать заказ при клике на кнопку "Оформить заказ"', () => {
    // Добавляем булку (обязательно для создания заказа)
    cy.addBunToConstructor();
    
    // Добавляем начинку
    cy.addMainIngredientToConstructor();
    
    // Создаем заказ
    cy.createOrder();
    
    // Проверяем, что модальное окно открылось
    cy.get(SELECTORS.modal).should('be.visible');
    
    // Проверяем, что отображается номер заказа
    cy.contains('12345').should('exist');
    cy.contains('идентификатор заказа').should('exist');
  });

  it('должен закрывать модальное окно при клике на кнопку закрытия', () => {
    // Добавляем булку
    cy.addBunToConstructor();
    
    // Создаем заказ
    cy.createOrder();
    
    // Проверяем, что модальное окно открылось
    cy.get(SELECTORS.modal).should('be.visible');
    
    // Закрываем модальное окно
    cy.get(SELECTORS.modalCloseIcon).click();
    
    // Проверяем, что модальное окно закрылось
    cy.get(SELECTORS.modal).should('not.exist');
  });
});
