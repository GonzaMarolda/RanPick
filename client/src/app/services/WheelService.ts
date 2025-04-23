import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { Wheel } from '../models/wheel';
import { EntryService } from './EntryService';
import { AuthService } from './AuthService';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { Entry } from '../models/entry';

@Injectable({ providedIn: 'root' })
export class WheelService {
    http = inject(HttpClient)
    authService = inject(AuthService)
    wheel = signal<Wheel>(new Wheel())
    focusWheel = signal<Wheel>(this.wheel())
    errorMessage = signal<string>("")

    constructor() {
        const storedWheelId = localStorage.getItem("last_wheel_id") 
        if (storedWheelId) {
            this.getWheel(storedWheelId)
        }

        effect(() => {
            const updated = this.focusWheel();
            this.wheel.update(root => this.replaceWheelInTree(root, updated));
        })
    }

    createEmptyWheel() {
        const newWheel = new Wheel()
        this.wheel.set(newWheel)
        this.focusWheel.set(newWheel)
        localStorage.removeItem("last_wheel_id")
    }

    private replaceWheelInTree(root: Wheel, updated: Wheel): Wheel {
        if (root.id === updated.id) {
          return updated;
        }

        return {
          ...root,
          entries: root.entries.map(entry => {
            if (updated.fatherEntryId === entry.id) {
              return {
                ...entry,
                nestedWheel: entry.nestedWheel ? this.replaceWheelInTree(entry.nestedWheel, updated) : updated,
              };
            }
            return entry;
          })
        }
    }

    updateName(name: string) {
        this.focusWheel.update(prev => ({...prev, name: name}))
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
            this.focusWheel.set(data)
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
            console.log(data)
            return data
        } catch (err) {
            this.processError(err)
            throw err
        }
    }

    async createNestledWheel(entry: Entry) {
        const newNestledWheel = new Wheel()
        newNestledWheel.fatherEntryId = entry.id
        newNestledWheel.fatherWheelId = entry.wheelId
        this.wheel.update(root => this.replaceWheelInTree(root, newNestledWheel));
        this.openNestedWheel(newNestledWheel.id)
    }

    openNestedWheel(wheelId: string) {
        const focusWheelId = wheelId
        const wheel = this.wheel()
        const wheelStack: Wheel[] = [wheel]
        while (wheelStack.length > 0) {
            const currentWheel = wheelStack.pop()!

            if (currentWheel.id === focusWheelId) {
                this.focusWheel.set(currentWheel)
                return 
            }

            for (const entry of currentWheel.entries) {
                if (entry.nestedWheel) {
                    wheelStack.push(entry.nestedWheel)
                }
            }
        }
        
        throw Error("No wheel found for focused wheel id")
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