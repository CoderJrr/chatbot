// routes/doctorSlot.routes.js
import express from 'express';
import { getDoctorSlots } from '../controllers/doctorSlot.controller.js';

const router = express.Router();

router.get('/:doctorId', getDoctorSlots); // /api/slots/:doctorId

export default router;
