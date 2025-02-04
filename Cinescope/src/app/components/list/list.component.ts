import { Component, HostListener, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListService } from '../../services/list/list.service';
import { ListMovieCardComponent } from '../list-movie-card/list-movie-card.component';
import { forkJoin, of } from 'rxjs';
import { MovieService } from '../../services/movie/movie.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ListMovieCardComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  private movieService = inject(MovieService);
  private listService = inject(ListService);
  private route = inject(ActivatedRoute);

  listId!: number;
  listMovies: any[] = [];
  currentPage: number = 1;
  isLoading: boolean = false;


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.listId = Number(params.get('id'));
      if (this.listId) {
        this.loadListMovies();
      }
    });
  }

  loadListMovies() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.listService.getListMovies(this.listId).subscribe(response => {
      console.log("API Response:", response);
      let movies = response.results || response.items || [];
      console.log("Extracted Movies:", movies);
          // Fetch full details only if revenue is missing
          let requests = movies.map((movie: any)=>
            movie.revenue !== undefined
              ? of(movie)
              : this.movieService.getMovieDetails(movie.id)
          );
    
          forkJoin(requests).subscribe((fullMovies:any) => {
            this.listMovies = [...this.listMovies, ...fullMovies.map((movie:any) => ({
              ...movie,
              genre_ids: movie.genre_ids || movie.genres?.map((g: any) => g.id) || []
            }))];
            this.isLoading = false;
          });
        },
      (error) => {
        console.error("Erreur lors de la récupération des films :", error);
      }
    );
  }

  @HostListener('window:scroll', [])
    onScroll(): void {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        this.currentPage++;
        this.loadListMovies();
      }
    }

}
