import { useState } from 'react'
import './App.css'

function App() {
  return (
    <>
    <title>App de Notas</title>    
      <h1>App de Notas</h1>     
      <p className="read-the-docs">
        Sencilla aplicación para tomar notas rápidas.
      </p>

      <div>
        <input type="text" placeholder='Titulo' value={""}/> 
        <input type="text" placeholder='Descripción' value={""}/>
        <button>Añadir</button>
      </div>

      <div className="notes">
        <div className="note">
          <h3>Titulo Nota</h3>
          <p>Descripcion nota</p>

          <button>Editar</button>
          <button>Eliminar</button>
        </div>
      </div>
    </>
  )
}

export default App
