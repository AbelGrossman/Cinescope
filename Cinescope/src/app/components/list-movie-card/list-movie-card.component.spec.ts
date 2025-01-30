import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMovieCardComponent } from './list-movie-card.component';

describe('ListMovieCardComponent', () => {
  let component: ListMovieCardComponent;
  let fixture: ComponentFixture<ListMovieCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMovieCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMovieCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
