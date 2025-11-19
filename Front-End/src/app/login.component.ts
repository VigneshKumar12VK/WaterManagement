import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VktoggleDirective } from './vktoggle.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ CommonModule, VktoggleDirective, FormsModule, ReactiveFormsModule ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  passWord: string = '';
  errorMsg: string = '';

  constructor(private router: Router, private authService: AuthService) {
    console.log('LoginComponent constructor initialized');
  }

  ngOnInit(): void {
    // Initialization logic here
    console.log('LoginComponent initialized');
  }

  login(loginForm: any) {
    if (this.email && this.passWord) {
      this.authService.login( this.email, this.passWord).subscribe({
        next: () => {
          // Handle successful login (e.g., store token, redirect)
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          // Handle error (e.g., show error message)
          this.errorMsg = 'Login failed. Please check your credentials.';
        }
      });
    }
  }
}
