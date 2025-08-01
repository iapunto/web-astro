import React from "react";
import { Icon } from "astro-icon";

interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = () => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "material-symbols:dashboard",
      href: "/admin"
    },
    {
      id: "articles",
      label: "Artículos",
      icon: "material-symbols:article",
      href: "/admin/articles"
    },
    {
      id: "categories",
      label: "Categorías",
      icon: "material-symbols:category",
      href: "/admin/categories"
    },
    {
      id: "tags",
      label: "Etiquetas",
      icon: "material-symbols:label",
      href: "/admin/tags"
    },
    {
      id: "media",
      label: "Medios",
      icon: "material-symbols:image",
      href: "/admin/media"
    },
    {
      id: "settings",
      label: "Configuración",
      icon: "material-symbols:settings",
      href: "/admin/settings"
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">IA Punto CMS</h1>
      </div>
      
      <nav className="mt-6">
        <div className="px-4">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              <Icon name={item.icon} className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}; 