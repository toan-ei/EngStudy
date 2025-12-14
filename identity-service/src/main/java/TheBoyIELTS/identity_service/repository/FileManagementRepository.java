package TheBoyIELTS.identity_service.repository;

import TheBoyIELTS.identity_service.DTO.Response.FileDataResponse;
import TheBoyIELTS.identity_service.entity.FileManagement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Repository;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Repository
public class FileManagementRepository {
    @Value("${app.file.storage-dir-avatar}")
    private String storageDirAvatar;
    @Value("${app.file.download-prefix}")
    private String urlPrefix;

    public FileDataResponse storage(MultipartFile file) throws IOException {
        Path path = Paths.get(storageDirAvatar);
        String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String name = Objects.isNull(fileExtension)
                ? UUID.randomUUID().toString()
                : UUID.randomUUID().toString() + "." + fileExtension;
        Path filePath = path.resolve(name).normalize().toAbsolutePath();
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return FileDataResponse.builder()
                .name(name)
                .contentType(file.getContentType())
                .size(file.getSize())
                .md5Checksum(DigestUtils.md5DigestAsHex(file.getInputStream()))
                .path(filePath.toString())
                .url(urlPrefix + name)
                .build();
    }

    public Resource read(FileManagement fileManagement) throws IOException {
        byte[] bytes = Files.readAllBytes(Paths.get(fileManagement.getPath()));
        return new ByteArrayResource(bytes);
    }
}
