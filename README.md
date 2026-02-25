<div align="center">

<img src="https://img.shields.io/badge/NexusERP-2026-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI2IiBmaWxsPSIjNjM2NmYxIi8+PHRleHQgeD0iNy41IiB5PSIxNy41IiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iODAwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPk48L3RleHQ+PC9zdmc+" alt="NexusERP">

# NexusERP 2026 — Enterprise OS

**Sistema ERP de nueva generación** · 12 módulos · IA integrada · Tiempo real

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-nicco6482.github.io/SIMERP-6366f1?style=flat-square)](https://nicco6482.github.io/SIMERP/)
[![GitHub Pages](https://img.shields.io/github/deployments/nicco6482/SIMERP/github-pages?style=flat-square&label=GitHub%20Pages)](https://nicco6482.github.io/SIMERP/)
[![License](https://img.shields.io/badge/license-MIT-34d399?style=flat-square)](LICENSE)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)](https://www.chartjs.org)

</div>

---

## ✨ Demo en vivo

> **🔗 https://nicco6482.github.io/SIMERP/**
>
> Abre el enlace en cualquier navegador — sin instalación, sin backend, sin dependencias.

---

## 📦 Módulos

<table>
<tr>
<td width="50%">

### Core
| Módulo | Descripción |
|---|---|
| 🏠 **Dashboard** | KPIs en tiempo real, gráficos interactivos, alertas |
| 📦 **Inventario** | Stock con alertas críticas, movimientos, QR |
| 👥 **CRM** | Pipeline Kanban, historial de clientes, propuestas |
| 🧾 **Contabilidad** | Facturas, P&L, desglose fiscal IVA |
| 💼 **RRHH** | Directorio, evaluaciones, indicadores de desempeño |
| 🛒 **Compras** | Órdenes de compra, aprobaciones, proveedores |

</td>
<td width="50%">

### Operaciones & Inteligencia
| Módulo | Descripción |
|---|---|
| 🏭 **Producción** | OFs, máquinas con telemetría, análisis OEE |
| 🚚 **Logística** | Tracking envíos, optimización de rutas IA |
| 📊 **Analytics & BI** | 5 sub-vistas: tendencia, regiones, LTV, IA Insights |
| 🗄️ **ERD & Schema** | Esquema de base de datos y documentación API |
| 🗺️ **Arq. & Roadmap** | Arquitectura de servicios y roadmap tech |
| ⚙️ **Configuración** | Empresa, módulos, integraciones, seguridad |

</td>
</tr>
</table>

---

## 🎯 Funcionalidades Globales

| Feature | Descripción |
|---|---|
| **🔍 Búsqueda Global** | `Ctrl+K` — busca en todos los módulos simultáneamente |
| **🔔 Notificaciones** | Centro de alertas en tiempo real con severidad |
| **⚡ FAB de Acciones** | Botón flotante con 5 acciones rápidas cross-módulo |
| **📂 Paneles Detalle** | Slide-in con info completa, gráficos y acciones |
| **📱 Responsive** | Adaptado para escritorio y móvil |

---

## 🛠️ Stack Tecnológico

```
Frontend:   HTML5 · CSS3 (Variables) · Vanilla JavaScript ES2022
UI Icons:   Lucide Icons (CDN)
Charts:     Chart.js 4.4
Fonts:      Inter + JetBrains Mono (Google Fonts)
Deploy:     GitHub Pages (static, no backend required)
```

> **100% cliente** — no requiere servidor, base de datos ni build process.

---

## 🚀 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/nicco6482/SIMERP.git
cd SIMERP

# Abrir directamente en el navegador
start erp/index.html          # Windows
open erp/index.html           # macOS
xdg-open erp/index.html       # Linux
```

O servir con cualquier servidor estático:

```bash
# Con Python
python -m http.server 8000

# Con Node.js (npx)
npx serve .
```

Luego accede a `http://localhost:8000/erp/`

---

## 📁 Estructura del Proyecto

```
SIMERP/
├── index.html                  ← Redirección raíz (GitHub Pages)
└── erp/
    ├── index.html              ← App principal
    ├── css/
    │   └── style.css           ← Design system completo (Linear/Vercel dark)
    └── js/
        ├── data.js             ← Mock data + búsqueda global
        ├── app.js              ← Router + panel system + toasts
        └── modules/
            ├── dashboard.js
            ├── inventory.js
            ├── crm.js
            ├── accounting.js
            ├── hr.js
            ├── purchasing.js
            ├── production.js
            ├── logistics.js
            ├── analytics.js
            ├── settings.js
            ├── schema.js
            └── flow.js
```

---

## 🎨 Design System

- **Tema**: Dark navy (`#070710`) inspirado en Linear / Vercel
- **Acento**: Índigo (`#6366f1`) con jerarquía cromática coherente
- **Tipografía**: Inter (UI) + JetBrains Mono (código)
- **Componentes**: Cards, badges, tablas, kanban, paneles slide-in, toasts, FAB

---

## 📄 Licencia

MIT © 2026 [nicco6482](https://github.com/nicco6482)
