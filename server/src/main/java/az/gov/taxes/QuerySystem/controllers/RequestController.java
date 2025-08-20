package az.gov.taxes.QuerySystem.controllers;

import az.gov.taxes.QuerySystem.models.RequestDTO;
import az.gov.taxes.QuerySystem.models.User;
import az.gov.taxes.QuerySystem.repositories.RequestRepository;
import az.gov.taxes.QuerySystem.services.slack.SlackService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/request")
@RequiredArgsConstructor
public class RequestController {

    private final SlackService slackService;
    private final RequestRepository requestRepository;

    @PostMapping("/create")
    public Mono<?> createRequest(@RequestBody RequestDTO req) {
        return requestRepository.save(mapToRequest(req))
            .flatMap(savedRequest ->
                slackService.sendMessage(savedRequest)
                    .thenReturn(savedRequest)
            );
    }



    @GetMapping("/get-all")
    public Flux<az.gov.taxes.QuerySystem.models.db.Request> getAllRequests(@RequestParam String issuer,
                @AuthenticationPrincipal User user) {

        if (!issuer.equalsIgnoreCase(user.getPrincipalName())) {
            return Flux.error(new RuntimeException("OTHER_ACCOUNT_FORBIDDEN"));
        }
        return requestRepository.findByIssuer(issuer);

    }


    private az.gov.taxes.QuerySystem.models.db.Request mapToRequest(RequestDTO dto) {
        return az.gov.taxes.QuerySystem.models.db.Request.builder()
            .dc(dto.getDc())
            .title(dto.getTitle())
            .issuer(dto.getIssuer())
            .subcategory(dto.getSubcategory())
            .category(dto.getCategory())
            .vrf(dto.getVrf())
            .subnet(dto.getSubnet())
            .vlanId(dto.getVlanId())
            .description(dto.getDescription())
            .priority(dto.getPriority())
            .build();
    }

}
