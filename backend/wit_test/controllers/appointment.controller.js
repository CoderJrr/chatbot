// controllers/appointment.controller.js
import {
  createAppointment,
  listAppointments,
  cancelAppointment
} from '../services/appointment.service.js';

export async function bookAppointment(req, res) {
  try {
    const { userId, doctorId, time } = req.body;
    await createAppointment({ userId, doctorId, time });
    res.json({ message: 'Randevu başarıyla oluşturuldu' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getUserAppointments(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    const appointments = await listAppointments(userId);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası: ' + err.message });
  }
}

export async function deleteAppointment(req, res) {
  try {
    const id = parseInt(req.params.id);
    await cancelAppointment(id);
    res.json({ message: 'Randevu silindi' });
  } catch (err) {
    res.status(500).json({ error: 'Silme sırasında hata oluştu' });
  }
}
