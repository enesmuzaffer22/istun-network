// backend/src/utils/emailService.ts

import { db } from "../firebase/firebase";

export interface EmailData {
  to: string;
  subject?: string;
  html?: string;
  text?: string;
  template?: {
    name: string;
    data: { [key: string]: any };
  };
}

/**
 * Firebase Extensions Trigger Email kullanarak email gönderir
 * Extension'ın 'mail' koleksiyonunu dinlemesi gerekiyor
 */
export const sendEmail = async (emailData: EmailData): Promise<void> => {
  try {
    // Firebase Extensions için doğru format
    const mailDoc = {
      to: emailData.to,
      message: {
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      },
    };

    // Template varsa ekle
    if (emailData.template) {
      (mailDoc as any).template = emailData.template;
    }

    // Firebase Extensions Trigger Email için mail koleksiyonuna döküman ekle
    const docRef = await db.collection("mail").add(mailDoc);

    console.log(`Email queued with ID: ${docRef.id} for: ${emailData.to}`);
  } catch (error) {
    console.error("Email gönderim hatası:", error);
    throw new Error("Email gönderilemedi");
  }
};

/**
 * Kullanıcı onaylandığında email gönder
 */
export const sendUserApprovedEmail = async (
  userEmail: string,
  userName: string,
  userSurname: string
): Promise<void> => {
  const emailData: EmailData = {
    to: userEmail,
    subject: "🎉 Hesabınız Onaylandı - İSTÜN Mezunlar Ağı",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5aa0;">🎉 Hoş Geldiniz!</h2>
        
        <p>Merhaba <strong>${userName} ${userSurname}</strong>,</p>
        
        <p>İSTÜN Mezunlar Ağı'na katılım başvurunuz <strong style="color: #28a745;">onaylanmıştır</strong>! 🎊</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c5aa0; margin-top: 0;">Artık şunları yapabilirsiniz:</h3>
          <ul style="line-height: 1.6;">
            <li>📰 Mezun haberlerini takip edebilirsiniz</li>
            <li>💼 İş ilanlarını görüntüleyebilirsiniz</li>
            <li>🚀 Kariyer yol haritalarına erişebilirsiniz</li>
            <li>🤝 Diğer mezunlarla bağlantı kurabilirsiniz</li>
            <li>📅 Etkinliklere katılabilirsiniz</li>
          </ul>
        </div>
        
        <p>
          <a href="https://istun-network.web.app/login" 
             style="background-color: #2c5aa0; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            🚀 Platforma Giriş Yap
          </a>
        </p>
        
        <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
          Herhangi bir sorunuz varsa bizimle iletişime geçmekten çekinmeyin.<br>
          <strong>İSTÜN Mezunlar Ağı Ekibi</strong>
        </p>
      </div>
    `,
    text: `
      Merhaba ${userName} ${userSurname},
      
      İSTÜN Mezunlar Ağı'na katılım başvurunuz onaylanmıştır!
      
      Artık platforma giriş yaparak tüm özelliklerden faydalanabilirsiniz.
      
      Giriş yapmak için: https://istun-network.web.app/login
      
      İSTÜN Mezunlar Ağı Ekibi
    `
  };

  await sendEmail(emailData);
};

/**
 * Kullanıcı reddedildiğinde email gönder
 */
export const sendUserRejectedEmail = async (
  userEmail: string,
  userName: string,
  userSurname: string,
  rejectionReason?: string
): Promise<void> => {
  const emailData: EmailData = {
    to: userEmail,
    subject: "❌ Başvuru Durumu - İSTÜN Mezunlar Ağı",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Başvuru Durumunuz</h2>
        
        <p>Merhaba <strong>${userName} ${userSurname}</strong>,</p>
        
        <p>İSTÜN Mezunlar Ağı'na katılım başvurunuz maalesef <strong style="color: #dc3545;">reddedilmiştir</strong>.</p>
        
        ${rejectionReason ? `
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <strong>Red Nedeni:</strong><br>
            ${rejectionReason}
          </div>
        ` : ''}
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c5aa0; margin-top: 0;">Ne yapabilirsiniz?</h3>
          <ul style="line-height: 1.6;">
            <li>📧 Bizimle iletişime geçerek durumu değerlendirebilirsiniz</li>
            <li>📄 Gerekli belgeleri tamamlayarak tekrar başvurabilirsiniz</li>
            <li>🤝 Sorularınız için destek ekibimize ulaşabilirsiniz</li>
          </ul>
        </div>
        
        <p>
          <a href="mailto:info@istunnetwork.com" 
             style="background-color: #2c5aa0; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            📧 İletişime Geç
          </a>
        </p>
        
        <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
          Anlayışınız için teşekkür ederiz.<br>
          <strong>İSTÜN Mezunlar Ağı Ekibi</strong>
        </p>
      </div>
    `,
    text: `
      Merhaba ${userName} ${userSurname},
      
      İSTÜN Mezunlar Ağı'na katılım başvurunuz maalesef reddedilmiştir.
      
      ${rejectionReason ? `Red Nedeni: ${rejectionReason}` : ''}
      
      Sorularınız için bizimle iletişime geçebilirsiniz: info@istunnetwork.com
      
      İSTÜN Mezunlar Ağı Ekibi
    `
  };

  await sendEmail(emailData);
};
