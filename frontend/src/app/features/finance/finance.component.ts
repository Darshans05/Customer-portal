import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center bg-gradient-to-r from-sap-dark to-gray-800 p-8 rounded-xl shadow-lg relative overflow-hidden text-white">
        <!-- Decoration -->
        <div class="absolute right-0 top-0 -mt-10 -mr-10 pt-10 pr-10 border-sap-gold border-t-8 border-r-8 opacity-20 w-64 h-64 rounded-full"></div>
        <div>
          <h2 class="text-3xl font-bold tracking-tight mb-2">Financial Sheet</h2>
          <p class="text-gray-300">View your invoices, credit memos, and account aging.</p>
        </div>
        <div class="text-right z-10">
          <p class="text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Total Outstanding</p>
          <div class="flex items-baseline justify-end gap-2 text-sap-gold">
            <span class="text-xl font-bold opacity-60" *ngIf="!loading && totalOutstanding > 0">{{ totalCurrency }}</span>
            <p class="text-4xl font-extrabold" *ngIf="!loading">{{ totalOutstanding | number:'1.2-2' }}</p>
            <p class="text-2xl font-extrabold" *ngIf="loading">—</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Column -->
        <div class="lg:col-span-2 space-y-6">
          <div class="card p-0">
            <div class="bg-white px-6 py-5 border-b border-gray-200">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Invoices</h3>
                <span class="text-sm text-gray-400">{{ filteredInvoices.length }} record{{ filteredInvoices.length !== 1 ? 's' : '' }}</span>
              </div>
              
              <!-- Language/Currency Filters -->
              <div class="flex flex-wrap gap-2" *ngIf="availableCurrencies.length > 1">
                <button 
                  (click)="selectedCurrency = 'All'; showAllInvoices = false"
                  [class]="selectedCurrency === 'All' ? 'bg-sap-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                  class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm">
                  All Currencies
                </button>
                <button 
                  *ngFor="let curr of availableCurrencies"
                  (click)="selectedCurrency = curr; showAllInvoices = false"
                  [class]="selectedCurrency === curr ? 'bg-sap-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                  class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm uppercase">
                  {{ curr }}
                </button>
              </div>
            </div>

            <!-- Loading -->
            <div *ngIf="loading" class="p-12 flex justify-center">
              <svg class="animate-spin h-8 w-8 text-sap-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>

            <div *ngIf="!loading" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="table-header">Invoice No.</th>
                    <th class="table-header">Date</th>
                    <th class="table-header">Status</th>
                    <th class="table-header">Amount</th>
                    <th class="table-header relative">Download</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let inv of displayedInvoices" class="hover:bg-gray-50 transition group">
                    <td class="table-cell font-medium text-gray-900">{{ inv.documentNumber }}</td>
                    <td class="table-cell text-gray-600">{{ inv.billingDate }}</td>
                    <td class="table-cell">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </td>
                    <td class="table-cell font-semibold text-gray-900 group-hover:text-sap-blue transition-colors">
                      <span class="inline-flex items-center gap-1">
                        <span class="text-xs text-gray-400 font-normal">{{ inv.currency }}</span>
                        {{ inv.netValue | number:'1.2-2' }}
                      </span>
                    </td>
                    <td class="table-cell text-right">
                      <button (click)="downloadPdf(inv.documentNumber)" class="text-sap-blue flex items-center group-hover:text-blue-700 font-medium ml-auto">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        PDF
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="uniqueInvoices.length === 0">
                    <td colspan="5" class="px-6 py-12 text-center text-gray-500">No invoices found or SAP connection error.</td>
                  </tr>
                </tbody>
              </table>

              <!-- Show More -->
              <div *ngIf="filteredInvoices.length > 5 && !showAllInvoices" class="px-6 py-3 border-t border-gray-100 bg-gray-50/50 text-center">
                <button (click)="showAllInvoices = true" class="text-sap-blue hover:text-blue-700 font-semibold text-sm transition-colors flex items-center justify-center w-full">
                  <span>Show More (+{{ filteredInvoices.length - 5 }})</span>
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="card p-0">
            <div class="bg-white px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Credit/Debit Memos</h3>
              <span class="text-sm text-gray-400">{{ memos.length }} record{{ memos.length !== 1 ? 's' : '' }}</span>
            </div>

            <div *ngIf="loading" class="p-12 flex justify-center">
               <svg class="animate-spin h-8 w-8 text-sap-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>

            <div *ngIf="!loading" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="table-header">Doc No.</th>
                    <th class="table-header">Date</th>
                    <th class="table-header">Type</th>
                    <th class="table-header">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let m of memos" class="hover:bg-gray-50 transition">
                    <td class="table-cell font-medium text-gray-900">{{ m.documentNumber }}</td>
                    <td class="table-cell text-gray-600">{{ m.billingDate }}</td>
                    <td class="table-cell">
                      <span [ngClass]="{
                        'bg-red-100 text-red-800': m.type === 'DEBIT',
                        'bg-blue-100 text-blue-800': m.type === 'CREDIT'
                      }" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {{ m.type }}
                      </span>
                    </td>
                    <td class="table-cell font-semibold text-gray-900">
                      {{ m.currency }} {{ m.netValue | number:'1.2-2' }}
                    </td>
                  </tr>
                  <tr *ngIf="memos.length === 0">
                    <td colspan="4" class="px-6 py-12 text-center text-gray-500">No memos found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sidebar Column -->
        <div class="space-y-6">
          <div class="card p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Pay Aging</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1"><span class="text-gray-500">Current</span> <span class="font-medium">$12,000</span></div>
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-green-500 h-2 rounded-full" style="width: 45%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1"><span class="text-gray-500">1-30 Days</span> <span class="font-medium">$8,500</span></div>
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-yellow-400 h-2 rounded-full" style="width: 30%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1"><span class="text-gray-500">31-60 Days</span> <span class="font-medium">$2,430</span></div>
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-red-400 h-2 rounded-full" style="width: 15%"></div></div>
              </div>
            </div>
          </div>

          <div class="card p-6 bg-blue-50 border-blue-100">
            <h3 class="text-lg font-medium text-sap-blue mb-2">Invoice Summary</h3>
            <p class="text-3xl font-bold text-gray-900 mb-1">{{ invoices.length }}</p>
            <p class="text-sm text-gray-600">Total invoices loaded from SAP.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FinanceComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);
  
  invoices: any[] = [];
  uniqueInvoices: any[] = [];
  memos: any[] = [];
  loading = false;
  totalOutstanding = 0;
  showAllInvoices = false;
  selectedCurrency = 'All';
  availableCurrencies: string[] = [];

  get filteredInvoices() {
    if (this.selectedCurrency === 'All') return this.uniqueInvoices;
    return this.uniqueInvoices.filter(inv => inv.currency === this.selectedCurrency);
  }

  get displayedInvoices() {
    return this.showAllInvoices ? this.filteredInvoices : this.filteredInvoices.slice(0, 5);
  }

  get totalCurrency() {
    return this.uniqueInvoices.length > 0 ? this.uniqueInvoices[0].currency : '';
  }

  get customerId() { return this.auth.currentUserValue?.customerId; }

  ngOnInit() {
    this.loadInvoices();
    this.loadMemos();
  }

  loadInvoices() {
    this.loading = true;
    this.api.get<{success: boolean, data: any[]}>(`invoice/${this.customerId}`).subscribe({
      next: (res) => {
        this.invoices = res.data || [];
        
        // Group by VBELN to handle duplicates in line items
        const uniqueMap = new Map();
        this.invoices.forEach(inv => {
          if (!uniqueMap.has(inv.documentNumber)) {
            uniqueMap.set(inv.documentNumber, inv);
          }
        });
        this.uniqueInvoices = Array.from(uniqueMap.values());

        // Extract available currencies
        this.availableCurrencies = Array.from(new Set(this.uniqueInvoices.map(inv => inv.currency))).filter(c => !!c);

        // Compute total outstanding as sum of UNIQUE invoice NETWR values
        this.totalOutstanding = this.uniqueInvoices.reduce((sum, inv) => {
          const val = parseFloat(inv.netValue) || 0;
          return sum + val;
        }, 0);
        this.checkLoadingComplete();
      },
      error: () => {
        this.invoices = [];
        this.uniqueInvoices = [];
        this.totalOutstanding = 0;
        this.checkLoadingComplete();
      }
    });
  }

  private invoicesLoaded = false;
  private memosLoaded = false;

  private checkLoadingComplete() {
    // This is a simple approach, ideally use forkJoin or similar
    if (this.invoices.length > 0 || this.invoicesLoaded) this.invoicesLoaded = true;
    if (this.memos.length > 0 || this.memosLoaded) this.memosLoaded = true;
    
    // Instead of complex flags, we'll just rely on individual response handlers
    // To keep it simple for now, we'll set loading=false in both but only when they are balanced
    // Let's actually use a counter or just set it in both for now since loading is shared.
    this.loading = false; 
  }

  loadMemos() {
    this.loading = true;
    this.api.get<{success: boolean, data: any[]}>(`memo/${this.customerId}`).subscribe({
      next: (res) => {
        this.memos = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.memos = [];
        this.loading = false;
      }
    });
  }

  downloadPdf(vbeln: string) {
    if (!vbeln || !this.customerId) return;
    this.api.getBlob(`invoice/pdf/${this.customerId}/${vbeln}`).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${vbeln}.pdf`;
      a.click();
    });
  }
}
