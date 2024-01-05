describe('Customer-myorder', () => {
  before(() => {
    cy.login();
    cy.intercept(
      'POST',
      'https://2k7ck56wbfhtrpzuvc66khvrae.appsync-api.us-east-1.amazonaws.com/graphql',
      (req) => {
        const { operationName } = req.body;
        console.log('requestbody', req.body);
        // if (operationName === 'sdfsdfsdf') {
        //     req.alias = "sdfsdfsdf"
        //     req.reply({
        //         fixture: 'currentOrders.json'
        //     })
        // }
      },
    );
  });
  it('tests Customer-myorder', () => {
    cy.get("[data-cy='userMenuBtn']").click();
    cy.get("[data-cy='myOrderMenuItem']").click();
    cy.get("[data-cy='currentOrdersRadio']").click();
    cy.get("[data-cy='deliveredOrdersRadio']").click();
    cy.get("[data-cy='cancelledOrdersRadio']").click();
    cy.get("[data-cy='currentOrdersRadio']").click();
    cy.get("[data-cy='calIcon'] > svg").click();
    cy.get("[data-cy='dateFilterAddBtn']").should('be.visible');
    cy.get("[data-cy='dateFilterAddBtn']").click();
    cy.get("[data-cy='dateFilterAddBtn']").should('not.be.visible');

    // cy.get("#accordion-button-116 > svg").click();

    // cy.get("#accordion-button-116 > svg > path:nth-child(2)").click();

    // cy.get("#accordion-button-116 > svg").click();

    // cy.get("#tabs-64--tabpanel-3 > div > div.css-itrg3p > div.css-0 > div:nth-child(1) > div.blockBg.css-1q4qdct > div > div > div > div > div.orderAccordianItem.css-v7dr8i > div.css-o5uqvq > div > div.css-1lekzkb > div.css-19dwi57 > button").click();

    // cy.get("#tabs-64--tabpanel-3 > div > div.myorderOption.css-4wng1d > div.css-3cdidt > div.css-1khs3ah > div.css-0 > div > div > svg").click();

    // cy.get("#tabs-64--tabpanel-3 > div > div.myorderOption.css-4wng1d > div.css-3cdidt > div.rmdp-container > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.rmdp-day-picker > div > div:nth-child(4) > div:nth-child(2) > span").click();

    // cy.get("#tabs-64--tabpanel-3 > div > div.myorderOption.css-4wng1d > div.css-3cdidt > div.rmdp-container > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.rmdp-day-picker > div > div:nth-child(5) > div.rmdp-day.rmdp-today > span").click();

    // cy.get("#tabs-64--tabpanel-3 > div > div.myorderOption.css-4wng1d > div.css-3cdidt > div.rmdp-container > div:nth-child(2) > div > div > button").click();

    // cy.get("#tabs-64--tabpanel-3 > div > div.myorderOption.css-4wng1d > div.css-3cdidt > div.css-1khs3ah > div.css-1v4xcoh > button").click();

    // cy.get("#tabs-64--tabpanel-3 > div > div.myorderOption.css-4wng1d > div.css-3cdidt > div.css-1khs3ah > div.css-0 > div > div > svg").click();

    // cy.get("#tabs-64--tabpanel-3 > div > div.myorderOption.css-4wng1d > div.css-3cdidt > div.rmdp-container > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.rmdp-day-picker > div > div:nth-child(2) > div:nth-child(2) > span").click();

    // cy.get("#tabs-64--tabpanel-3 > div > div.myorderOption.css-4wng1d > div.css-3cdidt > div.rmdp-container > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.rmdp-day-picker > div > div:nth-child(5) > div.rmdp-day.rmdp-today > span").click();

    // cy.get("#tabs-64--tabpanel-3 > div > div.myorderOption.css-4wng1d > div.css-3cdidt > div.rmdp-container > div:nth-child(2) > div > div > button").click();

    // cy.get("#tabs-64--tabpanel-3 > div > div.myorderOption.css-4wng1d > div.css-3cdidt > div.css-1khs3ah > div.css-1v4xcoh > button").click();
  });
});
