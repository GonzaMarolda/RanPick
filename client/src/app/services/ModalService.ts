import { Injectable, signal, Type } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ModalService {
    modalComponent = signal<Type<any> | null>(null)
    modalProps = signal<{ [key: string]: any }>({})
    messageModalOpen = signal<boolean>(false)
    messageModalMessage = signal<string>("")
    messageModalTime : number = 4

    open<T>(component: Type<T>, props?: { [key: string]: any }) {
        this.modalComponent.set(component)
        this.modalProps.set(props || {})
    }

    close() {
        this.modalComponent.set(null)
        this.modalProps.set({})
    }

    openMessageModal(message: string) {
        this.messageModalOpen.set(true)
        this.messageModalMessage.set(message)
        setTimeout(() => {
            this.messageModalOpen.set(false)
            this.messageModalMessage.set("")
        }, this.messageModalTime * 1000)
    }

    closeMessageModal() {
        this.messageModalOpen.set(false)
        this.messageModalMessage.set("")
    }
}