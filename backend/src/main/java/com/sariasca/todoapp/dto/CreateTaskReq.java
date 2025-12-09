package com.sariasca.todoapp.dto;

import lombok.Data;

@Data
public class CreateTaskReq {
    private String title;
    private String description;
    private String priority;
    private Integer categoryId;
}
