package TheBoyIELTS.identity_service.service;

import TheBoyIELTS.identity_service.DTO.Request.UserRequest;
import TheBoyIELTS.identity_service.DTO.Response.UserResponse;
import TheBoyIELTS.identity_service.entity.Profile;
import TheBoyIELTS.identity_service.entity.User;
import TheBoyIELTS.identity_service.mapper.UserMapper;
import TheBoyIELTS.identity_service.repository.ProfileRepository;
import TheBoyIELTS.identity_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import static TheBoyIELTS.identity_service.constant.RoleConstant.ROLE_USER;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    ProfileRepository profileRepository;

    public UserResponse createUser(UserRequest userRequest){
        boolean gmailAlreadyExists = userRepository.existsByGmail(userRequest.getGmail());
        if(gmailAlreadyExists) throw new RuntimeException("gmail already exists");
        User user = userMapper.toUser(userRequest);
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setRoleName(ROLE_USER);
        user.setDeleted(false);
        User saveUser = userRepository.save(user);
        Profile profile = Profile.builder()
                .userId(user.getUserId())
                .isDeleted(false)
                .build();
        profileRepository.save(profile);
        return userMapper.toUserResponse(saveUser);
    }


    public UserResponse getUser(String userId){
        return userMapper.toUserResponse(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("error when get user")));
    }



    public List<UserResponse> getUsers(){
        return userRepository.findAll().stream().map(userMapper::toUserResponse).collect(Collectors.toList());
    }

    public UserResponse updateUser(String userId, UserRequest userRequest){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("error when get user"));
        userMapper.userUpdate(user, userRequest);
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        User saveUser = userRepository.save(user);
        return userMapper.toUserResponse(saveUser);
    }

}
