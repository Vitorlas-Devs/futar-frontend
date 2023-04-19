context('Test login / logout', () => {
  beforeEach(() => {
    cy.visit('/account')
  })

  it('login', () => {
    cy.url().should('eq', 'http://localhost:8080/account')

    cy.get('[data-test="btnLoginLogout"]').then(($btn) => {
      if ($btn.text() === 'Show login dialog') {
        cy.dataCy('btnLoginLogout').should('exist')
        cy.get('[data-test="btnLoginLogout"]').click()
        cy.get('[data-test="QInputEmail"]').clear()
        cy.get('[data-test="QInputEmail"]').type('student001@jedlik.eu')
        cy.get('[data-test="QInputPassword"]').clear()
        cy.get('[data-test="QInputPassword"]').type('student001')

        cy.get('[data-test="btnLoginLogoutDialog"]').click()
        cy.get('[data-test="btnCloseDialog"]').click()
      }
      else {
        cy.url().should('eq', 'http://localhost:8080/account')
        cy.get('[data-test="btnLoginLogout"]').then(($btn) => {
          if ($btn.text() === 'Show logout dialog') {
            cy.get('[data-test="btnLoginLogout"]').click()
            cy.get('[data-test="btnLoginLogoutDialog"]').click()
            cy.get('[data-test="btnCloseDialog"]').click()
          }
        })
      }
    })
  })

  // it("logout", () => {
  //   cy.url().should("eq", "http://localhost:8080/account");
  //   cy.get('[data-test="btnLoginLogout"]').then(($btn) => {
  //     if ($btn.text() == "Show logout dialog") {
  //       cy.get('[data-test="btnLoginLogout"]').click();
  //       cy.get('[data-test="btnLoginLogoutDialog"]').click();
  //       cy.get('[data-test="btnCloseDialog"]').click();
  //     }
  //   });
  // });
})
