import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post, CreatePostRequest, Comment, CreateCommentRequest } from '../../shared/models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPosts(category?: string, limit: number = 20, offset: number = 0): Observable<{ posts: Post[], total: number }> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());
    
    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<{ posts: Post[], total: number }>(`${this.apiUrl}/posts`, { params });
  }

  getPost(id: number): Observable<{ post: Post }> {
    return this.http.get<{ post: Post }>(`${this.apiUrl}/posts/${id}`);
  }

  createPost(data: CreatePostRequest): Observable<{ message: string, post: Post }> {
    return this.http.post<{ message: string, post: Post }>(`${this.apiUrl}/posts`, data);
  }

  updatePost(id: number, data: Partial<CreatePostRequest>): Observable<{ message: string, post: Post }> {
    return this.http.put<{ message: string, post: Post }>(`${this.apiUrl}/posts/${id}`, data);
  }

  deletePost(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/posts/${id}`);
  }

  getComments(postId: number): Observable<{ comments: Comment[] }> {
    return this.http.get<{ comments: Comment[] }>(`${this.apiUrl}/posts/${postId}/comments`);
  }

  createComment(postId: number, data: CreateCommentRequest): Observable<{ message: string, comment: Comment }> {
    return this.http.post<{ message: string, comment: Comment }>(`${this.apiUrl}/posts/${postId}/comments`, data);
  }

  deleteComment(commentId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/comments/${commentId}`);
  }

  likePost(postId: number): Observable<{ liked: boolean, likesCount: number }> {
    return this.http.post<{ liked: boolean, likesCount: number }>(`${this.apiUrl}/posts/${postId}/like`, {});
  }
}
