
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie/movie.service';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';
import { FilterComponent } from "../filter/filter.component";
import { forkJoin, of } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, ListMovieCardComponent, FilterComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  searchResults: any[] = [];
  filteredResults: any[] = [];
  searchQuery: string = '';

  filters = {
    genre: '',
    minRating: '',
    year: '',
    minVoteCount: '', 
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
    this.route.paramMap.subscribe(params => {
      this.searchQuery = params.get('query') || '';
      if (this.searchQuery) {
        this.searchMovies(this.searchQuery);
      }
    });
  }


  searchMovies(query: string) {
    this.movieService.searchMovies(query).subscribe(
      (response) => {
        let movies = response.results || [];

        // ✅ Fetch full details only if revenue is missing
        let requests = movies.map((movie:any) =>
          movie.revenue !== undefined
            ? of(movie)
            : this.movieService.getMovieDetails(movie.id)
        );

        forkJoin(requests).subscribe((fullMovies:any) => {
          this.searchResults = fullMovies.map((movie:any) => ({
            ...movie,
            genre_ids: movie.genre_ids || movie.genres?.map((g:any) => g.id) || [] // ✅ Ensure genre_ids exist
          }));
          this.applyFilters();
        });
      },
      (error) => {
        console.error("Erreur lors de la recherche :", error);
      }
    );
  }


  onFiltersChanged(newFilters: any) {
    this.filters = newFilters;
    localStorage.setItem('movieFilters', JSON.stringify(this.filters));
    this.applyFilters();
  }


  applyFilters() {
    this.filteredResults = this.searchResults
      .filter(movie => 
        (!this.filters.genre || movie.genre_ids?.includes(Number(this.filters.genre))) &&
        (!this.filters.minRating || movie.vote_average >= this.filters.minRating) &&
        (!this.filters.year || movie.release_date?.startsWith(this.filters.year)) &&
        (!this.filters.minVoteCount || movie.vote_count >= this.filters.minVoteCount)
      )
      .sort((a, b) => {
        let key = this.filters.sortBy;
        let order = this.filters.sortOrder === 'asc' ? 1 : -1;

        if (key === 'release_date') {
          return ((a.release_date || '') > (b.release_date || '') ? 1 : -1) * order;
        } else if (key === 'vote_average' || key === 'popularity') {
          return ((a[key] || 0) - (b[key] || 0)) * order;
        } else if (key === 'revenue') {
          return ((a.revenue || 0) - (b.revenue || 0)) * order;
        }
         else {
          return 0;
        }
      });

    console.log("Filtered Results:", this.filteredResults);
  }

  resetFilters() {
    this.filters = {
      genre: '',
      minRating: '',
      year: '',
      minVoteCount: '',
      revenue: '',
      sortBy: 'popularity',
      sortOrder: 'desc'
    };
    localStorage.removeItem('movieFilters'); // ✅ Clear saved filters
  }
}
