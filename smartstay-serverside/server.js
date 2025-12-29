import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'
import guestRoutes from './routes/guest.routes.js';
import staffRoutes from './routes/staff.routes.js';
import receptionistRoutes from './routes/receptionist.routes.js';
import adminRoutes from './routes/admin.routes.js';
import roomRoutes from './routes/room.routes.js';
import serviceRoutes from './routes/service.routes.js';
import staffUsersRoutes from './routes/staffusers.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import serviceRequestRoutes from "./routes/serviceRequest.routes.js";
import assignedTaskRoutes from './routes/staff.task.routes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(cors());
app.use(express.json());


/* 🔥 Serve uploaded images */
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'))
);

/* Routes */
app.use('/api/guests', guestRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/receptionist', receptionistRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api', staffUsersRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use('/api/assigned-tasks', assignedTaskRoutes);

app.get('/', (req, res) => {
  res.send('SmartStay Hotel Server side');
});

/* Start Server */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
