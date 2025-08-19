package az.gov.taxes.QuerySystem.controllers;

import az.gov.taxes.QuerySystem.models.RequestDTO;
import az.gov.taxes.QuerySystem.services.slack.SlackService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/request")
@RequiredArgsConstructor
public class RequestController {

    private final SlackService slackService;

    @PostMapping("/create")
    public Mono<?> createRequest(@RequestBody RequestDTO req) {

        System.out.println(req);

        return slackService.sendMessage("SALAM TEST");
    }

}
