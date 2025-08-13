# İstun Network API - Swagger Dokümantasyonu Kılavuzu

## Swagger Nedir?

Swagger (OpenAPI), RESTful API'lerinizi dokümante etmeniz, test etmeniz ve keşfetmeniz için güçlü bir araç setidir. Bu projede Swagger entegrasyonu ile API endpointlerinizi kolayca test edebilir ve dokümantasyonu görüntüleyebilirsiniz.

## Kurulum ve Kullanım

### 1. Swagger UI'ya Erişim

Sunucuyu başlattıktan sonra aşağıdaki URL'lerden Swagger dokümantasyonuna erişebilirsiniz:

- **Ana Sayfa**: http://localhost:5000/
- **Swagger UI**: http://localhost:5000/api-docs

### 2. API Endpointleri

Swagger UI üzerinden aşağıdaki endpoint gruplarını test edebilirsiniz:

#### 🔐 Authentication (Kimlik Doğrulama)

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/upload-document` - Öğrenci belgesi yükleme

#### 📰 News (Haberler)

- `GET /api/news` - Tüm haberleri listele
- `GET /api/news/{id}` - Belirli bir haberi getir
- `POST /api/news` - Yeni haber oluştur (Admin)
- `PUT /api/news/{id}` - Haber güncelle (Admin)
- `DELETE /api/news/{id}` - Haber sil (Admin)
- `POST /api/news/upload-image` - Haber için resim yükle (Admin)

#### 💼 Jobs (İş İlanları)

- `GET /api/jobs` - Tüm iş ilanlarını listele
- `GET /api/jobs/{id}` - Belirli bir iş ilanını getir
- `POST /api/jobs` - Yeni iş ilanı oluştur (Admin)
- `PUT /api/jobs/{id}` - İş ilanını güncelle (Admin)
- `DELETE /api/jobs/{id}` - İş ilanını sil (Admin)
- `POST /api/jobs/{id}/submit` - İş ilanına başvuru sayısını artır

#### 🗺️ Roadmaps (Yol Haritaları)

- `GET /api/roadmaps` - Tüm yol haritalarını listele
- `GET /api/roadmaps/{id}` - Belirli bir yol haritasını getir
- `POST /api/roadmaps` - Yeni yol haritası oluştur (Admin)
- `PUT /api/roadmaps/{id}` - Yol haritasını güncelle (Admin)
- `DELETE /api/roadmaps/{id}` - Yol haritasını sil (Admin)

#### 👤 Users (Kullanıcı Profilleri)

- `GET /api/users/me` - Kendi profilimi getir
- `PUT /api/users/me` - Kendi profilimi güncelle
- `GET /api/users` - Tüm kullanıcıları listele (Admin) - sayfalama ve filtreleme destekli
- `GET /api/users/{username}` - Kullanıcının herkese açık profilini getir
- `POST /api/users/{id}/approve` - Kullanıcı kaydını onayla (Admin)
- `POST /api/users/{id}/reject` - Kullanıcı kaydını reddet (Admin)

### 3. Yetkilendirme (Authentication)

Admin işlemleri için JWT token gereklidir:

1. Önce `/api/auth/login` endpointi ile giriş yapın
2. Dönen `token` değerini kopyalayın
3. Swagger UI'da sağ üst köşedeki **"Authorize"** butonuna tıklayın
4. `Bearer <token>` formatında token'ı girin (örnek: `Bearer eyJhbGciOiJIUzI1NiIs...`)
5. **"Authorize"** butonuna tıklayın

### 4. Dosya Yükleme

Multipart/form-data gerektiren endpointler için:

- `POST /api/auth/register` - Öğrenci belgesi + form verileri
- `POST /api/auth/upload-document` - Sadece dosya
- `POST /api/news` - Banner ve thumbnail resimleri + form verileri
- `POST /api/news/upload-image` - Sadece resim dosyası
- `POST /api/roadmaps` - Resim + form verileri

## Swagger Özellikleri

### ✨ Ana Özellikler

- **İnteraktif Dokümantasyon**: Tüm endpointleri canlı olarak test edebilirsiniz
- **Şema Doğrulama**: Request/response şemaları otomatik doğrulanır
- **Kod Örnekleri**: Farklı programlama dilleri için kod örnekleri
- **Try It Out**: Doğrudan browser'dan API çağrıları yapabilirsiniz

### 🎯 Kullanım İpuçları

1. **Endpoint Testi**: Her endpoint için "Try it out" butonuna tıklayarak test edebilirsiniz
2. **Şema İnceleme**: Response şemalarını inceleyerek beklenen veri formatını görebilirsiniz
3. **Hata Kodları**: Her endpoint için olası hata kodları ve açıklamaları mevcuttur
4. **Parametre Doğrulama**: Gerekli parametreler otomatik olarak işaretlenir

## Geliştirici Notları

### Yeni Endpoint Ekleme

Yeni bir endpoint eklerken Swagger dokümantasyonu için:

```typescript
/**
 * @swagger
 * /api/example:
 *   post:
 *     summary: Örnek endpoint
 *     tags: [Example]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.post("/example", async (req, res) => {
  // endpoint kodu
});
```

### Şema Güncelleme

Yeni veri modelleri için `src/swagger/swagger.ts` dosyasındaki `components.schemas` bölümünü güncelleyin.

## Sorun Giderme

### Swagger UI Açılmıyor

- Sunucunun çalıştığından emin olun: `npm run dev`
- Browser konsolunda hata olup olmadığını kontrol edin
- http://localhost:5000/api-docs adresini doğru yazdığınızdan emin olun

### Token Hatası

- Login işleminden sonra aldığınız token'ın doğru formatda olduğundan emin olun
- Token'ın süresi dolmuş olabilir, yeniden login yapın
- `Bearer ` prefix'ini eklemeyi unutmayın

### CORS Hatası

- Frontend uygulamanızın http://localhost:5173 adresinde çalıştığından emin olun
- Farklı bir port kullanıyorsanız `src/index.ts` dosyasındaki CORS ayarlarını güncelleyin

## Daha Fazla Bilgi

- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc Dokümantasyonu](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express Dokümantasyonu](https://github.com/scottie1984/swagger-ui-express)
