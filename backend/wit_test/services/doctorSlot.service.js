// services/doctorSlot.service.js
import { getSlotsByDoctorId } from '../repositories/doctorSlot.repository.js';

export async function fetchSlotsByDoctor(doctorId) {
  return await getSlotsByDoctorId(doctorId);
}
