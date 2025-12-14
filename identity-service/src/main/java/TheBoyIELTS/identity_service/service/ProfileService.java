package TheBoyIELTS.identity_service.service;

import TheBoyIELTS.identity_service.DTO.Request.ProfileUpdateRequest;
import TheBoyIELTS.identity_service.DTO.Response.ProfileResponse;
import TheBoyIELTS.identity_service.entity.Profile;
import TheBoyIELTS.identity_service.mapper.ProfileMapper;
import TheBoyIELTS.identity_service.repository.ProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileService {
    ProfileRepository profileRepository;
    ProfileMapper profileMapper;

    public ProfileResponse getProfile(String profileId){
         Profile profile = profileRepository.findById(profileId)
                 .orElseThrow(() -> new RuntimeException("profile not found"));
         return profileMapper.toProfileResponse(profile);
    }

    public List<ProfileResponse> getAllProfile(){
        return profileRepository.findAll().stream().map(profileMapper::toProfileResponse).collect(Collectors.toList());
    }

    public ProfileResponse updateProfile(String profileId, ProfileUpdateRequest request){
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("profile not found"));
        profileMapper.updateProfile(profile, request);
        return profileMapper.toProfileResponse(profileRepository.save(profile));
    }

    public ProfileResponse deleteProfile(String profileId){
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("profile not found"));
        profile.setDeleted(true);
        return profileMapper.toProfileResponse(profileRepository.save(profile));
    }

    public ProfileResponse getProfileFromUserId(String userId){
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("profile not found"));
        return profileMapper.toProfileResponse(profile);
    }
}
