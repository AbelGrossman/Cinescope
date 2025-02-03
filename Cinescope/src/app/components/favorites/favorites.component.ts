import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';
import { MovieService } from '../../services/movie/movie.service';
import { FilterComponent } from '../filter/filter.component';
import { forkJoin, of } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ListMovieCardComponent, FilterComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  private movieService = inject(MovieService);
  favoriteMovies: any[] = [];
  filteredMovies: any[] = [];

  filters = {
    genre: '',
    minRating: '',
    year: '',
    vote_count: '',
    revenue: '',
    sortBy: 'popularity',
    sortOrder: 'desc'
  };
  lastNavigationId: number | null = null;

  constructor(private router: Router) {}


  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const lastPage = localStorage.getItem('lastPageUrl') || '';
        if (event.id !== this.lastNavigationId && !lastPage.includes('/app-movie')) {
          this.resetFilters(); // ✅ Reset filters when navigating to a new page
        }
        this.lastNavigationId = event.id;
      }
    });
    const savedFilters = localStorage.getItem('movieFilters');
    if (savedFilters) {
      this.filters = JSON.parse(savedFilters);
    }
    this.loadFavorites();
  }

  loadFavorites() {
    this.movieService.getFavorites().subscribe(response => {
      let movies = response.results || [];
  
      let requests = movies.map((movie: any)=>
        movie.revenue !== undefined
          ? of(movie)
          : this.movieService.getMovieDetails(movie.id)
      );

      forkJoin(requests).subscribe((fullMovies:any) => {
        this.favoriteMovies = fullMovies.map((movie:any) => ({
          ...movie,
          genre_ids: movie.genre_ids || movie.genres?.map((g: any) => g.id) || [] // ✅ Ensure genre_ids exist
        }));
        this.applyFilters();
      });
    },
      (error) => {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    );
  }

  onFiltersChanged(newFilters: any) {
    this.filters = newFilters;
    localStorage.setItem('movieFilters', JSON.stringify(this.filters));
    this.applyFilters();
  }
  
  applyFilters() {
    this.filteredMovies = this.favoriteMovies.filter(movie => 
      (!this.filters.genre || movie.genre_ids.includes(Number(this.filters.genre))) &&
      (!this.filters.minRating || movie.vote_average >= this.filters.minRating) &&
      (!this.filters.year || movie.release_date.startsWith(this.filters.year))
    )
    .sort((a, b) => {
      let key = this.filters.sortBy;
      let order = this.filters.sortOrder === 'asc' ? 1 : -1;

      if (key === 'release_date') {
        return (a.release_date > b.release_date ? 1 : -1) * order;
      } else if (key === 'vote_average' || key === 'popularity' || key === 'vote_count') {
        return (a[key] - b[key]) * order;
      } else if (key === 'revenue'){
        return ((a.revenue || 0) - (b.revenue || 0)) * order;
      } else {
        return 0; // Default case (should never hit)
      }
    });
  }

  removeFavorite(movieId: number) {
    this.movieService.removeFromFavorites(movieId).subscribe(() => {
      this.favoriteMovies = this.favoriteMovies.filter(movie => movie.id !== movieId);
    });
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
  
}
