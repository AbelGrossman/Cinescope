import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { MovieCardComponent } from '../movie-card/movie-card.component';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  private authService = inject(AuthService);
  favoriteMovies: any[] = [];

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.authService.getFavorites().subscribe(
      (response) => {
        this.favoriteMovies = response.results || [];
      },
      (error) => {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    );
  }

  removeFavorite(movieId: number) {
    this.authService.removeFromFavorites(movieId).subscribe(() => {
      this.favoriteMovies = this.favoriteMovies.filter(movie => movie.id !== movieId);
    });
  }
}
