/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to drag and drop an element
     * @example cy.dragAndDrop('[data-cy=draggable]', '[data-cy=dropzone]')
     */
    dragAndDrop(source: string, target: string): Chainable<void>;
  }
}
