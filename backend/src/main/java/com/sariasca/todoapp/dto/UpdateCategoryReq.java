package com.sariasca.todoapp.dto;

import lombok.Data;

@Data
public class UpdateCategoryReq {
    private String name;      // Hacerlo opcional (@NotNull? o dejarlo null)
    private String color;
}
