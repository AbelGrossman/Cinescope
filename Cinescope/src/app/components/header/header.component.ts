import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor (private router: Router) {}

  goToRoute(route: string): void{
    this.router.navigate([route]);
  }

  // constructor(public authService: AuthService) {

  // }
}
