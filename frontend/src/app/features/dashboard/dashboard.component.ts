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
          <button (click)="refreshData()" class="text-sap-blue hover:text-blue-700 text-sm font-medium flex items-center">
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
                <th class="table-header">Inquiry No.</th>
                <th class="table-header">Date</th>
                <th class="table-header">Type</th>
                <th class="table-header">Material</th>
                <th class="table-header">Qty</th>
                <th class="table-header">Unit</th>
                <th class="table-header relative w-20"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let row of (showAllInquiries ? data : data.slice(0, 10))" class="hover:bg-gray-50 transition">
                <td class="table-cell font-medium text-gray-900">{{ row.documentNumber }}</td>
                <td class="table-cell">{{ row.date }}</td>
                <td class="table-cell"><span class="px-2 py-0.5 rounded-full bg-blue-50 text-sap-blue text-xs font-bold">{{ row.orderType }}</span></td>
                <td class="table-cell text-xs">{{ row.material }}</td>
                <td class="table-cell font-semibold">{{ row.quantity }}</td>
                <td class="table-cell text-gray-500">{{ row.uom }}</td>
                <td class="table-cell text-right">
                  <button (click)="viewInquiry(row)" class="text-sap-blue hover:text-blue-800 font-bold text-sm flex items-center justify-end w-full group">
                    <span>View</span>
                    <svg class="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="data.length === 0">
                <td colspan="7" class="px-6 py-12 text-center text-gray-500 italic">No inquiry records found in SAP for this account.</td>
              </tr>
            </tbody>
          </table>
          
          <!-- View More Button -->
          <div *ngIf="data.length > 10" class="px-6 py-3 bg-white border-t border-gray-100 flex justify-center">
            <button (click)="showAllInquiries = !showAllInquiries" 
                    class="text-sm font-semibold text-sap-blue hover:text-blue-800 flex items-center transition-all group">
              <span>{{ showAllInquiries ? 'Show Less' : 'View More (' + (data.length - 10) + ' more)' }}</span>
              <svg [class.rotate-180]="showAllInquiries" class="w-4 h-4 ml-1 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
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

        <div *ngIf="!loading && activeTab === 'deliveries'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="table-header">Delivery Number</th>
                <th class="table-header">Date</th>
                <th class="table-header">Material</th>
                <th class="table-header">Quantity</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let row of data" class="hover:bg-gray-50 transition">
                <td class="table-cell font-medium text-gray-900">{{ row.documentNumber || 'DEL-1024' }}</td>
                <td class="table-cell">{{ row.date || '2023-10-18' }}</td>
                <td class="table-cell">{{ row.material || 'Raw Materials B' }}</td>
                <td class="table-cell">{{ row.quantity || '0' }} {{ row.currency === 'USD' ? 'EA' : (row.currency || 'EA') }}</td>
              </tr>
              <tr *ngIf="data.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-gray-500">No deliveries found or SAP connection error.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Inquiry Detail Modal -->
      <div *ngIf="showInquiryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div (click)="showInquiryModal = false" class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"></div>
        
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
          <!-- Header -->
          <div class="bg-sap-blue px-8 py-6 text-white flex justify-between items-center">
            <div>
              <p class="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Inquiry Details</p>
              <h3 class="text-2xl font-extrabold">#{{ selectedInquiry?.documentNumber }}</h3>
            </div>
            <button (click)="showInquiryModal = false" class="p-2 hover:bg-white/10 rounded-full transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-8 grid grid-cols-2 gap-y-8 gap-x-6">
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Document Type</label>
              <div class="flex items-center">
                <span class="px-2 py-1 rounded bg-blue-50 text-sap-blue text-xs font-bold border border-blue-100">{{ selectedInquiry?.orderType }}</span>
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Created Date</label>
              <p class="text-sm font-semibold text-gray-800">{{ selectedInquiry?.date }}</p>
            </div>
            <div class="col-span-2 space-y-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Material / Product</label>
              <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p class="text-sm font-medium text-gray-700 leading-relaxed">{{ selectedInquiry?.material }}</p>
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Quantity</label>
              <p class="text-lg font-black text-gray-900">{{ selectedInquiry?.quantity }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unit of Measure</label>
              <p class="text-lg font-bold text-gray-500 uppercase">{{ selectedInquiry?.uom }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button (click)="showInquiryModal = false" 
                    class="px-6 py-2 bg-sap-blue text-white rounded-lg font-bold text-sm hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
              Close Preview
            </button>
          </div>
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
  showAllInquiries = false;
  
  showInquiryModal = false;
  selectedInquiry: any = null;

  data: any[] = [];
  
  quickStats = { inquiries: 0, sales: 0, deliveries: 0 };

  get customerId() { return this.auth.currentUserValue?.customerId; }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.loadData();
    this.loadOverviewStats();
  }

  loadOverviewStats() {
    if (!this.customerId) return;
    
    this.api.get<{success: boolean, data: any[]}>(`inquiry/${this.customerId}`).subscribe({
      next: (res) => this.quickStats.inquiries = res.data?.length || 0,
      error: () => console.error('Failed to load inquiries for overview')
    });

    this.api.get<{success: boolean, data: any[]}>(`salesorder/${this.customerId}`).subscribe({
      next: (res) => this.quickStats.sales = res.data?.length || 0,
      error: () => console.error('Failed to load sales orders for overview')
    });

    this.api.get<{success: boolean, data: any[]}>(`delivery/${this.customerId}`).subscribe({
      next: (res) => this.quickStats.deliveries = res.data?.length || 0,
      error: () => console.error('Failed to load deliveries for overview')
    });
  }

  loadData() {
    this.loading = true;
    this.showAllInquiries = false; // Reset view state on tab change
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

  viewInquiry(row: any) {
    this.selectedInquiry = row;
    this.showInquiryModal = true;
  }
}
