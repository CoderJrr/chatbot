// repositories/doctorSlot.repository.js
import { db } from '../db.js';

export async function getSlotsByDoctorId(doctorId) {
  const [rows] = await db.query(
    // 'time' yerine doğru sütun adını yazın
    'SELECT slot_time FROM doctor_slots WHERE doctor_id = ?', // Düzeltme burada!
    [doctorId]
  );
  // Eğer map ile farklı bir dönüş bekliyorsanız
  // return rows.map(r => r.slot_time);
  return rows.map(r => r.slot_time); // Örneğin, eğer sütun adı 'slot_time' ise
}