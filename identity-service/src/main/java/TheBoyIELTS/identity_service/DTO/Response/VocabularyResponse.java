package TheBoyIELTS.identity_service.DTO.Response;

import TheBoyIELTS.identity_service.DTO.Request.MeaningRequest;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VocabularyResponse {
    String vocabularyId;
    String word;
    String level;
    boolean isLearned;
    int wrongCount;
    boolean isDeleted;
    Set<MeaningResponse> meanings;
}
