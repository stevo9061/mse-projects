package app.web.cryptodashboard.controller;

import app.web.cryptodashboard.model.CryptoCurrencyDTO;
import app.web.cryptodashboard.service.CryptoDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crypto")
@CrossOrigin
public class CryptoDashboardController {

    @Autowired
    private CryptoDashboardService cryptoDashboardService;

    @GetMapping("/fetch-and-save")
    public ResponseEntity<List<CryptoCurrencyDTO>> fetchAndSaveCryptoData() {

        cryptoDashboardService.fetchAndSaveCryptoData();

        List<CryptoCurrencyDTO> cryptoList = cryptoDashboardService.getAllCryptoCurrencies();

        return ResponseEntity.ok(cryptoList);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CryptoCurrencyDTO>> getAllCryptoCurrencies() {
        List<CryptoCurrencyDTO> cryptoList = cryptoDashboardService.getAllCryptoCurrencies();

        return ResponseEntity.ok(cryptoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CryptoCurrencyDTO> getCryptoCurrencyById(@PathVariable("id") Long Id) {

        CryptoCurrencyDTO cryptoCurrencyById = cryptoDashboardService.getCryptoCurrencyByID(Id);

        return ResponseEntity.ok(cryptoCurrencyById);
    }

}
