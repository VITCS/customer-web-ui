// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import '@testing-library/cypress/add-commands';

Cypress.Commands.add('login', (username = 'arun', password = 'Simple@123') => {
    cy.visit("/");
    cy.get('[data-cy="welcomeCloseBtn"]').click();
    cy.get("[data-cy='ageLimitYesbtn']").click();
    cy.get("#userId").click();
    cy.get("#userId").type("arun");
    cy.get("#password").click();
    cy.get("#password").type("Simple@123");
    cy.get("section[role='dialog']").find("[data-cy='loginBtn']").click();
    cy.wait(8000);
    cy.findAllByText("Arun").should('exist');
    cy.get("[data-cy='userMenuBtn']").should('be.visible');
});

Cypress.Commands.add('anonymousUser', () => {
  cy.visit('/');
  cy.get('[data-cy="welcomeCloseBtn"]').click();
  cy.get("[data-cy='ageLimitYesbtn']").click();
  cy.get("[data-cy='skipNowBtn']").click();
  cy.get("[data-cy='loginBtn']").should('be.visible');
});

Cypress.Commands.add(
  'existingUserLogin',
  (username = 'arun', password = 'Simple@123') => {
    cy.visit('/');
    cy.get('[data-cy="welcomeCloseBtn"]').click();
    cy.get("[data-cy='ageLimitYesbtn']").click();
    cy.get('#userId').click();
    cy.get('#userId').type('arun');
    cy.get('#password').click();
    cy.get('#password').type('Simple@123');
    cy.get("section[role='dialog']").find("[data-cy='loginBtn']").click();
    cy.wait(8000);
  },
);
