package com.educadino.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para respuestas paginadas.
 * Compatible con el formato PaginatedResponse del frontend Angular.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedResponse<T> {

    private boolean success;
    private List<T> data;
    private PaginationMeta meta;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaginationMeta {
        private int currentPage;
        private int totalPages;
        private int pageSize;
        private long totalItems;
        private boolean hasNextPage;
        private boolean hasPreviousPage;
    }
}
