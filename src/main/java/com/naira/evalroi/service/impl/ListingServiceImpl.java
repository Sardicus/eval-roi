package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.listing.CreateListingRequest;
import com.naira.evalroi.dto.listing.ListingResponseDto;
import com.naira.evalroi.entity.Listing;
import com.naira.evalroi.entity.UserEntity;
import com.naira.evalroi.enums.RoleEnum;
import com.naira.evalroi.mapper.ListingMapper;
import com.naira.evalroi.repository.ListingRepository;
import com.naira.evalroi.repository.UserRepository;
import com.naira.evalroi.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ListingServiceImpl implements ListingService {

    private final ListingRepository listingRepository;
    private final ListingMapper listingMapper;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ListingResponseDto createListing(CreateListingRequest request, String userIdentifier) {
        Listing listing = listingMapper.toEntity(request);
        listing.setUser(userRepository.findByUsernameOrEmail(userIdentifier,userIdentifier).orElseThrow(() -> new UsernameNotFoundException("User not found")));
        return listingMapper.toResponseDTO(listingRepository.save(listing));
    }

    @Override
    public ListingResponseDto getListingById(Integer id) {
        Listing listing = listingRepository.getReferenceById(id);
        return listingMapper.toResponseDTO(listing);
    }

    @Override
    @Transactional
    public void deleteListing(Integer id, String userIdentifier) {
        UserEntity user = userRepository.findByUsernameOrEmail(userIdentifier, userIdentifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Listing not found"));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getRole() == RoleEnum.ADMIN);
        boolean isOwner = listing.getUser().getId().equals(user.getId());

        if (!isOwner || !isAdmin) {
            throw new AuthorizationDeniedException("You are not allowed to delete this listing");
        }

        listingRepository.deleteById(id);
    }
}
