package com.fusion5.skillasaservice.wallet_service.dto.response;

import com.fusion5.skillasaservice.wallet_service.entity.WalletTransaction;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class WalletTransactionResponse {
    private Long id;
    private Long walletId;
    private WalletTransaction.TransactionType transactionType;
    private BigDecimal amount;
    private String referenceId;
    private String description;
    private LocalDateTime createdAt;
}
