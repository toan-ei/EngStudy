package TheBoyIELTS.identity_service.mapper;

import TheBoyIELTS.identity_service.DTO.Request.TranslateRequest;
import TheBoyIELTS.identity_service.DTO.Response.TranslateResponse;
import TheBoyIELTS.identity_service.entity.Translate;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TranslateMapper {
    Translate toTranslate(TranslateRequest translateRequest);
    TranslateResponse toTranslateResponse(Translate translate);

}
