import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieService } from '../../services/movie/movie.service';



@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  private movieService = inject(MovieService);
  favoriteMovies: any[] = [];

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.movieService.getFavorites().subscribe(
      (response) => {
        this.favoriteMovies = response.results || [];
      },
      (error) => {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    );
  }

  removeFavorite(movieId: number) {
    this.movieService.removeFromFavorites(movieId).subscribe(() => {
      this.favoriteMovies = this.favoriteMovies.filter(movie => movie.id !== movieId);
    });
  }

  
}
