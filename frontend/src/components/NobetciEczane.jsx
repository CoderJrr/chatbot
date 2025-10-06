import React from 'react';

const NobetciEczane = ({
  ad = "Sağlık Eczanesi",
  adres = "Kızılay Mah. Atatürk Bulvarı No:56, Çankaya / Ankara",
  telefon = "(0312) 456 78 90",
  konum = "https://maps.google.com/?q=Sağlık+Eczanesi+Çankaya",
  tarih = "10 Temmuz 2025 Perşembe",
  saatler = "19:00 - 08:00",
  ilIlce = "Ankara / Çankaya",
  not = "Eczane geçici olarak karşı binaya taşınmıştır."
}) => {
  return (
    <div className="p-6 max-w-md space-y-4">
      <h3 className="text-2xl font-semibold text-center text-gray-800">Nöbetçi Eczane Bilgisi</h3>

      <div className="text-gray-800 space-y-2">
        <p><strong>Eczane Adı:</strong> {ad}</p>
        <p><strong>Adres:</strong> {adres}</p>
        <p><strong>Telefon:</strong> {telefon}</p>
        <p>
          <strong>Konum:</strong>{" "}
          <a href={konum} className="text-blue-600 underline" target="_blank" rel="noreferrer">
            Haritada Göster
          </a>
        </p>
        <p><strong>Nöbet Tarihi:</strong> {tarih}</p>
        <p><strong>Çalışma Saatleri:</strong> {saatler}</p>
        <p><strong>İl / İlçe:</strong> {ilIlce}</p>
        <p><strong>Not:</strong> {not}</p>
      </div>
    </div>
  );
};

export default NobetciEczane;
