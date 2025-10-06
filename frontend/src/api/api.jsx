// RTK Query (Redux Toolkit Query) kullanarak API istekleri için bir servis oluşturuluyor
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API servisinin tanımı
export const localApi = createApi({
    // Reducer ismi, store'da kullanılacak ad
    reducerPath: 'localApi',

    // API'nin temel ayarları burada yapılır
    baseQuery: fetchBaseQuery({
        // API'nin temel URL'si — buradaki istekler http://localhost:3000 üzerinden yapılacak
        baseUrl: 'http://localhost:3000/',

        // Her istekte header'a "Content-Type: application/json" ekleniyor
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),

    // API'nin sahip olduğu tüm endpoint'ler burada tanımlanır
    endpoints: (builder) => ({

        // 1. Mesaj gönderme işlemi için bir POST endpoint tanımı
        sendMessage: builder.mutation({
            // İstek detayları
            query: (messages) => ({
                // Mesaj gönderilecek endpoint (örneğin: /chat)
                url: 'chat',
                method: 'POST',

                // Başlıklar (header) — Gemini adlı AI sağlayıcısını belirtiyoruz
                headers: {
                    "x-ai-provider": "gemini"
                },

                // Body: Son gönderilen mesaj içeriği API'ye yollanıyor
                body: {
                    message: messages[messages.length - 1].content
                },
            }),

            // Sunucudan dönen yanıtın işlenmesi
            transformResponse: (response) => response.reply || 'Yanıt yok',
        }),

        // 2. Tüm hastaneleri getiren GET endpoint
        getHospitals: builder.query({
            // İstek URL’si: /api/hospitals
            query: () => 'api/hospitals',
        }),

        // 3. Seçilen hastanenin branşlarını getiren GET endpoint
        getBranchesByHospitalId: builder.query({
            // hospitalId parametresi ile birlikte URL oluşturuluyor
            query: (hospitalId) => `api/hospitals/${hospitalId}/branches`,
        }),

        // 4. Seçilen branşın doktorlarını getiren GET endpoint
        getDoctorsByBranchId: builder.query({
            // branchId parametresi ile birlikte URL oluşturuluyor
            query: (branchId) => `api/branches/${branchId}/doctors`,
        }),

        // 5. Seçilen doktorun müsait saatlerini getiren GET endpoint
        getTimesByDoctorId: builder.query({
            // doctorId parametresi ile birlikte URL oluşturuluyor
            query: (doctorId) => `api/doctors/${doctorId}/times`,
        }),
    }),
});

// Yukarıda tanımlanan endpoint'leri bileşen içinde kullanabilmek için React hook'ları export ediliyor
export const {
    useSendMessageMutation,            // Mesaj gönderme işlemi için hook
    useGetHospitalsQuery,             // Hastane listesini çekmek için hook
    useGetBranchesByHospitalIdQuery,  // Seçilen hastanenin branşlarını çekmek için hook
    useGetDoctorsByBranchIdQuery,     // Seçilen branşın doktorlarını çekmek için hook
    useGetTimesByDoctorIdQuery        // Seçilen doktorun saatlerini çekmek için hook
} = localApi;
