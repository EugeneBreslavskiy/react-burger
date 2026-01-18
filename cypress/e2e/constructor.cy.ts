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

    cy.visit('/');
    cy.waitForIngredients();
  });

  it('должен отображать список ингредиентов', () => {
    cy.get(SELECTORS.ingredient).should('have.length.greaterThan', 0);
  });

  it('должен перетаскивать ингредиент в конструктор', () => {
    cy.dragIngredientToConstructor(SELECTORS.ingredient);
    
    // Проверяем, что ингредиент добавлен в конструктор
    cy.get(SELECTORS.constructorElement).should('exist');
  });

  it('должен добавлять несколько ингредиентов в конструктор', () => {
    // Добавляем булку
    cy.addBunToConstructor();
    
    // Добавляем начинку
    cy.addMainIngredientToConstructor();
    
    // Проверяем наличие ингредиентов в конструкторе
    cy.get(SELECTORS.constructorElement).should('have.length.greaterThan', 1);
  });

  it('должен отображать общую стоимость заказа', () => {
    // Добавляем булку
    cy.addBunToConstructor();
    
    // Проверяем, что отображается цена
    cy.contains('[class*="BurgerCredit"]', /\d+/).should('exist');
  });

  it('должен создавать заказ при клике на кнопку "Оформить заказ"', () => {
    // Мокаем авторизацию (устанавливаем токен в cookie)
    cy.setCookie('accessToken', 'test-token');
    
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

  it('должен перенаправлять на страницу логина, если пользователь не авторизован', () => {
    // Убеждаемся, что нет токена
    cy.clearCookies();
    
    // Добавляем булку
    cy.addBunToConstructor();
    
    // Пытаемся создать заказ
    cy.get(SELECTORS.orderButton).click();
    
    // Проверяем, что произошел редирект на страницу логина
    cy.url().should('include', '/login');
  });

  it('должен закрывать модальное окно при клике на крестик', () => {
    // Мокаем авторизацию
    cy.setCookie('accessToken', 'test-token');
    
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

  it('должен закрывать модальное окно при нажатии Escape', () => {
    // Мокаем авторизацию
    cy.setCookie('accessToken', 'test-token');
    
    // Добавляем булку
    cy.addBunToConstructor();
    
    // Создаем заказ
    cy.createOrder();
    
    // Проверяем, что модальное окно открылось
    cy.get(SELECTORS.modal).should('be.visible');
    
    // Нажимаем Escape
    cy.get('body').type('{esc}');
    
    // Проверяем, что модальное окно закрылось
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('должен закрывать модальное окно при клике на overlay', () => {
    // Мокаем авторизацию
    cy.setCookie('accessToken', 'test-token');
    
    // Добавляем булку
    cy.addBunToConstructor();
    
    // Создаем заказ
    cy.createOrder();
    
    // Проверяем, что модальное окно открылось
    cy.get(SELECTORS.modal).should('be.visible');
    
    // Кликаем на overlay
    cy.get(SELECTORS.modalOverlay).click({ force: true });
    
    // Проверяем, что модальное окно закрылось
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('должен отображать кнопку "Оформить заказ" как неактивную, если нет булки', () => {
    // Добавляем только начинку (без булки)
    cy.addMainIngredientToConstructor();
    
    // Проверяем, что кнопка неактивна
    cy.get(SELECTORS.orderButton).should('be.disabled');
  });

  it('должен удалять ингредиент из конструктора при клике на крестик', () => {
    // Добавляем начинку
    cy.addMainIngredientToConstructor();
    
    // Проверяем, что ингредиент добавлен
    cy.get(SELECTORS.constructorElement).should('exist');
    
    // Удаляем ингредиент (кликаем на крестик)
    cy.get(SELECTORS.constructorElement).first().within(() => {
      cy.get('button').last().click();
    });
    
    // Проверяем, что ингредиент удален (если это был единственный ингредиент, должен появиться placeholder)
    cy.contains('Перетащите ингредиенты сюда').should('exist');
  });
});
