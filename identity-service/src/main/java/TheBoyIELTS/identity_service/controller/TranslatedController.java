package TheBoyIELTS.identity_service.controller;

import TheBoyIELTS.identity_service.DTO.ApiResponse;
import TheBoyIELTS.identity_service.DTO.Request.TranslatedRequest;
import TheBoyIELTS.identity_service.DTO.Response.TranslatedResponse;
import TheBoyIELTS.identity_service.service.TranslatedService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/translated")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TranslatedController {
    TranslatedService translatedService;

    @PostMapping("")
    public ApiResponse<TranslatedResponse> createTranslated(@RequestBody TranslatedRequest request){
        return ApiResponse.<TranslatedResponse>builder()
                .result(translatedService.createTranslated(request))
                .build();
    }


}
