import express from 'express';
import formRoutes from "./form";

const app = express.Router();

app.use("/form", formRoutes);
export default app;
