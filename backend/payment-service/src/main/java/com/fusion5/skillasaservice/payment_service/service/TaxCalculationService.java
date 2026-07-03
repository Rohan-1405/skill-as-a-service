package com.fusion5.skillasaservice.payment_service.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
public class TaxCalculationService {

    private static final Map<String, BigDecimal> TAX_RATES = new HashMap<>();
    static {
        TAX_RATES.put("IN", new BigDecimal("18.0"));  // GST 18%
        TAX_RATES.put("GB", new BigDecimal("20.0"));  // UK VAT
        TAX_RATES.put("DE", new BigDecimal("19.0"));  // Germany VAT
        TAX_RATES.put("FR", new BigDecimal("20.0"));  // France VAT
        TAX_RATES.put("AU", new BigDecimal("10.0"));  // Australia GST
        TAX_RATES.put("SG", new BigDecimal("9.0"));   // Singapore GST
        TAX_RATES.put("AE", new BigDecimal("5.0"));   // UAE VAT
        TAX_RATES.put("CA", new BigDecimal("5.0"));   // Canada federal GST
        TAX_RATES.put("US", BigDecimal.ZERO);          // No federal tax
    }

    public TaxResult calculate(BigDecimal subtotal, String countryCode) {
        String code    = (countryCode != null) ? countryCode.toUpperCase() : "IN";
        BigDecimal rate = TAX_RATES.getOrDefault(code, BigDecimal.ZERO);
        BigDecimal taxAmount = subtotal.multiply(rate)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        return new TaxResult(subtotal, rate, taxAmount, subtotal.add(taxAmount), code);
    }

    public record TaxResult(BigDecimal subtotal, BigDecimal taxRate,
                             BigDecimal taxAmount, BigDecimal total,
                             String countryCode) {}
}
