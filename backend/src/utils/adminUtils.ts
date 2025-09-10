import { auth } from "../firebase/firebase";

/**
 * Kullanıcıya admin rolü atar
 * @param uid - Kullanıcının Firebase UID'si
 * @param role - Admin rolü ('super_admin' veya 'content_admin')
 */
export const setAdminRole = async (uid: string, role: 'super_admin' | 'content_admin') => {
    try {
        await auth.setCustomUserClaims(uid, {
            admin: true,
            adminRole: role
        });
        // Mevcut oturumların yeni claim'leri alması için token'ları geçersiz kıl
        try { await auth.revokeRefreshTokens(uid); } catch {}
        console.log(`Admin rolü atandı: ${uid} -> ${role}`);
        return true;
    } catch (error) {
        console.error('Admin rolü atama hatası:', error);
        return false;
    }
};

/**
 * Kullanıcının admin rolünü kaldırır
 * @param uid - Kullanıcının Firebase UID'si
 */
export const removeAdminRole = async (uid: string) => {
    try {
        await auth.setCustomUserClaims(uid, {
            admin: false,
            adminRole: null
        });
        try { await auth.revokeRefreshTokens(uid); } catch {}
        console.log(`Admin rolü kaldırıldı: ${uid}`);
        return true;
    } catch (error) {
        console.error('Admin rolü kaldırma hatası:', error);
        return false;
    }
};

/**
 * Kullanıcının admin rolünü getirir
 * @param uid - Kullanıcının Firebase UID'si
 */
export const getAdminRole = async (uid: string) => {
    try {
        const user = await auth.getUser(uid);
        return user.customClaims?.adminRole || null;
    } catch (error) {
        console.error('Admin rolü getirme hatası:', error);
        return null;
    }
};
