// src/components/MarkdownComponents.jsx
import React from "react";
import remarkGfm from "remark-gfm";

// Detaylı markdown component'leri - Tüm detay sayfalarında kullanılabilir
const markdownComponents = {
  // Başlıklar
  h1: ({ ...props }) => (
    <h1
      className="text-3xl font-bold mt-8 mb-4 text-primary border-b-2 border-primary/20 pb-2"
      {...props}
    />
  ),
  h2: ({ ...props }) => (
    <h2 className="text-2xl font-bold mt-6 mb-3 text-primary" {...props} />
  ),
  h3: ({ ...props }) => (
    <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-800" {...props} />
  ),
  h4: ({ ...props }) => (
    <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-700" {...props} />
  ),
  h5: ({ ...props }) => (
    <h5
      className="text-base font-semibold mt-3 mb-2 text-gray-600"
      {...props}
    />
  ),
  h6: ({ ...props }) => (
    <h6 className="text-sm font-semibold mt-3 mb-2 text-gray-500" {...props} />
  ),

  // Paragraflar
  p: ({ ...props }) => (
    <p className="mb-4 leading-relaxed text-gray-800 text-base" {...props} />
  ),

  // Listeler
  ul: ({ ...props }) => (
    <ul className="list-disc ml-6 my-4 space-y-1" {...props} />
  ),
  ol: ({ ...props }) => (
    <ol className="list-decimal ml-6 my-4 space-y-1" {...props} />
  ),
  li: ({ ...props }) => (
    <li className="text-gray-800 leading-relaxed" {...props} />
  ),

  // Linkler
  a: ({ ...props }) => (
    <a
      className="text-primary underline hover:text-primary/80 transition-colors font-medium"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),

  // Kod blokları
  code: ({ inline, ...props }) =>
    inline ? (
      <code
        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono"
        {...props}
      />
    ) : (
      <code
        className="block bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4"
        {...props}
      />
    ),
  pre: ({ ...props }) => (
    <pre
      className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4"
      {...props}
    />
  ),

  // Blockquote
  blockquote: ({ ...props }) => (
    <blockquote
      className="border-l-4 border-primary pl-4 py-2 my-4 bg-gray-50 italic text-gray-700"
      {...props}
    />
  ),

  // Tablo
  table: ({ ...props }) => (
    <div className="overflow-x-auto my-6">
      <table
        className="min-w-full border-collapse border border-gray-300"
        {...props}
      />
    </div>
  ),
  thead: ({ ...props }) => <thead className="bg-gray-100" {...props} />,
  tbody: ({ ...props }) => <tbody {...props} />,
  tr: ({ ...props }) => <tr className="border-b border-gray-200" {...props} />,
  th: ({ ...props }) => (
    <th
      className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800"
      {...props}
    />
  ),
  td: ({ ...props }) => (
    <td className="border border-gray-300 px-4 py-2 text-gray-700" {...props} />
  ),

  // Yatay çizgi
  hr: ({ ...props }) => (
    <hr className="my-8 border-t-2 border-gray-200" {...props} />
  ),

  // Resimler
  img: ({ ...props }) => (
    <img
      className="max-w-full h-auto rounded-lg shadow-md my-4 mx-auto"
      {...props}
    />
  ),

  // Strong ve em
  strong: ({ ...props }) => (
    <strong className="font-bold text-gray-900" {...props} />
  ),
  em: ({ ...props }) => <em className="italic text-gray-700" {...props} />,
};

// Markdown wrapper component - Tutarlı stil için
export const MarkdownWrapper = ({ children, className = "" }) => (
  <div className={`prose prose-lg max-w-none text-gray-800 ${className}`}>
    {children}
  </div>
);

// Remark plugins export'u
export const remarkPlugins = [remarkGfm];

// Export both the components and wrapper
export { markdownComponents };
export default MarkdownWrapper;
