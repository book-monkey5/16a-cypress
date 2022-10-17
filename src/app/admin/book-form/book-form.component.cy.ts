import { HttpClientModule } from '@angular/common/http';
import { BookStoreService } from '../../shared/book-store.service';
import { BookFormComponent } from './book-form.component';

describe('BookFormComponent', () => {
  it('should be able to fill required fields', () => {
    cy.mount(BookFormComponent, {
      providers: [BookStoreService],
      imports: [HttpClientModule]
    });

    cy.get('#title').type('My Title');
    cy.get('#isbn').type('0123456789');
    cy.get('[aria-label="Author 0"').type('Erika Mustermann');
    cy.get('#description').type('My very first book');
    cy.get('#published').type('2022-09-10');
  });

  it('should prefill form with an existing book', () => {
    cy.mount(`<bm-book-form [book]="book" (submitBook)="submitBook.emit($event)"></bm-book-form>`, {
      declarations: [BookFormComponent],
      providers: [BookStoreService],
      imports: [HttpClientModule],
      componentProperties: {
        book: {
          isbn: '0123456789',
          title: 'My Title',
          authors: ['Erika Mustermann'],
          published: '2022-09-10'
        },
        submitBook: {
          emit: cy.spy().as('submitBookSpy')
        }
      }
    });

    //cy.get('button[type=submit]').as('submitBtn').should('not.have.attr', 'disabled').click()
    cy.get('button[type=submit]').click();
    // Assert
    cy.get('@submitBookSpy').should('have.been.calledWith', 1);
  });
});
