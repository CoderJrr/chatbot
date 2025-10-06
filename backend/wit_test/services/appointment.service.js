// services/appointment.service.js
import {
  saveAppointment,
  getAppointmentsByUserId,
  deleteAppointmentById,
  isTimeTaken
} from '../repositories/appointment.repository.js';

export async function createAppointment(appointment) {
  const alreadyTaken = await isTimeTaken(appointment.doctorId, appointment.time);
  if (alreadyTaken) {
    throw new Error('Seçilen saat dolu');
  }
  await saveAppointment(appointment);
}

export async function listAppointments(userId) {
  return await getAppointmentsByUserId(userId);
}

export async function cancelAppointment(id) {
  await deleteAppointmentById(id);
}
