import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie/movie.service';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';


@Component({
  selector: 'app-user-ratings',
  standalone: true,
  imports: [CommonModule, ListMovieCardComponent],
  templateUrl: './user-ratings.component.html',
  styleUrl: './user-ratings.component.scss'
})
export class UserRatingsComponent implements OnInit {
  private movieService = inject(MovieService);
  ratedMovies: any[] = [];

  ngOnInit() {
    this.loadUserRatings();
  }

  loadUserRatings() {
    this.movieService.getUserRatings().subscribe(
      (response) => {
        this.ratedMovies = response.results || [];
      },
      (error) => {
        console.error("Erreur lors de la récupération des films notés :", error);
      }
    );
  }
}
