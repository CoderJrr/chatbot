// repositories/hospital.repository.js
import { db } from '../db.js'; // Bu satır düzeltildi

export async function getAllHospitals() {
  const [rows] = await db.query('SELECT * FROM hospitals');
  return rows;
}