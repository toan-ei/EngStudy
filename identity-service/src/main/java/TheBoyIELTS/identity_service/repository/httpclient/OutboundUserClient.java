package TheBoyIELTS.identity_service.repository.httpclient;

import TheBoyIELTS.identity_service.DTO.Response.ExchangeTokenResponse;
import TheBoyIELTS.identity_service.DTO.Response.OutboundUserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "outbound-user-client", url = "https://www.googleapis.com")
public interface OutboundUserClient {
    @GetMapping(value = "/oauth2/v1/userinfo")
    OutboundUserResponse getUserInfo(@RequestParam("alt") String alt, @RequestParam("access_token") String accessToken);
}
