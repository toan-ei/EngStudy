package TheBoyIELTS.identity_service.config;

import TheBoyIELTS.identity_service.DTO.Request.TokenRequest;
import TheBoyIELTS.identity_service.DTO.Response.AuthenticationResponse;
import TheBoyIELTS.identity_service.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.util.Objects;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DecoderConfig implements JwtDecoder {
    AuthenticationService authenticationService;
    public DecoderConfig(AuthenticationService authenticationService){
        this.authenticationService = authenticationService;
    }

    @NonFinal
    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;

    @Override
    public Jwt decode(String token) throws JwtException {
        TokenRequest tokenRequest = TokenRequest.builder()
                .token(token)
                .build();
        AuthenticationResponse authenticationResponse = authenticationService.checkToken(tokenRequest);
        boolean isvalid = authenticationResponse.isValid();
        if(!isvalid) throw new JwtException("Token invalid");
        NimbusJwtDecoder nimbusJwtDecoder = null;
        if(Objects.isNull(nimbusJwtDecoder)){
            SecretKeySpec spec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(spec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }
        return nimbusJwtDecoder.decode(token);
    }
}
