import { computed, Injectable, signal, Type } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ModalService {
    modalComponent = signal<Type<any> | null>(null);
    modalProps = signal<{ [key: string]: any }>({});

    open<T>(component: Type<T>, props?: { [key: string]: any }) {
        this.modalComponent.set(component);
        this.modalProps.set(props || {});
    }

    close() {
        this.modalComponent.set(null);
        this.modalProps.set({});
    }
}