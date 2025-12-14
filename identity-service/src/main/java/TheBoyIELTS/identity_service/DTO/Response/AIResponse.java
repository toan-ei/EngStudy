package TheBoyIELTS.identity_service.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AIResponse {
    String userId;
    String message;
    double cost;
    String typeTranslate;
}
