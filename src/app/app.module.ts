import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { CategoriaComponent } from './categoria/categoria.component';

// Auth Components
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

// Social Components
import { FeedComponent } from './features/social/feed/feed.component';
import { CreatePostComponent } from './features/social/create-post/create-post.component';

// Portfolio Component
import { GithubPortfolioComponent } from './features/github-portfolio/github-portfolio.component';

// Guards
import { AuthGuard } from './core/guards/auth.guard';

// Interceptors
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ProfileComponent } from './features/user/profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'portfolio', component: GithubPortfolioComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'categoria/:categoria', component: CategoriaComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NoticiasComponent,
    CategoriaComponent,
    LoginComponent,
    RegisterComponent,
    FeedComponent,
    CreatePostComponent,
    GithubPortfolioComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
