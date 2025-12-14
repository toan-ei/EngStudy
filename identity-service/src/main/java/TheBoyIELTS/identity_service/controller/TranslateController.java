package TheBoyIELTS.identity_service.controller;

import TheBoyIELTS.identity_service.DTO.ApiResponse;
import TheBoyIELTS.identity_service.DTO.PageResponse;
import TheBoyIELTS.identity_service.DTO.Request.TranslateRequest;
import TheBoyIELTS.identity_service.DTO.Response.TranslateResponse;
import TheBoyIELTS.identity_service.service.TranslateService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/translate")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TranslateController {
    TranslateService translateService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/add")
    public ApiResponse<TranslateResponse> createTranslate(@RequestBody TranslateRequest request){
        return ApiResponse.<TranslateResponse>builder()
                .result(translateService.createTranslate(request))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/translate")
    public ApiResponse<List<TranslateResponse>> getAllTranslate(){
        return ApiResponse.<List<TranslateResponse>>builder()
                .result(translateService.getAllTranslate())
                .build();
    }

    @GetMapping("translateViaTranslateId/{translateId}")
    public ApiResponse<TranslateResponse> getTranslateViaTranslateId(@PathVariable String translateId){
        return ApiResponse.<TranslateResponse>builder()
                .result(translateService.getTranslateViaTranslateId(translateId))
                .build();
    }

    @GetMapping("/translate/{level}/{language}/{nameLesson}")
    public ApiResponse<TranslateResponse> getTranslate(
            @PathVariable String level,
            @PathVariable String language,
            @PathVariable String nameLesson
    ){
        return ApiResponse.<TranslateResponse>builder()
                .result(translateService.getTranslate(level, language, nameLesson))
                .build();
    }

    @GetMapping("/ByLevelAndLanguage/{level}/{language}")
    public ApiResponse<PageResponse<TranslateResponse>> getTranslatesbyLevelAndLanguage(
            @PathVariable String level,
            @PathVariable String language,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "16") int size
    ){
        return ApiResponse.<PageResponse<TranslateResponse>>builder()
                .result(translateService.getTranslatesbyLevelAndLanguage(level, language, page, size))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/delete/{translateId}")
    public ApiResponse<String> deleteTranslate(@PathVariable String translateId){
        return ApiResponse.<String>builder()
                .result(translateService.deleteTranslate(translateId))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/deleteAll")
    public ApiResponse<String> deleteAllTranslate(){
        return ApiResponse.<String>builder()
                .result(translateService.deleteAllTranslate())
                .build();
    }


}
