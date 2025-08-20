package az.gov.taxes.QuerySystem.repositories;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.List;

public interface RequestRepository extends
        ReactiveCrudRepository<az.gov.taxes.QuerySystem.models.db.Request,Long> {

        Flux<az.gov.taxes.QuerySystem.models.db.Request> findByIssuer(String issuer);

}
