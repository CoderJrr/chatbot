import React from "react";

const RandevuSonuc = ({ hospital, doctor, department, date, onRemoveMessage, id, onUpdateMessage, onConfirmMessage, hideButtons, time }) => {

    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('tr-TR', { //bir Date nesnesini yerel dil ve format kurallarına göre biçimlendirir
        day: '2-digit',
        month: 'long',
        year: 'numeric'
        //tarih formatının hangi şekilde gösterileceğini belirler
    });

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <img
                    className="md:w-38 md:h-38 w-22 h-22"
                    src="./User.svg"
                    alt="User"
                />
                <div className="space-y-2">
                    <h3 className="text-md font-semibold text-blue-800">Randevu Bilgileri</h3>
                    <p className="text-[18px]"><strong>Hastane:</strong> {hospital}</p>
                    <p className="text-[18px]"><strong>Doktor:</strong> {doctor}</p>
                    <p className="text-[18px]"><strong>Bölüm:</strong> {department}</p>
                    <p className="text-[18px]"><strong>Tarih ve Saat:</strong> {date}</p>
                </div>
            </div>

            {/* Randevu Kartı Butonları */}
            {!hideButtons && (
                <div className="flex gap-4 justify-start mb-5">
                    <button
                        onClick={() => onRemoveMessage(id)}
                        className="w-30 bg-[#ff3c3c] hover:bg-[#ff593c] text-white py-2 rounded-2xl cursor-pointer"
                    >
                        İptal Et
                    </button>
                    <button
                        onClick={() => onConfirmMessage(id)}
                        className="w-30 bg-[#50b800] hover:bg-[#00b806] text-white py-2 rounded-2xl cursor-pointer"
                    >
                        Onayla
                    </button>
                    <button
                        onClick={() => onUpdateMessage(id)}
                        className="w-30 bg-[#27a9ff] hover:bg-[#27b7ff] text-white py-2 rounded-2xl cursor-pointer"
                    >
                        Güncelle
                    </button>
                </div>
            )}
        </div>
    );
};

export default RandevuSonuc;
