import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  user: User | null = null;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Form fields
  fullName = '';
  bio = '';
  avatar = '';
  githubUsername = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserData(): void {
    this.authService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.user = user;
          this.fullName = user.fullName || '';
          this.bio = user.bio || '';
          this.avatar = user.avatar || '';
          this.githubUsername = user.githubUsername || '';
        }
      });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.isEditing && this.user) {
      // Reset form se cancelar
      this.fullName = this.user.fullName || '';
      this.bio = this.user.bio || '';
      this.avatar = this.user.avatar || '';
      this.githubUsername = this.user.githubUsername || '';
    }
  }

  onSubmit(): void {
    if (!this.user) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Limpar URL do GitHub se necessário (extrair apenas username)
    let cleanGithubUsername = this.githubUsername;
    if (cleanGithubUsername && cleanGithubUsername.includes('github.com/')) {
      const match = cleanGithubUsername.match(/github\.com\/([^\/\?#]+)/);
      if (match) {
        cleanGithubUsername = match[1];
      }
    }

    const updateData: Partial<User> = {
      fullName: this.fullName,
      bio: this.bio,
      avatar: this.avatar,
      githubUsername: cleanGithubUsername
    };

    this.authService.updateProfile(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isEditing = false;
          this.successMessage = 'Perfil atualizado com sucesso!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || 'Erro ao atualizar perfil';
        }
      });
  }
}
