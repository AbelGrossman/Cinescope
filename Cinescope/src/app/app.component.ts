import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth/auth.service';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/account/account.component';
import { ContactComponent } from './components/contact/contact.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MovieRatingsComponent } from './components/movie-ratings/movie-ratings.component';
import { ResultsComponent } from './components/results/results.component';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AboutComponent, AccountComponent, 
    ContactComponent, FooterComponent, HeaderComponent, 
    HomeComponent, LoginComponent, MovieCardComponent,
    MovieDetailsComponent, MovieRatingsComponent,ResultsComponent,
    HttpClientModule],
  providers: [AuthService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  sessionId: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.handleAuthCallback();
  }
}
