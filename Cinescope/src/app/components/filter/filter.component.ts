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
  isAscending: boolean = false; 

  ratingOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 1);

  ngOnInit() {
    const savedFilters = localStorage.getItem('movieFilters');
    if (savedFilters) {
      this.filters = JSON.parse(savedFilters);
      this.isAscending = this.filters.sortOrder === 'asc';
    }
  }

  applyFilters() {
    localStorage.setItem('movieFilters', JSON.stringify(this.filters));
    this.filtersChanged.emit(this.filters);
  }

  toggleSortOrder() {
    this.isAscending = !this.isAscending;
    this.filters.sortOrder = this.filters.sortOrder === 'desc' ? 'asc' : 'desc';
    this.applyFilters();  
  }
}
