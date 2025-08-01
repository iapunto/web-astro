import React, { useState } from "react";
import { Icon } from "astro-icon";
import { BlogArticle } from "../../lib/types/cms";

interface ArticleEditorProps {
  article?: Partial<BlogArticle>;
  onSave: (article: BlogArticle) => void;
  onCancel: () => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  article,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    description: article?.description || "",
    cover: article?.cover || "",
    coverAlt: article?.coverAlt || "",
    category: article?.category || "",
    subcategory: article?.subcategory || "",
    tags: article?.tags || [],
    quote: article?.quote || "",
    content: article?.content || "",
    status: article?.status || "draft" as const,
    author: {
      name: article?.author?.name || "Sergio Rondón",
      description: article?.author?.description || "CEO de IA Punto",
      image: article?.author?.image || "https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/sergio_gdcaeh.png"
    }
  });

  const [newTag, setNewTag] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAuthorChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      author: {
        ...prev.author,
        [field]: value
      }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    const articleData: BlogArticle = {
      id: article?.id || Date.now().toString(),
      ...formData,
      pubDate: article?.pubDate || new Date(),
      createdAt: article?.createdAt || new Date(),
      updatedAt: new Date()
    };
    onSave(articleData);
  };

  return (
    <div className="flex h-full">
      {/* Panel de metadatos */}
      <div className="w-1/3 bg-white p-6 border-r border-gray-200 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-6">Metadatos del Artículo</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Título del artículo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="url-del-articulo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción del artículo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de portada
            </label>
            <input
              type="url"
              value={formData.cover}
              onChange={(e) => handleInputChange("cover", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt de la imagen
            </label>
            <input
              type="text"
              value={formData.coverAlt}
              onChange={(e) => handleInputChange("coverAlt", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción de la imagen"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
                         <select
               value={formData.category}
               onChange={(e) => handleInputChange("category", e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               aria-label="Seleccionar categoría"
               title="Seleccionar categoría"
             >
              <option value="">Seleccionar categoría</option>
              <option value="Inteligencia Artificial">Inteligencia Artificial</option>
              <option value="Marketing Digital">Marketing Digital</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Negocios">Negocios</option>
              <option value="SEO">SEO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategoría
            </label>
            <input
              type="text"
              value={formData.subcategory}
              onChange={(e) => handleInputChange("subcategory", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Subcategoría (opcional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nueva etiqueta"
              />
                             <button
                 onClick={addTag}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                 aria-label="Agregar etiqueta"
                 title="Agregar etiqueta"
               >
                 <Icon name="material-symbols:add" className="w-4 h-4" />
               </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                                     <button
                     onClick={() => removeTag(tag)}
                     className="ml-1 text-blue-600 hover:text-blue-800"
                     aria-label={`Eliminar etiqueta ${tag}`}
                     title={`Eliminar etiqueta ${tag}`}
                   >
                     <Icon name="material-symbols:close" className="w-3 h-3" />
                   </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cita destacada
            </label>
            <textarea
              value={formData.quote}
              onChange={(e) => handleInputChange("quote", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Cita destacada del artículo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h4 className="text-md font-semibold">Información del Autor</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del autor
            </label>
            <input
              type="text"
              value={formData.author.name}
              onChange={(e) => handleAuthorChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del autor
            </label>
            <input
              type="text"
              value={formData.author.description}
              onChange={(e) => handleAuthorChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del autor
            </label>
            <input
              type="url"
              value={formData.author.image}
              onChange={(e) => handleAuthorChange("image", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-8 flex space-x-4">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Guardar Artículo
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Editor de contenido */}
      <div className="flex-1 bg-white">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Contenido del Artículo</h3>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="Escribe el contenido del artículo en formato Markdown..."
          />
        </div>
      </div>
    </div>
  );
}; 