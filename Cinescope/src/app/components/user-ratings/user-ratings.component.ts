import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie/movie.service';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';
import { forkJoin, of } from 'rxjs';


@Component({
  selector: 'app-user-ratings',
  standalone: true,
  imports: [CommonModule, ListMovieCardComponent],
  templateUrl: './user-ratings.component.html',
  styleUrl: './user-ratings.component.scss'
})
export class UserRatingsComponent implements OnInit {
  private movieService = inject(MovieService);
  ratedMovies: any[] = [];
  currentPage: number = 1;
  isLoading: boolean = false;
    
  ngOnInit() {
    this.loadUserRatings();
  }

  loadUserRatings() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.movieService.getUserRatingsPage(this.currentPage).subscribe(response => {
          let movies = response.results || [];
      
          let requests = movies.map((movie: any)=>
            movie.revenue !== undefined
              ? of(movie)
              : this.movieService.getMovieDetails(movie.id)
          );
    
          forkJoin(requests).subscribe((fullMovies:any) => {
            this.ratedMovies = [...this.ratedMovies, ...fullMovies.map((movie:any) => ({
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
          this.loadUserRatings();
        }
      }
}
