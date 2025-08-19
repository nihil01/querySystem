package az.gov.taxes.QuerySystem.services.slack;

import com.slack.api.Slack;
import com.slack.api.methods.SlackApiException;
import com.slack.api.methods.response.chat.ChatPostMessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlackService {

    private final String CHANNEL = "#bot-notifications";
    private final Slack slack;
    @Value("${slack.token}")
    private String token;

    //TODO FINISH IMPLEMENTATION OF MESSAGES IN SLACK
    public Mono<Void> sendMessage(String text) {
        return Mono.fromRunnable(() -> {

            //get current users in channel
            List<String> users;
            try {
               users = slack.methods(token)
                    .conversationsMembers(r -> r.channel(CHANNEL))
                    .getMembers();
            } catch (IOException | SlackApiException e) {
                users = Collections.emptyList();
                throw new RuntimeException(e);
            }

            System.out.println("USR LIST");
            System.out.println(users);

            ChatPostMessageResponse response = null;
            try {
                response = slack.methods(token).chatPostMessage(r -> r
                        .channel(CHANNEL)
                        .text(text)
                );
            } catch (IOException | SlackApiException e) {
                throw new RuntimeException(e);
            }

            if (!response.isOk()) {
                throw new RuntimeException("Slack error: " + response.getError());
            }
        });
    }
}
