//Componentler (ör: RandevuAl, RandevuSonuc) ile ilgili özel işlemleri (onayla, sil, güncelle gibi) yönetir.API'ye istek göndermek veya mesajı güncellemek için fonksiyonlar içerir.
import React from 'react'
import RandevuAl from '../components/RandevuAl';
import RandevuSonuc from '../components/RandevuSonuc';
import { createComponentResponse } from '../utils/Messages';
import { store } from '../store/store';
import { localApi } from '../api/api';
import { setMessages } from '../store/ChatSlice';

export const sendActionToAPI = async (actionText) => {
    try {
        console.log("🟡 API'ye gönderiliyor:", actionText); // GÖNDERİLİYOR MU?
        const result = await store.dispatch(
            localApi.endpoints.sendMessage.initiate([
                { role: "user", content: actionText }
            ])
        ).unwrap();

        console.log("🟢 API'den gelen cevap:", result); // GELEN CEVAP

        return result;
    } catch (e) {
        console.error("API hatası:", e);
    }
};

export const removeRandevuFormMessage = (id) => {
  const state = store.getState();
  const updated = state.chat.messages.map(msg =>
    msg.id === id
      ? { ...msg, componentType: null, componentProps: null, content: "Randevu Oluşturuldu!" }
      : msg
  );
  store.dispatch(setMessages(updated));
};

export const removeRandevuSonucMessage = () => { // id parametresini kaldırdık
  const state = store.getState();
  // RandevuSonuc tipindeki son mesajı bul ve onu iptal edildi olarak işaretle
  const updatedMessages = state.chat.messages.map(msg => {
    if (msg.componentType === "RandevuSonuc" && msg.id) { // id kontrolü eklendi
      return {
        ...msg,
        componentType: null,
        componentProps: null,
        content: "Randevu İptal Edildi!"
      };
    }
    return msg;
  });
  store.dispatch(setMessages(updatedMessages));
};

export const updateRandevuSonucMessage = () => { // id parametresini kaldırdık
  const state = store.getState();

  // Son "RandevuSonuc" veya "RandevuAl" komponentini bul
  const lastRandevuMessage = [...state.chat.messages].reverse().find(
    msg => msg.componentType === "RandevuAl" || msg.componentType === "RandevuSonuc"
  );

  if (!lastRandevuMessage) {
    console.warn("Güncellenecek randevu bulunamadı.");
    return;
  }

  // Son randevu sonucunu içeren mesajı metne dönüştür
  const updatedMessages = state.chat.messages.map(msg => {
    if (msg.id === lastRandevuMessage.id) {
      return {
        ...msg,
        componentType: null,
        componentProps: null,
        content: "Randevu Güncelleniyor..."
      };
    }
    return msg;
  });

  // Yeni RandevuAl formunu oluştur
  const newFormMessage = createComponentResponse("RandevuAl", {
    id: Date.now()
  });

  store.dispatch(setMessages([...updatedMessages, newFormMessage]));
};

// Randevuyu onayla ve bileşeni tekrar ama props olarak kaydet
export const confirmRandevuSonucMessage = async () => {
  const state = store.getState();

  // Son RandevuAl veya RandevuSonuc komponentini bul ve bilgilerini al
  const lastRandevuMessage = [...state.chat.messages].reverse().find(
    msg => msg.componentType === "RandevuAl" || msg.componentType === "RandevuSonuc"
  );

  if (!lastRandevuMessage) {
    const newMessage = {
      role: "assistant",
      content: "Randevu Onaylandı!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    store.dispatch(setMessages([...state.chat.messages, newMessage]));
    return;
  }

  // Eğer son mesaj bir RandevuAl formu ise, bu formdaki seçilen bilgileri kullan
  const { hospital, doctor, department, date } = lastRandevuMessage.componentProps || {};

  // RandevuAl form mesajını kaldır veya güncelle
  const filteredMessages = state.chat.messages.filter(msg => msg.id !== lastRandevuMessage.id);

  // Yeni bir RandevuSonuc kartı oluştur ve bilgileri ilet
  const randevuCard = createComponentResponse(
    "RandevuSonuc",
    {
      hospital: hospital || "",
      doctor: doctor || "",
      department: department || "",
      date: date || "",
      hideButtons: true // Onaylandıktan sonra butonları gizle
    }
  );

  store.dispatch(setMessages([
    ...filteredMessages,
    {
      role: "assistant",
      content: "Randevu Onaylandı!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    randevuCard // Yeni RandevuSonuc kartını ekle
  ]));

  await sendActionToAPI("Randevu Onayla");
};
