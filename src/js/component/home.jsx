
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
//Cada vez que cambia el estado (tarea o todos), React automáticamente vuelve a renderizar el componente Home para reflejar esos cambios en la interfaz de usuario.

    return ( //Renderización donde React actualiza el DOM para reflejar los cambios en el estado de los componentes ( useStatey useEffect) 
        //Todo el código JSX que está dentro del return es lo que se va a renderizar en el navegador cuando esta const (Home) se invoque.
        //Defino un contenedor con Bootstrap para centrar el contenido (text-center) y aplicar márgenes (mt-5).
        <div className="container text-center mt-5"> 
            <h1>Mi lista de tareas</h1>
            <input //input controlado por estado (tarea) que permite al usuario ingresar nuevas tareas.
                type="text"
                value={tarea} //value está vinculado a tarea
                onChange={(e) => setTarea(e.target.value)}//onChange actualiza tarea cada vez que el usuario escribe en el input.
                placeholder="Añade una nueva tarea"
            /> 
            <button onClick={addTarea} className="btn btn-primary ms-2">Add</button>
            <ul className="list-group mt-3"> 
                {todos.map((elemArrTodos, index) => ( 
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center"> 
                        {elemArrTodos.label}
                        <button onClick={() => eliminarTarea(index)} className="btn btn-danger">Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={borrarTarea} className="btn btn-warning mt-3">Clear All</button>
        </div>
    );
};

export default Home;

//<button onClick={addTarea} className="btn btn-primary ms-2">Add</button> creo el botón que añade la tarea al hacer clic. "onClick" llama a la función addTarea.
//<button onClick={borrarTarea} className="btn btn-warning mt-3">Clear All</button> creo el botón que borra la tarea al hacer clic en la x. "onClick" llama a la función borrarTarea.
//Lista no ordenada (ul) de Bootstrap para mostrar las tareas (list-group). mt-3 aplica un margen superior.
//todos.map((elemArrtodos, index) => ...) asegura que cada tarea se renderice dinámicamente en la lista. El atributo key={index} es crucial para que React identifique cada elemento de lista de manera única, es decir, cada tarea nueva "tendria" como una clave.
//elemArrTod es el nombre que has elegido para el parámetro que representa cada elemento del array todos en cada iteración de map.

