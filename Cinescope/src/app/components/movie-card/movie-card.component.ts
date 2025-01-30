import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { ListService } from '../../services/list/list.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  private movieService = inject(MovieService);
  private listService = inject(ListService);

  @Input() movie: any;
  @Input() context: string = '';
  @Input() activeMovieId: number | null = null; // ID du film actif
  @Output() toggleMovie = new EventEmitter<number>(); // Pour ouvrir/fermer le menu d'options

  userLists: any[] = [];

  ngOnInit() {
    if (this.context === 'search') {
      this.fetchUserLists();
    }
  }

  isActive(): boolean {
    return this.activeMovieId === this.movie.id;
  }

  toggleActions(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleMovie.emit(this.movie.id); // ✅ Informe le parent du film sélectionné
  }

  fetchUserLists() {
    this.listService.getUserLists().subscribe(
      (data) => {
        this.userLists = data.results || [];
      },
      (error) => {
        console.error("Erreur lors de la récupération des listes utilisateur :", error);
      }
    );
  }

  addToFavorites() {
    this.movieService.addToFavorites(this.movie.id).subscribe(() => {
      alert(`${this.movie.title} ajouté aux favoris.`);
    });
  }

  removeFromFavorites() {
    this.movieService.removeFromFavorites(this.movie.id).subscribe(() => {
      alert(`${this.movie.title} retiré des favoris.`);
    });
  }

  addToWatchlist() {
    this.movieService.addToWatchlist(this.movie.id).subscribe(() => {
      alert(`${this.movie.title} ajouté à la watchlist.`);
    });
  }

  removeFromWatchlist() {
    this.movieService.removeFromWatchlist(this.movie.id).subscribe(() => {
      alert(`${this.movie.title} retiré de la watchlist.`);
    });
  }

  addToCustomList(listId: number) {
    this.listService.addToCustomList(listId, this.movie.id).subscribe(() => {
      alert(`${this.movie.title} ajouté à la liste.`);
    });
  }

  removeFromList(listId: number) {
    this.listService.removeFromCustomList(listId, this.movie.id).subscribe(() => {
      alert(`${this.movie.title} retiré de la liste.`);
    });
  }
}
