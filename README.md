# SafetyOps Center 🛡️

**Sistema de Prevención y Seguridad para Operaciones Mineras**

[![Deploy](https://img.shields.io/badge/Deploy-safetyops.sebrvv.com-yellow?style=for-the-badge)](https://safetyops.sebrvv.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

## 🌐 Demo en Vivo

**[https://safetyops.sebrvv.com](https://safetyops.sebrvv.com)**

---

## 📋 Descripción

SafetyOps Center es una plataforma integral para el monitoreo, control y prevención de incidentes en operaciones mineras subterráneas y a cielo abierto. El sistema permite gestionar en tiempo real la seguridad de trabajadores, vehículos y equipos en faenas mineras.

## ✨ Características Principales

### 🏔️ Gestión de Minas
- Registro y administración de múltiples minas
- Configuración de lugares y zonas dentro de cada mina
- Dashboard personalizado por mina seleccionada

### 🚛 Control de Flota
- Monitoreo GPS en tiempo real de vehículos
- Gestión de camiones, scooptrams, jumbos y maquinaria pesada
- Historial de ubicaciones y rutas

### 🚦 Sistema de Semáforos IoT
- Control de tráfico en cruces y accesos críticos
- Simulación interactiva de semáforos
- Estados: verde, amarillo, rojo con tiempos configurables

### ⚠️ Gestión de Alarmas
- Alertas automáticas por exceso de velocidad
- Detección de proximidad entre vehículos
- Notificaciones de zonas de riesgo
- Clasificación por severidad: crítica, alta, media, baja

### 📊 Métricas y KPIs
- Dashboard con indicadores de seguridad
- Gráficos de incidentes por período
- Estadísticas de productividad operacional

### 👷 Gestión de Personal
- Control de acceso de trabajadores
- Ubicación en tiempo real
- Registro de documentos de identidad

### 🎮 Simulación
- Simulador interactivo de zonas mineras
- Visualización de semáforos y vehículos
- 4 zonas simuladas: interna, externa, humedad/neblina, extracción

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **Next.js 16** | Framework React con App Router |
| **TypeScript** | Tipado estático |
| **Tailwind CSS** | Estilos y diseño |
| **shadcn/ui** | Componentes UI |
| **Framer Motion** | Animaciones |
| **Supabase** | Base de datos PostgreSQL + Auth |
| **React Query** | Gestión de estado servidor |
| **Lucide Icons** | Iconografía |
| **Recharts** | Gráficos y visualizaciones |

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- npm o pnpm
- Cuenta en Supabase

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/SebSRVV/saftyopscenter.git
cd saftyopscenter
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Layout del dashboard
│   ├── alarmas/           # Gestión de alarmas
│   ├── dashboard/         # Panel principal
│   ├── dispositivos/      # Dispositivos IoT
│   ├── flota/             # Control de flota
│   ├── incidentes/        # Registro de incidentes
│   ├── metrics/           # Métricas y KPIs
│   ├── minas/             # Gestión de minas
│   ├── semaforos/         # Sistema de semáforos
│   ├── simulacion/        # Simulador interactivo
│   └── trabajadores/      # Gestión de personal
├── components/            # Componentes React
│   ├── cards/             # Tarjetas de estadísticas
│   ├── charts/            # Gráficos
│   ├── layout/            # Sidebar, Topbar
│   ├── maps/              # Mapas
│   └── ui/                # Componentes shadcn/ui
├── hooks/                 # Custom hooks
├── lib/                   # Utilidades y configuración
│   ├── rpc/               # Funciones RPC de Supabase
│   └── supabase/          # Cliente de Supabase
└── public/                # Archivos estáticos
```

## 🔐 Autenticación

El sistema incluye:
- Registro de usuarios
- Inicio de sesión
- Recuperación de contraseña
- Protección de rutas con middleware

## 📱 Responsive

La aplicación está optimizada para:
- 💻 Desktop
- 📱 Tablet
- 📲 Mobile

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 👨‍💻 Autor

**SebSRVV**

- GitHub: [@SebSRVV](https://github.com/SebSRVV)
- Proyecto: [saftyopscenter](https://github.com/SebSRVV/saftyopscenter)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

<p align="center">
  <strong>SafetyOps Center</strong> - Sistema de Prevención y Seguridad Minera<br>
  © 2025 - Desarrollado con ❤️ para la industria minera
</p>
