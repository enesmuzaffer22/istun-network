import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const dummyUsers = [
  {
    id: 1,
    name: 'Zeynep Özkan',
    username: 'zeynep123',
    email: 'zeynep@example.com',
    password: 'secretpass',
    tc: '98765432109',
    phone: '555-333-4444',
    workStatus: 'Çalışıyor',
    classGraduation: 'Mezun',
    graduationDate: '2022-07-20',
    studentDocument: 'https://example.com/docs/zeynep_ogrenci_belgesi.pdf',
    role: 'user',
  },
  {
    id: 2,
    name: 'Ali Şahin',
    username: 'ali_sahin',
    email: 'ali@example.com',
    password: 'pass123',
    tc: '12345678900',
    phone: '555-222-3333',
    workStatus: 'Çalışıyor',
    classGraduation: '3',
    graduationDate: '2024-06-10',
    studentDocument: 'https://example.com/docs/ali_ogrenci_belgesi.pdf',
    role: 'editor',
  },
];

const UserList = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleRoleChange = (id, newRole) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
    );
  };

  const handleDeleteUser = (id) => {
    const confirmed = window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?");
    if (confirmed) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }
    }
  };

  const exportToExcel = () => {
    const dataToExport = users.map(({ password, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kullanıcılar");
    XLSX.writeFile(workbook, "kullanicilar.xlsx");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Sistemdeki Kullanıcılar</h2>

      <button
        onClick={exportToExcel}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Excel İndir
      </button>

      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Henüz kullanıcı eklenmemiş.</p>
      ) : (
        <>
          <table className="w-full text-left border-t">
            <thead>
              <tr className="text-sm text-gray-600 border-b">
                <th className="py-3">Ad Soyad</th>
                <th className="py-3">E-posta</th>
                <th className="py-3">Rol</th>
                <th className="py-3">Yetki</th>
                <th className="py-3">Sil</th>
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
                  <td className="py-3 capitalize">{user.role}</td>
                  <td className="py-3">
                    <select
                      value={user.role}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRoleChange(user.id, e.target.value);
                      }}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="user">Kullanıcı</option>
                      <option value="editor">Editör</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.id);
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Sil
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

export default UserList;
