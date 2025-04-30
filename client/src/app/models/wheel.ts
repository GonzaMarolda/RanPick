import { Entry } from "./entry"

export class Wheel {
    id: string
    name: string
    userId: number
    entries: Entry[]
    fatherWheelId?: string
    fatherEntryId?: string
    createdAt: string
    updatedAt: string

    constructor() {
        this.id = crypto.randomUUID()
        this.name = "Wheel Name"
        this.userId = 0
        this.entries = []
        this.createdAt = ""
        this.updatedAt = ""
    }
}