package TheBoyIELTS.identity_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Vocabulary {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String vocabularyId;
    String word;
    String level;
    boolean isLearned;
    int wrongCount;
    boolean isDeleted;

    @OneToMany(mappedBy = "vocabulary", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Meaning> meanings = new HashSet<>();
}
