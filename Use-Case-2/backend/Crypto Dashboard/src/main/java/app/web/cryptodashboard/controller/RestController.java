package app.web.cryptodashboard.controller;

import app.web.cryptodashboard.model.CryptoCurrencyDTO;
import app.web.cryptodashboard.service.CryptoCurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@org.springframework.web.bind.annotation.RestController
@RequestMapping("/api")
@CrossOrigin
public class RestController {

    @Autowired
    private CryptoCurrencyService cryptoDashboardService;

    @GetMapping("fetch")
    public ResponseEntity<CryptoCurrencyDTO> fetchCryptoData() {

        CryptoCurrencyDTO cryptoDTO =
    }
}
