import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';
import { MovieService } from '../../services/movie/movie.service';
import { forkJoin, of } from 'rxjs';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ListMovieCardComponent, FilterComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  private movieService = inject(MovieService);
   private route = inject(ActivatedRoute);
  private router = inject(Router);
  favoriteMovies: any[] = [];
  filteredMovies: any[] = [];
  currentPage: number = 1;
  isLoading: boolean = false;
  totalPages: number = 1;

  filters = {
    minRating: '',
    year: '',
    minVoteCount: '',
    sortBy: 'popularity',
    sortOrder: 'desc'
  };


  ngOnInit(): void {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          localStorage.setItem('lastPageUrl', event.url);
        }
      });
  
      const savedFilters = localStorage.getItem('accountFilters');
      if (savedFilters) {
        this.filters = JSON.parse(savedFilters);
      }
  
      this.route.paramMap.subscribe(params => {
          this.loadFavorites();
      });
    }

  loadFavorites(): void {
      if (this.isLoading || this.currentPage > this.totalPages) return;
      this.isLoading = true;
    
      this.movieService.getFavoritesPage(this.currentPage).subscribe(response => {
        let movies = response.results || response.items || [];
        this.totalPages = response.total_pages || 1;
    
        let requests = movies.map((movie: any) =>
          movie.revenue !== undefined
            ? of(movie)
            : this.movieService.getMovieDetails(movie.id)
        );
    
        forkJoin(requests).subscribe((fullMovies: any) => {
          const existingMovieIds = new Set(this.favoriteMovies.map(m => m.id));
          const uniqueMovies = fullMovies.filter((movie: any) => !existingMovieIds.has(movie.id));
    
          this.favoriteMovies = [...this.favoriteMovies, ...uniqueMovies];
          this.applyFilters();
          this.isLoading = false;
          this.currentPage++;
        });
      },
      (error) => {
        console.error("Error fetching movies:", error);
        this.isLoading = false;
      });
    }

    applyFilters(): void {
      this.filteredMovies = this.favoriteMovies
        .filter(movie => 
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
          } else {
            return 0;
          }
        });
  
      console.log("Filtered Movies:", this.filteredMovies);
    }

    onFiltersChanged(newFilters: any): void {
      this.filters = newFilters;
      localStorage.setItem('accountFilters', JSON.stringify(this.filters));
      this.applyFilters();
    }

    @HostListener('window:scroll', [])
    onScroll(): void {
      if (this.isLoading || this.currentPage > this.totalPages) return;
    
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        this.loadFavorites();
      }
    }
  
}
