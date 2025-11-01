package TheBoyIELTS.identity_service.service;

import TheBoyIELTS.identity_service.DTO.DataFromExcelFile;
import TheBoyIELTS.identity_service.DTO.PageResponse;
import TheBoyIELTS.identity_service.DTO.Request.VocabularyRequest;
import TheBoyIELTS.identity_service.DTO.Request.VocabularyUpdateRequest;
import TheBoyIELTS.identity_service.DTO.Response.VocabularyResponse;
import TheBoyIELTS.identity_service.entity.Meaning;
import TheBoyIELTS.identity_service.entity.Vocabulary;
import TheBoyIELTS.identity_service.mapper.VocabularyMapper;
import TheBoyIELTS.identity_service.repository.MeaningRepository;
import TheBoyIELTS.identity_service.repository.VocabularyRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class VocabularyService {
    VocabularyRepository vocabularyRepository;
    VocabularyMapper vocabularyMapper;

    public VocabularyResponse createVocabulary(VocabularyRequest request){
        boolean exists = vocabularyRepository.existsByWord(request.getWord());
        if (exists) throw new RuntimeException("word already exists");

        Vocabulary vocabulary = Vocabulary.builder()
                .word(request.getWord())
                .level(request.getLevel())
                .isLearned(false)
                .wrongCount(0)
                .isDeleted(false)
                .build();

        Set<Meaning> meanings = new HashSet<>();

        request.getMeanings().forEach(meaning -> {
            Meaning meaning1 = Meaning.builder()
                    .meaning(meaning.getMeaning())
                    .isDeleted(false)
                    .vocabulary(vocabulary)
                    .build();
            meanings.add(meaning1);
            log.info("meanings: {}", meaning1.getMeaning());
        });

        vocabulary.setMeanings(meanings);
        Vocabulary save = vocabularyRepository.save(vocabulary);
        return vocabularyMapper.toVocabularyResponse(save);
    }

    public String getDataFromFileExcelToDatabase(MultipartFile file){
        boolean validExcelFile = UploadFileExcel.isValidExcelFile(file);
        if(!validExcelFile) throw new RuntimeException("not an excel file");
        try {
            List<DataFromExcelFile> datas = UploadFileExcel.getDataFromExcelFile(file.getInputStream());
            List<Vocabulary> vocabularies = new ArrayList<>();
            datas.forEach(data -> {
                Vocabulary vocabulary = Vocabulary.builder()
                        .word(data.getWord())
                        .level(data.getLevel())
                        .isLearned(data.isLearned())
                        .wrongCount(data.getWrongCount())
                        .isDeleted(data.isDeleted())
                        .build();
                Set<Meaning> meanings = new HashSet<>();
                data.getMeanings().forEach(meaning -> {
                    Meaning newMeaning = Meaning.builder()
                            .meaning(meaning)
                            .isDeleted(false)
                            .vocabulary(vocabulary)
                            .build();
                    meanings.add(newMeaning);
                });
                vocabulary.setMeanings(meanings);
                vocabularies.add(vocabulary);
            });
            vocabularyRepository.saveAll(vocabularies);
            return "save success";
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public VocabularyResponse getVovabulary(String vocabularyId){
        Vocabulary vocabulary = vocabularyRepository.findById(vocabularyId)
                .orElseThrow(() -> new RuntimeException("vocabulary not found"));
        return vocabularyMapper.toVocabularyResponse(vocabulary);
    }

    public List<VocabularyResponse> getVocabularies(){
        return vocabularyRepository.findAll()
                .stream().map(vocabularyMapper::toVocabularyResponse).collect(Collectors.toList());
    }

    public VocabularyResponse updateVocabulary(String vocabularyId, VocabularyUpdateRequest request){
        Vocabulary vocabulary = vocabularyRepository.findById(vocabularyId)
                .orElseThrow(() -> new RuntimeException("vocabulary not found"));
        vocabularyMapper.updateVocabulary(vocabulary, request);
        return vocabularyMapper.toVocabularyResponse(vocabularyRepository.save(vocabulary));
    }

    public VocabularyResponse deleteVocabulary(String vocabularyId){
        Vocabulary vocabulary = vocabularyRepository.findById(vocabularyId)
                .orElseThrow(() -> new RuntimeException("vocabulary not found"));
        vocabulary.setDeleted(true);
        return vocabularyMapper.toVocabularyResponse(vocabularyRepository.save(vocabulary));
    }

    public List<VocabularyResponse> getVocabulariesWithLevel(String level){
        List<Vocabulary> vocabularies = vocabularyRepository.findByLevel(level);
        return vocabularies.stream().map(vocabularyMapper::toVocabularyResponse).collect(Collectors.toList());
    }
}
