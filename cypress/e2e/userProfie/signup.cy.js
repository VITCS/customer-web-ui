describe('Customer - Signup', () => {
  it('User Signup with 1800Spirits', () => {
    cy.visit('/');

    cy.get('[data-cy="welcomeCloseBtn"]').click();

    cy.get("[data-cy='ageLimitYesbtn']").click();

    cy.get('[data-cy="signUpBtn"]').click();

    cy.get('#username').click();
    cy.get('#username').type('Toram');
    cy.get('#given_name').click();
    cy.get('#given_name').type('Bapi');
    cy.get('#family_name').click();
    cy.get('#family_name').type('Naidu');
    cy.get('#password').click();
    cy.get('#password').type('Test@123');
    cy.get('#confirmPassword').click();
    cy.get('#confirmPassword').type('Test@123');
    cy.get('#email').click();
    cy.get('#email').type('bapi1@1800spirits.com');
    cy.get('#country_code').click();
    cy.get('#country_code').type('+91');
    cy.get('#phone_number').click();
    cy.get('#phone_number').type('9121578085');
    cy.get('[data-cy="nextBtn"]').click();
    cy.get('#searchAddressInput').click();
    cy.get('#searchAddressInput').type(
      '24 Glacier Drive, West Windsor, NJ 08550',
    );
    cy.get('#searchAddressInput').click();
    const searchList = cy
      .get('#searchAddressInput')
      .parent('div')
      .parent('div')
      .find('ul');
    searchList.should('be.visible');
    searchList.find('li').click();
    cy.get('select').select('Home').should('have.value', 'Home');
    cy.get('[data-cy="finishBtn"]').click();
    cy.get('[data-cy="verifyNotificationBtn"]').click();
    cy.get('#code').click();
    cy.get('#code').type('991611');
    cy.get('[data-cy="verifyBtn"]').click();
    cy.get('#userId').click();
    cy.get('#userId').type('Test');
    cy.get('#password').type('Test@123');
    cy.get('[data-cy=loginBtn]').click();
    cy.get('[data-cy=userMenuBtn]').click();
    cy.get('#menu-list-66-menuitem-58').click();
  });
});
