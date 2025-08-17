package az.gov.taxes.QuerySystem.services.auth;

import az.gov.taxes.QuerySystem.configuration.AppBeans;
import az.gov.taxes.QuerySystem.models.User;
import az.gov.taxes.QuerySystem.services.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.SearchScope;
import org.springframework.ldap.query.LdapQuery;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.List;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final LdapTemplate ldapTemplate;
    private final AppBeans appBeans;
    private final JwtService jwtService;

    private boolean checkUser(String log, String pass){
        try {
            LdapQuery q = query().where("userPrincipalName").is(log);
            ldapTemplate.authenticate(q, pass);
            return true;
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return false;
        }
    }

    public Mono<User> fetchUserByPrincipal(String userPrincipalName, String password) {

        return Mono.fromCallable(() -> {

            if (!checkUser(userPrincipalName, password)) {
                return null;
            }

            LdapQuery ldapQuery = query()
                    .base("")
                    .searchScope(SearchScope.SUBTREE)
                    .where("userPrincipalName").is(userPrincipalName);

            List<User> users = ldapTemplate.search(
                ldapQuery,
                (AttributesMapper<User>) attrs -> {
                    User user = new User();

                    user.setPrincipalName(userPrincipalName);
                    user.setFullName(attrs.get("displayName") != null ? attrs.get("displayName").get().toString() : null);
                    user.setDepartment(attrs.get("department") != null ? attrs.get("department").get().toString() : null);
                    user.setPosition(attrs.get("title") != null ? attrs.get("title").get().toString() : attrs.get("description").get().toString());
                    user.setPhone(attrs.get("telephoneNumber") != null ? attrs.get("telephoneNumber").get().toString() : "-");

                    if (appBeans.defaultAdministrators().contains(user.getPrincipalName().toLowerCase())){
                        user.setRole("ADMIN");
                    }else {
                        user.setRole("USER");
                    }

                    user.setToken(jwtService.signToken(user));

                    return user;
                });

            if (users.isEmpty()) return null;
            return users.get(0);

        }).flatMap(user -> user != null ? Mono.just(user) : Mono.empty());
    }
}
