import { Directive, ElementRef, Output, EventEmitter, HostListener, OnDestroy, Renderer2 } from '@angular/core'

@Directive({
  selector: '[clickOutside]',
  standalone: true
})
export class ClickOutsideDirective implements OnDestroy {
  @Output() clickOutside = new EventEmitter<void>()
  private removeClickListener?: () => void

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    setTimeout(() => {
        this.removeClickListener = this.renderer.listen(
          'document',
          'mousedown',
          (event: MouseEvent) => this.handleDocumentClick(event)
        )
    }, 300)
  }

  private handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    const clickedInside = this.elementRef.nativeElement.contains(target)
    
    if (!clickedInside) {
      this.clickOutside.emit()
    }
  }

  ngOnDestroy(): void {
    if (this.removeClickListener) {
      this.removeClickListener()
    }
  }
}