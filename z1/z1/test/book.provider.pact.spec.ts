import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Verifier } from '@pact-foundation/pact';
import * as path from 'path';
import { BookModule } from '../src/book/book.module';

describe('Book Provider Verification', () => {
  let app: INestApplication;
  const port = 3000;

  beforeAll(async () => {
    // Create the NestJS application
    const moduleRef = await Test.createTestingModule({
      imports: [BookModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.listen(port);
  });

  afterAll(async () => {
    await app.close();
  });

  it('validates the expectations of BookConsumer', async () => {
    const verifier = new Verifier({
      provider: 'BookService',
      providerBaseUrl: `http://localhost:${port}`,
      pactBrokerUrl: 'https://org-a-849e.pactflow.io',
      pactBrokerToken: process.env.PACTFLOW_TOKEN,
      publishVerificationResult: true,
      providerVersion: process.env.GIT_COMMIT || 'dev',
      providerVersionBranch: process.env.GIT_BRANCH || 'main',
      enablePending: true,
      includeWipPactsSince: '2024-01-01',
      consumerVersionSelectors: [
        { mainBranch: true },
        { branch: process.env.GIT_BRANCH || 'main' },
        { deployedOrReleased: true }
      ],
      stateHandlers: {
        'has some books': async () => {
          // The books are already in our service's default state
          return Promise.resolve();
        },
        'has a book with ID 1': async () => {
          // The book with ID 1 is already in our service's default state
          return Promise.resolve();
        },
      },
    });

    await verifier.verifyProvider();
  }, 30000);
}); 