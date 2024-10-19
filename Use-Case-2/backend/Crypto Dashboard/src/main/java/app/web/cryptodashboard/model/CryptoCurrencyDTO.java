package app.web.cryptodashboard.model;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CryptoCurrencyDTO {


    private Long id;

    private String symbol;

    private String name;

    private String supply;

    private String maxSupply;

    private String marketcapUsd;

    private String volumeUsd24hr;

    private String priceUsd;

    private String changePercent24hr;

    private String vwap24hr;

    private String explorer;

    public CryptoCurrencyDTO(Long id, String coin, String name, String supply, String maxSupply, String marketcapUsd,
                             String volumeUsd24hr, String priceUsd, String changePercent24hr, String vwap24hr,
                             String explorer) {
        this.id = id;
        this.supply = supply;
        this.maxSupply = maxSupply;
        this.marketcapUsd = marketcapUsd;
        this.volumeUsd24hr = volumeUsd24hr;
        this.priceUsd = priceUsd;
        this.changePercent24hr = changePercent24hr;
        this.vwap24hr = vwap24hr;
        this.explorer = explorer;
    }

    public CryptoCurrencyDTO() {}


}
