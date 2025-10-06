// repositories/appointment.repository.js
import { db } from '../db.js';

export async function saveAppointment(appointment) {
  const { userId, doctorId, time } = appointment;
  await db.query(
    // 'user_id' yerine 'userId' ve 'doctor_id' yerine 'doctorId' kullanıldı
    'INSERT INTO appointments (userId, doctorId, time) VALUES (?, ?, ?)',
    [userId, doctorId, time]
  );
}

export async function getAppointmentsByUserId(userId) {
  const [rows] = await db.query(
    `SELECT a.id, a.time, d.name AS doctorName, b.name AS branchName, h.name AS hospitalName
     FROM appointments a
     JOIN doctors d ON a.doctorId = d.id -- BURADA DÜZELTME YAPILDI: 'a.doctor_id' yerine 'a.doctorId'
     JOIN branches b ON d.branch_id = b.id
     JOIN hospitals h ON b.hospital_id = h.id
     WHERE a.userId = ?`, // BURADA DÜZELTME YAPILDI: 'a.user_id' yerine 'a.userId'
    [userId]
  );
  return rows;
}

export async function deleteAppointmentById(id) {
  await db.query('DELETE FROM appointments WHERE id = ?', [id]);
}

export async function isTimeTaken(doctorId, time) {
  const [rows] = await db.query(
    // 'doctor_id' yerine 'doctorId' kullanıldı
    'SELECT COUNT(*) AS count FROM appointments WHERE doctorId = ? AND time = ?', // BURADA DÜZELTME YAPILDI
    [doctorId, time]
  );
  return rows[0].count > 0;
}