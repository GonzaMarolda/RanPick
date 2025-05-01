export class SelectedRecord {
    id: string
    name: string
    color: string

    constructor(name: string, color: string) {
        this.id = crypto.randomUUID()
        this.name = name
        this.color = color
    }
}