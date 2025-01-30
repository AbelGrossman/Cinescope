import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie/movie.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, ListMovieCardComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  searchResults: any[] = [];
  searchQuery: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.searchQuery = params.get('query') || '';
      if (this.searchQuery) {
        this.searchMovies(this.searchQuery);
      }
    });
  }

  searchMovies(query: string) {
    this.movieService.searchMovies(query).subscribe(
      (response) => {
        this.searchResults = response.results || [];
      },
      (error) => {
        console.error("Erreur lors de la recherche :", error);
      }
    );
  }
}
