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
  
  constructor(private route: ActivatedRoute, private cryptoService: CryptoService, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cryptoService.getCryptoById(id).subscribe((data) => {
        this.crypto = data;
      });

      
    }
  }

  // Loads the currencies each time the dropdown is opened
  loadCurrencies() {
    this.cryptoService.getAllCurrencies().subscribe({
      next: (data) => {
      // casting object from api into array
      this.currencies = Object.entries(data).map(([key, value]) => ({
         key: key, 
         value: value
        }));
   //   console.log('Loaded currencies:', this.currencies); // Debugging
      },
      error: (error) => {
        console.error('Error when retrieving API data:', error);
      }
    });
  }

  // Adds the selected currency to the list of selected currencies
  onCurrencySelected(selectedValues: Currency[]) {
      
    this.selectedCurrencies = selectedValues;
    console.log("Ausgewählte Währungen:", this.selectedCurrencies.map((currency) => currency.key).join(', '));

  }


}
