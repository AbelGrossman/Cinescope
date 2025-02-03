import { Component, inject } from '@angular/core';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';
import { FilterComponent } from '../filter/filter.component';
import { MovieService } from '../../services/movie/movie.service';

@Component({
  selector: 'app-all-movies',
  standalone: true,
  imports: [ListMovieCardComponent, FilterComponent],
  providers: [MovieService],
  templateUrl: './all-movies.component.html',
  styleUrl: './all-movies.component.scss'
})
export class AllMoviesComponent {
  filters = {
    genre: '',
    minRating: '',
    year: '',
    minVoteCount: '',
    revenue: '',
    sortBy: 'popularity',
    sortOrder: 'desc'
  };
  trendingMovies: any[] = [];
  movieService = inject(MovieService);


  ngOnInit() {
    this.fetchMovies();
  }

  fetchMovies() {
    this.movieService.getFilteredMovies(this.filters).subscribe(response => {
      this.trendingMovies = response.results;
    });
  }

  onFiltersChanged(newFilters: any) {
    this.filters = newFilters;
    this.fetchMovies(); // Fetch new movies when filters change
  }
}
