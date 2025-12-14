package TheBoyIELTS.identity_service.mapper;

import TheBoyIELTS.identity_service.DTO.Response.FileDataResponse;
import TheBoyIELTS.identity_service.entity.FileManagement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FileMapper {
    @Mapping(source = "name", target = "id")
    FileManagement toFileManagement(FileDataResponse fileDataResponse);
}
