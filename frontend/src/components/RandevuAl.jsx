import React, { useState, useEffect } from "react";
import RandevuSonuc from "./RandevuSonuc";
import {
    useGetBranchesByHospitalIdQuery,
    useGetHospitalsQuery,
    useSendMessageMutation,
    useGetDoctorsByBranchIdQuery,
    useGetTimesByDoctorIdQuery,
} from "../api/api";
import {
    removeRandevuFormMessage,
    removeRandevuSonucMessage,
    updateRandevuSonucMessage,
    confirmRandevuSonucMessage
} from '../utils/ButtonFunctions';
import { store } from '../store/store'; // Redux store'a erişim için
import { setMessages } from '../store/ChatSlice'; // setMessages import edildi
import { createComponentResponse } from "../utils/Messages";

// Randevu oluşturma bileşeni
function RandevuAl({ id }) {
    // Hastaneleri API'den al
    const { data: hospitals } = useGetHospitalsQuery();

    // Seçilen hastane ID'sini tutar
    const [hospitalId, setHospitalId] = useState(null);

    // Seçilen hastaneye ait bölümleri API'den al
    const { data: branches } = useGetBranchesByHospitalIdQuery(hospitalId, {
        skip: !hospitalId, // hospitalId boşsa sorgu atmasın
    });

    const [selectedHospital, setSelectedHospital] = useState("");

    // Seçilen hastane değiştiğinde hospitalId güncellenir
    useEffect(() => {
        if (selectedHospital) {
            setHospitalId(selectedHospital);
        }
    }, [selectedHospital]);

    // Doktor seçimi ve bağlı ID'ler
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [doctorId, setDoctorId] = useState(null);

    // Seçilen bölüme ait doktorları API'den al
    const { data: doctors } = useGetDoctorsByBranchIdQuery(selectedDepartment, {
        skip: !selectedDepartment,
    });

    // Seçilen doktor değiştiğinde doctorId güncellenir
    useEffect(() => {
        if (selectedDoctor) {
            setDoctorId(selectedDoctor);
        }
    }, [selectedDoctor]);

    // Tarih ve saat seçimleri
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    // Seçilen doktora ait saatleri API'den al
    const { data: doctorTimes } = useGetTimesByDoctorIdQuery(selectedDoctor, {
        skip: !selectedDoctor,
    });

    const [currentStep, setCurrentStep] = useState(1); // Adım takibi (1–5 arası)
    const [sendMessage] = useSendMessageMutation(); // Chat API kullanımı
    const [showResult, setShowResult] = useState(false); // Sonuç gösterilsin mi
    const [sonucComponent, setSonucComponent] = useState(null); // RandevuSonuc bileşeni

    // Tarih biçimlendirme
    const today = new Date();
    const formatDate = (date) => date.toISOString().split("T")[0];
    const dateObj = new Date(selectedDate);
    const formattedDate = dateObj.toLocaleDateString('tr-TR', { //bir Date nesnesini yerel dil ve format kurallarına göre biçimlendirir
        day: '2-digit',
        month: 'long',
        year: 'numeric'
        //tarih formatının hangi şekilde gösterileceğini belirler
    });

    // Saat biçimlendirme
    const selectedTimetoFormat = selectedTime;
    const [hour, minute] = selectedTimetoFormat.split(":");
    const formattedTime = `${hour}:${minute}`;

    // Seçilen objeleri veriden bul
    const selectedHospitalObj = hospitals?.find((h) => h.id.toString() === selectedHospital);
    const selectedDepartmentObj = branches?.find((b) => b.id.toString() === selectedDepartment);
    const selectedDoctorObj = doctors?.find((d) => d.id.toString() === selectedDoctor);

    // Randevu onaylandığında yapılacak işlemler
    const handleConfirm = () => {
        // Form mesajını kaldır
        removeRandevuFormMessage(id);

        const fullDateTime = formattedDate && formattedTime ? `${formattedDate} ${formattedTime}` : formattedDate;

        // Sonuç bileşenini oluştur
        const newRandevuSonucMessage = createComponentResponse(
            "RandevuSonuc",
            {
                id: Date.now(),
                hospital: selectedHospitalObj?.name || "Bilinmiyor",
                doctor: selectedDoctorObj?.name || "Bilinmiyor",
                department: selectedDepartmentObj?.name || "Bilinmiyor",
                date: `${fullDateTime}`,
            },
            Date.now() // Yeni bir id ile RandevuSonuc mesajı oluştur
        );

        const state = store.getState();
        store.dispatch(setMessages([...state.chat.messages, newRandevuSonucMessage]));

        // Sonucu göster ve adımı 5'e getir
        setShowResult(true);
        setCurrentStep(5);

        // Seçimleri sıfırla
        setSelectedHospital("");
        setSelectedDoctor("");
        setSelectedDepartment("");
        setSelectedDate("");
        setSelectedTime(""); // Temizle: Saat alanı
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl space-y-4">
            <h2 className="text-2xl font-semibold text-center text-gray-800">Randevu Oluştur</h2>

            {/* Adım 1: Hastane seçimi */}
            {currentStep === 1 && (
                <div>
                    <label className="block mb-1">Hastane</label>
                    <select
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedHospital}
                        onChange={(e) => setSelectedHospital(e.target.value)}
                    >
                        <option value="">Seçiniz</option>
                        {hospitals?.map((hospital) => (
                            <option key={hospital.id} value={hospital.id}>
                                {hospital.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className="w-full mt-5 bg-[#303030]  hover:bg-[#414141] text-white py-2 px-4 rounded-2xl cursor-pointer"
                        onClick={async () => {
                            if (!selectedHospital) return;
                            const response = await sendMessage([
                                { role: "assistant", content: `Hastane: ${selectedHospitalObj?.name}}` },
                            ]).unwrap();
                            console.log("✅ API cevabı:", response);
                            setCurrentStep(2);
                        }}
                    >
                        Devam Et
                    </button>
                </div>
            )}

            {/* Adım 2: Bölüm seçimi */}
            {currentStep === 2 && (
                <div>
                    <label className="block mb-1">Bölüm</label>
                    <select
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <option value="">Seçiniz</option>
                        {branches?.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className="w-full mt-5 bg-[#303030] hover:bg-[#414141] text-white py-2 px-4 rounded-2xl cursor-pointer"
                        onClick={async () => {
                            if (!selectedDepartment) return;
                            const response = await sendMessage([
                                { role: "assistant", content: `Bölüm: ${selectedDepartmentObj?.name}` },
                            ]).unwrap();
                            console.log("✅ API cevabı:", response);
                            setCurrentStep(3);
                        }}
                    >
                        Devam Et
                    </button>
                </div>
            )}

            {/* Adım 3: Doktor seçimi */}
            {currentStep === 3 && (
                <div>
                    <label className="block mb-1">Doktor</label>
                    <select
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                        <option value="">Seçiniz</option>
                        {doctors?.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className="w-full mt-5 bg-[#303030] hover:bg-[#414141] text-white py-2 px-4 rounded-2xl cursor-pointer"
                        onClick={async () => {
                            if (!selectedDoctor) return;
                            const response = await sendMessage([
                                { role: "assistant", content: `Doktor: ${selectedDoctorObj?.name}` },
                            ]).unwrap();
                            console.log("✅ API cevabı:", response);
                            setCurrentStep(4);
                        }}
                    >
                        Devam Et
                    </button>
                </div>
            )}

            {/* Adım 4: Tarih ve saat seçimi */}
            {currentStep === 4 && (
                <div>
                    <label className="block mb-1">Tarih</label>
                    <input
                        type="date"
                        value={selectedDate}
                        min={formatDate(today)}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                    />

                    <label className="block mb-1">Saat</label>
                    <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">Saat seçiniz</option>
                        {doctorTimes?.available?.map((time, i) => (
                            <option key={i} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>

                    <button
                        className="w-full mt-5 bg-[#303030] hover:bg-[#414141] text-white py-2 px-4 rounded-2xl cursor-pointer"
                        onClick={async () => {
                            if (!selectedDate || !selectedTime) return;
                            const response = await sendMessage([
                                {
                                    role: "assistant",
                                    content: `Tarih: ${formattedDate} - Saat: ${formattedTime}`,
                                },
                            ]).unwrap();
                            console.log("✅ API cevabı:", response);
                            handleConfirm();
                        }}
                    >
                        Devam Et
                    </button>
                </div>
            )}

            {/* Adım 5: Sonuç bileşeni */}
            {currentStep === 5 && showResult && (
                <div>
                    {sonucComponent}
                </div>
            )}
        </div>
    );
}

export default RandevuAl;
