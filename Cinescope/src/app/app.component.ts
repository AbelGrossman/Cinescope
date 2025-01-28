import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/account/account.component';
import { ContactComponent } from './components/contact/contact.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { LoginComponent } from './components/login/login.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MovieRatingsComponent } from './components/movie-ratings/movie-ratings.component';
import { ResultsComponent } from './components/results/results.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UserRatingsComponent } from './components/user-ratings/user-ratings.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AboutComponent, AccountComponent, 
    ContactComponent, FavoritesComponent, FooterComponent, 
    HeaderComponent, HomeComponent, LoginComponent, 
    MovieCardComponent, MovieDetailsComponent, MovieRatingsComponent,
  ResultsComponent, SignUpComponent, UserRatingsComponent, WatchlistComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Cinescope';
}
