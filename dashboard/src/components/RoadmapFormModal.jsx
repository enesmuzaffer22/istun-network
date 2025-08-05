import React, { useState, useEffect } from 'react';

function RoadmapFormModal({ isOpen, onClose, onSave, roadmapItem }) {
  // Form alanları için state'ler
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // Seçilen resim dosyasını tutmak için yeni state
  const [imageFile, setImageFile] = useState(null);
  // Mevcut resmin URL'sini göstermek için state
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // 'roadmapItem' prop'u değiştiğinde (yani düzenleme modu açıldığında)
  // form alanlarını mevcut verilerle doldurur.
  useEffect(() => {
    if (roadmapItem) {
      setTitle(roadmapItem.title || '');
      setContent(roadmapItem.content || '');
      setCurrentImageUrl(roadmapItem.image_url || '');
      setImageFile(null); // Düzenleme modunda dosyayı sıfırla
    } else {
      // Ekleme modunda (roadmapItem null ise) formu sıfırla
      setTitle('');
      setContent('');
      setCurrentImageUrl('');
      setImageFile(null);
    }
  }, [roadmapItem, isOpen]);

  if (!isOpen) {
    return null;
  }

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = (e) => {
    e.preventDefault();
    // onSave fonksiyonuna form verilerini ve ID'yi gönder
    onSave({ title, content, imageFile }, roadmapItem ? roadmapItem.id : null);
  };

  // Resim seçildiğinde state'i güncelle
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setCurrentImageUrl(URL.createObjectURL(e.target.files[0])); // Önizleme için geçici URL oluştur
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">{roadmapItem ? 'Yol Haritasını Düzenle' : 'Yeni Yol Haritası Ekle'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Başlık</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">İçerik (Markdown Destekler)</label>
            <textarea
              id="content"
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Kapak Resmi</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {currentImageUrl && <img src={currentImageUrl} alt="Önizleme" className="mt-4 w-40 h-auto rounded" />}
          </div>

          <div className="flex items-center justify-end">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:shadow-outline mr-2">
              İptal
            </button>
            <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary/90 focus:outline-none focus:shadow-outline">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoadmapFormModal;