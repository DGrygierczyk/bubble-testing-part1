import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBooks() {
    return this.bookService.getBooks();
  }

  @Get(':id')
  getBookById(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.getBookById(id);
  }
}
