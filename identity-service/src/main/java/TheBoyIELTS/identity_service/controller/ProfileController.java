package TheBoyIELTS.identity_service.controller;

import TheBoyIELTS.identity_service.DTO.ApiResponse;
import TheBoyIELTS.identity_service.DTO.Request.ProfileUpdateRequest;
import TheBoyIELTS.identity_service.DTO.Response.ProfileResponse;
import TheBoyIELTS.identity_service.service.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {
    ProfileService profileService;

    @PreAuthorize("hasAuthority('ADMIN') or @profileSecurity.isOwner(#profileId, authentication.name)")
    @GetMapping("/withProfileId/{profileId}")
    public ApiResponse<ProfileResponse> getProfile(@PathVariable String profileId){
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.getProfile(profileId))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN') or #userId == authentication.name")
    @GetMapping("/withUserId/{userId}")
    public ApiResponse<ProfileResponse> getProfileFromUserId(@PathVariable String userId){
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.getProfileFromUserId(userId))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public ApiResponse<List<ProfileResponse>> getAllProfile(){
        return ApiResponse.<List<ProfileResponse>>builder()
                .result(profileService.getAllProfile())
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN') or @profileSecurity.isOwner(#profileId, authentication.name)")
    @PutMapping("/{profileId}")
    public ApiResponse<ProfileResponse> updateProfile(@PathVariable String profileId,
                                                      @RequestBody ProfileUpdateRequest request){
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.updateProfile(profileId, request))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN') or @profileSecurity.isOwner(#profileId, authentication.name)")
    @DeleteMapping("/{profileId}")
    public ApiResponse<ProfileResponse> deleteProfile(@PathVariable String profileId){
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.deleteProfile(profileId))
                .build();
    }


}
