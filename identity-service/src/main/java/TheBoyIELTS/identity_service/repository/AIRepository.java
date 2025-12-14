package TheBoyIELTS.identity_service.repository;

import TheBoyIELTS.identity_service.entity.ReplyFromAI;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AIRepository extends MongoRepository<ReplyFromAI, String> {

}
