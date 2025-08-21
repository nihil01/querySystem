package az.gov.taxes.QuerySystem.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class AppBeans {


    @Bean
    public List<String> defaultAdministrators(){

        return List.of(
            "qamet.cahangirli@taxes.gov.az",
            "orkhan.narbayov@taxes.gov.az",
            "tamerlan.zenizada@taxes.gov.az",
            "nijat.aliyev@taxes.gov.az"
        );

    }

    @Bean
    public ConcurrentHashMap<String, Map<String, String>> slackUsers(){
        return new ConcurrentHashMap<>();
    }

}
