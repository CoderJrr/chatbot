/*
import { useState, useRef } from 'react';
//useRef -> bir input, textarea veya herhangi bir HTML öğesine doğrudan erişmek için kullanılır. Sayfa yenilendiğinde direkt input'a odaklanmayı sağlar. Değer saklayabilir fakat useState gibi değer değişince tekrar render olmaz. Bir önceki props veya state değerini saklamak için de kullanılır.

export const useChatState = () => {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Merhaba! Size nasıl yardımcı olabilirim?" }
    ]);

    usememo()
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showButtons, setShowButtons] = useState(true);
    const inputRef = useRef(null);

    return {
        messages,
        setMessages,
        input,
        setInput,
        loading,
        setLoading,
        showButtons,
        setShowButtons,
        inputRef
    };
};

export const useTextareaAutoGrow = (inputRef, setInput) => { //yazı bölümünün otomatik büyümesini ayarlar
    const handleInputChange = (e) => {
        setInput(e.target.value);

        // Auto grow textarea
        const textarea = inputRef.current; //current inputtaki değeri alıyor normal js'deki document.querySelector('textarea'); gibi çalışır
        if (textarea) {
            textarea.style.height = "auto"; //yüksekliğini otomatik ayarlar
            textarea.style.height = `${textarea.scrollHeight}px`; //scroll yüksekliğini ayarlar
        }
    };

    return handleInputChange;
};

export const useMessageUpdate = (setMessages) => { //mesaj güncelleme fonksiyonu
    const handleMessageUpdate = (newMsg) => {
        if (newMsg.type === "remove") {
            setMessages(prev => prev.filter(msg => msg.id !== newMsg.id)); //filter metodu mesaj id'leri birbirine eşit değilse eski mesajı yeni mesajla değiştirir
        } else {
            setMessages(prev => [...prev, newMsg]);
        }
    };

    return handleMessageUpdate;
};
*/