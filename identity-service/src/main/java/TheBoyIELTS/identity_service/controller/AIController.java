package TheBoyIELTS.identity_service.controller;

import TheBoyIELTS.identity_service.DTO.ApiResponse;
import TheBoyIELTS.identity_service.DTO.Request.AIRequest;
import TheBoyIELTS.identity_service.DTO.Request.SuggestRequest;
import TheBoyIELTS.identity_service.DTO.Response.AIResponse;
import TheBoyIELTS.identity_service.DTO.Response.SuggestResponse;
import TheBoyIELTS.identity_service.service.AIService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/AI")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AIController {
    AIService aiService;

    @PostMapping("/fixParagraphWithEnglish")
    public ApiResponse<AIResponse> fixParagraphWithEnglish(@RequestBody AIRequest request){
        return ApiResponse.<AIResponse>builder()
                .result(aiService.fixParagraph(request, true))
                .build();
    }
    @PostMapping("/fixParagraphWithVietnamese")
    public ApiResponse<AIResponse> fixParagraphWithVietnamese(@RequestBody AIRequest request){
        return ApiResponse.<AIResponse>builder()
                .result(aiService.fixParagraph(request, false))
                .build();
    }

    @PostMapping("/suggest")
    public ApiResponse<SuggestResponse> suggestInVocabulary(@RequestBody SuggestRequest request){
        return ApiResponse.<SuggestResponse>builder()
                .result(aiService.suggestInVocabulary(request))
                .build();
    }

}
