package TheBoyIELTS.identity_service.service;

import TheBoyIELTS.identity_service.DTO.PageResponse;
import TheBoyIELTS.identity_service.DTO.Request.ProfileUpdateRequest;
import TheBoyIELTS.identity_service.DTO.Response.ProfileResponse;
import TheBoyIELTS.identity_service.entity.Profile;
import TheBoyIELTS.identity_service.entity.User;
import TheBoyIELTS.identity_service.mapper.ProfileMapper;
import TheBoyIELTS.identity_service.repository.ProfileRepository;
import TheBoyIELTS.identity_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileService {
    ProfileRepository profileRepository;
    ProfileMapper profileMapper;
    UserRepository userRepository;

    public ProfileResponse getProfile(String profileId){
         Profile profile = profileRepository.findById(profileId)
                 .orElseThrow(() -> new RuntimeException("profile not found"));
         return profileMapper.toProfileResponse(profile);
    }

    public PageResponse<ProfileResponse> getAllProfile(int page, int size){
        Sort sort = Sort.by("fullName").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<Profile> all = profileRepository.findAllByIsDeleted(false, pageable);
        return PageResponse.<ProfileResponse>builder()
                .currentPage(page)
                .totalPage(all.getTotalPages())
                .totalElement(all.getTotalElements())
                .pageSize(all.getSize())
                .data(all.stream().map(profileMapper::toProfileResponse).toList())
                .build();
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
        Optional<User> byId = userRepository.findById(profile.getUserId());
        User user = byId.get();
        user.setDeleted(true);
        userRepository.save(user);
        return profileMapper.toProfileResponse(profileRepository.save(profile));
    }

    public ProfileResponse getProfileFromUserId(String userId){
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("profile not found"));
        return profileMapper.toProfileResponse(profile);
    }
}
