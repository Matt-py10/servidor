import jwt from 'jsonwebtoken';

export const isAdmin = (req, res, next) => {
    console.log('Encabezados recibidos:', req.headers); // Verificar todos los encabezados

    // Verificar si el token está presente en el encabezado Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Token no proporcionado o mal formado.');
    }
    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token);
    
    if (!token) {
        console.error('Error: Token vacío o mal formado.');
        return res.status(401).send('Token inválido o no proporcionado.');
    }

    try {
        // Verificar el token con la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado correctamente:', decoded);

        // Guardar la información del usuario para uso en otras rutas protegidas
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error verificando el token:', err.message);
        return res.status(401).send('Token inválido o expirado.');
    }
};
