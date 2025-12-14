package TheBoyIELTS.identity_service.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(value = "FileManagement")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileManagement {
    @MongoId
    String id;
    String contentType;
    String ownerId;
    long size;
    String md5Checksum;
    String path;
}
