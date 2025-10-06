// backend/wit_test/controllers/doctor.controller.js
import { getDoctorsByBranchId, getAllDoctors as getAllDoctorsFromRepo } from '../repositories/doctor.repository.js';

// Branşa göre doktorları getirme
export async function getDoctors(req, res) {
  console.log('[Controller] getDoctors fonksiyonu çağrıldı.'); // Yeni log
  try {
    const branchId = parseInt(req.params.branchId);
    if (isNaN(branchId)) {
      console.log('[Controller] Geçersiz branş ID:', req.params.branchId); // Yeni log
      return res.status(400).json({ error: 'Geçersiz branş ID.' });
    }
    console.log(`[Controller] Branş ID: ${branchId} için doktorlar isteniyor.`); // Yeni log
    const doctors = await getDoctorsByBranchId(branchId);

    if (!doctors || doctors.length === 0) {
      console.log(`[Controller] Branş ID ${branchId} için doktor bulunamadı.`); // Yeni log
      return res.status(404).json({ message: 'Bu branşta doktor bulunamadı.' });
    }

    console.log(`[Controller] ${doctors.length} doktor bulundu. Yanıt gönderiliyor.`); // Yeni log
    res.json(doctors); // BU SATIRIN VAR OLDUĞUNDAN EMİN OLUN
  } catch (err) {
    console.error('[Controller ERROR] Doktorlar alınırken sunucu hatası:', err); // Hata logu
    res.status(500).json({ error: 'Sunucu hatası: Doktorlar alınamadı.' });
  }
}

// TÜM DOKTORLARI GETİRME
export async function getAllDoctors(req, res) {
  console.log('[Controller] getAllDoctors fonksiyonu çağrıldı.'); // Yeni log
  try {
    const doctors = await getAllDoctorsFromRepo();
    if (!doctors || doctors.length === 0) {
      console.log('[Controller] Hiç doktor bulunamadı.'); // Yeni log
      return res.status(404).json({ message: 'Hiç doktor bulunamadı.' });
    }
    console.log(`[Controller] ${doctors.length} tüm doktor bulundu. Yanıt gönderiliyor.`); // Yeni log
    res.json(doctors);
  } catch (err) {
    console.error('[Controller ERROR] Tüm doktorlar alınırken sunucu hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası: Tüm doktorlar alınamadı.' });
  }
}