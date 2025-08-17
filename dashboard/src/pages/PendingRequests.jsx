import React, { useState, useEffect } from "react";
import API from "../utils/axios";

function PendingRequests() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // Hangi kullanıcı için işlem yapıldığını takip et

  // Bekleyen kullanıcıları getir
  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admin/auth/pending-users");

      // API response formatını kontrol et ve array olduğundan emin ol
      const data = response.data;
      console.log("API Response:", data); // Debug için

      if (Array.isArray(data)) {
        setPendingUsers(data);
      } else if (data && Array.isArray(data.users)) {
        // Eğer data.users şeklinde geliyorsa
        setPendingUsers(data.users);
      } else if (data && Array.isArray(data.data)) {
        // Eğer data.data şeklinde geliyorsa
        setPendingUsers(data.data);
      } else {
        // Beklenmeyen format durumunda boş array set et
        console.warn("Beklenmeyen API response formatı:", data);
        setPendingUsers([]);
      }

      setError("");
    } catch (err) {
      console.error("Bekleyen kullanıcılar getirilirken hata:", err);
      setError("Bekleyen kullanıcılar yüklenemedi.");
      setPendingUsers([]); // Hata durumunda da boş array set et
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı onaylama
  const approveUser = async (userId) => {
    try {
      setActionLoading(userId);
      const response = await API.post(`/admin/auth/approve-user/${userId}`);

      console.log("Approve response:", response.data); // Debug için

      // Başarılı onaylama sonrası listeyi güncelle
      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));

      // Başarı mesajı göster
      alert("Kullanıcı başarıyla onaylandı!");
    } catch (err) {
      console.error("Kullanıcı onaylanırken hata:", err);
      console.error("Error response:", err.response?.data); // Backend hata detayı

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Kullanıcı onaylanırken bir hata oluştu.";
      alert(`Hata: ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Kullanıcı reddetme
  const rejectUser = async (userId) => {
    // Kullanıcıdan reddetme sebebini al
    const reason = prompt(
      "Kullanıcıyı reddetme sebebinizi belirtiniz:",
      "Öğrenci belgesi uygun değil"
    );

    if (!reason || reason.trim() === "") {
      alert("Reddetme sebebi belirtilmesi zorunludur.");
      return;
    }

    if (
      !window.confirm(
        `Bu kullanıcıyı "${reason}" sebebiyle reddetmek istediğinizden emin misiniz?`
      )
    ) {
      return;
    }

    try {
      setActionLoading(userId);
      console.log("Rejecting user with ID:", userId, "Reason:", reason); // Debug için

      const response = await API.post(`/admin/auth/reject-user/${userId}`, {
        reason: reason.trim(),
      });
      console.log("Reject response:", response.data); // Debug için

      // Başarılı reddetme sonrası listeyi güncelle
      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));

      // Başarı mesajı göster
      alert("Kullanıcı başarıyla reddedildi!");
    } catch (err) {
      console.error("Kullanıcı reddedilirken hata:", err);
      console.error("Error response:", err.response?.data); // Backend hata detayı
      console.error("Request URL:", `/admin/auth/reject-user/${userId}`); // URL'yi kontrol et

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Kullanıcı reddedilirken bir hata oluştu.";

      // Daha detaylı hata mesajı
      alert(
        `Hata: ${errorMessage}\n\nDetay: ${err.response?.status} - ${err.response?.statusText}`
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Öğrenci belgesini yeni sekmede aç
  const openStudentDocument = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    } else {
      alert("Öğrenci belgesi bulunamadı.");
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Bekleyen kullanıcılar yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={fetchPendingUsers}
          className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Bekleyen Kullanıcı Talepleri
        </h1>
        <button
          onClick={fetchPendingUsers}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
        >
          <i className="bi bi-arrow-clockwise mr-2"></i>
          Yenile
        </button>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-8 rounded text-center">
          <i className="bi bi-inbox text-4xl mb-4 block"></i>
          Bekleyen kullanıcı talebi bulunmuyor.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ad Soyad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-posta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğrenci Belgesi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name} {user.surname}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          openStudentDocument(user.student_doc_url)
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                        disabled={!user.student_doc_url}
                      >
                        <i className="bi bi-file-earmark-text mr-1"></i>
                        Belgeyi Görüntüle
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => approveUser(user.id)}
                        disabled={actionLoading === user.id}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === user.id ? (
                          <>
                            <i className="bi bi-hourglass-split mr-1"></i>
                            İşleniyor...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle mr-1"></i>
                            Onayla
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => rejectUser(user.id)}
                        disabled={actionLoading === user.id}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === user.id ? (
                          <>
                            <i className="bi bi-hourglass-split mr-1"></i>
                            İşleniyor...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-x-circle mr-1"></i>
                            Reddet
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingRequests;
