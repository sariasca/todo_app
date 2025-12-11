import axios from 'axios';
import type {
  Task, CreateTaskRequest, UpdateTaskRequest,
  Category, CreateCategoryRequest, UpdateCategoryRequest,
  ApiResponse
} from '../types/types';


const API_URL = import.meta.env.VITE_URL_API;

axios.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export const taskApi = {
    getAll: () => axios.get<ApiResponse<Task[]>>(`${API_URL}/tasks`),
    getById: (id: number) => axios.get<ApiResponse<Task>>(`${API_URL}/tasks/${id}`),
    create: (task: CreateTaskRequest) => axios.post<ApiResponse<Task>>(`${API_URL}/tasks`, task),
    update: (id: number, task: UpdateTaskRequest) => 
        axios.put<ApiResponse<Task>>(`${API_URL}/tasks/${id}`, task),
    toggle: (id: number) => axios.patch<ApiResponse<Task>>(`${API_URL}/tasks/${id}/toggle`),
    delete: (id: number) => axios.delete<ApiResponse<void>>(`${API_URL}/tasks/${id}`),
    getByStatus: (finished: boolean) => 
        axios.get<ApiResponse<Task[]>>(`${API_URL}/tasks/status/${finished}`),
    getByCategory: (categoryId: number) => 
        axios.get<ApiResponse<Task[]>>(`${API_URL}/tasks/category/${categoryId}`),
    search: (query: string) => 
        axios.get<ApiResponse<Task[]>>(`${API_URL}/tasks/search?q=${encodeURIComponent(query)}`),
};

export const categoryApi = {
    getAll: () => axios.get<ApiResponse<Category[]>>(`${API_URL}/categories`),
    getById: (id: number) => axios.get<ApiResponse<Category>>(`${API_URL}/categories/${id}`),
    create: (category: CreateCategoryRequest) => 
        axios.post<ApiResponse<Category>>(`${API_URL}/categories`, category),
    update: (id: number, category: UpdateCategoryRequest) => 
        axios.put<ApiResponse<Category>>(`${API_URL}/categories/${id}`, category),
    delete: (id: number) => axios.delete<ApiResponse<void>>(`${API_URL}/categories/${id}`),
    hasTasks: (id: number) => 
        axios.get<ApiResponse<boolean>>(`${API_URL}/categories/${id}/has-tasks`),
};