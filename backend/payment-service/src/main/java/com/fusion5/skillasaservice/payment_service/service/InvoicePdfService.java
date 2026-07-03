package com.fusion5.skillasaservice.payment_service.service;

import com.fusion5.skillasaservice.payment_service.entity.Invoice;
import com.fusion5.skillasaservice.payment_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.payment_service.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class InvoicePdfService {

    private final InvoiceRepository invoiceRepository;

    public byte[] generatePdf(Long invoiceId) throws IOException {
        Invoice inv = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceId));

        PDType1Font bold    = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
        PDType1Font regular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            float w      = page.getMediaBox().getWidth();
            float margin = 50f;
            float y      = page.getMediaBox().getHeight() - margin;

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {

                // ── Header ────────────────────────────────────────────────────
                text(cs, bold, 22, margin, y, "SkillAsAService");
                text(cs, regular, 10, margin, y - 18, "Sell Your Skills As A Subscription");
                text(cs, bold, 16, margin, y - 50, "INVOICE");

                // ── Meta ──────────────────────────────────────────────────────
                float metaY = y - 90;
                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy");
                String date = inv.getCreatedAt() != null ? inv.getCreatedAt().format(fmt) : "-";

                labelValue(cs, bold, regular, margin, metaY,      "Invoice #:",    inv.getInvoiceNumber());
                labelValue(cs, bold, regular, margin, metaY - 18, "Date:",         date);
                labelValue(cs, bold, regular, margin, metaY - 36, "Subscription:", String.valueOf(inv.getSubscriptionId()));

                // ── Divider ───────────────────────────────────────────────────
                float lineY = metaY - 60;
                cs.setLineWidth(0.5f);
                cs.moveTo(margin, lineY); cs.lineTo(w - margin, lineY); cs.stroke();

                // ── Table ─────────────────────────────────────────────────────
                float tableY = lineY - 20;
                text(cs, bold,    10, margin, tableY,      "Description");
                text(cs, bold,    10, w - margin - 80, tableY, "Amount");
                text(cs, regular, 10, margin, tableY - 18, "Subscription Service");
                text(cs, regular, 10, w - margin - 80, tableY - 18, "INR " + inv.getSubtotal());

                // ── Totals ────────────────────────────────────────────────────
                float totY = tableY - 60;
                labelValue(cs, regular, regular, w - 200, totY,       "Subtotal:",    "INR " + inv.getSubtotal());
                labelValue(cs, regular, regular, w - 200, totY - 18,  "Tax:",         "INR " + inv.getTaxAmount());
                labelValue(cs, bold,    bold,    w - 200, totY - 40,  "TOTAL:",       "INR " + inv.getTotalAmount());

                // ── Footer ────────────────────────────────────────────────────
                text(cs, regular, 8, margin, 40,
                        "Thank you for using SkillAsAService. This is a system-generated invoice.");
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.save(baos);
            return baos.toByteArray();
        }
    }

    private void text(PDPageContentStream cs, PDType1Font font, float size, float x, float y, String t) throws IOException {
        cs.beginText(); cs.setFont(font, size); cs.newLineAtOffset(x, y); cs.showText(t); cs.endText();
    }

    private void labelValue(PDPageContentStream cs, PDType1Font labelFont, PDType1Font valueFont,
                             float x, float y, String label, String value) throws IOException {
        text(cs, labelFont, 10, x, y, label);
        text(cs, valueFont, 10, x + 100, y, value);
    }
}
