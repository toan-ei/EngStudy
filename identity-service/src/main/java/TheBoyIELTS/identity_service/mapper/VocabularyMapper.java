package TheBoyIELTS.identity_service.mapper;

import TheBoyIELTS.identity_service.DTO.Request.VocabularyRequest;
import TheBoyIELTS.identity_service.DTO.Request.VocabularyUpdateRequest;
import TheBoyIELTS.identity_service.DTO.Response.MeaningResponse;
import TheBoyIELTS.identity_service.DTO.Response.VocabularyResponse;
import TheBoyIELTS.identity_service.entity.Meaning;
import TheBoyIELTS.identity_service.entity.Vocabulary;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "Spring")
public interface VocabularyMapper {
    Vocabulary toVocabulary(VocabularyRequest vocabularyRequest);
    VocabularyResponse toVocabularyResponse(Vocabulary vocabulary);
    void updateVocabulary(@MappingTarget Vocabulary vocabulary, VocabularyUpdateRequest vocabularyUpdateRequest);
}
