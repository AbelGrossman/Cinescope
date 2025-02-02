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

  activeMovieId: number | null = null;


onToggleMovie(movieId: number | null): void {
  console.log("toggle");
  this.activeMovieId = movieId;
}

}
