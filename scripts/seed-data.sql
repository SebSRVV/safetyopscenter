-- =====================================================================
-- SEED DATA - Mina Poderosa, La Libertad, Peru
-- Ejecutar este script en Supabase SQL Editor
-- Reemplaza 'TU_UUID_AQUI' con tu UUID de usuario de Supabase Auth
-- =====================================================================

-- Variable para el usuario (reemplazar con tu UUID)
-- Puedes obtenerlo de la tabla auth.users o del dashboard de Supabase
DO $$
DECLARE
    v_user_id bigint;
    v_mina_id bigint;
    v_lugar_rampa bigint;
    v_lugar_nivel2000 bigint;
    v_lugar_nivel1800 bigint;
    v_lugar_superficie bigint;
    v_flota_sc003 bigint;
    v_flota_sc005 bigint;
    v_flota_sc007 bigint;
BEGIN

-- =====================================================================
-- 1. CREAR USUARIO DE APLICACION (si no existe)
-- =====================================================================
INSERT INTO usuarios_aplicacion (email, nombre, rol)
VALUES ('admin@poderosa.com.pe', 'Administrador Sistema', 'administrador')
ON CONFLICT (email) DO UPDATE SET nombre = EXCLUDED.nombre
RETURNING id_usuario INTO v_user_id;

-- =====================================================================
-- 2. CREAR MINA PODEROSA
-- =====================================================================
INSERT INTO minas (nombre, codigo, ubicacion, empresa, creado_por)
VALUES (
    'Mina Poderosa',
    'MP-001',
    'Pataz, La Libertad, Peru',
    'Compania Minera Poderosa S.A.',
    v_user_id
)
ON CONFLICT DO NOTHING
RETURNING id_mina INTO v_mina_id;

-- Si ya existe, obtener el ID
IF v_mina_id IS NULL THEN
    SELECT id_mina INTO v_mina_id FROM minas WHERE codigo = 'MP-001' LIMIT 1;
END IF;

-- =====================================================================
-- 3. CREAR LUGARES DE LA MINA
-- =====================================================================

-- Rampa Principal
INSERT INTO lugar_de_los_dispositivos (id_mina, nombre, tipo, descripcion, latitud, longitud, creado_por)
VALUES (v_mina_id, 'Rampa Principal', 'rampa', 'Acceso principal a niveles inferiores', -8.0833, -77.5833, v_user_id)
ON CONFLICT DO NOTHING
RETURNING id_lugar INTO v_lugar_rampa;

-- Nivel 2000
INSERT INTO lugar_de_los_dispositivos (id_mina, nombre, tipo, descripcion, latitud, longitud, creado_por)
VALUES (v_mina_id, 'Nivel 2000 - Santa Maria', 'galeria', 'Zona de extraccion principal', -8.0843, -77.5823, v_user_id)
ON CONFLICT DO NOTHING
RETURNING id_lugar INTO v_lugar_nivel2000;

-- Nivel 1800
INSERT INTO lugar_de_los_dispositivos (id_mina, nombre, tipo, descripcion, latitud, longitud, creado_por)
VALUES (v_mina_id, 'Nivel 1800 - Pataz', 'galeria', 'Zona de desarrollo', -8.0853, -77.5813, v_user_id)
ON CONFLICT DO NOTHING
RETURNING id_lugar INTO v_lugar_nivel1800;

-- Superficie
INSERT INTO lugar_de_los_dispositivos (id_mina, nombre, tipo, descripcion, latitud, longitud, creado_por)
VALUES (v_mina_id, 'Superficie - Planta Maranon', 'superficie', 'Area de procesamiento', -8.0823, -77.5843, v_user_id)
ON CONFLICT DO NOTHING
RETURNING id_lugar INTO v_lugar_superficie;

-- Cruce Principal
INSERT INTO lugar_de_los_dispositivos (id_mina, nombre, tipo, descripcion, latitud, longitud, creado_por)
VALUES (v_mina_id, 'Cruce Nivel 2000', 'cruce', 'Interseccion de galerias principales', -8.0838, -77.5828, v_user_id)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 4. CREAR FLOTA MINERA
-- =====================================================================

-- Scooptram SC-003
INSERT INTO flota_minera (nombre, clase, familia, tipo_especifico, placa_o_credencial, marca, modelo, anio_fabricacion, capacidad_toneladas, creado_por)
VALUES ('SC-003', 'maquinaria', 'scooptram', 'LHD 4.0 yd3', 'SC-003', 'Caterpillar', 'R1300G', 2021, 4.0, v_user_id)
ON CONFLICT DO NOTHING
RETURNING id_flota INTO v_flota_sc003;

-- Scooptram SC-005
INSERT INTO flota_minera (nombre, clase, familia, tipo_especifico, placa_o_credencial, marca, modelo, anio_fabricacion, capacidad_toneladas, creado_por)
VALUES ('SC-005', 'maquinaria', 'scooptram', 'LHD 6.0 yd3', 'SC-005', 'Sandvik', 'LH517i', 2022, 6.0, v_user_id)
ON CONFLICT DO NOTHING
RETURNING id_flota INTO v_flota_sc005;

-- Scooptram SC-007
INSERT INTO flota_minera (nombre, clase, familia, tipo_especifico, placa_o_credencial, marca, modelo, anio_fabricacion, capacidad_toneladas, creado_por)
VALUES ('SC-007', 'maquinaria', 'scooptram', 'LHD 4.0 yd3', 'SC-007', 'Epiroc', 'ST14', 2020, 4.0, v_user_id)
ON CONFLICT DO NOTHING
RETURNING id_flota INTO v_flota_sc007;

-- Camion DT-001
INSERT INTO flota_minera (nombre, clase, familia, tipo_especifico, placa_o_credencial, marca, modelo, anio_fabricacion, capacidad_toneladas, creado_por)
VALUES ('DT-001', 'vehiculo_pesado', 'dumper', 'Dumper 20T', 'DT-001', 'Caterpillar', 'AD22', 2021, 20.0, v_user_id)
ON CONFLICT DO NOTHING;

-- Jumbo JB-002
INSERT INTO flota_minera (nombre, clase, familia, tipo_especifico, placa_o_credencial, marca, modelo, anio_fabricacion, creado_por)
VALUES ('JB-002', 'maquinaria', 'jumbo', 'Jumbo 2 brazos', 'JB-002', 'Sandvik', 'DD422i', 2022, v_user_id)
ON CONFLICT DO NOTHING;

-- Camioneta Supervision
INSERT INTO flota_minera (nombre, clase, familia, tipo_especifico, placa_o_credencial, marca, modelo, anio_fabricacion, creado_por)
VALUES ('CAM-SUP-01', 'vehiculo_liviano', 'camioneta', 'Pickup 4x4', 'ABC-123', 'Toyota', 'Hilux', 2023, v_user_id)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 5. ASIGNAR FLOTA A MINA
-- =====================================================================

-- Obtener IDs si no se obtuvieron antes
IF v_flota_sc003 IS NULL THEN
    SELECT id_flota INTO v_flota_sc003 FROM flota_minera WHERE nombre = 'SC-003' LIMIT 1;
END IF;
IF v_flota_sc005 IS NULL THEN
    SELECT id_flota INTO v_flota_sc005 FROM flota_minera WHERE nombre = 'SC-005' LIMIT 1;
END IF;
IF v_flota_sc007 IS NULL THEN
    SELECT id_flota INTO v_flota_sc007 FROM flota_minera WHERE nombre = 'SC-007' LIMIT 1;
END IF;

-- Asignar flota a mina
INSERT INTO asignaciones_flota_mina (id_flota, id_mina, fecha_inicio, activo)
SELECT id_flota, v_mina_id, now(), true
FROM flota_minera
WHERE id_flota IN (v_flota_sc003, v_flota_sc005, v_flota_sc007)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 6. CREAR TRABAJADORES
-- =====================================================================

INSERT INTO trabajadores (nombre_completo, doc_identidad, cargo, empresa_contratista, creado_por)
VALUES 
    ('Carlos Mendoza Quispe', '45678901', 'Operador Scooptram', 'Poderosa S.A.', v_user_id),
    ('Miguel Torres Huaman', '45678902', 'Operador Scooptram', 'Poderosa S.A.', v_user_id),
    ('Jose Garcia Rojas', '45678903', 'Supervisor de Turno', 'Poderosa S.A.', v_user_id),
    ('Luis Fernandez Cruz', '45678904', 'Operador Jumbo', 'Poderosa S.A.', v_user_id),
    ('Pedro Sanchez Diaz', '45678905', 'Mecanico', 'Contratista ABC', v_user_id),
    ('Roberto Vargas Luna', '45678906', 'Electricista', 'Contratista XYZ', v_user_id)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 7. CREAR DISPOSITIVOS IoT
-- =====================================================================

INSERT INTO dispositivos_iot (codigo, tipo, marca_modelo, creado_por)
VALUES 
    ('GPS-001', 'gps', 'Trimble R12i', v_user_id),
    ('GPS-002', 'gps', 'Trimble R12i', v_user_id),
    ('GPS-003', 'gps', 'Trimble R12i', v_user_id),
    ('SEM-001', 'semaforo', 'SafetyOps SEM-100', v_user_id),
    ('SEM-002', 'semaforo', 'SafetyOps SEM-100', v_user_id),
    ('PRX-001', 'proximidad', 'Becker Mining PDS', v_user_id),
    ('PRX-002', 'proximidad', 'Becker Mining PDS', v_user_id),
    ('GAS-001', 'sensor_gas', 'Draeger X-am 8000', v_user_id),
    ('VEL-001', 'velocimetro', 'SafetyOps VEL-50', v_user_id),
    ('VEL-002', 'velocimetro', 'SafetyOps VEL-50', v_user_id)
ON CONFLICT DO NOTHING;

RAISE NOTICE 'Datos de prueba insertados correctamente para Mina Poderosa';
RAISE NOTICE 'Mina ID: %', v_mina_id;

END $$;

-- =====================================================================
-- VERIFICAR DATOS INSERTADOS
-- =====================================================================

SELECT 'Minas' as tabla, count(*) as registros FROM minas
UNION ALL
SELECT 'Lugares', count(*) FROM lugar_de_los_dispositivos
UNION ALL
SELECT 'Flota', count(*) FROM flota_minera
UNION ALL
SELECT 'Trabajadores', count(*) FROM trabajadores
UNION ALL
SELECT 'Dispositivos', count(*) FROM dispositivos_iot;
