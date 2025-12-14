package TheBoyIELTS.identity_service.mapper;

import TheBoyIELTS.identity_service.DTO.Request.MeaningRequest;
import TheBoyIELTS.identity_service.DTO.Response.MeaningResponse;
import TheBoyIELTS.identity_service.entity.Meaning;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "Spring")
public interface MeaningMapper {
    Meaning toMeaning(MeaningRequest meaningRequest);
    MeaningResponse toMeaningResponse(Meaning meaning);
    void updateMeaning(@MappingTarget Meaning meaning, MeaningRequest meaningRequest);
}
