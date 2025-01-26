import { Injectable } from '@nestjs/common';

export interface Book {
  id: number;
  title: string;
  author: string;
}

@Injectable()
export class BookService {
  private books: Book[] = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: '1984', author: 'George Orwell' },
  ];

  async getBooks(): Promise<Book[]> {
    return this.books;
  }

  async getBookById(id: number): Promise<Book | undefined> {
    return this.books.find((book) => book.id === id);
  }
}
