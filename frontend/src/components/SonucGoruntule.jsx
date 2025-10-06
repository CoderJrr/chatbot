import React from 'react';

const SonucGoruntule = ({
  hastane = "Şehir Hastanesi",
  doktor = "Dr. Ayşe Demir",
  bolum = "Dahiliye",
  tarih = "2025-07-10",
  tani = "Üst solunum yolu enfeksiyonu",
  tedavi = "Bol sıvı, istirahat, parasetamol 500mg",
  ilaclar = ["Parol 500mg", "Nurofen Cold", "Vitamin C"],
  tavsiye = "7 gün dinlenme, sigara içmemesi, tekrar şikayet olursa başvurması"
}) => {
  return (
    <div className="p-6 max-w-md space-y-4">
      <h3 className="text-2xl font-semibold text-center text-gray-800">Muayene Sonucu</h3>

      <div className="text-gray-800 space-y-2">
        <p><strong>Hastane:</strong> {hastane}</p>
        <p><strong>Doktor:</strong> {doktor}</p>
        <p><strong>Bölüm:</strong> {bolum}</p>
        <p><strong>Tarih:</strong> {tarih}</p>
        <p><strong>Tanı:</strong> {tani}</p>
        <p><strong>Tedavi:</strong> {tedavi}</p>

        <div>
          <strong>Yazılan İlaçlar:</strong>
          <ul className="list-disc list-inside ml-4">
            {ilaclar.map((ilac, i) => (
              <li key={i}>{ilac}</li>
            ))}
          </ul>
        </div>

        <p><strong>Doktor Tavsiyesi:</strong> {tavsiye}</p>
      </div>
    </div>
  );
};

export default SonucGoruntule;
