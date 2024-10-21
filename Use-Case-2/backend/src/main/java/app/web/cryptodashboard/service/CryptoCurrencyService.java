package app.web.cryptodashboard.service;

import app.web.cryptodashboard.model.CryptoCurrency;
import app.web.cryptodashboard.model.CryptoCurrencyDTO;
import app.web.cryptodashboard.repository.CryptoCurrencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CryptoCurrencyService {


    @Autowired
    private final CryptoCurrencyRepository cryptoCurrencyRepository;

    @Autowired
    private RestTemplate restTemplate;

    private static final String API_Url = "https://api.coincap.io/v2/assets/";


    public CryptoCurrencyService(CryptoCurrencyRepository cryptoCurrencyRepository) {
        this.cryptoCurrencyRepository = cryptoCurrencyRepository;
    }

    @Transactional
    public void fetchAndSaveCryptoData() {

        // Get API-Data
        ResponseEntity<CryptoCurrencyDTO[]> response = restTemplate.getForEntity(API_Url, CryptoCurrencyDTO[].class);
        CryptoCurrencyDTO[] cryptoDataArray = response.getBody();


        if (cryptoDataArray != null) {
            for (CryptoCurrencyDTO dto : cryptoDataArray) {
                CryptoCurrency crypto = new CryptoCurrency();
                crypto.setSymbol(dto.getSymbol());
                crypto.setName(dto.getName());
                crypto.setSupply(new BigDecimal(dto.getSupply()));
                crypto.setMaxSupply(new BigDecimal(dto.getMaxSupply()));
                crypto.setMarketcapUsd(new BigDecimal(dto.getMarketcapUsd()));
                crypto.setVolumeUsd24hr(new BigDecimal(dto.getVolumeUsd24hr()));
                crypto.setPriceUsd(new BigDecimal(dto.getPriceUsd()));
                crypto.setChangePercent24hr(new BigDecimal(dto.getChangePercent24hr()));
                crypto.setVwap24hr(new BigDecimal(dto.getVwap24hr()));
                crypto.setExplorer(dto.getExplorer());

                // save and reload
                cryptoCurrencyRepository.save(crypto);
            }
        }

    }


    public List<CryptoCurrencyDTO> getAllCryptoCurrencies() {

        List<CryptoCurrency> cryptoList = cryptoCurrencyRepository.findAll();

        return cryptoList.stream().map(this::mapEntityToDto).collect(Collectors.toList());
    }


    // Mapping: DTO zu Entity
    private CryptoCurrency mapDtoToEntity(CryptoCurrencyDTO dto) {

        CryptoCurrency crypto = new CryptoCurrency();
        crypto.setSymbol(dto.getSymbol());
        crypto.setName(dto.getName());
        crypto.setSupply(new BigDecimal(dto.getSupply()));
        crypto.setMaxSupply(new BigDecimal(dto.getMaxSupply()));
        crypto.setMarketcapUsd(new BigDecimal(dto.getMarketcapUsd()));
        crypto.setVolumeUsd24hr(new BigDecimal(dto.getVolumeUsd24hr()));
        crypto.setPriceUsd(new BigDecimal(dto.getPriceUsd()));
        crypto.setChangePercent24hr(new BigDecimal(dto.getChangePercent24hr()));
        crypto.setVwap24hr(new BigDecimal(dto.getVwap24hr()));
        crypto.setExplorer(dto.getExplorer());

        return crypto;
    }


    // Mapping: Entity zu DTO
    private CryptoCurrencyDTO mapEntityToDto(CryptoCurrency crypto) {

        return new CryptoCurrencyDTO(
                crypto.getId(),
                crypto.getSymbol(),
                crypto.getName(),
                crypto.getSupply().toString(),
                crypto.getMaxSupply().toString(),
                crypto.getMarketcapUsd().toString(),
                crypto.getVolumeUsd24hr().toString(),
                crypto.getPriceUsd().toString(),
                crypto.getChangePercent24hr().toString(),
                crypto.getVwap24hr().toString(),
                crypto.getExplorer()
        );
    }




}
