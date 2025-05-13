import { inject, Injectable, signal } from '@angular/core'
import { User } from '../models/user'
import { ModalService } from './ModalService'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { environment } from '../../environments/environment'; 

@Injectable({ providedIn: 'root' })
export class AuthService {
    http = inject(HttpClient)
    modalService = inject(ModalService)
    user = signal<User | null>(null)
    accessToken = signal<string | null>(null)
    errorMessage = signal<string>("")


    private clientId = '994113848333-n03u91rdbbnnhbom0t0au4s4bt4gb87h.apps.googleusercontent.com'
    private storageKeyUser = 'auth_user'
    private storageKeyToken = 'auth_token'
  
    constructor() {
        const storedUser = localStorage.getItem(this.storageKeyUser)
        const storedToken = localStorage.getItem(this.storageKeyToken)
    
        if (storedUser && storedToken) {
            this.user.set(JSON.parse(storedUser))
            console.log(this.user())
            this.accessToken.set(storedToken)
        }
    }

    loginWithGoogle(loadingFunc: (arg0: boolean) => void) {
        const google = (window as any).google
    
        if (!google) {
            throw new Error('Google API not available');
        }

        const client = google.accounts.oauth2.initTokenClient({
            client_id: this.clientId,
            scope: 'profile email',
            callback: async (response: any) => {
                loadingFunc(true)
                const googleToken = response.access_token
                try {
                    const data = await lastValueFrom(
                        this.http.post<{user: User, token: string}>(environment.apiUrl + '/auth/login',
                            JSON.stringify({ googleToken }), 
                            {
                                headers: { 'Content-Type': 'application/json' }
                            }
                        )
                    )

                    this.saveData(data.user, data.token)
                    loadingFunc(false)
                } catch (err) {
                    this.processError(err)
                    throw err
                }
            },
        })

        client.requestAccessToken()     
    }

    async signup(formData: {
        firstName: string,
        lastName: string,
        email: string,
        password: string}) {
        try {
            const data = await lastValueFrom(
                this.http.post<{user: User, token: string}>(environment.apiUrl + '/auth/signup',
                    JSON.stringify({ formData }),
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                )
            )
    
            this.saveData(data.user, data.token)
        } catch (err) {
            this.processError(err)
            throw err
        }
    }
    
    async login(email: string, password: string) {
        try {
            const data = await firstValueFrom(
                this.http.post<{user: User, token: string}>(environment.apiUrl + '/auth/login', 
                    JSON.stringify({ email, password }), 
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                )
            )

            this.saveData(data.user, data.token)
        } catch (err) {
            this.processError(err)
            throw err
        }
    }

    async sendResetPasswordEmail(email: string) {
        try {
            await firstValueFrom(
                this.http.get(environment.apiUrl + '/auth/reset-password/' + email)
            )
        } catch (err) {
            this.processError(err)
            throw err
        }
    }

    async setNewPassword(token: string, password: string) {
        try {
            await firstValueFrom(
                this.http.post(environment.apiUrl + '/auth/reset-password', 
                    JSON.stringify({ token, password }), 
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                )
            )
        } catch (err) {
            this.processError(err)
            throw err
        }
    }
  
    logout() {
        this.resetData()
    }

    resetData() {
        this.user.set(null)
        this.accessToken.set(null)
        localStorage.removeItem(this.storageKeyUser)
        localStorage.removeItem(this.storageKeyToken)
    }

    private saveData(user: User, token: string) {
        this.user.set(user)
        this.accessToken.set(token)
        localStorage.setItem(this.storageKeyUser, JSON.stringify(user))
        localStorage.setItem(this.storageKeyToken, token)

        this.modalService.close()
    }

    private async processError(err: any) {
        [400, 401, 402, 403].includes(err.status) ? this.errorMessage.set(err.error.error) : this.errorMessage.set("There was an error")
    }
}