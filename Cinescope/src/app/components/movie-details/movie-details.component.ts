import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { Location } from "@angular/common"
import { MovieService } from "../../services/movie/movie.service"
import { ListService } from "../../services/list/list.service"
import { AuthService } from "../../services/auth/auth.service"
import { StarRatingComponent } from "../star-rating/star-rating.component"
import { ListformComponent } from "../list-form/list-form.component"


@Component({
  selector: "app-movie-details",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StarRatingComponent, ListformComponent],
  templateUrl: "./movie-details.component.html",
  styleUrls: ["./movie-details.component.scss"],
})
export class MovieDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private listService = inject(ListService);
  private movieService = inject(MovieService);
  private location = inject(Location);
  private authService = inject(AuthService);
  private router = inject(Router);

  movie: any
  userRating: number = 0
  userLists: any[] = []
  isFavorite = false
  isInWatchlist = false
  movieInLists: { [listId: number]: boolean } = {}
  newListName = ""
  newListDescription = ""
  showRatingPopup = false
  isModalOpen = false;


  constructor(  ) {}
  
  

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const movieId = Number(params.get("id"))
      if (movieId) {
        this.fetchMovieDetails(movieId)
        this.fetchUserLists()
        this.fetchFavorites()
        this.fetchWatchlist()
        this.fetchUserRating()
      }
    })
  }

  fetchUserRating(): void {
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

  fetchMovieDetails(movieId: number): void {
    this.movieService.getMovieDetails(movieId).subscribe((data) => {
      this.movie = data
    })
  }

  getGenres(): string {
    return this.movie.genres?.map((g: { name: string }) => g.name).join(", ") || ""
  }

  fetchUserLists(): void {
    this.listService.getUserLists().subscribe((data) => {
      this.userLists = data.results || []
      this.checkMovieInLists()
    })
  }

  checkMovieInLists(): void {
    this.userLists.forEach((list) => {
      this.listService.getListMovies(list.id).subscribe((listData) => {
        this.movieInLists[list.id] = listData.items.some((item: any) => item.id === this.movie.id)
      })
    })
  }

  toggleMovieInList(listId: number): void {
    if (this.movieInLists[listId]) {
      this.listService.removeFromCustomList(listId, this.movie.id).subscribe(() => {
        this.movieInLists[listId] = false
      })
    } else {
      this.listService.addToCustomList(listId, this.movie.id).subscribe(() => {
        this.movieInLists[listId] = true
      })
    }
  }

  openRatingPopup(): void {
    if (this.isUserLoggedIn()) {
      this.showRatingPopup = true
    } else {
      this.openModal("loginModal")
    }
  }

  closeRatingPopup(): void {
    this.showRatingPopup = false
  }

  rateMovie(rating: number): void {
    this.userRating = rating
    this.movieService.rateMovie(this.movie.id, rating).subscribe(() => {
      console.log(`Rated ${this.movie.title} with ${rating} stars.`)
      this.closeRatingPopup()
    })
  }

  fetchFavorites(): void {
    this.movieService.getFavorites().subscribe((data) => {
      this.isFavorite = data.results.some((fav: any) => fav.id === this.movie.id)
    })
  }

  fetchWatchlist(): void {
    this.movieService.getWatchlist().subscribe((data) => {
      this.isInWatchlist = data.results.some((watch: any) => watch.id === this.movie.id)
    })
  }

  toggleFavorite(): void {
    this.movieService.addToFavorites(this.movie.id).subscribe(() => {
      this.isFavorite = !this.isFavorite
    })
  }

  toggleWatchlist(): void {
    this.movieService.addToWatchlist(this.movie.id).subscribe(() => {
      this.isInWatchlist = !this.isInWatchlist
    })
  }

  createList(): void {
    this.listService.createList(this.newListName, this.newListDescription).subscribe(() => {
      this.newListName = ""
      this.newListDescription = ""
      this.closeModal("listCreationModal")
      this.fetchUserLists()
    })
  }

  formatNumberWithSpaces(num: number): string {
    return num.toLocaleString("en-US")
  }

  goBack(): void {
    const lastPage = localStorage.getItem('lastPageUrl');
    if (lastPage) {
      window.history.back();
    } else {
      this.router.navigate(['/movies']);
    }
  }

  login(): void {
    this.authService.redirectToAuth()
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem("session_id")
  }

  openModal(modalId: string): void {
    this.isModalOpen = true;
    const modalElement = document.getElementById(modalId)
    if (modalElement) {
      
      console.log("dfefdg");

      modalElement.style.display = "block"
      modalElement.classList.add("show")
      modalElement.setAttribute("aria-hidden", "false")
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId)
    if (modalElement) {
      modalElement.style.display = "none"
      modalElement.classList.remove("show")
      modalElement.setAttribute("aria-hidden", "true")
    }
  }

  openActionModal(action: string, extra?: any): void {
    if (!this.isUserLoggedIn()) {
      this.openModal("loginModal")
    } else {
      switch (action) {
        case "favorites":
          this.toggleFavorite()
          break
        case "watchlist":
          this.toggleWatchlist()
          break
        case "rate":
          this.openRatingPopup()
          break
        case "customList":
          this.toggleMovieInList(extra)
          break
      }
    }
  }

  onModalClose(refreshNeeded: boolean) {
    this.isModalOpen = false;
    console.log("erererere");
      this.fetchUserLists();

  }

  openListCreationModal() {
    if (this.isUserLoggedIn()) {
      this.openModal("listCreationModal")
    } else {
      this.openModal("loginModal")
    }
  }

  setDefaultImage(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/default-movie.jpg';
  }
}

