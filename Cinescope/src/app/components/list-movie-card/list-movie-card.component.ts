import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-list-movie-card',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './list-movie-card.component.html',
  styleUrls: ['./list-movie-card.component.scss']
})
export class ListMovieCardComponent {
  @Input() movies: any[] = [];
  @Input() context: string = 'all';

  activeMovieId: number | null = null;

  setActiveMovie(movieId: number | null) {
    this.activeMovieId = this.activeMovieId === movieId ? null : movieId;
  }
}
