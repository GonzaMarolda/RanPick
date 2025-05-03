import { ComponentFixture, TestBed } from "@angular/core/testing"
import { EntryComponent } from "./entry.component"
import { ModalService } from "../../services/ModalService"
import { WheelService } from "../../services/WheelService"
import { EntryService } from "../../services/EntryService"
import { createMockModalService } from "../../services/ModalService.mock"
import { createMockEntryService } from "../../services/EntryService.mock"
import { createMockWheelService } from "../../services/WheelService.mock"
import { ConfirmationModalComponent } from "../modal/confirm-modal/confirmModal.component"

describe('EntryComponent', () => {
    let component: EntryComponent
    let fixture: ComponentFixture<EntryComponent>
    let mockModalService = createMockModalService()
    let mockEntryService = createMockEntryService()
    let mockWheelService = createMockWheelService()
    let removeSpy: jest.SpyInstance

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EntryComponent],
            providers: [
                { provide: ModalService, useValue: mockModalService },
                { provide: EntryService, useValue: mockEntryService },
                { provide: WheelService, useValue: mockWheelService },
            ]
        }).compileComponents()

        fixture = TestBed.createComponent(EntryComponent)
        component = fixture.componentInstance
        removeSpy = jest.spyOn(component.removeEntry, 'emit')
    })

    it('should get entry data', () => {
        fixture.componentRef.setInput('entryId', '0')

        expect(component.entryData().name).toEqual("Mock Entry 0")
    })

    it('on remove: emits removeEntry if there is no nestedWheel', () => {
        fixture.componentRef.setInput('entryId', '0')
        component.onRemove()
        expect(removeSpy).toHaveBeenCalledWith('0')
        expect(mockModalService.open).not.toHaveBeenCalled()
      })

    it('on remove: opens confirmation modal if there is a nestedWheel', () => {
        fixture.componentRef.setInput('entryId', '1')
        component.onRemove()
        expect(mockModalService.open).toHaveBeenCalled()
        expect(removeSpy).not.toHaveBeenCalled()
    })
})