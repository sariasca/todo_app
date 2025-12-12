import type { Task } from '../types/types';
import { taskApi } from '../services/api';
import { Trash, SquarePen, Pencil, CalendarPlus, 
    BookCheck, CircleCheckBig } from 'lucide-react';

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

    return (
        <div 
            className={`relative rounded-2xl overflow-hidden border border-gray-700/30 transition-all 
                duration-300 hover:scale-[1.01] hover:shadow-2xl ${
                task.finished ? 'opacity-70' : ''
            }`}
            style={task.categoryColor ? { 
                backgroundColor: task.categoryColor,
                borderLeft: `6px solid rgba(0,0,0,0.2)`
            } : { backgroundColor: '#4B5563' }}
        >
            {/* Titulo y prioridad */}
            <div className="bg-linear-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">     
                        <h3 
                            className={`text-xl text-gray-200 font-bold truncate ${task.finished ? 'line-through' : ''}`}
                        >
                            {task.title}
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 ${
                            task.priority === 'HIGH' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                            task.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                            'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}>
                            {translatePriority(task.priority)}
                        </span>
                        
                        {task.finished && (
                            <div className="px-3 gap-1 py-1.5 border-2 border-green-500 bg-green-500/70 rounded-full 
                            flex flex-row items-center justify-center shadow-lg">
                                <span className="text-green-300  text-sm font-bold">
                                    Completada
                                </span>
                                <span>
                                    <CircleCheckBig />
                                </span>                
                            </div>                        
                        )}
                    </div>
                </div>
                
                {task.categoryName && (
                    <div className="mt-3 flex items-center gap-2">
                        <span 
                            className="px-3 py-1.5 text-gray-200"
                        >
                            {task.categoryName}
                        </span>
                    </div>
                )}
            </div>

            {/* Tarea */}
            <div className="p-6">
                <p 
                    className={`text-lg mb-6 leading-relaxed ${task.finished ? 'line-through' : ''}`}
                    style={{ color: getContrastText(task.categoryColor, 0.85) }}
                >
                    {task.description}
                </p>

                {/* Footer con fechas y acciones */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-4 border-t border-gray-700/30">
                    <div className="flex flex-wrap text-shadow-white p-2 items-center bg-slate-500/60 rounded-2xl gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-300"><CalendarPlus /></span>
                            <small>
                                <span className="font-medium">Creada:</span> {formatDate(task.createdAt)}
                            </small>
                        </div>                    
                        <span className="hidden sm:inline text-gray-300">•</span>                    
                        <div className="flex items-center gap-2">
                            <span className="text-gray-300"><Pencil /></span>
                            <small>
                                <span className="font-medium">Modificada:</span> {formatDate(task.updatedAt)}
                            </small>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {!task.finished && (
                            <button 
                                onClick={handleFinish}
                                className="p-2.5 rounded-xl border-2 cursor-pointer bg-linear-to-r from-green-600 to-emerald-600 
                                hover:border-green-400 flex items-center justify-center hover:bg-green-400/20 transition-colors"
                                title="Marcar como completada"
                            >
                                <span><BookCheck /></span>                        
                                <span>Finalizar</span>
                            </button>
                        )}

                        <button 
                            onClick={() => onEdit(task)}
                            className="px-4 py-2.5 border-2 cursor-pointer bg-linear-to-r from-blue-600 to-blue-700 
                            hover:border-blue-400 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl 
                            shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                        >
                            <span><SquarePen /></span>
                            <span>Editar</span>
                        </button>

                        <button 
                            onClick={onDelete}
                            className="px-4 py-2.5 border-2 cursor-pointer bg-linear-to-r from-red-600 to-red-700 hover:border-red-400 
                            hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg 
                            transition-all duration-300 flex items-center gap-2"
                        >
                            <span><Trash /></span>
                            <span>Eliminar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Contrasta el texto según el color de fondo
function getContrastText(backgroundColor: string | undefined, opacity: number = 1): string {
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
