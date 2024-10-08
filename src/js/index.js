// Importa React y ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importa estilos globales de tu aplicación (CSS)
import '../styles/index.css';

// Importa el componente Home que contiene tu aplicación React
import Home from './component/home.jsx';

// Importa Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Renderiza tu aplicación React
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Home />);