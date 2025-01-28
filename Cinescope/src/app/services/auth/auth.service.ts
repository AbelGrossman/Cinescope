import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiKey = '5f655d03711a9fbeed5f7797e77ea387';
  private apiUrl = 'https://api.themoviedb.org/3';

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
  
}
