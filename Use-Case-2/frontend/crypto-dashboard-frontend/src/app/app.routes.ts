import { Routes } from '@angular/router';
import { CryptoTableComponent } from './crypto-table/crypto-table.component';

export const routes: Routes = [
    { path: '', redirectTo: '/crypto-table', pathMatch: 'full' }, // Standardroute
    { path: 'crypto-table', component: CryptoTableComponent }
];
