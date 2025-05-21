import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatResultsComponent } from './seat-results.component';

describe('SeatResultsComponent', () => {
  let component: SeatResultsComponent;
  let fixture: ComponentFixture<SeatResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
