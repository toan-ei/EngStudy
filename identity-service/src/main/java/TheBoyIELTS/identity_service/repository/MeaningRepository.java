package TheBoyIELTS.identity_service.repository;

import TheBoyIELTS.identity_service.entity.Meaning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MeaningRepository extends JpaRepository<Meaning, String> {
}
