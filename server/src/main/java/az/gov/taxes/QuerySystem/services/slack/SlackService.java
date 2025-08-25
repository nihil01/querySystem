package az.gov.taxes.QuerySystem.services.slack;

import az.gov.taxes.QuerySystem.configuration.AppBeans;
import az.gov.taxes.QuerySystem.models.db.AdminResponse;
import az.gov.taxes.QuerySystem.models.db.Request;
import com.slack.api.Slack;
import com.slack.api.methods.SlackApiException;
import com.slack.api.methods.response.chat.ChatPostMessageResponse;
import com.slack.api.model.User;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SlackService {

    private final Slack slack;
    @Value("${slack.token}")
    private String token;

    @Value("${slack.channel_name}")
    private String CHANNEL;

    private final AppBeans appBeans;

    public Mono<Void> sendMessage(Request request, RequestType requestType) {
        return Mono.fromRunnable(() -> {
            sendMessageToAdminChannel(request, requestType);
            sendMessageToUser(request);
        });
    }

    public Mono<Void> sendMessage(Request req, AdminResponse request, RequestType requestType, String issuer) {
        return Mono.fromRunnable(() -> {
            sendMessageToAdminChannel(req, request, requestType);
            sendMessageToUser(request, req, issuer, requestType);
        });
    }

    public Mono<Void> sendMessage(long id, String issuer, String deletedBy) {
        return Mono.fromRunnable(() -> {
            Request req = new Request();
            req.setId(id);
            req.setIssuer(issuer);
            req.setDescription(deletedBy);
            sendMessageToAdminChannel(req, RequestType.DELETE);
        });
    }


    public String getUserId(String issuer){

        String userName = issuer.substring(0, issuer.indexOf("@"));

        Map<String, String> userData = appBeans.slackUsers().get(userName);

        if (userData != null && userData.get("notification").equals("YES")){
            return userData.get("id");
        }else{
            return null;
        }
    }

    private void sendMessageToAdminChannel(Request request, RequestType requestType){
        try {
            ChatPostMessageResponse response = slack.methods(token).chatPostMessage(r -> r
                .channel(CHANNEL)
                .text(requestType == RequestType.CREATE ? formatRequestMessage(request) : formatDeleteRequestMessage(request))
            );

            if (!response.isOk()) {
                throw new RuntimeException("Slack error: " + response.getError());
            }

        } catch (IOException | SlackApiException e) {
            throw new RuntimeException(e);
        }
    }

    private void sendMessageToAdminChannel(Request req, AdminResponse request, RequestType requestType){
        try {
            ChatPostMessageResponse response = slack.methods(token).chatPostMessage(r -> r
                    .channel(CHANNEL)
                    .text(requestType == RequestType.REJECT ? formatRejectRequestMessage(request) : formatCloseRequestMessage(req, request))
            );

            if (!response.isOk()) {
                throw new RuntimeException("Slack error: " + response.getError());
            }

        } catch (IOException | SlackApiException e) {
            throw new RuntimeException(e);
        }
    }

    private void sendMessageToUser(Request request){
        try {
            String userId = this.getUserId(request.getIssuer());

            if (userId == null) return;

            String dmChannelId = slack.methods(token).conversationsOpen(
                conversationsOpenRequestBuilder ->
                        conversationsOpenRequestBuilder.users(List.of(userId))).getChannel().getId();


            ChatPostMessageResponse response = slack.methods(token).chatPostMessage(r -> r
                .channel(dmChannelId)
                .text(
                    "Sizin sorğunuz qəbul edildi. \n" +
                    "Tezliklə cavab alacaqsınız və bu barədə xəbərdar ediləcəksiniz. \n"+
                    "Sorğu №"+request.getId()
                )
            );


            if (!response.isOk()) {
                throw new RuntimeException("Slack error: " + response.getError());
            }

        } catch (IOException | SlackApiException e) {
            throw new RuntimeException(e);
        }
    }

    private void sendMessageToUser(AdminResponse request, Request req, String issuer, RequestType requestType){
        try {
            String userId = this.getUserId(issuer);

            if (userId == null) return;

            String dmChannelId = slack.methods(token).conversationsOpen(
                    conversationsOpenRequestBuilder ->
                            conversationsOpenRequestBuilder.users(List.of(userId))).getChannel().getId();


            if (requestType == RequestType.REJECT){

                ChatPostMessageResponse response = slack.methods(token).chatPostMessage(r -> r
                        .channel(dmChannelId)
                        .text(
                                "Sorğu №"+request.getId() + "\n" +
                                        "Sizin sorğunuz imtina olunub. \n" +
                                        "Imtina eden admin: "+ request.getAdmin() + "\n" +
                                        "Sebeb: \n" +
                                        request.getAdminResponse()
                        )
                );

                if (!response.isOk()) {
                    throw new RuntimeException("Slack error: " + response.getError());
                }

            }else{

                ChatPostMessageResponse response = slack.methods(token).chatPostMessage(r -> r
                        .channel(dmChannelId)
                        .text(
                                "Sorğu №"+request.getRequestId() + "\n" +
                                    "Sorğunuz uğurla bağlanıb. \n" +
                                    "Qəbul edən Admin: "+ request.getAdmin() + "\n" +
                                    "Təyin olunmuş məlumat: \n"+

                                    "IP: " + req.getSubnet() + "\n"+
                                    "VRF: " + req.getVrf() + "\n"+
                                    "VLAN: " + req.getVlanId() + "\n"+

                                    "Qeyd: \n" +
                                    request.getAdminResponse()
                        )
                );

                if (!response.isOk()) {
                    throw new RuntimeException("Slack error: " + response.getError());
                }

            }

        } catch (IOException | SlackApiException e) {
            throw new RuntimeException(e);
        }

    }

    private String formatRequestMessage(Request request) {
        return "*Yeni sorğu (№" +request.getId()+ ")*" + "\n"+
            "*Issuer:* " + request.getIssuer() + "\n" +
            "*Title:* " + request.getTitle() + "\n" +
            "*Category:* " + request.getCategory() + "\n" +
            "*Priority:* " + request.getPriority() + "\n" +
            "*DC:* " + request.getDc() + "\n" +
            "*Description:*\n" + request.getDescription() + "\n\n"+
            "<!channel>";
    }

    private String formatDeleteRequestMessage(Request request) {
        return "*Sorğu silindi (№" + request.getId() + ")*" + "\n" +
            "*Issuer:* " + request.getIssuer() + "\n" +
            "*Deleted by:* " + request.getDescription() + "\n" +
            "<!channel>";
    }

    private String formatRejectRequestMessage(AdminResponse response) {
        return "Sorğu №"+response.getRequestId() + "\n" +
            "Sorğu imtina olunub. \n" +
            "Imtina eden admin: "+ response.getAdmin() + "\n" +
            "Sebeb: \n" +
            response.getAdminResponse();
    }

    private String formatCloseRequestMessage(Request request, AdminResponse response) {
        return "Sorğu №"+response.getRequestId() + "\n" +
                "Sorğu uğurla bağlanıb. \n" +
                "Qəbul edən Admin: "+ response.getAdmin() + "\n" +
                "Təyin olunmuş məlumat: \n"+

                "IP: " + request.getSubnet() + "\n"+
                "VRF: " + request.getVrf() + "\n"+
                "VLAN: " + request.getVlanId() + "\n"+

                "Qeyd: \n" +
                response.getAdminResponse() + "\n\n"+
                "<!channel>";
    }


    //save users in a concurrent hashmap
    @PostConstruct
    public void init() {
        try {
            System.out.println("Dynamically retrieving users in a workspace ...");

            List<User> userList = slack.methods().usersList(req -> {
                req.token(token);
                return req;
            })
            .getMembers();

            for (User user : userList) {
                System.out.println(user);
                appBeans.slackUsers().put(user.getName(), new HashMap<>(Map.of(
                        "id", user.getId(),
                        "notification", "YES"
                )));
            }

            System.out.println("All users retrieved in workspace ...");
            System.out.println(appBeans.slackUsers());

        } catch (IOException | SlackApiException e) {
            System.err.println("Slack init failed: " + e.getMessage());
        }
    }
}
