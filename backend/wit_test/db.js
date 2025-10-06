// db.js
import mysql from 'mysql2/promise'; // Hala mysql2/promise kullanıyoruz

export const db = await mysql.createConnection({ // BURADAKİ DEĞİŞİKLİK: await eklendi
  host: 'localhost',
  user: 'root',       // kendi MySQL kullanıcı adını yaz
  password: '',       // şifre varsa ekle
  database: 'appointments_db'
});