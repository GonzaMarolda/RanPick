export class Entry {
    id: string
    name: string
    weight: number
    color: string
    defaultColor: string

    constructor(name: string) {
        this.name = name
        this.weight = 1
        this.id = crypto.randomUUID()
        this.color = ""
        this.defaultColor = ""
    }
}