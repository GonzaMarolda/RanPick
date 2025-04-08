export class Entry {
    id: string
    name: string
    weight: number

    constructor(name: string) {
        this.name = name
        this.weight = 1
        this.id = crypto.randomUUID()
    }
}