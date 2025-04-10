import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    const activatedRouteStub = {
      params: of({}),
      snapshot: {
        paramMap: {
          get: (key: string) => null
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
