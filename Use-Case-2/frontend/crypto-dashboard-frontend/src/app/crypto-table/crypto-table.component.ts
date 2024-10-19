import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-crypto-table',
  standalone: true,
  imports: [TableModule, PaginatorModule, ButtonModule, CommonModule, HttpClientModule],
  templateUrl: './crypto-table.component.html',
  styleUrl: './crypto-table.component.css'
})
export class CryptoTableComponent {
  cryptocurrencies: any[] = [];
  first = 0;
  rows = 20;

  ngOnInit() {
    this.loadCryptocurrencies( { first: 0, row: 20 });
  }

  loadCryptocurrencies(even: any) {
    // Load cryptocurrencies from the backend

    this.cryptocurrencies = [
      { id: 1, coin: 'BTC', name: 'Bitcoin', supply: 192345, maxSupply: 21000000, marketCap: 132034543, volumeUsd24Hr: 13452345, price: 66817, changePercent24Hr: 1.8, vwap24Hr: 66080, explorer: 'https://lalelu.at' },
      { id: 2, coin: 'ETH', name: 'Ethereum', supply: 192345, maxSupply: 21000000, marketCap: 132034543, volumeUsd24Hr: 13452345, price: 66817, changePercent24Hr: 1.8, vwap24Hr: 66080, explorer: 'https://lalelu.at' },
    ];
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

 isLastPage(): boolean {
    return this.cryptocurrencies ? this.first >= (this.cryptocurrencies.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.cryptocurrencies ? this.first === 0 : true;
  }
}
