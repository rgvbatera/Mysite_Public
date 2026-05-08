import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, map } from 'rxjs/operators';
import { GithubService } from '../../core/services/github.service';
import { AuthService } from '../../core/services/auth.service';
import { GitHubRepo, GitHubProfile } from '../../shared/models/github.model';

@Component({
  selector: 'app-github-portfolio',
  templateUrl: './github-portfolio.component.html',
  styleUrls: ['./github-portfolio.component.css']
})
export class GithubPortfolioComponent implements OnInit, OnDestroy {
  profile: GitHubProfile | null = null;
  repos: GitHubRepo[] = [];
  filteredRepos: GitHubRepo[] = [];
  loading = false;
  loadingProfile = false;
  error = '';
  
  username = 'rgvbatera'; // Username padrão
  searchTerm = '';
  sortBy: 'updated' | 'stars' | 'name' = 'updated';
  filterLanguage: string | null = null;
  
  languages: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private githubService: GithubService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.pipe(
      takeUntil(this.destroy$),
      map(user => {
        console.log('🔍 GitHub Portfolio - User data:', user);
        console.log('🔍 GitHub username from user:', user?.githubUsername);
        return user?.githubUsername || 'rgvbatera';
      }),
      distinctUntilChanged()
    ).subscribe(githubUsername => {
      console.log('✅ Using GitHub username:', githubUsername);
      this.username = githubUsername;
      this.loadProfile();
      this.loadRepos();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfile(): void {
    this.loadingProfile = true;
    this.error = '';

    // Usar backend como proxy para evitar rate limit da API do GitHub
    this.githubService.getProfileViaBackend(this.username)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          this.loadingProfile = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar perfil do GitHub';
          this.loadingProfile = false;
          console.error('Error loading profile:', err);
        }
      });
  }

  loadRepos(): void {
    this.loading = true;
    this.error = '';

    // Usar backend como proxy para evitar rate limit da API do GitHub
    this.githubService.getReposViaBackend(this.username)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.repos = response.repos;
          this.extractLanguages();
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar repositórios';
          this.loading = false;
          console.error('Error loading repos:', err);
        }
      });
  }

  extractLanguages(): void {
    const languageSet = new Set<string>();
    this.repos.forEach(repo => {
      if (repo.language) {
        languageSet.add(repo.language);
      }
    });
    this.languages = Array.from(languageSet).sort();
  }

  applyFilters(): void {
    let filtered = [...this.repos];

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(term) ||
        (repo.description && repo.description.toLowerCase().includes(term))
      );
    }

    // Filter by language
    if (this.filterLanguage) {
      filtered = filtered.filter(repo => repo.language === this.filterLanguage);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

    this.filteredRepos = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSortChange(sort: 'updated' | 'stars' | 'name'): void {
    this.sortBy = sort;
    this.applyFilters();
  }

  onLanguageFilter(language: string | null): void {
    this.filterLanguage = language;
    this.applyFilters();
  }

  getLanguageColor(language: string): string {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'C++': '#f34b7d',
      'C': '#555555',
      'C#': '#178600',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Rust': '#dea584',
      'Shell': '#89e051'
    };
    return colors[language] || '#cccccc';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  openRepo(url: string): void {
    window.open(url, '_blank');
  }

  openProfile(): void {
    if (this.profile) {
      window.open(this.profile.html_url, '_blank');
    }
  }
}
