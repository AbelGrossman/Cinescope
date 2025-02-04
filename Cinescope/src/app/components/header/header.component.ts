import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
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
  searchQuery: string = '';
  private authSubscription!: Subscription;

  isDarkMode: boolean = false;

  activeButton: string = '';

  private routerSubscription!: Subscription;

  constructor(private router: Router, public authService: AuthService) {}

  goToRoute(route: string): void {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
      }
    );

    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateTheme();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveButton(event.urlAfterRedirects);
      });

    this.updateActiveButton(this.router.url);
  }

  updateActiveButton(url: string) {
    if (url.includes('/app-all-movies')) {
      this.activeButton = 'all-movies';
    } else if (url.includes('/login')) {
      this.activeButton = 'login';
    } else if (url.includes('/app-account')) {
      this.activeButton = 'account';
    } 
     else {
      this.activeButton = '';
    }
  }

  setActive(button: string) {
    this.activeButton = button;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
  }

  updateTheme() {
    const htmlElement = document.documentElement;
    if (this.isDarkMode) {
      htmlElement.classList.remove('light-mode');
      htmlElement.classList.add('dark-mode');
    } else {
      htmlElement.classList.remove('dark-mode');
      htmlElement.classList.add('light-mode');
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  resetFiltersAndSearchMovies() {
    console.log("searchQuery", this.searchQuery);
    localStorage.removeItem('movieFilters');
    localStorage.removeItem('searchResults');
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search', this.searchQuery]);
    }
  }

  resetFiltersAndGoHome() {
    localStorage.removeItem('movieFilters');
    this.router.navigate(['/']);
  }

  resetFiltersAndGoToAllMovies() {
    localStorage.removeItem('movieFilters');
    this.router.navigate(['/app-all-movies']);
  }

  login() {
    this.authService.redirectToAuth();
  }
}
