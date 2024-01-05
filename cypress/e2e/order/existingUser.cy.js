describe('Customer User - Place Order', () => {
  before(() => {
    cy.existingUserLogin();
  });
  it('search the product', () => {
    const searchInput = cy
      .get('input[placeholder="Search for Products"]')
      .first();
    searchInput.should('be.visible');
    searchInput.click();
    searchInput.type('martini rossi rose');

    const searchList = searchInput.parent('div').parent('div').find('ul');
    searchList.should('be.visible');

    searchList.find('li:nth-child(2) > a').click();
    cy.wait(4000);

    const addCartBtn = cy.get('button').contains('Add to Cart').first();
    addCartBtn.click();
    cy.wait(2000);
    cy.get("div[role='alert']")
      .find('div')
      .contains('Product added to cart')
      .should('be.visible');
    cy.get('button').contains('View Cart').click();
    cy.wait(2000);
    cy.get('button').contains('Proceed To Checkout').click();
    cy.wait(4000);
    cy.get('div')
      .find('div')
      .contains('Checkout Information')
      .should('be.visible');
  });
});
