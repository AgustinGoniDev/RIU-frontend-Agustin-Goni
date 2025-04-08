import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroDetailListComponent } from './hero-detail-list.component';

describe('HeroDetailListComponent', () => {
  let component: HeroDetailListComponent;
  let fixture: ComponentFixture<HeroDetailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDetailListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
