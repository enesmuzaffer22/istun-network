import React, { useState, useEffect } from "react";
import API from "../utils/axios";

function BridgeProjectsImpactPage() {
  const [impactData, setImpactData] = useState({
    volunteer_student: 0,
    donated_institution: 0,
    active_project: 0,
    volunteer_hour: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Etki skorlarını getir
  const fetchImpactData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/bridgeprojectsimpact");
      setImpactData(response.data);
      setError("");
    } catch (err) {
      setError("Etki skorları yüklenirken hata oluştu.");
      console.error("Impact data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde etki skorlarını getir
  useEffect(() => {
    fetchImpactData();
  }, []);

  // Form değişikliklerini handle et
  const handleChange = (e) => {
    const { name, value } = e.target;
    setImpactData((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  // Skorları kaydet
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await API.put("/bridgeprojectsimpact", impactData);
      setSuccess("Etki skorları başarıyla güncellendi!");

      // 3 saniye sonra success mesajını temizle
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError("Etki skorları kaydedilirken hata oluştu.");
      console.error("Impact data save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Formu sıfırla
  const handleReset = () => {
    if (window.confirm("Tüm değerleri sıfırlamak istediğinize emin misiniz?")) {
      setImpactData({
        volunteer_student: 0,
        donated_institution: 0,
        active_project: 0,
        volunteer_hour: 0,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Köprü Projeleri Etki Skorları
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSave}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gönüllü Öğrenci Sayısı */}
              <div className="space-y-2">
                <label
                  htmlFor="volunteer_student"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gönüllü Öğrenci Sayısı
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="volunteer_student"
                    id="volunteer_student"
                    value={impactData.volunteer_student}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-semibold"
                    min="0"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">kişi</span>
                  </div>
                </div>
              </div>

              {/* Bağış Yapılan Kurum Sayısı */}
              <div className="space-y-2">
                <label
                  htmlFor="donated_institution"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bağış Yapılan Kurum Sayısı
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="donated_institution"
                    id="donated_institution"
                    value={impactData.donated_institution}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-semibold"
                    min="0"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">kurum</span>
                  </div>
                </div>
              </div>

              {/* Aktif Proje Sayısı */}
              <div className="space-y-2">
                <label
                  htmlFor="active_project"
                  className="block text-sm font-medium text-gray-700"
                >
                  Aktif Proje Sayısı
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="active_project"
                    id="active_project"
                    value={impactData.active_project}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-semibold"
                    min="0"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">proje</span>
                  </div>
                </div>
              </div>

              {/* Gönüllü Saat Sayısı */}
              <div className="space-y-2">
                <label
                  htmlFor="volunteer_hour"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gönüllü Saat Sayısı
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="volunteer_hour"
                    id="volunteer_hour"
                    value={impactData.volunteer_hour}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-semibold"
                    min="0"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">saat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* İstatistik Kartları */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="bi bi-people-fill text-red-600 text-2xl"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-600">
                      Gönüllü Öğrenci
                    </p>
                    <p className="text-2xl font-bold text-red-800">
                      {impactData.volunteer_student.toLocaleString()}+
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="bi bi-building text-blue-600 text-2xl"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">
                      Bağış Kurumu
                    </p>
                    <p className="text-2xl font-bold text-blue-800">
                      {impactData.donated_institution.toLocaleString()}+
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="bi bi-diagram-3 text-green-600 text-2xl"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">
                      Aktif Proje
                    </p>
                    <p className="text-2xl font-bold text-green-800">
                      {impactData.active_project.toLocaleString()}+
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="bi bi-clock-fill text-purple-600 text-2xl"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">
                      Gönüllü Saat
                    </p>
                    <p className="text-2xl font-bold text-purple-800">
                      {impactData.volunteer_hour.toLocaleString()}+
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Butonlar */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <i className="bi bi-arrow-clockwise mr-2"></i>
                Sıfırla
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
              >
                {saving ? (
                  <>
                    <i className="bi bi-arrow-clockwise animate-spin"></i>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg"></i>
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Açıklama */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="bi bi-info-circle text-blue-600 text-xl"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Bilgi</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Bu sayfada köprü projelerinin genel etki skorlarını
                görüntüleyebilir ve güncelleyebilirsiniz. Değişiklikler anında
                kaydedilir ve tüm kullanıcılar tarafından görülebilir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BridgeProjectsImpactPage;
