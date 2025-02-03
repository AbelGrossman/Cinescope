import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FavoritesComponent } from '../favorites/favorites.component';
import { WatchlistComponent } from '../watchlist/watchlist.component';
import { UserRatingsComponent } from '../user-ratings/user-ratings.component';
import { UserListsComponent } from '../user-lists/user-lists.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  filters = {
    genre: '',
    minRating: '',
    year: '',
    vote_count: '', 
    revenue: '',
    sortBy: 'popularity',
    sortOrder: 'desc'
  };
  
  constructor(private router: Router) {}


  goToRoute(route: string): void {
    this.router.navigate([route]);
  }

  resetFilters() {
    this.filters = {
      genre: '',
      minRating: '',
      year: '',
      vote_count: '',
      revenue: '',
      sortBy: 'popularity',
      sortOrder: 'desc'
    };
    localStorage.removeItem('movieFilters'); // ✅ Clear saved filters
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
  

}
