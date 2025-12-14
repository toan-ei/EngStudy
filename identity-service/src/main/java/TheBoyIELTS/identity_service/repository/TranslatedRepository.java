package TheBoyIELTS.identity_service.repository;

import TheBoyIELTS.identity_service.entity.Translated;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TranslatedRepository extends JpaRepository<Translated, String> {
}
