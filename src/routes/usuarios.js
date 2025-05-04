import express from 'express';
import connectDB from '../config/db.js';
import bcrypt from 'bcrypt'; // Para encriptar contraseñas
import jwt from 'jsonwebtoken'; // Para generar tokens
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        console.log('Cuerpo recibido:', req.body);

        const { nombre, nickname, email, contraseña, perfil } = req.body;

        if (!nombre || !nickname || !email || !contraseña) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const connection = await connectDB();

        // Verificar si el email ya está registrado
        const [existingUser] = await connection.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'El email ya está registrado' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Insertar el usuario con perfil por defecto si no se proporciona
        const [result] = await connection.query(
            'INSERT INTO usuarios (nombre, nickname, email, contraseña, perfil) VALUES (?, ?, ?, ?, ?)',
            [nombre, nickname, email, hashedPassword, perfil || 'usuario']
        );

        res.status(201).json({ mensaje: 'Usuario creado correctamente', id: result.insertId });
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});
// Login (autenticación de usuario)
router.post('/login', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    const { email, contraseña } = req.body;

    try {
        const connection = await connectDB();
        console.log('Conexión establecida con la base de datos.');

        // Buscar al usuario en la base de datos
        const [rows] = await connection.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        console.log('Usuario encontrado:', rows);

        if (rows.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const usuario = rows[0];
        console.log('Contraseña recibida:', contraseña);
        console.log('Contraseña almacenada:', usuario.contraseña);

        const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
        console.log('¿Coinciden las contraseñas?', isMatch);

        if (!isMatch) {
            return res.status(401).send('Credenciales incorrectas');
        }

        // Generar un token JWT
        const token = jwt.sign(
            { id: usuario.id, perfil: usuario.perfil },
            process.env.JWT_SECRET || 'long_secret_key',
            { expiresIn: '1h' }
        );
        console.log('Token generado:', token);

        res.json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al iniciar sesión');
    }
});

       

// Obtener información de todos los usuarios
router.get('/', async (req, res) => {
    try {
      console.log('Paso 1: Solicitud GET recibida');
      const connection = await connectDB();
      console.log('Paso 2: Conexión a la base de datos establecida');
      const [usuarios] = await connection.query('SELECT * FROM usuarios');
      console.log('Paso 3: Usuarios recuperados:', usuarios);
      res.status(200).json(usuarios);
    } catch (err) {
      console.error('Error en GET /api/usuarios:', err);
      res.status(500).send('Error en el servidor');
    }
  });
  
  
// Actualizar información de un usuario

router.put('/contraseña/:id', async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario de los parámetros de la URL
    const { nuevaContraseña } = req.body; // Obtener la nueva contraseña del body de la solicitud

    try {
        // Encripta la nueva contraseña
        const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

        const connection = await connectDB();

        // Actualiza la contraseña en la base de datos
        const [result] = await connection.query(
            'UPDATE usuarios SET contraseña = ? WHERE id = ?',
            [hashedPassword, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.send('Contraseña actualizada correctamente');
    } catch (err) {
        console.error('Error al actualizar contraseña:', err);
        res.status(500).send('Error en el servidor');
    }
});


// Eliminar un usuario
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await connectDB();
        await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);

        res.send('Usuario eliminado exitosamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar usuario');
    }
});

export default router;
