// repositories/branch.repository.js
import { db } from '../db.js'; // Bu satır düzeltildi

export async function getBranchesByHospitalId(hospitalId) {
  const [rows] = await db.query(
    'SELECT id, name FROM branches WHERE hospital_id = ?',
    [hospitalId]
  );
  return rows;
}