import { ColorPalette } from "./colorPalette"
import { Entry } from "./entry"
import { SelectedRecord } from "./selectedRecord"

export class Wheel {
    id: string
    name: string
    colorPalette: ColorPalette
    userId: number
    entries: Entry[]
    selectedHistory: SelectedRecord[]
    fatherWheelId?: string
    fatherEntryId?: string
    createdAt: string
    updatedAt: string

    constructor(defaultPalette: ColorPalette) {
        this.id = crypto.randomUUID()
        this.name = "Wheel Name"
        this.colorPalette = defaultPalette
        this.userId = 0
        this.entries = []
        this.selectedHistory = []
        this.createdAt = ""
        this.updatedAt = ""
    }
}