import React, { useState, useEffect } from "react";
/* Aquí importamos React y los hooks useState y useEffect. - useState se usa para manejar el estado dentro del componente
 -useEffect se usa para manejar los efectos secundarios, como las llamadas a APIs.*/

const apiURL = 'https://playground.4geeks.com/todo/user/loisinho';

const Home = () => { //Usamos useState para crear dos estados:

    const [todos, setTodos] = useState([]); //todos: para almacenar la lista de tareas dentro de un [array]
    const [tarea, setTarea] = useState(""); // tarea: para manejar la entrada del usuario al agregar una nueva tarea

//useEffect para cargar las tareas iniciales desde la API cuando el componente se monta

    useEffect(() => {
        fetch(apiURL) //La función fetch envía una solicitud HTTP (como GET, POST, PUT, DELETE) a la URL de la API para obtener los datos de la API.
            .then(response => response.json()) //Cuando la respuesta llega del servidor, a través de "fetch", el primer "then" se ejecuta y convierte la respuesta a formato JSON.
            .then(data => setTodos(data)) //Este "then" maneja los datos (data) JSON y actualiza el estado de "todos" con setTodos.
            .catch(error => console.log("Error al obtener datos ", error)); //catch maneja cualquier error que pueda ocurrir durante la solicitud o el procesamiento de la respuesta.
			// Es decir, si hay un error en cualquier punto del proceso de "fetch", ya sea en la solicitud o en la conversión de JSON, este bloque se ejecutará en la consola.
    }, []);

	const addTarea = () => { //addTarea agrega una nueva tarea a la lista
		// Verificar que la tarea no esté vacía. "tarea.trim()" elimina cualquier espacio en blanco al principio y al final de la cadena
		if (tarea.trim() !== "") {
			/* Crear un nuevo arreglo de tareas (incluyendo la nueva tarea). 
			"...", se utiliza para copiar los elementos de un arreglo, en este caso [todos] o las propiedades de un objeto. En este caso, copiar todas las tareas existentes en todos y agregar una nueva tarea */
			const nuevaListaDeTareas = [...todos, { label: tarea, done: false }]; //las tareas con done: false para indicar que las tareas aún no han sido completadas.
			// Actualizar la lista de tareas con el nuevo arreglo
			actualizarTareas(nuevaListaDeTareas);
			// Limpiar el campo de entrada
			setTarea("");
		}
	};
	
/* Elimina una tarea de la lista. 
Crea una nueva lista de tareas nuevaListaDeTareas excluyendo la tarea en el índice especificado.
llama a actualizarTareas para actualizar la lista en el servidor. */
    const eliminarTarea = (index) => { //el índex (indice) de la tarea que se quiere eliminar del [todos]
        const nuevaListaDeTareas = todos.filter((_, i) => i !== index); //_, (que representa el elemento del arreglo actual en la iteración, pero no se usa) y i (que representa el índice de ese elemento en el arreglo).
        // la condición i !== index asegura que solo se incluyan en el nuevo arreglo nuevaListaDeTareas aquellos elementos cuyo índice i no sea igual al index 
        actualizarTareas(nuevaListaDeTareas);
    };


/* actualizarTareas sincroniza la lista de tareas con el servidor. Usa fetch con el método PUT para enviar la lista actualizada. 
Cuando se completa, actualiza el estado todos con la respuesta del servidor.
 */
    const actualizarTareas = (nuevaListaDeTareas) => {
        fetch(apiURL, {
            method: "PUT",
            body: JSON.stringify(nuevaListaDeTareas),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => setTodos(data))
        .catch(error => console.log("Error updating data: ", error));
    };

/* clearTasks limpia todas las tareas llamando a actualizarTareas con una lista vacía.

 */	
    const borrarTarea = () => {
        actualizarTareas([]);
    };

/* 
En el return (Home), definimos la interfaz de usuario
-(input) para agregar nuevas tareas.
-Un botón para agregar la tarea (Add).
-Una lista (ul) que mapea sobre todos y muestra cada tarea con un botón de eliminación.
-Un botón para limpiar todas las tareas (Clear All). 

*/	
    return (
        <div className="container text-center mt-5">
            <h1>Mi lista de tareas</h1>
            <input
                type="text"
                value={tarea}
                onChange={(e) => setTarea(e.target.value)}
                placeholder="Añade una nueva tarea"
            />
            <button onClick={addTarea} className="btn btn-primary ms-2">Add</button>
            <ul className="list-group mt-3">
                {todos.map((todo, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {todo.label}
                        <button onClick={() => eliminarTarea(index)} className="btn btn-danger">Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={borrarTarea} className="btn btn-warning mt-3">Clear All</button>
        </div>
    );
};

export default Home;
