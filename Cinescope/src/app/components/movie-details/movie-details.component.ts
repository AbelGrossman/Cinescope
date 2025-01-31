  import { Component, OnInit, inject } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ListService } from '../../services/list/list.service';
  import { MovieService } from '../../services/movie/movie.service';
  import { ActivatedRoute } from '@angular/router';
  import { FormsModule } from '@angular/forms';
  import { RouterModule } from '@angular/router';


  @Component({
    selector: 'app-movie-details',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './movie-details.component.html',
    styleUrl: './movie-details.component.scss'
  })
  export class MovieDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private movieService = inject(MovieService);
    private listService = inject(ListService);

    movie: any;
    rating: number = 0;
    userLists: any[] = [];
    isFavorite = false;
    isInWatchlist = false;
    newListName = '';
    newListDescription = '';
    
    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const movieId = Number(params.get('id'));
        if (movieId) {
          this.fetchMovieDetails(movieId);
          this.fetchUserLists();
          this.fetchFavorites();
          this.fetchWatchlist();
        }
      });
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
  
    openActionModal(action: string, extra?: any) {
      if (!this.isUserLoggedIn()) {
        this.openModal('loginModal');
      } else {
        switch (action) {
          case 'favorites':
            this.toggleFavorite();
            break;
          case 'watchlist':
            this.toggleWatchlist();
            break;
          case 'rate':
            this.rateMovie(extra);
            break;
          case 'customList':
            this.addToCustomList(extra);
            break;
        }
      }
    }
  
    openListCreationModal() {
      if (!this.isUserLoggedIn()) {
        this.openModal('loginModal'); // Show login modal if not logged in
      } else {
        this.openModal('listCreationModal'); // Show list creation modal if logged in
      }
    }
  
    isUserLoggedIn(): boolean {
      return !!localStorage.getItem('session_id');
    }
  

    fetchMovieDetails(movieId: number) {
      this.movieService.getMovieDetails(movieId).subscribe((data) => {
        this.movie = data;
      });
    }

    getGenres(): string {
      return this.movie.genres?.map((g: { name: string }) => g.name).join(', ') || '';
    }
    
    addToFavorites() {
      if (this.movie) {
        this.movieService.addToFavorites(this.movie.id).subscribe(
          () => {
            alert(`${this.movie.title} a été ajouté aux favoris.`);
          },
          (error) => {
            console.error('Erreur lors de l’ajout aux favoris :', error);
          }
        );
      }
    }
    
    fetchUserLists() {
      this.listService.getUserLists().subscribe((data) => {
        this.userLists = data.results || [];
      });
    }

    addToWatchlist() {
      if (this.movie) {
        this.movieService.addToWatchlist(this.movie.id).subscribe(() => {
          alert(`${this.movie.title} a été ajouté à la watchlist.`);
        });
      }
    }

    rateMovie(rating: number) {
      if (this.movie) {
        this.movieService.rateMovie(this.movie.id, rating).subscribe(
          () => {
            alert(`Vous avez noté ${this.movie.title} avec ${rating} étoiles.`);
          },
          (error) => {
            console.error("Erreur lors de la notation du film :", error);
          }
        );
      }
    }
    

    addToCustomList(listId: number) {
      if (this.movie) {
        this.listService.addToCustomList(listId, this.movie.id).subscribe(() => {
          alert(`${this.movie.title} a été ajouté à la liste.`);
        });
      }
    }
  
    fetchFavorites() {
      this.movieService.getFavorites().subscribe((data) => {
        this.isFavorite = data.results.some((fav: any) => fav.id === this.movie.id);
      });
    }
  
    fetchWatchlist() {
      this.movieService.getWatchlist().subscribe((data) => {
        this.isInWatchlist = data.results.some((watch: any) => watch.id === this.movie.id);
      });
    }
  
    toggleFavorite() {
      this.movieService.addToFavorites(this.movie.id).subscribe(() => {
        this.isFavorite = !this.isFavorite;
      });
    }
  
    toggleWatchlist() {
      this.movieService.addToWatchlist(this.movie.id).subscribe(() => {
        this.isInWatchlist = !this.isInWatchlist;
      });
    }
  
    createList() {
      this.listService.createList(this.newListName, this.newListDescription).subscribe(() => {
        alert('List created successfully!');
        this.newListName = '';
        this.newListDescription = ''; 
      });
    }
    
  }
