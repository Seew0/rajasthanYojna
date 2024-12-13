import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import path from 'path';
import routes from './routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public'))); 

app.use("/api", routes);

app.get("/health", async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "server is healthy" });
});

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./public/views", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
