 // Mesajlar, input, loading ve buton state'leri burada tutulur ve güncellenir. Mesaj ekleme, input değiştirme, loading durumunu değiştirme gibi işlemler için reducer'lar içerir.
 // Mesajlar, input, loading ve buton state'leri burada tutulur ve güncellenir.
 //  Mesaj ekleme, input değiştirme, loading durumunu değiştirme gibi işlemler için reducer'lar içerir.
  // Mesajlar, input, loading ve buton state'leri burada tutulur ve güncellenir. Mesaj ekleme, input değiştirme, loading durumunu değiştirme gibi işlemler için reducer'lar içerir.
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [    {
      role: "assistant",
      content: "Merhaba! Size nasıl yardımcı olabilirim?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }],
  input: '',
  loading: false,
  showButtons: true,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
//Bir action dispatch edildiğinde, ilgili reducer çalışır ve state’i günceller.
  reducers: {
    setMessages: (state, action) => { state.messages = action.payload; },
    addMessage: (state, action) => { state.messages.push(action.payload); },
    setInput: (state, action) => { state.input = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setShowButtons: (state, action) => { state.showButtons = action.payload; },
    clearMessages: (state) => { state.messages = []; },
  },
});
//addMessage Mesajlar listesine yeni bir mesaj ekler.
//Redux slice’ında tanımladığın action creator fonksiyonlarını dışa aktarmak (export etmek) için kullanılır.
export const { setMessages, addMessage, setInput, setLoading, setShowButtons, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;