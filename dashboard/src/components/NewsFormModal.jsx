// dashboard/src/components/NewsFormModal.jsx

import React, { useState, useEffect } from 'react';

function NewsFormModal({ isOpen, onClose, onSave, newsItem }) {
  const isEditing = Boolean(newsItem);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    banner_img_url: '',
    thumbnail_img_url: '',
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: newsItem.title || '',
        content: newsItem.content || '',
        category: newsItem.category || '',
        banner_img_url: newsItem.banner_img_url || '',
        thumbnail_img_url: newsItem.thumbnail_img_url || '',
      });
    } else {
      setFormData({ title: '', content: '', category: '', banner_img_url: '', thumbnail_img_url: '' });
    }
  }, [newsItem, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, newsItem ? newsItem.id : null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Haberi Düzenle' : 'Yeni Haber Ekle'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Başlık</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Kategori</label>
            <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">İçerik (Markdown destekler)</label>
            <textarea name="content" id="content" value={formData.content} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" rows="8"></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="banner_img_url" className="block text-gray-700 font-semibold mb-2">Banner Resim URL</label>
            <input type="url" name="banner_img_url" id="banner_img_url" value={formData.banner_img_url} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label htmlFor="thumbnail_img_url" className="block text-gray-700 font-semibold mb-2">Küçük Resim URL (Thumbnail)</label>
            <input type="url" name="thumbnail_img_url" id="thumbnail_img_url" value={formData.thumbnail_img_url} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
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

export default NewsFormModal;