import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss'
})
export class WatchlistComponent implements OnInit {
  private authService = inject(AuthService);
  watchlistMovies: any[] = [];

  ngOnInit() {
    this.loadWatchlist();
  }

  loadWatchlist() {
    this.authService.getWatchlist().subscribe(
      (response) => {
        this.watchlistMovies = response.results || [];
      },
      (error) => {
        console.error("Erreur lors de la récupération de la watchlist :", error);
      }
    );
  }

  removeFromWatchlist(movieId: number) {
    this.authService.removeFromWatchlist(movieId).subscribe(() => {
      this.watchlistMovies = this.watchlistMovies.filter(movie => movie.id !== movieId);
    });
  }
}
