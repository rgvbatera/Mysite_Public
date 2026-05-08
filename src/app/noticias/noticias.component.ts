import { Component, OnInit } from '@angular/core';
import { Post, PostsService } from '../services/posts.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {
  posts: Post[] = [];
  featuredPosts: Post[] = [];

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.posts = this.postsService.getAllPosts();
    this.featuredPosts = this.postsService.getFeaturedPosts();
  }
}
