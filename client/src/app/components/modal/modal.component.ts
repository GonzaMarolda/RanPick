import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  selected = input.required<string>()
  isOpen = signal<boolean>(false)
}
