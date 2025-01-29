import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  movie: any;
  rating: number = 0;
  userLists: any[] = [];
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const movieId = Number(params.get('id'));
      if (movieId) {
        this.fetchMovieDetails(movieId);
        this.fetchUserLists();
      }
    });
  }

  fetchMovieDetails(movieId: number) {
    this.authService.getMovieDetails(movieId).subscribe((data) => {
      this.movie = data;
    });
  }

  getGenres(): string {
    return this.movie.genres?.map((g: { name: string }) => g.name).join(', ') || '';
  }
  
  addToFavorites() {
    if (this.movie) {
      this.authService.addToFavorites(this.movie.id).subscribe(
        () => {
          alert(`${this.movie.title} a été ajouté aux favoris.`);
        },
        (error) => {
          console.error('Erreur lors de l’ajout aux favoris :', error);
        }
      );
    }
  }
  
  fetchUserLists() {
    this.authService.getUserLists().subscribe((data) => {
      this.userLists = data.results || [];
    });
  }

  addToWatchlist() {
    if (this.movie) {
      this.authService.addToWatchlist(this.movie.id).subscribe(() => {
        alert(`${this.movie.title} a été ajouté à la watchlist.`);
      });
    }
  }

  rateMovie(rating: number) {
    if (this.movie) {
      this.authService.rateMovie(this.movie.id, rating).subscribe(
        () => {
          alert(`Vous avez noté ${this.movie.title} avec ${rating} étoiles.`);
        },
        (error) => {
          console.error("Erreur lors de la notation du film :", error);
        }
      );
    }
  }
  

  addToCustomList(listId: number) {
    if (this.movie) {
      this.authService.addToCustomList(listId, this.movie.id).subscribe(() => {
        alert(`${this.movie.title} a été ajouté à la liste.`);
      });
    }
  }
}
