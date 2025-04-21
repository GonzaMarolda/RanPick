import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Wheel } from '../models/wheel';
import { EntryService } from './EntryService';
import { AuthService } from './AuthService';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({ providedIn: 'root' })
export class WheelService {
    http = inject(HttpClient)
    entryService = inject(EntryService)
    authService = inject(AuthService)
    wheel = signal<Wheel>(new Wheel())
    updateEntries = effect(() => {
        const entries = this.entryService.entries()
        this.wheel.update(prev => ({...prev, entries: entries}))
    })
    errorMessage = signal<string>("")

    constructor() {
        const storedWheelId = localStorage.getItem("last_wheel_id")
    
        if (storedWheelId) {
            this.getWheel(storedWheelId)
        }
    }

    updateName(name: string) {
        this.wheel.update(prev => ({...prev, name: name}))
    }

    async getWheels() : Promise<Wheel[]> {
        const token = this.authService.accessToken()
        try {
            const data = await firstValueFrom(
                this.http.get<Wheel[]>(environment.apiUrl + '/wheel', {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    }
                })
            )
            return data
        } catch (err) {
            this.processError(err)
            throw err
        }
    }

    async getWheel(wheelId: string): Promise<Wheel> {
        const token = this.authService.accessToken()
        try {
            const data = await firstValueFrom(
                this.http.get<Wheel>(environment.apiUrl + '/wheel/' + wheelId, {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    }
                })
            )
        
            this.wheel.set(data)
            this.entryService.entries.set(data.entries ? data.entries : [])
            localStorage.setItem("last_wheel_id", data.id)
            return data
        } catch (err) {
            this.processError(err)
            throw err
        }
    }

    async saveWheel() {
        const token = this.authService.accessToken()
        try {
            const data = await lastValueFrom(
                this.http.put<Wheel>(environment.apiUrl + '/wheel',
                    JSON.stringify(this.wheel()), 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json' , 
                        }
                    }
                )
            )
    
            localStorage.setItem("last_wheel_id", data.id)
            return data
        } catch (err) {
            this.processError(err)
            throw err
        }
    }

    async deleteWheel(wheelId: string): Promise<void> {
        const token = this.authService.accessToken()
        try {
            await lastValueFrom(
                this.http.delete<Wheel>(environment.apiUrl + '/wheel/' + wheelId,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json' , 
                        }
                    }
                )
            )
    
            if (this.wheel().id === wheelId) localStorage.removeItem("last_wheel_id")
        } catch (err) {
            this.processError(err)
            throw err
        }
    }

    private async processError(err: any) {
        err.status === 400 ? this.errorMessage.set(err.message) : this.errorMessage.set("There was an error")
    }
}