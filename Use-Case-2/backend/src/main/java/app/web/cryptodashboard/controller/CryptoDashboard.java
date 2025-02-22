package app.web.cryptodashboard.controller;

import app.web.cryptodashboard.model.CryptoCurrencyDTO;
import app.web.cryptodashboard.service.CryptoCurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@org.springframework.web.bind.annotation.RestController
@RequestMapping("/api/crypto")
@CrossOrigin
public class CryptoCurrencyController {

    @Autowired
    private CryptoCurrencyService cryptoCurrencyService;

    @GetMapping("/fetch-and-save")
    public ResponseEntity<List<CryptoCurrencyDTO>> fetchAndSaveCryptoData() {

        cryptoCurrencyService.fetchAndSaveCryptoData();

        List<CryptoCurrencyDTO> cryptoList = cryptoCurrencyService.getAllCryptoCurrencies();

        return ResponseEntity.ok(cryptoList);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CryptoCurrencyDTO>> getAllCryptoCurrencies() {
        List<CryptoCurrencyDTO> cryptoList = cryptoCurrencyService.getAllCryptoCurrencies();

        return ResponseEntity.ok(cryptoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CryptoCurrencyDTO> getCryptoCurrencyById(@PathVariable("id") Long Id) {

        CryptoCurrencyDTO cryptoCurrencyById = cryptoCurrencyService.getCryptoCurrencyByID(Id);

        return ResponseEntity.ok(cryptoCurrencyById);
    }

}
