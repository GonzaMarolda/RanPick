import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ContrastHelperService {
  getContrastTextColor(hexColor: string): 'black' | 'white' {
        const hex = hexColor.replace('#', '');
  
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
      
        const adjustGamma = (channel: number): number => {
          const sRGB = channel / 255;
          return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
        };
      
        const L = 0.2126 * adjustGamma(r) + 0.7152 * adjustGamma(g) + 0.0722 * adjustGamma(b);
      
        return L > 0.179 ? 'black' : 'white';
  }
}