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

  activeMovieId: number | null = null;


  constructor(private movieService: MovieService) {}




 
  ngOnInit(): void {
    this.fetchTrendingMovies();
    this.fetchNowPlayingMovies();
    this.fetchTopRatedMovies();
  }
  
  onToggleMovie(movieId: number | null): void {
    console.log("toggle");
    this.activeMovieId = movieId;
  }

  fetchTrendingMovies(): void {
    this.movieService.getTrendingMovies().subscribe((response) => {
      this.trendingMovies = response.results;
    });
  }

  fetchNowPlayingMovies(): void {
    this.movieService.getNowPlayingMovies().subscribe((response) => {
      this.nowPlayingMovies = response.results;
    });
  }

  fetchTopRatedMovies(): void {
    this.movieService.getTopRatedMovies().subscribe((response) => {
      this.topRatedMovies = response.results;
    });
  }

  fetchPopularMovies(): void {
    this.movieService.getPopularMovies().subscribe((response) => {
      this.popularMovies = response.results;
    });
  }

}
