package TheBoyIELTS.identity_service.service;

import TheBoyIELTS.identity_service.DTO.Response.FileDataResponse;
import TheBoyIELTS.identity_service.DTO.Response.FileDownloadResponse;
import TheBoyIELTS.identity_service.DTO.Response.FileResponse;
import TheBoyIELTS.identity_service.entity.FileManagement;
import TheBoyIELTS.identity_service.mapper.FileMapper;
import TheBoyIELTS.identity_service.repository.FileManagementRepository;
import TheBoyIELTS.identity_service.repository.FileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileService {
    FileRepository fileRepository;
    FileManagementRepository fileManagementRepository;
    FileMapper fileMapper;

    public FileResponse uploadFiles(MultipartFile file) throws IOException {
        FileDataResponse storage = fileManagementRepository.storage(file);
        FileManagement fileManagement = fileMapper.toFileManagement(storage);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        fileManagement.setOwnerId(userId);

        fileRepository.save(fileManagement);
        return FileResponse.builder()
                .url(storage.getUrl())
                .build();
    }

    public FileDownloadResponse downloadMedia(String name) throws IOException {
        FileManagement fileManagement = fileRepository.findById(name)
                .orElseThrow(() -> new RuntimeException("file not found"));

        Resource read = fileManagementRepository.read(fileManagement);
        return FileDownloadResponse.builder()
                .resource(read)
                .contentType(fileManagement.getContentType())
                .build();
    }
}
