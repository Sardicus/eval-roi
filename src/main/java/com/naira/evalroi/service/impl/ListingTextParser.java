package com.naira.evalroi.service.impl;

import com.anthropic.client.AnthropicClient;
import com.anthropic.models.messages.ContentBlock;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.naira.evalroi.dto.listing.ParsedListingData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ListingTextParser {

    private final AnthropicClient anthropicClient;
    private final ObjectMapper objectMapper;

    public ParsedListingData parseWithClaude(String rawText) {
        String prompt = """
                Extract real estate listing data from this text. It may be from Sahibinden, Hepsiemlak, or any other Turkish real estate platform.
                
                TEXT:
                %s
                
                Respond with ONLY this JSON, no other text:
                {
                  "price": number or null,
                  "city": "string or null",
                  "district": "string or null",
                  "sizeM2": number or null,
                  "livingAreaM2": number or null,
                  "floorNumber": number or null,
                  "totalFloors": number or null,
                  "buildYear": number or null (convert age to year e.g. age 5 in 2026 = 2021, age 0 = 2026),
                  "description": "any free text description or null"
                }
                """.formatted(rawText);

        try {
            Message response = anthropicClient.messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_HAIKU_4_5)
                            .maxTokens(512)
                            .system("You are a data extraction assistant. Always respond with raw JSON only. Never use markdown code blocks. Never add any text before or after the JSON.")
                            .addUserMessage(prompt)
                            .build()
            );

            String rawJson = response.content().stream()
                    .filter(ContentBlock::isText)
                    .map(block -> block.asText().text())
                    .findFirst()
                    .orElseThrow();

            rawJson = rawJson.strip();
            if (rawJson.startsWith("```")) {
                rawJson = rawJson.replaceAll("```json", "").replaceAll("```", "").strip();
            }

            return objectMapper.readValue(rawJson, ParsedListingData.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse listing text: " + e.getMessage());
        }
    }
}