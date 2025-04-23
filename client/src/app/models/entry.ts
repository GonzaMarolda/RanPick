import { Wheel } from "./wheel"

export class Entry {
    id: string
    name: string
    weight: number
    color: string
    defaultColor: string
    nestedWheel?: Wheel
    wheelId: string

    constructor(name: string, wheelId: string) {
        this.name = name
        this.wheelId = wheelId
        this.weight = 1
        this.id = crypto.randomUUID()
        this.color = ""
        this.defaultColor = ""
    }
}