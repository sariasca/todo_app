package com.sariasca.todoapp.dto;

import lombok.Data;

@Data
public class UpdateTaskReq {
    private String title;
    private String description;
    private Boolean finished;
    private String priority;
    private Integer categoryId;

}
