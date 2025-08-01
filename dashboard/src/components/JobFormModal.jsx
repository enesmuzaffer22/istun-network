// dashboard/src/components/JobFormModal.jsx

import React, { useState, useEffect } from 'react';

function JobFormModal({ isOpen, onClose, onSave, job }) {
  // Eğer bir 'job' prop'u geldiyse, bu düzenleme modudur.
  // Gelmediyse, ekleme modudur.
  const isEditing = Boolean(job); 

  const [formData, setFormData] = useState({
    title: '',
    employer: '',
    content: '',
    link: '',
  });

  // job prop'u değiştiğinde (yani düzenle'ye basıldığında) formu doldur.
  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: job.title || '',
        employer: job.employer || '',
        content: job.content || '',
        link: job.link || '',
      });
    } else {
      // Ekleme modunda formu temizle
      setFormData({ title: '', employer: '', content: '', link: '' });
    }
  }, [job, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // onSave fonksiyonunu, form verileri ve (varsa) iş ID'si ile çağır.
    onSave(formData, job ? job.id : null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Başlık</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div className="mb-4">
            <label htmlFor="employer" className="block text-gray-700 font-semibold mb-2">İşveren</label>
            <input type="text" name="employer" id="employer" value={formData.employer} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">Açıklama</label>
            <textarea name="content" id="content" value={formData.content} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" rows="5"></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="link" className="block text-gray-700 font-semibold mb-2">Başvuru Linki</label>
            <input type="url" name="link" id="link" value={formData.link} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg">İptal</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg">{isEditing ? 'Güncelle' : 'Kaydet'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobFormModal;