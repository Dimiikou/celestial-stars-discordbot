import express from 'express';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();
export const port = 3000;

app.use(express.json());

app.use('/v1/webhooks', webhookRoutes);

app.listen(port, () => {
    console.log(`API gestartet, listening auf Port ${port}`);
});