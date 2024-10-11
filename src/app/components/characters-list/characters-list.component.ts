import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GetCharactersService } from '../../services/get-characters.service';
import { Characters } from '../../interfaces/characters';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent implements OnInit {
  arrCharacters: Characters[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  page: number = 1;
  noCharactersFound: boolean = false;
  isSearching: boolean = false;

  searchSubject = new Subject<string>(); 

  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef; 

  constructor(private getCharacterService: GetCharactersService) {}

  ngOnInit(): void {
    this.loadCharacters();  
    
    this.searchSubject.pipe(
      debounceTime(300),  
      switchMap((term: string) => {
        this.loading = true;
        this.isSearching = !!term.trim();  
        if (this.isSearching) {
          return this.getCharacterService.getCharactersByName(term);
        } else {
          this.page = 1;  
          return this.getCharacterService.getCharactersByPage(this.page);
        }
      })
    ).subscribe({
      next: (data) => {
        this.loading = false;
        if (this.isSearching) {
          this.arrCharacters = data.results;  
          this.noCharactersFound = data.results.length === 0;  
        } else {
          this.arrCharacters = [...this.arrCharacters, ...data.results];  
        }
      },
      error: (error) => {
        console.error('Error fetching characters:', error);
        this.loading = false;
        this.arrCharacters = []; 
        this.noCharactersFound = true; 
      }
    });
  
    this.searchSubject.next('');
  }
  
  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.loading) {
          console.log('Scroll anchor visible, loading more characters...');
         if (this.isSearching) {
          this.searchSubject.next(this.searchTerm);
         } else {
          this.loadCharacters();
         }
        }
      });
    });
  
    observer.observe(this.scrollAnchor.nativeElement);  
    this.loadCharacters;
  }
  
  loadCharacters(page?: number): void {
    if (!this.isSearching && !this.loading) {
      this.loading = true;
  
      const currentPage = page || this.page;
      this.getCharacterService.getCharactersByPage(currentPage).subscribe({
        next: (data) => {
          this.arrCharacters = [...this.arrCharacters, ...data.results];
  
          if (data.info && currentPage < data.info.pages) {
            this.page = currentPage + 1;
          } else {
            console.log("No more pages available");
          }
  
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading characters:', error);
          this.loading = false;
        }
      });
    }
  }
  
  onSearchInput(term: string): void {
    this.searchTerm = term.trim();  
  
    if (!this.searchTerm) {
      this.arrCharacters = [];  
      this.page = 1; 
      this.isSearching = false;  
      this.noCharactersFound = false;  
      this.loadCharacters();  
    } else {
   
      this.arrCharacters = [];  
      this.page = 1;  
      this.isSearching = true;  
      this.noCharactersFound = false;  
      this.searchSubject.next(this.searchTerm);  
    }
  }
  

  searchCharacter(): void {
    this.onSearchInput(this.searchTerm);
  }
}


