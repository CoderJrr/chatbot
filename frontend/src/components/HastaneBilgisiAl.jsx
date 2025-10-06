import React from 'react';

const HastaneBilgisiAl = ({
  ad = "İstanbul Şehir Hastanesi",
  adres = "Barbaros Mah. Sağlık Sk. No:12, Ataşehir / İstanbul",
  telefon = "(0216) 123 45 67",
  faks = "(0216) 765 43 21",
  email = "iletisim@istanbulsehirsaglik.gov.tr",
  web = "https://istanbulsehirsaglik.gov.tr",
  calismaSaatleri = "Hafta içi 08:00 - 17:00, Cumartesi 08:00 - 13:00 (Pazar kapalı)"
}) => {
  return (
    <div className="p-6 max-w-md space-y-4">
      <h3 className="text-2xl font-semibold text-center text-gray-800">Hastane Bilgileri</h3>

      <div className="text-gray-800 space-y-2">
        <p><strong>Hastane Adı:</strong> {ad}</p>
        <p><strong>Adres:</strong> {adres}</p>
        <p><strong>Telefon:</strong> {telefon}</p>
        <p><strong>Faks:</strong> {faks}</p>
        <p><strong>E-Posta:</strong> {email}</p>
        <p><strong>Web Sitesi:</strong> <a href={web} className="text-blue-600 underline" target="_blank" rel="noreferrer">{web}</a></p>
         <p><strong>Çalışma Saatleri:</strong> {calismaSaatleri}</p>{/* rel="noreferrer" yönlendirilen sayfanın nereden yönlendirildiğini bilmemesini sağlar. */}
      </div>
    </div>
  );
};

export default HastaneBilgisiAl;
