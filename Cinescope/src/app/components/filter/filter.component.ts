import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Output() filtersChanged = new EventEmitter<any>();

  filters = {
    genre: '',
    minRating: '',
    year: '',
    sortBy: 'popularity',
    sortOrder: 'desc'
  };

  ratingOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 1);

  applyFilters() {
    this.filtersChanged.emit(this.filters);
  }

  toggleSortOrder() {
    this.filters.sortOrder = this.filters.sortOrder === 'desc' ? 'asc' : 'desc';
    this.applyFilters();
  }
}
