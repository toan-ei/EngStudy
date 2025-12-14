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
public class FileDownloadResponse {
    String contentType;
    Resource resource;
}
