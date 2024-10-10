import { TestBed } from '@angular/core/testing';

import { GetCharactersService } from './get-characters.service';

describe('GetCharactersService', () => {
  let service: GetCharactersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCharactersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
