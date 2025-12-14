package TheBoyIELTS.identity_service.service;

import TheBoyIELTS.identity_service.DTO.Request.MeaningRequest;
import TheBoyIELTS.identity_service.DTO.Response.MeaningResponse;
import TheBoyIELTS.identity_service.DTO.Response.VocabularyResponse;
import TheBoyIELTS.identity_service.entity.Meaning;
import TheBoyIELTS.identity_service.mapper.MeaningMapper;
import TheBoyIELTS.identity_service.repository.MeaningRepository;
import TheBoyIELTS.identity_service.repository.VocabularyRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MeaningService {
    MeaningRepository meaningRepository;
    MeaningMapper meaningMapper;

    public MeaningResponse updateMeaning(String meaningId, MeaningRequest request){
        Meaning meaning = meaningRepository.findById(meaningId)
                .orElseThrow(() -> new RuntimeException("meaning not found"));
        meaning.setMeaning(request.getMeaning());
        return meaningMapper.toMeaningResponse(meaningRepository.save(meaning));
    }

    public MeaningResponse deleteMeaning(String meaningId){
        Meaning meaning = meaningRepository.findById(meaningId)
                .orElseThrow(() -> new RuntimeException("meaning not found"));
        meaning.setDeleted(true);
        return meaningMapper.toMeaningResponse(meaningRepository.save(meaning));
    }

}
