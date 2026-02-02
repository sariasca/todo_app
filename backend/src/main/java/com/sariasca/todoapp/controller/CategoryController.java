package com.sariasca.todoapp.controller;

import com.sariasca.todoapp.dto.CategoryDTO;
import com.sariasca.todoapp.dto.CreateCategoryReq;
import com.sariasca.todoapp.dto.UpdateCategoryReq;
import com.sariasca.todoapp.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sariasca.todoapp.dto.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "${connect.frontend}")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        String message = categories.isEmpty() ? "No hay categorías" : "Categorías obtenidas";
        return ResponseEntity.ok(ApiResponse.success(message, categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> getCategoryById(@PathVariable Integer id) {
        CategoryDTO category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Categoría obtenida", category));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@RequestBody CreateCategoryReq request) {
        CategoryDTO category = categoryService.createCategory(request);
        String message = "Categoría '" + category.getName() + "' creada correctamente";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(message, category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable Integer id,
            @RequestBody UpdateCategoryReq request) {
        CategoryDTO updatedCategory = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Categoría actualizada", updatedCategory));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Categoría eliminada", null));
    }

    @GetMapping("/{id}/has-tasks")
    public ResponseEntity<ApiResponse<Boolean>> hasTasks(@PathVariable Integer id) {
        boolean hasTasks = categoryService.hasTasks(id);
        String message = hasTasks ? "La categoría tiene tareas" : "La categoría está vacía";
        return ResponseEntity.ok(ApiResponse.success(message, hasTasks));
    }
}