package com.naira.evalroi.entity;

import com.naira.evalroi.dto.Enums;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "ROLE")
public class Role extends BaseEntity {

    @Enumerated(EnumType.ORDINAL)
    private Enums.Role role;
}
