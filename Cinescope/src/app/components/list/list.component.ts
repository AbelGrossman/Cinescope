import { Component, HostListener, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListService } from '../../services/list/list.service';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';
import { forkJoin, of } from 'rxjs';
import { MovieService } from '../../services/movie/movie.service';
import { NavigationStart, Router } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';

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
  private router = inject(Router);

  listId!: number;
  listName: string = '';
  listDescription: string = '';
  listMovies: any[] = [];
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
      this.listId = Number(params.get('id'));
      if (this.listId) {
        this.loadListMovies();
      }
    });
  }

  // Load movies from the list and add new movies to the list after new ones are loaded on scroll
  loadListMovies(): void {
    if (this.isLoading || this.currentPage > this.totalPages) return;
    this.isLoading = true;
    this.listService.getListMovies(this.listId, this.currentPage).subscribe(response => {
      if (this.currentPage === 1) {
        this.listName = response.name;
        this.listDescription = response.description;
      }
      let movies = response.results || response.items || [];
      this.totalPages = response.total_pages || 1;
      let requests = movies.map((movie: any) =>
        movie.revenue !== undefined ? of(movie) : this.movieService.getMovieDetails(movie.id)
      );
      forkJoin(requests).subscribe((fullMovies: any) => {
        const existingMovieIds = new Set(this.listMovies.map(m => m.id));
        const uniqueMovies = fullMovies.filter((movie: any) => !existingMovieIds.has(movie.id));
        this.listMovies = [...this.listMovies, ...uniqueMovies];
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
    this.filteredMovies = this.listMovies
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

  // Load more movies when user scrolls to the bottom of the page
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.isLoading || this.currentPage > this.totalPages) return;
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
      this.loadListMovies();
    }
  }

  goBack(): void {
    const lastPage = localStorage.getItem('lastPageUrl');
    if (lastPage) {
      window.history.back();
    } else {
      this.router.navigate(['/movies']);
    }
  }
}
