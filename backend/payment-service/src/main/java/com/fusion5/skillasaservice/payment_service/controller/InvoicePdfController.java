package com.fusion5.skillasaservice.payment_service.controller;

import com.fusion5.skillasaservice.payment_service.service.InvoicePdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/payment/invoices")
@RequiredArgsConstructor
public class InvoicePdfController {

    private final InvoicePdfService invoicePdfService;

    /**
     * GET /api/payment/invoices/{id}/pdf
     * Downloads the invoice as a PDF file.
     * Requires: Bearer token (any authenticated user — ownership checked in service).
     */
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) throws IOException {
        byte[] pdfBytes = invoicePdfService.generatePdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice-" + id + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}
