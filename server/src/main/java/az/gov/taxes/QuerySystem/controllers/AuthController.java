package az.gov.taxes.QuerySystem.controllers;

import az.gov.taxes.QuerySystem.models.User;
import az.gov.taxes.QuerySystem.models.UserDto;
import az.gov.taxes.QuerySystem.services.auth.AuthService;
import az.gov.taxes.QuerySystem.services.jwt.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public Mono<ResponseEntity<User>> login(@Valid @RequestBody UserDto user) {
        return authService.fetchUserByPrincipal(user.getPrincipal(), user.getPassword())
            .map(ResponseEntity::ok)
            .switchIfEmpty(Mono.just(ResponseEntity.status(401).build()));
    }

    @GetMapping("/verify")
    public Mono<ResponseEntity<User>> verify(ServerWebExchange exchange) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return Mono.empty();
        }

        return jwtService.verifyToken(token.substring(7)).flatMap(aBoolean -> {
            if (aBoolean) {
                return jwtService.extractUser(token.substring(7)).map(ResponseEntity::ok);
            }else {
                return Mono.just(ResponseEntity.status(401).build());
            }
        });
    }

    @GetMapping("/reissue")
    public Mono<?> reissue(ServerWebExchange exchange) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Refresh ")) {
            return Mono.empty();
        }

        return jwtService.verifyToken(token.substring(9)).flatMap(aBoolean -> {
            if (aBoolean) {
                return jwtService.refreshToken(token.substring(9)).map(ResponseEntity::ok);
            }else {
                return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
            }
        });
    }


}
