import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { ModalService } from './services/ModalService';
import { NgComponentOutlet } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpLoadService } from './services/HttpLoadService';
import { MessageModalComponent } from './components/modal/message-modal/messageModal.component';
import { BodyComponent } from "./components/body/body.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NgComponentOutlet, MatProgressSpinnerModule, MessageModalComponent, TranslateModule],
  template: `
    @if (modalService.messageModalOpen()) {
      <message-modal [message]="modalService.messageModalMessage()"/>
    }

    @if (httpLoadService.isLoading()) {
      <div class="loading-modal">
        <mat-spinner [diameter]="70"/>
      </div>
    }
    @if (modalService.modalComponent()) {
      <ng-container 
        *ngComponentOutlet="modalService.modalComponent();
          inputs: modalService.modalProps()"
      />
    }

    <app-header/>
    <router-outlet />
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  modalService = inject(ModalService)
  httpLoadService = inject(HttpLoadService)

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('en');
    this.translate.use('es');
  }
}
