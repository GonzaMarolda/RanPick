import { Routes } from '@angular/router';
import { ResetPasswordModalComponent } from './components/modal/auth/reset-password/resetPassword.component';
import { BodyComponent } from './components/body/body.component';

export const routes: Routes = [
    {
        path: '',
        component: BodyComponent
    },
    {
        path: 'reset-password',
        component: ResetPasswordModalComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
