import { ElementRef, Renderer2, Directive, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[vktoggle]',
})
export class VktoggleDirective implements AfterViewInit, OnDestroy {
  private shown = false;
  private toggleIcon!: HTMLElement;
  private unlisten!: () => void;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    const input = this.el.nativeElement;
    if (input.type !== 'password') {
      console.warn('VktoggleDirective should only be applied to an <input type="password"> element.');
      return;
    }
    this.toggleIcon = this.renderer.createElement('i');
    this.renderer.addClass(this.toggleIcon, 'password-toggle');
    this.renderer.addClass(this.toggleIcon, 'fa');
    this.renderer.addClass(this.toggleIcon, 'fa-eye');
    this.renderer.setAttribute(this.toggleIcon, 'role', 'button');
    this.renderer.setAttribute(this.toggleIcon, 'aria-label', 'Show or hide password');
    this.renderer.setStyle(this.toggleIcon, 'position', 'absolute');
    this.renderer.setStyle(this.toggleIcon, 'right', '-0.25rem');
    this.renderer.setStyle(this.toggleIcon, 'top', '18%');
   
    this.renderer.setStyle(this.toggleIcon, 'cursor', 'pointer');
    this.renderer.setStyle(this.toggleIcon, 'font-size', '1.2rem');
    this.renderer.setStyle(this.toggleIcon, 'color', '#1976d2');

    const parent = this.renderer.parentNode(input);
    this.renderer.setStyle(parent, 'position', 'relative');
    this.renderer.appendChild(parent, this.toggleIcon);
    this.unlisten = this.renderer.listen(this.toggleIcon, 'click', () => this.toggle());
  }

  toggle(): void {
    this.shown = !this.shown;
    this.el.nativeElement.type = this.shown ? 'text' : 'password';
    this.renderer.removeClass(this.toggleIcon, this.shown ? 'fa-eye' : 'fa-eye-slash');
    this.renderer.addClass(this.toggleIcon, this.shown ? 'fa-eye-slash' : 'fa-eye');
    this.renderer.setAttribute(this.toggleIcon, 'aria-label', this.shown ? 'Hide password' : 'Show password');
  }

  ngOnDestroy(): void {
    if (this.unlisten) {
      this.unlisten();
    }
  }
}
