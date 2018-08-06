import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDirectMessageComponent } from './dialog-direct-message.component';

describe('DialogDirectMessageComponent', () => {
  let component: DialogDirectMessageComponent;
  let fixture: ComponentFixture<DialogDirectMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDirectMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDirectMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
