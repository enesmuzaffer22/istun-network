import { Request, Response, NextFunction } from "express";
import { auth } from "../firebase/firebase";
import { DecodedIdToken } from "firebase-admin/auth";

/**
 * Express'in Request tipini, doğrulanmış kullanıcı bilgilerini
 * içerecek şekilde genişletiyoruz. Bu, TypeScript'in hata vermesini engeller.
 */
declare global {
    namespace Express {
        interface Request {
            user?: DecodedIdToken;
        }
    }
}

/**
 * Kullanıcının giriş yapıp yapmadığını kontrol eder.
 * Gelen isteğin Authorization header'ındaki Bearer token'ı doğrular.
 * @param req - Express Request objesi
 * @param res - Express Response objesi
 * @param next - Sonraki middleware'e geçiş fonksiyonu
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        try {
            // Header'dan token'ı al ("Bearer <token>")
            token = req.headers.authorization.split(" ")[1];

            // Firebase Admin SDK ile token'ı doğrula
            const decodedToken = await auth.verifyIdToken(token);

            // Doğrulanmış kullanıcı bilgilerini request objesine ekle
            req.user = decodedToken;

            // Her şey yolundaysa, sonraki adıma geç
            next();
        } catch (error) {
            // Token geçersizse veya süresi dolmuşsa
            return res.status(401).json({ message: "Yetkisiz erişim, token geçersiz." });
        }
    }

    if (!token) {
        // Header'da token hiç yoksa
        return res.status(401).json({ message: "Yetkisiz erişim, token bulunamadı." });
    }
};

/**
 * Kullanıcının admin yetkisine sahip olup olmadığını kontrol eder.
 * BU MIDDLEWARE MUTLAKA `protect` MIDDLEWARE'İNDEN SONRA ÇAĞRILMALIDIR.
 * @param req - Express Request objesi
 * @param res - Express Response objesi
 * @param next - Sonraki middleware'e geçiş fonksiyonu
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // `protect` middleware'i sayesinde req.user'ın var olduğundan eminiz.
    // `req.user.admin` kontrolü, Firebase Custom Claims üzerinden yapılır.
    if (req.user && req.user.admin === true) {
        // Kullanıcı bir admin ise, sonraki adıma geç
        next();
    } else {
        // Kullanıcı giriş yapmış ama admin değilse
        res.status(403).json({ message: "Yetkisiz işlem. Bu eylemi gerçekleştirmek için yönetici olmalısınız." });
    }
};

/**
 * Kullanıcının super admin yetkisine sahip olup olmadığını kontrol eder.
 * BU MIDDLEWARE MUTLAKA `protect` MIDDLEWARE'İNDEN SONRA ÇAĞRILMALIDIR.
 * @param req - Express Request objesi
 * @param res - Express Response objesi
 * @param next - Sonraki middleware'e geçiş fonksiyonu
 */
export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    // `protect` middleware'i sayesinde req.user'ın var olduğundan eminiz.
    // `req.user.adminRole` kontrolü, Firebase Custom Claims üzerinden yapılır.
    if (req.user && req.user.adminRole === 'super_admin') {
        // Kullanıcı bir super admin ise, sonraki adıma geç
        next();
    } else {
        // Kullanıcı giriş yapmış ama super admin değilse
        res.status(403).json({ message: "Yetkisiz işlem. Bu eylemi gerçekleştirmek için süper yönetici olmalısınız." });
    }
};

/**
 * Kullanıcının content admin yetkisine sahip olup olmadığını kontrol eder.
 * BU MIDDLEWARE MUTLAKA `protect` MIDDLEWARE'İNDEN SONRA ÇAĞRILMALIDIR.
 * @param req - Express Request objesi
 * @param res - Express Response objesi
 * @param next - Sonraki middleware'e geçiş fonksiyonu
 */
export const isContentAdmin = (req: Request, res: Response, next: NextFunction) => {
    // `protect` middleware'i sayesinde req.user'ın var olduğundan eminiz.
    // `req.user.adminRole` kontrolü, Firebase Custom Claims üzerinden yapılır.
    if (req.user && (req.user.adminRole === 'super_admin' || req.user.adminRole === 'content_admin')) {
        // Kullanıcı super admin veya content admin ise, sonraki adıma geç
        next();
    } else {
        // Kullanıcı giriş yapmış ama content admin değilse
        res.status(403).json({ message: "Yetkisiz işlem. Bu eylemi gerçekleştirmek için yönetici olmalısınız." });
    }
};