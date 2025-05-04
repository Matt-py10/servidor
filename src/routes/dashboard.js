import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware de depuración para ver si `isAdmin` está funcionando
router.use((req, res, next) => {
    console.log(`Nueva solicitud a: ${req.path}, método: ${req.method}`);
    console.log('Encabezados de la solicitud:', req.headers);
    next();
});

// Servir el dashboard solo si el usuario tiene un token válido
router.get('/', (req, res)  => {
    console.log('Usuario autenticado. Sirviendo el dashboard.');
    const dashboardPath = path.join(__dirname, '../public/dashboard/dashboard.html');

    console.log('Ruta del archivo dashboard:', dashboardPath);

    if (!path.existsSync(dashboardPath)) {
        console.error('🚨 El archivo dashboard.html NO existe en:', dashboardPath);
        return res.status(500).send('Error: dashboard.html no encontrado.');
    }

    res.sendFile(dashboardPath, (err) => {
        if (err) {
            console.error('🚨 Error al servir el archivo:', err.message);
            res.status(500).send('Error al cargar el dashboard.');
        }
    });
});

router.get('/data', (req, res) => {
    console.log('Solicitud a /api/dashboard/data');

    const dashboardData = {
        totalUsers: 150,
        activeSessions: 35,
        newRegistrations: 12,
    };

    res.json(dashboardData);
});

export default router;

