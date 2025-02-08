"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./lib/db");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://j6yy3f-5173.csb.app', 'https://vtkq3y-5173.csb.app', 'https://note-app-frontend-negativ.vercel.app'],
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' })); // Set a higher limit
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use('/api/auth', auth_route_1.default);
// app.use((req, res, next) => {
//     const error: any = new Error("Not found");
//     error.status = 404;
//     next(error);
//   });
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
    (0, db_1.connectDB)();
});
