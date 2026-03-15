package com.naira.evalroi.dto.listing;

import com.naira.evalroi.entity.Listing;
import com.naira.evalroi.enums.ListingStatus;
import com.naira.evalroi.enums.PropertyType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ListingSpecification {
    public static Specification<Listing> hasCity(String city) {
        return (root, query, cb) -> city == null ? null : cb.equal(root.get("address").get("city"), city);
    }
    public static Specification<Listing> hasPropertyType(PropertyType type) {
        return (root, query, cb) -> type == null ? null : cb.equal(root.get("propertyType"), type);
    }
    public static Specification<Listing> hasStatus(ListingStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }
    public static Specification<Listing> titleContains(String title) {
        return (root, query, cb) -> title == null ? null : cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }
    public static Specification<Listing> minPrice(BigDecimal min) {
        return (root, query, cb) -> min == null ? null : cb.greaterThanOrEqualTo(root.get("price"), min);
    }
    public static Specification<Listing> maxPrice(BigDecimal max) {
        return (root, query, cb) -> max == null ? null : cb.lessThanOrEqualTo(root.get("price"), max);
    }
}
