-- Agregar tabla para resultados de GEM 5 (generación de imágenes)
CREATE TABLE IF NOT EXISTS gem5_results (
  id SERIAL PRIMARY KEY,
  tracking_id UUID NOT NULL REFERENCES articles_tracking(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  cloudinary_public_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_gem5_results_tracking_id ON gem5_results(tracking_id);

-- Agregar comentarios
COMMENT ON TABLE gem5_results IS 'Resultados de GEM 5 - Generación de imágenes de portada';
COMMENT ON COLUMN gem5_results.image_url IS 'URL de la imagen generada en Cloudinary';
COMMENT ON COLUMN gem5_results.image_alt IS 'Texto alternativo descriptivo de la imagen';
COMMENT ON COLUMN gem5_results.cloudinary_public_id IS 'ID público de la imagen en Cloudinary';
