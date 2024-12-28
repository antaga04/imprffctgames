import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectToDatabase } from './config/db.js';
import mainRouter from './api/routes/index.js';

connectToDatabase();

const app = express();

app.use(
    cors({
        origin: 'https://puzlynk.vercel.app',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
);

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    limit: 50,
    standardHeaders: false,
    legacyHeaders: false,
});

app.use(limiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.status(200).send('Server is up and running');
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
