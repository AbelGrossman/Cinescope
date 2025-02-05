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


  // Permet de stocker l'id du film actif, notamment utlilisé pour l'affichage du menu rapide sur les cards
onToggleMovie(movieId: number | null): void {
  this.activeMovieId = movieId;
}

}
