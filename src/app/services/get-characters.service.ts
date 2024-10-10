import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Characters } from '../interfaces/characters';

@Injectable({
  providedIn: 'root'
})
export class GetCharactersService {

  private apiUrl = 'https://rickandmortyapi.com/api/character/';

  constructor(private http: HttpClient) { }

  getCharacters(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCharactersByName(name: string = ''): Observable<any> {
    const searchUrl = `${this.apiUrl}?name=${name}`;  
    return this.http.get<any>(searchUrl);
  }

  getCharactersByPage(page: number): Observable<any> {
    const paginatedUrl = `${this.apiUrl}?page=${page}`;
    return this.http.get<any>(paginatedUrl);
  }
}
