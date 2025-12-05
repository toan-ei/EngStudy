package TheBoyIELTS.identity_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Meaning {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String meaningId;
    String meaning;
    boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "vocabulary_id")
    Vocabulary vocabulary;
}
