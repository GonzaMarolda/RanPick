import { signal, computed, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpLoadService {
  private activeRequests = signal(0);
  isLoading = computed(() => this.activeRequests() > 0);

  incrementRequests() {
    this.activeRequests.update(count => count + 1);
  }

  decrementRequests() {
    this.activeRequests.update(count => Math.max(0, count - 1));
  }
}