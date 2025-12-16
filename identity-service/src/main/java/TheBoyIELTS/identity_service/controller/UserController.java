package TheBoyIELTS.identity_service.controller;

import TheBoyIELTS.identity_service.DTO.ApiResponse;
import TheBoyIELTS.identity_service.DTO.Request.UserRequest;
import TheBoyIELTS.identity_service.DTO.Response.UserResponse;
import TheBoyIELTS.identity_service.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping("")
    public ApiResponse<UserResponse> createUser(@RequestBody UserRequest userRequest){
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(userRequest))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN') or #userId == authentication.name")
    @GetMapping("/{userId}")
    public ApiResponse<UserResponse> getUser(@PathVariable String userId){
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public ApiResponse<List<UserResponse>> getUsers(){
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN') or #userId == authentication.name")
    @PutMapping("/{userId}")
    public ApiResponse<UserResponse> updateUser(@PathVariable String userId,@RequestBody UserRequest userRequest){
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, userRequest))
                .build();
    }

}
