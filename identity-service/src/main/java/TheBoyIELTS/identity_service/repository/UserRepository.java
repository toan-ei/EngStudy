package TheBoyIELTS.identity_service.repository;

import TheBoyIELTS.identity_service.entity.Translate;
import TheBoyIELTS.identity_service.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByGmail(String gmail);
    boolean existsByGmail(String gmail);
}
