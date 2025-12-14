package TheBoyIELTS.identity_service.service;

import TheBoyIELTS.identity_service.DTO.Request.TranslatedRequest;
import TheBoyIELTS.identity_service.DTO.Response.TranslatedResponse;
import TheBoyIELTS.identity_service.entity.Translated;
import TheBoyIELTS.identity_service.repository.TranslatedRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TranslatedService {
    TranslatedRepository translatedRepository;

    public TranslatedResponse createTranslated(TranslatedRequest request){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        Translated translated = Translated.builder()
                .translateId(request.getTranslateId())
                .userId(userId)
                .isDeleted(false)
                .build();
        Translated save = translatedRepository.save(translated);
        return TranslatedResponse.builder()
                .translatedId(save.getTranslatedId())
                .translateId(save.getTranslateId())
                .userId(save.getUserId())
                .isDeleted(save.isDeleted())
                .build();
    }
}
