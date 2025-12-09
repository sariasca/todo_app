package com.sariasca.todoapp.services;

import com.sariasca.todoapp.dto.TaskDTO;
import com.sariasca.todoapp.dto.CreateTaskReq;
import com.sariasca.todoapp.dto.UpdateTaskReq;
import com.sariasca.todoapp.model.Category;
import com.sariasca.todoapp.model.Task;
import com.sariasca.todoapp.model.Priority;
import com.sariasca.todoapp.repositories.TaskRepository;
import com.sariasca.todoapp.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;

    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TaskDTO getTaskById(Integer id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea con id '" + id + "' no encontrada."));
        return convertToDTO(task);
    }

    public List<TaskDTO> searchTaskByTitle(String searchTitle) {
        return taskRepository.findByTitleContainingIgnoreCase(searchTitle)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksByStatusAndCategory(boolean finished, Integer categoryId) {
        return taskRepository.findByFinishedAndCategoryId(finished, categoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TaskDTO createTask(CreateTaskReq request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setFinished(false);

        if (request.getPriority() != null) {
            task.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
        } else {
            task.setPriority(Priority.MEDIUM);
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Categoria no encontrada."));
            task.setCategory(category);
        }

        Task savedTask = taskRepository.save(task);
        return convertToDTO(savedTask);
    }

    public TaskDTO updateTask(Integer id, UpdateTaskReq request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea con id '" + id + "' no encontrada."));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }

        if (request.getFinished() != null) {
            task.setFinished(request.getFinished());
        }

        if (request.getPriority() != null) {
            task.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Categoria no encontrada."));
            task.setCategory(category);
        } else if (request.getCategoryId() != null && request.getCategoryId() == 0) {
            task.setCategory(null);
        }

        Task updatedTask = taskRepository.save(task);
        return convertToDTO(updatedTask);
    }

    public TaskDTO toggleTaskStatus(Integer id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea con id '" + id + "' no encontrada."));

        task.setFinished(!task.isFinished());
        Task updatedTask = taskRepository.save(task);
        return convertToDTO(updatedTask);
    }

    public void deleteTask(Integer id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea con id '" + id + "' no encontrada."));
        taskRepository.delete(task);
    }

    public List<TaskDTO> getTasksByStatus(boolean finished) {
        return taskRepository.findByFinished(finished).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksByCategory(Integer categoryId) {
        return taskRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TaskDTO convertToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setFinished(task.isFinished());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        dto.setPriority(task.getPriority() != null ? task.getPriority().name() : null);

        if (task.getCategory() != null) {
            dto.setCategoryId(task.getCategory().getId());
            dto.setCategoryName(task.getCategory().getName());
            dto.setCategoryColor(task.getCategory().getColor());
        }

        return dto;
    }
}