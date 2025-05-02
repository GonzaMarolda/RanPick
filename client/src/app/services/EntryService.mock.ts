import { signal, computed, Type } from '@angular/core'
import { EntryService } from './EntryService'
import { WheelService } from './WheelService'
import { Entry } from '../models/entry'
import { Wheel } from '../models/wheel'

export function createMockEntryService(): EntryService {
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

  const mockWheelService: Partial<WheelService> = {
    focusWheel: signal<Wheel>(initialWheel)
  }

  const mock: Partial<EntryService> = {
    wheelService: mockWheelService as WheelService,

    focusWheel: mockWheelService.focusWheel,
    entries: computed(() => mockWheelService.focusWheel!().entries),

    getEntry: jest.fn((id: string) => {
      return mock.entries!().find(e => e.id === id)!
    }),

    createEmpty: jest.fn(),

    removeEntry: jest.fn(),

    updateEntry: jest.fn(),

    getProbability: jest.fn((id: string) => {
      const entry = (mock.getEntry! as any)(id) as Entry
      const weight = entry.weight
      const total = mock.entries!().reduce((sum, e) => sum + e.weight, 0)
      return ((weight / total) * 100).toString().slice(0, 4)
    }),
  }

  return mock as EntryService
}