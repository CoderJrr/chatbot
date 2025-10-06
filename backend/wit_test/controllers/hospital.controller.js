// controllers/hospital.controller.js
import { listHospitals } from '../services/hospital.service.js';

export async function getHospitals(req, res) {
  try {
    const hospitals = await listHospitals();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: 'Hastaneler alınamadı', detail: err.message });
  }
}
