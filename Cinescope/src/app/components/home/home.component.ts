import { Component, OnInit, inject } from '@angular/core';
import { MovieService } from '../../services/movie/movie.service';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule, MovieCardComponent
  ]
})
export class HomeComponent implements OnInit {
  trendingMovies: any[] = [];

  constructor(private movieSerivce: MovieService) {}

  ngOnInit(): void {
    this.movieSerivce.getTrendingMovies().subscribe((response) => {
      this.trendingMovies = response.results;
      console.log("Trending Movies :", this.trendingMovies);
    });
  }
}
