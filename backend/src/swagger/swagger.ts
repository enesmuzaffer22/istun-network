import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "İSTÜN Mezunlar Ağı API",
      version: "1.0.0",
      description: "İSTÜN mezunlar platformu için backend API dokümantasyonu",
      contact: {
        name: "İstun Network",
        email: "info@istunnetwork.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: [
            "name",
            "surname",
            "username",
            "email",
            "password",
            "tc",
            "phone",
            "workStatus",
            "classStatus",
            "consent",
          ],
          properties: {
            name: {
              type: "string",
              description: "Kullanıcının adı",
            },
            surname: {
              type: "string",
              description: "Kullanıcının soyadı",
            },
            username: {
              type: "string",
              description: "Benzersiz kullanıcı adı",
            },
            email: {
              type: "string",
              format: "email",
              description: "E-posta adresi",
            },
            password: {
              type: "string",
              description: "Kullanıcı şifresi",
            },
            tc: {
              type: "string",
              description: "T.C. kimlik numarası",
            },
            phone: {
              type: "string",
              description: "Telefon numarası",
            },
            workStatus: {
              type: "string",
              description: "Çalışma durumu",
            },
            classStatus: {
              type: "string",
              description: "Sınıf durumu",
            },
            about: {
              type: "string",
              description: "Hakkında bilgisi",
            },
            consent: {
              type: "boolean",
              description: "Kullanım şartları onayı",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["identifier", "password"],
          properties: {
            identifier: {
              type: "string",
              description: "Kullanıcı adı veya e-posta",
            },
            password: {
              type: "string",
              description: "Kullanıcı şifresi",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Başarı mesajı",
            },
            token: {
              type: "string",
              description: "JWT token",
            },
            refreshToken: {
              type: "string",
              description: "Refresh token",
            },
            user: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
                localId: {
                  type: "string",
                },
              },
            },
          },
        },
        Job: {
          type: "object",
          required: ["title", "employer", "created_at", "content", "link"],
          properties: {
            id: {
              type: "string",
              description: "İş ilanı ID'si",
            },
            title: {
              type: "string",
              description: "İş ilanı başlığı",
            },
            employer: {
              type: "string",
              description: "İşveren adı",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Oluşturma tarihi",
            },
            content: {
              type: "string",
              description: "İş ilanı içeriği",
            },
            link: {
              type: "string",
              format: "uri",
              description: "İş ilanı linki",
            },
            submit_count: {
              type: "integer",
              description: "Başvuru sayısı",
              default: 0,
            },
          },
        },
        News: {
          type: "object",
          required: ["title", "content", "created_at"],
          properties: {
            id: {
              type: "string",
              description: "Haber ID'si",
            },
            title: {
              type: "string",
              description: "Haber başlığı",
            },
            content: {
              type: "string",
              description: "Haber içeriği",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Oluşturma tarihi",
            },
            category: {
              type: "string",
              description: "Haber kategorisi",
            },
            banner_img_url: {
              type: "string",
              format: "uri",
              description: "Banner resim URL'si",
            },
            thumbnail_img_url: {
              type: "string",
              format: "uri",
              description: "Thumbnail resim URL'si",
            },
          },
        },
        Roadmap: {
          type: "object",
          required: ["title", "content", "created_at"],
          properties: {
            id: {
              type: "string",
              description: "Yol haritası ID'si",
            },
            title: {
              type: "string",
              description: "Yol haritası başlığı",
            },
            content: {
              type: "string",
              description: "Yol haritası içeriği",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Oluşturma tarihi",
            },
            image_url: {
              type: "string",
              format: "uri",
              description: "Resim URL'si",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Hata mesajı",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Başarı mesajı",
            },
          },
        },
        UploadResponse: {
          type: "object",
          properties: {
            url: {
              type: "string",
              format: "uri",
              description: "Yüklenen dosyanın URL'si",
            },
          },
        },
        UserProfile: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Kullanıcı ID'si",
            },
            name: {
              type: "string",
              description: "Kullanıcının adı",
            },
            surname: {
              type: "string",
              description: "Kullanıcının soyadı",
            },
            username: {
              type: "string",
              description: "Kullanıcı adı",
            },
            email: {
              type: "string",
              format: "email",
              description: "E-posta adresi",
            },
            phone: {
              type: "string",
              description: "Telefon numarası",
            },
            workStatus: {
              type: "string",
              description: "Çalışma durumu",
            },
            classStatus: {
              type: "string",
              description: "Sınıf durumu",
            },
            about: {
              type: "string",
              description: "Hakkında bilgisi",
            },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
              description: "Kullanıcı onay durumu",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Hesap oluşturma tarihi",
            },
          },
        },
        PublicProfile: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Kullanıcının adı",
            },
            surname: {
              type: "string",
              description: "Kullanıcının soyadı",
            },
            username: {
              type: "string",
              description: "Kullanıcı adı",
            },
            workStatus: {
              type: "string",
              description: "Çalışma durumu",
            },
            classStatus: {
              type: "string",
              description: "Sınıf durumu",
            },
            about: {
              type: "string",
              description: "Hakkında bilgisi",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Hesap oluşturma tarihi",
            },
          },
        },
        UserUpdate: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Kullanıcının adı",
            },
            surname: {
              type: "string",
              description: "Kullanıcının soyadı",
            },
            phone: {
              type: "string",
              description: "Telefon numarası",
            },
            workStatus: {
              type: "string",
              description: "Çalışma durumu",
            },
            classStatus: {
              type: "string",
              description: "Sınıf durumu",
            },
            about: {
              type: "string",
              description: "Hakkında bilgisi",
            },
          },
        },
        UsersList: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/UserProfile",
              },
              description: "Kullanıcı listesi",
            },
            page: {
              type: "integer",
              description: "Mevcut sayfa numarası",
            },
            limit: {
              type: "integer",
              description: "Sayfa başına öğe sayısı",
            },
            hasMore: {
              type: "boolean",
              description: "Daha fazla veri var mı?",
            },
            status: {
              type: "string",
              description: "Filtrelenen durum",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // API rotalarının yolu
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
