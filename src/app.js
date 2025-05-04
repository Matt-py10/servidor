import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import usuariosRoutes from './routes/usuarios.js';
import dashboardRoutes from './routes/dashboard.js';
import autoresRoutes from './routes/autores.js';
import librosRoutes from './routes/libros.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

dotenv.config(); // Cargar variables de entorno desde .env
/* ======== INICIALIZACIÓN ======== */
const app = express(); // Inicialización de Express

/* Conectar a la base de datos antes de iniciar el servidor */
connectDB()
    .then(() => {
        console.log('Conexión exitosa a la base de datos');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al conectar la DB:', err);
        process.exit(1); // Salir del proceso con un código de error
    });
;


// Configuración de path para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config(); // Configura dotenv


/* ======== CONFIGURACIÓN ======== */
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Asegura que coincida con el frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json()); // Middleware para procesar JSON
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true })); // Permitir lectura de datos codificados en formularios

app.use((req, res, next) => {
    if (req.path.includes('___vscode_livepreview_injected_script')) {
        return res.status(204).end(); // Ignora la solicitud sin afectar el servidor
    }
    next();
});


/* Middleware de depuración para ver cada solicitud */
app.use((req, res, next) => {
    console.log(`[${req.method}] Solicitud a ${req.path}`);
    next();
});

/* ======== RUTAS ======== */

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/autores', autoresRoutes);
app.use('/api/libros', librosRoutes);

app.get('/register', (req, res) => {
    const registerPath = path.join(__dirname, '../public/register/register.html');
    console.log(`Sirviendo archivo: ${registerPath}`);
    res.sendFile(registerPath);
});

/* Ruta personalizada para servir login.html */
app.get('/login', (req, res) => {
    const loginPath = path.join(__dirname, '../public/login/login.html');
    console.log(`Sirviendo archivo: ${loginPath}`);
    res.sendFile(loginPath);
});

/* Servir `dashboard.html` correctamente */
app.get('/dashboard', (req, res) => {
    const dashboardPath = path.join(__dirname, '../public/dashboard/dashboard.html');
    console.log(`Sirviendo archivo: ${dashboardPath}`);
    res.sendFile(dashboardPath, (err) => {
        if (err) {
            console.error('🚨 Error al servir el archivo:', err.message);
            res.status(500).send('Error al cargar el dashboard.');
        }
    });
});



/* Ruta raíz para pruebas */
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '../public/index/index.html');
    res.sendFile(indexPath);
});;

/* Manejo de rutas no encontradas */
app.use((req, res) => {
    console.error(`Ruta no encontrada: ${req.path}`);
    res.status(404).json({ error: 'Ruta no encontrada' });
});
