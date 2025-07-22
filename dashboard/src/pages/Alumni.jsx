import React from "react";

const Alumni = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-4">Mezunlar</h2>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Ad Soyad</th>
            <th className="py-2 px-4 border-b">Mezuniyet Yılı</th>
            <th className="py-2 px-4 border-b">Bölüm</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">Ali Veli</td>
            <td className="py-2 px-4 border-b">2020</td>
            <td className="py-2 px-4 border-b">Bilgisayar Mühendisliği</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b">Ayşe Yılmaz</td>
            <td className="py-2 px-4 border-b">2021</td>
            <td className="py-2 px-4 border-b">Elektrik-Elektronik</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Alumni; 