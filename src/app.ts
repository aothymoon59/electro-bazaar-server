import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'] }));

// application routes
app.use('/api/v1', router);

const serverController = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Electronics Gadget Server',
  });
};

app.get('/', serverController);

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
