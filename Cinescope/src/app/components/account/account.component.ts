import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  standalone:true,
  imports: [CommonModule, RouterModule],
  styleUrl: './account.component.scss'
})
export class AccountComponent implements AfterViewInit {

  // Définition des onglets avec leurs routes
  tabs = [
    { label: "Favorites", route: "favorites" },
    { label: "Watchlist", route: "watchlist" },
    { label: "Your Ratings", route: "user-ratings" },
    { label: "Your Custom Lists", route: "user-lists" }
  ];

  activeIndex = 0;
  sliderPosition = 0;
  sliderWidth = 0;

  constructor(private router: Router, private route: ActivatedRoute, private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.setActiveTabByRoute();
  }

  /**
   * Met à jour l'onglet actif et la position du slider en fonction de l'URL actuelle
   */
  setActiveTabByRoute() {
    const currentRoute = this.route.snapshot.firstChild?.url[0]?.path || "favorites"; // Par défaut : "favorites"
    const tabIndex = this.tabs.findIndex(tab => tab.route === currentRoute);

    if (tabIndex !== -1) {
      this.activeIndex = tabIndex;
      this.updateSliderPosition();
    }
  }

  /**
   * Change l'onglet actif et met à jour le slider
   */
  setActiveTab(index: number, route: string, event: MouseEvent) {
    this.activeIndex = index;
    this.router.navigate([route], { relativeTo: this.route });

    // Met à jour la position et la taille du slider
    this.updateSliderPosition(event);
  }

  /**
   * Met à jour la position et la largeur du slider
   */
  updateSliderPosition(event?: MouseEvent) {
    setTimeout(() => {
      let buttonElement: HTMLElement;

      if (event) {
        buttonElement = event.target as HTMLElement;
      } else {
        buttonElement = this.el.nativeElement.querySelector(".account-btn.active");
      }

      if (buttonElement) {
        this.sliderPosition = buttonElement.offsetLeft;
        this.sliderWidth = buttonElement.offsetWidth;
      }
    });
  }
}
