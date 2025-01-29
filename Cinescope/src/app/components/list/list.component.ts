import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { ListService } from '../../services/list/list.service';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private listService = inject(ListService);
  private route = inject(ActivatedRoute);
  listId!: number;
  listMovies: any[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.listId = Number(params.get('id'));
      if (this.listId) {
        this.loadListMovies();
      }
    });
  }

  loadListMovies() {
    this.listService.getListMovies(this.listId).subscribe(
      (response) => {
        this.listMovies = response.items || [];
      },
      (error) => {
        console.error("Erreur lors de la récupération des films :", error);
      }
    );
  }

  removeMovie(movieId: number) {
    this.listService.removeFromCustomList(this.listId, movieId).subscribe(() => {
      this.listMovies = this.listMovies.filter(movie => movie.id !== movieId);
    });
  }
}
