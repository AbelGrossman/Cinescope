import { Component, Input, Output, EventEmitter, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { MovieService } from '../../services/movie/movie.service';
import { ListService } from '../../services/list/list.service';
import { AuthService } from '../../services/auth/auth.service';
import { ListformComponent } from '../list-form/list-form.component';


@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule, StarRatingComponent, ListformComponent],
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
  @Output() openMenu = new EventEmitter<any>();

  @ViewChild('movieTitle') movieTitle!: ElementRef;
  @ViewChild('titleWrapper') titleWrapper!: ElementRef;


  userLists: any[] = [];
  isFavorite = false;
  isInWatchlist = false;
  movieInLists: { [key: number]: boolean } = {};
  isListDropdownOpen = false;
  userRating: number = 0;
  showRatingPopup: boolean = false;
  isScrolling = false;
  scrollDistance = 0;

  constructor() {}


  // à chaque movie card instanciée, on doit vérifier sur le film est dans les favoris, watchlist, et les listes perso de l'utilisateur ou noté. 
  // Cela génére beaucoup de requêtes à chaque fois qu'on ouvre une card, ce qui n'est pas optimal quand on affiche des lists de card
  // On aura du faire la requete en amont pour tous les films et passer en Input ici les données isFavorite, isInWatchlist, userRating, movieInLists, etc.
  // On a été confronté au soucis à la fin du projet et on avait pas forcément le temps de tout refactoriser
  // Ceci explique pourquoi c'est assez long pour afficher les toggle de favoris, watchlist, etc. sur les cards
  ngOnInit(): void {
    if (this.movie && this.movie.id) {
      this.fetchUserLists();
      this.fetchFavorites();
      this.fetchWatchlist();
      this.checkUserRating();
    }
  }

  setDefaultImage(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/default-movie.jpg';
  }

  // pour le défilement du titre si le titre est trop long
  ngAfterViewInit(): void {
    setTimeout(() => {
      const titleEl = this.movieTitle.nativeElement as HTMLElement;
      const wrapperEl = this.titleWrapper.nativeElement as HTMLElement;
      if (titleEl.scrollWidth > wrapperEl.offsetWidth) {
        this.isScrolling = true;
        const distance = titleEl.scrollWidth - wrapperEl.offsetWidth;
        this.scrollDistance = distance;
        titleEl.style.setProperty('--scroll-distance', `${distance}px`);
      }
    });
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
        console.error(err);
      }
    });
  }


  fetchUserLists(): void {
    this.listService.getUserLists().subscribe({
      next: (data) => {
        this.userLists = data.results || [];
        this.userLists.forEach(list => {
          this.listService.getListMovies(list.id).subscribe(listData => {
            this.movieInLists[list.id] = listData.items.some((item: any) => item.id === this.movie.id);
          });
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  fetchFavorites(): void {
    this.movieService.getFavorites().subscribe({
      next: (data) => {
        this.isFavorite = data.results.some((fav: any) => fav.id === this.movie.id);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  fetchWatchlist(): void {
    this.movieService.getWatchlist().subscribe({
      next: (data) => {
        this.isInWatchlist = data.results.some((watch: any) => watch.id === this.movie.id);
      },
      error: (error) => {
        console.error(error);
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

  // error pop-up if user isn't logged in
  openActionModal(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isUserLoggedIn()) {
      this.openModal('loginModal');
    } else {
      this.toggleActions(event);
    }
  }

  // open the quick action menu
  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.style.display = 'block';
      modalElement.classList.add('show');
      modalElement.setAttribute('aria-hidden', 'false');
      modalElement.style.opacity = '1';
    }
  }

  closeModal(modalId: string): void {
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
      });
    } else {
      this.movieService.addToFavorites(this.movie.id).subscribe(() => {
        this.isFavorite = true;
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
      });
    } else {
      this.movieService.addToWatchlist(this.movie.id).subscribe(() => {
        this.isInWatchlist = true;
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
      });
    } else {
      this.listService.addToCustomList(listId, this.movie.id).subscribe(() => {
        this.movieInLists[listId] = true;
      });
    }
  }

  getListName(listId: number): string {
    const list = this.userLists.find(l => l.id === listId);
    return list ? list.name : '';
  }

  toggleRate(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showRatingPopup = true;
  }

  updateRating(newRating: number): void {
    if (newRating > 0) {
      this.movieService.rateMovie(this.movie.id, newRating).subscribe(() => {
        this.userRating = newRating;
      });
    } else {
      this.movieService.removeRating(this.movie.id).subscribe(() => {
        this.userRating = 0;
      });
    }
  }

  closeRatingPopup(): void {
    this.showRatingPopup = false;
  }

}
