package com.naira.evalroi.dto.listing;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ParsedListingData {
    BigDecimal price;
    String city;
    String district;
    Double sizeM2;
    Double livingAreaM2;
    Integer floorNumber;
    Integer totalFloors;
    Integer buildYear;
    String description;
}
