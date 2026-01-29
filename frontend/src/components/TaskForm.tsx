import { useState, useEffect } from 'react';
import type { CreateTaskRequest, UpdateTaskRequest, Category } from '../types/types';
import { taskApi } from '../services/api';

interface TaskFormProps {
    taskToEdit?: UpdateTaskRequest & { id?: number };
    categories: Category[];
    onSuccess: () => void;
    onCancel?: () => void;
}

const TaskForm = ({ taskToEdit, categories, onSuccess, onCancel }: TaskFormProps ) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(taskToEdit?.finished || false);

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title || '');
            setDescription(taskToEdit.description || '');
            setPriority(taskToEdit.priority as 'LOW' | 'MEDIUM' | 'HIGH' || 'MEDIUM');
            setCategoryId(taskToEdit.categoryId);
            setFinished(taskToEdit.finished ?? false);
        }
    }, [taskToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        setLoading(true);
        try {
            const taskData: CreateTaskRequest | UpdateTaskRequest = {
                title: title.trim(),
                description: description.trim(),
                priority: priority as string,
                ...(categoryId && { categoryId }),
                finished
            };

            if (taskToEdit?.id) {
                await taskApi.update(taskToEdit.id, taskData);
            } else {
                await taskApi.create(taskData as CreateTaskRequest);                
            }
            
            onSuccess();
            resetForm();
        } catch (error) {
            console.error('Error guardando tarea:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
        setCategoryId(undefined);
        setFinished(false);
    };

    return (
       <form
        onSubmit={handleSubmit}
        className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 p-2 rounded-2xl shadow-2xl"
      >
        <div className="mb-4 p-4">
          <input
            type="text"
            placeholder="Título de la tarea*"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-600 rounded-lg text-gray-100 bg-gray-900/70 placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          />
        </div>

        {/* Descripción */}
        <div className="m-4">
          <textarea
            placeholder="Descripción*"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            className="w-full p-3 border border-gray-600 rounded-lg text-gray-100 bg-gray-900/70 placeholder-gray-400 
            resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          />
        </div>

        {/* Fila de selects */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
            className="flex-1 p-3 border border-gray-600 rounded-lg text-gray-100 bg-gray-900/70 focus:outline-none 
            focus:ring-2 focus:ring-emerald-400 transition"
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>

          <select
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
            className="flex-1 min-w-0 max-w-full p-3 border border-gray-600 rounded-lg text-gray-100 bg-gray-900/70
            focus:outline-none focus:ring-2 focus:ring-emerald-400 truncate"
          >
            <option value="">Sin categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        {taskToEdit?.id && (
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={finished}
              onChange={(e) => setFinished(e.target.checked)}
              className="w-5 h-5 text-emerald-400 bg-gray-900 border-gray-600 rounded focus:ring-2 focus:ring-emerald-400 transition"
            />
            <span className="text-gray-100">
              {finished ? 'Marcar como pendiente' : 'Marcar como finalizado'}
            </span>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg 
            transition disabled:opacity-60"
          >
            {loading ? 'Guardando...' : taskToEdit ? 'Actualizar' : 'Crear'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

    );
};

export default TaskForm;
