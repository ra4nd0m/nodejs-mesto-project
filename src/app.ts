import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import cardsRouter from './routes/cards';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = { _id: '6818e90d0e3619cd5091f3c7' };
  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardsRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Not available' });
});

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('DB connection error:', err);
  });
