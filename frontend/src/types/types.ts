export interface Task {
  id: number;
  title: string;
  description: string;
  finished: boolean;
  createdAt: string;
  updatedAt: string;
  priority: string;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  taskCount?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    priority: string;
    categoryId?: number;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    finished?: boolean;
    priority?: string;
    categoryId?: number;
}

export interface CreateCategoryRequest {
    name: string;
    color: string;
}

export interface UpdateCategoryRequest {
    name?: string;
    color?: string;
}