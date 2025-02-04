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


@Component({
  selector: "app-movie-details",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StarRatingComponent],
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
  userRating = 0
  userLists: any[] = []
  isFavorite = false
  isInWatchlist = false
  movieInLists: { [listId: number]: boolean } = {}
  newListName = ""
  newListDescription = ""
  showRatingPopup = false

  constructor(  ) {}
  
  

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const movieId = Number(params.get("id"))
      if (movieId) {
        this.fetchMovieDetails(movieId)
        this.fetchUserLists()
        this.fetchFavorites()
        this.fetchWatchlist()
      }
    })
  }

  fetchMovieDetails(movieId: number) {
    this.movieService.getMovieDetails(movieId).subscribe((data) => {
      this.movie = data
    })
  }

  getGenres(): string {
    return this.movie.genres?.map((g: { name: string }) => g.name).join(", ") || ""
  }

  fetchUserLists() {
    this.listService.getUserLists().subscribe((data) => {
      this.userLists = data.results || []
      this.checkMovieInLists()
    })
  }

  checkMovieInLists() {
    this.userLists.forEach((list) => {
      this.listService.getListMovies(list.id).subscribe((listData) => {
        this.movieInLists[list.id] = listData.items.some((item: any) => item.id === this.movie.id)
      })
    })
  }

  toggleMovieInList(listId: number) {
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

  openRatingPopup() {
    if (this.isUserLoggedIn()) {
      this.showRatingPopup = true
    } else {
      this.openModal("loginModal")
    }
  }

  closeRatingPopup() {
    this.showRatingPopup = false
  }

  rateMovie(rating: number) {
    this.userRating = rating
    this.movieService.rateMovie(this.movie.id, rating).subscribe(() => {
      console.log(`Rated ${this.movie.title} with ${rating} stars.`)
      this.closeRatingPopup()
    })
  }

  fetchFavorites() {
    this.movieService.getFavorites().subscribe((data) => {
      this.isFavorite = data.results.some((fav: any) => fav.id === this.movie.id)
    })
  }

  fetchWatchlist() {
    this.movieService.getWatchlist().subscribe((data) => {
      this.isInWatchlist = data.results.some((watch: any) => watch.id === this.movie.id)
    })
  }

  toggleFavorite() {
    this.movieService.addToFavorites(this.movie.id).subscribe(() => {
      this.isFavorite = !this.isFavorite
    })
  }

  toggleWatchlist() {
    this.movieService.addToWatchlist(this.movie.id).subscribe(() => {
      this.isInWatchlist = !this.isInWatchlist
    })
  }

  createList() {
    this.listService.createList(this.newListName, this.newListDescription).subscribe(() => {
      alert("List created successfully!")
      this.newListName = ""
      this.newListDescription = ""
      this.closeModal("listCreationModal")
      this.fetchUserLists()
    })
  }

  formatNumberWithSpaces(num: number): string {
    return num.toLocaleString("en-US")
  }

  goBack() {
    const lastPage = localStorage.getItem('lastPageUrl');
    if (lastPage) {
      window.history.back(); // ✅ Navigate back while preserving filters
    } else {
      this.router.navigate(['/movies']); // ✅ Fallback if no history is found
    }
  }

  login() {
    this.authService.redirectToAuth()
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem("session_id")
  }

  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId)
    if (modalElement) {
      modalElement.style.display = "block"
      modalElement.classList.add("show")
      modalElement.setAttribute("aria-hidden", "false")
    }
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId)
    if (modalElement) {
      modalElement.style.display = "none"
      modalElement.classList.remove("show")
      modalElement.setAttribute("aria-hidden", "true")
    }
  }

  openActionModal(action: string, extra?: any) {
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

  openListCreationModal() {
    if (this.isUserLoggedIn()) {
      this.openModal("listCreationModal")
    } else {
      this.openModal("loginModal")
    }
  }
}

