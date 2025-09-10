import { Request, Response, NextFunction } from "express";
import { auth } from "../firebase/firebase";
import { DecodedIdToken } from "firebase-admin/auth";

type AdminClaims = DecodedIdToken & {
    admin?: boolean;
    adminRole?: 'super_admin' | 'content_admin' | null;
};

/**
 * Express'in Request tipini, doğrulanmış kullanıcı bilgilerini
 * içerecek şekilde genişletiyoruz. Bu, TypeScript'in hata vermesini engeller.
 */
declare global {
    namespace Express {
        interface Request {
            user?: AdminClaims;
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
            req.user = decodedToken as AdminClaims;

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
export const isSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // `protect` middleware'i sayesinde req.user'ın var olduğundan eminiz.
        // Önce token'dan gelen custom claim'e bak.
        if (req.user && req.user.adminRole === 'super_admin') {
            return next();
        }

        // Bazı durumlarda (token tazelenmemiş veya claim propagation gecikmesi) adminRole boş olabilir.
        // Eğer kullanıcı admin ise ve rol bilgisi yoksa, Firebase'den güncel customClaims'i çek.
        if (req.user?.admin && !req.user.adminRole && req.user.uid) {
            const freshUser = await auth.getUser(req.user.uid);
            const role = freshUser.customClaims?.adminRole as string | undefined;
            if (role === 'super_admin') {
                // Request üzerindeki kullanıcı objesini de güncelleyelim.
                req.user.adminRole = role as any;
                return next();
            }
        }

        return res.status(403).json({ message: "Yetkisiz işlem. Bu eylemi gerçekleştirmek için süper yönetici olmalısınız." });
    } catch (error) {
        return res.status(500).json({ message: "Rol doğrulama sırasında hata oluştu." });
    }
};

/**
 * Kullanıcının content admin yetkisine sahip olup olmadığını kontrol eder.
 * BU MIDDLEWARE MUTLAKA `protect` MIDDLEWARE'İNDEN SONRA ÇAĞRILMALIDIR.
 * @param req - Express Request objesi
 * @param res - Express Response objesi
 * @param next - Sonraki middleware'e geçiş fonksiyonu
 */
export const isContentAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // `protect` middleware'i sayesinde req.user'ın var olduğundan eminiz.
        const role = req.user?.adminRole as string | undefined;
        if (role === 'super_admin' || role === 'content_admin') {
            return next();
        }

        // Eğer token'da rol yoksa ama admin ise, güncel claim'i Firebase'den çekmeyi dene.
        if (req.user?.admin && !req.user.adminRole && req.user.uid) {
            const freshUser = await auth.getUser(req.user.uid);
            const freshRole = freshUser.customClaims?.adminRole as string | undefined;
            if (freshRole === 'super_admin' || freshRole === 'content_admin') {
                req.user.adminRole = freshRole as any;
                return next();
            }
        }

        return res.status(403).json({ message: "Yetkisiz işlem. Bu eylemi gerçekleştirmek için yönetici olmalısınız." });
    } catch (error) {
        return res.status(500).json({ message: "Rol doğrulama sırasında hata oluştu." });
    }
};
