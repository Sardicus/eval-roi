package com.naira.evalroi.repository;

import com.naira.evalroi.entity.Listing;
import com.naira.evalroi.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ListingRepository extends JpaRepository<Listing,Integer>, JpaSpecificationExecutor<Listing> {
    Optional<List<Listing>> findListingByUser_UsernameOrUser_Email(String userUsername, String userEmail);
}
