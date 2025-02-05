import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { ListService } from '../../services/list/list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-form',
  standalone: true,
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ListformComponent implements OnInit {
  private listService = inject(ListService);

  @Input() listData: any | null = null;
  @Output() close = new EventEmitter<boolean>();

  name = '';
  description = '';

  // Si modification d'une liste, on pré-remplit les champs
  ngOnInit(): void {
    if (this.listData) {
      this.name = this.listData.name;
      this.description = this.listData.description;
    }
  }

  //  J'ai ajouté un delay ici car sinon on récupèrait pas la liste màj ou la liste créée
  async onSave(): Promise<void> {
    if (!this.name.trim()) {
      return;
    }
  
    if (this.listData) {
      this.listService.updateList(this.listData.id, this.name, this.description);
      await this.delay(1000);
      this.close.emit(true);
    } else {
      this.listService.createList(this.name, this.description)
        .subscribe({
          next: () => this.close.emit(true),
          error: (err) => console.error('Erreur lors de la création :', err)
        });
    }
  }
  
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

  
}
