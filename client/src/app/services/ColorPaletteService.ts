import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ColorPalette } from '../models/colorPalette';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ColorPaletteService {
    http = inject(HttpClient)
    palettes = signal<ColorPalette[]>([{id: 0, name: "-", colors: ["#FFFFFF"]}])

    constructor() {
        this.getColorPalettes().then(() => {

        })
    }

    async getColorPalettes() {
        try {
            const data = await firstValueFrom(
                this.http.get<ColorPalette[]>(environment.apiUrl + '/color-palette')
            )
            this.palettes.set(data)
        } catch (err) {
            console.error((err as any).message)
            throw err
        }
    }
}