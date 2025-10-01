import { Component } from '@angular/core';

@Component({
  selector: 'app-offline',
  template: `
    <div class="flex flex-col items-center justify-center z-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10 text-yellow-500 animate-bounce"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
        />
      </svg>
      <h1 class="text-3lg font-bold text-gray-800">⚡ Você está offline!</h1>
      <p class="text-gray-600">Alguns recursos podem não estar disponíveis.</p>
    </div>
  `,
})
export class OfflineComponent {}
