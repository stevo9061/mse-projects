import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
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

    const val = this.loginForm.value;
    if (val.username && val.password) {

      this.http.post('http://localhost:8080/api/login', val).subscribe({
        next: response => {
          console.log('User logged in successfully', response);
          alert('User logged in successfully');
          this.router.navigate(['/home']);
        },
        error: error => {
          console.log('User login failed', error);
          alert('User login failed. ');
        }
      });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

}
