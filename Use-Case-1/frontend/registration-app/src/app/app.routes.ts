import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'}, //Standardroute zur Login-Page
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent}
];
