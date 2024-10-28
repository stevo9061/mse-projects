import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { Cryptocurrency } from '../models/cryptocurrency.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crypto-table',
  standalone: true,
  imports: [TableModule, PaginatorModule, ButtonModule, CommonModule],
  templateUrl: './crypto-table.component.html',
  styleUrl: './crypto-table.component.css'
})
export class CryptoTableComponent {
  cryptocurrencies: any[] = [];
  first = 0;
  rows = 20;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadCryptocurrencies()
  }

  loadCryptocurrencies() {
    // fetch data from the API
    this.http.get<Cryptocurrency[]>('http://localhost:8080/api/crypto/fetch-and-save')
      .subscribe({
        next: (data: Cryptocurrency[]) => {
//          console.log(data); // debugging: looking at the structure and types of data
          this.cryptocurrencies = data.map(crypto => ({
            ...crypto,
            supply: Number(crypto.supply) || 0,
            maxSupply: Number(crypto.maxSupply) || 0,
            marketCapUsd: Number(crypto.marketCapUsd) || 0,
            volumeUsd24Hr: Number(crypto.volumeUsd24Hr) || 0,
            priceUsd: Number(crypto.priceUsd) || 0,
            changePercent24Hr: Number(crypto.changePercent24Hr) || 0,
            vwap24hr: Number(crypto.vwap24hr) || 0,
          }));
        },
        error: (error: any) => {
          console.error('Error fetching cryptocurrencies', error);
        }
      });
  }

  goToDetails(cryptoId: string) {
    this.router.navigate(['/crypto-details', cryptoId])
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
