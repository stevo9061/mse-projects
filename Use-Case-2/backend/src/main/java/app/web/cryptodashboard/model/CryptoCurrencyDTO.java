package app.web.cryptodashboard.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
// A DTO is a simple object that is mainly used to transfer data between different layers of an application,
// e.g. between the service layer and the controller layer.
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


}
