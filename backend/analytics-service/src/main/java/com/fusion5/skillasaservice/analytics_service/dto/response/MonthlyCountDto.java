package com.fusion5.skillasaservice.analytics_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class MonthlyCountDto {
    private String month;   // "2026-07"
    private long count;
}
