"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.protect = void 0;
const firebase_1 = require("../firebase");
/**
 * Kullanıcının giriş yapıp yapmadığını kontrol eder.
 * Gelen isteğin Authorization header'ındaki Bearer token'ı doğrular.
 * @param req - Express Request objesi
 * @param res - Express Response objesi
 * @param next - Sonraki middleware'e geçiş fonksiyonu
 */
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        try {
            // Header'dan token'ı al ("Bearer <token>")
            token = req.headers.authorization.split(" ")[1];
            // Firebase Admin SDK ile token'ı doğrula
            const decodedToken = yield firebase_1.auth.verifyIdToken(token);
            // Doğrulanmış kullanıcı bilgilerini request objesine ekle
            req.user = decodedToken;
            // Her şey yolundaysa, sonraki adıma geç
            next();
        }
        catch (error) {
            // Token geçersizse veya süresi dolmuşsa
            return res.status(401).json({ message: "Yetkisiz erişim, token geçersiz." });
        }
    }
    if (!token) {
        // Header'da token hiç yoksa
        return res.status(401).json({ message: "Yetkisiz erişim, token bulunamadı." });
    }
});
exports.protect = protect;
/**
 * Kullanıcının admin yetkisine sahip olup olmadığını kontrol eder.
 * BU MIDDLEWARE MUTLAKA `protect` MIDDLEWARE'İNDEN SONRA ÇAĞRILMALIDIR.
 * @param req - Express Request objesi
 * @param res - Express Response objesi
 * @param next - Sonraki middleware'e geçiş fonksiyonu
 */
const isAdmin = (req, res, next) => {
    // `protect` middleware'i sayesinde req.user'ın var olduğundan eminiz.
    // `req.user.admin` kontrolü, Firebase Custom Claims üzerinden yapılır.
    if (req.user && req.user.admin === true) {
        // Kullanıcı bir admin ise, sonraki adıma geç
        next();
    }
    else {
        // Kullanıcı giriş yapmış ama admin değilse
        res.status(403).json({ message: "Yetkisiz işlem. Bu eylemi gerçekleştirmek için yönetici olmalısınız." });
    }
};
exports.isAdmin = isAdmin;
