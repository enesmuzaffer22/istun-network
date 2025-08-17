import React, { useState, useEffect } from "react";
import API from "../utils/axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Kullanıcıları getir
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/users");

      // Yeni API response formatını işle
      const apiResponse = response.data;
      console.log("Users API Response:", apiResponse); // Debug için

      if (apiResponse && Array.isArray(apiResponse.data)) {
        // Sadece approved status'lu kullanıcıları filtrele
        const approvedUsers = apiResponse.data.filter(
          (user) => user.status?.toLowerCase() === "approved"
        );
        setUsers(approvedUsers);
      } else {
        // Beklenmeyen format durumunda boş array set et
        console.warn("Beklenmeyen Users API response formatı:", apiResponse);
        setUsers([]);
      }

      setError("");
    } catch (err) {
      console.error("Kullanıcılar getirilirken hata:", err);
      setError("Kullanıcılar yüklenemedi.");
      setUsers([]); // Hata durumunda da boş array set et
    } finally {
      setLoading(false);
    }
  };

  // Arama filtreleme - yeni field'lara göre güncellendi
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
  );

  // Tarih formatlama
  const formatDate = (dateString) => {
    if (!dateString) return "Belirtilmemiş";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Geçersiz tarih";
    }
  };

  // Kullanıcı durumu badge'i - yeni status field'ına göre
  const getUserStatusBadge = (user) => {
    const status = user.status?.toLowerCase();

    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <i className="bi bi-check-circle mr-1"></i>
            Aktif
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <i className="bi bi-hourglass-split mr-1"></i>
            Beklemede
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <i className="bi bi-x-circle mr-1"></i>
            Reddedildi.
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <i className="bi bi-question-circle mr-1"></i>
            {status || "Bilinmiyor"}
          </span>
        );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Kullanıcılar yükleniyor...</div>
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
          onClick={fetchUsers}
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
          Onaylanmış Kullanıcılar
        </h1>
        <button
          onClick={fetchUsers}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
        >
          <i className="bi bi-arrow-clockwise mr-2"></i>
          Yenile
        </button>
      </div>

      {/* Arama çubuğu */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="bi bi-search text-gray-400"></i>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Kullanıcı ara (ad, soyad, kullanıcı adı, e-posta, telefon)..."
          />
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="bi bi-people text-2xl text-blue-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Toplam Kullanıcı
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="bi bi-check-circle text-2xl text-green-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Onaylanmış Kullanıcılar
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="bi bi-search text-2xl text-gray-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Arama Sonuçları
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredUsers.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-8 rounded text-center">
          <i className="bi bi-person-check text-4xl mb-4 block"></i>
          {searchTerm
            ? "Arama kriterlerinize uygun onaylanmış kullanıcı bulunamadı."
            : "Henüz hiç onaylanmış kullanıcı bulunmuyor."}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kayıt Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İş & Eğitim Durumu
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                            {user.name?.[0]?.toUpperCase()}
                            {user.surname?.[0]?.toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name} {user.surname}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username} • ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getUserStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.workStatus && (
                          <div className="mb-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <i className="bi bi-briefcase mr-1"></i>
                              {user.workStatus}
                            </span>
                          </div>
                        )}
                        {user.classStatus && (
                          <div>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <i className="bi bi-mortarboard mr-1"></i>
                              {user.classStatus}
                            </span>
                          </div>
                        )}
                      </div>
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

export default UserList;
