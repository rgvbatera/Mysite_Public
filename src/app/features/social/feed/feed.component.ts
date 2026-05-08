import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { Post } from '../../../shared/models/post.model';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  currentUser: User | null = null;
  loading = false;
  loadingMore = false;
  error = '';
  selectedCategory: string | null = null;
  limit = 10;
  offset = 0;
  hasMore = true;
  showCreatePost = false;
  expandedPostId: number | null = null;
  commentText: { [key: number]: string } = {};
  postComments: { [key: number]: any[] } = {};
  loadingComments: { [key: number]: boolean } = {};

  categories = [
    { value: null, label: 'Todos' },
    { value: 'programacao', label: '💻 Programação' },
    { value: 'jogos', label: '🎮 Jogos' },
    { value: 'bateria', label: '🥁 Bateria' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Observa o usuário atual
    this.authService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPosts(reset = false): void {
    if (reset) {
      this.posts = [];
      this.offset = 0;
      this.hasMore = true;
    }

    if (!this.hasMore) return;

    const loadingState = reset || this.offset === 0;
    if (loadingState) {
      this.loading = true;
    } else {
      this.loadingMore = true;
    }

    this.error = '';

    this.postService.getPosts(this.selectedCategory, this.limit, this.offset)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.posts = [...this.posts, ...response.posts];
          this.offset += response.posts.length;
          this.hasMore = response.posts.length === this.limit;
          this.loading = false;
          this.loadingMore = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar posts. Tente novamente.';
          this.loading = false;
          this.loadingMore = false;
          console.error('Error loading posts:', err);
        }
      });
  }

  onCategoryChange(category: string | null): void {
    this.selectedCategory = category;
    this.loadPosts(true);
  }

  onLike(post: Post): void {
    if (!this.currentUser) {
      return;
    }

    this.postService.likePost(post.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          // Use the response from backend instead of toggling manually
          post.isLikedByCurrentUser = response.liked;
          post.likesCount = response.likesCount;
        },
        error: (err) => {
          console.error('Error liking post:', err);
        }
      });
  }

  onComment(post: Post): void {
    // Toggle da seção de comentários
    if (this.expandedPostId === post.id) {
      this.expandedPostId = null;
    } else {
      this.expandedPostId = post.id;
      this.loadComments(post.id);
    }
  }

  loadComments(postId: number): void {
    this.loadingComments[postId] = true;
    
    this.postService.getComments(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.postComments[postId] = response.comments || [];
          this.loadingComments[postId] = false;
        },
        error: (err) => {
          console.error('Error loading comments:', err);
          this.loadingComments[postId] = false;
        }
      });
  }

  submitComment(post: Post): void {
    const content = this.commentText[post.id]?.trim();
    
    if (!content || !this.currentUser) {
      return;
    }

    this.postService.createComment(post.id, { content })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          // Atualizar contador de comentários com a resposta do backend
          post.commentsCount = response.commentsCount;
          // Limpar texto
          this.commentText[post.id] = '';
          // Recarregar comentários para mostrar o novo
          this.loadComments(post.id);
        },
        error: (err) => {
          console.error('Error creating comment:', err);
          alert('Erro ao criar comentário. Tente novamente.');
        }
      });
  }

  deleteComment(commentId: number, post: Post): void {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) {
      return;
    }

    this.postService.deleteComment(commentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          post.commentsCount = response.commentsCount;
          this.loadComments(post.id);
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
          alert('Erro ao excluir comentário.');
        }
      });
  }

  onShare(post: Post): void {
    // Implementar compartilhamento
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback: copiar link
      console.log('Share post:', post.id);
    }
  }

  onDelete(post: Post): void {
    if (!confirm('Tem certeza que deseja deletar este post?')) {
      return;
    }

    this.postService.deletePost(post.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== post.id);
        },
        error: (err) => {
          console.error('Error deleting post:', err);
          alert('Erro ao deletar post.');
        }
      });
  }

  onScroll(): void {
    // Implementar infinite scroll
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 500 && !this.loading && !this.loadingMore && this.hasMore) {
      this.loadPosts();
    }
  }

  toggleCreatePost(): void {
    this.showCreatePost = !this.showCreatePost;
  }

  onPostCreated(): void {
    this.showCreatePost = false;
    this.loadPosts(true);
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'programacao': '💻',
      'jogos': '🎮',
      'bateria': '🥁'
    };
    return icons[category] || '📝';
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'programacao': 'Programação',
      'jogos': 'Jogos',
      'bateria': 'Bateria'
    };
    return labels[category] || category;
  }

  formatDate(date: string): string {
    const postDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return postDate.toLocaleDateString('pt-BR');
  }
}
