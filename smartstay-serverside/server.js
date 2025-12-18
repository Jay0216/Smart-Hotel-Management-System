import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import guestRoutes from './routes/guest.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(cors());
app.use(express.json());

/* Routes */
app.use('/api/guests', guestRoutes);

app.get('/', (req, res) => {
  res.send('SmartStay Hotel Server side');
});

/* Start Server */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
