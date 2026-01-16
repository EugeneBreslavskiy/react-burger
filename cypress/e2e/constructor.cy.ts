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
    cy.wait('@getIngredients');
  });

  it('должен отображать список ингредиентов', () => {
    cy.get('[class*="burgerIngredient"]').should('have.length.greaterThan', 0);
  });

  it('должен перетаскивать ингредиент в конструктор', () => {
    // Находим первый ингредиент (булку)
    cy.get('[data-id]').first().as('ingredient');
    
    // Находим зону конструктора
    cy.get('[class*="BurgerConstructor"]').as('constructor');
    
    // Перетаскиваем ингредиент используя dataTransfer
    const dataTransfer = new DataTransfer();
    cy.get('@ingredient')
      .trigger('dragstart', { dataTransfer });
    cy.get('@constructor')
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });
    
    // Проверяем, что ингредиент добавлен в конструктор
    cy.get('[class*="ConstructorElement"]').should('exist');
  });

  it('должен добавлять несколько ингредиентов в конструктор', () => {
    // Добавляем булку
    const dataTransfer1 = new DataTransfer();
    cy.get('[data-id]').first()
      .trigger('dragstart', { dataTransfer: dataTransfer1 });
    cy.get('[class*="BurgerConstructor"]')
      .trigger('dragover', { dataTransfer: dataTransfer1 })
      .trigger('drop', { dataTransfer: dataTransfer1 });
    
    // Добавляем начинку (ищем ингредиент типа main)
    const dataTransfer2 = new DataTransfer();
    cy.get('[data-id]').eq(1)
      .trigger('dragstart', { dataTransfer: dataTransfer2 });
    cy.get('[class*="BurgerConstructor"]')
      .trigger('dragover', { dataTransfer: dataTransfer2 })
      .trigger('drop', { dataTransfer: dataTransfer2 });
    
    // Проверяем наличие ингредиентов в конструкторе
    cy.get('[class*="ConstructorElement"]').should('have.length.greaterThan', 1);
  });

  it('должен отображать общую стоимость заказа', () => {
    // Добавляем булку
    const dataTransfer = new DataTransfer();
    cy.get('[data-id]').first()
      .trigger('dragstart', { dataTransfer });
    cy.get('[class*="BurgerConstructor"]')
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });
    
    // Проверяем, что отображается цена
    cy.contains('[class*="BurgerCredit"]', /\d+/).should('exist');
  });

  it('должен создавать заказ при клике на кнопку "Оформить заказ"', () => {
    // Мокаем авторизацию (устанавливаем токен в cookie)
    cy.setCookie('accessToken', 'test-token');
    
    // Добавляем булку (обязательно для создания заказа)
    const dataTransfer1 = new DataTransfer();
    cy.get('[data-id]').first()
      .trigger('dragstart', { dataTransfer: dataTransfer1 });
    cy.get('[class*="BurgerConstructor"]')
      .trigger('dragover', { dataTransfer: dataTransfer1 })
      .trigger('drop', { dataTransfer: dataTransfer1 });
    
    // Добавляем начинку
    const dataTransfer2 = new DataTransfer();
    cy.get('[data-id]').eq(1)
      .trigger('dragstart', { dataTransfer: dataTransfer2 });
    cy.get('[class*="BurgerConstructor"]')
      .trigger('dragover', { dataTransfer: dataTransfer2 })
      .trigger('drop', { dataTransfer: dataTransfer2 });
    
    // Нажимаем кнопку "Оформить заказ"
    cy.contains('button', 'Оформить заказ').click();
    
    // Ждем ответа от API
    cy.wait('@createOrder');
    
    // Проверяем, что модальное окно открылось
    cy.get('[class*="modal"]').should('be.visible');
    
    // Проверяем, что отображается номер заказа
    cy.contains('12345').should('exist');
    cy.contains('идентификатор заказа').should('exist');
  });

  it('должен перенаправлять на страницу логина, если пользователь не авторизован', () => {
    // Убеждаемся, что нет токена
    cy.clearCookies();
    
    // Добавляем булку
    const dataTransfer = new DataTransfer();
    cy.get('[data-id]').first()
      .trigger('dragstart', { dataTransfer });
    cy.get('[class*="BurgerConstructor"]')
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });
    
    // Пытаемся создать заказ
    cy.contains('button', 'Оформить заказ').click();
    
    // Проверяем, что произошел редирект на страницу логина
    cy.url().should('include', '/login');
  });

  it('должен закрывать модальное окно при клике на крестик', () => {
    // Мокаем авторизацию
    cy.setCookie('accessToken', 'test-token');
    
    // Добавляем булку
    const dataTransfer = new DataTransfer();
    cy.get('[data-id]').first()
      .trigger('dragstart', { dataTransfer });
    cy.get('[class*="BurgerConstructor"]')
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });
    
    // Создаем заказ
    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');
    
    // Проверяем, что модальное окно открылось
    cy.get('[class*="modal"]').should('be.visible');
    
    // Закрываем модальное окно
    cy.get('[class*="modalCloseIcon"]').click();
    
    // Проверяем, что модальное окно закрылось
    cy.get('[class*="modal"]').should('not.exist');
  });

  it('должен закрывать модальное окно при нажатии Escape', () => {
    // Мокаем авторизацию
    cy.setCookie('accessToken', 'test-token');
    
    // Добавляем булку
    const dataTransfer = new DataTransfer();
    cy.get('[data-id]').first()
      .trigger('dragstart', { dataTransfer });
    cy.get('[class*="BurgerConstructor"]')
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });
    
    // Создаем заказ
    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');
    
    // Проверяем, что модальное окно открылось
    cy.get('[class*="modal"]').should('be.visible');
    
    // Нажимаем Escape
    cy.get('body').type('{esc}');
    
    // Проверяем, что модальное окно закрылось
    cy.get('[class*="modal"]').should('not.exist');
  });

  it('должен закрывать модальное окно при клике на overlay', () => {
    // Мокаем авторизацию
    cy.setCookie('accessToken', 'test-token');
    
    // Добавляем булку
    const dataTransfer = new DataTransfer();
    cy.get('[data-id]').first()
      .trigger('dragstart', { dataTransfer });
    cy.get('[class*="BurgerConstructor"]')
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });
    
    // Создаем заказ
    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');
    
    // Проверяем, что модальное окно открылось
    cy.get('[class*="modal"]').should('be.visible');
    
    // Кликаем на overlay
    cy.get('[class*="modalOverlay"]').click({ force: true });
    
    // Проверяем, что модальное окно закрылось
    cy.get('[class*="modal"]').should('not.exist');
  });

  it('должен отображать кнопку "Оформить заказ" как неактивную, если нет булки', () => {
    // Добавляем только начинку (без булки)
    const dataTransfer = new DataTransfer();
    cy.get('[data-id]').eq(1)
      .trigger('dragstart', { dataTransfer });
    cy.get('[class*="BurgerConstructor"]')
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });
    
    // Проверяем, что кнопка неактивна
    cy.contains('button', 'Оформить заказ').should('be.disabled');
  });

  it('должен удалять ингредиент из конструктора при клике на крестик', () => {
    // Добавляем начинку
    const dataTransfer = new DataTransfer();
    cy.get('[data-id]').eq(1)
      .trigger('dragstart', { dataTransfer });
    cy.get('[class*="BurgerConstructor"]')
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });
    
    // Проверяем, что ингредиент добавлен
    cy.get('[class*="ConstructorElement"]').should('exist');
    
    // Удаляем ингредиент (кликаем на крестик)
    cy.get('[class*="ConstructorElement"]').first().within(() => {
      cy.get('button').last().click();
    });
    
    // Проверяем, что ингредиент удален (если это был единственный ингредиент, должен появиться placeholder)
    cy.contains('Перетащите ингредиенты сюда').should('exist');
  });
});
