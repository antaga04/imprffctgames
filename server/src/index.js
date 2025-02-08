import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/db.js';
import mainRouter from './api/routes/index.js';
import cookieParser from 'cookie-parser';
import { generalLimiter } from './middlewares/rateLimiters.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectToDatabase();

const app = express();

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
);

app.use(generalLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.disable('x-powered-by');

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.use('/api', mainRouter);

// Controlador de rutas no encontradas
app.use('*', (req, res, next) => {
    res.status(404).json({ data: 'Not found' });
});

// Controlador de errores generales del servidor
app.use((error, req, res, next) => {
    console.log('>>>> Server error:', error);
    res.status(500).json({ data: 'Internal Server Error' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`App corriendo en: http://localhost:${PORT}`);
});

export default app;
