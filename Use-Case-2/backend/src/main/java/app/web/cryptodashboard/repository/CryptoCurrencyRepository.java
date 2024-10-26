
package app.web.cryptodashboard.repository;

import app.web.cryptodashboard.model.CryptoCurrency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CryptoCurrencyRepository extends JpaRepository<CryptoCurrency, Long> {

    CryptoCurrency findBySymbol(String symbol);

}

