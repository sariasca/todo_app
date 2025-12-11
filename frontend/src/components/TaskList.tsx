import { useState } from 'react';
import type { Task } from '../types/types';
import TaskItem from './TaskItem';
import { taskApi } from '../services/api';
import TaskForm from './TaskForm';

interface TaskListProps {
    tasks: Task[];
    onTasksUpdated: () => void;
}

const TaskList = ({ tasks, onTasksUpdated }: TaskListProps) => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending' && task.finished) return false;
        if (filter === 'completed' && !task.finished) return false;
        
        if (searchTerm) {
            return task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   task.description.toLowerCase().includes(searchTerm.toLowerCase());
        }
        
        return true;
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
        <div className="task-list">
            <div className="list-header">
                <div className="stats">
                    <span>Total: {stats.total}</span>
                    <span>Pendientes: {stats.pending}</span>
                    <span>Completadas: {stats.completed}</span>
                </div>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Buscar tareas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
                    >
                        <option value="all">Todas</option>
                        <option value="pending">Pendientes</option>
                        <option value="completed">Completadas</option>
                    </select>
                </div>
            </div>

            <div className="tasks-container">
                {filteredTasks.length === 0 ? (
                    <p className="empty-state">No hay tareas {searchTerm ? 'con ese término' : 'en esta categoría'}</p>
                ) : (
                    filteredTasks.map(task => (
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

            {editingTask && (
                <div className="edit-modal">
                    <div className="modal-content">
                        <h3>Editar Tarea</h3>
                        
                        <TaskForm 
                            taskToEdit={editingTask}
                            onTaskSaved={() => {
                                setEditingTask(null);
                                onTasksUpdated();
                            }}
                            onCancel={() => setEditingTask(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;