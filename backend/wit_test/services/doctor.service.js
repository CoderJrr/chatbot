// services/doctor.service.js
import { getDoctorsByBranchId } from '../repositories/doctor.repository.js';

export async function fetchDoctorsByBranch(branchId) {
  return await getDoctorsByBranchId(branchId);
}
