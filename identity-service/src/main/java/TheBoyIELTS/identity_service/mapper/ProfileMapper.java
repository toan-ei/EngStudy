package TheBoyIELTS.identity_service.mapper;

import TheBoyIELTS.identity_service.DTO.Request.ProfileRequest;
import TheBoyIELTS.identity_service.DTO.Request.ProfileUpdateRequest;
import TheBoyIELTS.identity_service.DTO.Response.ProfileResponse;
import TheBoyIELTS.identity_service.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    Profile toProfile(ProfileRequest profileRequest);
    ProfileResponse toProfileResponse(Profile profile);
    void updateProfile(@MappingTarget Profile profile, ProfileUpdateRequest profileUpdateRequest);
}
