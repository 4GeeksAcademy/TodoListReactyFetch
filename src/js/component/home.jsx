
import React, { useState, useEffect } from "react";
/* Aquí importamos React y los hooks useState y useEffect. - useState se usa para manejar el estado dentro del componente
 -useEffect se usa para manejar los efectos secundarios, como las llamadas a APIs.*/

const apiURLUsers = 'https://playground.4geeks.com/todo/users/loisinho'; //USUARIO
const apiURLTodos= 'https://playground.4geeks.com/todo/todos/loisinho'; //tareas


const Home = () => { //Usamos useState para crear dos estados:

    const [todos, setTodos] = useState([]); //todos: para almacenar la lista de tareas dentro de un [array]
    const [tarea, setTarea] = useState(""); // tarea: para manejar la entrada del usuario al agregar una nueva tarea

    useEffect(() => {
       getTarea()
    }, []); 

    const getTarea=() =>{
        fetch(apiURLUsers) //La función fetch envía una solicitud HTTP (como GET, POST, PUT, DELETE) a la URL de la API para obtener los datos de la API.
            .then(response => response.json()) //Cuando la respuesta llega del servidor, a través de "fetch", el primer "then" se ejecuta y convierte la respuesta a formato JSON.
            .then(data => { 
                console.log(data.todos, "esta es la info de los datos del array")
                setTodos(data.todos)}) //Este "then" maneja los datos (data) JSON y actualiza el estado de "todos" con setTodos
            .catch(error => console.log("Error al obtener datos ", error)); //catch maneja cualquier error que pueda ocurrir durante la solicitud o el procesamiento de la respuesta.
            // Es decir, si hay un error en cualquier punto del proceso de "fetch", ya sea en la solicitud o en la conversión de JSON, este bloque se ejecutará en la consola.
    }
  
    const addTarea = () => {
        // Verificar que la tarea no esté vacía. "tarea.trim()" elimina cualquier espacio en blanco al principio y al final de la cadena
        if (tarea.trim() !== "") {
            // Crear un objeto nuevaTarea con la etiqueta (label) de la tarea ingresada y done inicializado a false
            const nuevaTarea = { label: tarea, done: false };
    
           /* // Actualizar el estado de todos usando setTodos con una función de callback
            setTodos(prevTodos => {
                // prevTodos es el estado anterior de todos(antes de actualizar la lista)
                if (Array.isArray(prevTodos)) {
                    // Si prevTodos es un arreglo
                    return [...prevTodos, nuevaTarea]; // devolver un nuevo arreglo con todas las tareas anteriores más la nuevaTarea
                } else {
                    // Si prevTodos no es un arreglo (por ejemplo, null o undefined), devolver un arreglo con solo nuevaTarea
                    return [nuevaTarea];
                }
            });
    */
            // Sincronizar la lista de tareas con el servidor llamando a crearTareas
            crearTareas(nuevaTarea);
    
            // Limpiar el campo de entrada de tarea
            setTarea("");
        }
    };


/* crearTareas sincroniza la lista de tareas con el servidor. Usa fetch con el método PUT para enviar la lista actualizada. 
Cuando se completa, actualiza el estado todos con la respuesta del servidor.
 */

    const crearTareas = (nuevaListaDeTareas) => {
        console.log(nuevaListaDeTareas)
        fetch(apiURLTodos, {
            method: "POST",
            body: JSON.stringify(nuevaListaDeTareas),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data =>{
            getTarea()
            console.log(data)
        })
        .catch(error => console.log("Error al actualizar datos:", error));
    };



/* 
Crea una nueva lista de tareas nuevaListaDeTareas excluyendo la tarea en el índice especificado.
llama a crearTareas para actualizar la lista en el servidor. */

    // Función para eliminar una tarea de la lista con el botón delete.
    const eliminarTarea = (index, id) => {
        console.log(id) //el índex (indice) de la tarea que se quiere eliminar del [todos]
        // Eliminar la tarea del servidor
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, { // Asegúrate de que la URL correcta para eliminar la tarea con el id
            //Por ejemplo, si apiURLTodos es 'https://playground.4geeks.com/todo/todos/id' y id es '12345', entonces la URL resultante sería 'https://playground.4geeks.com/todo/todos/loisinho/12345'.
            //Esto es útil cuando necesitamos realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en recursos individuales identificados por su id único.
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(() => {
            // Eliminar la tarea localmente
            const nuevaListaDeTareas = todos.filter((_, i) => i !== index);//_, (que representa el elemento del arreglo actual en la iteración, pero no se usa) y i (que representa el índice de ese elemento en el arreglo).
            // la condición i !== index asegura que solo se incluyan en el nuevo arreglo nuevaListaDeTareas aquellos elementos cuyo índice i no sea igual al index 
            setTodos(nuevaListaDeTareas);// Actualizar el estado con la nueva lista de tareas
        })
        .catch(error => {
            console.log("Error al eliminar la tarea:", error);
        });
    };



/* BorraTodasLasTareas */
    const borrarTodasLasTareas = () => {
        // Envía una solicitud "DELETE" a la URL de la API para eliminar todas las tareas y actualiza la lista de tareas (setTodos)
        fetch(apiURLUsers, {
            method: "DELETE", // Indica al servidor que debe eliminar todas las tareas con el método DELETE
            headers: {
                "Content-Type": "application/json"
                // Una solicitud DELETE no suele enviar un cuerpo, por ejemplo como en fetch anterior, body: JSON.stringify(nuevaListaDeTareas),
            }
        })
        .then(response => response.json()) // Convierte la respuesta a JSON
        .then(() => setTodos([])) // Vaciar la lista de tareas en el estado
        .catch(error => console.log("Error al actualizar datos:", error)); // Maneja cualquier error que ocurra
    };
    	    

    console.log(todos)
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
           <button onClick={addTarea} className="btn btn-primary ms-2">Añadir</button>
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

//<button onClick={addTarea} className="btn btn-primary ms-2">Add</button> creo el botón que añade la tarea al hacer clic. "onClick" llama a la función addTarea.
//<button onClick={borrarTarea} className="btn btn-warning mt-3">Clear All</button> creo el botón que borra la tarea al hacer clic en la x. "onClick" llama a la función borrarTarea.
//Lista no ordenada (ul) de Bootstrap para mostrar las tareas (list-group). mt-3 aplica un margen superior.
//todos?.map((elemArrtodos, index) => ...) asegura que cada tarea se renderice dinámicamente en la lista. El atributo key={index} es crucial para que React identifique cada elemento de lista de manera única, es decir, cada tarea nueva "tendria" como una clave.
//elemArrTod es el nombre que has elegido para el parámetro que representa cada elemento del array todos en cada iteración de map.

