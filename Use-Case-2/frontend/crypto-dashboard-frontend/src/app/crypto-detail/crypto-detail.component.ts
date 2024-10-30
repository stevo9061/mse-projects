import { Component, OnInit } from '@angular/core';
import { Cryptocurrency } from '../models/cryptocurrency.model';
import { ActivatedRoute } from '@angular/router';
import { CryptoService } from '../services/crypto.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Currency } from '../models/currency.model';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-crypto-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, MultiSelectModule],
  templateUrl: './crypto-detail.component.html',
  styleUrl: './crypto-detail.component.css'
})
export class CryptoDetailComponent implements OnInit {

  // null: indicates that currencies can initially be zero until the data is loaded.
  crypto: Cryptocurrency | null = null;
  currencies: Currency[] | null = null;
  //currencies: Array<{ key: string; value: string }> = [];
  selectedCurrencies: Currency[] = [];

  bitcoinAmount: number = 1;
  usdAmount: number = 0;
  convertedCurrencies: { key: string; value: number }[] = [];
  currencyNames: { [key: string]: string } = {};
  
  
  constructor(private route: ActivatedRoute, private cryptoService: CryptoService, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    // Checks whether an ID is present in the URL and loads the corresponding crypto data
    if (id) {
      this.cryptoService.getCryptoById(id).subscribe((data) => {
        this.crypto = data;
        console.log('Loaded crypto:', this.crypto);

        // If the cryptocurrency has a symbol, load the conversion rates
        if (this.crypto?.symbol) {
          this.loadCurrencies(this.crypto.symbol.toLowerCase());
        }

        // Initial calculation of the USD value and convertedCurrencies for 1 BTC
        if (this.crypto && this.crypto.priceUsd) {
          this.usdAmount = this.bitcoinAmount * Number(this.crypto.priceUsd);
        }

        this.updateConvertedCurrencies();


        // Load the currency names for dropdown
//        this.loadCurrencyNames();

      });

      
    }
  }

  // Calculates the USD amount from the Bitcoin amount
  calculateUsdFromBitcoin(): void {
    if (this.crypto && this.crypto.priceUsd) {
      this.usdAmount = this.bitcoinAmount * this.crypto.priceUsd;
      
      this.updateConvertedCurrencies();
    }
  }

  // Calculates the Bitcoin amount from the USD amount
  calculateBitcoinFromUsd(): void {
    if (this.crypto && this.crypto.priceUsd) {
      this.bitcoinAmount = this.usdAmount / this.crypto.priceUsd; 
      this.updateConvertedCurrencies(); 
    }
  }

  // Loads the currencies each time the dropdown is opened
  loadCurrencies(baseCurrency: string) {
    this.cryptoService.getCurrenciesWithBase(baseCurrency)
  //this.http.get<{ [key: string]: string }>(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`)
      .subscribe({
        next: (data) => {
        // casting object from api into array
          this.currencies = Object.entries(data[baseCurrency]).map(([key, value]) => ({
            // Combine name and abbreviation
            key: key,
  //          key: `${this.currencyNames[key]} - ${key}`, 
            value: value
          }));
          console.log('Loaded currencies:', this.currencies);
        },
        error: (error) => {
          console.error('Error when retrieving API data:', error);
        }
      });
  }

  // Adds the selected currency to the list of selected currencies
  onCurrencySelected(currencies: Currency[]) {

    this.selectedCurrencies = currencies;
    console.log("Updated selected currencies:", this.selectedCurrencies);
    console.log("Selected currencies:", this.selectedCurrencies.map((currency) => currency.key).join(', '));
    this.updateConvertedCurrencies();
  }

  
  updateConvertedCurrencies(): void {

    if (!this.currencies || this.currencies.length === 0 || this.bitcoinAmount === 0) return;
    
    this.convertedCurrencies = this.selectedCurrencies.map((currency => {
      const conversionRate = parseFloat(currency.value);
      const convertedValue = conversionRate * this.bitcoinAmount;

      return { key: currency.key, value: convertedValue};
      }));
  }
  
  loadCurrencyNames() {

    this.cryptoService.getCurrencyNames().subscribe({
      next: (names) => {
        this.currencyNames = names;
      },
      error: (error) => {
        console.error('Error when retrieving currency names:', error);
      }
  });
}

}
