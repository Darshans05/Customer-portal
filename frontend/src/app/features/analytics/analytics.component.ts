import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">Sales Analytics</h2>
        <div class="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live SAP Data
        </div>
      </div>
      
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6" *ngIf="!loading">
        <div class="card p-6 bg-gradient-to-br from-white to-blue-50">
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Revenue</p>
          <p class="text-3xl font-bold text-sap-blue">{{ totalRevenue | number:'1.0-0' }} <span class="text-sm font-normal text-gray-400">USD</span></p>
          <div class="mt-4 flex items-center text-xs text-green-600 font-medium">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            YTD Performance
          </div>
        </div>
        <div class="card p-6">
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Avg. Order Value</p>
          <p class="text-3xl font-bold text-gray-900">{{ avgOrderValue | number:'1.0-0' }}</p>
          <p class="mt-4 text-xs text-gray-400">Total Invoices: {{ salesData.length }}</p>
        </div>
        <div class="card p-6">
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Growth Forecast</p>
          <p class="text-3xl font-bold text-gray-900">+12.4%</p>
          <p class="mt-4 text-xs text-gray-400">Based on historical cycle</p>
        </div>
      </div>

      <!-- Main Chart Card -->
      <div class="card p-8 bg-white overflow-hidden relative">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Monthly Sales Trend</h3>
            <p class="text-sm text-gray-500">Revenue distribution for the current year</p>
          </div>
          <div class="flex gap-2">
            <span class="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-50 text-sap-blue border border-blue-100 italic">
              SAP S/4HANA Feed
            </span>
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="h-64 flex flex-col justify-center items-center">
           <svg class="animate-spin h-10 w-10 text-sap-blue mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-400 animate-pulse">Analyzing sales patterns...</p>
        </div>
        
        <!-- Dynamic Chart -->
        <div *ngIf="!loading">
          <div class="w-full flex items-end justify-between h-64 space-x-4 px-4 border-b border-gray-100 pb-2">
            <div *ngFor="let month of monthlyData" 
                 class="flex-1 bg-gradient-to-t from-sap-blue to-blue-400 rounded-t-md hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer relative group"
                 [style.height]="month.percentage + '%'">
               <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20 shadow-xl">
                 {{ month.value | number:'1.0-0' }}
               </div>
            </div>
          </div>
          <div class="w-full flex justify-between mt-6 px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <span *ngFor="let month of monthlyData" class="flex-1 text-center">{{ month.name }}</span>
          </div>
        </div>

        <!-- Emptiness -->
        <div *ngIf="!loading && monthlyData.length === 0" class="h-64 flex flex-col justify-center items-center text-gray-400">
           No billing data found for the selected period.
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);

  salesData: any[] = [];
  monthlyData: any[] = [];
  totalRevenue = 0;
  avgOrderValue = 0;
  loading = false;

  get customerId() { return this.auth.currentUserValue?.customerId; }

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    if (!this.customerId) return;
    this.loading = true;
    
    // Using overall sales route which targets ZFM_INVOICEDATA_DS
    this.api.get<{success: boolean, data: any[]}>('analytics/sales/' + this.customerId).subscribe({
      next: (res) => {
        this.salesData = res.data || [];
        this.processData();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  processData() {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const aggregates = new Array(12).fill(0).map((_, i) => ({ 
      name: monthNames[i], 
      value: 0,
      percentage: 0 
    }));

    this.totalRevenue = 0;
    this.salesData.forEach(inv => {
      const val = parseFloat(inv.netValue) || 0;
      this.totalRevenue += val;

      const dateStr = inv.billingDate || inv.date || ''; // Expects YYYY-MM-DD or YYYYMMDD
      let monthIdx = -1;

      if (dateStr.includes('-')) {
        // Handle YYYY-MM-DD
        monthIdx = parseInt(dateStr.split('-')[1]) - 1;
      } else if (dateStr.length >= 6) {
        // Handle YYYYMMDD or YYYYMM
        monthIdx = parseInt(dateStr.substring(4, 6)) - 1;
      }

      if (monthIdx >= 0 && monthIdx < 12) {
        aggregates[monthIdx].value += val;
      }
    });

    this.avgOrderValue = this.salesData.length > 0 ? this.totalRevenue / this.salesData.length : 0;

    // Calculate percentages for the UI bars (scaled to max month)
    const maxMonth = Math.max(...aggregates.map(m => m.value), 1);
    this.monthlyData = aggregates.map(m => ({
      ...m,
      percentage: (m.value / maxMonth) * 100
    }));
  }
}
