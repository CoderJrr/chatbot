// services/hospital.service.js
import { getAllHospitals } from '../repositories/hospital.repository.js';

export async function listHospitals() {
  return await getAllHospitals();
}
