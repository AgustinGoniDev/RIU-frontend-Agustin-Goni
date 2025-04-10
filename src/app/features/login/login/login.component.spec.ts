import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar error de email requerido', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    expect(component.getEmailErrorMessage()).toBe('El email es obligatorio');
  });

  it('debería mostrar error de email inválido', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('noesmail');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    expect(component.getEmailErrorMessage()).toBe('Introduce un email válido');
  });

  it('debería mostrar error si contraseña es muy corta', () => {
    const passControl = component.loginForm.get('password');
    passControl?.setValue('123');
    passControl?.markAsTouched();
    fixture.detectChanges();
    expect(component.getPasswordErrorMessage()).toBe('La contraseña debe tener al menos 6 caracteres');
  });

  it('debería navegar si el formulario es válido', () => {
    component.loginForm.setValue({ email: 'test@algo.com', password: '123456' });
    component.onSubmit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

});
