describe('Customer-Anonymous User - Place Order', () => {
  before(() => {
    cy.anonymousUser();
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
  });
  it('enter the delivery address', () => {
    cy.get('h1').contains('Enter Delivery Address').should('be.visible');
    let deliveryAddresInput = cy.get("input[placeholder='Enter full address']");
    deliveryAddresInput.should('be.visible');
    // const CancelButton = cy.get('button').contains('Cancel');
    // CancelButton.should('be.visible');
    // CancelButton.click();

    cy.get('button').contains('Add').click();
    deliveryAddresInput = cy.get("input[placeholder='Enter full address']");
    deliveryAddresInput.should('be.visible');
    deliveryAddresInput.click();
    deliveryAddresInput.type('24 Glacier Dr West Windsor USA 08550');
    cy.get('button').contains('Set Default Address').click();
    cy.wait(4000);
  });
  it('Add the product to Cart', () => {
    const addCartBtn = cy.get('button').contains('Add to Cart').first();
    addCartBtn.click();
    cy.wait(2000);
    cy.get("div[role='alert']")
      .find('div')
      .contains('Product added to cart')
      .should('be.visible');
    cy.get('button').contains('View Cart').click();
    cy.get('button').contains('Close').click();
    cy.get('button').contains('Yes').click();
    cy.get('button').contains('Skip Now').click();
    cy.get('a')
      .contains('Martini & Rossi Rose Wine Rose Blend')
      .should('be.visible');
    cy.get('button').contains('Proceed To Checkout').click();
    cy.get('#userId').click();
    cy.get('#userId').type('arun');
    cy.get('#password').click();
    cy.get('#password').type('Simple@123');
    cy.get("section[role='dialog']").find("[data-cy='loginBtn']").click();
  });
});
