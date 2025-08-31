import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from './routes/authRoutes.js'

dotenv.config();
const app = express();

const PORT = 5000;
app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port number ${PORT}`)
    })
})
.catch((err) => console.error(err))