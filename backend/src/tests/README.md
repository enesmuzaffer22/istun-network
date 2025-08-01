# 🧪 ISTUN Backend Test Suite

Tüm backend endpoint'lerini otomatik test eden kapsamlı test sistemi.

## 🚀 Hızlı Başlangıç

```bash
# Tüm testleri çalıştır
npm test

# Sadece belirli test dosyasını çalıştır
npm test src/tests/cache.test.ts

# Watch mode ile sürekli test çalıştır
npm run test:watch

# Coverage raporu ile çalıştır
npm run test:coverage
```

## 📋 Test Kategorileri

### 🔐 Authentication Tests (`auth.test.ts`)
- Email/Username ile giriş testi
- Dosya boyutu kontrolü (1MB limit)
- Kayıt olma validasyonları
- Şifre sıfırlama 

### 📰 News Tests (`news.test.ts`)
- CRUD işlemleri
- Resim upload (2MB limit)
- Admin yetki kontrolü
- Pagination

### 💼 Jobs Tests (`jobs.test.ts`)
- Kullanıcı iş ilanı oluşturma
- Admin onay sistemi
- Status kontrolü (pending/approved)
- Başvuru sayısı artırma

### 👤 Profile Tests (`profile.test.ts`)
- Kullanıcı profil yönetimi
- Admin kullanıcı onaylama
- Public/private erişim kontrolü

### ⚡ Performance Tests
- **Cache Tests (`cache.test.ts`)**: Memory cache sistemi
- **Rate Limit Tests (`rateLimit.test.ts`)**: 60 istek/dakika limit

### 📁 File Upload Tests (`fileUpload.test.ts`)
- Dosya hash hesaplama
- Duplicate prevention
- Size validations
- MIME type kontrolü

## 📊 Test Sonuçları

Testler şu format kontrollerini yapar:

### ✅ Başarılı Testler
- API endpoint'leri doğru response döner
- Validasyonlar çalışır
- File upload limitleri uygulanır
- Cache sistemi çalışır

### ❌ Hata Testleri  
- Yetkisiz erişim engellenirT
- Geçersiz data reddedilir
- Rate limiting uygulanır
- Dosya boyutu limitleri

## 🔧 Test Konfigürasyonu

### Jest Ayarları
```json
{
  "preset": "ts-jest",
  "testEnvironment": "node",
  "testMatch": ["**/src/tests/**/*.test.ts"]
}
```

### Test Environment
```bash
NODE_ENV=test
PORT=5001
```

## 📈 Coverage Raporu

```bash
npm run test:coverage
```

Bu komut ile test coverage raporunu görebilirsin:
- Hangi dosyaların test edildiği
- Hangi satırların çalıştırıldığı  
- Genel coverage yüzdesi

## 🐛 Debug

Testlerde sorun varsa:

```bash
# Verbose mode ile detaylı log
npm test -- --verbose

# Sadece başarısız testleri çalıştır
npm test -- --onlyFailures

# Watch mode ile değişiklikleri takip et
npm run test:watch
```

## 🎯 Test Yazma Rehberi

Yeni test eklerken:

1. **Helper fonksiyonları kullan**: `expectSuccess()`, `expectError()`
2. **Mock data oluştur**: `createTestFile()`, `createTestPDF()` 
3. **Async/await kullan**: Tüm API çağrıları async
4. **Edge case'leri test et**: Limit değerleri, hata durumları
5. **Açıklayıcı test adları**: `✅ Geçerli test`, `❌ Hata durumu`

## 📞 Yardım

Test ile ilgili sorun yaşarsan:
- Console output'unu kontrol et
- Jest verbose mode kullan
- Test helper fonksiyonlarını incele

**🎉 Tüm testler geçiyorsa API'n hazır!** 