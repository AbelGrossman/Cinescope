import { Component, HostListener, inject } from '@angular/core';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';
import { FilterComponent } from '../filter/filter.component';
import { MovieService } from '../../services/movie/movie.service';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-all-movies',
  standalone: true,
  imports: [CommonModule, ListMovieCardComponent, FilterComponent],
  templateUrl: './all-movies.component.html',
  styleUrl: './all-movies.component.scss'
})
export class AllMoviesComponent {
  filters = {
    genre: '',
    minRating: '',
    year: '',
    minVoteCount: '',
    sortBy: 'popularity',
    sortOrder: 'desc'
  };
  allMovies: any[] = [];
  movieService = inject(MovieService);
  currentPage: number = 1;
  isLoading: boolean = false;
  lastNavigationId: number | null = null;
  private router = inject(Router);

  // loads movies with filter options automatically
  // only component that does that thanks to how the API works
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        localStorage.setItem('lastPageUrl', event.url);
      }
    });
    const savedFilters = localStorage.getItem('movieFilters');
    if (savedFilters) {
      this.filters = JSON.parse(savedFilters);
    }

    const savedPage = localStorage.getItem('moviePage');
    this.currentPage = savedPage ? parseInt(savedPage, 10) : 1;
    this.allMovies = [];
    if (Object.values(this.filters).some(value => value)) {
      this.loadFilteredMoviesUpToCurrentPage();
    } else {
      this.loadMoviesUpToCurrentPage();
    }
  }


  // Load movies without any filters
  loadMoviesUpToCurrentPage(): void {
    this.isLoading = true;

    let movieRequests = [];
    for (let i = 1; i <= this.currentPage; i++) {
      movieRequests.push(this.movieService.getAllMovies(i));
    }

    forkJoin(movieRequests).subscribe(responses => {
      let movies = responses.flatMap(response => response.results || []);

      let detailRequests = movies.map((movie: any) =>
        movie.poster_path ? of(movie) : this.movieService.getMovieDetails(movie.id)
      );

      forkJoin(detailRequests).subscribe(fullMovies => {
        this.allMovies = fullMovies;
        this.isLoading = false;
      });
    });
  }

  // Load movies with filters
  loadFilteredMoviesUpToCurrentPage(): void {
    this.isLoading = true;

    let movieRequests = [];
    for (let i = 1; i <= this.currentPage; i++) {
      movieRequests.push(this.movieService.filterAllMovies({ ...this.filters, page: i }));
    }

    forkJoin(movieRequests).subscribe(responses => {
      let movies = responses.flatMap(response => response.results || []);

      let detailRequests = movies.map((movie: any) =>
        movie.poster_path ? of(movie) : this.movieService.getMovieDetails(movie.id)
      );

      forkJoin(detailRequests).subscribe(fullMovies => {
        this.allMovies = fullMovies;
        this.isLoading = false;
      });
    });
  }


  // Add new movies to already existing list without filters
  fetchMovies(): void {
    if (this.isLoading) return;
    this.isLoading = true;

    this.movieService.getAllMovies(this.currentPage).subscribe(response => {
      let movies = response.results || [];

      let requests = movies.map((movie: any) =>
        movie.poster_path ? of(movie) : this.movieService.getMovieDetails(movie.id)
      );

      forkJoin(requests).subscribe((fullMovies: any) => {
        this.allMovies = [...this.allMovies, ...fullMovies];
        this.isLoading = false;
      });
    });
  }

  // Add new movies to already existing list with filters
  filterMovies(): void {
    if (this.isLoading) return;
    this.isLoading = true;

    this.movieService.filterAllMovies({ ...this.filters, page: this.currentPage }).subscribe(response => {
      let movies = response.results || [];

      let requests = movies.map((movie: any) =>
        movie.poster_path ? of(movie) : this.movieService.getMovieDetails(movie.id)
      );

      forkJoin(requests).subscribe((fullMovies: any) => {
        this.allMovies = [...this.allMovies, ...fullMovies];
        this.isLoading = false;
      });
    });
  }


  onFiltersChanged(newFilters: any): void {
    this.filters = newFilters;
    this.currentPage = 1;
    this.allMovies = [];
    localStorage.setItem('movieFilters', JSON.stringify(this.filters));
    localStorage.setItem('moviePage', this.currentPage.toString());
    this.filterMovies();
  }


  // Load more movies when user scrolls to the bottom of the page
  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
      if (this.isLoading) return;

      this.currentPage++;
      localStorage.setItem('moviePage', this.currentPage.toString());

      if (Object.values(this.filters).some(value => value)) {
        this.filterMovies();
      } else {
        this.fetchMovies();
      }
    }
  }

}
