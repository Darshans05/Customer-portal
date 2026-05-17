import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-xl">
        <div class="h-32 bg-gradient-to-r from-sap-blue to-blue-400"></div>
        <div class="px-8 pb-8">
          <div class="-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div class="flex">
              <div class="h-32 w-32 rounded-full ring-4 ring-white bg-white shadow-lg overflow-hidden flex items-center justify-center">
                 <svg class="h-24 w-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
            </div>
            <div class="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div class="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                <h1 class="text-2xl font-bold text-gray-900 truncate">{{ profile?.customerName || 'Global Corp Ltd.' }}</h1>
                <p class="text-sm font-medium text-gray-500">KUNNR: {{ profile?.customerId || auth.currentUserValue?.customerId }}</p>
              </div>
              <div class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button type="button" class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sap-blue transition">
                  <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span>Contact Support</span>
                </button>
              </div>
            </div>
          </div>
          <div class="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
            <h1 class="text-2xl font-bold text-gray-900 truncate">{{ profile?.customerName }}</h1>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="mb-5">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Company Information</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Details fetched directly from SAP Master Data.</p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition">
              <dt class="text-sm font-medium text-gray-500">Full name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ profile?.customerName }}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition">
              <dt class="text-sm font-medium text-gray-500">Address</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ profile?.street }}{{ profile?.city  }} {{ profile?.postalCode }}</dd>
            </div>
            
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition">
              <dt class="text-sm font-medium text-gray-500">Phone number</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ profile?.phone}}</dd>
            </div>
             <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition">
              <dt class="text-sm font-medium text-gray-500">Account Status</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);

  profile: any = null;

  ngOnInit() {
    const customerId = this.auth.currentUserValue?.customerId;
    console.log(`[PROFILE COMPONENT] ngOnInit - current customerId:`, customerId);
    if (!customerId) {
      console.warn(`[PROFILE COMPONENT] customerId is missing!`);
    }
    
    this.api.get<any>(`profile/${customerId}`).subscribe({
      next: (res) => {
        console.log(`[PROFILE COMPONENT] Received API response:`, res);
        this.profile = res.data;
        console.log(`[PROFILE COMPONENT] Assigned profile data:`, this.profile);
      },
      error: (err) => {
        console.error(`[PROFILE COMPONENT] API Error:`, err);
      }
    });
  }
}
