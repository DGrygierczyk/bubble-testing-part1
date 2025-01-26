import { Pact, Matchers } from '@pact-foundation/pact';
import { Test } from '@nestjs/testing';
import * as path from 'path';
import { PostsService } from '../src/posts/posts.service';

const { like, eachLike } = Matchers;

describe('Posts Service Contract Tests', () => {
  let provider: Pact;
  let postsService: PostsService;

  beforeAll(async () => {
    provider = new Pact({
      consumer: 'PostsConsumer',
      provider: 'JSONPlaceholder',
      port: 3000,
      log: path.resolve(process.cwd(), 'logs', 'pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
    });

    const moduleRef = await Test.createTestingModule({
      providers: [PostsService],
    }).compile();

    postsService = moduleRef.get<PostsService>(PostsService);
    postsService['baseUrl'] = 'http://localhost:3000';

    await provider.setup();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  describe('getPost', () => {
    beforeEach(() => {
      return provider.addInteraction({
        state: 'a post with ID 1 exists',
        uponReceiving: 'a request for post with ID 1',
        withRequest: {
          method: 'GET',
          path: '/posts/1',
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            userId: 1,
            id: 1,
            title: like('sunt aut facere repellat provident occaecati excepturi optio reprehenderit'),
            body: like('quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto'),
          },
        },
      });
    });

    afterEach(() => provider.verify());

    it('returns a post', async () => {
      const post = await postsService.getPost(1);
      expect(post.id).toBe(1);
      expect(post.userId).toBe(1);
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
    });
  });

  describe('getPosts', () => {
    beforeEach(() => {
      return provider.addInteraction({
        state: 'posts exist',
        uponReceiving: 'a request for all posts',
        withRequest: {
          method: 'GET',
          path: '/posts',
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: eachLike({
            userId: 1,
            id: 1,
            title: like('sunt aut facere repellat provident occaecati excepturi optio reprehenderit'),
            body: like('quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto'),
          }),
        },
      });
    });

    afterEach(() => provider.verify());

    it('returns a list of posts', async () => {
      const posts = await postsService.getPosts();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
      posts.forEach(post => {
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('userId');
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('body');
      });
    });
  });
}); 