import express, { Application, Request, Response } from 'express';
import cors from 'cors';
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes


const serverController = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Gadget Server',
  });
};

app.get('/', serverController);

export default app;
