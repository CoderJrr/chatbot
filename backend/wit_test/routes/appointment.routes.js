// routes/appointment.routes.js
import express from 'express';
import {
  bookAppointment,
  getUserAppointments,
  deleteAppointment
} from '../controllers/appointment.controller.js';

const router = express.Router();

router.post('/', bookAppointment);             // POST /api/appointments
// Rota: /api/appointments/user/:userId isteğine karşılık gelecek şekilde güncellendi
router.get('/user/:userId', getUserAppointments); // BURADA DÜZELTME YAPILDI!
router.delete('/:id', deleteAppointment);       // DELETE /api/appointments/:id

export default router;