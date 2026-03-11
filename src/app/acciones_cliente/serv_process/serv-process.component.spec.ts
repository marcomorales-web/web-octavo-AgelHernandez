import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServProcessComponent } from './serv-process.component';

describe('ServProcessComponent', () => {
  let component: ServProcessComponent;
  let fixture: ComponentFixture<ServProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServProcessComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
