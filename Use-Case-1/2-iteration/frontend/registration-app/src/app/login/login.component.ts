import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  userInfo: any = null;
  token: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Markiert alle Felder als 'berührt', um Fehler anzuzeigen
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () =>{
        console.log('User logged in successfully');
        alert('User logged in successfully');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log('User login failed', error);

        if (error.status === 401) {
          this.errorMessage = 'Username or password is incorrect';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = 'Unknown error. Please try again later.';
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

    navigateToRegister(): void {
    this.authService.navigateToRegister();
  }

  loginWithOAuth() {
    this.authService.loginWithOAuth();
  }
}

