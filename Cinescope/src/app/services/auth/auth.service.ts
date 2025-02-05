import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiKey = environment.apiKey;
  private apiUrl = environment.apiUrl;
  private sessionId = localStorage.getItem('session_id') || '';

  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.sessionId);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Étape 1 : Génère un token de requête pour démarrer le processus d'authentification utilisateur
  getRequestToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/authentication/token/new?api_key=${this.apiKey}`);
  }

  // Étape 2 : Redirige l'utilisateur vers TMDB pour autoriser le token
  redirectToAuth(): void {
    this.getRequestToken().subscribe(response => {
      if (response.success) {
        const requestToken = response.request_token;
        localStorage.setItem('request_token', requestToken);
        window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=http://localhost:4200`;
      }
    });
  }

  // Étape 3 : Crée une session après validation du token par l'utilisateur
  createSession(requestToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/authentication/session/new?api_key=${this.apiKey}`, {
      request_token: requestToken
    });
  }

  // Étape 4 : Gère le retour de l'authentification et crée la session utilisateur
  handleAuthCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const requestToken = urlParams.get('request_token');
    const approved = urlParams.get('approved');

    if (requestToken && approved === 'true') {
      this.createSession(requestToken).subscribe(response => {
        if (response.success) {
          localStorage.setItem('session_id', response.session_id);
          this.isLoggedInSubject.next(true);
          this.getAccountId().subscribe(account => {
            localStorage.setItem('account_id', account.id);
          });
        }
      });
    }
  }

  // Récupère l'ID du compte utilisateur via l'API TMDB
  getAccountId(): Observable<any> {
    return this.http.get(`${this.apiUrl}/account?api_key=${this.apiKey}&session_id=${localStorage.getItem('session_id')}`);
  }

  logout(): void {
    localStorage.removeItem('session_id');
    localStorage.removeItem('request_token');
    localStorage.removeItem('account_id');
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('session_id');
  }
}
