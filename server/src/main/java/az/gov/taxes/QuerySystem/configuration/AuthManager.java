package az.gov.taxes.QuerySystem.configuration;

import az.gov.taxes.QuerySystem.services.jwt.JwtAuthentication;
import az.gov.taxes.QuerySystem.services.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class AuthManager implements ReactiveAuthenticationManager {

    private static final Logger logger = LoggerFactory.getLogger(AuthManager.class);
    private final JwtService jwtService;
    private final AppBeans appBeans;

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        if (!(authentication instanceof JwtAuthentication)) {
            return Mono.error(new BadCredentialsException("Unsupported authentication type"));
        }

        String token = authentication.getCredentials().toString();
        logger.debug("Authenticating token: {}", token);

        return jwtService.verifyToken(token)
            .flatMap(isValid -> {
                if (!isValid) {
                    logger.debug("Token is invalid");
                    return Mono.error(new BadCredentialsException("Invalid JWT token"));
                }

                return jwtService.extractUser(token)
                    .switchIfEmpty(Mono.error(new BadCredentialsException("Could not extract user from token")))
                .flatMap(userResponse -> {
                    if (userResponse == null) {
                        return Mono.error(new BadCredentialsException("User extraction failed"));
                    }

                    var authorities = appBeans.defaultAdministrators().contains(userResponse.getPrincipalName())
                            ? List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                            : List.of(new SimpleGrantedAuthority("ROLE_USER"));

                    var authenticatedToken = new AbstractAuthenticationToken(authorities) {
                        @Override
                        public Object getCredentials() {
                            return token;
                        }

                        @Override
                        public Object getPrincipal() {
                            return userResponse;
                        }
                    };

                    authenticatedToken.setAuthenticated(true);
                        return Mono.just(authenticatedToken);
                    });
        });
    }
}
