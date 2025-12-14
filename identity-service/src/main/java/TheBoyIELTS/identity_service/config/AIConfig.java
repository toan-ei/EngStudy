package TheBoyIELTS.identity_service.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfig {
    @Bean
    ChatClient chatClient(OpenAiChatModel model) {
        return ChatClient.builder(model).build();
    }
}
