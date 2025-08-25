-- Intercambiar estructuras de gem4_results y gem5_results
-- GEM 4 ahora genera imágenes, GEM 5 genera frontmatter

-- Eliminar tablas existentes
DROP TABLE IF EXISTS gem4_results CASCADE;
DROP TABLE IF EXISTS gem5_results CASCADE;

-- Crear nueva tabla gem4_results para imágenes
CREATE TABLE gem4_results (
  id SERIAL PRIMARY KEY,
  tracking_id UUID NOT NULL REFERENCES articles_tracking(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  cloudinary_public_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear nueva tabla gem5_results para frontmatter
CREATE TABLE gem5_results (
  id SERIAL PRIMARY KEY,
  tracking_id UUID NOT NULL REFERENCES articles_tracking(id) ON DELETE CASCADE,
  frontmatter JSONB NOT NULL,
  mdx_content TEXT NOT NULL,
  validation_passed BOOLEAN DEFAULT true,
  validation_errors TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_gem4_results_tracking_id ON gem4_results(tracking_id);
CREATE INDEX IF NOT EXISTS idx_gem5_results_tracking_id ON gem5_results(tracking_id);

-- Agregar comentarios
COMMENT ON TABLE gem4_results IS 'Resultados de GEM 4 - Generación de imágenes de portada';
COMMENT ON COLUMN gem4_results.image_url IS 'URL de la imagen generada en Cloudinary';
COMMENT ON COLUMN gem4_results.image_alt IS 'Texto alternativo descriptivo de la imagen';
COMMENT ON COLUMN gem4_results.cloudinary_public_id IS 'ID público de la imagen en Cloudinary';

COMMENT ON TABLE gem5_results IS 'Resultados de GEM 5 - Generación de frontmatter y MDX';
COMMENT ON COLUMN gem5_results.frontmatter IS 'Frontmatter del artículo en formato JSONB';
COMMENT ON COLUMN gem5_results.mdx_content IS 'Contenido MDX del artículo';
COMMENT ON COLUMN gem5_results.validation_passed IS 'Indica si la validación del frontmatter pasó';
COMMENT ON COLUMN gem5_results.validation_errors IS 'Lista de errores de validación si los hay';
