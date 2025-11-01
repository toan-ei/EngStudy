package TheBoyIELTS.identity_service.DTO.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileRequest {
    String userId;
    String fullName;
    String numberPhone;
    String avatar;
    String address;
    String dob;
}
