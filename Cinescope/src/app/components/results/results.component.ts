
import { Component, HostListener, OnInit, inject } from '@angular/core';
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
  movieService = inject(MovieService);
  route = inject(ActivatedRoute);
  searchResults: any[] = [];
  filteredResults: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  totalPages: number = 1;

  filters = {
    genre: '',
    minRating: '',
    year: '',
    minVoteCount: '', 
    sortBy: 'popularity',
    sortOrder: 'desc'
  };
  lastNavigationId: number | null = null;
  isLoading: boolean = false;


  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentPage = 1;
    this.totalPages = 1;
  
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        localStorage.setItem('lastPageUrl', event.url);
      }
    });
  
    this.route.paramMap.subscribe(params => {
      const newSearchQuery = params.get('query') || '';
  
      if (newSearchQuery !== this.searchQuery) {
        this.searchQuery = newSearchQuery;
        localStorage.removeItem('searchResults');
        this.searchResults = [];
        this.searchMovies(this.searchQuery, this.currentPage);
      } else {
        const savedResults = localStorage.getItem('searchResults');
        if (savedResults) {
          this.searchResults = JSON.parse(savedResults);
          this.applyFilters();
        }
      }
    });
  
    const savedFilters = localStorage.getItem('movieFilters');
    if (savedFilters) {
      this.filters = JSON.parse(savedFilters);
    }
  }
  

  searchMovies(query: string, page: number = 1): void {
    if (!query.trim() || this.currentPage > this.totalPages || this.isLoading) return;
    
    this.isLoading = true;
  
    this.movieService.searchMovies(query, page).subscribe(
      (response) => {
        let movies = response.results || [];
        this.totalPages = response.total_pages;
  
        let requests = movies.map((movie: any) =>
          movie.revenue !== undefined && movie.revenue !== null
            ? of(movie)
            : this.movieService.getMovieDetails(movie.id)
        );
  
        forkJoin(requests).subscribe((fullMovies: any) => {
          const newMovies = fullMovies.map((movie: any) => ({
            ...movie,
            genre_ids: movie.genre_ids || movie.genres?.map((g: any) => g.id) || [],
            revenue: movie.revenue || 0
          }));
  
          const existingMovieIds = new Set(this.searchResults.map(m => m.id));
          const uniqueMovies = newMovies.filter((movie:any) => !existingMovieIds.has(movie.id));
  
          this.searchResults = [...this.searchResults, ...uniqueMovies];
  
          localStorage.setItem('searchResults', JSON.stringify(this.searchResults));
          this.applyFilters();
  
          this.isLoading = false;
          this.currentPage++;
        });
      },
      (error) => {
        console.error("Error fetching search results:", error);
        this.isLoading = false;
      }
    );
  }
  


  @HostListener('window:scroll', [])
onScroll(): void {
  if (this.isLoading) return;

  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
    this.searchMovies(this.searchQuery, this.currentPage);
  }
}


  onFiltersChanged(newFilters: any): void {
    this.filters = newFilters;
    localStorage.setItem('movieFilters', JSON.stringify(this.filters));
    this.applyFilters();
  }


  applyFilters(): void {
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
        }
         else {
          return 0;
        }
      });
  }
}
