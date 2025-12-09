package com.sariasca.todoapp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskDTO {
    private Integer id;
    private String title;
    private String description;
    private boolean finished;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    @JsonFormat(pattern =  "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dueDate;
    private String priority;
    private Integer categoryId;
    private String categoryName;
    private String categoryColor;
}
