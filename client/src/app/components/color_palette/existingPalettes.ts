export class ColorPalette {
    name: string
    colors: string[]

    constructor(name: string, colors: string[]) {
        this.name = name
        this.colors = colors
    }
}

export const palettes: ColorPalette[] = [
    new ColorPalette(
        "Default",
        ['#51CC0A', '#CC9D10', '#CC4021', '#9200CC', '#1DA0CC']
    ),

    new ColorPalette(
        "Pastel",
        ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#A0C4FF', '#BDB2FF']
    ),

    new ColorPalette(
        "Retro",
        ['#F94144', '#F3722C', '#F8961E', '#F9C74F', '#90BE6D', '#43AA8B']
    ),

    new ColorPalette(
        "Ocean",
        ['#003F5C', '#2F4B7C', '#665191', '#A05195', '#D45087']
    ),

    new ColorPalette(
        "Rainbow",
        ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF']
    ),

    new ColorPalette(
        "Mono Cool",
        ['#B0C4DE', '#87CEFA', '#4682B4', '#4169E1']
    ),

    new ColorPalette(
        "Monochrome",
        ['#111111', '#333333', '#555555', '#777777', '#999999', '#BBBBBB']
    ),

    new ColorPalette(
        "Galaxies", 
        ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#E0E1DD', '#5BC0EB', '#9BC53D', '#E55934']
    ),

    new ColorPalette(
        "Aurora Borealis", 
        ['#1B0036', '#3A0CA3', '#7209B7', '#9D4EDD', '#C77DFF', '#E0AAFF']
    ),

    new ColorPalette(
        "Deep Jungle", 
        ['#154406', '#2F8147', '#78C06C', '#B2D8B2', '#E8F5E9', '#A0C998', '#4E7C59']
    ),
]