package az.gov.taxes.QuerySystem.controllers;

import az.gov.taxes.QuerySystem.configuration.AppBeans;
import az.gov.taxes.QuerySystem.models.AdminResponseDTO;
import az.gov.taxes.QuerySystem.models.RequestDTO;
import az.gov.taxes.QuerySystem.models.SingleRequestFullResponse;
import az.gov.taxes.QuerySystem.models.User;
import az.gov.taxes.QuerySystem.models.db.AdminResponse;
import az.gov.taxes.QuerySystem.models.db.Request;
import az.gov.taxes.QuerySystem.repositories.AdminResponseRepository;
import az.gov.taxes.QuerySystem.repositories.RequestRepository;
import az.gov.taxes.QuerySystem.services.slack.RequestType;
import az.gov.taxes.QuerySystem.services.slack.SlackService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/request")
@RequiredArgsConstructor
public class RequestController {

    private final SlackService slackService;
    private final RequestRepository requestRepository;
    private final AppBeans appBeans;
    private final AdminResponseRepository adminResponseRepository;
    private final Logger log = LoggerFactory.getLogger(RequestController.class);

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

    @DeleteMapping("/deleteRequest")
    public Mono<?> deleteRequest(@RequestParam("id") Long id, @RequestParam("issuer") String issuer ,@AuthenticationPrincipal User user) {

        if (user.getRole().equals("ADMIN") || user.getPrincipalName().equals(issuer)) {
            String deletedBy = user.getRole().equals("ADMIN") ? user.getPrincipalName() : issuer;
            return requestRepository.deleteRequestById(id).then(slackService.sendMessage(id, issuer, deletedBy));
        }else  {
            return Mono.empty();
        }

    }

    @PostMapping("/send-admin-response")
    public Mono<?> sendAdminResponse(@RequestBody AdminResponseDTO adminResponse) {
        return adminResponseRepository.save(mapToAdminResponse(adminResponse));
    }

    @GetMapping("/get-response/{id}")
    public Mono<?> getResponseByID(@PathVariable Long id, @AuthenticationPrincipal User user) {
        log.info("Получен запрос get-response с id={} от пользователя={}", id, user);

        return requestRepository.findById(id)
                .doOnNext(req -> log.debug("Найден Request: {}", req))
                .switchIfEmpty(Mono.error(new RuntimeException("REQUEST_NOT_FOUND")))
                .flatMap(request ->
                        adminResponseRepository.findByRequestId(id)
                                .doOnNext(resp -> log.debug("Найден AdminResponse: {}", resp))
                                .switchIfEmpty(Mono.defer(() -> {
                                    log.warn("AdminResponse для requestId={} не найден", id);
                                    return Mono.empty();
                                }))
                                .defaultIfEmpty(new AdminResponse())
                                .flatMap(response -> {
                                    if (!request.getIssuer().equalsIgnoreCase(user.getPrincipalName())) {
                                        log.warn("Пользователь {} пытался получить чужой запрос {}", user.getPrincipalName(), id);
                                        return Mono.error(new RuntimeException("OTHER_ACCOUNT_REQUEST_FORBIDDEN"));
                                    }

                                    return Mono.just(SingleRequestFullResponse.builder()
                                            .adminResponse(response) // может быть null
                                            .userRequest(request)
                                            .build());
                                })
                )
                .doOnSuccess(res -> log.info("Ответ сформирован: {}", res))
                .doOnError(err -> log.error("Ошибка при формировании ответа для id={}", id, err));
    }


    @GetMapping("/notifications")
    public Mono<Void> handleNotifications(@RequestParam String issuer, @RequestParam String state,
                                          @AuthenticationPrincipal User user) {

        if (!issuer.equalsIgnoreCase(user.getPrincipalName())) {
            return Mono.error(new RuntimeException("OTHER_ACCOUNT_FORBIDDEN"));
        }

        Map<String, String> userData = appBeans.slackUsers().get(user.getPrincipalName()
                .substring(0, user.getPrincipalName().indexOf("@")).toLowerCase());

        if (userData != null && (state.equals("NO") || state.equals("YES"))) {
            userData.computeIfPresent("notification", (k, v) -> state);
        }

        return Mono.empty();

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

    private AdminResponse mapToAdminResponse(AdminResponseDTO dto) {

        return AdminResponse.builder()
            .adminResponse(dto.getAdminResponse())
            .requestId(dto.getRequestId())
            .admin(dto.getAdmin())
            .build();

    }

}
