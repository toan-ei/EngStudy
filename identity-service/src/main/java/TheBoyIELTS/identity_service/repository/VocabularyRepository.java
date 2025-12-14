package TheBoyIELTS.identity_service.repository;

import TheBoyIELTS.identity_service.entity.Vocabulary;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VocabularyRepository extends JpaRepository<Vocabulary,String> {
    @Query(value = "(" +
            "  SELECT * FROM vocabulary " +
            "  WHERE is_deleted = false AND is_learned = false AND level = :level " +
            "  ORDER BY RAND() " +
            "  LIMIT 50" +
            ") " +
            "UNION ALL " +
            "(" +
            "  SELECT * FROM vocabulary " +
            "  WHERE is_deleted = false AND is_learned = true AND level = :level " +
            "  ORDER BY wrong_count ASC " +
            "  LIMIT 50" +
            ") " +
            "LIMIT 50",
            nativeQuery = true)
    List<Vocabulary> findByLevel(String level);
    boolean existsByWord(String word);
    List<Vocabulary> findByVocabularyIdIn(List<String> vocabularyId);

}
