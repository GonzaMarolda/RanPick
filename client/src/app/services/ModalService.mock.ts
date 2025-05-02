import { signal } from '@angular/core'
import { ModalService } from './ModalService'
import { Type } from '@angular/core'

export function createMockModalService(): ModalService {
  return {
    modalComponent: signal<Type<any> | null>(null),
    modalProps: signal({}),
    messageModalOpen: signal(false),
    messageModalMessage: signal(''),
    messageModalTime: 4,

    open: jest.fn(),
    close: jest.fn(),
    openMessageModal: jest.fn(),
    closeMessageModal: jest.fn(),
  }
}