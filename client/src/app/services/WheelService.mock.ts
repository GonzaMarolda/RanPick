import { signal } from '@angular/core'
import { WheelService } from './WheelService'
import { Wheel } from '../models/wheel'

export function createMockWheelService(): Partial<WheelService> {
    const initialWheel: Wheel = {
        id: '0',
        name: 'Mock Wheel',
        userId: 0,
        entries: [
            {
                id: '0',
                name: 'Mock Entry 1',
                weight: 0,
                color: '',
                defaultColor: '',
                wheelId: '0',
            },
            {
                id: '1',
                name: 'Mock Entry 2',
                weight: 0,
                color: '',
                defaultColor: '',
                wheelId: '0',
            }
        ],
        selectedHistory: [],
        createdAt: '',
        updatedAt: ''
  }

  return {
    wheel: signal<Wheel>(initialWheel),
    focusWheel: signal<Wheel>(initialWheel),
    spinnedWheel: signal<Wheel | null>(null),
    errorMessage: signal<string>(""),

    createEmptyWheel: jest.fn(),
    deleteNested: jest.fn(),
    deleteWheelInTree: jest.fn(),
    updateName: jest.fn(),
    addSelectedRecord: jest.fn(),
    setSpinnedWheel: jest.fn(),
    getWheels: jest.fn(),
    getWheel: jest.fn(),
  }
}