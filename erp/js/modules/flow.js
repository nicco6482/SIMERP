// ============================================================
// Order Flow + Roadmap + Architecture Module (Enterprise OS)
// ============================================================
const FlowModule = {
    currentView: 'flow',
    render() {
        return `
      <div class="page-header">
        <div>
          <div class="page-title">Arquitectura & Flujos</div>
          <div class="page-subtitle">Flujo Pedido→Factura · Mapa de Módulos · Hoja de Ruta 3 Años</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn ${this.currentView === 'flow' ? 'btn-primary' : 'btn-glass'}" onclick="FlowModule.switchView('flow')">Flujo de Pedido</button>
          <button class="btn ${this.currentView === 'modules' ? 'btn-primary' : 'btn-glass'}" onclick="FlowModule.switchView('modules')">10 Módulos</button>
          <button class="btn ${this.currentView === 'roadmap' ? 'btn-primary' : 'btn-glass'}" onclick="FlowModule.switchView('roadmap')">Roadmap 3 Años</button>
          <button class="btn ${this.currentView === 'security' ? 'btn-primary' : 'btn-glass'}" onclick="FlowModule.switchView('security')">Seguridad</button>
        </div>
      </div>
      <div id="flow-panel" class="animate-in"></div>
    `;
    },

    switchView(view) {
        this.currentView = view;
        document.querySelectorAll('.page-header .btn').forEach(b => {
            b.className = 'btn btn-glass';
        });
        event.target.className = 'btn btn-primary';
        const panel = document.getElementById('flow-panel');
        panel.className = 'animate-in';
        void panel.offsetWidth;

        if (view === 'flow') panel.innerHTML = this.renderFlow();
        if (view === 'modules') panel.innerHTML = this.renderModules();
        if (view === 'roadmap') panel.innerHTML = this.renderRoadmap();
        if (view === 'security') panel.innerHTML = this.renderSecurity();
        if (window.lucide) lucide.createIcons();
    },

    renderFlow() {
        const steps = ERP_DATA.orderFlow;
        const stepsHTML = steps.map(s => `
      <div class="flow-step" style="animation-delay:${(s.step - 1) * 0.06}s">
        <div class="flow-num">${s.step}</div>
        <div class="flow-content">
          <div class="flow-title"><i data-lucide="${s.icon}" style="width:14px;height:14px;margin-right:5px;vertical-align:middle;color:var(--blue)"></i>${s.title}</div>
          <div class="flow-desc">${s.desc}</div>
        </div>
      </div>`).join('');

        return `
      <div class="info-box">
        <strong>Patrón SAGA Coreografado:</strong> Cada paso emite un evento Kafka. 
        Los microservicios reaccionan de forma autónoma. Si algún paso falla, los servicios anteriores 
        ejecutan automáticamente sus <strong>compensaciones</strong> (ej. liberar reserva de stock).
        Consistencia eventual garantizada · Sin punto único de fallo · Latencia P99 &lt; 120ms end-to-end.
      </div>
      <div class="flow-grid">${stepsHTML}</div>`;
    },

    renderModules() {
        const modules = [
            { n: 1, icon: 'brain', name: 'IA Predictiva de Supply Chain', color: 'blue', desc: 'ML/LSTM predice demanda, rupturas de stock y retrasos de proveedores con 94% de precisión. Auto-genera OCs.', tech: 'Python · PyTorch · Kafka Streams' },
            { n: 2, icon: 'link', name: 'Finanzas Autónomas & Blockchain', color: 'purple', desc: 'Contratos inteligentes (Ethereum/Hyperledger) para pagos automáticos entre empresas. Auditoría inmutable.', tech: 'Solidity · Go · Hyperledger Fabric' },
            { n: 3, icon: 'heart', name: 'RRHH con Análisis de Sentimiento', color: 'pink', desc: 'NLP analiza encuestas, emails y reuniones para detectar riesgo de fuga y medir bienestar del equipo.', tech: 'Python · HuggingFace · Kafka' },
            { n: 4, icon: 'cpu', name: 'Gemelo Digital de la Fábrica', color: 'green', desc: 'Réplica virtual en tiempo real de cada máquina, línea de producción y almacén. Simula escenarios antes de ejecutar.', tech: 'Unity HDRP · Three.js · IoT MQTT' },
            { n: 5, icon: 'globe', name: 'Comercio Global & Aduanas', color: 'amber', desc: 'Gestión multi-divisa, cálculo automático de aranceles HS codes, y cumplimiento de exportaciones por país.', tech: 'Node.js · PostgreSQL · SAP GTS API' },
            { n: 6, icon: 'shield', name: 'Compliance Autónomo', color: 'red', desc: 'Motor de reglas que aplica GDPR, ISO 27001, SOX, IFRS 17 automáticamente. Genera informes de auditoría.', tech: 'Drools · Java · MongoDB' },
            { n: 7, icon: 'bar-chart-2', name: 'BI & Analytics con GPT', color: 'blue', desc: 'Dashboards auto-generados con lenguaje natural. "¿Cuánto vendimos en LATAM el Q3?" → gráfico en 2 segundos.', tech: 'React · DuckDB · OpenAI API' },
            { n: 8, icon: 'truck', name: 'Logística & Last Mile', color: 'amber', desc: 'Optimización de rutas con Dijkstra + ML. Tracking GPS en tiempo real. Integración con DHL, FedEx, Amazon Logistics.', tech: 'Go · Redis · Google Maps API' },
            { n: 9, icon: 'users', name: 'CRM Omnicanal 360°', color: 'purple', desc: 'Unifica web, app, WhatsApp, email y voz. IA decide el mejor canal y momento para cada comunicación.', tech: 'Node.js · Twilio · Kafka' },
            { n: 10, icon: 'zap', name: 'ERP Store & Ecosistema de Apps', color: 'green', desc: 'Marketplace de extensiones construidas por terceros sobre la API-First del ERP. Revenue sharing 70/30.', tech: 'React · GraphQL · Stripe Connect' },
        ];

        const colorMap = { blue: 'var(--blue)', purple: 'var(--purple)', pink: 'var(--pink)', green: 'var(--green)', amber: 'var(--amber)', red: 'var(--red)' };
        const cards = modules.map(m => `
      <div class="card" style="padding:18px;transition:all .25s;cursor:default" onmouseover="this.style.borderColor='${colorMap[m.color]}44'" onmouseout="this.style.borderColor=''">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="width:36px;height:36px;border-radius:10px;background:${colorMap[m.color]}22;display:flex;align-items:center;justify-content:center;color:${colorMap[m.color]};flex-shrink:0">
            <i data-lucide="${m.icon}" style="width:18px;height:18px"></i>
          </div>
          <div>
            <div style="font-size:.7rem;color:var(--text-muted);font-weight:600">MÓDULO ${m.n}</div>
            <div style="font-size:.85rem;font-weight:700;color:var(--text-primary)">${m.name}</div>
          </div>
        </div>
        <div style="font-size:.78rem;color:var(--text-secondary);line-height:1.6;margin-bottom:10px">${m.desc}</div>
        <div style="font-size:.68rem;color:${colorMap[m.color]};font-family:monospace;background:${colorMap[m.color]}11;padding:4px 10px;border-radius:4px">${m.tech}</div>
      </div>`).join('');

        return `
      <div class="info-box">
        <strong>Integración Horizontal:</strong> Los 10 módulos se comunican a través del bus de eventos Kafka.
        Cada módulo es un microservicio independiente con su propia base de datos (database-per-service pattern).
        Zero downtime deployments vía Kubernetes + Istio service mesh.
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px">${cards}</div>`;
    },

    renderRoadmap() {
        const phases = [
            {
                year: 'AÑO 1 — FUNDACIÓN', color: 'var(--blue)', icon: 'layers',
                subtitle: 'Q1–Q4 2026 · MVP Enterprise · Equipo: 40 ingenieros',
                items: [
                    { q: 'Q1', title: 'Kernel del ERP', desc: 'Core Kafka + microservicios base (Orders, Inventory, Finance). PostgreSQL + Redis. CI/CD con GitHub Actions + ArgoCD.' },
                    { q: 'Q2', title: 'Módulos Core', desc: 'CRM, RRHH, Compras, Contabilidad. REST API v1 + SDK TypeScript. Portal de onboarding para primeros 10 clientes piloto.' },
                    { q: 'Q3', title: 'Multi-Tenancy', desc: 'Aislamiento por namespace Kubernetes. Cifrado AES-256 por tenant. RBAC granular. SOC 2 Type II audit.' },
                    { q: 'Q4', title: 'Analytics & BI', desc: 'ClickHouse OLAP. Dashboards React + Chart.js. Exportación PDF/Excel. Primeras 50 empresas en producción.' },
                ],
                stack: 'Go (microservicios) · PostgreSQL · Redis · Kafka · React · Kubernetes · AWS EKS'
            },
            {
                year: 'AÑO 2 — INTELIGENCIA', color: 'var(--purple)', icon: 'brain',
                subtitle: 'Q1–Q4 2027 · AI/ML Layer · Equipo: 80 ingenieros',
                items: [
                    { q: 'Q1', title: 'IA Supply Chain', desc: 'Modelo LSTM en PyTorch para forecasting de demanda. Auto-PO generation. Integración con proveedores vía EDI.' },
                    { q: 'Q2', title: 'Gemelo Digital', desc: 'WebGL + Three.js para fábrica 3D. MQTT broker para sensores IoT. Alertas predictivas de mantenimiento.' },
                    { q: 'Q3', title: 'NLP & Sentiment', desc: 'RRHH con análisis de sentimiento (HuggingFace). Chatbot GPT-4 para consultas internas. Voice-to-data.' },
                    { q: 'Q4', title: 'Blockchain Finance', desc: 'Smart contracts Hyperledger para pagos B2B. Auditoría inmutable. Integración SWIFT GPI para pagos internacionales.' },
                ],
                stack: 'Python · PyTorch · HuggingFace · Three.js · Solidity · Hyperledger · MQTT'
            },
            {
                year: 'AÑO 3 — ECOSISTEMA GLOBAL', color: 'var(--green)', icon: 'globe',
                subtitle: 'Q1–Q4 2028 · Spatial Computing · Equipo: 150 ingenieros',
                items: [
                    { q: 'Q1', title: 'Spatial Computing UI', desc: 'Interface para Apple Vision Pro / Meta Quest. Holograma de supply chain 3D. Navegación por gestos.' },
                    { q: 'Q2', title: 'ERP Store', desc: 'Marketplace de apps de terceros. SDK público + GraphQL API v3. Revenue sharing 70/30. 100+ extensiones.' },
                    { q: 'Q3', title: 'Compliance Autónomo', desc: 'Motor de reglas multi-jurisdicción automatico. GDPR, SOX, IFRS 17, ISO 27001. Hasta 50 normativas.' },
                    { q: 'Q4', title: 'Rust Kernel', desc: 'Reescritura del core crítico en Rust para eliminar vulnerabilidades de memoria. Throughput: 5M msgs/s.' },
                ],
                stack: 'Rust (kernel crítico) · visionOS Swift · React Native · Drools · OpenTelemetry · eBPF'
            }
        ];

        const html = phases.map(p => `
      <div class="card animate-in" style="margin-bottom:16px;border-color:${p.color}22">
        <div class="card-header" style="padding-bottom:16px;border-bottom:1px solid var(--glass-border)">
          <div class="card-title" style="font-size:1rem">
            <i data-lucide="${p.icon}" style="width:18px;height:18px;color:${p.color}"></i>
            <span style="color:${p.color}">${p.year}</span>
          </div>
          <span style="font-size:.75rem;color:var(--text-muted)">${p.subtitle}</span>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:14px">
            ${p.items.map(i => `
              <div style="background:${p.color}08;border:1px solid ${p.color}22;border-radius:10px;padding:12px">
                <div style="font-size:.68rem;font-weight:700;color:${p.color};letter-spacing:.07em;margin-bottom:4px">${i.q}</div>
                <div style="font-size:.84rem;font-weight:700;color:var(--text-primary);margin-bottom:5px">${i.title}</div>
                <div style="font-size:.75rem;color:var(--text-muted);line-height:1.6">${i.desc}</div>
              </div>`).join('')}
          </div>
          <div style="font-size:.72rem;color:${p.color};font-family:monospace;background:${p.color}0d;padding:8px 14px;border-radius:6px">
            <strong>Tech Stack:</strong> ${p.stack}
          </div>
        </div>
      </div>`).join('');

        return `${html}`;
    },

    renderSecurity() {
        const pillars = [
            { icon: 'shield', color: 'var(--blue)', title: 'Zero Trust Architecture', desc: 'Nunca confía, siempre verifica. Cada microservicio requiere mTLS + JWT rotativo. Las peticiones internas también se autentican. Principio de mínimo privilegio aplicado a nivel de namespace Kubernetes con Istio.' },
            { icon: 'lock', color: 'var(--purple)', title: 'Cifrado Cuántico-Resistente', desc: 'Algoritmos post-cuánticos CRYSTALS-Kyber (NIST PQC 2024) para KEM y CRYSTALS-Dilithium para firmas digitales. Datos en reposo: AES-256-GCM. En tránsito: TLS 1.3 + HSTS. HSM (Hardware Security Module) para claves maestras.' },
            { icon: 'eye', color: 'var(--green)', title: 'Observabilidad Total', desc: 'OpenTelemetry para métricas, trazas y logs distribuidos. Grafana + Prometheus + Loki + Jaeger. Alertas PagerDuty con runbooks automáticos. MTTR objetivo: < 5 minutos.' },
            { icon: 'file-check', color: 'var(--amber)', title: 'Compliance Automático', desc: 'Motor Drools evalúa cada transacción contra GDPR, SOX, ISO 27001, ISO 9001, IFRS 17, PCI-DSS. Derecho al olvido ejecutado en < 72h (GDPR Art. 17). Logs de auditoría inmutables en S3 + Glacier (10 años).' },
            { icon: 'git-branch', color: 'var(--red)', title: 'Disaster Recovery', desc: 'RTO < 4 horas · RPO < 15 minutos. Multi-region activo-activo (EU-West, US-East, AP-Southeast). Database: PostgreSQL Patroni + pgBackup + WAL-G. Chaos Engineering con Chaos Monkey en staging.' },
            { icon: 'activity', color: 'var(--pink)', title: 'Detección de Amenazas con IA', desc: 'SIEM con ML detecta anomalías en tiempo real (falsos positivos < 1%). WAF + DDoS protection (Cloudflare Enterprise). SOAR automatiza respuesta a incidentes. Bug bounty program público.' },
        ];

        return `
      <div class="info-box">
        <strong>Principio rector:</strong> Seguridad-by-Design. No es una capa añadida, 
        es el tejido connective del sistema. Cada decisión de arquitectura se evalúa con un 
        <strong>Threat Model</strong> (STRIDE) antes de implementarse.
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px">
        ${pillars.map(p => `
          <div class="card" style="padding:18px">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <div style="width:38px;height:38px;border-radius:10px;background:${p.color}1a;display:flex;align-items:center;justify-content:center;color:${p.color};flex-shrink:0">
                <i data-lucide="${p.icon}" style="width:18px;height:18px"></i>
              </div>
              <div style="font-size:.88rem;font-weight:700;color:var(--text-primary)">${p.title}</div>
            </div>
            <div style="font-size:.78rem;color:var(--text-secondary);line-height:1.7">${p.desc}</div>
          </div>`).join('')}
      </div>`;
    },

    afterRender() {
        this.switchView('flow');
        if (window.lucide) lucide.createIcons();
    }
};
