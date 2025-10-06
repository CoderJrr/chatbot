// controllers/doctorSlot.controller.js
import { fetchSlotsByDoctor } from '../services/doctorSlot.service.js';

export async function getDoctorSlots(req, res) {
  try {
    const doctorId = parseInt(req.params.doctorId);
    const slots = await fetchSlotsByDoctor(doctorId);

    if (!slots.length) {
      return res.status(404).json({ error: 'Uygun saat bulunamadı' });
    }

    res.json({ doctorId, available: slots });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası: ' + err.message });
  }
}
