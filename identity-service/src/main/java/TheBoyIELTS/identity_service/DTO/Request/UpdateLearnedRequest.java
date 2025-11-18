package TheBoyIELTS.identity_service.DTO.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateLearnedRequest {
    String vocabularyId;
    int wrongCount;
    boolean isLearned;
}
