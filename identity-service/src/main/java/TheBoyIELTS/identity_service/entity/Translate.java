package TheBoyIELTS.identity_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Translate {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String translateId;
    String level;
    @Column(columnDefinition = "TEXT")
    String paragraph;
    String nameLesson;
    String language;
    boolean isDeleted;
}
