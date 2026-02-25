// ============================================================
// SQL Schema + NoSQL + Architecture Module (Enterprise OS edition)
// ============================================================
const SchemaModule = {
    current: 0,
    render() {
        const tables = ERP_DATA.sqlSchema.tables;

        const tabsHTML = tables.map((t, i) => `
      <button class="schema-tab ${i === 0 ? 'active' : ''}" onclick="SchemaModule.switchTab(${i})" id="stab-${i}">${t.name}</button>
    `).join('');

        const extraTabs = `
      <button class="schema-tab" onclick="SchemaModule.switchTab(5)" id="stab-5">nosql_comportamiento</button>
      <button class="schema-tab" onclick="SchemaModule.switchTab(6)" id="stab-6">kafka_events</button>
      <button class="schema-tab" onclick="SchemaModule.switchTab(7)" id="stab-7">api_schema</button>
    `;

        return `
      <div class="page-header">
        <div>
          <div class="page-title">Diccionario de Datos — ERD Maestro</div>
          <div class="page-subtitle">Esquema Relacional SQL · NoSQL Behavioral Lake · Kafka Events · API Contracts</div>
        </div>
      </div>

      <div class="info-box">
        <strong>Arquitectura Híbrida de Datos:</strong>
        PostgreSQL (OLTP core — ACID) + Apache Cassandra (alta disponibilidad — BASE) + 
        MongoDB (lago comportamental NoSQL) + Apache Kafka (bus de eventos — &gt;1M msgs/s) + 
        Redis (caché distribuida) + ClickHouse (OLAP analytics).
      </div>

      <div class="schema-tabs" id="schema-tabs">${tabsHTML}${extraTabs}</div>
      <div id="schema-panel" class="animate-in"></div>
    `;
    },

    switchTab(idx) {
        this.current = idx;
        document.querySelectorAll('.schema-tab').forEach((t, i) => t.classList.toggle('active', i === idx));

        const panel = document.getElementById('schema-panel');
        panel.className = 'animate-in';
        void panel.offsetWidth;

        if (idx < 5) {
            const t = ERP_DATA.sqlSchema.tables[idx];
            panel.innerHTML = `
        <div class="card">
          <div class="card-header">
            <div class="card-title" style="font-family:monospace">
              <i data-lucide="database" style="width:16px;height:16px;color:var(--blue)"></i>
              tabla: <strong style="color:var(--blue)">${t.name}</strong>
            </div>
            <button class="btn btn-glass" style="padding:4px 12px;font-size:.72rem" onclick="navigator.clipboard.writeText(document.getElementById('ddl-code').innerText)">
              <i data-lucide="copy" style="width:12px;height:12px"></i> Copiar DDL
            </button>
          </div>
          <div class="card-body">
            <div class="code-block" id="ddl-code">${this.highlight(t.ddl)}</div>
          </div>
        </div>`;
        } else if (idx === 5) {
            panel.innerHTML = `
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="database" style="width:16px;height:16px;color:var(--green)"></i> MongoDB — Lago Comportamental del Cliente</div>
          </div>
          <div class="card-body">
            <div class="code-block">${this.highlight(`// Collection: customer_events
// Motor: MongoDB 7 (NoSQL Document Store)
// Retención: 24 meses en caliente, archivado en S3 Glacier
{
  "_id":           ObjectId,
  "session_id":    String,      // UUID v4
  "customer_id":   String,      // FK lógica → clientes.id_cliente
  "tenant_id":     String,      // Multi-tenancy: ID de empresa
  "timestamp":     ISODate,     // UTC — Indexed TTL
  "channel":       String,      // "web" | "app" | "erp" | "iot" | "voice"
  "event_type":    String,      // "page_view" | "quote_start" | "add_to_cart"
                                // "checkout" | "support_ticket" | "churn_risk"
  "payload": {
    "product_ids": [String],    // SKUs involucrados
    "value":       Number,      // Valor estimado del evento
    "duration_ms": Number,      // Tiempo de interacción
    "geo": {
      "lat":       Number,
      "lon":       Number,
      "country":   String,      // ISO 3166-1 alpha-2
    },
    "device":      Object,      // UA, OS, screen_resolution
    "ai_scores": {
      "churn_prob":    Number,  // 0.0–1.0 (modelo LSTM)
      "ltv_estimate":  Number,  // Lifetime Value predicho (€)
      "sentiment":     Number,  // -1.0 (neg) → +1.0 (pos)
      "intent_class":  String,  // "buying" | "researching" | "support"
    }
  },
  "metadata": {
    "ingested_by": String,      // Servicio productor
    "kafka_offset": Long,       // Trazabilidad del evento
    "schema_version": String    // "2.1.0" — evolución sin migraciones
  }
}

// Índices Estratégicos:
db.customer_events.createIndex({ "customer_id": 1, "timestamp": -1 })
db.customer_events.createIndex({ "tenant_id": 1, "event_type": 1 })
db.customer_events.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 63072000 })
db.customer_events.createIndex({ "payload.ai_scores.churn_prob": -1 })`)}</div>
          </div>
        </div>`;
        } else if (idx === 6) {
            panel.innerHTML = `
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="zap" style="width:16px;height:16px;color:var(--amber)"></i> Apache Kafka — Bus de Eventos Global (>1M msgs/s)</div>
          </div>
          <div class="card-body">
            <div class="code-block" style="font-size:.76rem">${this.highlight(`# ══════════════════════════════════════════════
#  NexusERP — Arquitectura Event-Driven con Kafka
#  Throughput target: 1.2M eventos/segundo
#  Latencia P99: < 8ms
# ══════════════════════════════════════════════

# Topología de Topics (Kafka 3.8 + KRaft mode):
TOPIC                          PARTITIONS  REPLICATION  RETENTION
─────────────────────────────────────────────────────────────────
erp.orders.created             64          3            7d
erp.orders.state-changed       64          3            7d
erp.inventory.updated          128         3            3d
erp.invoice.generated          32          3            30d
erp.payments.processed         32          3            90d
erp.supplychain.prediction     16          3            14d
erp.hr.events                  16          3            7d
erp.audit.log                  32          5            365d  # compliance
erp.iot.factory-sensors        512         3            2d    # digital twin
erp.ai.model-inference         64          3            1d

# Ejemplo: Evento de Pedido Creado
{
  "topic":      "erp.orders.created",
  "key":        "tenant:acme-corp:PED-2026-00848",
  "headers": {
    "X-Correlation-ID": "uuid-v4",
    "X-Tenant-ID":      "acme-corp",
    "X-Schema-Version": "3.0.1",
    "X-Source-Service": "order-management-svc"
  },
  "value": {
    "event_type":    "ORDER_CREATED",
    "event_version": "3.0.1",
    "occurred_at":   "2026-02-25T23:13:00Z",
    "aggregate_id":  "PED-2026-00848",
    "payload": {
      "order_id":    "PED-2026-00848",
      "customer_id": "C-003",
      "total_bruto": 340000.00,
      "currency":    "EUR",
      "lines":       [...]
    },
    "saga_context": {
      "saga_id":      "SAGA-ORD-00848",
      "saga_step":    1,
      "compensations": ["cancel_reservation", "release_credit"]
    }
  }
}

# Patrón SAGA: Consistencia Distribuida sin 2PC
# Evita locks globales → alta disponibilidad > 99.99%
#
# ORDER_CREATED → (crm-svc)    validates credit
#              → (inv-svc)     reserves stock
#              → (prod-svc)    schedules manufacturing
#              → (ship-svc)    Creates shipment
#              → (fin-svc)     Generates invoice
#              → (notif-svc)   Sends confirmation
# En cada paso: evento de éxito o compensación automática`)}</div>
          </div>
        </div>`;
        } else if (idx === 7) {
            panel.innerHTML = `
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="code" style="width:16px;height:16px;color:var(--purple)"></i> Estrategia API-First — OpenAPI 3.1 + GraphQL + gRPC</div>
          </div>
          <div class="card-body">
            <div class="code-block" style="font-size:.76rem">${this.highlight(`# ══════════════════════════════════════════
#  NexusERP API Ecosystem — API-First Strategy
# ══════════════════════════════════════════

# Capa 1: REST (OpenAPI 3.1) — Integraciones B2B
# ─────────────────────────────────────────────
POST   /api/v3/orders              # Crear pedido
GET    /api/v3/orders/{id}         # Consultar pedido
PATCH  /api/v3/orders/{id}/state   # Cambiar estado
GET    /api/v3/inventory/sku/{sku} # Stock en tiempo real
POST   /api/v3/invoices            # Emitir factura
GET    /api/v3/analytics/kpi       # KPIs para dashboards externos
POST   /api/v3/webhooks/subscribe  # Suscribirse a eventos

# Autenticación: OAuth 2.1 + PKCE + mTLS (Zero Trust)
# Rate Limiting: 10.000 req/min (tier Enterprise)
# SLA: 99.99% uptime · P99 latency < 150ms

# Capa 2: GraphQL — SPA Interna + Mobile Apps
# ────────────────────────────────────────────
query GetOrderDashboard($tenantId: ID!) {
  orders(tenantId: $tenantId, status: ACTIVE, limit: 50) {
    id number totalBruto status customer { name creditLimit }
    lines { product { sku stockActual } quantity unitPrice }
  }
  kpis(tenantId: $tenantId, period: CURRENT_MONTH) {
    revenue ordersCount stockAlerts headcount
  }
}

subscription OnOrderStateChange($orderId: ID!) {
  orderStateChanged(orderId: $orderId) { newState occurredAt }
}

# Capa 3: gRPC — Comunicación Inter-Microservicios (Go)
# ──────────────────────────────────────────────────────
# Protobuf: tipado estricto, 10x más rápido que JSON
syntax = "proto3";
service OrderService {
  rpc CreateOrder     (OrderRequest)    returns (OrderResponse);
  rpc ReserveStock    (StockRequest)    returns (StockResponse);
  rpc GenerateInvoice (InvoiceRequest)  returns (InvoiceResponse);
  rpc StreamOrderFlow (OrderId) returns (stream OrderEvent);
}

# Webhooks en tiempo real (push > poll):
{
  "event": "invoice.generated",
  "webhook_id": "wh_abc123",
  "tenant_id": "acme-corp",
  "retry_policy": { "max_attempts": 5, "backoff": "exponential" },
  "signature": "HMAC-SHA256(payload, secret)",
  "payload": { "invoice_id": "FT-2026-09930", "total": 340000.00 }
}`)}</div>
          </div>
        </div>`;
        }

        if (window.lucide) lucide.createIcons();
    },

    highlight(code) {
        const keywords = ['CREATE', 'TABLE', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'NOT', 'NULL',
            'DEFAULT', 'UNIQUE', 'INDEX', 'ON', 'DELETE', 'CASCADE', 'GENERATED', 'ALWAYS', 'AS',
            'STORED', 'CHECK', 'SERIAL', 'BOOLEAN', 'TEXT', 'DATE', 'TIMESTAMP', 'NOW', 'INT', 'NUMERIC',
            'VARCHAR', 'LONG', 'PARTITION', 'BY', 'RANGE', 'HASH', 'WITH', 'SELECT', 'FROM', 'WHERE', 'JOIN',
            'syntax', 'service', 'rpc', 'returns', 'message', 'stream', 'query', 'subscription', 'mutation'];
        const types = ['SERIAL', 'INT', 'VARCHAR', 'TEXT', 'NUMERIC', 'BOOLEAN', 'DATE', 'TIMESTAMP',
            'BIGINT', 'JSONB', 'UUID', 'FLOAT', 'DOUBLE', 'CHAR', 'ObjectId', 'String', 'Number', 'ISODate', 'Long', 'Object'];
        let escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // Comments
        escaped = escaped.replace(/(\/\/[^\n]*|#[^\n]*|--[^\n]*)/g, '<span class="code-cmt">$1</span>');
        return escaped;
    },

    afterRender() {
        this.switchTab(0);
        if (window.lucide) lucide.createIcons();
    }
};
