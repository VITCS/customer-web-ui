/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('example to-do app', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:3000');
    cy.on('uncaught:exception', (err, runnable) => {
      console.log(err);
      // returning false here prevents Cypress from
      // failing the test
      return false;
    });
  });

  it('user should see promotion text  ', () => {
    cy.wait(1000);
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.findByText(/You are in the right place/i);
  });

  // it("user should see age confirmation dialog", () => {
  //   cy.wait(1000);

  //   cy.
  // })
});
