package TheBoyIELTS.identity_service.DTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DataFromExcelFile {
    String word;
    String level;
    boolean isLearned;
    int wrongCount;
    boolean isDeleted;
    List<String> meanings;
}
