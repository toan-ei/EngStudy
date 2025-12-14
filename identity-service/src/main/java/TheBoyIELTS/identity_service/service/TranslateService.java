package TheBoyIELTS.identity_service.service;

import TheBoyIELTS.identity_service.DTO.PageResponse;
import TheBoyIELTS.identity_service.DTO.Request.TranslateRequest;
import TheBoyIELTS.identity_service.DTO.Response.TranslateResponse;
import TheBoyIELTS.identity_service.entity.Translate;
import TheBoyIELTS.identity_service.mapper.TranslateMapper;
import TheBoyIELTS.identity_service.repository.TranslateRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TranslateService {
    TranslateRepository translateRepository;
    TranslateMapper translateMapper;

    public TranslateResponse createTranslate(TranslateRequest request){
        Translate translate = translateMapper.toTranslate(request);
        translate.setDeleted(false);
        Translate save = translateRepository.save(translate);
        return translateMapper.toTranslateResponse(save);
    }

    public List<TranslateResponse> getAllTranslate(){
        return translateRepository.findAll()
                .stream().map(translateMapper::toTranslateResponse).collect(Collectors.toList());
    }

    public TranslateResponse getTranslate(String level, String language, String nameLesson){
        Optional<Translate> bylevelAndLanguageAndNameLesson = translateRepository
                .findByLevelAndLanguageAndNameLesson(level, language, nameLesson);
        Translate translate = bylevelAndLanguageAndNameLesson.get();
        return translateMapper.toTranslateResponse(translate);
    }

    public TranslateResponse getTranslateViaTranslateId(String translateId){
        Optional<Translate> byId = translateRepository.findById(translateId);
        Translate translate = byId.get();
        return translateMapper.toTranslateResponse(translate);
    }

    public PageResponse<TranslateResponse> getTranslatesbyLevelAndLanguage(String level, String language,int page,int size){
        Sort sort = Sort.by("nameLesson").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<Translate> data = translateRepository
                .findAllByLevelAndLanguage(level, language, pageable);

        List<Translate> content = data.getContent();

        return PageResponse.<TranslateResponse>builder()
                .currentPage(page)
                .totalPage(data.getTotalPages())
                .pageSize(data.getSize())
                .totalElement(data.getTotalElements())
                .data(content.stream().map(translateMapper::toTranslateResponse).toList())
                .build();
    }

    public String deleteTranslate(String translateId){
        translateRepository.deleteById(translateId);
        return "delete translate successfully";
    }

    public String deleteAllTranslate(){
        translateRepository.deleteAll();
        return "delete all translate successfully";
    }
}
