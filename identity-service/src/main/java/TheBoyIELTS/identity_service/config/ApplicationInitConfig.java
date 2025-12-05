package TheBoyIELTS.identity_service.config;

import TheBoyIELTS.identity_service.entity.User;
import TheBoyIELTS.identity_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import static TheBoyIELTS.identity_service.constant.RoleConstant.ROLE_ADMIN;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository){
        return args -> {
          if(userRepository.findByGmail(ROLE_ADMIN).isEmpty()){
              User user = User.builder()
                      .gmail("admin")
                      .password(passwordEncoder.encode("admin"))
                      .roleName(ROLE_ADMIN)
                      .build();
              userRepository.save(user);
          }
        };
    }
}
