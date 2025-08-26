import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUnityComponent } from './modal-unity.component';

describe('ModalUnityComponent', () => {
  let component: ModalUnityComponent;
  let fixture: ComponentFixture<ModalUnityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUnityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalUnityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
