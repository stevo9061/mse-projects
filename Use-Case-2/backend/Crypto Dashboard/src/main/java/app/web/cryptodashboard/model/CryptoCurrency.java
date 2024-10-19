package app.web.cryptodashboard.model;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter @Setter @ToString
@AllArgsConstructor
@NoArgsConstructor
public class CryptoCurrency {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String symbol;

    private String name;

    @Column(scale = 2)
    private BigDecimal supply;

    @Column(name="max_supply", scale = 2)
    private BigDecimal maxSupply;

    @Column(name="market_cap_usd", scale = 2)
    private BigDecimal marketcapUsd;

    @Column(name="volume_usd_24hr", scale = 2)
    private BigDecimal volumeUsd24hr;

    @Column(name="price_usd", scale = 2)
    private BigDecimal priceUsd;

    @Column(name="change_percent_24hr", scale = 2)
    private BigDecimal changePercent24hr;

    @Column(name="vwap_24hr", scale = 2)
    private BigDecimal Vwap24hr;

    private String explorer;






 }
