import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = environment.apiKey;
  private apiUrl = environment.apiUrl;
  private sessionId = localStorage.getItem('session_id');
  private accountId = localStorage.getItem('account_id');

  constructor(private http: HttpClient) { }

  getTrendingMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/trending/movie/week?api_key=${this.apiKey}`);
  }

  getMovieDetails(movieId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}`);
  }

  searchMovies(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`);
  }

  addToFavorites(movieId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/account/${this.accountId}/favorite?api_key=${this.apiKey}&session_id=${this.sessionId}`,
      { media_type: 'movie', media_id: movieId, favorite: true },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  getFavorites(): Observable<any> {
    return this.http.get(`${this.apiUrl}/account/${this.accountId}/favorite/movies?api_key=${this.apiKey}&session_id=${this.sessionId}`);
  }

  addToWatchlist(movieId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/account/${this.accountId}/watchlist?api_key=${this.apiKey}&session_id=${this.sessionId}`,
      { media_type: 'movie', media_id: movieId, watchlist: true },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  getWatchlist(): Observable<any> {
    return this.http.get(`${this.apiUrl}/account/${this.accountId}/watchlist/movies?api_key=${this.apiKey}&session_id=${this.sessionId}`);
  }

  rateMovie(movieId: number, rating: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/movie/${movieId}/rating?api_key=${this.apiKey}&session_id=${this.sessionId}`,
      { value: rating },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  getUserRatings(): Observable<any> {
    const accountId = localStorage.getItem('account_id');
    const sessionId = localStorage.getItem('session_id');

    if (!accountId || !sessionId) {
      console.error("Account ID ou Session ID manquant.");
      return new Observable();
    }

    return this.http.get(`${this.apiUrl}/account/${accountId}/rated/movies?api_key=${this.apiKey}&session_id=${sessionId}`);
  }

  removeFromFavorites(movieId: number): Observable<any> {
    const accountId = localStorage.getItem('account_id');
    const sessionId = localStorage.getItem('session_id');

    if (!accountId || !sessionId) {
      console.error("Account ID ou Session ID manquant.");
      return new Observable();
    }

    return this.http.post(`${this.apiUrl}/account/${accountId}/favorite?api_key=${this.apiKey}&session_id=${sessionId}`,
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

    getFilteredMovies(filters: any): Observable<any> {
    let params: any = {
      api_key: this.apiKey,
      sort_by: `${filters.sortBy}.${filters.sortOrder}`
    };

    if (filters.genre) params.with_genres = filters.genre;
    if (filters.minRating) params["vote_average.gte"] = filters.minRating;
    if (filters.year) params.primary_release_year = filters.year;

    return this.http.get(`${this.apiUrl}/discover/movie`, { params });
  }

  removeRating(movieId: number): Observable<any> {
    const accountId = localStorage.getItem('account_id');
    const sessionId = localStorage.getItem('session_id');
  
    if (!accountId || !sessionId) {
      console.error("Account ID ou Session ID manquant.");
      return new Observable();
    }
  
    return this.http.delete(
      `${this.apiUrl}/movie/${movieId}/rating?api_key=${this.apiKey}&session_id=${sessionId}`
    );
  }
  

  getNowPlayingMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}`);
  }
  
  getTopRatedMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/top_rated?api_key=${this.apiKey}`);
  }
  
  getPopularMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}`);
  }
  
}
