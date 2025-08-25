-- Actualizar la restricción valid_status para incluir los nuevos estados de GEM 5
ALTER TABLE articles_tracking DROP CONSTRAINT IF EXISTS valid_status;

ALTER TABLE articles_tracking ADD CONSTRAINT valid_status 
CHECK (status IN (
  'pending',
  'gem1_completed',
  'gem2_in_progress',
  'gem2_completed',
  'gem3_in_progress',
  'gem3_completed',
  'gem4_in_progress',
  'gem4_completed',
  'gem5_in_progress',
  'gem5_completed',
  'published',
  'error'
));

-- Verificar que la restricción se aplicó correctamente
SELECT conname, pg_get_constraintdef(oid) as definition 
FROM pg_constraint 
WHERE conname = 'valid_status' 
AND conrelid = 'articles_tracking'::regclass;
