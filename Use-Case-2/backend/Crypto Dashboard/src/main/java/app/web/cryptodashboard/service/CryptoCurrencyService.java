package app.web.cryptodashboard.service;

import app.web.cryptodashboard.model.CryptoCurrency;
import app.web.cryptodashboard.model.CryptoCurrencyDTO;
import app.web.cryptodashboard.repository.CryptoCurrencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Service
public class CryptoCurrencyService {


    private final CryptoCurrencyRepository cryptoCurrencyRepository;
    private final RestTemplate restTemplate;

    @Autowired
    public CryptoCurrencyService(CryptoCurrencyRepository cryptoCurrencyRepository) {
        this.cryptoCurrencyRepository = cryptoCurrencyRepository;
    }

    @Transactional
    public void fetchAndSaveCryptoData() {
        String url = "https://api.coincap.io/v2/assets/";
        CryptoCurrencyDTO[] cryptoData = restTemplate.getForObject(url, CryptoCurrencyDTO[].class);

        if (cryptoData != null) {
            for (CryptoCurrencyDTO cryptoCurrencyDTO : cryptoData) {
                CryptoCurrency crypto = new CryptoCurrency();
                crypto.setSymbol(cryptoCurrencyDTO.getSymbol());
                crypto.setName(cryptoCurrencyDTO.getName());
                crypto.setSupply(new BigDecimal(cryptoCurrencyDTO.getSupply()));
                crypto.setMaxSupply(new BigDecimal(cryptoCurrencyDTO.getMaxSupply()));
                crypto.setMarketcapUsd(new BigDecimal(cryptoCurrencyDTO.getMarketcapUsd()));
                crypto.setVolumeUsd24hr(new BigDecimal(cryptoCurrencyDTO.getVolumeUsd24hr()));
                crypto.setPriceUsd(new BigDecimal(cryptoCurrencyDTO.getPriceUsd()));
                crypto.setChangePercent24hr(new BigDecimal(cryptoCurrencyDTO.getChangePercent24hr()));
                crypto.setVwap24hr(new BigDecimal(cryptoCurrencyDTO.getVwap24hr()));
                crypto.setExplorer(cryptoCurrencyDTO.getExplorer());

                cryptoCurrencyRepository.save(crypto);
            }
        }

    }
}
