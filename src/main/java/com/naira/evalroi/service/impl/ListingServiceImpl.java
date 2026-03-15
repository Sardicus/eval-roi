package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.evaluation.simple.SimpleEvaluationDto;
import com.naira.evalroi.dto.listing.CreateListingRequest;
import com.naira.evalroi.dto.listing.ListingResponseDto;
import com.naira.evalroi.dto.listing.ListingSpecification;
import com.naira.evalroi.entity.Listing;
import com.naira.evalroi.entity.ListingImage;
import com.naira.evalroi.entity.UserEntity;
import com.naira.evalroi.enums.ListingStatus;
import com.naira.evalroi.enums.PropertyType;
import com.naira.evalroi.enums.RoleEnum;
import com.naira.evalroi.mapper.ListingMapper;
import com.naira.evalroi.repository.ListingRepository;
import com.naira.evalroi.repository.UserRepository;
import com.naira.evalroi.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ListingServiceImpl implements ListingService {

    private final ListingRepository listingRepository;
    private final ListingMapper listingMapper;
    private final UserRepository userRepository;
    private final ImageManager imageManager;
    private final SimpleEvaluationService simpleEvaluationService;

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

    public Page<ListingResponseDto> getListings(
            String title, String city, PropertyType propertyType,
            ListingStatus status, BigDecimal minPrice, BigDecimal maxPrice,
            Pageable pageable
    ) {
        Specification<Listing> spec = Specification
                .where(ListingSpecification.titleContains(title))
                .and(ListingSpecification.hasCity(city))
                .and(ListingSpecification.hasPropertyType(propertyType))
                .and(ListingSpecification.hasStatus(status))
                .and(ListingSpecification.minPrice(minPrice))
                .and(ListingSpecification.maxPrice(maxPrice));

        Page<Listing> page = listingRepository.findAll(spec, pageable);

        return page.map(listing -> {

            SimpleEvaluationDto evaluation =
                    simpleEvaluationService.evaluate(listing.getId());

            return listingMapper.toResponseDTOWithEval(listing, evaluation);
        });
    }

    @Override
    public List<ListingResponseDto> getListingsByUser(String userIdentifier) {
        List<Listing> listings = listingRepository.findListingByUser_UsernameOrUser_Email(userIdentifier, userIdentifier)
                .orElseThrow(() -> new UsernameNotFoundException("User's listings not found"));
        return listings.stream().map(listingMapper::toResponseDTO).toList();
    }

    @Override
    @Transactional
    public void deleteListing(Integer id, String userIdentifier) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Listing not found"));
        boolean isAuthorized = isUserAuthorizedWithListing(listing, userIdentifier);
        if (!isAuthorized) {
            throw new AuthorizationDeniedException("You are not authorized to delete this listing");
        }
        listingRepository.deleteById(id);
    }

    @Override
    @Transactional
    public ListingResponseDto updateListing(Integer id, CreateListingRequest request, String userIdentifier) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Listing not found"));
        boolean isAuthorized = isUserAuthorizedWithListing(listing, userIdentifier);
        if (!isAuthorized) {
            throw new AuthorizationDeniedException("You are not authorized to update this listing");
        }

        listingMapper.updateEntityFromRequest(request, listing);
        return listingMapper.toResponseDTO(listingRepository.save(listing));
    }

    @Override
    @Transactional
    public ListingResponseDto addImagesToListing(Integer listingId, List<MultipartFile> files, String userIdentifier) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new NoSuchElementException("Listing not found"));
        boolean isAuthorized = isUserAuthorizedWithListing(listing, userIdentifier);
        if (!isAuthorized) {
            throw new AuthorizationDeniedException("You are not authorized to add image to this listing");
        }
        for (MultipartFile file : files) {
            String url = imageManager.saveImage(file);

            ListingImage  listingImage = new ListingImage();
            listingImage.setIsPrimary(listing.getImages().isEmpty());
            listingImage.setUrl(url);
            listingImage.setImageOrder(listing.getImages().size());
            listing.addImage(listingImage);
        }
        return listingMapper.toResponseDTO(listingRepository.save(listing));
    }

    @Override
    public void deleteImageFromListing(Integer listingId, Integer imageId, String userIdentifier) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new NoSuchElementException("Listing not found"));
        boolean isAuthorized = isUserAuthorizedWithListing(listing, userIdentifier);
        if (!isAuthorized) {
            throw new AuthorizationDeniedException("You are not authorized to delete image from this listing");
        }
        ListingImage imageToDelete = listing.getImages().stream()
                .filter(img -> imageId.equals(img.getId()))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Image not found in this listing"));

        imageManager.deleteImage(imageToDelete.getUrl());
        listing.getImages().remove(imageToDelete);
        listingRepository.save(listing);
    }

    @Override
    public void setPrimaryImageForListing(Integer listingId, Integer imageId, String userIdentifier) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new NoSuchElementException("Listing not found"));
        boolean isAuthorized = isUserAuthorizedWithListing(listing, userIdentifier);
        if (!isAuthorized) {
            throw new AuthorizationDeniedException("You are not authorized to set primary image for this listing");
        }

        ListingImage image = listing.getImages().stream()
                .filter(img -> imageId.equals(img.getId()))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Image not found in this listing"));

        listing.getImages().forEach(img -> img.setIsPrimary(false));
        image.setIsPrimary(true);
        listingRepository.save(listing);
    }

    private boolean isUserAuthorizedWithListing(Listing listing, String userIdentifier) {
        UserEntity user = userRepository.findByUsernameOrEmail(userIdentifier, userIdentifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getRole() == RoleEnum.ADMIN);
        boolean isOwner = listing.getUser().getId().equals(user.getId());

        return isOwner || isAdmin;
    }

    @Override
    @Transactional
    public void updateListingStatus(Integer listingId, String status, String userIdentifier) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new NoSuchElementException("Listing not found"));
        boolean isAuthorized = isUserAuthorizedWithListing(listing, userIdentifier);
        if (!isAuthorized) {
            throw new AuthorizationDeniedException("You are not authorized to update status of this listing");
        }

        listing.setStatus(ListingStatus.valueOf(status));
        listingMapper.toResponseDTO(listingRepository.save(listing));
    }
}
