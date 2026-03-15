package com.naira.evalroi.service;

import com.naira.evalroi.dto.evaluation.enhanced.BuyerProfileRequest;
import com.naira.evalroi.dto.evaluation.enhanced.BuyerProfileResponse;

import java.util.List;

public interface BuyerProfileService {

    List<BuyerProfileResponse> getUserProfiles(String username);

    BuyerProfileResponse getUserProfileById(Integer profileId, String username);

    BuyerProfileResponse createProfile(String username, BuyerProfileRequest request);

    BuyerProfileResponse updateProfile(String username, Integer profileId, BuyerProfileRequest request);

    void deleteProfile(String username, Integer profileId);
}
