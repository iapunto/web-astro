import React from "react";
import { Icon } from "astro-icon";
import { BlogArticle } from "../../lib/types/cms";

interface ArticleListProps {
  articles: BlogArticle[];
  onEdit: (article: BlogArticle) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "archived":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "published":
      return "Publicado";
    case "draft":
      return "Borrador";
    case "archived":
      return "Archivado";
    default:
      return status;
  }
};

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  onEdit,
  onDelete,
  onPublish
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Artículos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artículo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Publicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={article.cover}
                        alt={article.coverAlt || article.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {article.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {article.description.substring(0, 60)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {article.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(article.status)}`}>
                    {getStatusText(article.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(article.pubDate).toLocaleDateString("es-ES")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(article)}
                      className="text-blue-600 hover:text-blue-900"
                      aria-label="Editar artículo"
                      title="Editar artículo"
                    >
                      <Icon name="material-symbols:edit" className="w-4 h-4" />
                    </button>
                    {article.status === "draft" && (
                      <button
                        onClick={() => onPublish(article.id)}
                        className="text-green-600 hover:text-green-900"
                        aria-label="Publicar artículo"
                        title="Publicar artículo"
                      >
                        <Icon name="material-symbols:publish" className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(article.id)}
                      className="text-red-600 hover:text-red-900"
                      aria-label="Eliminar artículo"
                      title="Eliminar artículo"
                    >
                      <Icon name="material-symbols:delete" className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 