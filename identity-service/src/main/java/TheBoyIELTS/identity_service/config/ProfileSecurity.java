package TheBoyIELTS.identity_service.config;

import TheBoyIELTS.identity_service.entity.Profile;
import TheBoyIELTS.identity_service.repository.ProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@Component("profileSecurity")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileSecurity {
    ProfileRepository profileRepository;

    public boolean isOwner(String profileId, String userId){
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("profile not found"));
        if(profile.getUserId().equals(userId)){
            return true;
        }
        return false;
    }
}
