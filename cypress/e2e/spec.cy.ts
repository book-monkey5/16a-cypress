describe('BookMonkey', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should open the home page by default', () => {
    cy.get('h1')
      .should('contain', 'Home');
    cy.url()
      .should('contain', '/home');
  });

  it('should not show the administration form when not logged in', () => {
    cy.get('nav button')
      .as('loginLogoutBtn')
      .contains('Logout')
      .should('have.class', 'red')
      .click();
    cy.get('@loginLogoutBtn')
      .contains('Login')
      .should('have.class', 'green');
    cy.get('nav')
      .contains('Administration')
      .as('adminButton')
      .click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Not logged in!');
    });
    cy.url()
      .should('not.contain', '/admin/create');
    cy.get('@adminButton')
      .should('not.have.class', 'active');
  });

  it('should find all angular books using search input', () => {
    cy.intercept('GET', 'https://api5.angular-buch.com/books/search/Angular')
      .as('search');
    cy.get('input[type=search]')
      .clear()
      .type('Angular');
    cy.wait('@search')
      .its('response.statusCode')
      .should('eq', 200);
    cy.get('.search-results')
      .find('li')
      .should('have.length.gte', 3)
      .each(($li) => {
        cy.wrap($li).contains('Angular')
      });
  });

  it('should not open the results box on server errors', () => {
    cy.intercept('GET', 'https://api5.angular-buch.com/books/search/*', {
      statusCode: 500,
      body: '500 Internal Server Error',
    }).as('search');
    cy.get('input[type=search]')
      .clear()
      .type('Angular');
    cy.wait('@search');
    cy.get('.search-results')
      .should('not.exist');
  });

  it('should display the books list', () => {
    cy.intercept('https://api5.angular-buch.com/books', {
      fixture: 'books.json',
    });
    cy.get('nav')
      .contains('Books')
      .click();
    cy.get('.book-list')
      .children()
      .its('length')
      .should('eq', 1);
  });
});
