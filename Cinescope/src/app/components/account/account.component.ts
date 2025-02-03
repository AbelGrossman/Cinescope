import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FavoritesComponent } from '../favorites/favorites.component';
import { WatchlistComponent } from '../watchlist/watchlist.component';
import { UserRatingsComponent } from '../user-ratings/user-ratings.component';
import { UserListsComponent } from '../user-lists/user-lists.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterModule, FavoritesComponent, WatchlistComponent, UserRatingsComponent, UserListsComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  constructor(private router: Router) {}


  goToRoute(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
  

}
