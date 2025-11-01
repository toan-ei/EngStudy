package TheBoyIELTS.identity_service.DTO.Request;

import TheBoyIELTS.identity_service.entity.Meaning;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VocabularyRequest {
    String word;
    String level;
    List<MeaningRequest> meanings;
}
