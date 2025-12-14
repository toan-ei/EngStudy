package TheBoyIELTS.identity_service.repository;

import TheBoyIELTS.identity_service.DTO.Response.TranslateResponse;
import TheBoyIELTS.identity_service.entity.Translate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TranslateRepository extends JpaRepository<Translate, String> {
    Optional<Translate> findByLevelAndLanguageAndNameLesson(String level, String language, String nameLesson);
    Page<Translate> findAllByLevelAndLanguage(String level, String language, Pageable pageable);
}
