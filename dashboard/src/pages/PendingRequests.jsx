import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const dummyPendingUsers = [
  {
    id: 1,
    name: 'Ayşe Yıldız',
    username: 'aysey',
    email: 'ayse@example.com',
    password: 'secret123',
    tc: '12345678901',
    phone: '555-111-2222',
    workStatus: 'Çalışmıyor',
    classGraduation: '4',
    graduationDate: '2023-06-15',
    studentDocument: 'https://example.com/docs/ayse_ogrenci_belgesi.pdf',
    department: 'Yazılım Mühendisliği',
  },
  // diğer kullanıcılar...
];

const PendingRequests = () => {
  const [users, setUsers] = useState(dummyPendingUsers);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDecision = (id, type) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    alert(`Kullanıcı ${type === 'accept' ? 'onaylandı' : 'reddedildi'}`);
    if(selectedUser?.id === id) setSelectedUser(null);
  };

  const exportToExcel = () => {
    const dataToExport = users.map(({ password, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bekleyen Kullanıcılar");
    XLSX.writeFile(workbook, "bekleyen_kullanicilar.xlsx");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Bekleyen Üyelik Talepleri</h2>

      <button
        onClick={exportToExcel}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Excel İndir
      </button>

      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Şu anda bekleyen talep bulunmamaktadır.</p>
      ) : (
        <>
          <table className="w-full text-left border-t">
            <thead>
              <tr className="text-sm text-gray-600 border-b">
                <th className="py-3">Ad Soyad</th>
                <th className="py-3">E-posta</th>
                <th className="py-3">Bölüm</th>
                <th className="py-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedUser(user.id === selectedUser?.id ? null : user)}
                >
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.department}</td>
                  <td className="py-3 space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecision(user.id, 'accept');
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Onayla
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecision(user.id, 'reject');
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reddet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedUser && (
            <div className="mt-4 p-4 bg-gray-100 rounded shadow">
              <h3 className="font-semibold text-lg mb-2">Kullanıcı Detayları</h3>
              <p><strong>Ad Soyad:</strong> {selectedUser.name}</p>
              <p><strong>Kullanıcı Adı:</strong> {selectedUser.username}</p>
              <p><strong>E-posta:</strong> {selectedUser.email}</p>
              <p><strong>T.C. No:</strong> {selectedUser.tc}</p>
              <p><strong>Telefon:</strong> {selectedUser.phone}</p>
              <p><strong>Çalışma Durumu:</strong> {selectedUser.workStatus}</p>
              <p><strong>Sınıf Mezuniyeti:</strong> {selectedUser.classGraduation}</p>
              <p><strong>Mezuniyet Tarihi:</strong> {selectedUser.graduationDate}</p>
              <p>
                <strong>Öğrenci Belgesi:</strong>{' '}
                <a
                  href={selectedUser.studentDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  PDF Görüntüle
                </a>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PendingRequests;
