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
       * Custom command to drag and drop an element
       * @example cy.dragAndDrop('[data-cy=draggable]', '[data-cy=dropzone]')
       */
      dragAndDrop(source: string, target: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('dragAndDrop', (source: string, target: string) => {
  cy.get(source).trigger('dragstart', { dataTransfer: new DataTransfer() });
  cy.get(target).trigger('drop', { dataTransfer: new DataTransfer() });
});

export {};
