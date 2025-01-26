import { Injectable } from '@nestjs/common';
import { Book } from '../book/book.service';
import fetch from 'node-fetch';

@Injectable()
export class BookConsumerService {
  private baseUrl = 'http://localhost:3000';

  async getBooks(): Promise<Book[]> {
    const response = await fetch(`${this.baseUrl}/books`);
    return response.json();
  }

  async getBookById(id: number): Promise<Book> {
    const response = await fetch(`${this.baseUrl}/books/${id}`);
    if (!response.ok) {
      throw new Error('Book not found');
    }
    return response.json();
  }
}
