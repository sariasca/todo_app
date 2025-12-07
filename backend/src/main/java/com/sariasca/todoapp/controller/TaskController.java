package com.sariasca.todoapp.controller;

import com.sariasca.todoapp.model.Task;
import com.sariasca.todoapp.respositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "${connect.frontend}" )
public class TaskController {
    @Autowired
    TaskRepository taskRepository;

    //Obtener toda las notas
    @GetMapping
    public List<Task> getAllTasks () {
        return taskRepository.findAll();
    }
    //Insertar nota
    @PostMapping
    public Task createTask (@RequestBody Task task){
        return taskRepository.save(task);
    }
    //Editar nota
    @PostMapping("/{id}")
    public Task updateTask(@PathVariable Integer id, @RequestBody Task taskDetails){
        Optional<Task> optionalTask = taskRepository.findById(id);

        if(optionalTask.isPresent()){
            Task task = optionalTask.get();
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());

            return taskRepository.save(task);
        } else {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Integer id, @RequestBody Task taskDetails){
        Optional<Task> optionalTask = taskRepository.findById(id);

        if(optionalTask.isPresent()){
            taskRepository.delete(optionalTask.get());
            return "Nota eliminada correctamente.";
        } else {
            return null;
        }
    }

}
