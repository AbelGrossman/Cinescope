import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiKey = 'a7824c9956f9f0600aff93e93190458f';
  private apiUrl = 'https://api.themoviedb.org/3';
  private accountId = '21780694';
  private sessionId = localStorage.getItem('session_id') || '';

  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.sessionId);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  constructor(private http: HttpClient) { }

  getRequestToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/authentication/token/new?api_key=${this.apiKey}`);
  }

  redirectToAuth() {
    const redirectUrl = encodeURIComponent("http://localhost:4200");
    window.location.href = `https://www.themoviedb.org/authenticate/${localStorage.getItem('request_token')}?redirect_to=${redirectUrl}`;
  }

  createSession(requestToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/authentication/session/new?api_key=${this.apiKey}`, {
      request_token: requestToken
    });
  }

  storeSessionId(sessionId: string) {
    this.sessionId = sessionId;
    localStorage.setItem('session_id', sessionId);
    this.isLoggedInSubject.next(true); // ✅ Notify all components
  }

  logout() {
    localStorage.removeItem('session_id');
    this.sessionId = '';
    this.isLoggedInSubject.next(false); // ✅ Notify all components
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('session_id');
  }

  getTrendingMovies() {
    return this.http.get<any>(`https://api.themoviedb.org/3/trending/movie/week`, {
      params: {
        api_key: this.apiKey
      }
    });
  }

  getMovieDetails(movieId: number) {
    return this.http.get<any>(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: this.apiKey
      }
    });
  }

  addToFavorites(movieId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/account/${this.accountId}/favorite`,
      {
        media_type: 'movie',
        media_id: movieId,
        favorite: true
      },
      {
        params: { api_key: this.apiKey, session_id: this.sessionId },
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
  }
  
  addToWatchlist(movieId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/account/${this.accountId}/watchlist`,
      {
        media_type: 'movie',
        media_id: movieId,
        watchlist: true
      },
      {
        params: { api_key: this.apiKey, session_id: this.sessionId },
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
  }

  rateMovie(movieId: number, rating: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/movie/${movieId}/rating`,
      {
        value: rating
      },
      {
        params: { api_key: this.apiKey, session_id: this.sessionId },
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
  }

  addToCustomList(listId: number, movieId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/list/${listId}/add_item`,
      { media_id: movieId },
      {
        params: { api_key: this.apiKey, session_id: this.sessionId },
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
  }

  getUserLists(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/account/${this.accountId}/lists`,
      {
        params: { api_key: this.apiKey, session_id: this.sessionId }
      }
    );
  }
}
