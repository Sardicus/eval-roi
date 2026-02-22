package com.naira.evalroi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "listing_images")
public class ListingImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", referencedColumnName = "id", nullable = false)
    private Listing listing;

    @Column(nullable = false)
    String url;

    private Integer imageOrder;
    Boolean isPrimary = false;
}
