import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewInviteComponent } from './dialog-view-invite.component';

describe('DialogViewInviteComponent', () => {
  let component: DialogViewInviteComponent;
  let fixture: ComponentFixture<DialogViewInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogViewInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogViewInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
