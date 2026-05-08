import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService, Post } from '../services/posts.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  posts: Post[] = [];
  categoryName: string = '';
  categoryInfo: { name: string; icon: string; description: string } = {
    name: '',
    icon: '',
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryName = params['categoria'];
      this.categoryInfo = this.postsService.getCategoryInfo(this.categoryName);
      this.posts = this.postsService.getPostsByCategory(this.categoryName);
    });
  }
}
