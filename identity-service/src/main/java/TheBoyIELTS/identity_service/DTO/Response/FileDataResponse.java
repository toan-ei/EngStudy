package TheBoyIELTS.identity_service.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileDataResponse {
    String name;
    String contentType;
    long size;
    String md5Checksum;
    String path;
    String url;
}
