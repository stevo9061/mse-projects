import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cryptocurrency } from '../models/cryptocurrency.model';
import { Currency } from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private cryptoUrl = 'http://localhost:8080/api/crypto';

  private currencyUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json';

  constructor(private http: HttpClient) { }

  getAllCryptos(): Observable<Cryptocurrency[]> {
    return this.http.get<Cryptocurrency[]>(`${this.cryptoUrl}/all`);
  }

  getCryptoById(id: string): Observable<Cryptocurrency> {
    return this.http.get<Cryptocurrency>(`${this.cryptoUrl}/${id}`);
  }

  getAllCurrencies(): Observable<Currency> { // data type of api is an object
    return this.http.get<Currency>(this.currencyUrl);
  }

}
