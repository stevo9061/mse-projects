import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cryptocurrency } from '../models/cryptocurrency.model';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private cryptoUrl = 'http://localhost:8080/api/crypto';

  private currencyUrl = 'http://localhost:8080/api/currencies';

  constructor(private http: HttpClient) { }

  getAllCryptos(): Observable<Cryptocurrency[]> {
    return this.http.get<Cryptocurrency[]>(`${this.cryptoUrl}/all`);
  }

  getCryptoById(id: string): Observable<Cryptocurrency> {
    return this.http.get<Cryptocurrency>(`${this.cryptoUrl}/${id}`);
  }

  // data type of api is an object, so we need to cast it into an array
  getCurrenciesWithBase(baseCurrency: string): Observable<{ [key: string]: string }> {
    const url = `${this.currencyUrl + '/base'}/${baseCurrency}`;
    return this.http.get<{ [key: string]: string }>(url);
  }

  getCurrencyNames(): Observable<{ [key: string]: string }> {
    const url = this.currencyUrl + '/names';
    return this.http.get<{ [key: string]: string }>(url);
}

}
