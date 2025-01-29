import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ListService } from '../../services/list/list.service';



@Component({
  selector: 'app-user-lists',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-lists.component.html',
  styleUrl: './user-lists.component.scss'
})
export class UserListsComponent implements OnInit {
  private listService = inject(ListService);
  userLists: any[] = [];
  newListName = '';
  newListDescription = '';

  ngOnInit() {
    this.loadUserLists();
  }

  loadUserLists() {
    this.listService.getUserLists().subscribe(
      (response) => {
        this.userLists = response.results || [];
      },
      (error) => {
        console.error("Erreur lors de la récupération des listes :", error);
      }
    );
  }

  createList() {
    if (this.newListName.trim()) {
      this.listService.createList(this.newListName, this.newListDescription).subscribe(() => {
        this.newListName = '';
        this.newListDescription = '';
        this.loadUserLists();
      });
    }
  }
}
