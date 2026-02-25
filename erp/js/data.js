// ============================================================
// NexusERP 2026 — Mock Data Layer
// ============================================================

const ERP_DATA = {

  kpis: {
    revenue: { value: 2_418_350, prev: 2_190_000, label: 'Ingresos Totales', unit: '€', icon: 'trending-up' },
    orders: { value: 847, prev: 790, label: 'Pedidos Activos', unit: '', icon: 'package' },
    stock: { value: 12, prev: 8, label: 'Alertas de Stock', unit: '', icon: 'alert-triangle' },
    employees: { value: 234, prev: 228, label: 'Empleados', unit: '', icon: 'users' },
  },

  revenueChart: {
    labels: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'],
    data: [1_780_000, 1_920_000, 2_050_000, 1_990_000, 2_240_000, 2_190_000, 2_418_350],
  },

  inventoryChart: {
    labels: ['Materias Primas', 'Producto Terminado', 'En Tránsito', 'Devuelto', 'Cuarentena'],
    data: [38, 30, 15, 10, 7],
    colors: ['#00BFFF', '#00E5A0', '#FFB300', '#FF5580', '#A855F7'],
  },

  recentAlerts: [
    { id: 1, type: 'stock', msg: 'Acero Inox. SKU-2041 en nivel crítico (3 uds.)', time: 'Hace 5 min', sev: 'high' },
    { id: 2, type: 'order', msg: 'Pedido #PO-3847 pendiente de aprobación', time: 'Hace 12 min', sev: 'med' },
    { id: 3, type: 'finance', msg: 'Factura FT-9912 vencida — Cliente Aceros León', time: 'Hace 1 h', sev: 'high' },
    { id: 4, type: 'hr', msg: 'Contrato de M. García vence en 7 días', time: 'Hace 2 h', sev: 'low' },
    { id: 5, type: 'system', msg: 'Backup nocturno completado exitosamente', time: 'Hace 6 h', sev: 'ok' },
  ],

  inventory: [
    { sku: 'SKU-1001', name: 'Chapa Acero A-36 2mm', cat: 'Materia Prima', qty: 1_240, min: 200, unit: 'kg', loc: 'A-01', status: 'ok' },
    { sku: 'SKU-1042', name: 'Perfil HEB 200', cat: 'Materia Prima', qty: 86, min: 100, unit: 'ud', loc: 'A-04', status: 'low' },
    { sku: 'SKU-2010', name: 'Motor Eléctrico 5.5kW', cat: 'Componente', qty: 34, min: 10, unit: 'ud', loc: 'B-12', status: 'ok' },
    { sku: 'SKU-2041', name: 'Tornillo Inox M8x25', cat: 'Consumible', qty: 3, min: 500, unit: 'ud', loc: 'C-03', status: 'critical' },
    { sku: 'SKU-3001', name: 'Máquina Fresadora MX-3', cat: 'Prod. Terminado', qty: 12, min: 5, unit: 'ud', loc: 'D-01', status: 'ok' },
    { sku: 'SKU-3020', name: 'Torno CNC T-500', cat: 'Prod. Terminado', qty: 7, min: 3, unit: 'ud', loc: 'D-02', status: 'ok' },
    { sku: 'SKU-4001', name: 'Lubricante Industrial 5L', cat: 'Consumible', qty: 89, min: 20, unit: 'L', loc: 'E-01', status: 'ok' },
    { sku: 'SKU-4010', name: 'Disco de Corte Ø230', cat: 'Consumible', qty: 67, min: 50, unit: 'ud', loc: 'E-02', status: 'ok' },
    { sku: 'SKU-5001', name: 'Panel de Control PLC', cat: 'Componente', qty: 5, min: 8, unit: 'ud', loc: 'B-08', status: 'low' },
    { sku: 'SKU-5012', name: 'Sensor de Temperatura', cat: 'Componente', qty: 22, min: 15, unit: 'ud', loc: 'B-09', status: 'ok' },
  ],

  clients: [
    { id: 'C-001', name: 'Aceros León S.A.', stage: 'Negociación', value: 124_000, contact: 'L. Fernández', phone: '+34 912 000 001', email: 'lfernandez@acerosleon.es' },
    { id: 'C-002', name: 'Maquinaria del Sur', stage: 'Propuesta', value: 87_500, contact: 'P. Romero', phone: '+34 956 000 002', email: 'promero@maqsur.com' },
    { id: 'C-003', name: 'TechFab Industries', stage: 'Cierre', value: 340_000, contact: 'J. García', phone: '+34 934 000 003', email: 'jgarcia@techfab.es' },
    { id: 'C-004', name: 'Grupo Metalmecánico', stage: 'Contacto', value: 20_000, contact: 'R. Blanco', phone: '+34 943 000 004', email: 'rblanco@gme.es' },
    { id: 'C-005', name: 'Eurometal GmbH', stage: 'Negociación', value: 215_000, contact: 'K. Müller', phone: '+49 89 0000005', email: 'kmuller@eurometal.de' },
    { id: 'C-006', name: 'Piezas Rápidas S.L.', stage: 'Perdido', value: 0, contact: 'A. Martínez', phone: '+34 961 000 006', email: 'amartinez@piezasr.es' },
    { id: 'C-007', name: 'Prefabricados Norte', stage: 'Propuesta', value: 55_000, contact: 'M. Torres', phone: '+34 985 000 007', email: 'mtorres@prefnorte.com' },
  ],

  invoices: [
    { id: 'FT-9901', client: 'TechFab Industries', date: '2026-01-10', due: '2026-02-10', amount: 120_000, status: 'Cobrada' },
    { id: 'FT-9905', client: 'Aceros León S.A.', date: '2026-01-22', due: '2026-02-22', amount: 48_500, status: 'Pendiente' },
    { id: 'FT-9912', client: 'Aceros León S.A.', date: '2025-12-30', due: '2026-01-30', amount: 75_600, status: 'Vencida' },
    { id: 'FT-9918', client: 'Maquinaria del Sur', date: '2026-02-01', due: '2026-03-01', amount: 87_500, status: 'Pendiente' },
    { id: 'FT-9920', client: 'Eurometal GmbH', date: '2026-02-10', due: '2026-03-10', amount: 215_000, status: 'Emitida' },
    { id: 'FT-9925', client: 'Prefabricados Norte', date: '2026-02-18', due: '2026-03-18', amount: 27_000, status: 'Emitida' },
  ],

  plChart: {
    labels: ['Oct', 'Nov', 'Dic', 'Ene', 'Feb'],
    income: [2_050_000, 1_990_000, 2_240_000, 2_190_000, 2_418_350],
    costs: [1_310_000, 1_290_000, 1_440_000, 1_400_000, 1_520_000],
  },

  employees: [
    { id: 'E-001', name: 'Carlos Méndez', dept: 'Producción', role: 'Jefe de Planta', status: 'Activo', start: '2018-03-01' },
    { id: 'E-002', name: 'Laura García', dept: 'RRHH', role: 'Directora de RRHH', status: 'Activo', start: '2017-06-15' },
    { id: 'E-003', name: 'Miguel Torres', dept: 'Contabilidad', role: 'Controller', status: 'Activo', start: '2020-01-08' },
    { id: 'E-004', name: 'Ana Ruiz', dept: 'CRM / Ventas', role: 'Account Manager', status: 'Activo', start: '2021-09-01' },
    { id: 'E-005', name: 'Jorge Blanco', dept: 'IT', role: 'Arquitecto Software', status: 'Activo', start: '2019-11-20' },
    { id: 'E-006', name: 'Sofía Navarro', dept: 'Producción', role: 'Operario CNC', status: 'Baja', start: '2022-04-10' },
    { id: 'E-007', name: 'Pablo Herrera', dept: 'Compras', role: 'Purchasing Manager', status: 'Activo', start: '2016-07-22' },
    { id: 'E-008', name: 'María González', dept: 'CRM / Ventas', role: 'SDR', status: 'Activo', start: '2024-02-01' },
    { id: 'E-009', name: 'Rubén Mora', dept: 'Producción', role: 'Técnico Mantenimiento', status: 'Activo', start: '2023-05-15' },
  ],

  deptChart: {
    labels: ['Producción', 'RRHH', 'Contabilidad', 'Ventas', 'IT', 'Compras', 'Dirección'],
    data: [98, 18, 14, 32, 22, 15, 35],
  },

  purchases: [
    { id: 'PO-3840', supplier: 'MetalBase S.A.', date: '2026-02-01', total: 45_200, status: 'Recibida', items: 4 },
    { id: 'PO-3841', supplier: 'Componentes Tech', date: '2026-02-05', total: 12_800, status: 'En Tránsito', items: 7 },
    { id: 'PO-3843', supplier: 'Lubricantes Rápidos', date: '2026-02-10', total: 3_400, status: 'Recibida', items: 2 },
    { id: 'PO-3847', supplier: 'Aceros del Norte', date: '2026-02-20', total: 88_000, status: 'Pendiente', items: 6 },
    { id: 'PO-3848', supplier: 'Sensores Ind. SL', date: '2026-02-22', total: 9_600, status: 'Aprobada', items: 3 },
    { id: 'PO-3850', supplier: 'Eurosteel GmbH', date: '2026-02-25', total: 120_000, status: 'Borrador', items: 10 },
  ],

  sqlSchema: {
    tables: [
      {
        name: 'productos',
        ddl: `CREATE TABLE productos (
  id_producto   SERIAL PRIMARY KEY,
  sku           VARCHAR(20)     NOT NULL UNIQUE,
  nombre        VARCHAR(200)    NOT NULL,
  categoria     VARCHAR(100),
  unidad        VARCHAR(20)     DEFAULT 'ud',
  precio_costo  NUMERIC(12,2)   NOT NULL DEFAULT 0,
  precio_venta  NUMERIC(12,2)   NOT NULL DEFAULT 0,
  stock_actual  INT             NOT NULL DEFAULT 0,
  stock_minimo  INT             NOT NULL DEFAULT 0,
  id_almacen    INT REFERENCES almacenes(id_almacen),
  activo        BOOLEAN         DEFAULT TRUE,
  created_at    TIMESTAMP       DEFAULT NOW()
);`
      },
      {
        name: 'pedidos',
        ddl: `CREATE TABLE pedidos (
  id_pedido     SERIAL PRIMARY KEY,
  numero        VARCHAR(20)     NOT NULL UNIQUE,  -- Ej: PED-2026-00847
  id_cliente    INT             NOT NULL REFERENCES clientes(id_cliente),
  fecha         DATE            NOT NULL DEFAULT CURRENT_DATE,
  fecha_entrega DATE,
  estado        VARCHAR(30)     NOT NULL DEFAULT 'borrador',
           -- 'borrador' | 'confirmado' | 'en_produccion'
           -- | 'expedido' | 'entregado' | 'cancelado'
  total_neto    NUMERIC(14,2)   NOT NULL DEFAULT 0,
  total_iva     NUMERIC(14,2)   NOT NULL DEFAULT 0,
  total_bruto   NUMERIC(14,2)   NOT NULL DEFAULT 0,
  id_empleado   INT REFERENCES empleados(id_empleado),
  notas         TEXT,
  created_at    TIMESTAMP       DEFAULT NOW()
);`
      },
      {
        name: 'lineas_pedido',
        ddl: `CREATE TABLE lineas_pedido (
  id_linea      SERIAL PRIMARY KEY,
  id_pedido     INT             NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
  id_producto   INT             NOT NULL REFERENCES productos(id_producto),
  cantidad      NUMERIC(10,3)   NOT NULL CHECK (cantidad > 0),
  precio_unit   NUMERIC(12,2)   NOT NULL,
  descuento_pct NUMERIC(5,2)    DEFAULT 0,
  subtotal      NUMERIC(14,2)   GENERATED ALWAYS AS
                  (cantidad * precio_unit * (1 - descuento_pct/100)) STORED
);`
      },
      {
        name: 'clientes',
        ddl: `CREATE TABLE clientes (
  id_cliente    SERIAL PRIMARY KEY,
  razon_social  VARCHAR(200)    NOT NULL,
  nif           VARCHAR(20)     UNIQUE,
  contacto      VARCHAR(100),
  email         VARCHAR(150),
  telefono      VARCHAR(30),
  direccion     TEXT,
  pais          VARCHAR(60)     DEFAULT 'España',
  limite_credito NUMERIC(14,2)  DEFAULT 0,
  etapa_crm     VARCHAR(30)     DEFAULT 'Contacto',
  activo        BOOLEAN         DEFAULT TRUE,
  created_at    TIMESTAMP       DEFAULT NOW()
);`
      },
      {
        name: 'facturas',
        ddl: `CREATE TABLE facturas (
  id_factura    SERIAL PRIMARY KEY,
  numero        VARCHAR(20)     NOT NULL UNIQUE,  -- Ej: FT-2026-09925
  id_pedido     INT             REFERENCES pedidos(id_pedido),
  id_cliente    INT             NOT NULL REFERENCES clientes(id_cliente),
  fecha_emision DATE            NOT NULL DEFAULT CURRENT_DATE,
  fecha_vence   DATE,
  estado        VARCHAR(20)     DEFAULT 'emitida',
           -- 'emitida' | 'pendiente' | 'cobrada' | 'vencida'
  base_imponible NUMERIC(14,2)  NOT NULL,
  iva_pct       NUMERIC(5,2)    DEFAULT 21,
  total_iva     NUMERIC(14,2)   NOT NULL,
  total         NUMERIC(14,2)   NOT NULL,
  pdf_url       TEXT,
  created_at    TIMESTAMP       DEFAULT NOW()
);`
      },
    ]
  },

  orderFlow: [
    { step: 1, icon: 'file-plus', title: 'Pedido Creado', desc: 'El comercial registra el pedido en el módulo CRM — se asigna número único PED-YYYY-NNNNN.' },
    { step: 2, icon: 'check-circle', title: 'Validación Crédito', desc: 'El sistema comprueba el límite de crédito del cliente en la tabla clientes. Si excede, alerta a dirección.' },
    { step: 3, icon: 'search', title: 'Comprobación Stock', desc: 'ERP consulta stock_actual en la tabla productos. Si no hay suficiente, se dispara una Orden de Compra (PO).' },
    { step: 4, icon: 'layers', title: 'Lanzar a Producción', desc: 'Si el producto es fabricado, se crea una Orden de Fabricación vinculada al pedido para el módulo de Producción.' },
    { step: 5, icon: 'package', title: 'Descuento de Stock', desc: 'Al confirmar el expediente, ERP hace UPDATE productos SET stock_actual = stock_actual - cantidad para cada línea.' },
    { step: 6, icon: 'truck', title: 'Albarán / Envío', desc: 'Se genera el albarán de entrega. El estado del pedido cambia a "expedido". Logística recibe la notificación.' },
    { step: 7, icon: 'file-text', title: 'Factura Generada', desc: 'Al marcar el pedido "entregado", el motor contable crea automáticamente la factura en la tabla facturas.' },
    { step: 8, icon: 'credit-card', title: 'Cobro y Cierre', desc: 'Al registrar el cobro, la factura pasa a estado "cobrada" y se contabiliza el asiento en el libro mayor.' },
  ],

  // ── Producción ──────────────────────────────────────────────
  productionOrders: [
    { id: 'OF-2026-001', product: 'Fresadora MX-3', client: 'TechFab Industries', qty: 5, done: 4, status: 'En Proceso', priority: 'alta', start: '2026-02-01', due: '2026-02-28', line: 'Línea A' },
    { id: 'OF-2026-002', product: 'Torno CNC T-500', client: 'Eurometal GmbH', qty: 3, done: 3, status: 'Completada', priority: 'media', start: '2026-01-20', due: '2026-02-20', line: 'Línea B' },
    { id: 'OF-2026-003', product: 'Panel PLC v2', client: 'Aceros León S.A.', qty: 10, done: 2, status: 'En Proceso', priority: 'alta', start: '2026-02-10', due: '2026-03-10', line: 'Línea A' },
    { id: 'OF-2026-004', product: 'Sensor Industrial', client: 'Prefabricados Norte', qty: 50, done: 50, status: 'Completada', priority: 'baja', start: '2026-01-15', due: '2026-02-15', line: 'Línea C' },
    { id: 'OF-2026-005', product: 'Motor 5.5kW Mod. X', client: 'Maquinaria del Sur', qty: 8, done: 0, status: 'Planificada', priority: 'media', start: '2026-03-01', due: '2026-03-25', line: 'Línea B' },
    { id: 'OF-2026-006', product: 'Cuadro Eléctrico', client: 'Grupo Metalmecánico', qty: 2, done: 1, status: 'En Proceso', priority: 'alta', start: '2026-02-18', due: '2026-03-05', line: 'Línea C' },
  ],

  machines: [
    { id: 'M-01', name: 'CNC Heidenhain TNC 640', line: 'Línea A', status: 'operativa', load: 78, temp: 42, uptime: 99.2, lastMaint: '2026-01-15', nextMaint: '2026-04-15', alerts: 0 },
    { id: 'M-02', name: 'Fresadora DMG MORI', line: 'Línea A', status: 'operativa', load: 91, temp: 55, uptime: 97.8, lastMaint: '2026-02-01', nextMaint: '2026-05-01', alerts: 1 },
    { id: 'M-03', name: 'Torno Mazak QT-250', line: 'Línea B', status: 'mantenimiento', load: 0, temp: 28, uptime: 94.1, lastMaint: '2026-02-24', nextMaint: '2026-02-28', alerts: 2 },
    { id: 'M-04', name: 'Robot KUKA KR 10 R1100', line: 'Línea B', status: 'operativa', load: 65, temp: 38, uptime: 99.9, lastMaint: '2026-01-20', nextMaint: '2026-04-20', alerts: 0 },
    { id: 'M-05', name: 'Soldadora TIG Lincoln', line: 'Línea C', status: 'operativa', load: 44, temp: 61, uptime: 98.5, lastMaint: '2026-02-10', nextMaint: '2026-05-10', alerts: 0 },
    { id: 'M-06', name: 'Prensa Hidráulica 200T', line: 'Línea C', status: 'parada', load: 0, temp: 25, uptime: 88.3, lastMaint: '2025-12-01', nextMaint: '2026-02-25', alerts: 3 },
  ],

  prodKpis: {
    oee: 84.2, efficiency: 91.5, defectRate: 1.3, onTimeDelivery: 96.7,
    ordersThisMonth: 6, completedOrders: 2, machinesOnline: 4,
  },

  // ── Logística ───────────────────────────────────────────────
  shipments: [
    { id: 'ENV-8801', client: 'TechFab Industries', origin: 'Madrid', dest: 'Barcelona', carrier: 'DHL Express', status: 'Entregado', dep: '2026-02-18', eta: '2026-02-20', weight: 1_240, tracking: 'JD014600006434789001' },
    { id: 'ENV-8802', client: 'Eurometal GmbH', origin: 'Madrid', dest: 'Munich', carrier: 'FedEx Int.', status: 'En Tránsito', dep: '2026-02-22', eta: '2026-02-27', weight: 3_600, tracking: '7748999999999' },
    { id: 'ENV-8803', client: 'Aceros León S.A.', origin: 'Madrid', dest: 'León', carrier: 'MRW Empresas', status: 'En Reparto', dep: '2026-02-25', eta: '2026-02-26', weight: 890, tracking: '2026000000001' },
    { id: 'ENV-8804', client: 'Maquinaria del Sur', origin: 'Madrid', dest: 'Sevilla', carrier: 'SEUR Business', status: 'Preparando', dep: '2026-02-26', eta: '2026-02-28', weight: 450, tracking: '—' },
    { id: 'ENV-8805', client: 'Prefabricados Norte', origin: 'Bilbao', dest: 'Santander', carrier: 'GLS Spain', status: 'Entregado', dep: '2026-02-15', eta: '2026-02-17', weight: 220, tracking: 'GLS2026001' },
    { id: 'ENV-8806', client: 'Grupo Metalmecánico', origin: 'Madrid', dest: 'Zaragoza', carrier: 'DHL Express', status: 'Incidencia', dep: '2026-02-20', eta: '2026-02-23', weight: 780, tracking: 'JD0146000XXXX' },
  ],

  routes: [
    { from: 'Madrid', to: 'Barcelona', distance: 621, avgTime: '5h 20m', carrier: 'DHL', cost: 245 },
    { from: 'Madrid', to: 'Sevilla', distance: 530, avgTime: '4h 45m', carrier: 'SEUR', cost: 195 },
    { from: 'Madrid', to: 'Munich', distance: 2100, avgTime: '2d', carrier: 'FedEx', cost: 890 },
    { from: 'Bilbao', to: 'Santander', distance: 100, avgTime: '1h 10m', carrier: 'GLS', cost: 85 },
  ],

  // ── Analytics & BI ──────────────────────────────────────────
  bi: {
    salesByRegion: {
      labels: ['Cataluña', 'Madrid', 'Andalucía', 'País Vasco', 'DACH', 'EEUU', 'LATAM'],
      data: [580_000, 420_000, 310_000, 195_000, 480_000, 290_000, 143_000],
      colors: ['#00BFFF', '#00E5A0', '#FFB300', '#A855F7', '#FF79C6', '#FF4D6D', '#89b4fa'],
    },
    productMargins: {
      labels: ['Fresadora MX-3', 'Torno T-500', 'Panel PLC', 'Sensor Ind.', 'Motor 5.5kW', 'Cuadro Elec.'],
      margin: [38.2, 31.5, 44.8, 52.1, 28.7, 35.4],
      revenue: [680_000, 420_000, 180_000, 95_000, 340_000, 160_000],
    },
    monthlyTrend: {
      labels: ['Q1-24', 'Q2-24', 'Q3-24', 'Q4-24', 'Q1-25', 'Q2-25', 'Q3-25', 'Q4-25', 'Q1-26*'],
      revenue: [4_200_000, 4_800_000, 5_100_000, 5_600_000, 5_900_000, 6_200_000, 6_800_000, 7_100_000, 2_418_350],
      target: [4_000_000, 4_500_000, 5_000_000, 5_500_000, 5_800_000, 6_000_000, 6_500_000, 7_000_000, 7_200_000],
    },
    customerLTV: [
      { name: 'TechFab Industries', ltv: 2_400_000, orders: 18, avgOrder: 133_000, segment: 'Enterprise' },
      { name: 'Eurometal GmbH', ltv: 1_890_000, orders: 12, avgOrder: 157_500, segment: 'Enterprise' },
      { name: 'Aceros León S.A.', ltv: 980_000, orders: 22, avgOrder: 44_500, segment: 'Mid-Market' },
      { name: 'Maquinaria del Sur', ltv: 540_000, orders: 8, avgOrder: 67_500, segment: 'Mid-Market' },
      { name: 'Prefabricados Norte', ltv: 310_000, orders: 14, avgOrder: 22_000, segment: 'SMB' },
      { name: 'Grupo Metalmecánico', ltv: 95_000, orders: 5, avgOrder: 19_000, segment: 'SMB' },
    ],
    aiInsights: [
      { icon: 'trending-up', color: 'var(--green)', title: 'Pico de demanda previsto', body: 'El modelo LSTM predice +23% en pedidos de Tornos CNC en Marzo. Recomendación: incremente stock de SKU-3020 en 12 unidades.' },
      { icon: 'alert-triangle', color: 'var(--amber)', title: 'Riesgo de churn detectado', body: 'Grupo Metalmecánico (C-004) muestra score de churn del 71%. Última compra hace 45 días. Acción sugerida: contacto comercial.' },
      { icon: 'zap', color: 'var(--blue)', title: 'Oportunidad de cross-sell', body: 'TechFab Industries compra Fresadoras pero nunca Tornos. Propensidad de compra: 84%. Valor estimado: €180K.' },
      { icon: 'cpu', color: 'var(--purple)', title: 'Mantenimiento predictivo', body: 'Máquina M-02 muestra vibración anómala. Probabilidad de fallo en 14 días: 67%. Programar mantenimiento preventivo.' },
    ],
  },

  // ── Notifications ───────────────────────────────────────────
  notifications: [
    { id: 'N-001', type: 'stock', sev: 'high', title: 'Stock Crítico', body: 'SKU-2041 Tornillo Inox M8x25 tiene solo 3 unidades. Mínimo: 500.', time: 'Hace 5 min', read: false, module: 'inventory' },
    { id: 'N-002', type: 'finance', sev: 'high', title: 'Factura Vencida', body: 'FT-9912 por €75.600 de Aceros León S.A. venció el 30/01/2026.', time: 'Hace 1 h', read: false, module: 'accounting' },
    { id: 'N-003', type: 'purchase', sev: 'med', title: 'OC Pendiente Aprobar', body: 'PO-3847 de Aceros del Norte por €88.000 esperando aprobación.', time: 'Hace 2 h', read: false, module: 'purchasing' },
    { id: 'N-004', type: 'prod', sev: 'med', title: 'OF Retrasada', body: 'OF-2026-003 Panel PLC v2 lleva 2 días de retraso sobre planificación.', time: 'Hace 3 h', read: true, module: 'production' },
    { id: 'N-005', type: 'hr', sev: 'low', title: 'Contrato por Vencer', body: 'Contrato de M. González vence el 01/03/2026.', time: 'Hace 4 h', read: true, module: 'hr' },
    { id: 'N-006', type: 'machine', sev: 'high', title: 'Máquina Parada', body: 'Prensa Hidráulica 200T (M-06) fuera de servicio. 3 alertas activas.', time: 'Hace 5 h', read: false, module: 'production' },
    { id: 'N-007', type: 'ship', sev: 'med', title: 'Envío con Incidencia', body: 'ENV-8806 a Grupo Metalmecánico tiene incidencia en tránsito.', time: 'Hace 6 h', read: true, module: 'logistics' },
    { id: 'N-008', type: 'ai', sev: 'low', title: 'Insight IA disponible', 'body': 'Nuevo análisis predictivo de churn para Q1 2026 listo.', time: 'Hace 8 h', read: true, module: 'analytics' },
    { id: 'N-009', type: 'system', sev: 'ok', title: 'Backup Completado', body: 'Backup nocturno de BD ejecutado correctamente. 14.2 GB respaldados.', time: 'Hace 10 h', read: true, module: 'dashboard' },
    { id: 'N-010', type: 'crm', sev: 'low', title: 'Reunión de Cierre', body: 'TechFab Industries (C-003) confirmó reunión de firma para mañana.', time: 'Hace 12 h', read: true, module: 'crm' },
  ],

  // ── Settings ────────────────────────────────────────────────
  settings: {
    company: { name: 'Industrias NexusFab S.A.', nif: 'A-12345678', country: 'España', currency: 'EUR', timezone: 'Europe/Madrid', fiscalYear: 'Enero-Diciembre' },
    modules: [
      { key: 'crm', name: 'CRM', enabled: true, plan: 'Enterprise' },
      { key: 'inventory', name: 'Inventario', enabled: true, plan: 'Enterprise' },
      { key: 'accounting', name: 'Contabilidad', enabled: true, plan: 'Enterprise' },
      { key: 'hr', name: 'RRHH', enabled: true, plan: 'Enterprise' },
      { key: 'purchasing', name: 'Compras', enabled: true, plan: 'Enterprise' },
      { key: 'production', name: 'Producción', enabled: true, plan: 'Enterprise' },
      { key: 'logistics', name: 'Logística', enabled: true, plan: 'Enterprise' },
      { key: 'analytics', name: 'Analytics & BI', enabled: true, plan: 'Enterprise' },
      { key: 'ai_supply', name: 'IA Supply Chain', enabled: false, plan: 'AI Add-on' },
      { key: 'blockchain', name: 'Blockchain Fin.', enabled: false, plan: 'AI Add-on' },
      { key: 'twin', name: 'Gemelo Digital', enabled: false, plan: 'AI Add-on' },
    ],
    integrations: [
      { name: 'Salesforce CRM', status: 'conectado', icon: 'users', lastSync: 'Hace 15 min' },
      { name: 'SAP ERP (legacy)', status: 'conectado', icon: 'database', lastSync: 'Hace 1 h' },
      { name: 'Stripe Payments', status: 'conectado', icon: 'credit-card', lastSync: 'Hace 30 min' },
      { name: 'DHL API', status: 'conectado', icon: 'truck', lastSync: 'Hace 5 min' },
      { name: 'HubSpot', status: 'desconectado', icon: 'layout', lastSync: 'Nunca' },
      { name: 'Slack Alerts', status: 'conectado', icon: 'bell', lastSync: 'Hace 2 min' },
      { name: 'Google Workspace', status: 'conectado', icon: 'mail', lastSync: 'En vivo' },
      { name: 'Power BI Embed', status: 'desconectado', icon: 'bar-chart-2', lastSync: 'Nunca' },
    ],
    users: [
      { name: 'Carlos Ejecutivo', email: 'ceo@nexusfab.es', role: 'Super Admin', status: 'activo', lastLogin: 'Ahora' },
      { name: 'Laura García', email: 'lgarcia@nexusfab.es', role: 'Admin RRHH', status: 'activo', lastLogin: 'Hace 2 h' },
      { name: 'Miguel Torres', email: 'mtorres@nexusfab.es', role: 'Finanzas', status: 'activo', lastLogin: 'Hace 4 h' },
      { name: 'Ana Ruiz', email: 'aruiz@nexusfab.es', role: 'Ventas', status: 'activo', lastLogin: 'Hace 1 h' },
      { name: 'Jorge Blanco', email: 'jblanco@nexusfab.es', role: 'IT Admin', status: 'activo', lastLogin: 'Hace 3 h' },
    ],
  },

  // ── Global Search Index ─────────────────────────────────────
  searchIndex: [
    ...[], // populated dynamically by buildSearchIndex()
  ],
};

// Build global search index at runtime
function buildSearchIndex() {
  const idx = [];
  ERP_DATA.inventory.forEach(p => idx.push({ module: 'inventory', label: p.name, sub: p.sku, action: () => { navigate('inventory'); setTimeout(() => openInventoryPanel(p.sku), 300); } }));
  ERP_DATA.clients.forEach(c => idx.push({ module: 'crm', label: c.name, sub: c.stage + ' · ' + c.contact, action: () => { navigate('crm'); setTimeout(() => openClientPanel(c.id), 300); } }));
  ERP_DATA.invoices.forEach(f => idx.push({ module: 'accounting', label: f.id, sub: f.client + ' · €' + f.amount.toLocaleString('es-ES'), action: () => { navigate('accounting'); setTimeout(() => openInvoicePanel(f.id), 300); } }));
  ERP_DATA.employees.forEach(e => idx.push({ module: 'hr', label: e.name, sub: e.role + ' · ' + e.dept, action: () => { navigate('hr'); setTimeout(() => openEmployeePanel(e.id), 300); } }));
  ERP_DATA.purchases.forEach(p => idx.push({ module: 'purchasing', label: p.id, sub: p.supplier + ' · €' + p.total.toLocaleString('es-ES'), action: () => { navigate('purchasing'); setTimeout(() => openPurchasePanel(p.id), 300); } }));
  ERP_DATA.productionOrders.forEach(o => idx.push({ module: 'production', label: o.id, sub: o.product + ' · ' + o.client, action: () => navigate('production') }));
  ERP_DATA.shipments.forEach(s => idx.push({ module: 'logistics', label: s.id, sub: s.client + ' → ' + s.dest, action: () => navigate('logistics') }));
  ERP_DATA.searchIndex.push(...idx);
}

