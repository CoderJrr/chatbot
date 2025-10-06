// backend/wit_test/witTest.js
// ---------------------------------------------------------------
//   Hastane randevu asistanı – akış sırası: Hastane → Bölüm → Doktor → Tarih/Saat
//   LLM: Google Gemini (2.5-flash)
// ---------------------------------------------------------------

import fetch from 'node-fetch';

/* ------------------------------------------------------------------ */
/* 0) Ortam değişkeni kontrolü                                        */
/* ------------------------------------------------------------------ */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY tanımlı değil (.env)!');

/* ------------------------------------------------------------------ */
/* 1) Oturum durumu
const session komutu, chatbot'un konuşma boyunca bilgileri hatırlamasını sağlayan bir "hafıza" nesnesi oluşturur                                                   */
/* ------------------------------------------------------------------ */
const session = {
  hastane: null,
  bolum: null,
  doktor: null,
  datetime: null,
  state: 'initial',   // 'initial' | 'in_progress' | 'await_confirm'
};

/* ------------------------------------------------------------------ */
/* 2) Yardımcı: Geçerli bilgi mi? 
includes(v): v değişkeninin, bir listenin (dizinin) içinde olup olmadığını kontrol eder.
v !== '': v değişkeninin, boş bir metin olmadığını kontrol eder.                                    */
/* ------------------------------------------------------------------ */
function isValid(value) {
  if (!value) return false;
  const v = String(value).trim().toLowerCase();
  return !['bilinmiyor', '-', 'yok', 'unknown'].includes(v) && v !== '';
}

/* ------------------------------------------------------------------ */
/* 3) Gemini çağrısı                                                  */
/* ------------------------------------------------------------------ */
export async function askGemini(text, context = '') {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  //Bu kod, Google Gemini API'sine göndereceğimiz mesajın gövdesini (body) oluşturur. Yapay zekaya göndermek 
  // istediğimiz metni (text) ve ona yardımcı olacak bağlamı (context), Gemini'nin anladığı özel bir JSON formatına sokar.
  const body = {
    contents: [{ parts: [{ text: context ? `${context}\n${text}` : text }] }],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (data.error) {
    console.error('[Gemini] Hata:', data.error);
    return '🤖 Şu an yanıt veremiyorum, lütfen daha sonra tekrar deneyin.';
  }
  //candidates (adaylar), Google Gemini API'sinin, sizin gönderdiğiniz isteğe (prompt'a) karşılık olarak 
  // ürettiği bir veya daha fazla olası yanıtı içeren bir dizidir (array).
  return data.candidates?.[0]?.content?.parts?.[0]?.text
    ?? '🤖 Anlayamadım, lütfen farklı ifade edin.';
}

/* ------------------------------------------------------------------ */
/* 4) Ana yanıt üreticisi                                             */
/* ------------------------------------------------------------------ */
export async function generateResponse(userMessage, llmFn = askGemini) {
  const text = userMessage.toLowerCase().trim();
  console.log('[Session Current State]', session);

  // Bu fonksiyon sadece 'reply' içeren bir JSON nesnesi döndürür.
  // Çoğu senaryoda bu kullanılacak.
  const createOnlyReplyResponse = (replyMessage) => {
    return { reply: replyMessage };
  };

  // Sadece ilk randevu başlatma durumunda kullanılacak özel fonksiyon.
  // 'intent', 'sessionState' ve 'bolum' bilgilerini içerir.
  const createInitialAppointmentResponseWithBolum = (replyMessage, intent, sessionState, bolumData) => {
    const response = {
      reply: replyMessage,
      intent: intent,
      sessionState: sessionState,
    };
    if (bolumData) { // Eğer bolum bilgisi varsa ekle
      response.bolum = bolumData;
    }
    return response;
  };

  /* 4-A) İptal komutu ---------------------------------------------- */
  if (text.includes('iptal') || text.includes('cancel')) {
    resetSession();
    return createOnlyReplyResponse('Randevu işlemi iptal edildi. Yeni bir randevu oluşturmak isterseniz "randevu al" gibi bir ifade kullanabilirsiniz.');
  }

  /* 4-B) Onay aşaması yönetimi (öncelikli) 
  text: context ? `${context}\n${text}` : text 
  Eğer bir context (ikinci parametre, yani "Randevu asistanısın...") varsa, Önce context'i al, 
  Bu yüzden, yapay zeka bu birleştirilmiş metni aldığında, en baştaki "Randevu asistanısın..." 
  cümlesini bir talimat olarak görüyor.------------------------- */
  if (session.state === 'await_confirm') {
    if (text.includes('evet') || text.includes('e')) {
      resetSession(); // Randevu onaylandı, oturumu sıfırla
      const geminiFinalQuestionText = await askGemini("Randevu başarıyla oluşturuldu. Başka bir işlem yapmak ister misiniz?", "Randevu asistanısın. Randevu oluşturulduktan sonra kullanıcıya başka bir işlem yapmak isteyip istemediğini sor.");
      return createOnlyReplyResponse('Randevunuz başarıyla oluşturuldu! ' + geminiFinalQuestionText);
    }
    if (text.includes('hayır') || text.includes('h')) {
      resetSession(); // Randevu iptal edildi, oturumu sıfırla
      const geminiCancelQuestionText = await askGemini("Randevu işlemi iptal edildi. Başka bir randevu oluşturmak ister misiniz?", "Randevu asistanısın. Randevu iptal edildikten sonra kullanıcıya başka bir randevu oluşturmak isteyip istemediğini sor.");
      return createOnlyReplyResponse('Randevu işlemi iptal edildi. ' + geminiCancelQuestionText);
    }
    // Onay aşamasında bekleyen bir durum varsa, randevu bilgilerini reply içinde ver. JSON sadece reply içersin.
    return createOnlyReplyResponse(`Randevu bilgileri: ${session.hastane} / ${session.bolum} / Dr. ${session.doktor} – ${session.datetime}. Onaylıyor musunuz? (evet/hayır)`);
  }

  /* 4-C) Genel Sohbet veya Akışı Başlatma (Niyet ve İlk Bilgi Ayıklama) */
  if (session.state === 'initial') {
    const initialDetectionContext = `
      Kullanıcının mesajını analiz et ve temel niyetini ve eğer varsa belirtilen bir "BÖLÜM" bilgisini çıkar.
      Niyetini aşağıdaki kategorilerden biriyle sınırlı tut:
      - RANDAVU_ALMA (Eğer kullanıcı bir randevu almak istiyorsa, sağlık sorunu, semptom belirtse bile)
      - GENEL_SOHBET (Eğer kullanıcı genel bir soru soruyorsa veya sohbet etmek istiyorsa)
      - BILINMIYOR (Yukarıdaki kategorilere uymuyorsa)

      Eğer kullanıcı mesajında bir bölüm ismi veya bir semptomdan çıkarılabilecek olası bir bölüm varsa, o bölümü "BÖLÜM: [Bölüm Adı]" formatında belirt. Yoksa belirtme.

      Örnekler:
      Kullanıcı: "Karnım ağrıyor."
      NİYET: RANDAVU_ALMA
      BÖLÜM: Gastroenteroloji

      Kullanıcı: "Randevu almak istiyorum."
      NİYET: RANDAVU_ALMA

      Kullanıcı: "Merhaba."
      NİYET: GENEL_SOHBET

      Kullanıcı: "Kardiyoloji bölümünden randevu almak istiyorum."
      NİYET: RANDAVU_ALMA
      BÖLÜM: Kardiyoloji

      Kullanıcı mesajı: "${userMessage}"
      NİYET:
      `;

    const geminiInitialResponse = await llmFn(userMessage, initialDetectionContext);
    console.log('[Gemini Niyet & Bölüm Tespiti Ham Yanıt]', geminiInitialResponse);

    const detectedIntentMatch = String(geminiInitialResponse).match(/NİYET:\s*(.+)/i);
    const detectedDepartmentMatch = String(geminiInitialResponse).match(/BÖLÜM:\s*(.+)/i);

    const detectedIntent = detectedIntentMatch ? detectedIntentMatch[1].trim().toUpperCase() : 'BILINMIYOR';
    const initialDetectedDepartment = detectedDepartmentMatch ? detectedDepartmentMatch[1].trim() : null;

    console.log('[Tespit Edilen Niyet]', detectedIntent);
    console.log('[Tespit Edilen İlk Bölüm]', initialDetectedDepartment);

    if (detectedIntent.includes('RANDAVU_ALMA')) {
      session.state = 'in_progress';

      let replyMessage = 'Randevu almak istediğinizi anladım.';
      let bolumForResponse = null; // Yanıt JSON'ına eklenecek bölüm bilgisi

      if (isValid(initialDetectedDepartment)) {
        session.bolum = initialDetectedDepartment; // Tespit edilen bölümü session'a kaydet
        replyMessage += ` Sizi ${session.bolum} bölümü için yönlendiriyorum.`;
        bolumForResponse = session.bolum; // JSON'a eklenecek bölümü hazırla
      }
      replyMessage += ' Hangi hastaneden randevu almak istersiniz?';

      // Sadece bu durumda intent, sessionState ve bolum bilgisini içeren yanıtı döndürüyoruz.
      return createInitialAppointmentResponseWithBolum(replyMessage, 'RANDAVU_ALMA_BASLATILDI', 'in_progress', bolumForResponse);
    } else if (detectedIntent.includes('GENEL_SOHBET') || detectedIntent.includes('BILINMIYOR')) {
      const generalChatReplyText = await askGemini(userMessage, "Sen bir genel sohbet asistanısın. Sadece randevu oluşturma akışı dışında kalan genel sorulara cevap ver. Randevu ile ilgili bir soru gelirse, kullanıcıyı 'randevu al' gibi bir ifade kullanmaya teşvik et.");
      return createOnlyReplyResponse(generalChatReplyText); // Genel sohbette sadece reply
    }
  }

  // Eğer state initial değilse (yani in_progress veya await_confirm ise), akışa devam et
  session.state = 'in_progress';

  /* 4-D) Gemini'den yapılandırılmış yanıt talebi (akış içi bilgi ayıklama) */
  const infoExtractionContext = `
  Sen bir metin analizcisin. Kullanıcının son mesajında HASTANE, BÖLÜM, DOKTOR veya TARİH_SAAT bilgisi geçiyorsa, sadece bu bilgileri aşağıdaki **yapılandırılmış formatta** döndür. Bulamadığın veya belirtilmeyen bilgiyi döndürme. Ek açıklama yapma, sadece formatı kullan.
  HASTANE: [...]
  BÖLÜM: [...]
  DOKTOR: [...]
  TARİH_SAAT: [...]
  Kullanıcı mesajı: "${userMessage}"
  `;

  const geminiResp = await llmFn(userMessage, infoExtractionContext);
  console.log('[Gemini Akış İçi Ayıklama Yanıtı]', geminiResp);

  /* 4-E) Bilgi ayıkla ---------------------------------------------- */
  const extractedInfo = {};
  String(geminiResp).split('\n').forEach(line => {
    let m;
    if (m = line.match(/^HASTANE:\s*(.+)/i)) extractedInfo.hastane = m[1].trim();
    else if (m = line.match(/^BÖLÜM:\s*(.+)/i)) extractedInfo.bolum = m[1].trim();
    else if (m = m = line.match(/^DOKTOR:\s*(.+)/i)) extractedInfo.doktor = m[1].trim();
    else if (m = line.match(/^TARİH_SAAT:\s*(.+)/i)) extractedInfo.datetime = m[1].trim();
  });

  /* 4-F) Oturumu güncelle (yalnızca geçerli ve henüz boş olan değerler) */
  if (isValid(extractedInfo.hastane) && !isValid(session.hastane)) {
    session.hastane = extractedInfo.hastane;
    console.log(`[Session Updated] Hastane: ${session.hastane}`);
  }
  if (isValid(extractedInfo.bolum) && !isValid(session.bolum)) {
    session.bolum = extractedInfo.bolum;
    console.log(`[Session Updated] Bölüm: ${session.bolum}`);
  }
  if (isValid(extractedInfo.doktor) && !isValid(session.doktor)) {
    session.doktor = extractedInfo.doktor;
    console.log(`[Session Updated] Doktor: ${session.doktor}`);
  }
  if (isValid(extractedInfo.datetime) && !isValid(session.datetime)) {
    session.datetime = extractedInfo.datetime;
    console.log(`[Session Updated] Tarih/Saat: ${session.datetime}`);
  }

  /* 4-G) Sıralı sorular (bu kısım sadece kod tarafından yönetilir) ---- */
  if (session.state === 'in_progress') {
    // Randevu akışının diğer adımlarında JSON'a ek bilgi koymuyoruz (intent/sessionState de yok).
    // Bilgiler sadece reply mesajında geçerse görülecek.
    if (!isValid(session.hastane)) {
      return createOnlyReplyResponse('Hangi hastaneden randevu almak istersiniz?');
    }
    if (!isValid(session.bolum)) {
      return createOnlyReplyResponse(`Hangi bölümden randevu almak istersiniz? (Hastane: ${session.hastane})`);
    }
    if (!isValid(session.doktor)) {
      return createOnlyReplyResponse(`Hangi doktordan randevu almak istersiniz? (Hastane: ${session.hastane}, Bölüm: ${session.bolum})`);
    }
    if (!isValid(session.datetime)) {
      return createOnlyReplyResponse(`Hangi tarih ve saatte randevu almak istersiniz? (Hastane: ${session.hastane}, Bölüm: ${session.bolum}, Doktor: ${session.doktor})`);
    }
  }

  /* 4-H) Onay aşamasına geçiş ------------------------------------- */
  if (session.state === 'in_progress' &&
    isValid(session.hastane) && isValid(session.bolum) &&
    isValid(session.doktor) && isValid(session.datetime)) {
    session.state = 'await_confirm';
    // Onay aşamasında da sadece reply gönderiyoruz.
    return createOnlyReplyResponse(`✅ Onay: ${session.hastane} / ${session.bolum} / Dr. ${session.doktor} – ${session.datetime}. Onaylıyor musunuz? (evet/hayır)`);
  }

  /* 4-I) Beklenmedik durum – Bu kısma düşmemeli (debug amaçlı) ---- */
  console.warn('[Warning] generateResponse: Beklenmedik duruma düşüldü. Session:', session, 'User Message:', userMessage);
  return createOnlyReplyResponse('Randevu akışında bir sorun oluştu. Lütfen "iptal" yazarak yeniden deneyin.');
}

/* ------------------------------------------------------------------ */
/* 5) Oturumu sıfırlama                                               */
/* ------------------------------------------------------------------ */
export function resetSession() {
  Object.keys(session).forEach(k => session[k] = null);
  session.state = 'initial';
}


