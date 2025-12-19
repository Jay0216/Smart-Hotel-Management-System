import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import guestRoutes from './routes/guest.routes.js';
import staffRoutes from './routes/staff.routes.js';
import receptionistRoutes from './routes/receptionist.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(cors());
app.use(express.json());

/* Routes */
app.use('/api/guests', guestRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/receptionist', receptionistRoutes);

app.get('/', (req, res) => {
  res.send('SmartStay Hotel Server side');
});

/* Start Server */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
