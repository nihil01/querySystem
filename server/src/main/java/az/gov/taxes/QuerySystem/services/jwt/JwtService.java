package az.gov.taxes.QuerySystem.services.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import az.gov.taxes.QuerySystem.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Map;
import java.util.Objects;

@Service
public class JwtService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private Algorithm algorithm;

    //retrieve pub and priv keys
    @Value("${spring.cert.pub}")
    private String pubKeyPath;

    @Value("${spring.cert.priv}")
    private String privKeyPath;

    @PostConstruct
    public void init() {

        RSAPublicKey publicKey = (RSAPublicKey) getRSAKey(pubKeyPath, KeyType.PUBLIC);
        RSAPrivateKey privateKey = (RSAPrivateKey) getRSAKey(privKeyPath, KeyType.PRIVATE);
        this.algorithm = Algorithm.RSA256(publicKey, privateKey);
        log.info("JWT Algorithm RSA256 initialized with provided keys");

    }

    private RSAKey getRSAKey(String path, KeyType keyType) {
        try {
            String key;
            final Path keyPath = Paths.get(path);

            if (keyType == KeyType.PUBLIC){
                key = new String(Files.readAllBytes(keyPath))
                        .replace("-----BEGIN PUBLIC KEY-----", "")
                        .replace("-----END PUBLIC KEY-----", "")
                        .replaceAll("\\s+", "");
            }else{
                key = new String(Files.readAllBytes(keyPath))
                        .replace("-----BEGIN PRIVATE KEY-----", "")
                        .replace("-----END PRIVATE KEY-----", "")
                        .replaceAll("\\s+", "");
            }

            byte[] keyBytes = Base64.getDecoder().decode(key);

            if (keyType == KeyType.PUBLIC){

                X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
                KeyFactory kf = KeyFactory.getInstance("RSA");
                return (RSAPublicKey) kf.generatePublic(spec);
            }else{

                PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
                KeyFactory kf = KeyFactory.getInstance("RSA");
                return (RSAPrivateKey) kf.generatePrivate(spec);
            }
        } catch (IOException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException(e);
        }
    }

    public String signToken(User data){
        Map<String, Object> json = objectMapper.convertValue(data, new TypeReference<>(){});
        Instant expiresAfter = Instant.now().plus(1, ChronoUnit.DAYS);

        return JWT.create()
            .withExpiresAt(expiresAfter)
            .withIssuedAt(Instant.now())
            .withIssuer("query-system-api")
            .withPayload(json)
            .sign(algorithm);
    }

    public Mono<Boolean> verifyToken(String token) {
        return Mono.fromCallable(() -> {
            try {
                JWT.require(algorithm)
                    .withIssuer("query-system-api")
                    .build()
                    .verify(token);
                return true;
            } catch (Exception e) {
                return false;
            }
        });
    }


    public Mono<User> extractUser(String token) {
        log.debug("Extracting user from token: {}", token);

        return Mono.fromCallable(() -> {
                try {
                    return JWT.decode(token);
                } catch (Exception e) {
                    log.error("Error decoding JWT", e);
                    return null;
                }
            })
            .filter(Objects::nonNull)
            .map(decodedJWT -> {
                try {
                    String payloadBase64 = decodedJWT.getPayload();
                    if (payloadBase64 == null) {
                        throw new RuntimeException("Payload is empty");
                    }

                    String jsonPayload = new String(Base64.getUrlDecoder().decode(payloadBase64));
                    return objectMapper.readValue(jsonPayload, new TypeReference<User>() {});

                } catch (Exception e) {
                    log.error("Failed to deserialize JWT payload", e);
                    throw new RuntimeException("Could not deserialize user payload!", e);

                }
            })
            .onErrorResume(e -> Mono.error(new RuntimeException("Could not extract user from token!", e)));
    }
}
