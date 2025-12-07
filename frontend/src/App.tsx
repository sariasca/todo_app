import { useState } from 'react'
import './App.css'

function App() {
  return (
    <>
    <title>App de Tareas</title>    
      <h1>App de Tareas pendientes</h1>     
      <p className="read-the-docs">
        Sencilla aplicación para apuntar tareas pendientes, con categoria y prioridad.
      </p>

      <div>
        <input type="text" placeholder='Titulo' value={""}/> 
        <input type="text" placeholder='Descripción' value={""}/>
        <button>Añadir</button>
      </div>

      <div className="tasks">
        <div className="task">
          <h3>Titulo Tarea</h3>
          <p>Descripcion tarea</p>
          <p>Fecha creacion</p>
          <p>Fecha modificacion</p>

          <button>Editar</button>
          <button>Eliminar</button>
        </div>
      </div>
    </>
  )
}

export default App
