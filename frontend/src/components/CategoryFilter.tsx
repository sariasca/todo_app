import { useState } from 'react';
import type { Category } from '../types/types';
import { categoryApi } from '../services/api';
import { Trash, SquareX, CirclePlus, MousePointerClick, CircleX } from 'lucide-react';

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: number | null;
    onSelectCategory: (categoryId: number | null) => void;
    onCategoryCreated?: (category?: Category) => void;
}

const getTextColor = (hex: string) => {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return "#000000";
    const c = hex.substring(1);
    if (c.length !== 6) return "#000000";
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    const brightness = r*0.299 + g*0.587 + b*0.114;
    return brightness > 150 ? "#111111" : "#ffffff";
};

const CategoryFilter = ({
    categories,
    selectedCategory,
    onSelectCategory,
    onCategoryCreated
}: CategoryFilterProps ) => {
    const [showForm, setShowForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#3B82F6');
    const [deleteMode, setDeleteMode] = useState(false);

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            const response = await categoryApi.create({
                name: newCategoryName.trim(),
                color: newCategoryColor
            });

            const createdCategory = response.data?.data;
            
            if (!createdCategory) {
                console.error("No se pudo extraer categoría");
                return;
            }

            setNewCategoryName('');
            setShowForm(false);
            onCategoryCreated?.(createdCategory);

        } catch (error) {
            console.error('Error creando categoría:', error);
        }
    };

    const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
        if (!window.confirm(`¿Seguro que quieres eliminar la categoría "${categoryName}"?\nSe eliminarán todas sus tareas.`)) {
            return;
        }

        try {
            await categoryApi.delete(categoryId);
            // Recargar categorías
            if (onCategoryCreated) {
                onCategoryCreated();
            }
            setDeleteMode(false);
        } catch (error) {
            console.error('Error eliminando categoría:', error);
            alert('No se pudo eliminar la categoría. Asegúrate de que no tenga tareas.');
        }
    };

    return (
        <div className="space-y-4">
            {/* Modo eliminación */}
            <div className="flex justify-between items-center mb-4">                
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-100 mb-2">Categorías</h2>
                <div className="w-full h-1 bg-linear-to-r from-blue-500 to-cyan-400 rounded-full"></div>
            </div>
                {categories.length > 0 && (
                    <button
                        onClick={() => setDeleteMode(!deleteMode)}
                        className={`px-3 py-1.5 cursor-pointer text-sm rounded-lg font-medium transition-colors ${
                            deleteMode 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        }`}
                    >
                        {deleteMode ? (
                            <>
                                <div className="flex gap-2">
                                    <SquareX />
                                    <span>Cancelar</span>
                                </div>
                            </>
                            ) : (
                            <>
                            <div className="flex gap-2">
                                <Trash />
                                <span>Eliminar</span>
                            </div>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Lista de categorías */}
            <div className="space-y-3 h-96 overflow-y-scroll">
                <div className="relative group">
                    <button
                        onClick={() => onSelectCategory(null)}
                        className={`flex items-center justify-between w-full rounded-xl px-4 py-4 cursor-pointer transition-all duration-200 ${
                            selectedCategory === null 
                                ? 'bg-linear-to-r from-gray-300 to-gray-400 text-gray-900 shadow-lg' 
                                : 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-left">
                                <div className="font-semibold">Todas las tareas</div>
                                <div className="text-sm opacity-80">Ver todas las categorías</div>
                            </div>
                        </div>
                        <div className="bg-gray-900 text-gray-300 px-3 py-1.5 rounded-lg font-bold">
                            {categories.reduce((acc, cat) => acc + (cat.taskCount || 0), 0)}
                        </div>
                    </button>
                </div>

                {/* Categorías personalizadas */}
                {categories.map((category) => {
                    const textColor = getTextColor(category.color || '#3B82F6');
                    
                    return (
                        <div 
                            key={category.id} 
                            className={`relative rounded-xl overflow-hidden transition-all duration-200 ${
                                selectedCategory === category.id 
                                    ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-blue-400' 
                                    : ''
                            } ${deleteMode ? 'ring-2 ring-red-500' : ''}`}
                            style={{
                                borderColor: selectedCategory === category.id ? category.color : 'transparent'
                            }}
                        >
                            <div className="bg-linear-to-r from-gray-700 to-gray-800 px-4 py-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                                            style={{ 
                                                backgroundColor: category.color,
                                                color: textColor
                                            }}
                                        >
                                            {category.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-100">{category.name}</div>
                                            <div className="text-xs text-gray-400">{category.taskCount || 0} tareas</div>
                                        </div>
                                    </div>
                                    
                                    {/* Contador tareas en categoria */}
                                    <div 
                                        className="px-3 py-1.5 rounded-lg font-bold text-sm min-w-10 text-center"
                                        style={{ 
                                            backgroundColor: category.color,
                                            color: textColor
                                        }}
                                    >
                                        {category.taskCount || 0}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (deleteMode) {
                                        handleDeleteCategory(category.id, category.name);
                                    } else {
                                        onSelectCategory(category.id);
                                    }
                                }}
                                className={`w-full px-4 py-4 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                                    deleteMode 
                                        ? 'hover:bg-red-900/30' 
                                        : 'hover:brightness-110'
                                }`}
                                style={{
                                    backgroundColor: category.color,
                                    color: textColor
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    {deleteMode ? (
                                        <>
                                        <div className='flex gap-3 p-2 bg-slate-600/30 text-white rounded-md hover:bg-red-500/70 transition-colors'>
                                            <span className="text-xl  "><Trash /></span>
                                            <span className="font-medium">Eliminar categoría</span>

                                        </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-medium">Ver tareas</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Formulario para nueva categoría */}
            {!showForm ? (
                <button
                    onClick={() => setShowForm(true)}
                    className="group relative bg-linear-to-r cursor-pointer from-blue-600 to-blue-400 text-white font-semibold px-6 py-3 rounded-xl shadow-lg 
                    transition-all duration-300
                            hover:shadow-xl hover:scale-105 flex items-center gap-3"
                >
                    <span className="text-xl group-hover:rotate-90 transition-transform"><CirclePlus /></span>
                    <span>Nueva categoría</span>
                    <div className="absolute inset-0 rounded-xl border border-blue-400/30 group-hover:border-blue-300/50 transition-colors"></div>
                </button>
            ) : null}

            {/* Modal para crear categoría */}
            {showForm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex rounded-lg items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-linear-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 relative animate-slideUp">
                        <button 
                            className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-white text-2xl hover:bg-gray-800 w-10 h-10 rounded-full 
                            flex items-center justify-center transition-colors"
                            onClick={() => {
                                setShowForm(false);
                            }}
                        >
                            <CircleX />
                        </button>
                        
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-2xl font-bold bg-linear-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                                    Nueva Categoría
                                </h3>
                            </div>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Nombre de la categoría</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Trabajo, Personal, Estudios..."
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none 
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-gray-300 font-medium mb-3">Color de la categoría</label>
                                    
                                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="color"
                                                value={newCategoryColor}
                                                onChange={(e) => setNewCategoryColor(e.target.value)}
                                                className="w-12 h-12 cursor-pointer rounded-lg border-2 border-gray-600 hover:border-blue-400 transition-colors"
                                                title="Elegir color"
                                            />
                                            <div>
                                                <div className="text-gray-400 text-sm">Color actual:</div>
                                                <div className="text-gray-100 font-bold">{newCategoryColor}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleCreateCategory}
                                        disabled={!newCategoryName.trim()}
                                        className="flex gap-1 cursor-pointer flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                                        disabled:gray-700 text-white font-medium py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <span className='pl-2'>Crear </span>
                                        <MousePointerClick />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowForm(false);
                                        }}
                                        className="cursor-pointer flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-3 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryFilter;