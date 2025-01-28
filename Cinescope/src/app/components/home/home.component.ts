import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule
  ]
})
export class HomeComponent implements OnInit {
  trendingMovies: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getTrendingMovies().subscribe((response) => {
      this.trendingMovies = response.results;
      console.log("Trending Movies :", this.trendingMovies);
    });
  }
}
