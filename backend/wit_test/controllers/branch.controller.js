// controllers/branch.controller.js
import { fetchBranchesByHospital } from '../services/branch.service.js'; // Servisten fetchBranchesByHospital'ı import edin

// Fonksiyon adını getBranchesByHospitalId olarak değiştiriyoruz
export async function getBranchesByHospitalId(req, res) {
  try {
    const hospitalId = parseInt(req.params.hospitalId);

    // hospitalId'nin geçerli bir sayı olduğundan emin olun
    if (isNaN(hospitalId)) {
      return res.status(400).json({ error: 'Geçersiz hastane ID.' });
    }

    const branches = await fetchBranchesByHospital(hospitalId);

    if (!branches || branches.length === 0) { // !branches kontrolü de ekledim
      return res.status(404).json({ error: 'Belirtilen hastaneye ait branş bulunamadı.' });
    }

    res.json(branches);
  } catch (err) {
    console.error('Şubeler alınırken sunucu hatası:', err); // Hata konsola yazılsın
    res.status(500).json({ error: 'Sunucu hatası: Şubeler alınamadı.' }); // Daha genel hata mesajı
  }
}