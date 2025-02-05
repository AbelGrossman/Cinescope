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


  getAllMovies(page:number=1): Observable<any> {
    let params: any = {
      api_key: this.apiKey,
      page: page.toString(),
    };
    return this.http.get(`${this.apiUrl}/discover/movie`, { params });
  }

  getTrendingMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/trending/movie/week?api_key=${this.apiKey}`);
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

  searchMovies(query: string, page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        query: encodeURIComponent(query),
        page: page.toString(),
      }
    });
  }

  getMovieDetails(movieId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}`);
  }
  

  // Applique les filtres sur les films
  filterAllMovies(filters: any): Observable<any> {
    let params: any = {
      sort_by: `${filters.sortBy}.${filters.sortOrder}`,
      api_key: this.apiKey,
      page: filters.page || 1,
    };
    if (filters.genre) params.with_genres = filters.genre;
    if (filters.minRating) params["vote_average.gte"] = filters.minRating;
    if (filters.year) params.primary_release_year = filters.year;
    if (filters.minVoteCount) params["vote_count.gte"] = filters.minVoteCount;
    
    return this.http.get(`${this.apiUrl}/discover/movie`, { params });
  }

  addToFavorites(movieId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/account/${this.accountId}/favorite?api_key=${this.apiKey}&session_id=${this.sessionId}`,
      { media_type: 'movie', media_id: movieId, favorite: true },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  addToWatchlist(movieId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/account/${this.accountId}/watchlist?api_key=${this.apiKey}&session_id=${this.sessionId}`,
      { media_type: 'movie', media_id: movieId, watchlist: true },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  rateMovie(movieId: number, rating: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/movie/${movieId}/rating?api_key=${this.apiKey}&session_id=${this.sessionId}`,
      { value: rating },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  getFavorites(): Observable<any> {
    return this.http.get(`${this.apiUrl}/account/${this.accountId}/favorite/movies?api_key=${this.apiKey}&session_id=${this.sessionId}`);
  }

  getWatchlist(): Observable<any> {
    return this.http.get(`${this.apiUrl}/account/${this.accountId}/watchlist/movies?api_key=${this.apiKey}&session_id=${this.sessionId}`);
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

    // Utilisé pour la pagination (si plus de 20 films retournés)
  getWatchlistPage(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/account/${this.accountId}/watchlist/movies?api_key=${this.apiKey}&session_id=${this.sessionId}&page=${page}`);
  }

      // Utilisé pour la pagination (si plus de 20 films retournés)
  getFavoritesPage(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/account/${this.accountId}/favorite/movies?api_key=${this.apiKey}&session_id=${this.sessionId}&page=${page}`);
  }

      // Utilisé pour la pagination (si plus de 20 films retournés)
  getUserRatingsPage(page: number=1): Observable<any> {
    const accountId = localStorage.getItem('account_id');
    const sessionId = localStorage.getItem('session_id');

    if (!accountId || !sessionId) {
      console.error("Account ID ou Session ID manquant.");
      return new Observable();
    }

    return this.http.get(`${this.apiUrl}/account/${accountId}/rated/movies?api_key=${this.apiKey}&session_id=${sessionId}&page=${page}`);
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
}
