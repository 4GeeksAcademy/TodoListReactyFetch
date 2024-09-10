import React, { useState, useEffect } from "react";

// URL de la API
const apiURLUsers = 'https://playground.4geeks.com/todo/users/Loisinho'; // URL del usuario
const apiURLTodos = 'https://playground.4geeks.com/todo/todos/Loisinho'; // URL de las tareas

const Home = () => {
    const [todos, setTodos] = useState([]); // Estado para las tareas
    const [tarea, setTarea] = useState(""); // Estado para la nueva tarea

    // Función para crear un usuario si no existe
    const crearUsuario = () => {
        fetch(apiURLUsers, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            
        })
        .then(response => response.json())
        .then(data => console.log("Usuario creado:", data))
        .catch(error => console.log("Error al crear el usuario: ", error));
    };


    const obtenerTareas = () => {
        fetch(apiURLUsers, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            
        })
        .then(response => response.json())
        .then(data =>  setTodos(data.todos))
        .catch(error => console.log("Error al crear el usuario: ", error));
    };

    // useEffect para cargar las tareas y crear usuario si no existe
    useEffect(() => {
        // Verificar si el usuario existe
        crearUsuario()
        obtenerTareas()
    }, []);

    const añadirTarea = () => {
    if (tarea.trim() !== "") {
        const nuevaTarea = { label: tarea, done: false };
        if (Array.isArray(todos)) {
            const updatedTodos = [...todos, nuevaTarea]; // Usa el operador de esparcimiento
            setTodos(updatedTodos); // Actualiza el estado con la nueva lista de tareas
            sincroConServidor(updatedTodos); // Sincroniza la lista de tareas con el servidor
            setTarea(""); // Limpia el campo de entrada
        } else {
            console.log("El estado de tareas no es un array:", todos);
        }
    }
};

    // Función para eliminar una tarea
    const eliminarTarea = (index, id) => {
        fetch(`${apiURLTodos}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(() => {
            const nuevaListaDeTareas = todos.filter((_, i) => i !== index);
            setTodos(nuevaListaDeTareas);
            sincroConServidor(nuevaListaDeTareas);
        })
        .catch(error => console.log("Error al eliminar la tarea: ", error));
    };

    // Función para borrar todas las tareas
    const borrarTodasLasTareas = () => {
        fetch(apiURLTodos, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(() => {
            setTodos([]);
            sincroConServidor([]);
        })
        .catch(error => console.log("Error al borrar todas las tareas: ", error));
    };

    // Función para sincronizar la lista de tareas con el servidor
    const sincroConServidor = (updatedTodos) => {
        fetch(apiURLTodos, {
            method: "PUT",
            body: JSON.stringify(updatedTodos),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => console.log("Lista sincronizada con el servidor:", data))
        .catch(error => console.log("Error al sincronizar con el servidor: ", error));
    };

    return (
        <div className="container text-center mt-5">
            <h1>Mi lista de tareas</h1>
            <input
                type="text"
                value={tarea}
                onChange={(e) => setTarea(e.target.value)}
                placeholder="Añade una nueva tarea"
            />
            <button onClick={añadirTarea} className="btn btn-primary ms-2">Añadir</button>
            <ul className="list-group mt-3">
                {Array.isArray(todos) && todos.map((elemArrTodos, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {elemArrTodos.label}
                        <button onClick={() => eliminarTarea(index, elemArrTodos.id)} className="btn btn-danger">Eliminar</button>
                    </li>
                ))}
            </ul>
            <button onClick={borrarTodasLasTareas} className="btn btn-warning mt-3">Borrar todas las tareas</button>
        </div>
    );
};

export default Home;
