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

  searchSubject = new Subject<string>(); 

  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef; 

  constructor(private getCharacterService: GetCharactersService) {}

  ngOnInit(): void {
   
    this.loadCharacters();

    this.searchSubject.pipe(
      debounceTime(300), 
      switchMap((term: string) => {
        this.loading = true;
        if (term.trim()) {
          return this.getCharacterService.getCharactersByName(term); 
        } else {
          this.page = 1;
          return this.getCharacterService.getCharactersByPage(this.page); 
        }
      })
    ).subscribe({
      next: (data) => {
        this.arrCharacters = data.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching characters:', error);
        this.arrCharacters = [];
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.loading && !this.searchTerm) {
          this.loadCharacters();
        }
      });
    });

    observer.observe(this.scrollAnchor.nativeElement);
  }
  loadCharacters(): void {
    this.loading = true;
    this.getCharacterService.getCharactersByPage(this.page).subscribe({
      next: (data) => {
        this.arrCharacters = [...this.arrCharacters, ...data.results]; 
        this.loading = false; 
      },
      error: (error) => {
        console.error('Error fetching characters', error);
        this.loading = false;
      }
    });
  }

  onSearchInput(term: string): void {
    this.searchSubject.next(term); 
  }

  searchCharacter(): void {
    this.onSearchInput(this.searchTerm);
  }
}
