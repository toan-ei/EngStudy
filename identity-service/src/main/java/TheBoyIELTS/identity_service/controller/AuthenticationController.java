package TheBoyIELTS.identity_service.controller;

import TheBoyIELTS.identity_service.DTO.ApiResponse;
import TheBoyIELTS.identity_service.DTO.Request.AuthenticationRequest;
import TheBoyIELTS.identity_service.DTO.Request.TokenRequest;
import TheBoyIELTS.identity_service.DTO.Response.AuthenticationResponse;
import TheBoyIELTS.identity_service.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.antlr.v4.runtime.Token;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/authentication")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;


    @PostMapping("/outbound/authentication")
    public ApiResponse<AuthenticationResponse> outboundAuthenticate(
            @RequestParam("code") String code
    ){
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.outboundAuthenticate(code))
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> authentication(@RequestBody AuthenticationRequest request){
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.authentication(request))
                .build();
    }

    @PostMapping("/validCheck")
    public ApiResponse<AuthenticationResponse> checkToken(@RequestBody TokenRequest request){
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.checkToken(request))
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(@RequestBody TokenRequest request){
        return ApiResponse.<String>builder()
                .result(authenticationService.logout(request))
                .build();
    }

    @PostMapping("/refreshToken")
    public ApiResponse<AuthenticationResponse> refreshToken(@RequestBody TokenRequest request) throws ParseException {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.refreshToken(request))
                .build();
    }
}
