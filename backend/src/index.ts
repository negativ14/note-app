import express from 'express';
import authRouter from './routes/auth.route';
import dotenv from 'dotenv';
import { connectDB } from './lib/db';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}))
app.use(express.json({ limit: '10mb' })); // Set a higher limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
    connectDB();
})