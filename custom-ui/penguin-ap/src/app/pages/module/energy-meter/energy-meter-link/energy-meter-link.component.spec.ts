import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyMeterLinkComponent } from './energy-meter-link.component';

describe('EnergyMeterLinkComponent', () => {
  let component: EnergyMeterLinkComponent;
  let fixture: ComponentFixture<EnergyMeterLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnergyMeterLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnergyMeterLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
