import express from 'express';
import connectDB from '../config/db.js';

const router = express.Router();

// Obtener todos los autores
router.get('/', async (req, res) => {
    try {
        const connection = await connectDB();
        const [rows] = await connection.query('SELECT * FROM autores');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los autores');
    }
});

// Crear un nuevo autor
router.post('/', async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).send('Nombre del autor es obligatorio');
    }

    try {
        const connection = await connectDB();
        const [result] = await connection.query(
            'INSERT INTO autores (nombre) VALUES (?)',
            [nombre]
        );
        res.status(201).send(`Autor creado con ID: ${result.insertId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al crear el autor');
    }
});

// Actualizar un autor
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).send('Nombre del autor es obligatorio');
    }

    try {
        const connection = await connectDB();
        await connection.query(
            'UPDATE autores SET nombre = ? WHERE id = ?',
            [nombre, id]
        );
        res.send('Autor actualizado correctamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar el autor');
    }
});

// Eliminar un autor
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await connectDB();
        const [result] = await connection.query(
            'DELETE FROM autores WHERE id = ?',
            [id]
        );

        if (result.affectedRows > 0) {
            res.send('Autor eliminado correctamente');
        } else {
            res.status(404).send('Autor no encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el autor');
    }
});

export default router;
