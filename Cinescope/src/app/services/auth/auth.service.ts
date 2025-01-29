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


  async redirectToAuth() {
    this.getRequestToken().subscribe((response) => {
      if (response.success) {
        const requestToken = response.request_token;
        localStorage.setItem('request_token', requestToken);

        // Redirection vers TMDB avec le token
        window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=http://localhost:4200/auth/callback`;
      }
    });
  }


  createSession(requestToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/authentication/session/new?api_key=${this.apiKey}`, {
      request_token: requestToken
    });
  }


  handleAuthCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const requestToken = urlParams.get('request_token');
    const approved = urlParams.get('approved');

    if (requestToken && approved === 'true') {
      this.createSession(requestToken).subscribe((response) => {
        if (response.success) {
          const sessionId = response.session_id;
          localStorage.setItem('session_id', sessionId);
          this.isLoggedInSubject.next(true);
          console.log('Connexion réussie, session_id :', sessionId);

          // récuprer le account_id
          this.getAccountId(localStorage.getItem('session_id')!).subscribe((response) => {
            if (response && response.id) {
              localStorage.setItem('account_id', response.id);
              console.log('Account ID récupéré:', response.id);
            }
          });
          
        }
      });
    }
  }

  getAccountId(sessionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/account?api_key=${this.apiKey}&session_id=${sessionId}`);
  }
  


  logout(): void {
    localStorage.removeItem('session_id');
    localStorage.removeItem('request_token');
    this.isLoggedInSubject.next(false);
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
    const accountId = localStorage.getItem('account_id');
    const sessionId = localStorage.getItem('session_id');
  
    if (!accountId || !sessionId) {
      console.error('Account ID ou Session ID manquant.');
      return new Observable();
    }
  
    return this.http.post(
      `${this.apiUrl}/account/${accountId}/favorite?api_key=${this.apiKey}&session_id=${sessionId}`,
      {
        media_type: 'movie',
        media_id: movieId,
        favorite: true
      },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
  }
  
  
  addToWatchlist(movieId: number): Observable<any> {
    const accountId = localStorage.getItem('account_id');
    const sessionId = localStorage.getItem('session_id');
  
    if (!accountId || !sessionId) {
      console.error("Account ID ou Session ID manquant.");
      return new Observable();
    }
  
    return this.http.post(
      `${this.apiUrl}/account/${accountId}/watchlist?api_key=${this.apiKey}&session_id=${sessionId}`,
      {
        media_type: 'movie',
        media_id: movieId,
        watchlist: true
      },
      {
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

  getFavorites(): Observable<any> {
    const accountId = localStorage.getItem('account_id');
    const sessionId = localStorage.getItem('session_id');
  
    if (!accountId || !sessionId) {
      console.error("Account ID ou Session ID manquant.");
      return new Observable();
    }
  
    return this.http.get(
      `${this.apiUrl}/account/${accountId}/favorite/movies?api_key=${this.apiKey}&session_id=${sessionId}`
    );
  }


  removeFromFavorites(movieId: number): Observable<any> {
    const accountId = localStorage.getItem('account_id');
    const sessionId = localStorage.getItem('session_id');
  
    if (!accountId || !sessionId) {
      console.error("Account ID ou Session ID manquant.");
      return new Observable();
    }
  
    return this.http.post(
      `${this.apiUrl}/account/${accountId}/favorite?api_key=${this.apiKey}&session_id=${sessionId}`,
      {
        media_type: 'movie',
        media_id: movieId,
        favorite: false
      },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
  }

  getWatchlist(): Observable<any> {
    const accountId = localStorage.getItem('account_id');
    const sessionId = localStorage.getItem('session_id');
  
    if (!accountId || !sessionId) {
      console.error("Account ID ou Session ID manquant.");
      return new Observable();
    }
  
    return this.http.get(
      `${this.apiUrl}/account/${accountId}/watchlist/movies?api_key=${this.apiKey}&session_id=${sessionId}`
    );
  }
  
  removeFromWatchlist(movieId: number): Observable<any> {
    const accountId = localStorage.getItem('account_id');
    const sessionId = localStorage.getItem('session_id');
  
    if (!accountId || !sessionId) {
      console.error("Account ID ou Session ID manquant.");
      return new Observable();
    }
  
    return this.http.post(
      `${this.apiUrl}/account/${accountId}/watchlist?api_key=${this.apiKey}&session_id=${sessionId}`,
      {
        media_type: 'movie',
        media_id: movieId,
        watchlist: false
      },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
  }
  
  

  
}


