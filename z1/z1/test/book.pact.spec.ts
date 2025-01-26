import { Pact, Publisher } from '@pact-foundation/pact';
import { BookConsumerService } from '../src/book-consumer/book-consumer.service';
import { Test } from '@nestjs/testing';
import * as path from 'path';

describe('Book Service Contract Tests', () => {
  let getBooksProvider: Pact;
  let getBookByIdProvider: Pact;
  let bookConsumerService: BookConsumerService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: BookConsumerService,
          useFactory: () => {
            const service = new BookConsumerService();
            return service;
          },
        },
      ],
    }).compile();

    bookConsumerService = moduleRef.get<BookConsumerService>();
  });

  describe('getBooks', () => {
    beforeAll(async () => {
      getBooksProvider = new Pact({
        consumer: 'BookConsumer',
        provider: 'BookService',
        port: 3001,
        log: path.resolve(process.cwd(), 'logs', 'pact-getBooks.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
      });

      await getBooksProvider.setup();
      bookConsumerService['baseUrl'] = 'http://localhost:3001';

      return getBooksProvider.addInteraction({
        state: 'has some books',
        uponReceiving: 'a request for all books',
        withRequest: {
          method: 'GET',
          path: '/books',
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: [
            { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
            { id: 2, title: '1984', author: 'George Orwell' },
          ],
        },
      });
    });

    afterAll(async () => {
      await getBooksProvider.verify();
      await getBooksProvider.finalize();
    });

    it('returns the list of books', async () => {
      const books = await bookConsumerService.getBooks();
      expect(books).toHaveLength(2);
      expect(books[0].title).toBe('The Great Gatsby');
      expect(books[1].title).toBe('1984');
    });
  });

  describe('getBookById', () => {
    beforeAll(async () => {
      getBookByIdProvider = new Pact({
        consumer: 'BookConsumer',
        provider: 'BookService',
        port: 3002,
        log: path.resolve(process.cwd(), 'logs', 'pact-getBookById.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
      });

      await getBookByIdProvider.setup();
      bookConsumerService['baseUrl'] = 'http://localhost:3002';

      return getBookByIdProvider.addInteraction({
        state: 'has a book with ID 1',
        uponReceiving: 'a request for a book with ID 1',
        withRequest: {
          method: 'GET',
          path: '/books/1',
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
          },
        },
      });
    });

    afterAll(async () => {
      await getBookByIdProvider.verify();
      await getBookByIdProvider.finalize();
    });

    it('returns the specific book', async () => {
      const book = await bookConsumerService.getBookById(1);
      expect(book.id).toBe(1);
      expect(book.title).toBe('The Great Gatsby');
      expect(book.author).toBe('F. Scott Fitzgerald');
    });
  });

  // Publish contracts after all tests are done
  afterAll(async () => {
    const publisher = new Publisher({
      pactBrokerUrl: 'https://org-a-849e.pactflow.io',
      pactBrokerToken: process.env.PACTFLOW_TOKEN,
      consumerVersion: process.env.GIT_COMMIT || 'dev',
      branch: process.env.GIT_BRANCH || 'main',
    });

    await publisher.publishPacts();
  });
}); 