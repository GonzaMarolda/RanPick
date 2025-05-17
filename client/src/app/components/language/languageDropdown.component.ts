import { Component, inject, input, OnInit, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'language-dropdown',
    imports: [TranslateModule],
    templateUrl: 'languageDropdown.component.html',
    styleUrl: 'languageDropdown.component.scss'
})
export class LanguageDropdownComponent {
    selectedLanguage = signal<string>("en")
    languages = signal<string[]>([])
    isDropdownOpen = signal<boolean>(false)
    flags: Record<string, string> = {
        en: "united-states",
        es: "argentina"
    }

    constructor(private translate: TranslateService) {
        this.translate.addLangs(['es', 'en']);
        this.languages.set(['es', 'en'])
        this.translate.setDefaultLang('en');
        this.translate.use('en');
    }

    changeLanguage(selectedLang: string) {
        this.selectedLanguage.set(selectedLang)
        this.translate.use(selectedLang)
    }

    switchDropdownOpen() {
        this.isDropdownOpen.update(prev => !prev)
    }

    getFlagSrc(lang: string) {
        const flagName = this.flags[lang]
        return environment.url + "/uploads/flags/" + flagName + ".png"
    }
}