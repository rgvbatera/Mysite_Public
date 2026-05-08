import { User } from './user.model';

export interface Post {
  id: number;
  userId: number;
  title: string;
  content: string;
  category: 'programacao' | 'jogos' | 'bateria';
  image?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  author: User;
  isLikedByCurrentUser?: boolean;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category: 'programacao' | 'jogos' | 'bateria';
  image?: string;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  createdAt: Date;
  author?: User;
}

export interface CreateCommentRequest {
  content: string;
}
