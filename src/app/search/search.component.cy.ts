import { HttpClientModule } from '@angular/common/http';
import { BookStoreService } from './../shared/book-store.service';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  it('should display search results', () => {
    cy.mount(`<bm-search></bm-search>`, {
      declarations: [SearchComponent],
      providers: [BookStoreService],
      imports: [HttpClientModule]
    });

    const book = {
      isbn: '0123456789',
      title: 'Some Book',
      authors: ['Author 1']
    };
    cy.intercept(
      'GET',
      'https://api5.angular-buch.com/books/search/*',
      { body: [book] }
    ).as('search');

    cy.get('input[type=search]')
      .clear()
      .type(book.title)
      .wait('@search');

    cy.get('.search-results > li')
      .its('length').should('eq', 1);
  });
});
