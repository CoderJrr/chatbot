// backend/wit_test/routes/doctor.routes.js
import express from 'express';
import { getDoctors, getAllDoctors } from '../controllers/doctor.controller.js'; // getDoctors ve getAllDoctors import ediliyor
import { getDoctorSlots } from '../controllers/doctorSlot.controller.js'; // Doktorun zamanları için

const router = express.Router();

// Branşa göre doktorları getirme rotası (Örnek: /api/branches/11/doctors)
router.get('/:branchId/doctors', getDoctors);

// Doktorun müsait zaman dilimlerini getirme rotası (Örnek: /api/doctors/111/times)
router.get('/:doctorId/times', getDoctorSlots);

// TÜM DOKTORLARI GETİRME ROTASI (Örnek: /api/doctors)
router.get('/', getAllDoctors);

export default router;