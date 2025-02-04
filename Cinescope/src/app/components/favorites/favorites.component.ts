import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';
import { MovieService } from '../../services/movie/movie.service';
import { forkJoin, of } from 'rxjs';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ListMovieCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  private movieService = inject(MovieService);
  favoriteMovies: any[] = [];
  filteredMovies: any[] = [];
  currentPage: number = 1;
  isLoading: boolean = false;




  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.movieService.getFavoritesPage(this.currentPage).subscribe(response => {
      let movies = response.results || [];
  
      let requests = movies.map((movie: any)=>
        movie.revenue !== undefined
          ? of(movie)
          : this.movieService.getMovieDetails(movie.id)
      );

      forkJoin(requests).subscribe((fullMovies:any) => {
        this.favoriteMovies = [...this.favoriteMovies, ...fullMovies.map((movie:any) => ({
          ...movie,
          genre_ids: movie.genre_ids || movie.genres?.map((g: any) => g.id) || []
        }))];
        this.isLoading = false;
      });
    },
      (error) => {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    );
  }

  @HostListener('window:scroll', [])
    onScroll(): void {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        this.currentPage++;
        this.loadFavorites();
      }
    }
  
}
