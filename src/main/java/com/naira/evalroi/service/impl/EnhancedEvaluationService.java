package com.naira.evalroi.service.impl;

import com.anthropic.client.AnthropicClient;
import com.anthropic.models.messages.ContentBlock;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.naira.evalroi.dto.evaluation.enhanced.EnhancedEvaluationResponse;
import com.naira.evalroi.dto.evaluation.simple.SimpleEvaluationDto;
import com.naira.evalroi.entity.BuyerProfile;
import com.naira.evalroi.entity.Listing;
import com.naira.evalroi.entity.UserEntity;
import com.naira.evalroi.repository.BuyerProfileRepository;
import com.naira.evalroi.repository.ListingRepository;
import com.naira.evalroi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EnhancedEvaluationService {

    private final ListingRepository listingRepository;
    private final BuyerProfileRepository buyerProfileRepository;
    private final SimpleEvaluationService simpleEvaluationService;
    private final UserRepository userRepository;
    private final EnhancedEvaluationPromptBuilder promptBuilder;
    private final AnthropicClient anthropicClient;
    private final ObjectMapper objectMapper;

    public EnhancedEvaluationResponse evaluate(Integer listingId, Integer profileId, String username) {
        UserEntity user = getUser(username);
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        BuyerProfile profile = buyerProfileRepository.findByIdAndUserId(profileId,user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        SimpleEvaluationDto simpleEval = simpleEvaluationService.evaluate(listingId, profileId);

        String systemPrompt = promptBuilder.buildSystemPrompt();
        String userPrompt = promptBuilder.buildUserPrompt(listing, profile, simpleEval);

        try {
            Message response = anthropicClient.messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_SONNET_4_6)
                            .maxTokens(2048)
                            .system(systemPrompt)
                            .addUserMessage(userPrompt)
                            .build()
            );

            String rawJson = response.content().stream()
                    .filter(ContentBlock::isText)
                    .map(block -> block.asText().text())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Empty response from Claude"));

            EnhancedEvaluationResponse result = objectMapper.readValue(rawJson, EnhancedEvaluationResponse.class);
            result.setListingId(listingId);
            result.setProfileName(profile.getProfileName());
            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to get AI analysis: " + e.getMessage());
        }
    }

    private UserEntity getUser(String userIdentifier) {
        return userRepository.findByUsernameOrEmail(userIdentifier, userIdentifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
