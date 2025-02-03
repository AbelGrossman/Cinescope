import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth/auth.service';
import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/account/account.component';
import { ContactComponent } from './components/contact/contact.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MovieRatingsComponent } from './components/movie-ratings/movie-ratings.component';
import { ResultsComponent } from './components/results/results.component';
import { UserRatingsComponent } from './components/user-ratings/user-ratings.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { HttpClientModule } from '@angular/common/http';
import { AllMoviesComponent } from './components/all-movies/all-movies.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AboutComponent, AccountComponent, 
    ContactComponent, FavoritesComponent, FooterComponent, 
    HeaderComponent, HomeComponent, 
    MovieCardComponent, MovieDetailsComponent, MovieRatingsComponent,
  ResultsComponent, UserRatingsComponent, WatchlistComponent,
  HttpClientModule],
  providers: [AuthService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  sessionId: string = "";

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.handleAuthCallback();
  }

  login() {
    this.authService.redirectToAuth()
  }  

  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.style.display = 'block';
      modalElement.classList.add('show');
      modalElement.setAttribute('aria-hidden', 'false');
      modalElement.style.opacity = '1';
    }
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.style.display = 'none';
      modalElement.classList.remove('show');
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.style.opacity = '0';
    }
  }
  
  
}