package az.gov.taxes.QuerySystem.repositories;

import az.gov.taxes.QuerySystem.models.db.Request;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

public interface RequestRepository extends
        ReactiveCrudRepository<az.gov.taxes.QuerySystem.models.db.Request,Long> {

        Flux<Request> findByIssuer(String issuer);
        Mono<Request> findById(long id);
        Mono<Void> deleteRequestById(Long id);

}
