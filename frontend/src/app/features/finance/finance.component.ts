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
          <p class="text-4xl font-extrabold text-sap-gold">$45,230.00</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Column -->
        <div class="lg:col-span-2 space-y-6">
          <div class="card p-0">
            <div class="bg-white px-6 py-5 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Invoices</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="table-header">Invoice</th>
                    <th class="table-header">Date</th>
                    <th class="table-header">Amount</th>
                    <th class="table-header relative">Download</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let inv of invoices" class="hover:bg-gray-50 transition group">
                    <td class="table-cell font-medium">{{ inv.documentNumber || 'INV-00912' }}</td>
                    <td class="table-cell">{{ inv.billingDate || '2023-11-10' }}</td>
                    <td class="table-cell font-semibold text-gray-900">{{ inv.netValue || '4,500' }} {{ inv.currency || 'USD' }}</td>
                    <td class="table-cell text-right">
                      <button (click)="downloadPdf(inv.documentNumber || 'INV-00912')" class="text-sap-blue flex items-center group-hover:text-blue-700 font-medium">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        PDF
                      </button>
                    </td>
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
            <h3 class="text-lg font-medium text-sap-blue mb-2">Credit Memos</h3>
            <p class="text-3xl font-bold text-gray-900 mb-1">$1,250.00</p>
            <p class="text-sm text-gray-600">Available to apply to next invoice.</p>
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
  loading = false;

  ngOnInit() {
    this.api.get<any>(`invoice/${this.auth.currentUserValue?.customerId}`).subscribe({
      next: (res) => this.invoices = res.data || [],
      error: () => this.invoices = [{}, {}, {}, {}] // mock
    });
  }

  downloadPdf(vbeln: string) {
    this.api.getBlob(`invoice/pdf/${vbeln}`).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${vbeln}.pdf`;
      a.click();
    });
  }
}
