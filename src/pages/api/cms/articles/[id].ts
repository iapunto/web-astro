import type { APIRoute } from 'astro';
import { CMSAPI } from '../../../../lib/cms-api';

// GET /api/cms/articles/[id] - Obtener artículo por ID
export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID requerido' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const article = await CMSAPI.getArticleById(id);
    if (!article) {
      return new Response(JSON.stringify({ error: 'Artículo no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(article), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error al obtener artículo' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// PUT /api/cms/articles/[id] - Actualizar artículo
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID requerido' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const updates = await request.json();
    const updatedArticle = await CMSAPI.updateArticle(id, updates);

    if (!updatedArticle) {
      return new Response(JSON.stringify({ error: 'Artículo no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(updatedArticle), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error al actualizar artículo' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// DELETE /api/cms/articles/[id] - Eliminar artículo
export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID requerido' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const success = await CMSAPI.deleteArticle(id);
    if (!success) {
      return new Response(JSON.stringify({ error: 'Artículo no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error al eliminar artículo' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// PATCH /api/cms/articles/[id]/publish - Publicar artículo
export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID requerido' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const { action } = await request.json();

    let updatedArticle;
    if (action === 'publish') {
      updatedArticle = await CMSAPI.publishArticle(id);
    } else if (action === 'archive') {
      updatedArticle = await CMSAPI.archiveArticle(id);
    } else {
      return new Response(JSON.stringify({ error: 'Acción no válida' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!updatedArticle) {
      return new Response(JSON.stringify({ error: 'Artículo no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(updatedArticle), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error al actualizar estado del artículo' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
