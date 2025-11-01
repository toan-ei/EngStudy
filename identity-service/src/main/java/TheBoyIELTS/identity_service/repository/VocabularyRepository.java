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
    @Query(value = """
        SELECT * FROM vocabulary v
        WHERE v.is_deleted = 0
          AND v.is_learned = 0
        ORDER BY RAND()
        LIMIT 50
        """, nativeQuery = true)
    List<Vocabulary> findByLevel(String level);
    boolean existsByWord(String word);

}
