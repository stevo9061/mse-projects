import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      role: ['user']
      
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Marks all fields as ‘touched’ to indicate errors
      return;
    }


  const val = this.registerForm.value;
  if (val.fullname && val.username && val.password && val.email) {
    
    this.http.post('http://localhost:8080/api/register', val).subscribe({
      next: (response: any) => {
        console.log('User registered successfully', response);
        alert(response.message); // Show message
        this.router.navigate(['/login']); // <-- Redirects to the login page
      },
      error: error => {
        console.log('User registration failed', error);
        alert("User registration failed.");
      }
    });

    
  }
  this.router.navigate(['/login']);

}

}



