package app.web.cryptodashboard.model;

import java.util.List;

public class CryptoApiResponse {

    private List<CryptoCurrencyDTO> data;

    public List<CryptoCurrencyDTO> getData() {
        return data;
    }

    public void setData(List<CryptoCurrencyDTO> data) {
        this.data = data;
    }
}
