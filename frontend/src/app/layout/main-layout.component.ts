import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50 flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-sap-dark text-white shadow-xl flex flex-col z-20">
        <div class="p-6 flex items-center border-b border-gray-700">
          <svg class="w-8 h-8 text-sap-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          <h1 class="text-xl font-bold tracking-wider">ERP PORTAL</h1>
        </div>
        
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <a routerLink="/dashboard" routerLinkActive="bg-sap-blue border-sap-gold text-white" [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors border-l-4 border-transparent">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </a>
          <a routerLink="/finance" routerLinkActive="bg-sap-blue border-sap-gold text-white" 
            class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors border-l-4 border-transparent">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Financial Sheet
          </a>
          <a routerLink="/analytics" routerLinkActive="bg-sap-blue border-sap-gold text-white" 
            class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors border-l-4 border-transparent">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
            Analytics
          </a>
          <a routerLink="/profile" routerLinkActive="bg-sap-blue border-sap-gold text-white" 
            class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors border-l-4 border-transparent">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Profile
          </a>
        </nav>
        
        <div class="p-4 bg-gray-800 border-t border-gray-700">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full bg-gradient-to-r from-sap-blue to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-inner">
              {{ customerIdInitials }}
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-white">ID: {{ customerId }}</p>
              <button (click)="logout()" class="text-xs text-gray-400 hover:text-white transition group flex items-center mt-1">
                <svg class="w-3 h-3 mr-1 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col h-screen overflow-hidden">
        <!-- Top Navbar -->
        <header class="bg-white shadow-sm border-b border-gray-100 z-10">
          <div class="px-8 flex justify-between items-center h-16">
            <h2 class="text-xl font-medium text-gray-800">Welcome to SAP B2B Portal</h2>
            <div class="flex items-center space-x-4">
              <button class="text-gray-400 hover:text-sap-blue transition relative">
                <span class="absolute top-0 right-0 block h-2 w-2 rounded-full border-2 border-white bg-red-400"></span>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </button>
            </div>
          </div>
        </header>

        <!-- Main Scrollable Content -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);

  get customerId(): string {
    return this.authService.currentUserValue?.customerId || 'Guest';
  }

  get customerIdInitials(): string {
    return this.customerId.substring(0, 2).toUpperCase();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
