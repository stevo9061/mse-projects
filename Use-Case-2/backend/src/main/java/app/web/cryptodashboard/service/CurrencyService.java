package app.web.cryptodashboard.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class CurrencyService {

    @Autowired
    private RestTemplate restTemplate;

    // 1) Currency Names laden (z.B. "usd": "US Dollar", "eur": "Euro", ...)
    public Map<String, String> fetchCurrencyNames() {
        // Holt extern die JSON-Daten (z.B. { "btc": "Bitcoin", ...}) und gibt sie zurück
        String url = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json";

        ResponseEntity<Map<String, String>> response =
                restTemplate.exchange(url, HttpMethod.GET,
                        null, new ParameterizedTypeReference<>() {});

        return response.getBody();
    }

    // 2) Währungen auf Basis "baseCurrency" (z.B. https://cdn.jsdelivr.net/..../btc.json)
    public Map<String, Object> fetchCurrenciesForBase(String baseCurrency) {
        String url = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/" + baseCurrency + ".json";

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(url, HttpMethod.GET,
                null, new ParameterizedTypeReference<>() {});

        return response.getBody();
    }
}
