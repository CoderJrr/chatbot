# Hastane Randevu Sistemi & AI Chatbot

Bu proje, hastane randevu süreçlerini yönetmek için geliştirilmiş bir RESTful API sunucusudur. Aynı zamanda, kullanıcıların doğal dilde sorular sorarak randevu süreçleri hakkında bilgi alabilmesi için
Google Gemini ve OpenAI (GPT) gibi yapay zeka modelleriyle entegre bir chatbot endpoint'i içerir.

---

## API Endpointleri

Proje, aşağıdaki API endpoint'lerini sunmaktadır:

| Metot | URL | Açıklama |
| :--- | :--- | :--- |
| `GET` | `/api/hospitals` | Sistemdeki tüm hastaneleri listeler. |
| `GET` | `/api/hospitals/:id/branches` | Belirli bir hastaneye ait tüm branşları listeler. |
| `GET` | `/api/branches/:id/doctors` | Belirli bir branşa ait tüm doktorları listeler. |
| `GET` | `/api/doctors/:id/times` | Belirli bir doktorun uygun randevu saatlerini gösterir. |
| `POST` | `/api/appointments` | Yeni bir randevu oluşturur. |
| `GET` | `/api/appointments/user/:userId` | Belirli bir kullanıcının tüm randevularını listeler. |
| `DELETE`| `/api/appointments/:id` | Belirli bir randevuyu iptal eder. |
| `POST` | `/chat` | Kullanıcının mesajını yapay zeka modeline gönderir ve cevap alır. |

---

## 🛠️ Kullanılan Teknolojiler (Tech Stack)

* **Back-end:** Node.js, Express.js
* **Middleware:** cors, body-parser
* **API İstekleri:** node-fetch
* **Harici Servisler (External Services):**
    * Google Gemini API
    * OpenAI (GPT-4o-mini) API (Opsiyonel)
* **Ortam Değişkenleri:** dotenv

---

## 🔧 Kurulum ve Çalıştırma (Setup and Usage)

### 1. Projeyi Klonlama
```bash
git clone [https://github.com/CoderJrr/chatbot.git](https://github.com/CoderJrr/chatbot.git)
cd chatbot

2. Bağımlılıkları Yükleme
Bash

npm install
3. Yapılandırma (Configuration)
Bu projenin chatbot özelliğinin çalışması için bir Google Gemini API anahtarına ihtiyacınız var. OpenAI kullanmak opsiyoneldir.

Proje ana dizininde .env.example dosyasının bir kopyasını oluşturun ve adını .env olarak değiştirin.

.env dosyasını açın ve kendi API anahtarlarınızı girin:

# Google Gemini API anahtarınızı buraya girin
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Opsiyonel: Eğer kullanmak isterseniz OpenAI anahtarınızı buraya girin
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
4. Sunucuyu Başlatma
Bash

npm start
Sunucu başarıyla başladıktan sonra, terminalde 🟢 API http://localhost:3000 üzerinden çalışıyor. mesajını göreceksiniz. Artık Postman gibi bir araçla API'yi test edebilirsiniz.


**Son Adım:**
Bu metni `README.md` dosyasına yapıştırdıktan sonra, değişikliği şu komutlarla GitHub'a gönderebilirsiniz:
```bash
git add README.md
git commit -m "Proje için README dosyası eklendi"
git push
