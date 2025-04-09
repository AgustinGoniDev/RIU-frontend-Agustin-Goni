import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UpperCaseDirective } from './upper-case.directive';

@Component({
  selector: 'app-test',
  template: `<input [formControl]="control" appUpperCase>`,
  imports: [ReactiveFormsModule, UpperCaseDirective],
})
class TestComponent {
  control = new FormControl('');
}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, UpperCaseDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should convert input value to uppercase', async () => {
    inputEl.value = 'batman';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.control.value).toBe('BATMAN');
  });

  it('should not throw if no control is found', () => {
    expect(() => {
      inputEl.dispatchEvent(new Event('input'));
    }).not.toThrow();
  });
});