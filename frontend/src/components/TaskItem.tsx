import type { Task } from '../types/types';
import { taskApi } from '../services/api';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: () => void;
    onStatusChanged: () => void;
}

const TaskItem = ({ task, onEdit, onDelete, onStatusChanged }: TaskItemProps) => {
    
    const handleFinish = async () => {
        if (task.finished) return;

        try {
            await taskApi.toggle(task.id);
            onStatusChanged();
        } catch (error) {
            console.error('Error cambiando estado:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const translatePriority = (priority: string): string => {
        if (priority === 'LOW') return 'Baja';
        if (priority === 'MEDIUM') return 'Media';
        if (priority === 'HIGH') return 'Alta';
        return priority;
    };

    const priorityColors = {
        LOW: 'priority-low',
        MEDIUM: 'priority-medium',
        HIGH: 'priority-high'
    };

    return (
        <div 
            className={`task-item ${task.finished ? 'finished' : ''}`}
            style={task.categoryColor ? { 
                backgroundColor: task.categoryColor,
                borderLeft: `4px solid rgba(0,0,0,0.15)`
            } : {}}
        >
            <div className="task-header">
                <div className="task-title-section">
                    <h3 style={{ color: getContrastText(task.categoryColor) }}>{task.title}</h3>

                    <span className={`priority-badge ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                        {translatePriority(task.priority)}
                    </span>
                </div>

                {task.categoryName && (
                    <span 
                        className="category-tag"
                        style={{ 
                            backgroundColor: getContrastText(task.categoryColor),
                            color: task.categoryColor
                        }}
                    >
                        {task.categoryName}
                    </span>
                )}
            </div>

            <p className="task-description" style={{ color: getContrastText(task.categoryColor, 0.8) }}>
                {task.description}
            </p>

            <div className="task-footer">
                <div className="task-dates">
                    <small style={{ color: getContrastText(task.categoryColor, 0.7) }}>
                        Creada: {formatDate(task.createdAt)}
                    </small>
                    <span className="date-separator" style={{ color: getContrastText(task.categoryColor, 0.5) }}>
                        |
                    </span>
                    <small style={{ color: getContrastText(task.categoryColor, 0.7) }}>
                        Modificada: {formatDate(task.updatedAt)}
                    </small>
                </div>

                <div className="task-actions">
                    {!task.finished && (
                        <button onClick={handleFinish} className="finish-btn">
                            Finalizar tarea
                        </button>
                    )}

                    <button className="edit-btn" onClick={() => onEdit(task)}>
                        Editar
                    </button>

                    <button onClick={onDelete} className="delete-btn">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Contrasta el texto según el color de fondo
function getContrastText(backgroundColor: string, opacity: number = 1): string {
    if (!backgroundColor) return `rgba(0, 0, 0, ${opacity})`;

    const hex = backgroundColor.replace('#', '');
    if (hex.length !== 6) return `rgba(0, 0, 0, ${opacity})`;

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    const lightText = `rgba(255, 255, 255, ${0.85 * opacity})`;
    const darkText = `rgba(0, 0, 0, ${0.75 * opacity})`;

    return luminance > 0.55 ? darkText : lightText;
}

export default TaskItem;
