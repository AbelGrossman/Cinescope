import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie/movie.service';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';
import { forkJoin, of } from 'rxjs';


@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, ListMovieCardComponent],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss'
})
export class WatchlistComponent implements OnInit {
  private movieService = inject(MovieService);
  watchlistMovies: any[] = [];
  currentPage: number = 1;
  isLoading: boolean = false;

  

  ngOnInit() {
    this.loadWatchlist();
  }

  loadWatchlist() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.movieService.getWatchlistPage(this.currentPage).subscribe(response => {
        let movies = response.results || [];
    
        let requests = movies.map((movie: any)=>
          movie.revenue !== undefined
            ? of(movie)
            : this.movieService.getMovieDetails(movie.id)
        );
  
        forkJoin(requests).subscribe((fullMovies:any) => {
          this.watchlistMovies = [...this.watchlistMovies, ...fullMovies.map((movie:any) => ({
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
      this.loadWatchlist();
    }
  }
}
