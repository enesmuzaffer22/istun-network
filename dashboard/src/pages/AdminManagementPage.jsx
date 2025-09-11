import React, { useState, useEffect } from "react";
import API from "../utils/axios";

function AdminManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    role: "content_admin",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Admin listesini getir
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admin/management/list-admins");

      console.log("Admins API Response:", response.data);

      if (response.data && Array.isArray(response.data.admins)) {
        setAdmins(response.data.admins);
      } else {
        console.warn("Beklenmeyen Admins API response formatı:", response.data);
        setAdmins([]);
      }

      setError("");
    } catch (err) {
      console.error("Adminler getirilirken hata:", err);
      setError("Adminler yüklenemedi.");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  // Admin rol atama
  const assignAdminRole = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setFormError("E-posta adresi gerekli.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      setSuccessMessage("");

      await API.post("/admin/management/set-role", {
        email: formData.email.trim(),
        role: formData.role,
      });

      setSuccessMessage(`Admin rolü başarıyla atandı: ${formData.email}`);
      setFormData({ email: "", role: "content_admin" });

      // Admin listesini yenile
      await fetchAdmins();
    } catch (err) {
      console.error("Admin rol atama hatası:", err);

      if (err.response?.status === 400) {
        setFormError("Geçersiz veri gönderildi.");
      } else if (err.response?.status === 403) {
        setFormError("Bu işlemi gerçekleştirmek için yetkiniz yok.");
      } else if (err.response?.status === 404) {
        setFormError("Kullanıcı bulunamadı.");
      } else if (err.response?.status === 500) {
        setFormError("Sunucu hatası oluştu.");
      } else {
        setFormError("Admin rolü atanırken bir hata oluştu.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Admin rol kaldırma
  const removeAdminRole = async (email) => {
    if (
      !confirm(
        `${email} kullanıcısının admin rolünü kaldırmak istediğinizden emin misiniz?`
      )
    ) {
      return;
    }

    try {
      await API.post("/admin/management/remove-role", {
        email: email,
      });

      setSuccessMessage(`Admin rolü başarıyla kaldırıldı: ${email}`);

      // Admin listesini yenile
      await fetchAdmins();
    } catch (err) {
      console.error("Admin rol kaldırma hatası:", err);

      if (err.response?.status === 400) {
        setError("Geçersiz veri gönderildi.");
      } else if (err.response?.status === 403) {
        setError("Bu işlemi gerçekleştirmek için yetkiniz yok.");
      } else if (err.response?.status === 404) {
        setError("Kullanıcı bulunamadı.");
      } else if (err.response?.status === 500) {
        setError("Sunucu hatası oluştu.");
      } else {
        setError("Admin rolü kaldırılırken bir hata oluştu.");
      }
    }
  };

  // Arama filtreleme
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.adminRole?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tarih formatlama
  const formatDate = (timestamp) => {
    if (!timestamp) return "Belirtilmemiş";

    try {
      // Firebase Timestamp formatı için
      let date;
      if (timestamp._seconds) {
        date = new Date(timestamp._seconds * 1000);
      } else {
        date = new Date(timestamp);
      }

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

  // Admin rol badge'i
  const getAdminRoleBadge = (role) => {
    switch (role) {
      case "super_admin":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <i className="bi bi-shield-fill-exclamation mr-1"></i>
            Süper Admin
          </span>
        );
      case "content_admin":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <i className="bi bi-pencil-square mr-1"></i>
            İçerik Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <i className="bi bi-question-circle mr-1"></i>
            {role || "Bilinmiyor"}
          </span>
        );
    }
  };

  // Form değişiklik handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Mesajları temizle
  const clearMessages = () => {
    setFormError("");
    setSuccessMessage("");
    setError("");
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Mesajları 5 saniye sonra otomatik temizle
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Adminler yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Yönetici Paneli</h1>
        <button
          onClick={() => {
            fetchAdmins();
            clearMessages();
          }}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
        >
          <i className="bi bi-arrow-clockwise mr-2"></i>
          Yenile
        </button>
      </div>

      {/* Hata/Başarı Mesajları */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-700 hover:text-red-900"
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-green-700 hover:text-green-900"
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
      )}

      {/* Admin Rol Atama Formu */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="bi bi-person-plus mr-2"></i>
          Admin Rol Atama
        </h2>

        <form onSubmit={assignAdminRole} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                E-posta Adresi
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Admin Rolü
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="content_admin">İçerik Admin</option>
                <option value="super_admin">Süper Admin</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <i className="bi bi-hourglass-split mr-2"></i>
                    Atanıyor...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-check mr-2"></i>
                    Rol Ata
                  </>
                )}
              </button>
            </div>
          </div>

          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {formError}
            </div>
          )}
        </form>
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
            placeholder="Admin ara (ad, soyad, e-posta, rol)..."
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
              <p className="text-sm font-medium text-gray-500">Toplam Admin</p>
              <p className="text-2xl font-semibold text-gray-900">
                {admins.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="bi bi-shield-fill-exclamation text-2xl text-red-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Süper Adminler
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  admins.filter((admin) => admin.adminRole === "super_admin")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="bi bi-pencil-square text-2xl text-blue-500"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                İçerik Adminleri
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  admins.filter((admin) => admin.adminRole === "content_admin")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tablosu */}
      {filteredAdmins.length === 0 ? (
        <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-8 rounded text-center">
          <i className="bi bi-person-gear text-4xl mb-4 block"></i>
          {searchTerm
            ? "Arama kriterlerinize uygun admin bulunamadı."
            : "Henüz hiç admin bulunmuyor."}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-posta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oluşturulma Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                            {admin.name?.[0]?.toUpperCase()}
                            {admin.surname?.[0]?.toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.name} {admin.surname}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {admin.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{admin.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getAdminRoleBadge(admin.adminRole)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => removeAdminRole(admin.email)}
                        className="text-red-600 hover:text-red-900 transition"
                      >
                        <i className="bi bi-person-dash mr-1"></i>
                        Rol Kaldır
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

export default AdminManagementPage;
