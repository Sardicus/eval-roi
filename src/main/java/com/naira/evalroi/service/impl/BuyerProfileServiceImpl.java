package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.evaluation.enhanced.BuyerProfileRequest;
import com.naira.evalroi.dto.evaluation.enhanced.BuyerProfileResponse;
import com.naira.evalroi.entity.BuyerProfile;
import com.naira.evalroi.entity.UserEntity;
import com.naira.evalroi.mapper.BuyerProfileMapper;
import com.naira.evalroi.repository.BuyerProfileRepository;
import com.naira.evalroi.repository.UserRepository;
import com.naira.evalroi.service.BuyerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BuyerProfileServiceImpl implements BuyerProfileService {

    private final BuyerProfileRepository buyerProfileRepository;
    private final UserRepository userRepository;
    private final BuyerProfileMapper buyerProfileMapper;

    private UserEntity getUser(String userIdentifier) {
        return userRepository.findByUsernameOrEmail(userIdentifier, userIdentifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public List<BuyerProfileResponse> getUserProfiles(String username) {
        UserEntity user = getUser(username);
        return buyerProfileRepository.findByUserId(user.getId())
                .stream().map(buyerProfileMapper::toResponse).toList();
    }

    @Override
    public BuyerProfileResponse getUserProfileById(Integer profileId, String username) {
        return buyerProfileMapper.toResponse(buyerProfileRepository.findById(profileId).orElseThrow(() -> new NoSuchElementException("User Profile not found")));
    }

    @Override
    public BuyerProfileResponse createProfile(String username, BuyerProfileRequest request) {
        UserEntity user = getUser(username);
        BuyerProfile profile = buyerProfileMapper.toEntity(request);
        profile.setUser(user);
        return buyerProfileMapper.toResponse(buyerProfileRepository.save(profile));
    }

    @Override
    public BuyerProfileResponse updateProfile(String username, Integer profileId, BuyerProfileRequest request) {
        UserEntity user = getUser(username);
        BuyerProfile profile = buyerProfileRepository.findByIdAndUserId(profileId, user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        buyerProfileMapper.updateEntityFromRequest(request, profile);
        return buyerProfileMapper.toResponse(buyerProfileRepository.save(profile));
    }

    @Override
    public void deleteProfile(String username, Integer profileId) {
        UserEntity user = getUser(username);
        BuyerProfile profile = buyerProfileRepository.findByIdAndUserId(profileId, user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        buyerProfileRepository.delete(profile);
    }
}
