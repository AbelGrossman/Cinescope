import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListsComponent } from './user-lists.component';

describe('UserListsComponent', () => {
  let component: UserListsComponent;
  let fixture: ComponentFixture<UserListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
