-- Esquema de Base de Datos para Sistema de Automatización de Artículos IA Punto
-- Versión: 1.0.0
-- Fecha: Enero 2025

-- =====================================================
-- TABLA PRINCIPAL: ARTICLES_TRACKING
-- =====================================================
CREATE TABLE articles_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    published_url VARCHAR(500),
    error TEXT,
    
    -- Índices para optimización
    CONSTRAINT valid_status CHECK (status IN (
        'pending', 'gem1_completed', 'gem2_in_progress', 'gem2_completed',
        'gem3_in_progress', 'gem3_completed', 'gem4_in_progress', 
        'gem4_completed', 'published', 'error'
    ))
);

CREATE INDEX idx_articles_tracking_status ON articles_tracking(status);
CREATE INDEX idx_articles_tracking_created_at ON articles_tracking(created_at);
CREATE INDEX idx_articles_tracking_published_at ON articles_tracking(published_at);

-- =====================================================
-- TABLA: GEM1_RESULTS (Resultados de Planificación)
-- =====================================================
CREATE TABLE gem1_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_id UUID NOT NULL REFERENCES articles_tracking(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    keywords TEXT[] NOT NULL,
    target_length INTEGER NOT NULL,
    seo_meta JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT valid_target_length CHECK (target_length BETWEEN 1800 AND 2500)
);

CREATE INDEX idx_gem1_results_tracking_id ON gem1_results(tracking_id);
CREATE INDEX idx_gem1_results_title ON gem1_results(title);

-- =====================================================
-- TABLA: ARTICLE_SECTIONS (Secciones del Artículo)
-- =====================================================
CREATE TABLE article_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gem1_result_id UUID NOT NULL REFERENCES gem1_results(id) ON DELETE CASCADE,
    section_id VARCHAR(50) NOT NULL, -- ej: "seccion_1", "seccion_2"
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    keywords TEXT[] NOT NULL,
    target_length INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT valid_section_target_length CHECK (target_length >= 250)
);

CREATE INDEX idx_article_sections_gem1_result_id ON article_sections(gem1_result_id);
CREATE INDEX idx_article_sections_section_id ON article_sections(section_id);

-- =====================================================
-- TABLA: GEM2_RESULTS (Resultados de Investigación)
-- =====================================================
CREATE TABLE gem2_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_id UUID NOT NULL REFERENCES articles_tracking(id) ON DELETE CASCADE,
    section_id VARCHAR(50) NOT NULL,
    research TEXT NOT NULL,
    sources JSONB DEFAULT '[]',
    insights TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT valid_section_id CHECK (section_id ~ '^seccion_[1-9]$')
);

CREATE INDEX idx_gem2_results_tracking_id ON gem2_results(tracking_id);
CREATE INDEX idx_gem2_results_section_id ON gem2_results(section_id);

-- =====================================================
-- TABLA: GEM3_RESULTS (Resultados de Redacción)
-- =====================================================
CREATE TABLE gem3_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_id UUID NOT NULL REFERENCES articles_tracking(id) ON DELETE CASCADE,
    full_article TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    seo_optimized BOOLEAN DEFAULT true,
    readability_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT valid_word_count CHECK (word_count >= 1800),
    CONSTRAINT valid_readability_score CHECK (readability_score BETWEEN 0 AND 100)
);

CREATE INDEX idx_gem3_results_tracking_id ON gem3_results(tracking_id);
CREATE INDEX idx_gem3_results_word_count ON gem3_results(word_count);

-- =====================================================
-- TABLA: GEM4_RESULTS (Resultados de Frontmatter)
-- =====================================================
CREATE TABLE gem4_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_id UUID NOT NULL REFERENCES articles_tracking(id) ON DELETE CASCADE,
    frontmatter JSONB NOT NULL,
    mdx_content TEXT NOT NULL,
    validation_passed BOOLEAN DEFAULT false,
    validation_errors TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gem4_results_tracking_id ON gem4_results(tracking_id);
CREATE INDEX idx_gem4_results_validation_passed ON gem4_results(validation_passed);

-- =====================================================
-- TABLA: PUBLISHED_ARTICLES (Artículos Publicados)
-- =====================================================
CREATE TABLE published_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_id UUID NOT NULL REFERENCES articles_tracking(id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(200) NOT NULL,
    url VARCHAR(500) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    tags TEXT[] NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    word_count INTEGER NOT NULL,
    seo_score INTEGER,
    health_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT valid_seo_score CHECK (seo_score BETWEEN 0 AND 100),
    CONSTRAINT valid_health_score CHECK (health_score BETWEEN 0 AND 100),
    CONSTRAINT valid_tags_count CHECK (array_length(tags, 1) <= 7)
);

CREATE INDEX idx_published_articles_tracking_id ON published_articles(tracking_id);
CREATE INDEX idx_published_articles_slug ON published_articles(slug);
CREATE INDEX idx_published_articles_category ON published_articles(category);
CREATE INDEX idx_published_articles_author ON published_articles(author_name);
CREATE INDEX idx_published_articles_created_at ON published_articles(created_at);

-- =====================================================
-- TABLA: AUTOMATION_CONFIG (Configuración del Sistema)
-- =====================================================
CREATE TABLE automation_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_automation_config_key ON automation_config(config_key);

-- =====================================================
-- TABLA: TOPICS_QUEUE (Cola de Temas)
-- =====================================================
CREATE TABLE topics_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic VARCHAR(500) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    category VARCHAR(100),
    target_keywords TEXT[],
    schedule VARCHAR(20) DEFAULT 'manual',
    target_length INTEGER DEFAULT 2000,
    seo_focus VARCHAR(200),
    status VARCHAR(20) DEFAULT 'pending',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT valid_priority CHECK (priority IN ('high', 'medium', 'low')),
    CONSTRAINT valid_schedule CHECK (schedule IN ('daily', 'weekly', 'monthly', 'manual')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

CREATE INDEX idx_topics_queue_priority ON topics_queue(priority);
CREATE INDEX idx_topics_queue_status ON topics_queue(status);
CREATE INDEX idx_topics_queue_scheduled_for ON topics_queue(scheduled_for);

-- =====================================================
-- TABLA: DAILY_STATS (Estadísticas Diarias)
-- =====================================================
CREATE TABLE daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    articles_created INTEGER DEFAULT 0,
    articles_published INTEGER DEFAULT 0,
    articles_failed INTEGER DEFAULT 0,
    avg_creation_time DECIMAL(8,2), -- en segundos
    avg_word_count INTEGER,
    avg_seo_score DECIMAL(5,2),
    categories_distribution JSONB DEFAULT '{}',
    tags_distribution JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_daily_stats_date ON daily_stats(date);

-- =====================================================
-- TABLA: SYSTEM_LOGS (Logs del Sistema)
-- =====================================================
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    tracking_id UUID REFERENCES articles_tracking(id),
    gem_stage VARCHAR(20),
    error_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT valid_level CHECK (level IN ('debug', 'info', 'warn', 'error')),
    CONSTRAINT valid_gem_stage CHECK (gem_stage IN ('gem1', 'gem2', 'gem3', 'gem4', 'publish', 'system'))
);

CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_tracking_id ON system_logs(tracking_id);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);

-- =====================================================
-- TABLA: ARTICLE_BACKUPS (Backups de Artículos)
-- =====================================================
CREATE TABLE article_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES published_articles(id) ON DELETE CASCADE,
    backup_type VARCHAR(20) NOT NULL, -- 'manual', 'auto', 'before_edit'
    file_content TEXT NOT NULL,
    metadata JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT valid_backup_type CHECK (backup_type IN ('manual', 'auto', 'before_edit'))
);

CREATE INDEX idx_article_backups_article_id ON article_backups(article_id);
CREATE INDEX idx_article_backups_created_at ON article_backups(created_at);

-- =====================================================
-- TRIGGERS Y FUNCIONES
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas que tienen updated_at
CREATE TRIGGER update_articles_tracking_updated_at 
    BEFORE UPDATE ON articles_tracking 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_published_articles_updated_at 
    BEFORE UPDATE ON published_articles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_config_updated_at 
    BEFORE UPDATE ON automation_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topics_queue_updated_at 
    BEFORE UPDATE ON topics_queue 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at 
    BEFORE UPDATE ON daily_stats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar configuración inicial
INSERT INTO automation_config (config_key, config_value, description) VALUES
('system_config', '{
  "maxArticlesPerDay": 2,
  "baseUrl": "https://iapunto.com",
  "blogContentPath": "src/content/blog",
  "alertThreshold": 80,
  "backupRetentionDays": 30
}', 'Configuración principal del sistema'),
('gem_models', '{
  "gem1": {"name": "gemini-1.5-pro", "temperature": 0.7, "maxTokens": 4000},
  "gem2": {"name": "gemini-1.5-pro", "temperature": 0.6, "maxTokens": 6000},
  "gem3": {"name": "gemini-1.5-pro", "temperature": 0.8, "maxTokens": 8000},
  "gem4": {"name": "gemini-1.5-pro", "temperature": 0.5, "maxTokens": 4000}
}', 'Configuración de modelos GEM'),
('categories', '[
  "Inteligencia Artificial",
  "Marketing Digital y SEO", 
  "Negocios y Tecnología",
  "Desarrollo Web",
  "Automatización y Productividad",
  "Opinión y Tendencias",
  "Casos de Éxito",
  "Ciencia y Salud",
  "EVAFS",
  "Skailan"
]', 'Categorías oficiales'),
('tags', '[
  "Inteligencia Artificial", "Machine Learning", "Deep Learning", "Modelos de Lenguaje",
  "Chatbots", "Automatización", "No-Code", "Low-Code", "SEO", "SEO Local", "SEO Programático",
  "Marketing Digital", "Marketing de Contenidos", "Publicidad Digital", "Google", "Facebook",
  "OpenAI", "PYMES", "Empresas", "Transformación Digital", "Innovación", "Tendencias",
  "Opinión", "Seguridad", "Privacidad", "Analítica", "Datos", "Productividad", "Herramientas",
  "Software", "APIs", "Integraciones", "Biotecnología", "Salud", "Ecommerce", "Personalización",
  "EVAFS", "Skailan", "Futuro", "Ética IA", "Regulación IA", "Hardware IA", "Data Management",
  "SaaS", "Startups", "Emprendimiento"
]', 'Tags oficiales');

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para estadísticas de artículos
CREATE VIEW article_statistics AS
SELECT 
    COUNT(*) as total_articles,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_articles,
    COUNT(CASE WHEN status = 'error' THEN 1 END) as failed_articles,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_creation_time_seconds,
    DATE_TRUNC('day', created_at) as creation_date
FROM articles_tracking
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY creation_date DESC;

-- Vista para artículos recientes
CREATE VIEW recent_articles AS
SELECT 
    at.id,
    at.topic,
    at.status,
    at.created_at,
    pa.title,
    pa.category,
    pa.author_name,
    pa.word_count,
    pa.seo_score
FROM articles_tracking at
LEFT JOIN published_articles pa ON at.id = pa.tracking_id
ORDER BY at.created_at DESC
LIMIT 50;

-- Vista para temas pendientes
CREATE VIEW pending_topics AS
SELECT 
    id,
    topic,
    priority,
    category,
    schedule,
    scheduled_for,
    created_at
FROM topics_queue
WHERE status = 'pending'
ORDER BY 
    CASE priority 
        WHEN 'high' THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'low' THEN 3 
    END,
    created_at ASC;

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE articles_tracking IS 'Tabla principal para tracking del proceso de creación de artículos';
COMMENT ON TABLE gem1_results IS 'Resultados de GEM 1 - Planificación del artículo';
COMMENT ON TABLE article_sections IS 'Secciones definidas por GEM 1 para el artículo';
COMMENT ON TABLE gem2_results IS 'Resultados de GEM 2 - Investigación por secciones';
COMMENT ON TABLE gem3_results IS 'Resultados de GEM 3 - Artículo completo redactado';
COMMENT ON TABLE gem4_results IS 'Resultados de GEM 4 - Frontmatter y MDX generado';
COMMENT ON TABLE published_articles IS 'Artículos publicados exitosamente';
COMMENT ON TABLE automation_config IS 'Configuración del sistema de automatización';
COMMENT ON TABLE topics_queue IS 'Cola de temas pendientes de procesamiento';
COMMENT ON TABLE daily_stats IS 'Estadísticas diarias del sistema';
COMMENT ON TABLE system_logs IS 'Logs del sistema para debugging y monitoreo';
COMMENT ON TABLE article_backups IS 'Backups de artículos antes de modificaciones';

-- =====================================================
-- FIN DEL ESQUEMA
-- =====================================================
