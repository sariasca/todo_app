import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import CategoryFilter from './components/CategoryFilter';
import type { Task, Category } from './types/types';
import { taskApi, categoryApi } from './services/api';
import './App.css';
import { CirclePlus, CircleX } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskApi.getAll();
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data.data);      
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  /** Refresca los datos de tareas y categorías */
  const refreshData = async () => {
    await Promise.all([
      fetchTasks(),
      fetchCategories()
    ]);
  };

  const handleCategorySelect = (categoryId: number | null) => {    
    setSelectedCategory(categoryId);    
  };

  const handleCategoryCreated = (createdCategory?: Category) => {
    if (!createdCategory) {
      console.warn("⚠️ No se recibió categoría creada. Refecth completo.");
      fetchCategories();
      return;
    }

    setCategories(prev => {
      if (prev.some(c => c.id === createdCategory.id)) return prev;
      return [...prev, createdCategory];
    });
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="app min-h-screen bg-linear-to-br from-slate-700 to-gray-900 text-gray-100">
      <header className="
        bg-linear-to-r from-blue-700/20 to-purple-700/20 
        backdrop-blur-xl 
        border-b border-gray-700/40 
        py-10 px-4 mb-8 rounded-md
      ">
        <div className="max-w-7xl mx-auto text-center">

          <h1 className="
            text-4xl md:text-5xl font-bold
            bg-linear-to-r from-blue-400 to-purple-300
            bg-clip-text text-transparent pb-2 mb-4
            ">
            Aplicación de gestión de tareas
          </h1>

          <p className="text-gray-100 text-lg max-w-2xl mx-auto">
            Organiza y gestiona tareas categorizando y escogiendo una prioridad para cada una.
          </p>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-1/3 xl:w-1/4">
            <div className="bg-linear-to-b from-slate-700/60 to-slate-900/60 backdrop-blur-lg rounded-2xl 
            shadow-2xl p-6 border border-gray-700/50 sticky top-6">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
                onCategoryCreated={handleCategoryCreated}
              />
            </div>
          </aside>
          
          <section className="flex-1 min-w-0">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-3xl font-bold text-gray-100 mb-2">
                  Tus Tareas
                  {selectedCategory && (
                    <span className="text-blue-300 ml-2 inline-block max-w-full truncate align-bottom">
                      → {categories.find(c => c.id === selectedCategory)?.name}
                    </span>
                  )}
                </h2>
              </div>
              
              <button
                onClick={() => setShowTaskForm(true)}
                className="group relative bg-linear-to-r cursor-pointer from-blue-600 to-purple-600 hover:from-blue-500
                hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 
                hover:shadow-xl hover:scale-105 flex items-center gap-3"
              >
                <span className="text-xl group-hover:rotate-90 transition-transform"><CirclePlus /></span>
                <span className="text-lg">Nueva Tarea</span>
                <div className="absolute inset-0 rounded-xl border border-blue-400/30 group-hover:border-blue-300/50 transition-colors"></div>
              </button>
            </div>

            <div className="relative rounded-2xl shadow-xl p-6 bg-cyan-900/80 border border-white/10">
              <TaskList 
                tasks={tasks} 
                onTasksUpdated={refreshData} 
                selectedCategory={selectedCategory}  
              />
            </div>
          </section>
        </div>
      </div>

      {/* Modal editar */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-linear-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 
          relative animate-slideUp">
            <button 
              className="absolute cursor-pointer top-1 right-2 text-gray-400 hover:text-white text-2xl hover:bg-gray-800 w-10 h-10 
              rounded-full flex items-center justify-center transition-colors"
              onClick={() => setShowTaskForm(false)}
            >
              <CircleX />
            </button>
            
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <h3 className="text-2xl font-bold bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Crear Nueva Tarea
                </h3>
              </div>
              
              <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 rounded-xl mt-4 border border-gray-700/30">
                <TaskForm
                  categories={categories}
                  onSuccess={() => {
                    refreshData();
                    setShowTaskForm(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
