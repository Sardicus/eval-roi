package com.naira.evalroi.repository;

import com.naira.evalroi.entity.BuyerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BuyerProfileRepository extends JpaRepository<BuyerProfile, Integer> {
    List<BuyerProfile> findByUserId(Integer userId);
    Optional<BuyerProfile> findByIdAndUserId(Integer id, Integer userId);
}