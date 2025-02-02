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
  @Input() context: string = 'all'; 
  @Input() activeMovieId: number | null = null;
  @Input() listId: number | null = null;
  @Output() toggleMovie = new EventEmitter<number | null>();

  userLists: any[] = [];
  isFavorite: boolean = false;
  isInWatchlist: boolean = false;
  movieInLists: { [key: number]: boolean } = {};

  ngOnInit(): void {
    if (!this.context) {
      this.context = 'all';
    }
    if (this.context === 'all') {
      this.fetchUserLists();
      this.checkFavorite();
      this.checkWatchlist();
    }
  }

  isActive(): boolean {
    return this.activeMovieId === this.movie.id;
  }

  toggleActions(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.activeMovieId === this.movie.id) {
      this.toggleMovie.emit(null);
    } else {
      this.toggleMovie.emit(this.movie.id);
    }
  }

  hideActions(): void {
    if (this.activeMovieId === this.movie.id) {
      this.toggleMovie.emit(null);
    }
  }

  fetchUserLists(): void {
    this.listService.getUserLists().subscribe(
      (data) => {
        this.userLists = data.results || [];
        this.userLists.forEach(list => {
          this.listService.getListMovies(list.id).subscribe(listData => {
            this.movieInLists[list.id] = listData.items.some((item: any) => item.id === this.movie.id);
          });
        });
      },
      (error) => {
        console.error("Erreur lors de la récupération des listes utilisateur :", error);
      }
    );
  }

  checkFavorite(): void {
    this.movieService.getFavorites().subscribe(data => {
      this.isFavorite = data.results.some((fav: any) => fav.id === this.movie.id);
    });
  }

  checkWatchlist(): void {
    this.movieService.getWatchlist().subscribe(data => {
      this.isInWatchlist = data.results.some((watch: any) => watch.id === this.movie.id);
    });
  }

  toggleFavorite(): void {
    if (this.isFavorite) {
      this.movieService.removeFromFavorites(this.movie.id).subscribe(() => {
        this.isFavorite = false;
        alert(`${this.movie.title} retiré des favoris.`);
      });
    } else {
      this.movieService.addToFavorites(this.movie.id).subscribe(() => {
        this.isFavorite = true;
        alert(`${this.movie.title} ajouté aux favoris.`);
      });
    }
  }

  toggleWatchlist(): void {
    if (this.isInWatchlist) {
      this.movieService.removeFromWatchlist(this.movie.id).subscribe(() => {
        this.isInWatchlist = false;
        alert(`${this.movie.title} retiré de la watchlist.`);
      });
    } else {
      this.movieService.addToWatchlist(this.movie.id).subscribe(() => {
        this.isInWatchlist = true;
        alert(`${this.movie.title} ajouté à la watchlist.`);
      });
    }
  }

  toggleCustomList(listId: number): void {
    if (this.movieInLists[listId]) {
      this.listService.removeFromCustomList(listId, this.movie.id).subscribe(() => {
        this.movieInLists[listId] = false;
        alert(`${this.movie.title} retiré de ${this.getListName(listId)}.`);
      });
    } else {
      this.listService.addToCustomList(listId, this.movie.id).subscribe(() => {
        this.movieInLists[listId] = true;
        alert(`${this.movie.title} ajouté à ${this.getListName(listId)}.`);
      });
    }
  }

  getListName(listId: number): string {
    const list = this.userLists.find(l => l.id === listId);
    return list ? list.name : '';
  }

  removeFromList(): void {
    if (!this.listId) {
      console.error("listId non défini.");
      return;
    }
    this.listService.removeFromCustomList(this.listId, this.movie.id).subscribe(() => {
      alert(`${this.movie.title} retiré de la liste.`);
      this.toggleMovie.emit(null);
    });
  }

  // rateMovie() etc. restent inchangées.
  rateMovie(): void {
    const ratingStr = prompt(`Donnez une note (0-10) pour ${this.movie.title}`);
    if (!ratingStr) return;
    const rating = parseFloat(ratingStr);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      alert("Note invalide.");
      return;
    }
    this.movieService.rateMovie(this.movie.id, rating).subscribe(() => {
      alert("Merci pour votre note.");
    });
  }
}
