package com.naira.evalroi.service.impl;

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

    public EnhancedEvaluationResponse evaluate(Integer listingId, Integer profileId, String username) {
        UserEntity user = getUser(username);
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        BuyerProfile profile = buyerProfileRepository.findByIdAndUserId(profileId,user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        SimpleEvaluationDto simpleEval = simpleEvaluationService.evaluate(listingId,profileId);

        return new EnhancedEvaluationResponse(
                listing.getId(),
                profile.getProfileName(),
                "This is a well-located apartment in Nilüfer district with good safety scores.",
                "Priced 15% below market average for this district — excellent value.",
                "Built in 2015, moderate earthquake risk zone. Structurally sound for its age.",
                "Has parking and elevator which are key for this property type.",
                "BUY",
                "Strong value for money with acceptable safety profile.",
                "HIGH",
                "As a family with kids, the quiet residential area and nearby schools make this a strong fit."
        );
    }

    private UserEntity getUser(String userIdentifier) {
        return userRepository.findByUsernameOrEmail(userIdentifier, userIdentifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
