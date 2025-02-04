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
  activeIndex = 0;
  sliderPosition = 0;
  sliderWidth = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.setActiveTabByRoute();
  }

  setActiveTabByRoute() {
    const currentRoute = this.route.snapshot.firstChild?.url[0]?.path || 'favorites';
    const tabIndex = this.tabs.findIndex(tab => tab.route === currentRoute);
    if (tabIndex !== -1) {
      this.activeIndex = tabIndex;
      this.updateSliderPosition();
    }
  }

  setActiveTab(index: number, route: string, event: MouseEvent) {
    this.activeIndex = index;
    this.router.navigate([route], { relativeTo: this.route });
    this.updateSliderPosition(event);
  }

  updateSliderPosition(event?: MouseEvent) {
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
