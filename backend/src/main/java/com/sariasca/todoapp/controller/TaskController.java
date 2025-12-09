package com.sariasca.todoapp.controller;

import com.sariasca.todoapp.dto.TaskDTO;
import com.sariasca.todoapp.dto.CreateTaskReq;
import com.sariasca.todoapp.dto.UpdateTaskReq;
import com.sariasca.todoapp.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sariasca.todoapp.dto.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "${connect.frontend}")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskDTO>>> getAllTasks() {
        List<TaskDTO> tasks = taskService.getAllTasks();
        String message = tasks.isEmpty() ? "No hay tareas" : "Tareas obtenidas correctamente";
        return ResponseEntity.ok(ApiResponse.success(message, tasks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDTO>> getTaskById(@PathVariable Integer id) {
        TaskDTO task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success("Tarea obtenida", task));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskDTO>> createTask(@RequestBody CreateTaskReq request) {
        TaskDTO task = taskService.createTask(request);
        String message = "Tarea '" + task.getTitle() + "' creada correctamente";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(message, task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDTO>> updateTask(
            @PathVariable Integer id,
            @RequestBody UpdateTaskReq request) {
        TaskDTO task = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Tarea actualizada", task));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<TaskDTO>> toggleTaskStatus(@PathVariable Integer id) {
        TaskDTO task = taskService.toggleTaskStatus(id);
        String status = task.isFinished() ? "completada" : "pendiente";
        String message = "Tarea marcada como " + status;
        return ResponseEntity.ok(ApiResponse.success(message, task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Integer id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Tarea eliminada correctamente", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TaskDTO>>> searchTasks(@RequestParam String q) {
        List<TaskDTO> tasks = taskService.searchTaskByTitle(q);
        String message = tasks.isEmpty()
                ? "No se encontraron tareas con '" + q + "'"
                : "Se encontraron " + tasks.size() + " tareas";
        return ResponseEntity.ok(ApiResponse.success(message, tasks));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<TaskDTO>>> filterTasks(
            @RequestParam(required = false) Boolean finished,
            @RequestParam(required = false) Integer categoryId) {

        List<TaskDTO> tasks;

        if (finished != null && categoryId != null) {
            // Ambos filtros
            tasks = taskService.getTasksByStatusAndCategory(finished, categoryId);
        } else if (finished != null) {
            // Solo por estado
            tasks = taskService.getTasksByStatus(finished);
        } else if (categoryId != null) {
            // Solo por categoría
            tasks = taskService.getTasksByCategory(categoryId);
        } else {
            // Sin filtros
            tasks = taskService.getAllTasks();
        }

        return ResponseEntity.ok(ApiResponse.success("Tareas filtradas", tasks));
    }

    @GetMapping("/status/{finished}")
    public ResponseEntity<List<TaskDTO>> getTasksByStatus(@PathVariable boolean finished) {
        return ResponseEntity.ok(taskService.getTasksByStatus(finished));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<TaskDTO>> getTasksByCategory(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(taskService.getTasksByCategory(categoryId));
    }
}