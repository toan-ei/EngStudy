package TheBoyIELTS.identity_service.repository;

import TheBoyIELTS.identity_service.entity.FileManagement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends MongoRepository<FileManagement, String> {
}
