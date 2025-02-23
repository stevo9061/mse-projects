package app.web.cryptodashboard.controller;

import app.web.cryptodashboard.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/currencies")
@CrossOrigin
public class CurrencyController {

    @Autowired
    private CurrencyService currencyService;

    @GetMapping("/names")
    public ResponseEntity<Map<String, String>> getAllCurrencyNames() {
        // Holt extern die JSON-Daten (z.B. { "btc": "Bitcoin", ...}) und gibt sie zurück
        Map<String, String> currencyNames = currencyService.fetchCurrencyNames();
        return ResponseEntity.ok(currencyNames);
    }

    @GetMapping("/base/{baseCurrency}")
    public ResponseEntity<Map<String, Object>> getCurrenciesWithBase(@PathVariable String baseCurrency) {
        // Holt extern die Daten zu den Währungen und gibt sie zurück
        Map<String, Object> currencyData = currencyService.fetchCurrenciesForBase(baseCurrency);
        return ResponseEntity.ok(currencyData);
    }


}
