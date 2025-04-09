import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUpperCase]'
})
export class UpperCaseDirective {

  private control = inject(NgControl);

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const uppercased = value.toUpperCase();
    this.control.control?.setValue(uppercased, { emitEvent: false });

    if (this.control && this.control.control) {
      this.control.control.setValue(uppercased, { emitEvent: false });
    }
  }
}
