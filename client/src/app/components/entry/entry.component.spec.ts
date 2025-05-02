import { ComponentFixture, TestBed } from "@angular/core/testing"
import { EntryComponent } from "./entry.component"
import { ModalService } from "../../services/ModalService"
import { WheelService } from "../../services/WheelService"
import { EntryService } from "../../services/EntryService"
import { Entry } from "../../models/entry"
import { of } from "rxjs"
import { createMockModalService } from "../../services/ModalService.mock"

describe('EntryComponent', () => {
    let component: EntryComponent
    let fixture: ComponentFixture<EntryComponent>
    let wheelServiceMock: jest.Mocked<WheelService>
    let entryServiceMock: jest.Mocked<EntryService>

    beforeEach(async () => {
        wheelServiceMock = {
            openNestedWheel: jest.fn(),
            createNestledWheel: jest.fn(),
            deleteNested: jest.fn()
        }
        entryServiceMock = {
            getEntry: jest.fn()
        }

        await TestBed.configureTestingModule({
            imports: [EntryComponent],
            providers: [
                { provide: ModalService, useValue: createMockModalService() },
                { provide: WheelService, useValue: wheelServiceMock },
                { provide: EntryService, useValue: entryServiceMock },
            ],
            useFactory: () => new ModalService()
        }).compileComponents()

        fixture = TestBed.createComponent(EntryComponent)
        component = fixture.componentInstance

        fixture.componentRef.setInput('entryId', '0')
    })

    it('should get entry data', () => {
        const mockEntry = new Entry('mockName', '0')
        entryServiceMock.getEntry.and.returnValue(of(mockEntry))

        fixture.detectChanges()

        expect(component.entryData()).toEqual(mockEntry)
    })
})