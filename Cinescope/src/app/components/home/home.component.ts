import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie/movie.service';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from '../filter/filter.component';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, MovieCardComponent, FormsModule, FilterComponent, ListMovieCardComponent],
})
export class HomeComponent implements OnInit {

  filters = {
    genre: '',
    minRating: '',
    year: '',
    sortBy: 'popularity',
    sortOrder: 'desc'
  };

  trendingMovies: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    const savedFilters = localStorage.getItem('movieFilters');
    if (savedFilters) {
      this.filters = JSON.parse(savedFilters);
    }
    this.fetchMovies();
  }

  fetchMovies() {
    this.movieService.getFilteredMovies(this.filters).subscribe(response => {
      this.trendingMovies = response.results;
    });
  }

  onFiltersChanged(newFilters: any) {
    this.filters = newFilters;
    localStorage.setItem('movieFilters', JSON.stringify(this.filters));
    this.fetchMovies();
  }
}
