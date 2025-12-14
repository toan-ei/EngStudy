package TheBoyIELTS.identity_service.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TranslateResponse {
    String translateId;
    String level;
    String paragraph;
    String nameLesson;
    String language;
    boolean isDeleted;
}
