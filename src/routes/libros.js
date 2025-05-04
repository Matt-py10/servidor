import express from 'express';
import connectDB from '../config/db.js';

const router = express.Router();

// Obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const connection = await connectDB();
        const [rows] = await connection.query('SELECT * FROM libros');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los libros');
    }
});

// Crear un nuevo libro
router.post('/', async (req, res) => {
    const { titulo, autor_id, genero } = req.body;

    if (!titulo || !autor_id) {
        return res.status(400).send('Título y Autor son obligatorios');
    }

    try {
        const connection = await connectDB();
        const [result] = await connection.query(
            'INSERT INTO libros (titulo, autor_id, genero) VALUES (?, ?, ?)',
            [titulo, autor_id, genero || null]
        );
        res.status(201).send(`Libro creado con ID: ${result.insertId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al crear el libro');
    }
});

// Actualizar un libro
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, autor_id, genero } = req.body;

    if (!titulo || !autor_id) {
        return res.status(400).send('Título y Autor son obligatorios');
    }

    try {
        const connection = await connectDB();
        await connection.query(
            'UPDATE libros SET titulo = ?, autor_id = ?, genero = ? WHERE id = ?',
            [titulo, autor_id, genero || null, id]
        );
        res.send('Libro actualizado correctamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar el libro');
    }
});

// Eliminar un libro
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await connectDB();
        await connection.query('DELETE FROM libros WHERE id = ?', [id]);
        res.send('Libro eliminado correctamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el libro');
    }
});

export default router;
