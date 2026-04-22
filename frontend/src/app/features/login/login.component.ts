import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <!-- Background Decorations -->
      <div class="absolute top-0 -left-40 w-[40rem] h-[40rem] bg-sap-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-blob"></div>
      <div class="absolute top-0 -right-40 w-[40rem] h-[40rem] bg-sap-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-blob animation-delay-2000"></div>
      <div class="absolute -bottom-40 left-20 w-[40rem] h-[40rem] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-blob animation-delay-4000"></div>

      <div class="card w-full max-w-md relative z-10 backdrop-filter backdrop-blur-lg bg-white/90 border border-white/20 shadow-2xl rounded-2xl overflow-hidden p-10">
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-sap-blue mb-4 ring-4 ring-white shadow-sm">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">SAP Portal</h2>
          <p class="text-sm text-gray-500 mt-2">Sign in to your customer dashboard</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div *ngIf="error" class="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ error }}</p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Customer Number / Username</label>
            <input type="text" formControlName="username" class="input-field block w-full pl-4 pr-3 py-3 rounded-lg border-gray-300 focus:ring-sap-blue focus:border-sap-blue sm:text-sm bg-gray-50 transition" placeholder="e.g. k901996">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" formControlName="password" class="input-field block w-full pl-4 pr-3 py-3 rounded-lg border-gray-300 focus:ring-sap-blue focus:border-sap-blue sm:text-sm bg-gray-50 transition" placeholder="••••••••">
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-sap-blue focus:ring-sap-blue border-gray-300 rounded">
              <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
            </div>
            <div class="text-sm">
              <a href="#" class="font-medium text-sap-blue hover:text-blue-500 transition"> Forgot password? </a>
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || loading" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sap-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sap-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <svg *ngIf="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  error = '';
  loading = false;

  constructor() {
    // If already logged in, go to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    const { username, password } = this.loginForm.value;
    
    this.authService.login(username!, password!).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Please check credentials.';
        this.loading = false;
      }
    });
  }
}
