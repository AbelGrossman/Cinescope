import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/account/account.component';
import { ContactComponent } from './components/contact/contact.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MovieRatingsComponent } from './components/movie-ratings/movie-ratings.component';
import { ResultsComponent } from './components/results/results.component';
import { UserRatingsComponent } from './components/user-ratings/user-ratings.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { UserListsComponent } from './components/user-lists/user-lists.component';
import { ListComponent } from './components/list/list.component';
import { AllMoviesComponent } from './components/all-movies/all-movies.component';


export const appRoutes: Routes = [
    {path: '', component: HomeComponent },
    {path: 'app-movie/:id', component: MovieDetailsComponent },
    {path: 'app-about', component: AboutComponent }, 
    {path: 'app-contact', component : ContactComponent},
    {path: 'app-footer', component: FooterComponent},
    {path: 'app-header', component: HeaderComponent},
    {path: 'app-movie-card', component: MovieCardComponent},
    {path: 'app-movie-details', component: MovieDetailsComponent},
    {path: 'app-movie-ratings', component: MovieRatingsComponent},
    {path: 'app-results', component: ResultsComponent},
    { path: 'list/:id', component: ListComponent },
    { path: 'search/:query', component: ResultsComponent },
    { 
        path: 'app-account', 
        component: AccountComponent,
        children: [
          { path: '', redirectTo: 'favorites', pathMatch: 'full' },
          { path: 'favorites', component: FavoritesComponent },
          { path: 'watchlist', component: WatchlistComponent },
          { path: 'user-ratings', component: UserRatingsComponent },
          { path: 'user-lists', component: UserListsComponent}
        ]
      },
    {path : 'app-all-movies', component: AllMoviesComponent},
    {path: '**', redirectTo: '' } 
];
