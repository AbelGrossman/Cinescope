import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-star-rating",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-rating-popup">
      <div class="star-rating-content">
        <h2>Rate this movie</h2>
        <div class="stars">
          <span *ngFor="let star of stars; let i = index" 
                (click)="rate(i + 1)" 
                (mouseenter)="hover(i + 1)"
                (mouseleave)="hover(0)"
                [class.filled]="star <= (hoverRating || rating)">
            ★
          </span>
        </div>
        <div class="rating-value">{{ hoverRating || rating || 0 }}/10</div>
        <div class="buttons">
          <button (click)="confirmRating()">Confirm</button>
          <button (click)="cancel()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .star-rating-popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .star-rating-content {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stars {
      font-size: 2em;
      color: #ccc;
      cursor: pointer;
    }
    .stars span {
      transition: color 0.2s;
    }
    .stars span.filled {
      color: gold;
    }
    .rating-value {
      font-size: 1.2em;
      margin: 10px 0;
    }
    .buttons {
      margin-top: 20px;
    }
    button {
      margin: 0 10px;
      padding: 5px 15px;
      cursor: pointer;
    }
  `,
  ],
})
export class StarRatingComponent {
  @Input() initialRating = 0
  @Output() ratingChange = new EventEmitter<number>()
  @Output() close = new EventEmitter<void>()

  stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  rating = 0
  hoverRating = 0

  ngOnInit() {
    this.rating = this.initialRating
  }

  rate(rating: number) {
    this.rating = rating
  }

  hover(rating: number) {
    this.hoverRating = rating
  }

  confirmRating() {
    this.ratingChange.emit(this.rating)
    this.close.emit()
  }

  cancel() {
    this.close.emit()
  }
}

