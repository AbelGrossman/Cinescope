import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  providers: [AuthService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  searchQuery: string = ''; // ✅ Stocker la recherche
  private authSubscription!: Subscription;

  constructor(private router: Router, public authService: AuthService) {}

  goToRoute(route: string): void {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  searchMovies() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search', this.searchQuery]);
    }
  }

  resetFiltersAndGoHome() {
    localStorage.removeItem('movieFilters'); // ✅ Remove saved filters
    this.router.navigate(['/']); // ✅ Navigate to home
  }

  login() {
    this.authService.redirectToAuth()
  }  
}
