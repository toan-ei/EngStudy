package TheBoyIELTS.identity_service.service;

import TheBoyIELTS.identity_service.DTO.Request.AuthenticationRequest;
import TheBoyIELTS.identity_service.DTO.Request.ExchangeTokenRequest;
import TheBoyIELTS.identity_service.DTO.Request.TokenRequest;
import TheBoyIELTS.identity_service.DTO.Response.AuthenticationResponse;
import TheBoyIELTS.identity_service.constant.RoleConstant;
import TheBoyIELTS.identity_service.entity.InvalidToken;
import TheBoyIELTS.identity_service.entity.Profile;
import TheBoyIELTS.identity_service.entity.User;
import TheBoyIELTS.identity_service.repository.InvalidTokenRepository;
import TheBoyIELTS.identity_service.repository.ProfileRepository;
import TheBoyIELTS.identity_service.repository.httpclient.OutboundIdentityClient;
import TheBoyIELTS.identity_service.repository.UserRepository;
import TheBoyIELTS.identity_service.repository.httpclient.OutboundUserClient;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    UserRepository userRepository;
    InvalidTokenRepository invalidTokenRepository;
    OutboundIdentityClient outboundIdentityClient;
    OutboundUserClient outboundUserClient;
    ProfileRepository profileRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    private long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    private long REFRESHABLE_DURATION;

    @NonFinal
    @Value("${outbound.clientId}")
    private String CLIENT_ID;

    @NonFinal
    @Value("${outbound.clientSecret}")
    private String CLIENT_SECRET;

    @NonFinal
    @Value("${outbound.redirectUri}")
    private String REDIRECT_URI;

    @NonFinal
    private String GRANT_TYPE = "authorization_code";


    public AuthenticationResponse authentication(AuthenticationRequest request){
        User user = userRepository.findByGmail(request.getGmail())
                .orElseThrow(() -> new RuntimeException("user not found"));
        log.info("user: {}", user.getUserId());
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(!authenticated) throw new RuntimeException("Unauthenticated");
        String token = generateToken(user);
        return AuthenticationResponse.builder()
                .userId(user.getUserId())
                .token(token)
                .build();
    }

    public AuthenticationResponse checkToken(TokenRequest request){
        String token = request.getToken();
        boolean isValid = true;
        try{
            verify(token, false);
        }
        catch (RuntimeException e){
            isValid = false;
        }
        return AuthenticationResponse.builder()
                .isValid(isValid)
                .build();
    }

    public String logout(TokenRequest request){
        try {
            var signToken = verify(request.getToken(), true);
            String jwtid = signToken.getJWTClaimsSet().getJWTID();
            InvalidToken invalidToken = InvalidToken.builder().tokenId(jwtid).build();
            invalidTokenRepository.save(invalidToken);
            return "you has been logout success";
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    public AuthenticationResponse refreshToken(TokenRequest request) throws ParseException {
        String token = request.getToken();
        SignedJWT signedJWT = verify(token, true);
        String jwtid = signedJWT.getJWTClaimsSet().getJWTID();
        String userId = signedJWT.getJWTClaimsSet().getSubject();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("user not found"));
        InvalidToken invalidToken = InvalidToken.builder()
                .tokenId(jwtid)
                .build();
        invalidTokenRepository.save(invalidToken);
        String newToken = generateToken(user);
        return AuthenticationResponse.builder()
                .token(newToken)
                .isValid(true)
                .build();
    }

    public AuthenticationResponse outboundAuthenticate(String code){
        var response = outboundIdentityClient.exchangeToken(ExchangeTokenRequest.builder()
                        .code(code)
                        .clientId(CLIENT_ID)
                        .clientSecret(CLIENT_SECRET)
                        .redirectUri(REDIRECT_URI)
                        .grantType(GRANT_TYPE)
                .build());
        log.info("Token response {}", response);

        var userInfo = outboundUserClient.getUserInfo("json", response.getAccessToken());
        log.info("user infor {}", userInfo);
        
        boolean exists = userRepository.existsByGmail(userInfo.getEmail());

        if(!exists){
            User user = userRepository.save(User.builder()
                    .gmail(userInfo.getEmail())
                    .roleName(RoleConstant.ROLE_USER)
                    .build());
            Profile profile = profileRepository.save(Profile.builder()
                    .userId(user.getUserId())
                    .fullName(userInfo.getName())
                    .build());
        }

        Optional<User> byGmail = userRepository.findByGmail(userInfo.getEmail());
        User user = byGmail.get();

        String token = generateToken(user);
        return AuthenticationResponse.builder()
                .userId(user.getUserId())
                .token(token)
                .build();
    }

    private SignedJWT verify(String token, boolean isRefresh) {
        SignedJWT signedJWT;
        try {
            JWSVerifier jwsVerifier = new MACVerifier(SIGNER_KEY.getBytes());
            signedJWT = SignedJWT.parse(token);
            Date expiryTime = (isRefresh)
                    ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                    .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.HOURS).toEpochMilli())
                    : signedJWT.getJWTClaimsSet().getExpirationTime();

            boolean verify = signedJWT.verify(jwsVerifier);
            if (!verify || expiryTime.before(new Date()))
                throw new RuntimeException("error when verify");
            if (invalidTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
                throw new RuntimeException("token have in table invalid token");


        } catch (JOSEException | ParseException e) {
            throw new RuntimeException(e);
        }
        return signedJWT;
    }

    private String generateToken(User user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUserId())
                .issuer("The Boy IELTS")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.HOURS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("role", user.getRoleName())
                .build();
        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }
}
