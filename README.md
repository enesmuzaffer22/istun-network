<a name="turkish"></a>
#  ISTUNetwork | İSTÜN Öğrencileri İçin Kariyer Ağı
**Türkçe** | [English](#english)

Bu proje, İSTÜN üniversite öğrencilerinin ve mezunlarının kullanabileceği; kariyer ağlarını ve potansiyellerini keşfedebilecekleri bir proje. Proje, mezun ve öğrenci ilişkisini temel alarak öğrencilerin ve mezunların gelişimlerini hedefliyor.

## ✨ Özellikler
Proje içerisinde şunlar bulunuyor:
 -   🎓 Staj ve iş bulma fırsatları
-   📰 Üniversiteden güncel haberler
-   📅 Üniversitedeki etkinlikler (planlanan ve geçmiş)
-   📢 Öğrenciler ve mezunlar için duyurular
-   ✍️ Mezunların öğrencilere rehberlik edebileceği blog yazıları
-   🌉 "Köprü Projeleri" ile mezun-öğrenci ilişkisini güçlendirme
-   📊 Sosyal etki skoru ve topluluk bilgiler
-   🏆 Kazanılan ödüller

## 🛠 Kullanılan Teknolojiler
### Backend
- Node.js
- Express
- Firebase
- Swagger
- Jest
- Multer
### Frontend
- React
- TailwindCSS
- Axios
- Bootstrap Icons
- GSAP
- React Router
- Toastify
- Zustand

## ⚙️ Kurulum
1. `npm install` ile bağımlılıkları yükleyin (backend, frontend, dashboard).
2. `.env` dosyasını hazırlayın (backend):
```
GOOGLE_APPLICATION_CREDENTIALS=./src/serviceAccountKey.json
FIREBASE_WEB_API_KEY=firebase_api_key
FIREBASE_STORAGE_BUCKET=firebase_storage_bucket
```
3. `serviceAccountKey.json` dosyasını hazırlayın (backend: /src/serviceAccountKey.json):
```
{
	"type":  "string",
	"project_id":  "string",
	"private_key_id":  "string",
	"private_key":  "string",
	"client_email":  "string",
	"client_id":  "string",
	"auth_uri":  "string",
	"token_uri":  "string",
	"auth_provider_x509_cert_url":  "string",
	"client_x509_cert_url":  "string",
	"universe_domain":  "string"
}
```
4. `npm run dev` ile uygulamayı başlatın (backend, frontend, dashboard).

## Son olarak...
Proje halen geliştirilme aşamasında. 2025 Eylül ayının sonlarına doğru projeyi canlıya almayı planlıyoruz.

Projenin geliştirilmesi ve yürütülmesi muhtemelen durmayacak. Bu nedenle bu proje ile ilgilenecek geliştiriciler ve web sitesi içinde editörlük yapabilecek ekip arkadaşları arıyoruz. Bununla ilgili duyuruyu ilerleyen zamanlarda sizler ile paylaşmış olacağız.

Projeye katkıda bulunan herkesin eline emeğine sağlık. 

<a name="english"></a>
**English** | [Türkçe](#turkish)

# ISTUNetwork | Career Network for İSTÜN Students
This project is designed for İSTÜN university students and alumni, providing a platform where they can explore their career networks and potential. It is built on the relationship between alumni and students, aiming to support their growth and development.

## ✨ Features
The project includes:

-   🎓 Internship and job opportunities
-   📰 Latest news from the university
-   📅 University events (upcoming and past)
-   📢 Announcements for students and alumni
-   ✍️ Blog posts where alumni can mentor students
-   🌉 "Bridge Projects" to strengthen alumni-student connections
-   📊 Social impact score and community insights
-   🏆 Achievements and awards

## 🛠 Tech Stack
### Backend
- Node.js
- Express
- Firebase
- Swagger
- Jest
- Multer
### Frontend
- React
- TailwindCSS
- Axios
- Bootstrap Icons
- GSAP
- React Router
- Toastify
- Zustand

## ⚙️ Installation
1. Install dependencies using `npm install` (backend, frontend, dashboard).
2. Prepare the `.env` file (backend):
```
GOOGLE_APPLICATION_CREDENTIALS=./src/serviceAccountKey.json
FIREBASE_WEB_API_KEY=firebase_api_key
FIREBASE_STORAGE_BUCKET=firebase_storage_bucket
```
3. Prepare the `serviceAccountKey.json` file (backend: /src/serviceAccountKey.json):
```
{
	"type":  "string",
	"project_id":  "string",
	"private_key_id":  "string",
	"private_key":  "string",
	"client_email":  "string",
	"client_id":  "string",
	"auth_uri":  "string",
	"token_uri":  "string",
	"auth_provider_x509_cert_url":  "string",
	"client_x509_cert_url":  "string",
	"universe_domain":  "string"
}
```
4. Start the application with `npm run dev` (backend, frontend, dashboard).

## 🙏 Finally…
The project is still under development. We plan to launch it live around the end of September 2025.

The development and management of the project will likely continue. Therefore, we are looking for developers to work on this project and team members who can serve as editors within the website. We will share announcements regarding this in the near future.

Thanks to everyone who has contributed to the project—your efforts are greatly appreciated.
