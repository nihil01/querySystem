package az.gov.taxes.QuerySystem.repositories;

import az.gov.taxes.QuerySystem.models.db.AdminResponse;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface AdminResponseRepository extends ReactiveCrudRepository<AdminResponse, Long> {
    Mono<AdminResponse> findByRequestId(Long requestId);
}
