import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GitHubRepo, GitHubProfile } from '../../shared/models/github.model';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = environment.apiUrl;
  private githubApiUrl = environment.githubApiUrl;

  constructor(private http: HttpClient) {}

  // Via nosso backend (mais seguro se tiver token)
  getRepos(): Observable<{ repos: GitHubRepo[] }> {
    return this.http.get<{ repos: GitHubRepo[] }>(`${this.apiUrl}/github/repos`);
  }

  getProfile(): Observable<{ profile: GitHubProfile }> {
    return this.http.get<{ profile: GitHubProfile }>(`${this.apiUrl}/github/profile`);
  }

  // Via backend com username específico (evita rate limit)
  getReposViaBackend(username: string): Observable<{ repos: GitHubRepo[] }> {
    return this.http.get<{ repos: GitHubRepo[] }>(`${this.apiUrl}/github/${username}/repos`);
  }

  getProfileViaBackend(username: string): Observable<GitHubProfile> {
    return this.http.get<GitHubProfile>(`${this.apiUrl}/github/${username}/profile`);
  }

  // Via GitHub API direto (público)
  getReposPublic(username: string): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(`${this.githubApiUrl}/users/${username}/repos?sort=updated&per_page=100`);
  }

  getProfilePublic(username: string): Observable<GitHubProfile> {
    return this.http.get<GitHubProfile>(`${this.githubApiUrl}/users/${username}`);
  }

  getLanguagesForRepo(username: string, repo: string): Observable<any> {
    return this.http.get(`${this.githubApiUrl}/repos/${username}/${repo}/languages`);
  }
}
