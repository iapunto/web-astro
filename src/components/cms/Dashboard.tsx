import React from "react";
import { Icon } from "astro-icon";
import { BlogArticle } from "../../lib/types/cms";

interface DashboardProps {
  articles: BlogArticle[];
}

export const Dashboard: React.FC<DashboardProps> = ({ articles }) => {
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(a => a.status === "published").length;
  const draftArticles = articles.filter(a => a.status === "draft").length;
  const archivedArticles = articles.filter(a => a.status === "archived").length;
  
  const recentArticles = articles
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const categoryStats = articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="material-symbols:article" className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Artículos</p>
              <p className="text-2xl font-semibold text-gray-900">{totalArticles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="material-symbols:published-with-changes" className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Publicados</p>
              <p className="text-2xl font-semibold text-gray-900">{publishedArticles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="material-symbols:edit-document" className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Borradores</p>
              <p className="text-2xl font-semibold text-gray-900">{draftArticles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="material-symbols:archive" className="w-8 h-8 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Archivados</p>
              <p className="text-2xl font-semibold text-gray-900">{archivedArticles}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artículos recientes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Artículos Recientes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <div key={article.id} className="flex items-center space-x-4">
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {article.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(article.updatedAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    article.status === "published" ? "bg-green-100 text-green-800" :
                    article.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {article.status === "published" ? "Publicado" :
                     article.status === "draft" ? "Borrador" : "Archivado"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categorías más populares */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Categorías Más Populares</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topCategories.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{category}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {count} artículos
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Actividad Reciente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentArticles.slice(0, 3).map((article) => (
              <div key={article.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Icon 
                    name={article.status === "published" ? "material-symbols:published-with-changes" : 
                          article.status === "draft" ? "material-symbols:edit-document" : "material-symbols:archive"} 
                    className={`w-5 h-5 ${
                      article.status === "published" ? "text-green-600" :
                      article.status === "draft" ? "text-yellow-600" : "text-gray-600"
                    }`} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {article.status === "published" ? "Artículo publicado" :
                     article.status === "draft" ? "Artículo editado" : "Artículo archivado"}: {article.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(article.updatedAt).toLocaleString("es-ES")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 