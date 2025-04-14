import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { ModalService } from './services/ModalService';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NgComponentOutlet],
  template: `
    <app-header/>
    @if (modalService.modalComponent()) {
      <ng-container 
        *ngComponentOutlet="modalService.modalComponent();
          inputs: modalService.modalProps()"
      />
    }
    <router-outlet />
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  modalService = inject(ModalService)
}
