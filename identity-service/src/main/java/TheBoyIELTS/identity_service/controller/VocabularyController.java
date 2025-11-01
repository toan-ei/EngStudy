package TheBoyIELTS.identity_service.controller;

import TheBoyIELTS.identity_service.DTO.ApiResponse;
import TheBoyIELTS.identity_service.DTO.PageResponse;
import TheBoyIELTS.identity_service.DTO.Request.VocabularyRequest;
import TheBoyIELTS.identity_service.DTO.Request.VocabularyUpdateRequest;
import TheBoyIELTS.identity_service.DTO.Response.VocabularyResponse;
import TheBoyIELTS.identity_service.service.VocabularyService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/vocabylaries")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class VocabularyController {
    VocabularyService vocabularyService;


    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("")
    public ApiResponse<VocabularyResponse> createVocabulary(@RequestBody VocabularyRequest request){
        return ApiResponse.<VocabularyResponse>builder()
                .result(vocabularyService.createVocabulary(request))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/fileExcel")
    public ApiResponse<String> createDataFromExcelFile(@RequestParam("file")MultipartFile file){
        return ApiResponse.<String>builder()
                .result(vocabularyService.getDataFromFileExcelToDatabase(file))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{vocabularyId}")
    public ApiResponse<VocabularyResponse> getVovabulary(@PathVariable String vocabularyId){
        return ApiResponse.<VocabularyResponse>builder()
                .result(vocabularyService.getVovabulary(vocabularyId))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public ApiResponse<List<VocabularyResponse>> getVocabularies(){
        return ApiResponse.<List<VocabularyResponse>>builder()
                .result(vocabularyService.getVocabularies())
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{vocabularyId}")
    public ApiResponse<VocabularyResponse> updateVocabulary(@PathVariable String vocabularyId,
                                                            @RequestBody VocabularyUpdateRequest request)
    {
        return ApiResponse.<VocabularyResponse>builder()
                .result(vocabularyService.updateVocabulary(vocabularyId, request))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{vocabularyId}")
    public ApiResponse<VocabularyResponse> deleteVocabulary(@PathVariable String vocabularyId){
        return ApiResponse.<VocabularyResponse>builder()
                .result(vocabularyService.deleteVocabulary(vocabularyId))
                .build();
    }

    @GetMapping("/level/{level}")
    public ApiResponse<List<VocabularyResponse>> getVocabulariesWithLevel(@PathVariable String level){
        return ApiResponse.<List<VocabularyResponse>>builder()
                .result(vocabularyService.getVocabulariesWithLevel(level))
                .build();
    }

    @PutMapping("/learned")
    public ApiResponse<String> updateVocabulariesLearned(@RequestBody List<VocabularyRequest> requests){
        return null;
    }

}
