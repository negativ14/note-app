import express from 'express';
import authRouter from './routes/auth.route';
import dotenv from 'dotenv';
import { connectDB } from './lib/db';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://j6yy3f-5173.csb.app', 'https://vtkq3y-5173.csb.app', 'https://note-app-frontend-negativ.vercel.app'],
    credentials: true,
}))
app.use(express.json({ limit: '10mb' })); // Set a higher limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRouter);

// app.use((req, res, next) => {
//     const error: any = new Error("Not found");
//     error.status = 404;
//     next(error);
//   });

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
    connectDB();
})