import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private authService: AuthService) { }

  login() {
    this.authService.getRequestToken().subscribe((response) => {
      const requestToken = response.request_token;
      console.log("Request Token récupéré :", requestToken);
  
      localStorage.setItem('request_token', requestToken);
  
      this.authService.redirectToAuth();
    });
  }  
}
