import { Entry } from "./entry"

export class Wheel {
    id: string
    name: string
    userId: number
    entries: Entry[]
    createdAt: string

    constructor() {
        this.id = crypto.randomUUID()
        this.name = "New Wheel"
        this.userId = 0
        this.entries = []
        this.createdAt = ""
    }
}