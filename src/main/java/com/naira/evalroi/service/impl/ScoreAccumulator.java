package com.naira.evalroi.service.impl;

import java.util.ArrayList;
import java.util.List;

public class ScoreAccumulator {
    private double score = 0;
    private final List<String> factors = new ArrayList<>();

    public void add(double points, String factor) {
        score += points;
        factors.add(factor);
    }

    public double getScore() { return score; }
    public List<String> getFactors() { return factors; }
}
