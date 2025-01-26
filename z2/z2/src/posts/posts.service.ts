import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Injectable()
export class PostsService {
  private baseUrl = 'https://jsonplaceholder.typicode.com';

  async getPost(id: number): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts/${id}`);
    if (!response.ok) {
      throw new Error('Post not found');
    }
    return response.json();
  }

  async getPosts(): Promise<Post[]> {
    const response = await fetch(`${this.baseUrl}/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  }
} 