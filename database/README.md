# Safety Operations Center - Base de Datos

## Overview

Sistema completo de monitoreo y seguridad para mineras peruanas, desarrollado en PostgreSQL con Supabase. Incluye gestión de flota, dispositivos IoT, eventos de seguridad, mantenimiento y métricas operativas.

## 🏗️ Arquitectura de la Base de Datos

### Tablas Principales

#### 1. `usuarios_aplicacion`
Gestión de usuarios del sistema con roles y permisos.

- **Campos clave**: `id_usuario`, `email`, `nombre`, `rol`, `activo`
- **Roles**: `administrador`, `supervisor`, `operador`, `visitante`
- **Relaciones**: Creador de registros en otras tablas

#### 2. `minas`
Información completa de las minas monitoreadas.

- **Campos clave**: `id_mina`, `nombre`, `codigo`, `ubicacion`, `empresa`, `tipo_mina`
- **Tipos**: `subterranea`, `superficial`, `mixta`
- **Datos geográficos**: Latitud, longitud, altitud
- **Datos operativos**: Producción anual, número de trabajadores

#### 3. `lugar_de_los_dispositivos`
Ubicaciones específicas dentro de cada mina.

- **Campos clave**: `id_lugar`, `id_mina`, `nombre`, `tipo`, `coordenadas`
- **Tipos**: `cruce`, `rampa`, `galeria`, `taller`, `superficie`, `otro`
- **Datos técnicos**: Profundidad, capacidad de vehículos

#### 4. `flota_minera`
Vehículos y maquinaria minera.

- **Campos clave**: `id_flota`, `nombre`, `clase`, `familia`, `especificaciones`
- **Clases**: `vehiculo_liviano`, `vehiculo_pesado`, `maquinaria`
- **Familias**: `camioneta`, `camion`, `bus`, `scooptram`, `dumper`, `jumbo`
- **Mantenimiento**: Horas de operación, fechas de mantenimiento

#### 5. `trabajadores`
Personal trabajando en las minas.

- **Campos clave**: `id_trabajador`, `nombre_completo`, `doc_identidad`, `cargo`
- **Datos laborales**: Empresa contratista, certificaciones, estado
- **Información personal**: Contacto, fechas importantes

#### 6. `dispositivos_iot`
Dispositivos de monitoreo y seguridad.

- **Campos clave**: `id_dispositivo`, `codigo`, `tipo`, `marca_modelo`
- **Tipos**: `gps`, `semaforo`, `proximidad`, `sensor_gas`, `velocimetro`, `camara`
- **Estado**: Batería, firmware, última transmisión

#### 7. `eventos_alarmas`
Registro de eventos y alarmas del sistema.

- **Campos clave**: `id_evento`, `tipo_evento`, `categoria`, `severidad`
- **Tipos**: `alarma`, `advertencia`, `informativo`, `emergencia`
- **Gestión**: Estado, resolución, observaciones

#### 8. `mantenimiento_flota`
Control de mantenimiento de equipos.

- **Campos clave**: `id_mantenimiento`, `tipo`, `descripcion`, `fechas`
- **Tipos**: `preventivo`, `correctivo`, `emergencia`
- **Gestión**: Costos, repuestos, responsables

#### 9. `reportes_incidentes`
Reportes de incidentes de seguridad.

- **Campos clave**: `id_reporte`, `tipo_incidente`, `severidad`, `descripcion`
- **Investigación**: Testigos, daños, medidas correctivas

#### 10. `metricas_operacion`
Métricas y KPIs operativos.

- **Campos clave**: `id_metrica`, `tipo_metrica`, `valor`, `unidad_medida`
- **Contexto**: Datos adicionales, timestamps

## 📊 Minas Configuradas

### 1. **Mina Poderosa** (La Libertad)
- **Empresa**: Compañía Minera Poderosa S.A.
- **Tipo**: Subterránea
- **Mineral**: Oro
- **Producción**: 250,000 ton/año
- **Trabajadores**: 800
- **Altitud**: 3,200 msnm

### 2. **Mina Uchucchacua** (Lima - Buenaventura)
- **Empresa**: Compañía de Minas Buenaventura
- **Tipo**: Subterránea
- **Mineral**: Plata
- **Producción**: 150,000 ton/año
- **Trabajadores**: 600
- **Altitud**: 4,700 msnm

### 3. **Mina Cerro Verde** (Arequipa)
- **Empresa**: Freeport-McMoRan Cerro Verde Perú
- **Tipo**: Superficial
- **Mineral**: Cobre
- **Producción**: 1,000,000 ton/año
- **Trabajadores**: 2,000
- **Altitud**: 2,700 msnm

### 4. **Mina Las Bambas** (Apurímac)
- **Empresa**: MMG Ltd
- **Tipo**: Superficial
- **Mineral**: Cobre
- **Producción**: 400,000 ton/año
- **Trabajadores**: 4,000
- **Altitud**: 4,000 msnm

### 5. **Mina Antamina** (Ancash)
- **Empresa**: Compañía Minera Antamina S.A.
- **Tipo**: Subterránea
- **Mineral**: Cobre
- **Producción**: 1,200,000 ton/año
- **Trabajadores**: 3,000
- **Altitud**: 4,200 msnm

## 🔧 Funciones RPC Disponibles

### Gestión de Minas
- `rpc_listar_minas()` - Lista todas las minas activas
- `rpc_obtener_mina(p_id)` - Obtiene detalles de una mina específica
- `rpc_crear_mina(params)` - Crea una nueva mina

### Gestión de Lugares
- `rpc_lugares_por_mina(p_id_mina)` - Lista lugares de una mina
- `rpc_crear_lugar(params)` - Crea nuevo lugar

### Gestión de Flota
- `rpc_listar_flota(p_id_mina)` - Lista flota asignada a mina
- `rpc_crear_flota(params)` - Crea nuevo equipo y lo asigna

### Gestión de Trabajadores
- `rpc_listar_trabajadores()` - Lista todos los trabajadores activos
- `rpc_crear_trabajador(params)` - Crea nuevo trabajador

### Gestión de Dispositivos IoT
- `rpc_listar_dispositivos()` - Lista todos los dispositivos
- `rpc_crear_dispositivo(params)` - Crea nuevo dispositivo

### Gestión de Eventos
- `rpc_listar_eventos_recientes(limit, id_mina)` - Lista eventos recientes
- `rpc_crear_evento(params)` - Crea nuevo evento o alarma

### Gestión de Métricas
- `rpc_metricas_por_mina(id_mina, fecha_inicio, fecha_fin)` - Obtiene métricas
- `rpc_crear_metrica(params)` - Registra nueva métrica

### Dashboard y Reportes
- `rpc_dashboard_general()` - Estadísticas generales del sistema
- `rpc_estadisticas_mina(p_id_mina)` - Estadísticas detalladas por mina

## 🛡️ Seguridad y Políticas

### Row Level Security (RLS)
- **Usuarios**: Solo pueden ver su propio perfil (excepto administradores)
- **Minas**: Todos pueden ver minas activas, solo supervisores/administradores pueden modificar
- **Flota**: Todos pueden ver equipos operativos, solo supervisores/administradores pueden modificar
- **Eventos**: Todos pueden ver eventos activos, solo supervisores/administradores pueden modificar

### Triggers Automáticos
1. **Timestamps**: Actualización automática de fechas de creación
2. **Eventos de Flota**: Registro automático de cambios importantes
3. **Mantenimiento**: Programación automática basada en horas de operación
4. **Dispositivos Offline**: Alertas automáticas por desconexión
5. **Validaciones**: Control de asignaciones únicas de dispositivos

## 📈 Vistas Útiles

### `vw_estado_minas`
Vista consolidada del estado de todas las minas con:
- Flota operativa y en mantenimiento
- Dispositivos online
- Trabajadores activos
- Eventos del día

### `vw_dispositivos_asignados`
Dispositivos con sus asignaciones actuales a flota, lugares o trabajadores.

### `vw_eventos_criticos`
Eventos críticos y alarmas activas ordenadas por severidad.

## 🚀 Instalación y Configuración

### 1. Ejecutar Scripts en Orden
```sql
-- 1. Crear esquema y tablas
\i 01-schema.sql

-- 2. Insertar datos de prueba
\i 02-seed-data.sql

-- 3. Crear funciones RPC
\i 03-functions-rpc.sql

-- 4. Configurar triggers y seguridad
\i 04-triggers-security.sql
```

### 2. Configurar Supabase
1. Crear proyecto en Supabase
2. Ejecutar scripts en el SQL Editor
3. Configurar autenticación con los roles definidos
4. Habilitar RLS en todas las tablas
5. Configurar API Keys para el frontend

### 3. Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📊 Métricas y KPIs

### Tipos de Métricas Registradas
- **Producción**: Toneladas extraídas por turno/día
- **Disponibilidad**: Porcentaje de equipos operativos
- **Seguridad**: Incidentes por tipo y severidad
- **Mantenimiento**: Tiempo medio entre reparaciones
- **Eficiencia**: Consumo de combustible por tonelada
- **Personal**: Asistencia y capacitación

## 🔍 Monitoreo y Alertas

### Niveles de Severidad
1. **Informativo**: Cambios operativos normales
2. **Bajo**: Desviaciones menores
3. **Medio**: Problemas que requieren atención
4. **Alto**: Situaciones críticas
5. **Crítico**: Emergencias inmediatas

### Tipos de Eventos
- **Flota**: Cambios de estado, mantenimiento requerido
- **Dispositivos**: Desconexión, batería baja
- **Seguridad**: Incidentes, condiciones peligrosas
- **Operación**: Paradas, producción anómala

## 📱 Integración con Frontend

### Ejemplo de Uso con Supabase Client
```typescript
import { supabase } from '@/lib/supabase/client'

// Listar minas
const { data: minas } = await supabase.rpc('rpc_listar_minas')

// Crear evento
const { data: evento } = await supabase.rpc('rpc_crear_evento', {
  p_tipo_evento: 'alarma',
  p_categoria: 'seguridad',
  p_descripcion: 'Condición peligrosa detectada',
  p_severidad: 4
})

// Dashboard general
const { data: dashboard } = await supabase.rpc('rpc_dashboard_general')
```

## 🔄 Mantenimiento de la Base de Datos

### Tareas Periódicas
1. **Limpieza de eventos**: Archivar eventos resueltos > 90 días
2. **Optimización**: Rebuild de índices mensual
3. **Backups**: Diarios con retención de 30 días
4. **Monitoreo**: Revisión de performance y crecimiento

### Escalabilidad
- **Particionamiento**: Por fecha para tablas de eventos y métricas
- **Replicas**: Para consultas de reportes pesados
- **Cache**: Redis para datos frecuentes (dashboard)

## 📞 Soporte y Contacto

Para soporte técnico o preguntas sobre la base de datos:
- **Documentación**: Revisar comentarios en cada función/trigger
- **Logs**: Revisar eventos de auditoría en tabla `eventos_alarmas`
- **Monitoreo**: Usar vistas `vw_*` para diagnóstico rápido

---

**Safety Operations Center** - Sistema Integral de Seguridad Minera  
*Desarrollado para la industria minera peruana con estándares internacionales de seguridad.*
