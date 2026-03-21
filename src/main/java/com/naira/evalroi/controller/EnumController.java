package com.naira.evalroi.controller;

import com.naira.evalroi.enums.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
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

    @GetMapping("/buyer-profile-enums")
    public ResponseEntity<Map<String, Map<String, String>>> getBuyerProfileEnums() {
        Map<String, Map<String, String>> enums = new LinkedHashMap<>();

        enums.put("householdType", Arrays.stream(HouseholdType.values())
                .collect(LinkedHashMap::new, (m, e) -> m.put(e.name(), e.getDisplayName()), Map::putAll));
        enums.put("lifestylePreference", Arrays.stream(LifestylePreference.values())
                .collect(LinkedHashMap::new, (m, e) -> m.put(e.name(), e.getDisplayName()), Map::putAll));
        enums.put("priority", Arrays.stream(Priority.values())
                .collect(LinkedHashMap::new, (m, e) -> m.put(e.name(), e.getDisplayName()), Map::putAll));
        enums.put("budgetSensitivity", Arrays.stream(BudgetSensitivity.values())
                .collect(LinkedHashMap::new, (m, e) -> m.put(e.name(), e.getDisplayName()), Map::putAll));
        enums.put("purchaseIntent", Arrays.stream(PurchaseIntent.values())
                .collect(LinkedHashMap::new, (m, e) -> m.put(e.name(), e.getDisplayName()), Map::putAll));
        enums.put("ageGroup", Arrays.stream(AgeGroup.values())
                .collect(LinkedHashMap::new, (m, e) -> m.put(e.name(), e.getDisplayName()), Map::putAll));
        enums.put("commuteImportance", Arrays.stream(CommuteImportance.values())
                .collect(LinkedHashMap::new, (m, e) -> m.put(e.name(), e.getDisplayName()), Map::putAll));

        return ResponseEntity.ok(enums);
    }
}