package com.sariasca.todoapp.services;

import com.sariasca.todoapp.dto.CategoryDTO;
import com.sariasca.todoapp.dto.CreateCategoryReq;
import com.sariasca.todoapp.model.Category;
import com.sariasca.todoapp.repositories.CategoryRepository;
import com.sariasca.todoapp.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TaskRepository taskRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category with id '" + id + "' not found"));
        return convertToDTO(category);
    }

    public CategoryDTO createCategory(CreateCategoryReq request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Ya existe una categoria con el nombre: " + request.getName());
        }

        String sanitizedColor = sanitizeColor(request.getColor());

        Category category = new Category();
        category.setName(request.getName());
        category.setColor(sanitizedColor);

        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    public CategoryDTO updateCategory(Integer id, CreateCategoryReq request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria con id '" + id + "' no encontrada"));

        if (!category.getName().equals(request.getName()) &&
                categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Ya existe una categoria con el nombre: " + request.getName());
        }

        category.setName(request.getName());

        if (request.getColor() != null) {
            category.setColor(request.getColor());
        }

        Category updatedCategory = categoryRepository.save(category);
        return convertToDTO(updatedCategory);
    }

    public void deleteCategory(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria con id '" + id + "' no encontrada"));

        categoryRepository.delete(category);
    }

    public boolean hasTasks(Integer categoryId) {
        return taskRepository.countByCategoryId(categoryId) > 0;
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setColor(category.getColor());

        long taskCount = taskRepository.countByCategoryId(category.getId());
        dto.setTaskCount(taskCount);

        return dto;
    }

    //Metodo para sanitizar el color en hexadecimal
    private String sanitizeColor(String color) {
        if (color == null) return null;

        // Asegurar formato #RRGGBB en mayúsculas
        color = color.toUpperCase().trim();

        if (!color.startsWith("#")) {
            color = "#" + color;
        }
        // Validar formato
        if (!color.matches("^#[0-9A-F]{6}$")) {
            throw new RuntimeException("Formato de color inválido. Use #RRGGBB");
        }

        return color;
    }
}
