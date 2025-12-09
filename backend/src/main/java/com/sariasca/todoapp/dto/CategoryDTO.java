package com.sariasca.todoapp.dto;

import lombok.Data;

@Data
public class CategoryDTO {
    private Integer id;
    private String name;
    private String color;
    private long taskCount;
}
