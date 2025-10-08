import { useEffect, useState } from 'react';
import type { StrapiArticle } from '../../lib/types/strapi.js';

interface Props {
  fallbackArticles: StrapiArticle[];
}

export default function ClientBlogLoader({ fallbackArticles }: Props) {
  const [articles, setArticles] = useState<StrapiArticle[]>(fallbackArticles);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        console.log(
          '🔄 [CLIENT] Cargando artículos desde Strapi (client-side)...'
        );

        // Fetch directo a Strapi desde el navegador del usuario
        const response = await fetch(
          'https://strapi.iapunto.com/api/articles?populate=*&sort[0]=publishedAt:desc&pagination[pageSize]=100',
          {
            headers: {
              Authorization:
                'Bearer 5fac4193c9c1c74f70d42541071be45f0331b101ab66524a078aa27eb054ec80d6aa98c4650f8d03f48f9e272c64490acc60b3125f9999c3cb3f84b5e54b7e34b6dbc65c08967e0686ecf91a686516a04bc89788cf3d01580f3fc519b32ef21a47628ad4f5a10cc1e688e4af313c970a4239167a7d609b78215699987c2811fa',
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          console.log(`✅ [CLIENT] Artículos cargados: ${data.data.length}`);
          setArticles(data.data);
          setError(null);
        }
      } catch (err) {
        console.error('❌ [CLIENT] Error cargando artículos:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Retornar los datos para que el componente padre los use
  if (typeof window !== 'undefined') {
    (window as any).clientArticles = articles;
    (window as any).clientLoading = loading;
    (window as any).clientError = error;
  }

  return (
    <div
      style={{ display: 'none' }}
      data-articles={JSON.stringify(articles)}
      data-loading={loading}
      data-error={error}
    >
      {/* Este componente solo carga datos, no renderiza nada visible */}
    </div>
  );
}
