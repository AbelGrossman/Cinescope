import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-user-ratings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-ratings.component.html',
  styleUrl: './user-ratings.component.scss'
})
export class UserRatingsComponent implements OnInit {
  private authService = inject(AuthService);
  ratedMovies: any[] = [];

  ngOnInit() {
    this.loadUserRatings();
  }

  loadUserRatings() {
    this.authService.getUserRatings().subscribe(
      (response) => {
        this.ratedMovies = response.results || [];
      },
      (error) => {
        console.error("Erreur lors de la récupération des films notés :", error);
      }
    );
  }
}
