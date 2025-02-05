import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private apiKey = environment.apiKey;
  private apiUrl = environment.apiUrl;
  private sessionId = localStorage.getItem('session_id');
  private accountId = localStorage.getItem('account_id');

  constructor(private http: HttpClient) {}

  createList(name: string, description: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/list?api_key=${this.apiKey}&session_id=${this.sessionId}`,
      { name, description, language: 'fr' },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  getUserLists(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/account/${this.accountId}/lists?api_key=${this.apiKey}&session_id=${this.sessionId}`
    );
  }

  getListMovies(listId: number, page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${listId}`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
      }
    });
  }
  

  getListMoviesPage(listId: number, page: number = 1): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/list/${listId}?api_key=${this.apiKey}&page=${page}`
    );
  }

  addToCustomList(listId: number, movieId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/list/${listId}/add_item?api_key=${this.apiKey}&session_id=${this.sessionId}`,
      { media_id: movieId },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  removeFromCustomList(listId: number, movieId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/list/${listId}/remove_item?api_key=${this.apiKey}&session_id=${this.sessionId}`,
      { media_id: movieId },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  deleteList(listId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/list/${listId}?api_key=${this.apiKey}&session_id=${this.sessionId}`
    );
  }

  
  // Il est pas encore possible d'update un list via l'API TMDB v3 pour un utilisateur (avec le session_id).
  // On a donc été obligé de faire ça (sauvegardr la liste initiale, la supprimer, puis recréer une nouvelle liste avec les mêmes films).
  updateList(listId: number, newName: string, newDescription: string): void {
    this.getListMovies(listId).subscribe(oldList => {
      const movies = oldList.items ? oldList.items.map((m: any) => m.id) : [];
      this.deleteList(listId).subscribe(() => {
        this.createList(newName, newDescription).subscribe(created => {
          const newListId = created.list_id;
          movies.forEach((movieId: number) => {
            this.addToCustomList(newListId, movieId).subscribe();
          });
        });
      });
    });
  }
}
