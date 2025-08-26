import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentsListComponent } from './movements-list.component';

describe('MovimentsListComponent', () => {
  let component: MovimentsListComponent;
  let fixture: ComponentFixture<MovimentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimentsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovimentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
