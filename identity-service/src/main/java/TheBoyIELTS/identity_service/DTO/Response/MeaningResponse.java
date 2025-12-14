package TheBoyIELTS.identity_service.DTO.Response;

import TheBoyIELTS.identity_service.entity.Vocabulary;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MeaningResponse {
    String meaningId;
    String meaning;
    boolean isDeleted;
}
