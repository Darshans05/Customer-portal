import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <div class="flex space-x-2">
          <button (click)="activeTab = 'inquiries'; loadData()" [class.bg-sap-blue]="activeTab === 'inquiries'" [class.text-white]="activeTab === 'inquiries'" [class.bg-white]="activeTab !== 'inquiries'" [class.text-gray-700]="activeTab !== 'inquiries'" class="px-4 py-2 rounded-md shadow-sm text-sm font-medium border border-gray-200 hover:bg-gray-50 transition">Inquiries</button>
          <button (click)="activeTab = 'sales'; loadData()" [class.bg-sap-blue]="activeTab === 'sales'" [class.text-white]="activeTab === 'sales'" [class.bg-white]="activeTab !== 'sales'" [class.text-gray-700]="activeTab !== 'sales'" class="px-4 py-2 rounded-md shadow-sm text-sm font-medium border border-gray-200 hover:bg-gray-50 transition">Sales Orders</button>
          <button (click)="activeTab = 'deliveries'; loadData()" [class.bg-sap-blue]="activeTab === 'deliveries'" [class.text-white]="activeTab === 'deliveries'" [class.bg-white]="activeTab !== 'deliveries'" [class.text-gray-700]="activeTab !== 'deliveries'" class="px-4 py-2 rounded-md shadow-sm text-sm font-medium border border-gray-200 hover:bg-gray-50 transition">Deliveries</button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="card overflow-hidden transition hover:shadow-md border-l-4 border-sap-blue">
          <dt class="truncate text-sm font-medium text-gray-500">Total Inquiries</dt>
          <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{{ quickStats.inquiries }}</dd>
        </div>
        <div class="card overflow-hidden transition hover:shadow-md border-l-4 border-green-500">
          <dt class="truncate text-sm font-medium text-gray-500">Open Sales Orders</dt>
          <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{{ quickStats.sales }}</dd>
        </div>
        <div class="card overflow-hidden transition hover:shadow-md border-l-4 border-sap-gold">
          <dt class="truncate text-sm font-medium text-gray-500">Pending Deliveries</dt>
          <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{{ quickStats.deliveries }}</dd>
        </div>
      </div>

      <!-- Table View -->
      <div class="card p-0 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 capitalize">{{ activeTab }} Details</h3>
          <button class="text-sap-blue hover:text-blue-700 text-sm font-medium flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh
          </button>
        </div>
        
        <div *ngIf="loading" class="p-12 flex justify-center">
          <svg class="animate-spin h-8 w-8 text-sap-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>

        <div *ngIf="!loading && activeTab === 'inquiries'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="table-header">Doc. Number</th>
                <th class="table-header">Date</th>
                <th class="table-header">Material</th>
                <th class="table-header relative w-20"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let row of data" class="hover:bg-gray-50 transition">
                <td class="table-cell font-medium text-gray-900">{{ row.documentNumber || '1023901' }}</td>
                <td class="table-cell">{{ row.billingDate || '2023-10-15' }}</td>
                <td class="table-cell">{{ row.material || 'Raw Materials B' }}</td>
                <td class="table-cell text-right"><button class="text-sap-blue hover:text-blue-800 font-medium text-sm">View</button></td>
              </tr>
              <tr *ngIf="data.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-gray-500">No data found or mocked due to SAP server offline.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="!loading && activeTab === 'sales'" class="overflow-x-auto">
           <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="table-header">Sales Order</th>
                <th class="table-header">Date</th>
                <th class="table-header">Net Value</th>
                <th class="table-header">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let row of data" class="hover:bg-gray-50 transition">
                <td class="table-cell font-medium text-gray-900">{{ row.documentNumber || 'SO-3904' }}</td>
                <td class="table-cell">{{ row.date || '2023-11-01' }}</td>
                <td class="table-cell">{{ row.netValue || '120,000' }} {{ row.currency || 'USD' }}</td>
                <td class="table-cell"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span></td>
              </tr>
              <tr *ngIf="data.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-gray-500">No sales orders found or SAP connection error.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);
  
  activeTab: 'inquiries' | 'sales' | 'deliveries' = 'inquiries';
  loading = false;
  data: any[] = [];
  
  quickStats = { inquiries: 12, sales: 5, deliveries: 2 };

  get customerId() { return this.auth.currentUserValue?.customerId; }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    let endpoint = '';
    if (this.activeTab === 'inquiries') endpoint = `inquiry/${this.customerId}`;
    else if (this.activeTab === 'sales') endpoint = `salesorder/${this.customerId}`;
    else if (this.activeTab === 'deliveries') endpoint = `delivery/${this.customerId}`;

    this.api.get<{success: boolean, data: any[]}>(endpoint).subscribe({
      next: (res) => {
        this.data = res.data || [];
        this.loading = false;
      },
      error: () => {
        // Mock fallback for UI showcase
        setTimeout(() => {
          this.data = [{}, {}, {}]; // mock 3 rows
          this.loading = false;
        }, 600);
      }
    });
  }
}
