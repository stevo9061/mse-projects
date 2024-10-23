package app.web.cryptodashboard.controller;

import app.web.cryptodashboard.model.CryptoCurrencyDTO;
import app.web.cryptodashboard.service.CryptoCurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@org.springframework.web.bind.annotation.RestController
@RequestMapping("/api/crypto")
@CrossOrigin
public class CryptoCurrencyController {

    @Autowired
    private CryptoCurrencyService cryptoCurrencyService;

    @GetMapping("/fetch-and-save")
    public ResponseEntity<String> fetchAndSaveCryptoData() {

        cryptoCurrencyService.fetchAndSaveCryptoData();

        return ResponseEntity.ok("Fetched and saved crypto data successfully.");
    }

    @GetMapping("/all")
    public ResponseEntity<List<CryptoCurrencyDTO>> getAllCryptoCurrencies() {
        List<CryptoCurrencyDTO> cryptoList = cryptoCurrencyService.getAllCryptoCurrencies();

        return ResponseEntity.ok(cryptoList);
    }

}
