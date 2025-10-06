// services/branch.service.js
import { getBranchesByHospitalId } from '../repositories/branch.repository.js';

export async function fetchBranchesByHospital(hospitalId) {
  return await getBranchesByHospitalId(hospitalId);
}
