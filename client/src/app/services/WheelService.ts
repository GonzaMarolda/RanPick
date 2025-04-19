import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Wheel } from '../models/wheel';
import { EntryService } from './EntryService';
import { AuthService } from './AuthService';

@Injectable({ providedIn: 'root' })
export class WheelService {
    entryService = inject(EntryService)
    authService = inject(AuthService)
    wheel = signal<Wheel>(new Wheel())
    updateEntries = effect(() => {
        const entries = this.entryService.entries()
        this.wheel.update(prev => ({...prev, entries: entries}))
    })
    errorMessage = signal<string>("")

    updateName(name: string) {
        this.wheel.update(prev => ({...prev, name: name}))
    }

    async getWheels(userId: string) : Promise<Wheel[]> {
        const token = this.authService.accessToken()
        const res = await fetch('http://localhost:3001/api/wheel', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        this.processError(res)
    
        const data = await res.json();
        console.log(data)
        return data
    }

    async saveWheel() {
        const token = this.authService.accessToken()
        const res = await fetch('http://localhost:3001/api/wheel', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' , 
            },
            body: JSON.stringify(this.wheel()),
        })
        this.processError(res)
    
        const data = await res.json();
        console.log(data)
        return data
    }

    private async processError(res: any) {
        if (!res.ok) {
            const err = await res.json();
            res.status === 400 ? this.errorMessage.set(err.error) : this.errorMessage.set("There was an error")
            throw new Error(JSON.stringify(err));
        } 
    }
}