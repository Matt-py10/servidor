import mysql from 'mysql2/promise'; // Usando la versión de promesas
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            connectTimeout: 10000, // Tiempo de espera extendido (10 segundos)
        });
        
        console.log('Conexión exitosa a la base de datos');
        return connection;
    } catch (err) {
        console.error('Error conectando a la base de datos:', err);
    }
};

export default connectDB;
