import { useState, useEffect } from 'react';
import type { CreateTaskRequest, UpdateTaskRequest, Category } from '../types/types';
import { taskApi, categoryApi } from '../services/api';

interface TaskFormProps {
    taskToEdit?: UpdateTaskRequest & { id?: number };
    onTaskSaved: () => void;
    onCancel?: () => void;
}

const TaskForm = ({ taskToEdit, onTaskSaved, onCancel }: TaskFormProps ) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(taskToEdit?.finished || false);

    useEffect(() => {
        fetchCategories();
        if (taskToEdit) {
            setTitle(taskToEdit.title || '');
            setDescription(taskToEdit.description || '');
            setPriority(taskToEdit.priority as 'LOW' | 'MEDIUM' | 'HIGH' || 'MEDIUM');
            setCategoryId(taskToEdit.categoryId);
        }
    }, [taskToEdit]);

    const fetchCategories = async () => {
        try {
            const response = await categoryApi.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error('Error cargando categorías:', error);
        }
    };

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

            resetForm();
            onTaskSaved();
        } catch (error) {
            console.error('Error guardando tarea:', error);
        } finally {
            setLoading(false);
        }
        const taskData: CreateTaskRequest | UpdateTaskRequest = {
            title: title.trim(),
            description: description.trim(),
            priority: priority as string,
            ...(categoryId && { categoryId }),
            ...(taskToEdit?.id && { finished }) 
        };
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
        setCategoryId(undefined);
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Título de la tarea*"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <textarea
                    placeholder="Descripción*"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <select 
                        value={priority} 
                        onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                    >
                        <option value="LOW">Baja</option>
                        <option value="MEDIUM">Media</option>
                        <option value="HIGH">Alta</option>
                    </select>
                </div>

                <div className="form-group">
                    <select 
                        value={categoryId || ''} 
                        onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                    >
                        <option value="">Sin categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {taskToEdit?.id && (
                <div className="form-group checkbox-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{finished ? 'Marcar como pendiente' : 'Marcar como finalizado'}</span>
                        <input
                            type="checkbox"
                            checked={finished}
                            onChange={(e) => setFinished(e.target.checked)}
                        />
                    </label>
                </div>
            )}

            <div className="form-actions">
                <button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : taskToEdit ? 'Actualizar' : 'Crear'}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="cancel-btn">
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};

export default TaskForm;