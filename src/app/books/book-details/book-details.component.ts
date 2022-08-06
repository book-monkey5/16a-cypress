import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BookStoreService } from '../../shared/book-store.service';
import { Book } from '../../shared/book';

@Component({
  selector: 'bm-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent {
  book?: Book;
  constructor(
    private service: BookStoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const isbn = this.route.snapshot.paramMap.get('isbn')!;
    this.service.getSingle(isbn).subscribe(book => {
      this.book = book;
    });
  }

  removeBook() {
    if (this.book) {
      this.service.remove(this.book.isbn).subscribe(() => {
        this.router.navigateByUrl('/books');
      });
    }
  }
}
