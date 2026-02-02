import { useState, useEffect } from 'react';
import type { Task } from '../types/types';
import type { Category } from '../types/types';
import TaskItem from './TaskItem';
import { categoryApi, taskApi } from '../services/api';
import TaskForm from './TaskForm';
import { ClipboardList, Search, ChevronDown, CircleX, Pencil } from 'lucide-react';

interface TaskListProps {
    tasks: Task[];
    onTasksUpdated: () => void;
    selectedCategory?: number | null;
}

const TaskList = ({ tasks, onTasksUpdated, selectedCategory }: TaskListProps) => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'title'>('createdAt');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryApi.getAll();
                const data = response.data.data;
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending' && task.finished) return false;
        if (filter === 'completed' && !task.finished) return false;
        
        if (selectedCategory !== null) {
            // Comparar como números
            const taskCategoryId = Number(task.categoryId);
            const selectedCatId = Number(selectedCategory);
            
            if (taskCategoryId !== selectedCatId) {
                return false;
            }
        }

        if (searchTerm) {
            return task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   task.description.toLowerCase().includes(searchTerm.toLowerCase());
        }
        
        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
      switch (sortBy) {

        case 'title':
          return a.title.localeCompare(b.title);

        case 'priority': {
          const priorityOrder: Record<Task['priority'], number> = {
            HIGH: 3,
            MEDIUM: 2,
            LOW: 1
          };

          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }

        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Seguro que quieres eliminar esta tarea?')) return;
        
        try {
            await taskApi.delete(id);
            onTasksUpdated();
        } catch (error) {
            console.error('Error eliminando tarea:', error);
        }
    };

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.finished).length,
        pending: tasks.filter(t => !t.finished).length
    };

    return (
      <div className="space-y-6">
      {/* Header con stats y filtros */}
      <div className="flex flex-col items-start lg:items-center gap-6 mb-6">
        {/* Stats */}
        <div className="flex gap-4 lg:gap-6 p-4 bg-linear-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-inner">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-300 font-medium">Total:</span>
            <span className="text-white font-bold text-lg">{stats.total}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-300 font-medium">Pendientes:</span>
            <span className="text-white font-bold text-lg">{stats.pending}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-gray-300 font-medium">Completadas:</span>
            <span className="text-white font-bold text-lg">{stats.completed}</span>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Buscador */}
          <div className="relative flex-1 lg:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400"/>
            </div>
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Select de filtro */}
          <div className="relative">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
              className="appearance-none w-full sm:w-48 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl 
              text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer pr-10"
            >
              <option value="all" className="bg-gray-800">Todas</option>
              <option value="pending" className="bg-gray-800">Pendientes</option>
              <option value="completed" className="bg-gray-800">Completadas</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-400"/>
            </div>
          </div>
          {/* Select de orden */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none w-full sm:w-48 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl 
              text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-10"
            >
              <option value="createdAt">Más recientes</option>
              <option value="priority">Prioridad</option>
              <option value="title">Nombre (A-Z)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-400"/>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor de tareas */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-linear-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <ClipboardList  className="w-8 h-8 text-gray-400"/>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchTerm ? 'No se encontraron tareas' : 'No hay tareas aquí'}
            </h3>
            <p className="text-gray-400">
              {searchTerm 
                ? `No hay resultados para "${searchTerm}"`
                : selectedCategory 
                  ? 'Esta categoría está vacía'
                  : 'Comienza creando tu primera tarea'}
            </p>
          </div>
        ) : (
          sortedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={setEditingTask}
              onDelete={() => handleDelete(task.id)}
              onStatusChanged={onTasksUpdated}
            />
          ))
        )}
      </div>

      {/* Modal de edición */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-linear-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border 
          border-gray-700 animate-slideUp">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-100">
                <Pencil /> Editar Tarea
                </h3>
                <button
                  onClick={() => setEditingTask(null)}
                  className="text-gray-400 hover:text-white cursor-pointer text-2xl hover:bg-gray-800 w-10 h-10
                  flex items-center justify-center transition-colors"
                >
                  <CircleX />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <TaskForm 
                taskToEdit={editingTask}
                categories={categories}
                onSuccess={() => {
                  setEditingTask(null);
                  onTasksUpdated();
                }}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
    );
};

export default TaskList;