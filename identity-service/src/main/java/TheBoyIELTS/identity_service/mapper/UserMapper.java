package TheBoyIELTS.identity_service.mapper;

import TheBoyIELTS.identity_service.DTO.Request.UserRequest;
import TheBoyIELTS.identity_service.DTO.Response.UserResponse;
import TheBoyIELTS.identity_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "Spring")
public interface UserMapper {
    User toUser(UserRequest userRequest);
    UserResponse toUserResponse(User user);
    void userUpdate(@MappingTarget User user, UserRequest userRequest);
}
