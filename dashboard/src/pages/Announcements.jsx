import React from "react";

const Announcements = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-4">Duyurular</h2>
      <ul className="space-y-3">
        <li className="bg-white p-4 rounded shadow">Yeni mezun buluşması 15 Ağustos'ta gerçekleşecek.</li>
        <li className="bg-white p-4 rounded shadow">2024 yılı mezuniyet töreni kayıtları başladı.</li>
      </ul>
    </div>
  );
};

export default Announcements; 