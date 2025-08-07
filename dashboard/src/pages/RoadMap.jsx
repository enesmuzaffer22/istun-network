import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

const RoadmapEditor = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleEditorChange = ({ html, text }) => {
    setContent(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log({ title, image, content });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Yeni Yol Haritası Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Başlık</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Örneğin: Yapay Zeka Uzmanlığı Yol Haritası"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Kartta Kullanılacak Görsel</label>
          <div className="flex items-center space-x-4 p-4 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:border-blue-400">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer text-sm"
            />
            {image && <span className="text-green-600 font-medium">{image.name}</span>}
          </div>
          <p className="text-sm text-gray-500 mt-1">Lütfen yol haritasını temsil eden bir görsel seçin.</p>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">İçerik (Markdown)</label>
          <MdEditor
            value={content}
            style={{ height: '400px' }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default RoadmapEditor;
