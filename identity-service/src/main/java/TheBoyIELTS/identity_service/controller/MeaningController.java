package TheBoyIELTS.identity_service.controller;

import TheBoyIELTS.identity_service.DTO.ApiResponse;
import TheBoyIELTS.identity_service.DTO.Request.MeaningRequest;
import TheBoyIELTS.identity_service.DTO.Response.MeaningResponse;
import TheBoyIELTS.identity_service.service.MeaningService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("meaning")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MeaningController {
    MeaningService meaningService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{meaningId}")
    public ApiResponse<MeaningResponse> updateMeaning(@PathVariable String meaningId,
                                                      @RequestBody MeaningRequest request)
    {
        return ApiResponse.<MeaningResponse>builder()
                .result(meaningService.updateMeaning(meaningId, request))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{meaningId}")
    public ApiResponse<MeaningResponse> deleteMeaning(@PathVariable String meaningId){
        return ApiResponse.<MeaningResponse>builder()
                .result(meaningService.deleteMeaning(meaningId))
                .build();
    }


}
