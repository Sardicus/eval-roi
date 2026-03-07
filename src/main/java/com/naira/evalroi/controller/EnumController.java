package com.naira.evalroi.controller;

import com.naira.evalroi.enums.HeatingType;
import com.naira.evalroi.enums.ListingStatus;
import com.naira.evalroi.enums.PropertyType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/enums")
public class EnumController {

    @GetMapping("/property-types")
    public Map<String, String> getPropertyTypes() {
        Map<String, String> types = new LinkedHashMap<>();
        for (PropertyType type : PropertyType.values()) {
            types.put(type.name(), type.getDisplayName());
        }
        return types;
    }

    @GetMapping("/heating-types")
    public Map<String, String> getHeatingTypes() {
        Map<String, String> types = new LinkedHashMap<>();
        for (HeatingType type : HeatingType.values()) {
            types.put(type.name(), type.getDisplayName());
        }
        return types;
    }

    @GetMapping("/listing-statuses")
    public Map<String, String> getListingStatuses() {
        Map<String, String> types = new LinkedHashMap<>();
        for (ListingStatus type : ListingStatus.values()) {
            types.put(type.name(), type.getDisplayName());
        }
        return types;
    }
}