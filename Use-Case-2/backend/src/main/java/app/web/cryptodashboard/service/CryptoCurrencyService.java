package app.web.cryptodashboard.service;

import app.web.cryptodashboard.model.CryptoApiResponse;
import app.web.cryptodashboard.model.CryptoCurrency;
import app.web.cryptodashboard.model.CryptoCurrencyDTO;
import app.web.cryptodashboard.repository.CryptoCurrencyRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CryptoCurrencyService {


    @Autowired
    private final CryptoCurrencyRepository cryptoCurrencyRepository;

    @Autowired
    private RestTemplate restTemplate;


    public CryptoCurrencyService(CryptoCurrencyRepository cryptoCurrencyRepository) {
        this.cryptoCurrencyRepository = cryptoCurrencyRepository;
    }

    private static final String API_Url = "https://api.coincap.io/v2/assets/";


    @Transactional
    public void fetchAndSaveCryptoData() {

        // Get API-Data
        ResponseEntity<CryptoApiResponse> response = restTemplate.getForEntity(API_Url, CryptoApiResponse.class);
        CryptoApiResponse apiResponse = response.getBody();


        if (apiResponse != null && apiResponse.getData() != null) {
            for (CryptoCurrencyDTO dto : apiResponse.getData()) {

                // Check whether the entry already exists
                CryptoCurrency existingCrypto = cryptoCurrencyRepository.findBySymbol(dto.getSymbol());

                if (existingCrypto != null) {
                    existingCrypto.setSymbol(dto.getSymbol());
                    existingCrypto.setName(dto.getName());
                    existingCrypto.setSupply(dto.getSupply() != null ? new BigDecimal(dto.getSupply()) : BigDecimal.ZERO);
                    existingCrypto.setMaxSupply(dto.getMaxSupply() != null ? new BigDecimal(dto.getMaxSupply()) : BigDecimal.ZERO);
                    existingCrypto.setMarketcapUsd(dto.getMarketCapUsd() != null ? new BigDecimal(dto.getMarketCapUsd()) : BigDecimal.ZERO);
                    existingCrypto.setVolumeUsd24hr(dto.getVolumeUsd24Hr() != null ? new BigDecimal(dto.getVolumeUsd24Hr()) : BigDecimal.ZERO);
                    existingCrypto.setPriceUsd(dto.getPriceUsd() != null ? new BigDecimal(dto.getPriceUsd()) : BigDecimal.ZERO);
                    existingCrypto.setChangePercent24hr(dto.getChangePercent24Hr() != null ? new BigDecimal(dto.getChangePercent24Hr()) : BigDecimal.ZERO);
                    existingCrypto.setVwap24hr(dto.getVwap24Hr() != null ? new BigDecimal(dto.getVwap24Hr()) : BigDecimal.ZERO);
                    existingCrypto.setExplorer(dto.getExplorer());

                    cryptoCurrencyRepository.save(existingCrypto);
                } else {
                    // Add new entry
                    CryptoCurrency newCrypto = mapDtoToEntity(dto);
                    cryptoCurrencyRepository.save(newCrypto);
                }

            }
        }

    }


    public List<CryptoCurrencyDTO> getAllCryptoCurrencies() {

        List<CryptoCurrency> cryptoList = cryptoCurrencyRepository.findAll();

        return cryptoList.stream().map(this::mapEntityToDto).collect(Collectors.toList());
    }

    public CryptoCurrencyDTO getCryptoCurrencyByID(Long id) {

        Optional<CryptoCurrency> optionalCryptoCurrencyByID = cryptoCurrencyRepository.findById(id);

        CryptoCurrency cryptoCurrencyByID = optionalCryptoCurrencyByID.orElseThrow(() -> new IllegalArgumentException( ("Cryptocurrency not found for ID: + id));")));

        return mapEntityToDto(cryptoCurrencyByID);
    }


    // Mapping: DTO to Entity
    private CryptoCurrency mapDtoToEntity(CryptoCurrencyDTO dto) {

        CryptoCurrency crypto = new CryptoCurrency();
        crypto.setSymbol(dto.getSymbol());
        crypto.setName(dto.getName());
        crypto.setSupply(dto.getSupply() != null ? new BigDecimal(dto.getSupply()) : BigDecimal.ZERO);
        crypto.setMaxSupply(dto.getMaxSupply() != null ? new BigDecimal(dto.getMaxSupply()) : BigDecimal.ZERO);
        crypto.setMarketcapUsd(dto.getMarketCapUsd() != null ? new BigDecimal(dto.getMarketCapUsd()) : BigDecimal.ZERO);
        crypto.setVolumeUsd24hr(dto.getVolumeUsd24Hr() != null ? new BigDecimal(dto.getVolumeUsd24Hr()) : BigDecimal.ZERO);
        crypto.setPriceUsd(dto.getPriceUsd() != null ? new BigDecimal(dto.getPriceUsd()) : BigDecimal.ZERO);
        crypto.setChangePercent24hr(dto.getChangePercent24Hr() != null ? new BigDecimal(dto.getChangePercent24Hr()) : BigDecimal.ZERO);
        crypto.setVwap24hr(dto.getVwap24Hr() != null ? new BigDecimal(dto.getVwap24Hr()) : BigDecimal.ZERO);
        crypto.setExplorer(dto.getExplorer());

        return crypto;
    }


    // Mapping: Entity to DTO
    private CryptoCurrencyDTO mapEntityToDto(CryptoCurrency crypto) {

        return new CryptoCurrencyDTO(
                crypto.getId().toString(),
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
