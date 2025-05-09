import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { Wheel } from '../models/wheel';
import { AuthService } from './AuthService';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { Entry } from '../models/entry';
import { SelectedRecord } from '../models/selectedRecord';
import { ColorPaletteService } from './ColorPaletteService';
import { ColorPalette } from '../models/colorPalette';

@Injectable({ providedIn: 'root' })
export class WheelService {
    http = inject(HttpClient)
    authService = inject(AuthService)
    colorPaletteService = inject(ColorPaletteService)
    wheel = signal<Wheel>(new Wheel(this.colorPaletteService.palettes()[0]))
    focusWheel = signal<Wheel>(this.wheel())
    spinnedWheel = signal<Wheel | null>(null)
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
        const newWheel = new Wheel(this.colorPaletteService.palettes()[0])
        this.wheel.set(newWheel)
        this.focusWheel.set(newWheel)
        localStorage.removeItem("last_wheel_id")
    }

    deleteNested(wheelId: string) {
        const nestedWheel = this.getNestedWheel(wheelId)
        this.wheel.update(root => this.deleteWheelInTree(root, nestedWheel));
    }

    deleteWheelInTree(root: Wheel, toDelete: Wheel) {
        return {
        ...root,
        entries: root.entries.map(entry => {
            if (entry.nestedWheel || toDelete.fatherEntryId === entry.id) {
                return {
                    ...entry,
                    nestedWheel: toDelete.fatherEntryId === entry.id ? undefined : this.replaceWheelInTree(entry.nestedWheel!, toDelete)
                }
            }
            return entry;
        })
        }
    }

    private replaceWheelInTree(root: Wheel, updated: Wheel): Wheel {
        if (root.id === updated.id) {
          return updated;
        }

        return {
          ...root,
          entries: root.entries.map(entry => {
            if (entry.nestedWheel || updated.fatherEntryId === entry.id) {
                return {
                    ...entry,
                    nestedWheel: updated.fatherEntryId === entry.id ? updated : this.replaceWheelInTree(entry.nestedWheel!, updated)
                }
            }
            return entry;
          })
        }
    }

    updateName(name: string) {
        this.focusWheel.update(prev => ({...prev, name: name}))
    }

    setColorPalette(palette: ColorPalette) {
        this.focusWheel.update(prev => ({...prev, colorPalette: palette}))
    }

    addSelectedRecord(selected: Entry[]) {
        const recordName = selected.map(s => s.name).join("-")
        const recordColor =  selected[selected.length - 1].color ? 
            selected[selected.length - 1].color : 
            selected[selected.length - 1].defaultColor

        const selectedRecord = new SelectedRecord(
            recordName, 
            recordColor
        )

        this.focusWheel.set(this.spinnedWheel()!)
        this.focusWheel.update(prev => ({...prev, selectedHistory: prev.selectedHistory.slice(0, 18).concat(selectedRecord)}))
        this.spinnedWheel.set(null)
    }

    setSpinnedWheel() {
        this.spinnedWheel.set(this.focusWheel())
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
        const newNestledWheel = new Wheel(this.colorPaletteService.palettes()[0])
        newNestledWheel.fatherEntryId = entry.id
        newNestledWheel.fatherWheelId = entry.wheelId
        this.wheel.update(root => this.replaceWheelInTree(root, newNestledWheel))
        this.openNestedWheel(newNestledWheel.id)
    }

    openNestedWheel(wheelId: string) {
        if (!wheelId) return

        const nestedWheel = this.getNestedWheel(wheelId)
        this.focusWheel.set(nestedWheel)
    }

    getNestedWheel(wheelId: string): Wheel {
        const focusWheelId = wheelId
        const wheel = this.wheel()
        const wheelStack: Wheel[] = [wheel]
        while (wheelStack.length > 0) {
            const currentWheel = wheelStack.pop()!

            if (currentWheel.id === focusWheelId) {
                return currentWheel
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