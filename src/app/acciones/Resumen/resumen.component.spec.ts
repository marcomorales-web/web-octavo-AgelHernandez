import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenComponent } from './resumen.component';

describe('ResumenComponent', () => {
  let component: ResumenComponent;
  let fixture: ComponentFixture<ResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
