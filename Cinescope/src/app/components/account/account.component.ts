import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements AfterViewInit {
  tabs = [
    { label: 'Favorites', route: 'favorites' },
    { label: 'Watchlist', route: 'watchlist' },
    { label: 'Your Ratings', route: 'user-ratings' },
    { label: 'Your Custom Lists', route: 'user-lists' }
  ];

  activeIndex = 0; // tab active
  sliderPosition = 0; // position slider
  sliderWidth = 0; // largeur slider (car il doit s'adapter à la largeur du texte)

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.setActiveTabByRoute();
  }

  // Initialise et définit l'onglet actif en fonction de la route
  setActiveTabByRoute(): void {
    const currentRoute = this.route.snapshot.firstChild?.url[0]?.path;
    const tabIndex = this.tabs.findIndex(tab => tab.route === currentRoute);
    if (tabIndex !== -1) {
      this.activeIndex = tabIndex;
      this.updateSliderPosition();
    }
  }

  // Définit l'onglet actif et met à jour la navigation (au clic)
  setActiveTab(index: number, route: string, event: MouseEvent): void {
    this.activeIndex = index;
    this.router.navigate([route], { relativeTo: this.route });
    localStorage.removeItem('accountFilters');
    this.updateSliderPosition(event);
  }

  // Met à jour la position du slider sous l'onglet actif
  updateSliderPosition(event?: MouseEvent): void {
    setTimeout(() => {
      let buttonElement: HTMLElement;
      if (event) {
        buttonElement = event.target as HTMLElement;
      } else {
        const buttons = this.el.nativeElement.querySelectorAll('.account-btn');
        buttonElement = buttons[this.activeIndex];
      }
      if (buttonElement) {
        this.sliderPosition = buttonElement.offsetLeft;
        this.sliderWidth = buttonElement.offsetWidth;
      }
      this.cd.detectChanges();
    });
  }
}
