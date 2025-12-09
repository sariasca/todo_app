package com.sariasca.todoapp.repositories;

import com.sariasca.todoapp.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByName(String name);
    List<Task> findByFinished(Boolean finished);
    List<Task> findByCategoryId(Integer categoryId);
    List<Task> findByFinishedAndCategoryId(Boolean finish, Integer categoryId);
    long countByCategoryId(Integer categoryId);

}
