package az.gov.taxes.QuerySystem.repositories;

import az.gov.taxes.QuerySystem.models.db.AdminResponse;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface AdminResponseRepository extends ReactiveCrudRepository<AdminResponse, Long> {
    Mono<AdminResponse> findByRequestId(Long requestId);
}
