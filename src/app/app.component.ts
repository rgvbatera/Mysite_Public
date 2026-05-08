import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'CodeBeat News';
  menuOpen = false;
  activeDropdown: string | null = null;
  isAuthenticated = false;
  isAdmin = false;
  currentUsername = '';

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Se o usuário está autenticado, buscar dados atualizados do servidor
    if (this.authService.isAuthenticated) {
      this.authService.getMe().subscribe({
        next: (response) => {
          console.log('🔄 User data refreshed:', response);
          console.log('📝 GitHub username in response:', response?.user?.githubUsername);
        },
        error: (err) => {
          console.error('Error refreshing user data:', err);
          // Se o token expirou, fazer logout
          if (err.status === 401) {
            this.authService.logout();
          }
        }
      });
    }

    // Observa mudanças no estado de autenticação
    this.authService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        console.log('👤 Current user updated:', user);
        this.isAuthenticated = !!user;
        this.isAdmin = user?.isAdmin || false;
        this.currentUsername = user?.username || '';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    if (!this.menuOpen) {
      this.activeDropdown = null;
    }
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.activeDropdown = null;
  }

  toggleDropdown(name: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.menuOpen = false;
  }
}
