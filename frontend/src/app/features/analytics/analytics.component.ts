import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Overall Sales Analytics</h2>
      
      <div class="card min-h-[400px] flex flex-col justify-center items-center bg-white">
        <!-- Mocking high-end chart visual since installing external charting libraries adds complexity to raw standalone component generation -->
        <h3 class="text-xl font-medium text-gray-700 mb-8">Year-to-Date Performance</h3>
        
        <div class="w-full max-w-4xl flex items-end justify-between h-64 space-x-2 px-10">
          <div class="w-16 bg-blue-100 rounded-t-sm hover:bg-blue-200 transition relative group h-[30%]">
             <div class="absolute -top-8 w-full text-center opacity-0 group-hover:opacity-100 transition font-medium text-sm text-sap-blue">$12k</div>
          </div>
          <div class="w-16 bg-blue-200 rounded-t-sm hover:bg-blue-300 transition relative group h-[45%]">
             <div class="absolute -top-8 w-full text-center opacity-0 group-hover:opacity-100 transition font-medium text-sm text-sap-blue">$18k</div>
          </div>
          <div class="w-16 bg-blue-300 rounded-t-sm hover:bg-blue-400 transition relative group h-[60%]">
             <div class="absolute -top-8 w-full text-center opacity-0 group-hover:opacity-100 transition font-medium text-sm text-sap-blue">$24k</div>
          </div>
          <div class="w-16 bg-blue-400 rounded-t-sm hover:bg-blue-500 transition relative group h-[40%]">
             <div class="absolute -top-8 w-full text-center opacity-0 group-hover:opacity-100 transition font-medium text-sm text-sap-blue">$16k</div>
          </div>
          <div class="w-16 bg-sap-blue rounded-t-sm hover:bg-blue-700 transition relative group h-[85%] shadow-lg">
             <div class="absolute -top-8 w-full text-center opacity-0 group-hover:opacity-100 transition font-medium text-sm text-sap-blue">$34k</div>
          </div>
          <div class="w-16 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition relative group h-[55%]">
             <div class="absolute -top-8 w-full text-center opacity-0 group-hover:opacity-100 transition font-medium text-sm text-sap-blue">$22k</div>
          </div>
        </div>
        <div class="w-full max-w-4xl flex justify-between mt-4 px-10 text-sm text-gray-500">
          <span class="w-16 text-center">Jan</span>
          <span class="w-16 text-center">Feb</span>
          <span class="w-16 text-center">Mar</span>
          <span class="w-16 text-center">Apr</span>
          <span class="w-16 text-center font-bold text-gray-800">May</span>
          <span class="w-16 text-center">Jun</span>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent {
}
