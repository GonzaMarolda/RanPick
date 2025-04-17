import { inject, Injectable, signal } from '@angular/core'
import { User } from '../models/user'
import { ModalService } from './ModalService'

@Injectable({ providedIn: 'root' })
export class AuthService {
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
                const res = await fetch('http://localhost:3001/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ googleToken }),
                })
                this.processError(res)

                const data = await res.json()
                this.saveData(data.user, data.token)
                loadingFunc(false)
            },
        })

        client.requestAccessToken()     
    }

    async signup(formData: {
        firstName: string,
        lastName: string,
        email: string,
        password: string}) {
        const res = await fetch('http://localhost:3001/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData }),
        })
        this.processError(res)
    
        const data = await res.json();
        this.saveData(data.user, data.token)
    }
    
    async login(email: string, password: string) {
        const res = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        this.processError(res)
    
        const data = await res.json();
        this.saveData(data.user, data.token)
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

    private async processError(res: any) {
        if (!res.ok) {
            const err = await res.json();
            res.status === 400 ? this.errorMessage.set(err.error) : this.errorMessage.set("There was an error")
            throw new Error(JSON.stringify(err));
        } 
    }
}