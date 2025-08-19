package az.gov.taxes.QuerySystem.configuration;

import com.slack.api.Slack;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SlackConf {

    @Bean
    public Slack slackClient() {
        return Slack.getInstance();
    }

}
