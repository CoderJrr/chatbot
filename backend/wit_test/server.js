// backend/wit_test/server.js
/*✅ 1. HASTANELER — GET /api/hospitals
Ne yapar? Tüm hastaneleri listeler.
Postman:
•	Method: GET
•	URL: http://localhost:3000/api/hospitals
•	Beklenen: [ { "id": 1, "name": "Istanbul Şehir Hastanesi" }, ... ]
________________________________________
✅ 2. BRANŞLAR — GET /api/hospitals/:id/branches
Ne yapar? Belirli bir hastanenin branşlarını listeler.
Postman:
•	Method: GET
•	URL: http://localhost:3000/api/hospitals/1/branches
•	Beklenen: [ { "id": 11, "name": "Kardiyoloji" }, ... ]
________________________________________
✅ 3. DOKTORLAR — GET /api/branches/:id/doctors
Ne yapar? Bir branşa bağlı tüm doktorları getirir.
Postman:
•	Method: GET
•	URL: http://localhost:3000/api/branches/11/doctors
•	Beklenen: [ { "id": 111, "name": "Dr. Ayşe Yılmaz" }, ... ]
________________________________________
✅ 4. DOKTOR SLOT’LARI — GET /api/doctors/:id/times
Ne yapar? Doktorun boşta olduğu saatleri döner.
Postman:
•	Method: GET
•	URL: http://localhost:3000/api/doctors/111/times
•	Beklenen: { doctor: "Dr. Ayşe Yılmaz", available: ["10:00", "14:00"] }
________________________________________
✅ 5. RANDEVU AL — POST /api/appointments
Ne yapar? Randevu oluşturur.
Postman:
•	Method: POST
•	URL: http://localhost:3000/api/appointments
•	Body (JSON):
json
Copy
{
  "userId": 1,
  "doctorId": 111,
  "time": "10:00"
}
•	Beklenen: { message: "Randevu başarıyla oluşturuldu" }
________________________________________
✅ 6. RANDEVU GÖRÜNTÜLE — GET /api/appointments/user/:userId
Ne yapar? Belirli bir kullanıcının randevularını listeler.
Postman:
•	Method: GET
•	URL: http://localhost:3000/api/appointments/user/1
•	Beklenen: [ { id, userId, doctorId, time, ... } ]
________________________________________
✅ 7. RANDEVU SİL — DELETE /api/appointments/:id
Ne yapar? Randevuyu iptal eder.
Postman:
•	Method: DELETE
•	URL: http://localhost:3000/api/appointments/5
•	Not: ID’yi önceki adımda öğrendiğin bir randevuya göre yaz.

8.Chat-POST http://localhost:3000/chat
body raw json
{
    "message": "merhaba"
}*/


// server.js – ES-modules
import express from 'express';//Görevi: Web sunucusunun temelini oluşturur. Gelen istekleri dinler, yolları (routes) 
// yönetir ve yanıtları gönderir. Projenizin iskeletidir.
import bodyParser from 'body-parser';//Görevi: Gelen isteklerin gövdesindeki (body) verileri 
// (genellikle JSON formatında) okuyup 
import fetch from 'node-fetch';//Görevi: Sunucunuzun, dışarıdaki başka API'lere 
// (bizim durumumuzda Google Gemini API'sine) HTTP isteği göndermesini sağlar.
import 'dotenv/config.js'; //Görevi: .env dosyanızdaki gizli bilgileri (API anahtarları, veritabanı şifreleri)
//  okur ve projenin her yerinden güvenli bir şekilde erişilebilir hale getirir.
import cors from 'cors';//Görevi: "Cross-Origin Resource Sharing" (Çapraz Kaynak Paylaşımı) ayarlarını yönetir.
//  Bu, web tarayıcısında çalışan bir uygulamanın (frontend), farklı bir adresteki sunucunuza (backend) 
// istek atmasına güvenlik nedeniyle izin vermek için gereklidir.

// ROUTES
import appointmentRoutes from './routes/appointment.routes.js';
import hospitalRoutes from './routes/hospital.routes.js';
import doctorRoutes from './routes/doctor.routes.js'; // doctor.routes.js'den gelen router

// Chat ve LLM - Sadece askGemini ve generateResponse import edildi
import { askGemini, generateResponse } from './witTest.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
// Middleware
app.use(bodyParser.json());

// ROUTE MOUNTING
app.use('/api/appointments', appointmentRoutes);
app.use('/api/hospitals', hospitalRoutes);

// DoctorRoutes hem /api/doctors hem de /api/branches prefix'leri altında çalışacak
app.use('/api/doctors', doctorRoutes);
app.use('/api/branches', doctorRoutes);

// ✅ CHATBOT (Sadece Gemini ve opsiyonel OpenAI)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null; // OpenAI hala opsiyonel olarak kalabilir

async function askOpenAI(prompt, systemCtx = '') {
  if (!OPENAI_API_KEY) throw new Error('NO_OPENAI_KEY');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,//Bu başlık, API'ye kim olduğunuzu kanıtlamak için kimlik doğrulama 
      // bilgisi gönderir. Sunucu, bu başlığa bakarak isteği yapanın servisi kullanma yetkisi olup olmadığını anlar.
      //Bearer: Bu, "Taşıyıcı" anlamına gelen bir kimlik doğrulama şemasıdır
      'Content-Type': 'application/json'
    },
    //Bu komut, bir JavaScript nesnesini, internet üzerinden gönderilebilecek bir metin (string) formatı olan 
    // JSON formatına dönüştürür.
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemCtx },//systemCtx ise bu mesajın içeriğini tutan bir değişkendir.
        { role: 'user', content: prompt }
      ],
      temperature: 0.7 //Bu, yapay zeka modelinin yanıtlarının ne kadar "yaratıcı" veya "rastgele" olacağını 
      // kontrol eden bir ayardır. Değer genellikle 0 ile 1 arasında olur.
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI error');
  return data.choices?.[0]?.message?.content?.trim() || '🤖 ChatGPT’den anlamlı yanıt gelmedi.';
}

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  const providerHdr = (req.headers['x-ai-provider'] || '').toLowerCase(); // ChatGPT seçeneği hala aktif
  if (!userMessage) return res.status(400).json({ error: 'message alanı zorunludur' });

  //Bu fonksiyonda prompt, yapay zekaya sorduğunuz asıl soru veya komuttur. ctx ise (context'in kısaltması), 
  // bu soruya daha iyi bir cevap verebilmesi için yapay zekaya sağladığınız ek bilgi veya bağlamdır.
  try {
    const llmChooser = async (prompt, ctx) => {
      if (providerHdr === 'chatgpt') {
        try {
          return await askOpenAI(prompt, ctx);
        } catch (e) {
          if (e.message !== 'NO_OPENAI_KEY') throw e;
          console.warn('GPT istendi fakat OPENAI_API_KEY yok; Gemini kullanılıyor.');
        }
      }
      return await askGemini(prompt, ctx);
    };

    const botResponse = await generateResponse(userMessage, llmChooser);
    res.json({ reply: botResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası: ' + err.message });
  }
});

// SERVER LISTEN
app.listen(port, () => {
  console.log(`🟢 API http://localhost:${port} üzerinden çalışıyor.`);
});

