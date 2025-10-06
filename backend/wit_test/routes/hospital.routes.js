// routes/hospital.routes.js
import express from 'express';
// Hospital ve Branch controller'larından ilgili fonksiyonları import edin
import { getHospitals } from '../controllers/hospital.controller.js';
import { getBranchesByHospitalId } from '../controllers/branch.controller.js'; // Bu fonksiyonun adını kontrol edin, getBranchesByHospitalId veya benzeri olmalı

const router = express.Router();

// Tüm hastaneleri getirir
router.get('/', getHospitals);

// Belirli bir hastanenin şubelerini getirir
// Rota: /api/hospitals/:hospitalId/branches
router.get('/:hospitalId/branches', getBranchesByHospitalId);

export default router;