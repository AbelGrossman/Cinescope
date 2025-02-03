import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListService } from '../../services/list/list.service';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';
import { FilterComponent } from '../filter/filter.component';
import { forkJoin, of } from 'rxjs';
import { MovieService } from '../../services/movie/movie.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ListMovieCardComponent, FilterComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  private movieService = inject(MovieService);
  private listService = inject(ListService);
  private route = inject(ActivatedRoute);

  listId!: number;
  listMovies: any[] = [];
  filteredMovies: any[] = [];

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
    this.route.paramMap.subscribe(params => {
      this.listId = Number(params.get('id'));
      if (this.listId) {
        const savedFilters = localStorage.getItem('movieFilters');
        if (savedFilters) {
          this.filters = JSON.parse(savedFilters);
        }
        this.loadListMovies();
      }
    });
  }

  loadListMovies() {
    this.listService.getListMovies(this.listId).subscribe(response => {
      console.log("API Response:", response);
      let movies = response.results || response.items || [];
      console.log("Extracted Movies:", movies);
          // Fetch full details only if revenue is missing
          let requests = movies.map((movie: any)=>
            movie.revenue !== undefined
              ? of(movie)
              : this.movieService.getMovieDetails(movie.id)
          );
    
          forkJoin(requests).subscribe((fullMovies:any) => {
            this.listMovies = fullMovies.map((movie:any) => ({
              ...movie,
              genre_ids: movie.genre_ids || movie.genres?.map((g: any) => g.id) || [] // ✅ Ensure genre_ids exist
            }));
            this.applyFilters();
          });
        },
      (error) => {
        console.error("Erreur lors de la récupération des films :", error);
      }
    );
  }

  removeMovie(movieId: number) {
    this.listMovies = this.listMovies.filter(movie => movie.id !== movieId);
  }

  onFiltersChanged(newFilters: any) {
    this.filters = newFilters;
    localStorage.setItem('movieFilters', JSON.stringify(this.filters));
    this.applyFilters();
  }
  
  applyFilters() {
    this.filteredMovies = this.listMovies.filter(movie => 
      (!this.filters.genre || movie.genre_ids.includes(Number(this.filters.genre))) &&
      (!this.filters.minRating || movie.vote_average >= this.filters.minRating) &&
      (!this.filters.year || movie.release_date.startsWith(this.filters.year)) &&
      (!this.filters.minVoteCount || movie.vote_count >= this.filters.minVoteCount)
    )
    .sort((a, b) => {
      let key = this.filters.sortBy;
      let order = this.filters.sortOrder === 'asc' ? 1 : -1;

      if (key === 'release_date') {
        return (a.release_date > b.release_date ? 1 : -1) * order;
      } else if (key === 'vote_average' || key === 'popularity' || key === 'vote_count') {
        return (a[key] - b[key]) * order;
      } else if (key === 'revenue') {
        console.log("key: ", key + " a.revenue: " + a.revenue + " b.revenue: " + b.revenue);
        return ((a.revenue || 0) - (b.revenue || 0)) * order;
      }
      else {
        return 0; // Default case (should never hit)
      }
    });
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
