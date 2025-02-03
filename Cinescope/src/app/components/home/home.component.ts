import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieCardComponent } from "../movie-card/movie-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, FormsModule, MovieCardComponent],
})
export class HomeComponent implements OnInit {

  trendingMovies: any[] = [];
  nowPlayingMovies: any[] = [];
  topRatedMovies: any[] = [];
  popularMovies: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.fetchTrendingMovies();
    this.fetchNowPlayingMovies();
    this.fetchTopRatedMovies();
  }

  fetchTrendingMovies() {
    this.movieService.getTrendingMovies().subscribe((response) => {
      this.trendingMovies = response.results;
    });
  }

  fetchNowPlayingMovies() {
    this.movieService.getNowPlayingMovies().subscribe((response) => {
      this.nowPlayingMovies = response.results;
    });
  }

  fetchTopRatedMovies() {
    this.movieService.getTopRatedMovies().subscribe((response) => {
      this.topRatedMovies = response.results;
    });
  }

  fetchPopularMovies() {
    this.movieService.getPopularMovies().subscribe((response) => {
      this.popularMovies = response.results;
    });
  }

}
