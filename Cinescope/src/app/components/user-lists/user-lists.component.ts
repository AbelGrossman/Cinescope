// user-lists.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ListService } from '../../services/list/list.service';
import { ListformComponent } from '../list-form/list-form.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-lists',
  standalone: true,
  templateUrl: './user-lists.component.html',
  styleUrls: ['./user-lists.component.scss'],
  imports: [CommonModule, RouterModule, ListformComponent],
})
export class UserListsComponent implements OnInit {
  private listService = inject(ListService);
  userLists: any[] = [];
  isModalOpen = false;
  selectedList: any = null;

  ngOnInit(): void {
    this.loadUserLists();
  }

  loadUserLists(): void {
    this.listService.getUserLists().subscribe({
      next: (response) => {
        this.userLists = response.results || [];
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des listes :', err);
      }
    });
  }

  openCreateModal(): void {
    this.selectedList = null;
    this.isModalOpen = true;
    console.log("f,")
  }

  openEditModal(list: any): void {
    this.selectedList = list;
    this.isModalOpen = true;
  }

  onModalClose(refreshNeeded: boolean): void {
    this.isModalOpen = false;
    console.log("erererere");
      this.loadUserLists();

  }
  

  deleteList(list: any): void {
    this.listService.deleteList(list.id).subscribe({
      next: () => this.loadUserLists(),
      error: (err) => console.error('Erreur lors de la suppression :', err)
    });
  }
}
