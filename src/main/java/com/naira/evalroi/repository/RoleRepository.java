package com.naira.evalroi.repository;

import com.naira.evalroi.dto.Enums;
import com.naira.evalroi.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRole(Enums.Role role);
}
