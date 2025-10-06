// repositories/doctor.repository.js
import { db } from '../db.js';

export async function getDoctorsByBranchId(branchId) {
  console.log(`[Repo] Doktorları branş ID ${branchId} ile getiriliyor...`);
  try {
    const [rows] = await db.query('SELECT * FROM doctors WHERE branch_id = ?', [branchId]);
    console.log(`[Repo] Branş ID ${branchId} için ${rows.length} doktor bulundu.`);
    return rows;
  } catch (error) {
    console.error(`[Repo ERROR] Branş ID ${branchId} doktorları alınırken hata:`, error);
    throw error; // Hatayı yukarı fırlatın
  }
}

// TÜM DOKTORLARI GETİRME - YENİ FONKSİYON
export async function getAllDoctors() {
  console.log('[Repo] Tüm doktorlar getiriliyor...');
  try {
    const [rows] = await db.query('SELECT * FROM doctors');
    console.log(`[Repo] ${rows.length} tüm doktor bulundu.`);
    return rows;
  } catch (error) {
    console.error('[Repo ERROR] Tüm doktorlar alınırken hata:', error); // Buradaki hatayı terminalde göreceğiz
    throw error; // Hatayı yukarı fırlatın
  }
}