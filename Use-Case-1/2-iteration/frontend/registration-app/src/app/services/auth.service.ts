import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient, private router: Router) {}


    // Login with Basic Auth
    login(username: string, password: string): Observable<any> {
        const body = { username, password };
        return this.http.post(`${this.baseUrl}/api/login`, body);
    }

    // OAuth2 Login
    loginWithOAuth(): void {
        window.location.href = `${this.baseUrl}/oauth2/authorization/Azure`;
    }

    navigateToRegister(): void {  
       this.router.navigate(['/register']); // use angular-router
  }


}