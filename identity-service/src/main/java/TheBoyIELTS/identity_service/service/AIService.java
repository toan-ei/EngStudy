package TheBoyIELTS.identity_service.service;

import TheBoyIELTS.identity_service.DTO.Request.AIRequest;
import TheBoyIELTS.identity_service.DTO.Request.SuggestRequest;
import TheBoyIELTS.identity_service.DTO.Response.AIResponse;
import TheBoyIELTS.identity_service.DTO.Response.SuggestResponse;
import TheBoyIELTS.identity_service.constant.TypeTranslate;
import TheBoyIELTS.identity_service.entity.ReplyFromAI;
import TheBoyIELTS.identity_service.repository.AIRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AIService {
    AIRepository aiRepository;
    ChatClient chatClient;
    VectorStore vectorStore;

    public AIResponse fixParagraph(AIRequest request, boolean isEnglish){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        String typeTranslate = (isEnglish) ? TypeTranslate.VietnameseToEnglish : TypeTranslate.EnglishToVietnamese;

        String systemPrompt = (isEnglish) ?
                """
                Bạn là chuyên gia song ngữ Anh–Việt, có nhiệm vụ đánh giá và sửa lỗi bản dịch tiếng anh của người dùng dựa trên đoạn tiếng việt gốc. 
                
                API sẽ nhận:
                1. `paragraphLgEnglish` – đoạn văn tiếng Anh do người dùng tự dịch
                2. `paragraphLgVietnamese` – đoạn văn tiếng Việt gốc
                
                lưu ý nêu không nhận được data dòng nào thì dữ nguyên dòng đó và báo cho người dùng biết. ví dụ người dùng quên dịch mà nhấn nộp bài thì sẽ được thông báo lại kiểu hài hước bạn đang đùa với tui đúng không. cấm tự tạo ra bản dịch.
                
                Nhiệm vụ của bạn là so sánh hai đoạn và đưa ra báo cáo chi tiết:
                
                ## Đoạn tiếng anh nguời dùng dịch
                [Giữ nguyên đoạn tiếng Anh]
                
                ## Đoạn tiếng việt mặc định
                [Giữ nguyên đoạn tiếng Việt]
                
                ## Lỗi tìm thấy
                Với mỗi lỗi, trình bày theo format:
                
                ### Lỗi [số]: [Loại lỗi]
                - **Vị trí**: "[cụm sai]"
                - **Vấn đề**: [Sai chỗ nào]
                - **Quy tắc**: [Quy tắc ngữ pháp/từ vựng/dịch bị vi phạm]
                - **Bản sửa**: "[bản sửa]"
                - **Giải thích**: [Giải thích vì sao sửa như vậy]
                
                Phải phát hiện các lỗi:
                1. Sai nghĩa khi dịch \s
                2. Lỗi ngữ pháp tiếng Anh \s
                3. Lỗi chọn từ, dùng từ không tự nhiên \s
                4. Câu văn lủng củng, khó hiểu \s
                
                ## Bản dịch tiếng anh đúng
                [Đưa bản dịch tiếng Anh chuẩn, tự nhiên, sát nghĩa]
                
                ## Bản tóm tắt
                - Tổng số lỗi
                - Các loại lỗi chính
                - Đánh giá chất lượng bản dịch
                
                ---
                
                ### Quy tắc:
                - Bản sửa phải sát nghĩa so với tiếng Việt. \s
                - Giải thích rõ ràng, dễ hiểu. \s
                - Không sửa những câu đúng. \s
                - Nếu bản dịch hoàn hảo → khen ngợi.
                """
                :
                """
                Bạn là chuyên gia song ngữ Anh–Việt, có nhiệm vụ đánh giá và sửa lỗi bản dịch tiếng Việt của người dùng dựa trên đoạn tiếng Anh gốc.

                API sẽ nhận:
                1. paragraphLgEnglish – đoạn văn tiếng Anh gốc
                2. paragraphLgVietnamese – đoạn văn tiếng Việt do người dùng tự dịch

                lưu ý nêu không nhận được data dòng nào thì dữ nguyên dòng đó và báo cho người dùng biết. ví dụ người dùng quên dịch mà nhấn nộp bài thì sẽ được thông báo lại kiểu hài hước bạn đang đùa với tui đúng không. cấm tự tạo ra bản dịch.

                Nhiệm vụ của bạn là so sánh hai đoạn và đưa ra báo cáo chi tiết theo format:

                ## Đoạn tiếng anh mặc định
                [Hiển thị nguyên văn]

                ## Đoạn tiếng việt người dùng dịch
                [Hiển thị nguyên văn]

                ## Lỗi tìm thấy
                Với mỗi lỗi:
                - Vị trí: "[cụm sai]"
                - Vấn đề: [Nêu lỗi]
                - Quy tắc: [Quy tắc bị vi phạm]
                - Bản sửa: "[bản sửa]"
                - Giải thichs: [Giải thích]

                Các loại lỗi cần phát hiện:
                1. Sai nghĩa khi dịch
                2. Lỗi ngữ pháp tiếng Việt
                3. Lỗi dùng từ không tự nhiên
                4. Câu văn lủng củng, khó hiểu

                ## Đoạn dịch tiếng việt đúng
                [Đưa bản dịch tiếng Việt chuẩn, tự nhiên, sát nghĩa]

                ## Bản tóm tắt
                - Tổng số lỗi
                - Các loại lỗi chính
                - Đánh giá chất lượng bản dịch
                """;

        String userContent = """
                ### English Translation:
                %s

                ### Vietnamese Paragraph:
                %s
                """.formatted(
                request.getParagraphLgEnglish(),
                request.getParagraphLgVietnamese()
        );

        String content = chatClient.prompt()
                .system(systemPrompt)
                .user(userContent)
                .call()
                .content();

        int estimatedOutputTokens = content.length() / 4;
        int inputTokens = userContent.length() / 4;

        double cost = estimateCost(inputTokens, estimatedOutputTokens);

        ReplyFromAI save = aiRepository.save(
                ReplyFromAI.builder()
                        .userId(userId)
                        .message(content)
                        .cost(cost)
                        .typeTranslate(typeTranslate)
                        .build()
        );
        return AIResponse.builder()
                .userId(save.getUserId())
                .message(save.getMessage())
                .cost(save.getCost())
                .typeTranslate(save.getTypeTranslate())
                .build();
    }

    public SuggestResponse suggestInVocabulary(SuggestRequest request){
        String prompt = """
                Bạn là trợ lý giải thích ngữ cảnh của từ vựng. Nhiệm vụ của bạn là giúp người dùng hiểu nghĩa và cách dùng của một từ tiếng Anh, nhưng bạn tuyệt đối KHÔNG được nhắc đến từ đó, KHÔNG tiết lộ bất kỳ chữ cái nào trong từ, và KHÔNG đưa ra định nghĩa trực tiếp.
                
                Khi người dùng gửi một từ, bạn phải mô tả gián tiếp thông qua ngữ cảnh sử dụng theo cấu trúc sau:
                
                ## 1. Bối cảnh chung
                Mô tả những tình huống mà từ này thường xuất hiện trong đời sống, hội thoại hoặc văn bản. \s
                (Yêu cầu: Không tiết lộ từ, không gợi ý dạng viết.)
                
                ## 2. Cách dùng phổ biến
                Giải thích:
                - Ai thường dùng từ này \s
                - Khi nào họ dùng \s
                - Dùng để làm gì \s
                - Sắc thái cảm xúc (thân thiện, trang trọng, lịch sự, nghiêm túc…)
                
                ## 3. Tình huống ví dụ (không chứa từ)
                Đưa ra 2–3 tình huống thật, chẳng hạn: \s
                - “Khi hai người gặp nhau lần đầu và muốn bắt đầu cuộc trò chuyện.” \s
                - “Khi ai đó mở đầu một cuộc gọi điện thoại.” \s
                - “Khi muốn thu hút sự chú ý của người đối diện trước khi nói tiếp.”
                
                ## 4. Gợi ý khái niệm liên quan
                Giải thích bằng các ý tưởng gần giống (KHÔNG phải từ đồng nghĩa), ví dụ: \s
                - “Một cụm từ dùng để mở đầu giao tiếp.” \s
                - “Một tín hiệu thể hiện sự thân thiện hoặc bắt đầu tương tác.”
                
                ## 5. Gợi ý mở rộng
                Đưa ra một gợi ý mang tính hình ảnh hoặc ẩn dụ để dễ hiểu, ví dụ: \s
                - “Nó giống như nụ cười bằng lời nói khi bạn bắt đầu nói chuyện với ai đó.”
                
                Yêu cầu bắt buộc:
                - Không được nhắc tới từ gốc. \s
                - Không được tiết lộ chữ cái, phiên âm, hay cấu trúc từ. \s
                - Không đưa định nghĩa từ điển. \s
                - Chỉ mô tả gián tiếp qua ngữ cảnh và tình huống.
                """;
        String content = chatClient.prompt()
                .system(prompt)
                .user(request.getWord())
                .call()
                .content();
        return SuggestResponse.builder()
                .message(content)
                .build();
    }

    private double estimateCost(int inputTokens, int outputTokens) {
        double inputCost = inputTokens * 0.15 / 1_000_000;
        double outputCost = outputTokens * 0.60 / 1_000_000;
        return inputCost + outputCost;
    }
}
