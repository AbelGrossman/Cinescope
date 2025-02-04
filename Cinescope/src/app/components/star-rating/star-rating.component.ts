import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie/movie.service';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {
  @Input() initialRating = 0;
  @Input() movieId!: number;
  @Output() ratingChange = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

    private movieService = inject(MovieService);
  

  stars = Array.from({ length: 10 }, (_, i) => i + 1);
  rating = 0;
  hoverRating = 0;

  constructor() {}

  ngOnInit(): void {
    this.rating = this.initialRating;
  }

  rate(star: number): void {
    this.rating = star;
  }

  hover(star: number): void {
    this.hoverRating = star;
  }

  confirmRating(): void {
    this.ratingChange.emit(this.rating);
    this.close.emit();
  }

  cancel(): void {
    this.close.emit();
  }

  removeRating(): void {
    if (!this.movieId) {
      console.error('movieId manquant pour supprimer le rating.');
      return;
    }
    this.movieService.removeRating(this.movieId).subscribe({
      next: () => {
        this.rating = 0;
        this.ratingChange.emit(0);
        this.close.emit();
      }
    });
  }
}
