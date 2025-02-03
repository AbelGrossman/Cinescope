import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { ListService } from '../../services/list/list.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [AuthService],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  private movieService = inject(MovieService);
  private listService = inject(ListService);

  @Input() movie: any;
  @Input() activeMovieId: number | null = null;
  @Input() listId: number | null = null;
  @Output() toggleMovie = new EventEmitter<number | null>();
  @Output() openMenu = new EventEmitter<any>(); // ✅ Emit movie data when opening the menu

  userLists: any[] = [];
  isFavorite = false;
  isInWatchlist = false;
  movieInLists: { [key: number]: boolean } = {};
  isListDropdownOpen = false;

  userRating: number = 0;

  constructor(public authService: AuthService) {}


  ngOnInit(): void {
    if (this.movie && this.movie.id) {
      this.fetchUserLists();
      this.fetchFavorites();
      this.fetchWatchlist();
      this.checkUserRating();
    }
  }

  checkUserRating(): void {
    this.movieService.getUserRatings().subscribe({
      next: (data) => {
        const ratedFilm = data.results.find((rated: any) => rated.id === this.movie.id);
        if (ratedFilm && ratedFilm.rating) {
          this.userRating = ratedFilm.rating;
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des notes utilisateur', err);
      }
    });
  }

  fetchUserLists(): void {
    this.listService.getUserLists().subscribe({
      next: (data) => {
        this.userLists = data.results || [];
        this.userLists.forEach(list => {
          this.listService.getListMovies(list.id).subscribe(listData => {
            this.movieInLists[list.id] = listData.items.some(
              (item: any) => item.id === this.movie.id
            );
          });
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des listes :', error);
      }
    });
  }

  fetchFavorites(): void {
    this.movieService.getFavorites().subscribe({
      next: (data) => {
        this.isFavorite = data.results.some((fav: any) => fav.id === this.movie.id);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des favoris :', error);
      }
    });
  }

  fetchWatchlist(): void {
    this.movieService.getWatchlist().subscribe({
      next: (data) => {
        this.isInWatchlist = data.results.some((watch: any) => watch.id === this.movie.id);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la watchlist :', error);
      }
    });
  }

  isActive(): boolean {
    return this.activeMovieId === this.movie?.id;
  }

  toggleActions(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.isActive()) {
      this.toggleMovie.emit(null);
    } else {
      this.toggleMovie.emit(this.movie?.id);
    }
  }

  hideActions(): void {
    if (this.isActive()) {
      this.toggleMovie.emit(null);
    }
  }

  openActionModal(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isUserLoggedIn()) {
      this.openModal('loginModal');
    }
    else {
      this.toggleActions(event);
    }
  }

  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.style.display = 'block';
      modalElement.classList.add('show');
      modalElement.setAttribute('aria-hidden', 'false');
      modalElement.style.opacity = '1';
    }
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.style.display = 'none';
      modalElement.classList.remove('show');
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.style.opacity = '0';
    }
  }
  
  

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('session_id');
  }

  toggleListDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isListDropdownOpen = !this.isListDropdownOpen;
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.movie) return;
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

  toggleWatchlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.movie) return;
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

  toggleCustomList(event: Event, listId: number): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.movie) return;

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

  rateMovie(): void {
    if (!this.movie) return;
    const ratingStr = prompt(`Donnez une note (0-10) pour ${this.movie.title}`);
    if (!ratingStr) return;
    const rating = parseFloat(ratingStr);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      alert('Note invalide.');
      return;
    }
    this.movieService.rateMovie(this.movie.id, rating).subscribe(() => {
      alert('Merci pour votre note.');
    });
  }


  toggleRate(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.userRating > 0) {
      const confirmRemove = confirm(`Vous avez déjà noté ce film (${this.userRating}/10). Voulez-vous retirer cette note ?`);
      if (confirmRemove) {
        this.removeRating();
      }
    } else {
      this.askAndRateMovie();
    }
  }

  askAndRateMovie(): void {
    const ratingStr = prompt(`Donnez une note (0-10) pour ${this.movie.title}`);
    if (!ratingStr) return;
    const rating = parseFloat(ratingStr);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      alert('Note invalide.');
      return;
    }
    this.movieService.rateMovie(this.movie.id, rating).subscribe(() => {
      this.userRating = rating;
      alert(`Merci pour votre note: ${rating}/10`);
    });
  }

  removeRating(): void {
    this.movieService.removeRating(this.movie.id).subscribe(() => {
        this.userRating = 0;
        alert(`Votre note pour ${this.movie.title} a été retirée.`);
      });
  }
}

