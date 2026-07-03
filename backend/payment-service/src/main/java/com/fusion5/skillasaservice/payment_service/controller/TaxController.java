package com.fusion5.skillasaservice.payment_service.controller;

import com.fusion5.skillasaservice.payment_service.service.TaxCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class TaxController {

    private final TaxCalculationService taxCalculationService;

    // GET /api/payment/calculate-tax?amount=1000&countryCode=IN
    // Returns { subtotal, taxRate, taxAmount, total, countryCode }
    // Can be called before login (e.g. on plan listing page)
    @GetMapping("/calculate-tax")
    public TaxCalculationService.TaxResult calculateTax(
            @RequestParam BigDecimal amount,
            @RequestParam(defaultValue = "IN") String countryCode) {
        return taxCalculationService.calculate(amount, countryCode);
    }
}
